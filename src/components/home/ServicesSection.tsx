"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Home,
  Car,
  Building2,
  Key,
  Shield,
  Wrench,
  Lock,
  Zap,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  PhoneCall,
  MessageCircle,
  Clock,
} from "lucide-react";
import {
  ServiceCategoryItem,
  ServiceScenarioItem,
  SiteSettings,
  ServiceCategory,
} from "@/types/database.types";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const DEFAULT_CATEGORIES: ServiceCategoryItem[] = [
  { id: "automotive", name: "Car Lockout & Keys", icon: "Car", display_order: 1, is_active: true },
  { id: "residential", name: "House & Apartment", icon: "Home", display_order: 2, is_active: true },
  { id: "commercial", name: "Commercial Storefront", icon: "Building2", display_order: 3, is_active: true },
];

const DEFAULT_SCENARIOS: ServiceScenarioItem[] = [
  {
    id: "auto-lockout",
    category_id: "automotive",
    label: "Car Door / Trunk Lockout Rescue",
    notes: "100% Non-destructive air-wedge & specialized reach tools",
    eta: "15-20 mins",
    display_order: 1,
    is_active: true,
  },
  {
    id: "auto-lost-key",
    category_id: "automotive",
    label: "All Car Keys Lost (On-Site Origination)",
    notes: "Laser cut & OBD-II ECU computer pairing on the street",
    eta: "25-35 mins",
    display_order: 2,
    is_active: true,
  },
  {
    id: "auto-duplicate-fob",
    category_id: "automotive",
    label: "Spare Key Fob Duplication",
    notes: "Push-to-start smart proximity remote blanks",
    eta: "20-30 mins",
    display_order: 3,
    is_active: true,
  },
  {
    id: "auto-broken-key",
    category_id: "automotive",
    label: "Broken Key Extracted from Door / Ignition",
    notes: "Precision extraction tools, no lock replacement required",
    eta: "15-20 mins",
    display_order: 4,
    is_active: true,
  },
  {
    id: "res-lockout",
    category_id: "residential",
    label: "Locked Out of Apartment / House",
    notes: "Damage-free cylinder picking for deadbolts & mortise locks",
    eta: "15-20 mins",
    display_order: 1,
    is_active: true,
  },
  {
    id: "res-lock-change",
    category_id: "residential",
    label: "Lock Change / New Cylinder Installation",
    notes: "Fresh high-security locks + keys cut on-site",
    eta: "Same-Day / Scheduled",
    display_order: 2,
    is_active: true,
  },
  {
    id: "res-rekey",
    category_id: "residential",
    label: "Lock Re-Keying (Per Cylinder)",
    notes: "Keep current locks, change internal pins for new keys",
    eta: "Same-Day",
    display_order: 3,
    is_active: true,
  },
  {
    id: "res-broken-key",
    category_id: "residential",
    label: "Key Snapped in Deadbolt Cylinder",
    notes: "Non-destructive extraction + fresh key duplicate",
    eta: "15-20 mins",
    display_order: 4,
    is_active: true,
  },
  {
    id: "comm-lockout",
    category_id: "commercial",
    label: "Storefront / Commercial Lockout",
    notes: "Commercial mortise & rim cylinder bypass",
    eta: "15-25 mins",
    display_order: 1,
    is_active: true,
  },
  {
    id: "comm-panic-bar",
    category_id: "commercial",
    label: "Panic Crash Bar Exit Device Repair",
    notes: "Fire Code & ADA compliant repair",
    eta: "Same-Day",
    display_order: 2,
    is_active: true,
  },
  {
    id: "comm-master-key",
    category_id: "commercial",
    label: "Storefront Master Key System",
    notes: "Multi-door tiered master key hierarchy",
    eta: "Scheduled",
    display_order: 3,
    is_active: true,
  },
];

interface ServicesSectionProps {
  categories?: ServiceCategoryItem[];
  scenarios?: ServiceScenarioItem[];
  siteSettings?: SiteSettings;
  onConfirmDispatch?: (details: {
    category: ServiceCategory;
    subType: string;
    estimatedMin: number;
    estimatedMax: number;
  }) => void;
}

