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
} from "@/types/database.types";
import {
  initialCoverageAreas,
  initialTestimonials,
  initialHeroSlides,
  initialGalleryItems,
  initialSiteSettings,
} from "@/lib/data/mock-data";
import { FloatingWhatsApp } from "@/components/ui/WhatsAppButton";

function HomeContent() {
  const [coverageAreas] = useState<CoverageArea[]>(initialCoverageAreas);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(initialHeroSlides);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGalleryItems);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);
  const [serviceCategories, setServiceCategories] = useState<any[]>([]);
  const [serviceScenarios, setServiceScenarios] = useState<any[]>([]);

  useEffect(() => {
    // 1. Fetch site content (slides, gallery items, settings, categories, scenarios)
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

    // 2. Fetch testimonials
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.reviews && data.reviews.length > 0) {
          setTestimonials(data.reviews);
        }
      })
      .catch((err) => console.warn("Notice: Review fetch fallback active", err));
  }, []);

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

export default function HomePage() {
  return (
    <LanguageProvider>
      <AnimationProvider>
        <HomeContent />
      </AnimationProvider>
    </LanguageProvider>
  );
}
