"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, MapPin, PhoneCall } from "lucide-react";
import { CoverageArea } from "@/types/database.types";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

interface CoverageMapProps {
  coverageAreas?: CoverageArea[];
  onSelectArea?: (area: CoverageArea) => void;
  onOpenMapPicker?: () => void;
}

interface AreaInfo {
  name: string;
  badge: string;
  neighborhoods: string;
}

const NH_AREAS: AreaInfo[] = [
  {
    name: "Manchester, NH",
    badge: "Central Fleet Hub",
    neighborhoods: "Downtown • North End • West Side • South End",
  },
  {
    name: "Bedford & Merrimack",
    badge: "Dedicated Mobile Unit",
    neighborhoods: "Bedford Village • Route 101 • Reeds Ferry",
  },
  {
    name: "Concord & Hooksett",
    badge: "North Corridor Patrol",
    neighborhoods: "Heights • Hooksett Village • I-93 Corridor",
  },
  {
    name: "Nashua & Derry",
    badge: "South Corridor Patrol",
    neighborhoods: "Downtown Nashua • North End • Derry Center",
  },
  {
    name: "Londonderry & Salem",
    badge: "I-93 Patrol Route",
    neighborhoods: "Londonderry Center • Depot • Rockingham Park",
  },
  {
    name: "Goffstown & Auburn",
    badge: "West & East Fleet",
    neighborhoods: "Pinardville • Grasmere • Lake Massabesic",
  },
  {
    name: "Amherst & Milford",
    badge: "Route 101A Unit",
    neighborhoods: "Amherst Village • Oval District • Route 101A",
  },
];

const NH_REGIONS_TOWNS = [
  {
    title: "Manchester",
    towns: ["Manchester"],
  },
  {
    title: "Greater Manchester",
    towns: [
      "Auburn",
      "Bedford",
      "Candia",
      "Chester",
      "Deerfield",
      "Dunbarton",
      "Fremont",
      "Goffstown",
      "Hooksett",
      "New Boston",
      "Raymond",
      "Weare",
    ],
  },
  {
    title: "Greater Nashua",
    towns: [
      "Amherst",
      "Brookline",
      "Hollis",
      "Hudson",
      "Litchfield",
      "Merrimack",
      "Milford",
      "Mont Vernon",
      "Nashua",
    ],
  },
  {
    title: "Greater Salem/Derry",
    towns: [
      "Derry",
      "Hampstead",
      "Londonderry",
      "Pelham",
      "Salem",
      "Sandown",
      "Windham",
    ],
  },
  {
    title: "Greater Concord",
    towns: [
      "Allenstown",
      "Bow",
      "Chichester",
      "Concord",
      "Epsom",
      "Henniker",
      "Hopkinton",
      "Pembroke",
      "Penacook",
      "Loudon",
      "Canterbury",
      "Contoocook",
      "Boscawen",
      "Pittsfield",
    ],
  },
  {
    title: "Greater Laconia",
    towns: [
      "Laconia",
      "Belmont",
      "Tilton",
      "Franklin",
      "Gilmanton",
      "Gilford",
      "Bristol",
      "Meredith",
      "Wolfeboro",
      "Alton",
      "Moultonborough",
      "Ashland",
      "Andover",
      "Webster",
      "New London",
      "Warner",
    ],
  },
];

export function CoverageMap({}: CoverageMapProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const phoneRaw = process.env.NEXT_PUBLIC_DISPATCH_PHONE_RAW || "tel:+16032905554";

  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -240 : 240;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section
      id="coverage"
      className="py-8 sm:py-12 md:py-16 bg-[#faf9f6] border-b border-slate-200 text-slate-800 scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 md:p-8 shadow-xs space-y-6">
            {/* Header info with Desktop Slider Arrows */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2 shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>Live GPS-Tracked Mobile Fleet</span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  New Hampshire Service Area Coverage
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">
                  Strategically stationed mobile patrol units dispatched immediately across Greater Manchester and surrounding NH communities.
                </p>
              </div>

              {/* Navigation Arrows on Desktop */}
              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => scrollSlider("left")}
                  aria-label="Previous service areas"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer active:scale-95 shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollSlider("right")}
                  aria-label="Next service areas"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer active:scale-95 shadow-2xs"
                >
                  <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>
              </div>
            </div>

            {/* Horizontal Slider (Clean, informative cards with badge, neighborhoods, and direct call) */}
            <div className="relative">
              <div
                ref={sliderRef}
                className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth snap-x pb-2 pt-1"
              >
                {NH_AREAS.map((b) => (
                  <a
                    key={b.name}
                    href={phoneRaw}
                    className="w-[220px] sm:w-[250px] md:w-[270px] shrink-0 snap-start p-4 rounded-2xl bg-white hover:bg-emerald-50/40 border border-slate-200/90 hover:border-emerald-500/60 transition-all group flex flex-col justify-between text-left cursor-pointer active:scale-98 shadow-xs hover:shadow-sm"
                  >
                    <div>
                      {/* Card Top: Pin Icon & Patrol Badge */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-emerald-100/80 text-slate-700 group-hover:text-emerald-800 flex items-center justify-center transition-colors">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-emerald-100/90 group-hover:text-emerald-900 transition-colors">
                          {b.badge}
                        </span>
                      </div>

                      {/* Area Title */}
                      <h3 className="text-sm sm:text-base font-black text-slate-950 group-hover:text-emerald-950 transition-colors leading-snug">
                        {b.name}
                      </h3>

                      {/* Neighborhoods / Corridors */}
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                        {b.neighborhoods}
                      </p>
                    </div>

                    {/* Card Bottom: Action Link */}
                    <div className="mt-4 pt-2.5 border-t border-slate-100 group-hover:border-emerald-200/60 flex items-center justify-between text-[11px] font-bold text-slate-600 group-hover:text-emerald-800 transition-colors">
                      <span>Call Local Dispatch</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </a>
                ))}
              </div>

              <p className="text-[11px] text-slate-400 mt-2 block sm:hidden text-center">
                ← Swipe to explore all service areas • Tap to call →
              </p>
            </div>

            {/* All New Hampshire Service Areas & Towns by Region (Exact 6 Regions, No Zip Codes) */}
            <div className="pt-8 border-t border-slate-200/90 mt-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-1.5 shadow-2xs">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Complete Regional Directory</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    New Hampshire Service Areas &amp; Towns
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                    Fast, professional 24/7 mobile locksmith dispatch available across all listed communities:
                  </p>
                </div>
                <a
                  href={phoneRaw}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-black text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Dispatch: +1 (603) 290-5554</span>
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {NH_REGIONS_TOWNS.map((region) => (
                  <div
                    key={region.title}
                    className="bg-slate-50/90 hover:bg-white border border-slate-200/90 hover:border-emerald-500/40 rounded-2xl p-4 flex flex-col transition-all shadow-2xs hover:shadow-xs"
                  >
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-2 mb-2.5 border-b border-slate-200/80 flex items-center justify-between">
                      <span className="truncate">{region.title}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded-md shrink-0 ml-1">
                        {region.towns.length}
                      </span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 font-medium flex-1">
                      {region.towns.map((town) => (
                        <li key={town} className="hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                          <span>{town}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
