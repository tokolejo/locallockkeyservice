"use client";

import React, { useState, useEffect } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { AnimationProvider } from "@/context/AnimationContext";
import { ScrollProgressBar } from "@/components/animations/ScrollProgressBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutUsSection } from "@/components/home/AboutUsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { GallerySection } from "@/components/home/GallerySection";
import { CoverageMap } from "@/components/home/CoverageMap";
import { TrustAndProof } from "@/components/home/TrustAndProof";
import {
  CoverageArea,
  Testimonial,
  HeroSlide,
  GalleryItem,
  SiteSettings,
  ServiceCategoryItem,
  ServiceScenarioItem,
} from "@/types/database.types";
import {
  initialCoverageAreas,
  initialTestimonials,
  initialHeroSlides,
  initialGalleryItems,
  initialSiteSettings,
} from "@/lib/data/mock-data";
import { FloatingWhatsApp } from "@/components/ui/WhatsAppButton";

export interface HomePageInitialData {
  coverageAreas: CoverageArea[];
  testimonials: Testimonial[];
  heroSlides: HeroSlide[];
  galleryItems: GalleryItem[];
  siteSettings: SiteSettings;
  serviceCategories: ServiceCategoryItem[];
  serviceScenarios: ServiceScenarioItem[];
}

function HomeContent({ initialData }: { initialData: HomePageInitialData }) {
  const [coverageAreas] = useState<CoverageArea[]>(
    initialData.coverageAreas?.length ? initialData.coverageAreas : initialCoverageAreas
  );
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    initialData.testimonials?.length ? initialData.testimonials : initialTestimonials
  );
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(
    initialData.heroSlides?.length ? initialData.heroSlides : initialHeroSlides
  );
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(
    initialData.galleryItems?.length ? initialData.galleryItems : initialGalleryItems
  );
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(
    initialData.siteSettings || initialSiteSettings
  );
  const [serviceCategories, setServiceCategories] = useState<ServiceCategoryItem[]>(
    initialData.serviceCategories || []
  );
  const [serviceScenarios, setServiceScenarios] = useState<ServiceScenarioItem[]>(
    initialData.serviceScenarios || []
  );

  // Background fallback ONLY if initial pre-rendered data was missing elements
  useEffect(() => {
    const needsContentFetch =
      !initialData.heroSlides?.length ||
      !initialData.galleryItems?.length ||
      !initialData.serviceCategories?.length;

    if (needsContentFetch) {
      fetch("/api/content")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            if (data.heroSlides?.length > 0) setHeroSlides(data.heroSlides);
            if (data.galleryItems?.length > 0) setGalleryItems(data.galleryItems);
            if (data.siteSettings) setSiteSettings(data.siteSettings);
            if (data.service_categories?.length > 0) setServiceCategories(data.service_categories);
            if (data.service_scenarios?.length > 0) setServiceScenarios(data.service_scenarios);
          }
        })
        .catch((err) => console.warn("Notice: Content fetch fallback active", err));
    }

    if (!initialData.testimonials?.length) {
      fetch("/api/reviews")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.reviews && data.reviews.length > 0) {
            setTestimonials(data.reviews);
          }
        })
        .catch((err) => console.warn("Notice: Review fetch fallback active", err));
    }
  }, [initialData]);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-800 flex flex-col font-sans selection:bg-emerald-600 selection:text-white relative">
      {/* Scroll Progress Bar at the top of the viewport */}
      <ScrollProgressBar />

      {/* Top Header */}
      <Header siteSettings={siteSettings} />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* 1. Hero Section with Dynamic Slides & Contacts */}
        <HeroSection slides={heroSlides} siteSettings={siteSettings} />

        {/* 2. Authentic About Us Section with Image Slider */}
        <AboutUsSection />

        {/* 3. Consolidated Services & Instant Direct Estimate Selection */}
        <ServicesSection
          categories={serviceCategories}
          scenarios={serviceScenarios}
          siteSettings={siteSettings}
        />

        {/* 4. Authentic Photo Gallery & Proof of Work with Cover Image selection */}
        <GallerySection items={galleryItems} siteSettings={siteSettings} />

        {/* 5. Streamlined Service Coverage with Instant Direct Call */}
        <CoverageMap coverageAreas={coverageAreas} />

        {/* 6. Trust, Credibility & Security Proof (ID Requirement, Reviews, FAQs) */}
        <TrustAndProof testimonials={testimonials} />
      </main>

      {/* Footer */}
      <Footer siteSettings={siteSettings} />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />
    </div>
  );
}

export function HomePageClient({ initialData }: { initialData: HomePageInitialData }) {
  return (
    <LanguageProvider>
      <AnimationProvider>
        <HomeContent initialData={initialData} />
      </AnimationProvider>
    </LanguageProvider>
  );
}
