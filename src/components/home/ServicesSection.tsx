"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Car,
  Home,
  Building2,
  Lock,
  PhoneCall,
  Clock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  KeyRound,
} from "lucide-react";
import { SiteSettings } from "@/types/database.types";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ServiceDetailModal } from "@/components/modals/ServiceDetailModal";

export interface ServicesSectionProps {
  categories?: any[];
  scenarios?: any[];
  siteSettings?: SiteSettings;
  onOpenCallback?: () => void;
}

interface ServiceCategoryDef {
  id: string;
  name: string;
  icon: React.ElementType;
}

const CATEGORIES: ServiceCategoryDef[] = [
  { id: "automotive", name: "Car Lockout & Keys", icon: Car },
  { id: "residential", name: "House & Apartment", icon: Home },
  { id: "commercial", name: "Commercial Storefront", icon: Building2 },
  { id: "emergency", name: "24/7 Emergency Dispatch", icon: ShieldCheck },
  { id: "safe", name: "Safe Opening & Locks", icon: Lock },
];

interface ScenarioDef {
  id: string;
  categoryId: string;
  title: string;
  icon?: React.ElementType;
  notes: string;
  status: string;
}

const SCENARIOS: ScenarioDef[] = [
  // Automotive
  {
    id: "auto-lockout",
    categoryId: "automotive",
    title: "Car Door & Trunk Lockout",
    icon: Car,
    notes: "100% Non-destructive air-wedge and reach bypass tools. Zero damage to vehicle weatherstripping or window frames.",
    status: "Fast Mobile Patrol Dispatch",
  },
  {
    id: "auto-fob",
    categoryId: "automotive",
    title: "Smart Key Fob Programming",
    icon: KeyRound,
    notes: "Push-to-start smart proximity keys and remote remotes paired on-site roadside via OBD-II computer diagnostics.",
    status: "Fast Mobile Patrol Dispatch",
  },
  {
    id: "auto-lost-key",
    categoryId: "automotive",
    title: "All Keys Lost Origination",
    notes: "High-precision laser key cutting from vehicle VIN and ECU computer immobilizer pairing on the street.",
    status: "Fast Mobile Patrol Dispatch",
  },
  {
    id: "auto-broken-key",
    categoryId: "automotive",
    title: "Broken Key Extraction & Ignition",
    notes: "Precision extraction tools to remove snapped blades from door or ignition without cylinder replacement.",
    status: "Fast Mobile Patrol Dispatch",
  },

  // Residential
  {
    id: "res-lockout",
    categoryId: "residential",
    title: "House & Apartment Lockout",
    notes: "Damage-free cylinder picking and bypass for front doors, deadbolts, knob locks, and mortise locks.",
    status: "Fast Mobile Patrol Dispatch",
  },
  {
    id: "res-rekey",
    categoryId: "residential",
    title: "Lock Re-Keying (Per Cylinder)",
    notes: "Keep your existing hardware, change internal brass pins for fresh keys and one-key master convenience.",
    status: "Fast Mobile Patrol Dispatch",
  },
  {
    id: "res-lock-change",
    categoryId: "residential",
    title: "Lock Change & Fresh Deadbolt",
    notes: "Installation of heavy-duty Grade 1 & Grade 2 deadbolts, electronic keyless pads, and handle locksets.",
    status: "Fast Mobile Patrol Dispatch",
  },
  {
    id: "res-broken-key",
    categoryId: "residential",
    title: "Snapped Deadbolt Key Removal",
    notes: "Extraction of snapped key fragments from cylinder plug and precision replacement cut on the spot.",
    status: "Fast Mobile Patrol Dispatch",
  },

  // Commercial
  {
    id: "comm-lockout",
    categoryId: "commercial",
    title: "Storefront & Office Lockout",
    notes: "Damage-free bypass for commercial glass door mortise cylinders, narrow stile locks, and entry doors.",
    status: "Fast Mobile Patrol Dispatch",
  },
  {
    id: "comm-panic-bar",
    categoryId: "commercial",
    title: "Panic Crash Bar Exit Hardware",
    notes: "Repair, latch dogging adjustments, and replacement for ADA and New Hampshire fire code compliance.",
    status: "Fast Mobile Patrol Dispatch",
  },
  {
    id: "comm-master-key",
    categoryId: "commercial",
    title: "Tiered Master Key Systems",
    notes: "Custom multi-level master key hierarchies for landlords, business owners, and commercial facilities.",
    status: "Fast Mobile Patrol Dispatch",
  },
  {
    id: "comm-high-security",
    categoryId: "commercial",
    title: "High-Security Mortise Cylinders",
    notes: "Pick-resistant and drill-resistant high-security cylinder upgrades with restricted key duplication control.",
    status: "Fast Mobile Patrol Dispatch",
  },

  // Emergency
  {
    id: "emg-roadside",
    categoryId: "emergency",
    title: "24/7 Roadside Car Lockout",
    notes: "Immediate priority dispatch for stranded drivers and families locked out of vehicles across NH.",
    status: "24/7 Fast Mobile Patrol",
  },
  {
    id: "emg-home",
    categoryId: "emergency",
    title: "Late-Night House Lockout Rescue",
    notes: "Emergency locksmith patrol ready 24/7 for locked house doors, broken keys, or jammed deadbolts.",
    status: "24/7 Fast Mobile Patrol",
  },
  {
    id: "emg-burglary",
    categoryId: "emergency",
    title: "Urgent Lock Rekey Assistance",
    notes: "Immediate lock rekeying and door hardware reinforcement following lost keys or security incidents.",
    status: "24/7 Fast Mobile Patrol",
  },
  {
    id: "emg-ignition",
    categoryId: "emergency",
    title: "Stuck Ignition Key Roadside",
    notes: "Emergency extraction and ignition tumbler servicing so you can get safely back on the road.",
    status: "24/7 Fast Mobile Patrol",
  },

  // Safe
  {
    id: "safe-lockout",
    categoryId: "safe",
    title: "Safe & Vault Lockout Bypass",
    notes: "Certified non-destructive safe cracking and dial manipulation for lost safe combinations and locks.",
    status: "Certified Safe Technicians",
  },
  {
    id: "safe-keypad",
    categoryId: "safe",
    title: "Electronic Safe Keypad Reset",
    notes: "Troubleshooting dead batteries, keypad solenoid failures, and electronic combination recovery.",
    status: "Certified Safe Technicians",
  },
  {
    id: "safe-dial",
    categoryId: "safe",
    title: "Mechanical Dial Combination Reset",
    notes: "Wheel pack servicing, dial realignment, and new combination setup for home and business safes.",
    status: "Certified Safe Technicians",
  },
  {
    id: "safe-boltwork",
    categoryId: "safe",
    title: "Safe Boltwork & Handle Repair",
    notes: "Fixing jammed locking bolts, relocker trigger resets, and preventive door alignment servicing.",
    status: "Certified Safe Technicians",
  },
];

