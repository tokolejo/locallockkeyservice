"use client";

import React, { useState, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight, MapPin, PhoneCall, Search, CheckCircle2 } from "lucide-react";
import { CoverageArea } from "@/types/database.types";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

interface CoverageMapProps {
  coverageAreas?: CoverageArea[];
  onSelectArea?: (area: CoverageArea) => void;
  onOpenMapPicker?: () => void;
}

interface AreaInfo {
  name: string;
  neighborhoods: string;
}

const NH_AREAS: AreaInfo[] = [
  {
    name: "Manchester, NH",
    neighborhoods: "Downtown • North End • West Side • South End",
  },
  {
    name: "Bedford & Merrimack",
    neighborhoods: "Bedford Village • Route 101 • Reeds Ferry",
  },
  {
    name: "Concord & Hooksett",
    neighborhoods: "Heights • Hooksett Village • I-93 Corridor",
  },
  {
    name: "Nashua & Derry",
    neighborhoods: "Downtown Nashua • North End • Derry Center",
  },
  {
    name: "Londonderry & Salem",
    neighborhoods: "Londonderry Center • Depot • Rockingham Park",
  },
  {
    name: "Goffstown & Auburn",
    neighborhoods: "Pinardville • Grasmere • Lake Massabesic",
  },
  {
    name: "Amherst & Milford",
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
  const [selectedRegionIndex, setSelectedRegionIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const phoneRaw = process.env.NEXT_PUBLIC_DISPATCH_PHONE_RAW || "tel:+16032905554";

  const allTownsWithRegion = useMemo(() => {
    return NH_REGIONS_TOWNS.flatMap((r) =>
      r.towns.map((t) => ({ town: t, region: r.title }))
    );
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    return allTownsWithRegion.filter(
      (item) => item.town.toLowerCase().includes(q) || item.region.toLowerCase().includes(q)
    );
  }, [searchQuery, allTownsWithRegion]);

  const activeRegion = NH_REGIONS_TOWNS[selectedRegionIndex] || NH_REGIONS_TOWNS[0];

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
                      {/* Card Header: Location Icon and Title Together */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100 flex items-center justify-center shrink-0 transition-colors">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                        </div>
                        <h3 className="text-sm sm:text-base font-black text-slate-950 group-hover:text-emerald-700 transition-colors leading-snug">
                          {b.name}
                        </h3>
                      </div>

                      {/* Neighborhoods / Corridors */}
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
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

            {/* Compact Interactive Regional Directory (Tabs + Instant Search) */}
            <div className="pt-6 border-t border-slate-200/90 mt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Explore Towns by Region</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                      50+ Communities Covered
                    </span>
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Select a regional hub below or search for your specific town:
                  </p>
                </div>

                {/* Instant Search Bar */}
                <div className="relative w-full md:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search town (e.g. Bedford)..."
                    className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Regional Tabs Pills */}
              {!searchQuery && (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
                  {NH_REGIONS_TOWNS.map((region, idx) => {
                    const isActive = selectedRegionIndex === idx;
                    return (
                      <button
                        key={region.title}
                        type="button"
                        onClick={() => setSelectedRegionIndex(idx)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                          isActive
                            ? "bg-slate-900 text-white shadow-xs"
                            : "bg-slate-100/90 hover:bg-slate-200/80 text-slate-700 border border-transparent"
                        }`}
                      >
                        <span>{region.title}</span>
                        <span
                          className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-200/80 text-slate-600"
                          }`}
                        >
                          {region.towns.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Rendered Town Chips Container */}
              <div className="mt-2.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
                {searchResults ? (
                  <div>
                    <div className="text-xs font-semibold text-slate-500 mb-2.5">
                      Found {searchResults.length} matching {searchResults.length === 1 ? "town" : "towns"}:
                    </div>
                    {searchResults.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {searchResults.map((item) => (
                          <a
                            key={item.town}
                            href={phoneRaw}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200/90 hover:border-emerald-400 text-xs font-bold text-slate-800 hover:text-emerald-950 transition-all shadow-2xs group cursor-pointer"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform shrink-0" />
                            <span>{item.town}</span>
                            <span className="text-[10px] text-slate-400 font-normal ml-0.5">
                              ({item.region})
                            </span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 py-2">
                        No specific town found matching &quot;{searchQuery}&quot;. We still likely cover your area! Call dispatch directly at{" "}
                        <a href={phoneRaw} className="text-emerald-700 font-bold underline">
                          +1 (603) 290-5554
                        </a>.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {activeRegion.towns.map((town) => (
                      <a
                        key={town}
                        href={phoneRaw}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200/90 hover:border-emerald-400 text-xs font-bold text-slate-800 hover:text-emerald-950 transition-all shadow-2xs group cursor-pointer"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform shrink-0" />
                        <span>{town}</span>
                      </a>
                    ))}
                  </div>
                )}

                {/* Live Dispatch Footer Reassurance */}
                <div className="mt-3.5 pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>15–20 minute mobile response time across all listed towns.</span>
                  </div>
                  <a
                    href={phoneRaw}
                    className="font-bold text-slate-900 hover:text-emerald-700 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Need immediate lockout help? Call (603) 290-5554</span>
                    <ChevronRight className="w-3 h-3 text-emerald-600" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
