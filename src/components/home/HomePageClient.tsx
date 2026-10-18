"use client";

import React, { useState, useEffect } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { AnimationProvider } from "@/context/AnimationContext";
import { ScrollProgressBar } from "@/components/animations/ScrollProgressBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
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
import { CallbackModal } from "@/components/modals/CallbackModal";
import { EmergencyMobileBar } from "@/components/layout/EmergencyMobileBar";

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
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [callbackPrefill, setCallbackPrefill] = useState<{ service?: string; notes?: string }>({});

  const handleOpenCallback = (prefill?: { service?: string; notes?: string }) => {
    setCallbackPrefill(prefill || {});
    setIsCallbackOpen(true);
  };

  // Ensure page always starts at top on fresh load if no URL hash is present
  useEffect(() => {
    if (typeof window !== "undefined" && !window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);
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
      <Header
        siteSettings={siteSettings}
        onOpenCallback={() => handleOpenCallback()}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* 1. Hero Section with Dynamic Slides & Contacts */}
        <HeroSection
          slides={heroSlides}
          siteSettings={siteSettings}
          onOpenCallback={handleOpenCallback}
        />

        {/* 2. Unified Ultra-Compact Services & About Us Section */}
        <ServicesSection
          categories={serviceCategories}
          scenarios={serviceScenarios}
          siteSettings={siteSettings}
          onOpenCallback={() => handleOpenCallback()}
        />

        {/* 3. Authentic Photo Gallery & Proof of Work (Recent Jobs - UNCHANGED) */}
        <GallerySection
          items={galleryItems}
          siteSettings={siteSettings}
          onOpenCallback={() => handleOpenCallback()}
        />

        {/* 4. Trust, Credibility & Security Proof (Google Reviews) */}
        <TrustAndProof testimonials={testimonials} />

        {/* 5. New Hampshire Service Area (Directory) */}
        <CoverageMap />
      </main>

      {/* Footer */}
      <Footer
        siteSettings={siteSettings}
        onOpenCallback={() => handleOpenCallback()}
      />

      {/* Floating Emergency Mobile Bottom Bar */}
      <EmergencyMobileBar onOpenCallback={() => handleOpenCallback()} />

      {/* Callback Request Modal */}
      <CallbackModal
        isOpen={isCallbackOpen}
        onClose={() => setIsCallbackOpen(false)}
        siteSettings={siteSettings}
        initialService={callbackPrefill.service}
        initialNotes={callbackPrefill.notes}
      />
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
