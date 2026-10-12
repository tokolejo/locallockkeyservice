import {
  getHeroSlides,
  getGalleryItems,
  getSiteSettings,
  getServiceCategories,
  getServiceScenarios,
  getCoverageAreas,
  getAllTestimonials,
} from "@/lib/data/store";
import { HomePageClient } from "@/components/home/HomePageClient";

// Pre-render at build time (SSG) and cache on Vercel Edge CDN with ISR (5-minute window)
export const revalidate = 300;

export default async function HomePage() {
  const [
    heroSlides,
    galleryItems,
    siteSettings,
    serviceCategories,
    serviceScenarios,
    coverageAreas,
    testimonials,
  ] = await Promise.all([
    getHeroSlides(),
    getGalleryItems(),
    getSiteSettings(),
    getServiceCategories(),
    getServiceScenarios(),
    getCoverageAreas(),
    getAllTestimonials(),
  ]);

  return (
    <HomePageClient
      initialData={{
        heroSlides,
        galleryItems,
        siteSettings,
        serviceCategories,
        serviceScenarios,
        coverageAreas,
        testimonials,
      }}
    />
  );
}
