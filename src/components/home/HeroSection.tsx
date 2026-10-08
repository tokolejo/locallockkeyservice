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
  MessageCircle,
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
}

const HERO_SLIDES = [
  {
    src: "/gallery/hero-banner.png",
    title: "24/7 Mobile Locksmith Service",
    badge: "Active Mobile Fleet",
    location: "Manchester, NH",
  },
  {
    src: "/gallery/lock-repair-door.jpg",
    title: "High-Security Deadbolts & Hardware",
    badge: "Residential Entry",
    location: "Manchester, NH",
  },
  {
    src: "/gallery/toyota-car-key.jpg",
    title: "Smart Key & Proximity Fobs",
    badge: "Automotive Rescue",
    location: "Bedford, NH",
  },
  {
    src: "/gallery/technician-work-1.jpg",
    title: "Commercial Mortise & Lock Upgrades",
    badge: "100% Damage-Free",
    location: "Concord, NH",
  },
  {
    src: "/gallery/key-cutting-machine.jpg",
    title: "Computerized Laser Key Cutting",
    badge: "Mobile Equipment",
    location: "Manchester, NH",
  },
  {
    src: "/gallery/van-work.jpg",
    title: "15–20 Min Rapid Mobile Units",
    badge: "Manchester & Surrounding NH",
    location: "Nashua, NH",
  },
];

const POPULAR_CAR_MAKES = [
  { name: "BMW", badge: "Smart Key & Fob", sub: "All Series" },
  { name: "Mercedes-Benz", badge: "Laser Cut & EIS", sub: "All Classes" },
  { name: "Audi", badge: "Keyless / Transponder", sub: "A/Q/S Models" },
  { name: "Toyota", badge: "Keys in Trunk / Lockout", sub: "Camry, RAV4+" },
  { name: "Honda", badge: "Damage-Free Opening", badgeStyle: "emerald", sub: "Civic, Accord+" },
  { name: "Ford", badge: "Key Code Cutting", sub: "F-150, Explorer+" },
  { name: "Lexus", badge: "Proximity Smart Remote", sub: "RX, ES, IS+" },
  { name: "Jeep", badge: "Roadside Rescue", sub: "Grand Cherokee+" },
  { name: "Nissan", badge: "Intelligent Key", sub: "Rogue, Altima+" },
  { name: "Porsche", badge: "High-Security Entry", sub: "Cayenne, 911+" },
  { name: "Hyundai", badge: "Push-Start & Fob", sub: "Elantra, Tucson+" },
  { name: "Subaru", badge: "Laser Cut & Immo", sub: "Outback, Forester+" },
  { name: "Chevrolet", badge: "Trunk & Door Lockout", sub: "Silverado, Malibu+" },
  { name: "Tesla", badge: "Emergency 12V / Entry", sub: "Model 3/Y/S/X" },
  { name: "Dodge", badge: "Key Fob Replacement", sub: "Charger, RAM+" },
  { name: "Volkswagen", badge: "Flip Key & Coding", sub: "Jetta, Golf, Atlas+" },
];