export function ServicesSection({ siteSettings, onOpenCallback }: ServicesSectionProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("automotive");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailCategory, setSelectedDetailCategory] = useState<string>("automotive");

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const cardsScrollRef = useRef<HTMLDivElement>(null);

  const phoneRaw = siteSettings?.phone_raw || process.env.NEXT_PUBLIC_DISPATCH_PHONE_RAW || "tel:+16032905554";
  const phoneDisplay = siteSettings?.phone_display || process.env.NEXT_PUBLIC_DISPATCH_PHONE || "+1 (603) 290-5554";

  const activeCategory = CATEGORIES.find((c) => c.id === activeCategoryId) || CATEGORIES[0];
  const activeScenarios = SCENARIOS.filter((s) => s.categoryId === activeCategoryId);

  const handlePrevCategory = () => {
    const currentIndex = CATEGORIES.findIndex((c) => c.id === activeCategoryId);
    const prevIndex = (currentIndex - 1 + CATEGORIES.length) % CATEGORIES.length;
    setActiveCategoryId(CATEGORIES[prevIndex].id);
  };

  const handleNextCategory = () => {
    const currentIndex = CATEGORIES.findIndex((c) => c.id === activeCategoryId);
    const nextIndex = (currentIndex + 1) % CATEGORIES.length;
    setActiveCategoryId(CATEGORIES[nextIndex].id);
  };

  const handleScrollCards = (direction: "left" | "right") => {
    if (cardsScrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      cardsScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const isFirstMount = useRef(true);

  // Automatically scroll active category tab horizontally into view so it is never truncated, WITHOUT scrolling the page window!
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const container = categoryScrollRef.current;
    if (!container) return;

    const activeBtn = container.querySelector(
      `[data-category="${activeCategoryId}"]`
    ) as HTMLElement;
    if (activeBtn) {
      const btnLeft = activeBtn.offsetLeft;
      const btnWidth = activeBtn.offsetWidth;
      const containerWidth = container.offsetWidth;
      container.scrollTo({
        left: btnLeft - containerWidth / 2 + btnWidth / 2,
        behavior: "smooth",
      });
    }
  }, [activeCategoryId]);

  const handleOpenDetails = (categoryId: string) => {
    setSelectedDetailCategory(categoryId);
    setIsDetailModalOpen(true);
  };

  return (
    <section
      id="services"
      className="py-12 sm:py-16 md:py-20 bg-white border-b border-slate-200 text-slate-800 relative scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Emergency Lockout &amp; Key Services
            </h2>
            <p className="text-slate-600 text-xs sm:text-base mt-2">
              Select your emergency category and lockout situation for fast mobile patrol dispatch across Manchester &amp; NH
            </p>
          </div>
        </ScrollReveal>

        {/* Step 1: Horizontal Category Switcher */}
        <ScrollReveal direction="up" delay={0.08}>
          <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
            <div className="p-1 sm:p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 shadow-inner flex items-center gap-1">
              {/* Left Arrow Icon */}
              <button
                type="button"
                onClick={handlePrevCategory}
                aria-label="Previous Category"
                className="p-2 text-slate-500 hover:text-emerald-700 transition cursor-pointer shrink-0 active:scale-90"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Horizontally scrollable Category Tabs Container */}
              <div
                ref={categoryScrollRef}
                className="flex-1 flex gap-1.5 p-0.5 overflow-x-auto no-scrollbar scroll-smooth"
              >
                {CATEGORIES.map((cat) => {
                  const isActive = cat.id === activeCategoryId;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      data-category={cat.id}
                      type="button"
                      onClick={() => setActiveCategoryId(cat.id)}
                      className={`shrink-0 flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap text-center ${
                        isActive
                          ? "bg-emerald-700 text-white shadow-sm shadow-emerald-700/20"
                          : "text-slate-700 hover:text-slate-900 hover:bg-white/70"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span className="leading-tight">{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right Arrow Icon */}
              <button
                type="button"
                onClick={handleNextCategory}
                aria-label="Next Category"
                className="p-2 text-slate-500 hover:text-emerald-700 transition cursor-pointer shrink-0 active:scale-90"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Step 2: Horizontally Scrollable Cards Container with Desktop Arrows & Mobile Snap */}
        <ScrollReveal direction="up" delay={0.12}>
          <div className="relative">
            {/* Category Header Row with Read Full Details Button & Desktop Card Arrows */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {activeCategory.name} — Situations
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenDetails(activeCategoryId)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-black text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                >
                  <span>Read Full Service Details</span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleScrollCards("left")}
                  aria-label="Scroll left"
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScrollCards("right")}
                  aria-label="Scroll right"
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Cards Scroll */}
            <div
              ref={cardsScrollRef}
              className="flex lg:grid lg:grid-cols-4 gap-4 overflow-x-auto no-scrollbar snap-x pb-2 pt-1"
            >
              {activeScenarios.map((scenario) => {
                const Icon = scenario.icon || activeCategory.icon;
                return (
                  <div
                    key={scenario.id}
                    className="w-[280px] sm:w-[320px] lg:w-auto shrink-0 snap-start bg-slate-50/80 hover:bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/90 hover:border-emerald-500/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-2xs">
                          <Icon className="w-5 h-5 text-emerald-700" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
                          {scenario.status}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 leading-snug mb-2">
                        {scenario.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {scenario.notes}
                      </p>

                      {/* Read More Modal Trigger on Card */}
                      <button
                        type="button"
                        onClick={() => handleOpenDetails(scenario.categoryId)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition cursor-pointer mb-2"
                      >
                        <span>Read More</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-slate-200/80 flex items-center gap-2">
                      <a
                        href={phoneRaw}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-950 hover:bg-black text-white font-bold text-xs transition active:scale-98 shadow-2xs"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                        <span>CALL</span>
                      </a>
                      <button
                        type="button"
                        onClick={onOpenCallback}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer active:scale-98 shadow-2xs"
                      >
                        <Clock className="w-3.5 h-3.5 text-emerald-100" />
                        <span>Callback</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-400 mt-2 block lg:hidden text-center">
              ← Swipe to explore all situations • Tap Read More or Call →
            </p>
          </div>
        </ScrollReveal>

        {/* Global Dispatch Bottom Callout - Clean refined typography, NO sparkle icon */}
        <ScrollReveal direction="up" delay={0.16}>
          <div className="mt-10 sm:mt-12 bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-7 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 border border-slate-800 shadow-xl">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="text-emerald-400 text-xs font-black uppercase tracking-wider">
                ZERO HIDDEN FEES • GUARANTEED UPFRONT PHONE QUOTE
              </div>
              <h3 className="text-lg sm:text-2xl font-black tracking-tight text-white">
                Need an immediate lock or car key technician dispatched?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                Our mobile patrol vans are on duty right now across Manchester, NH &amp; surrounding towns. Call our dispatch hub directly or request a callback.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto">
              <a
                href={phoneRaw}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-900/30 active:scale-98 cursor-pointer text-center"
              >
                <PhoneCall className="w-4 h-4 text-white shrink-0" />
                <span>Call Dispatch Now</span>
              </a>

              <button
                type="button"
                onClick={onOpenCallback}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition-all border border-slate-700 active:scale-98 cursor-pointer text-center"
              >
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Request Callback</span>
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Service Detail Modal for Deep Service Information */}
      <ServiceDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        initialCategory={selectedDetailCategory}
        onOpenCallback={onOpenCallback}
        phoneRaw={phoneRaw}
        phoneDisplay={phoneDisplay}
      />
    </section>
  );
}