export function ServicesSection({
  categories: propCategories,
  scenarios: propScenarios,
  siteSettings,
}: ServicesSectionProps) {
  const [categories, setCategories] = useState<ServiceCategoryItem[]>(
    propCategories && propCategories.length > 0 ? propCategories : DEFAULT_CATEGORIES
  );
  const [scenarios, setScenarios] = useState<ServiceScenarioItem[]>(
    propScenarios && propScenarios.length > 0 ? propScenarios : DEFAULT_SCENARIOS
  );

  const phone = siteSettings?.phone_display || process.env.NEXT_PUBLIC_DISPATCH_PHONE || "+1 (603) 290-5554";
  const phoneRaw = siteSettings?.phone_raw || process.env.NEXT_PUBLIC_DISPATCH_PHONE_RAW || "tel:+16032905554";

  // Self-fetch from /api/content if props were empty
  useEffect(() => {
    if (propCategories && propCategories.length > 0) {
      setCategories(propCategories);
    }
    if (propScenarios && propScenarios.length > 0) {
      setScenarios(propScenarios);
    }
  }, [propCategories, propScenarios]);

  useEffect(() => {
    if (!propCategories || propCategories.length === 0) {
      fetch("/api/content")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            if (data.service_categories && data.service_categories.length > 0) {
              setCategories(data.service_categories);
            }
            if (data.service_scenarios && data.service_scenarios.length > 0) {
              setScenarios(data.service_scenarios);
            }
          }
        })
        .catch(() => {});
    }
  }, [propCategories]);

  // Active category filtering (only active ones)
  const activeCategoriesList = categories.filter((c) => c.is_active);
  const effectiveCategories = activeCategoriesList.length > 0 ? activeCategoriesList : DEFAULT_CATEGORIES;

  const [activeCategoryId, setActiveCategoryId] = useState<string>(effectiveCategories[0]?.id || "automotive");
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Active Category item
  const activeCategory =
    effectiveCategories.find((c) => c.id === activeCategoryId) || effectiveCategories[0];

  // Scenarios belonging to active category
  const activeScenarios = scenarios.filter(
    (s) => s.is_active && s.category_id === activeCategory?.id
  );

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    activeScenarios[0]?.id || ""
  );

  useEffect(() => {
    if (activeScenarios.length > 0 && !activeScenarios.some((s) => s.id === selectedScenarioId)) {
      setSelectedScenarioId(activeScenarios[0].id);
    }
  }, [activeCategoryId, activeScenarios, selectedScenarioId]);

  const selectedScenario =
    activeScenarios.find((s) => s.id === selectedScenarioId) || activeScenarios[0];

  const whatsappUrl = `https://wa.me/16032905554?text=${encodeURIComponent(
    `Hello, I need locksmith service for: ${selectedScenario?.label || "Emergency Service"} in Manchester, NH.`
  )}`;

  const handleCategoryChange = (catId: string) => {
    setActiveCategoryId(catId);
    const catScenarios = scenarios.filter((s) => s.is_active && s.category_id === catId);
    if (catScenarios.length > 0) {
      setSelectedScenarioId(catScenarios[0].id);
    }
  };

  const handlePrevCategory = () => {
    const currentIndex = effectiveCategories.findIndex((c) => c.id === activeCategoryId);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : effectiveCategories.length - 1;
    handleCategoryChange(effectiveCategories[prevIndex].id);
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({ left: -140, behavior: "smooth" });
    }
  };

  const handleNextCategory = () => {
    const currentIndex = effectiveCategories.findIndex((c) => c.id === activeCategoryId);
    const nextIndex = currentIndex < effectiveCategories.length - 1 ? currentIndex + 1 : 0;
    handleCategoryChange(effectiveCategories[nextIndex].id);
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({ left: 140, behavior: "smooth" });
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case "car":
        return <Car className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      case "home":
        return <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      case "building2":
      case "building":
        return <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      case "key":
      case "keyround":
        return <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      case "shield":
        return <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      case "wrench":
        return <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      case "lock":
        return <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      case "zap":
        return <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      default:
        return <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
    }
  };

  return (
    <section
      id="services"
      className="py-6 sm:py-14 md:py-20 bg-white border-b border-slate-200 text-slate-800 relative scroll-mt-28"
    >
      <div id="estimator" className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-8 md:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Emergency Lockout & Key Services
            </h2>
            <p className="text-slate-600 text-xs sm:text-base mt-1 sm:mt-2">
              Select your emergency category and lockout situation for immediate 15–20 minute mobile dispatch
            </p>
          </div>
        </ScrollReveal>

        {/* Step 1: Horizontal Category Switcher matching reference */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="max-w-3xl mx-auto mb-4 sm:mb-6">
            <div className="p-1 sm:p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 shadow-inner flex items-center gap-0.5 sm:gap-1">
              {/* Left Arrow Icon */}
              <button
                type="button"
                onClick={handlePrevCategory}
                aria-label="Previous Category"
                className="p-1.5 sm:p-2 text-slate-500 hover:text-emerald-700 transition cursor-pointer shrink-0 active:scale-90"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Horizontally scrollable Category Tabs Container */}
              <div
                ref={categoryScrollRef}
                className="flex-1 flex gap-1 p-0.5 overflow-x-auto no-scrollbar scroll-smooth"
              >
                {effectiveCategories.map((cat) => {
                  const isActive = cat.id === activeCategoryId;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap text-center ${
                        isActive
                          ? "bg-emerald-700 text-white shadow-sm shadow-emerald-700/20"
                          : "text-slate-700 hover:text-slate-900 hover:bg-white/60"
                      }`}
                    >
                      <span className="shrink-0">{getCategoryIcon(cat.icon)}</span>
                      <span className="leading-tight text-[11px] sm:text-xs">{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right Arrow Icon */}
              <button
                type="button"
                onClick={handleNextCategory}
                aria-label="Next Category"
                className="p-1.5 sm:p-2 text-slate-500 hover:text-emerald-700 transition cursor-pointer shrink-0 active:scale-90"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Step 2: Scenarios Grid: 1 Service per row on Mobile, 4 Columns on Desktop */}
        <ScrollReveal direction="up" delay={0.15} scale>
          <div className="bg-[#fbfbf9] border border-slate-200 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 md:p-8 shadow-sm space-y-3.5 sm:space-y-6">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Select Specific Lockout Situation:
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                  Tap any service scenario to select and confirm dispatch
                </p>
              </div>
              <span className="hidden sm:inline-block text-xs text-emerald-800 font-bold px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 shrink-0">
                {activeCategory?.name}
              </span>
            </div>

            {/* Scenario Cards */}
            {activeScenarios.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No active scenarios in this category.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-4">
                {activeScenarios.map((scenario) => {
                  const isSelected = scenario.id === selectedScenarioId;

                  return (
                    <div
                      key={scenario.id}
                      onClick={() => setSelectedScenarioId(scenario.id)}
                      className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 relative group ${
                        isSelected
                          ? "bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/40 shadow-sm"
                          : "bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-2xs"
                      } md:flex-col md:items-stretch md:justify-between md:min-h-[145px]`}
                    >
                      {/* Left/Main on mobile, Top on desktop */}
                      <div className="flex items-start gap-2.5 min-w-0 flex-1 md:flex-initial">
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isSelected
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-700"
                          }`}
                        >
                          {getCategoryIcon(activeCategory?.icon)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                            {scenario.label}
                          </h4>
                          {scenario.notes && (
                            <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed">
                              {scenario.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right on mobile, Bottom on desktop (ETA & Checkmark) */}
                      <div className="flex items-center md:justify-between gap-2 shrink-0 md:pt-2 md:border-t md:border-slate-100 md:mt-2">
                        <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-600 hidden md:inline" />
                          <span>{scenario.eta || "15–20 mins"}</span>
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-slate-300 bg-white group-hover:border-slate-400"
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Direct Confirmation Action (ZERO Pricing) */}
            <div className="pt-2 sm:pt-4 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={phoneRaw}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl sm:rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>CALL</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export const CostEstimator = ServicesSection;
