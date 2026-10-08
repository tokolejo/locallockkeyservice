"use client";

import React from "react";
import { Clock } from "lucide-react";
import { CoverageArea } from "@/types/database.types";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

interface CoverageMapProps {
  coverageAreas?: CoverageArea[];
  onSelectArea?: (area: CoverageArea) => void;
  onOpenMapPicker?: () => void;
}

interface AreaInfo {
  name: string;
  eta: string;
  areas: string;
  highlight: string;
}

const NH_AREAS: AreaInfo[] = [
  {
    name: "Manchester, NH",
    eta: "15–20 Mins",
    areas: "Downtown, North End, South End, West Side, Rimmon Heights",
    highlight: "Primary Central Hub",
  },
  {
    name: "Bedford & Merrimack",
    eta: "15–20 Mins",
    areas: "Bedford Village, Route 101, Reeds Ferry, Thornton's Ferry",
    highlight: "Dedicated Patrol Unit",
  },
  {
    name: "Concord & Hooksett",
    eta: "20–25 Mins",
    areas: "Downtown Concord, Heights, Hooksett Village, I-93 Corridor",
    highlight: "Northbound Express Unit",
  },
  {
    name: "Nashua & Derry",
    eta: "20–25 Mins",
    areas: "Downtown Nashua, North End, Derry Center, East Derry",
    highlight: "South Express Unit",
  },
  {
    name: "Londonderry & Salem",
    eta: "20–30 Mins",
    areas: "Londonderry Center, North Salem, Depot, Rockingham Park",
    highlight: "I-93 Patrol Route",
  },
];

export function CoverageMap({}: CoverageMapProps) {
  const phoneRaw = process.env.NEXT_PUBLIC_DISPATCH_PHONE_RAW || "tel:+16032905554";

  return (
    <section id="coverage" className="py-6 sm:py-12 md:py-16 bg-[#faf9f6] border-b border-slate-200 text-slate-800 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xs space-y-4 sm:space-y-6">
            {/* Header info */}
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] sm:text-xs font-bold mb-1.5 sm:mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Live Patrols in Manchester & NH Areas</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Service Coverage Across Manchester & NH
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-0.5 sm:mt-1">
                Mobile dispatch units positioned throughout Manchester & Southern NH for an average 15–20 min arrival.
              </p>
            </div>

            {/* Clean Manchester & NH Areas Interactive Horizontal Scroll on Mobile */}
            <div>
              <div className="flex lg:grid lg:grid-cols-5 gap-2 sm:gap-3 pt-1 overflow-x-auto no-scrollbar snap-x pb-1">
                {NH_AREAS.map((b) => (
                  <a
                    key={b.name}
                    href={phoneRaw}
                    className="w-[140px] sm:w-[160px] lg:w-auto shrink-0 snap-start p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50/80 hover:bg-emerald-50/70 border border-slate-200/90 hover:border-emerald-500/70 text-left transition-all group block cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-black text-slate-900 group-hover:text-emerald-900 transition-colors truncate">
                        {b.name}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>{b.eta}</span>
                    </div>
                  </a>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 block lg:hidden">
                ← Swipe to explore all service areas →
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
