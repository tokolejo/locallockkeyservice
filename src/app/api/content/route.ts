import { NextResponse } from "next/server";
import {
  getHeroSlides,
  getGalleryItems,
  getSiteSettings,
  getServices,
  getServiceCategories,
  getServiceScenarios,
} from "@/lib/data/store";

export const revalidate = 300; // Cache on Vercel CDN for 5 minutes

export async function GET() {
  try {
    const [
      heroSlides,
      galleryItems,
      siteSettings,
      services,
      service_categories,
      service_scenarios,
    ] = await Promise.all([
      getHeroSlides(),
      getGalleryItems(),
      getSiteSettings(),
      getServices(),
      getServiceCategories(),
      getServiceScenarios(),
    ]);

    return NextResponse.json(
      {
        success: true,
        heroSlides,
        galleryItems,
        siteSettings,
        services,
        service_categories,
        service_scenarios,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
          "CDN-Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
          "Vercel-CDN-Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to load content" },
      { status: 500 }
    );
  }
}
