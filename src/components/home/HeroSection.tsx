"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  PhoneCall,
  ShieldCheck,
  Clock,
  Star,
  CheckCircle2,
  Car,
  KeyRound,
  Wrench,
  Sparkles,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { HeroSlide, SiteSettings } from "@/types/database.types";

interface HeroSectionProps {
  slides?: HeroSlide[];
  siteSettings?: SiteSettings;
  onOpenDispatchModal?: (prefill?: {
    category?: string;
    subType?: string;
  }) => void;
  onOpenMapPicker?: () => void;
  onOpenCallback?: () => void;
}

const HERO_SLIDES = [
  {
    src: "/gallery/lock-repair-door.jpg",
    title: "Residential Locksmith",
    badge: "Residential Locksmith",
    location: "Manchester & Surrounding NH",
  },
  {
    src: "/gallery/technician-work-1.jpg",
    title: "Commercial Locksmith",
    badge: "Commercial Locksmith",
    location: "Manchester & Surrounding NH",
  },
  {
    src: "/gallery/toyota-car-key.jpg",
    title: "Car/Truck Locksmith",
    badge: "Car/Truck Locksmith",
    location: "Manchester & Surrounding NH",
  },
  {
    src: "/gallery/hero-banner.png",
    title: "Emergency Locksmith",
    badge: "Emergency Locksmith",
    location: "Manchester & Surrounding NH",
  },
  {
    src: "/gallery/key-cutting-machine.jpg",
    title: "Safe Locksmith",
    badge: "Safe Locksmith",
    location: "Manchester & Surrounding NH",
  },
];

const POPULAR_CAR_MAKES = [
  { name: "Ford", badge: "Key Code Cutting", sub: "F-150, Explorer+" },
  { name: "Chevrolet", badge: "Trunk & Door Lockout", sub: "Silverado, Malibu+" },
  { name: "GMC", badge: "Damage-Free Entry", sub: "Sierra, Yukon+" },
  { name: "Dodge", badge: "Key Fob Replacement", sub: "Charger, Challenger+" },
  { name: "Jeep", badge: "Roadside Rescue", sub: "Grand Cherokee, Wrangler+" },
  { name: "RAM", badge: "Truck Keyless & Lockout", sub: "1500, 2500+" },
  { name: "Toyota", badge: "Keys in Trunk / Lockout", sub: "Camry, RAV4, Tacoma+" },
  { name: "Honda", badge: "Damage-Free Opening", sub: "Civic, Accord, CR-V+" },
  { name: "Nissan", badge: "Intelligent Key", sub: "Rogue, Altima, Pathfinder+" },
  { name: "Subaru", badge: "Laser Cut & Immo", sub: "Outback, Forester, Crosstrek+" },
  { name: "Lexus", badge: "Proximity Smart Remote", sub: "RX, ES, GX+" },
  { name: "Hyundai", badge: "Push-Start & Fob", sub: "Elantra, Tucson, Santa Fe+" },
  { name: "Kia", badge: "Transponder & Key Fob", sub: "Sportage, Forte, Telluride+" },
];

