"use client";

import React, { useState } from "react";
import {
  Car,
  Home,
  Building2,
  Lock,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
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

const SERVICES_DATA = [
  {
    id: "residential",
    title: "Residential",
    icon: Home,
    iconColor: "text-emerald-700",
    iconBg: "bg-emerald-50 border-emerald-100",
    bullets: [
      "House & Apartment Lockout",
      "Lock Rekeying (Keyed Alike)",
      "Lock Replacement & Deadbolt Install",
      "Broken Key Removal & Door Alignment",
    ],
  },
  {
    id: "automotive",
    title: "Automotive",
    icon: Car,
    iconColor: "text-amber-700",
    iconBg: "bg-amber-50 border-amber-100",
    bullets: [
      "Car Door & Trunk Lockout",
      "Smart Key Fob Programming",
      "All Keys Lost Origination On-Site",
      "Broken Key Extraction & Ignition Repair",
    ],
  },
  {
    id: "commercial",
    title: "Commercial",
    icon: Building2,
    iconColor: "text-blue-700",
    iconBg: "bg-blue-50 border-blue-100",
    bullets: [
      "Storefront & Office Lockout",
      "Panic Crash Bar Exit Hardware",
      "Master Key Systems & Key Control",
      "High-Security Mortise Cylinders",
    ],
  },
  {
    id: "emergency",
    title: "Emergency",
    icon: ShieldAlert,
    iconColor: "text-rose-700",
    iconBg: "bg-rose-50 border-rose-100",
    bullets: [
      "24/7 Mobile Priority Lockout Rescue",
      "Car, Home & Office Lockouts",
      "Immediate Lock Change After Theft",
      "Storage Units & Padlock Removal",
    ],
  },
  {
    id: "safe",
    title: "Safe & Vault",
    icon: Lock,
    iconColor: "text-purple-700",
    iconBg: "bg-purple-50 border-purple-100",
    bullets: [
      "Safe Opening & Lockout Bypass",
      "Electronic Keypad Reset & Override",
      "Dial Combination Changes",
      "Safe Lock Repair & Boltwork Servicing",
    ],
  },
];

export function ServicesSection({ siteSettings, onOpenCallback }: ServicesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("residential");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const phoneRaw =
    siteSettings?.phone_raw ||
    process.env.NEXT_PUBLIC_DISPATCH_PHONE_RAW ||
    "tel:+16032905554";
  const phoneDisplay =
    siteSettings?.phone_display ||
    process.env.NEXT_PUBLIC_DISPATCH_PHONE ||
    "+1 (603) 290-5554";

  const handleOpenDetails = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsModalOpen(true);
  };

  return (
    <section
      id="services"
      className="py-10 sm:py-14 md:py-16 bg-white border-b border-slate-200 text-slate-800 relative scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Streamlined Header */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-7 sm:mb-9">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Fast, Reliable Mobile Locksmith Services
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">
              Professional mobile lock and key solutions across Manchester and surrounding Southern New Hampshire communities.
            </p>
          </div>
        </ScrollReveal>

        {/* 5 Compact Cards: Icon Left + Title Right + Pill Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 max-w-7xl mx-auto">
          {SERVICES_DATA.map((service, idx) => {
            const Icon = service.icon;
            return (
              <ScrollReveal key={service.id} direction="up" delay={idx * 0.05}>
                <div
                  onClick={() => handleOpenDetails(service.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleOpenDetails(service.id);
                  }}
                  className="group bg-[#fcfbf9] hover:bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/60 p-4 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full cursor-pointer text-left select-none"
                >
                  <div>
                    {/* Icon Left + Title Right */}
                    <div className="flex items-center gap-2.5 sm:gap-3 mb-3.5 sm:mb-3">
                      <div
                        className={`w-10 h-10 sm:w-10 sm:h-10 rounded-xl ${service.iconBg} border flex items-center justify-center ${service.iconColor} shrink-0 group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-extrabold sm:font-bold text-slate-900 group-hover:text-emerald-700 text-[17px] sm:text-[15px] xl:text-base leading-tight tracking-tight whitespace-nowrap transition-colors">
                        {service.title}
                      </h3>
                    </div>

                    {/* Badges / Pill Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {service.bullets.slice(0, 3).map((bullet) => (
                        <span
                          key={bullet}
                          className="inline-flex items-center text-xs sm:text-[11px] font-medium text-slate-600 bg-white border border-slate-200/80 px-2.5 py-1 sm:px-2 sm:py-0.5 rounded-lg sm:rounded-md leading-snug group-hover:border-slate-300"
                        >
                          {bullet}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Compact View Details footer */}
                  <div className="mt-3.5 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                    <span>View Details</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* Service Detail Modal Popup with full details */}
      <ServiceDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialCategory={selectedCategory}
        onOpenCallback={onOpenCallback}
        phoneRaw={phoneRaw}
        phoneDisplay={phoneDisplay}
      />
    </section>
  );
}