export function HeroSection({ slides, siteSettings, onOpenDispatchModal }: HeroSectionProps) {
  const { t } = useLanguage();

  const phoneDisplay = siteSettings?.phone_display || process.env.NEXT_PUBLIC_DISPATCH_PHONE || "+1 (603) 290-5554";
  const phoneRaw = siteSettings?.phone_raw || process.env.NEXT_PUBLIC_DISPATCH_PHONE_RAW || "tel:+16032905554";
  const rawWa = siteSettings?.whatsapp_number?.replace(/[^0-9]/g, "") || "16032905554";
  const whatsappUrl = `https://wa.me/${rawWa}?text=Hello%2C%20I%20need%20locksmith%20service%20(Local%20Lock%20%26%20Key%20Service)`;

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
    <section className="relative overflow-hidden bg-[#faf9f6] text-slate-800 pt-6 pb-8 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20 border-b border-slate-200">
      {/* Subtle modern background grid & dot texture */}
      <div className="absolute inset-0 bg-hero-dots opacity-40 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]" />

      {/* Layered ambient lighting glow */}
      <div className="absolute -top-24 right-1/4 w-[520px] h-[520px] bg-emerald-200/35 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-16 -left-20 w-[460px] h-[460px] bg-amber-100/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-teal-100/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline, Description & ONLY Call + WhatsApp CTAs */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <ScrollReveal direction="up">
              <div className="space-y-4 sm:space-y-5">
                {/* Live Trust & Service Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{t("hero_badge")}</span>
                </div>

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

                {/* Subheadline with exact services */}
                <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
                  {t("hero_desc")}
                </p>

                {/* High-Impact Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  {/* 1. Primary Urgent Call CTA */}
                  <a
                    href={phoneRaw}
                    className="relative overflow-hidden group flex items-center justify-center gap-2.5 bg-slate-950 hover:bg-black text-white px-9 py-4 rounded-2xl font-black text-base tracking-wide shadow-xl shadow-slate-900/25 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] border border-slate-800"
                  >
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <PhoneCall className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform duration-200 shrink-0" />
                    <span>CALL</span>
                  </a>

                  {/* 2. Secondary WhatsApp CTA */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-base tracking-wide shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 fill-white text-white shrink-0" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* 3 Unified Trust Metric Cards */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-5 sm:pt-6 border-t border-slate-200/90">
                  <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-emerald-700 mb-1.5">
                      <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
                        Entry
                      </span>
                    </div>
                    <div className="text-sm sm:text-base md:text-lg font-black text-slate-900 leading-tight">
                      {t("hero_stat_1_title")}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 hidden sm:block leading-snug">
                      {t("hero_stat_1_sub")}
                    </p>
                  </div>

                  <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-emerald-700 mb-1.5">
                      <Clock className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
                        Arrival
                      </span>
                    </div>
                    <div className="text-sm sm:text-base md:text-lg font-black text-slate-900 leading-tight">
                      {t("hero_stat_2_title")}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 hidden sm:block leading-snug">
                      {t("hero_stat_2_sub")}
                    </p>
                  </div>

                  <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-emerald-700 mb-1.5">
                      <Star className="w-4 h-4 fill-emerald-600 text-emerald-600 shrink-0" />
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
                        Rating
                      </span>
                    </div>
                    <div className="text-sm sm:text-base md:text-lg font-black text-slate-900 leading-tight">
                      {t("hero_stat_3_title")}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 hidden sm:block leading-snug">
                      {t("hero_stat_3_sub")}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Interactive Real-Work Image Slider Showcase */}
          <div className="lg:col-span-5">
            <ScrollReveal direction="up" delay={0.15}>
              <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl bg-slate-900 group">
                {/* Active Slide Image Container */}
                <div className="relative aspect-4/3 sm:aspect-16/11 w-full bg-slate-950 overflow-hidden">
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

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                        <div className="px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/20 text-white flex items-center gap-2 text-xs font-bold shadow-lg">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                          <span>{slide.badge}</span>
                        </div>
                        <div className="px-2.5 py-1 rounded-lg bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 font-bold text-xs">
                          {slide.location}
                        </div>
                      </div>

                      {/* Bottom Caption */}
                      <div className="absolute bottom-5 left-5 right-5 text-white space-y-2">
                        <h4 className="font-extrabold text-base sm:text-lg leading-snug drop-shadow-md">
                          {slide.title}
                        </h4>
                        <div className="flex items-center justify-between pt-1 text-xs text-slate-300">
                          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Active Dispatch Unit
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {index + 1} / {activeSlides.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

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
                </div>

                {/* Sub-card feature list & Dots (NO Hotline / Call button) */}
                <div className="p-4 sm:p-5 bg-white space-y-3.5">
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 font-semibold">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Car & Trunk Lockouts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Smart Fob Programming</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>House Deadbolts & Rekey</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Storefront & Panic Bars</span>
                    </div>
                  </div>

                  {/* Slider Dots */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5">
                    {activeSlides.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => setCurrentHeroSlide(dotIdx)}
                        aria-label={`Go to slide ${dotIdx + 1}`}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          dotIdx === currentHeroSlide
                            ? "w-6 bg-emerald-600"
                            : "w-2 bg-slate-300 hover:bg-slate-400"
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