export function HeroSection({
  slides,
  siteSettings,
  onOpenDispatchModal,
  onOpenCallback,
}: HeroSectionProps) {
  const { t } = useLanguage();

  const phoneDisplay = siteSettings?.phone_display || process.env.NEXT_PUBLIC_DISPATCH_PHONE || "+1 (603) 290-5554";
  const phoneRaw = siteSettings?.phone_raw || process.env.NEXT_PUBLIC_DISPATCH_PHONE_RAW || "tel:+16032905554";

  const activeSlides = (slides && slides.length > 0
    ? slides.filter((s) => s.is_active).map((s) => ({
        src: s.image_url,
        title: s.title,
        badge: s.badge,
        location: s.location,
      }))
    : []).length > 0
      ? slides!.filter((s) => s.is_active).map((s) => ({
          src: s.image_url,
          title: s.title,
          badge: s.badge,
          location: s.location,
        }))
      : HERO_SLIDES;

  const [selectedMake, setSelectedMake] = useState<string | null>(null);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  // Auto-play slider every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % activeSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const handlePrevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNextHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % activeSlides.length);
  };

  return (
    <section className="relative overflow-hidden bg-[#faf9f6] text-slate-800 pt-5 pb-8 sm:pt-9 sm:pb-16 lg:pt-10 lg:pb-20 border-b border-slate-200">
      {/* Subtle modern background grid & dot texture */}
      <div className="absolute inset-0 bg-hero-dots opacity-40 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]" />

      {/* Layered ambient lighting glow */}
      <div className="absolute -top-24 right-1/4 w-[520px] h-[520px] bg-emerald-200/35 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-16 -left-20 w-[460px] h-[460px] bg-amber-100/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-teal-100/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Prominent Centered Brand Header directly below the menu */}
        <div className="mb-6 sm:mb-8 md:mb-10 flex items-center justify-center text-center w-full">
          <div className="inline-flex items-center justify-center gap-2.5 sm:gap-3.5 px-5 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-slate-950 border border-emerald-500/40 text-white shadow-xl shadow-slate-950/20 max-w-full">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400 animate-pulse shrink-0 shadow-xs" />
            <span className="text-sm sm:text-lg md:text-xl lg:text-2xl font-black tracking-wide uppercase text-white leading-tight">
              LOCAL LOCK &amp; KEY SERVICE • 24/7 Mobile Service
            </span>
          </div>
        </div>

        {/* Main Content Grid: Texts on Left, Slider on Right (Top-aligned in the same horizontal plane!) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Headline, Description & ONLY Call + Callback CTAs */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <ScrollReveal direction="up">
              <div className="space-y-4 sm:space-y-5">
                {/* Primary Headline with Harmonized Hierarchy */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.75rem] font-black tracking-tight text-slate-950 leading-[1.12]">
                  <span className="block">{t("hero_title_1")}</span>
                  <span className="block text-2xl sm:text-3xl md:text-4xl text-emerald-700 font-extrabold tracking-tight mt-1.5 mb-1">
                    {t("hero_title_2")}
                  </span>
                  <span className="block text-xl sm:text-2xl md:text-3xl text-slate-700 font-bold tracking-tight">
                    {t("hero_title_3")}
                  </span>
                </h1>

                {/* New Hampshire Service Areas Overview & Anchor */}
                <div className="space-y-2">
                  <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed font-normal">
                    <strong className="font-extrabold text-slate-950">New Hampshire Service Areas:</strong> Serving Greater Manchester, Nashua, Concord, Salem, Derry, Laconia &amp; 45+ surrounding communities across Southern &amp; Central NH. Fast, reliable 24/7 mobile locksmith service with 100% damage-free entry guarantee.
                  </p>
                  <div>
                    <a
                      href="#coverage"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-900 transition cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>View All 50+ Communities We Serve ↓</span>
                    </a>
                  </div>
                </div>

                {/* High-Impact Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  {/* 1. Primary Urgent Call CTA */}
                  <a
                    href={phoneRaw}
                    className="relative overflow-hidden group flex items-center justify-center gap-2.5 bg-slate-950 hover:bg-black text-white px-9 py-4 rounded-2xl font-black text-base tracking-wide shadow-xl shadow-slate-900/25 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] border border-slate-800"
                  >
                    <PhoneCall className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform duration-200 shrink-0" />
                    <span>{phoneDisplay}</span>
                  </a>

                  {/* 2. Secondary Request Callback CTA */}
                  <button
                    type="button"
                    onClick={onOpenCallback}
                    className="flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white px-8 py-4 rounded-2xl font-bold text-base tracking-wide shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer border border-emerald-500/40"
                  >
                    <Clock className="w-5 h-5 text-emerald-100 shrink-0" />
                    <span>Request a Callback</span>
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Clean Interactive Real-Work 5-Service Image Slider */}
          <div className="lg:col-span-5">
            <ScrollReveal direction="up" delay={0.15}>
              <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl bg-slate-900 group">
                {/* Active Slide Image Container */}
                <div className="relative aspect-4/3 sm:aspect-16/11 w-full bg-slate-950 overflow-hidden">
                  {/* Clean Background Images Crossfade */}
                  {activeSlides.map((slide, index) => (
                    <div
                      key={`${slide.src}-${index}`}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        index === currentHeroSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                      }`}
                    >
                      <Image
                        src={slide.src}
                        alt={slide.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover"
                        priority={index === 0}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    </div>
                  ))}

                  {/* Center/Bottom Highlighted Service Title (Clean, no corner badges) */}
                  <div className="absolute inset-x-0 bottom-7 sm:bottom-9 z-20 px-6 text-center pointer-events-none">
                    <h3
                      key={`title-${currentHeroSlide}`}
                      className="font-black text-xl sm:text-2xl md:text-3xl text-white drop-shadow-xl tracking-tight leading-tight"
                    >
                      {activeSlides[currentHeroSlide]?.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-300 font-bold tracking-wide mt-1.5 drop-shadow-md">
                      24/7 Mobile Service • Manchester &amp; Surrounding NH
                    </p>
                  </div>

                  {/* Slider Prev / Next Controls */}
                  <button
                    onClick={handlePrevHeroSlide}
                    aria-label="Previous slide"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-sm hover:scale-105 active:scale-95"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextHeroSlide}
                    aria-label="Next slide"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-sm hover:scale-105 active:scale-95"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Clean Slider Dots inside card */}
                  <div className="absolute bottom-2.5 inset-x-0 z-20 flex items-center justify-center gap-1.5 pointer-events-auto">
                    {activeSlides.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => setCurrentHeroSlide(dotIdx)}
                        aria-label={`Go to slide ${dotIdx + 1}`}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          dotIdx === currentHeroSlide
                            ? "w-6 bg-emerald-400 shadow-xs"
                            : "w-2 bg-white/60 hover:bg-white"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Popular Vehicle Brands Continuous Marquee Slider */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="mt-8 sm:mt-12 pt-6 border-t border-slate-200/90 w-full max-w-full overflow-hidden">
            <div className="flex items-center justify-between mb-3 px-1">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Car className="w-4 h-4 text-emerald-700" />
                  <span>{t("hero_brands_title")}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
                  {t("hero_brands_sub")}
                </p>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                100% Non-Destructive
              </span>
            </div>

            {/* Continuous Marquee Track on a single line */}
            <div className="relative w-full max-w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)] py-1">
              <div className="animate-marquee flex items-center gap-2.5">
                {[...POPULAR_CAR_MAKES, ...POPULAR_CAR_MAKES].map((car, idx) => (
                  <button
                    key={`${car.name}-${idx}`}
                    type="button"
                    onClick={() => {
                      if (onOpenDispatchModal) {
                        onOpenDispatchModal({
                          category: "automotive",
                          subType: `Car Lockout - ${car.name}`,
                        });
                      }
                    }}
                    className="group/brand inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 text-slate-800 hover:text-emerald-950 shadow-2xs hover:shadow-xs transition cursor-pointer shrink-0"
                  >
                    <Car className="w-3.5 h-3.5 text-slate-400 group-hover/brand:text-emerald-700 transition-colors shrink-0" />
                    <span className="text-xs font-bold tracking-tight text-slate-900 group-hover/brand:text-emerald-950">
                      {car.name}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 group-hover/brand:bg-emerald-100 px-1.5 py-0.5 rounded-md transition-colors shrink-0">
                      {car.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
