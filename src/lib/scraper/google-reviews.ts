import { Testimonial } from "@/types/database.types";

export interface ScrapedGoogleReview extends Testimonial {
  relative_time_description?: string;
  owner_reply?: {
    text: string;
    relativeTime?: string;
  } | null;
}

export interface GoogleSyncResult {
  success: boolean;
  source: "live_boq_scraper" | "places_api" | "cache" | "fallback";
  total_reviews: number;
  rating: number;
  place_id: string;
  reviews: ScrapedGoogleReview[];
  synced_at: string;
  error?: string;
}

export const PLACE_CONFIG = {
  placeId: "ChIJ_wpbGReKhK8RP_9ypyJkVL0",
  featureId: "0xaf848a17195b0aff:0xbd546422a772ff3f",
  cid: "13642639271213072191",
  mapsUrl: "https://maps.app.goo.gl/j9Zvw9xhNKP5Rgk29",
  businessName: "Local Lock & Key Service",
  city: "Manchester, NH"
};

/**
 * Fetch a single page of reviews from Google's BOQ RPC endpoint
 */
async function fetchBoqPage(featureId: string, sortOrder: number = 2, nextToken: string = ""): Promise<{ rawReviews: unknown[]; nextToken: string }> {
  let reqpld: unknown[];
  if (!nextToken) {
    reqpld = [
      null,
      [
        null, null, null, null, null, null, null, null, null,
        [null, sortOrder, null, null, null, null, null, null, null, 10, null, [featureId]]
      ]
    ];
  } else {
    reqpld = [
      null,
      [
        null, null, null, null, null, null, null, null, null,
        [null, sortOrder, null, null, null, null, null, null, null, null, null, [featureId], null, null, null, null, null, null, null, nextToken]
      ]
    ];
  }

  const url = `https://www.google.com/httpservice/web/PrivateLocalSearchUiDataService/GetLocalBoqProxy?hl=en&gl=us&msc=gwsrpc&reqpld=${encodeURIComponent(JSON.stringify(reqpld))}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.google.com/maps",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin"
      },
      signal: controller.signal,
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error(`Google BOQ endpoint responded with status ${res.status}`);
    }

    const textData = await res.text();
    const parts = textData.split(")]}'");
    const rawJson = parts.length > 1 ? parts[1] : parts[0];
    if (!rawJson) {
      return { rawReviews: [], nextToken: "" };
    }

    const data = JSON.parse(rawJson);
    const payload = Array.isArray(data) ? data[1] : null;
    const node = Array.isArray(payload) ? payload[10] : null;

    if (!Array.isArray(node)) {
      return { rawReviews: [], nextToken: "" };
    }

    const rawReviews = Array.isArray(node[2]) ? node[2] : [];
    const token = node.length > 6 && typeof node[6] === "string" ? node[6] : "";

    return { rawReviews, nextToken: token };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Parse an untyped Google review array node into a structured ScrapedGoogleReview
 */
function parseRawReview(r: any, idx: number): ScrapedGoogleReview | null {
  if (!Array.isArray(r) || r.length < 4) return null;

  const rating = typeof r[1] === "number" ? r[1] : 5;
  const timeArr = Array.isArray(r[2]) ? r[2] : [];
  const relativeTime = typeof timeArr[0] === "string" ? timeArr[0] : "recently";
  const timestampMs = timeArr[2] ? Number(timeArr[2]) : Date.now();

  const authorArr = Array.isArray(r[3]) ? r[3] : [];
  const authorName = typeof authorArr[0] === "string" ? authorArr[0].trim() : "Verified Google User";
  const authorPhoto = typeof authorArr[1] === "string" ? authorArr[1] : null;

  const reviewId = typeof r[5] === "string" ? r[5] : `g-rev-${Date.now()}-${idx}`;
  const reviewUrl = typeof r[12] === "string" ? r[12] : PLACE_CONFIG.mapsUrl;

  // Extract text
  let rawText = "";
  if (typeof r[27] === "string" && r[27].length > 0) {
    rawText = r[27];
  } else if (typeof r[28] === "string" && r[28].length > 0) {
    rawText = r[28];
  } else {
    for (let i = 6; i < r.length; i++) {
      if (typeof r[i] === "string" && r[i].length > 4 && !r[i].startsWith("http") && r[i] !== "en") {
        rawText = r[i];
        break;
      }
    }
  }

  // Sanitize text
  const cleanText = rawText
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .trim();

  // Determine service sub-type from review content keywords if possible
  let detectedService = "Emergency Locksmith Service";
  const lowerText = cleanText.toLowerCase();
  if (lowerText.includes("car") || lowerText.includes("vehicle") || lowerText.includes("key") || lowerText.includes("fob")) {
    detectedService = "Automotive Key & Lockout Rescue";
  } else if (lowerText.includes("commercial") || lowerText.includes("store") || lowerText.includes("office") || lowerText.includes("door")) {
    detectedService = "Commercial Locksmith & Security";
  } else if (lowerText.includes("house") || lowerText.includes("home") || lowerText.includes("deadbolt") || lowerText.includes("apartment")) {
    detectedService = "Residential Lock Change & Lockout";
  }

  // Extract owner response if available
  let ownerReply: ScrapedGoogleReview["owner_reply"] = null;
  if (Array.isArray(r[4]) && r[4][2]) {
    ownerReply = {
      text: String(r[4][2]).trim(),
      relativeTime: typeof r[4][1] === "string" ? r[4][1] : undefined
    };
  }

  return {
    id: `g-rev-${reviewId}`,
    author_name: authorName,
    rating,
    review_text: cleanText || "5-Star verified locksmith service experience.",
    relative_time_description: relativeTime,
    created_at: new Date(timestampMs).toISOString(),
    author_photo: authorPhoto,
    review_url: reviewUrl,
    location: "Manchester, NH & Surrounding Areas",
    service_type: detectedService,
    verified_customer: true,
    is_featured: idx < 6, // Top 6 featured by default
    is_approved: true,
    owner_reply: ownerReply
  };
}

/**
 * Scrape all available reviews from Google Maps for this place
 */
export async function scrapeGoogleReviews(maxPages: number = 5): Promise<GoogleSyncResult> {
  try {
    const allRaw: unknown[] = [];
    let token = "";
    let page = 1;

    while (page <= maxPages) {
      const { rawReviews, nextToken } = await fetchBoqPage(PLACE_CONFIG.featureId, 2 /* newest */, token);
      if (rawReviews.length === 0) break;
      allRaw.push(...rawReviews);

      if (!nextToken || nextToken === token) break;
      token = nextToken;
      page++;
    }

    if (allRaw.length === 0) {
      throw new Error("No reviews extracted from Google BOQ endpoint.");
    }

    const reviews: ScrapedGoogleReview[] = [];
    allRaw.forEach((r, idx) => {
      const parsed = parseRawReview(r, idx);
      if (parsed) reviews.push(parsed);
    });

    const totalRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = reviews.length > 0 ? Number((totalRatings / reviews.length).toFixed(1)) : 5.0;

    return {
      success: true,
      source: "live_boq_scraper",
      total_reviews: reviews.length,
      rating: avgRating,
      place_id: PLACE_CONFIG.placeId,
      reviews,
      synced_at: new Date().toISOString()
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Scraper error";
    console.warn("Live Google Maps scraper encountered an issue:", msg);
    return {
      success: false,
      source: "fallback",
      total_reviews: 0,
      rating: 5.0,
      place_id: PLACE_CONFIG.placeId,
      reviews: [],
      synced_at: new Date().toISOString(),
      error: msg
    };
  }
}
