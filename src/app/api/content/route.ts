import { NextResponse } from "next/server";
import {
  getHeroSlides,
  getGalleryItems,
  getSiteSettings,
  getServices,
  getServiceCategories,
  getServiceScenarios,
} from "@/lib/data/store";

export const dynamic = "force-dynamic";

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

    return NextResponse.json({
      success: true,
      heroSlides,
      galleryItems,
      siteSettings,
      services,
      service_categories,
      service_scenarios,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to load content" },
      { status: 500 }
    );
  }
}
