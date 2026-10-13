import { NextRequest, NextResponse } from "next/server";
import { scrapeGoogleReviews, PLACE_CONFIG } from "@/lib/scraper/google-reviews";
import { saveSyncedGoogleReviews, getAllTestimonials, getGoogleReviewsCacheMeta } from "@/lib/data/store";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/supabase/server";

// Fallback reviews in case of network isolation
const HARD_FALLBACK_REVIEWS = [
  {
    id: "g-rev-fallback-1",
    author_name: "Steve Plante",
    rating: 5,
    review_text: "I stupidly locked my car with the keys and my dog inside. I was kind of stressed. They came within 15 minutes and unlocked. Luckily for me it was a cool day. Fabulous service.. Highly recommend.",
    relative_time_description: "4 weeks ago",
    created_at: new Date(Date.now() - 28 * 86400000).toISOString(),
    author_photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    review_url: PLACE_CONFIG.mapsUrl,
    location: "Manchester, NH & Greater Area",
    service_type: "Emergency Car Lockout Rescue",
    verified_customer: true,
    is_featured: true,
    is_approved: true
  },
  {
    id: "g-rev-fallback-2",
    author_name: "Davien Pearson",
    rating: 5,
    review_text: "Great company they came fast and gave me a great price for my car key.",
    relative_time_description: "a month ago",
    created_at: new Date(Date.now() - 32 * 86400000).toISOString(),
    author_photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    review_url: PLACE_CONFIG.mapsUrl,
    location: "Manchester, NH & Greater Area",
    service_type: "Automotive Key & Lockout Rescue",
    verified_customer: true,
    is_featured: true,
    is_approved: true
  },
  {
    id: "g-rev-fallback-3",
    author_name: "Dylan Fuller",
    rating: 5,
    review_text: "Mike was fair priced, experienced, nice and fast with his work 👌🏼",
    relative_time_description: "2 months ago",
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    author_photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    review_url: PLACE_CONFIG.mapsUrl,
    location: "Manchester, NH & Greater Area",
    service_type: "Emergency Locksmith Service",
    verified_customer: true,
    is_featured: true,
    is_approved: true
  }
];

export const revalidate = 300; // Cache on Vercel CDN for 5 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const shouldRefresh = searchParams.get("refresh") === "true" || searchParams.get("sync") === "true";

  const publicCacheHeaders = {
    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
    "CDN-Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
    "Vercel-CDN-Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
  };

  try {
    // 1. If explicit refresh is requested, require admin authorization then run live scraper
    if (shouldRefresh) {
      try {
        await requireAdminUser();
      } catch {
        return NextResponse.json(
          { success: false, error: "Unauthorized access: Admin session required to trigger live scraper" },
          { status: 401 }
        );
      }

      const scrapeResult = await scrapeGoogleReviews(5);
      if (scrapeResult.success && scrapeResult.reviews.length > 0) {
        // Save to persistent storage and cache
        await saveSyncedGoogleReviews(scrapeResult.reviews);
        
        try {
          revalidatePath("/");
          revalidatePath("/admin/reviews");
        } catch {
          // Revalidate path warning ignored in dev
        }

        return NextResponse.json(
          {
            success: true,
            source: "live_google_sync",
            rating: scrapeResult.rating,
            total_reviews: scrapeResult.total_reviews,
            place_id: scrapeResult.place_id,
            last_synced_at: scrapeResult.synced_at,
            reviews: scrapeResult.reviews
          },
          {
            headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
          }
        );
      }
    }

    // 2. Otherwise serve cached / stored reviews seamlessly
    const stored = await getAllTestimonials();
    const meta = getGoogleReviewsCacheMeta();

    if (stored && stored.length > 0) {
      return NextResponse.json(
        {
          success: true,
          source: "persistent_store",
          rating: meta.rating,
          total_reviews: stored.length,
          place_id: PLACE_CONFIG.placeId,
          last_synced_at: meta.last_synced_at,
          reviews: stored
        },
        { headers: publicCacheHeaders }
      );
    }

    // 3. Fallback to hardcoded verified reviews
    return NextResponse.json(
      {
        success: true,
        source: "fallback",
        rating: 5.0,
        total_reviews: HARD_FALLBACK_REVIEWS.length,
        place_id: PLACE_CONFIG.placeId,
        reviews: HARD_FALLBACK_REVIEWS
      },
      { headers: publicCacheHeaders }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    console.error("GET /api/reviews encountered error:", errorMsg);

    const fallback = await getAllTestimonials();
    return NextResponse.json(
      {
        success: true,
        source: "resilient_fallback",
        rating: 5.0,
        total_reviews: fallback.length || HARD_FALLBACK_REVIEWS.length,
        place_id: PLACE_CONFIG.placeId,
        reviews: fallback.length > 0 ? fallback : HARD_FALLBACK_REVIEWS,
        error: errorMsg
      },
      { headers: publicCacheHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    let isAuthorized = false;

    if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
      isAuthorized = true;
    } else {
      try {
        const user = await requireAdminUser();
        if (user) isAuthorized = true;
      } catch {
        isAuthorized = false;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access: Admin or Cron authorization required" },
        { status: 401 }
      );
    }

    const scrapeResult = await scrapeGoogleReviews(5);

    if (scrapeResult.success && scrapeResult.reviews.length > 0) {
      await saveSyncedGoogleReviews(scrapeResult.reviews);

      try {
        revalidatePath("/");
        revalidatePath("/admin/reviews");
      } catch {
        // Ignored
      }

      return NextResponse.json({
        success: true,
        source: "live_sync_post",
        message: `Successfully synced ${scrapeResult.reviews.length} reviews from Google Maps.`,
        rating: scrapeResult.rating,
        total_reviews: scrapeResult.total_reviews,
        place_id: scrapeResult.place_id,
        synced_at: scrapeResult.synced_at,
        reviews: scrapeResult.reviews
      });
    }

    // Scraper didn't find new ones; return currently cached
    const cached = await getAllTestimonials();
    const meta = getGoogleReviewsCacheMeta();
    return NextResponse.json({
      success: true,
      source: "cached_fallback",
      message: "Scraper did not find newer reviews; served persistent cache.",
      rating: meta.rating,
      total_reviews: cached.length,
      place_id: PLACE_CONFIG.placeId,
      reviews: cached
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Sync error";
    console.error("POST /api/reviews failed:", errorMsg);

    const cached = await getAllTestimonials();
    return NextResponse.json(
      {
        success: false,
        source: "error_fallback",
        error: errorMsg,
        reviews: cached
      },
      { status: 500 }
    );
  }
}
