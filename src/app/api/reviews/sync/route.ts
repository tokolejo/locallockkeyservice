import { NextRequest, NextResponse } from "next/server";
import { scrapeGoogleReviews, PLACE_CONFIG } from "@/lib/scraper/google-reviews";
import { saveSyncedGoogleReviews, getAllTestimonials, getGoogleReviewsCacheMeta } from "@/lib/data/store";
import { revalidatePath } from "next/cache";

/**
 * Handle manual or cron sync requests for Google Maps reviews
 */
async function handleSync(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Optional cron secret verification if CRON_SECRET is configured
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      const url = new URL(request.url);
      const queryToken = url.searchParams.get("token");
      if (queryToken !== cronSecret) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
    }

    // Trigger full multi-page BOQ scrape (up to 5 pages = up to 50 reviews)
    const result = await scrapeGoogleReviews(5);

    if (result.success && result.reviews.length > 0) {
      await saveSyncedGoogleReviews(result.reviews);

      try {
        revalidatePath("/");
        revalidatePath("/admin/reviews");
      } catch {
        // Dev server revalidate warning ignored
      }

      const durationMs = Date.now() - startTime;

      return NextResponse.json({
        success: true,
        source: result.source,
        message: `Synced ${result.reviews.length} reviews from Google Maps in ${durationMs}ms`,
        rating: result.rating,
        total_reviews: result.total_reviews,
        place_id: result.place_id,
        cid: PLACE_CONFIG.cid,
        maps_url: PLACE_CONFIG.mapsUrl,
        synced_at: result.synced_at,
        duration_ms: durationMs,
        reviews_count: result.reviews.length
      });
    }

    // Fallback if Google returned no reviews during this run
    const cached = await getAllTestimonials();
    const meta = getGoogleReviewsCacheMeta();

    return NextResponse.json({
      success: true,
      source: "cached_fallback",
      message: "Scraper did not extract newer items. Retained cached reviews.",
      rating: meta.rating,
      total_reviews: cached.length,
      place_id: PLACE_CONFIG.placeId,
      last_synced_at: meta.last_synced_at,
      duration_ms: Date.now() - startTime
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Sync failure";
    console.error("Reviews sync endpoint error:", errorMsg);

    const cached = await getAllTestimonials();
    return NextResponse.json({
      success: false,
      source: "resilient_error_catch",
      error: errorMsg,
      total_cached_reviews: cached.length,
      duration_ms: Date.now() - startTime
    }, { status: 200 }); // Return 200 with error info so cron/client caller doesn't fail
  }
}

export async function GET(request: NextRequest) {
  return handleSync(request);
}

export async function POST(request: NextRequest) {
  return handleSync(request);
}
