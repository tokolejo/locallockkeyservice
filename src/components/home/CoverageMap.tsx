"use client";

import React, { useState, useMemo } from "react";
import { MapPin, PhoneCall, Search, ChevronRight } from "lucide-react";
import { CoverageArea } from "@/types/database.types";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

interface CoverageMapProps {
  coverageAreas?: CoverageArea[];
  onSelectArea?: (area: CoverageArea) => void;
  onOpenMapPicker?: () => void;
}

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
      "Boscawen",
      "Bow",
      "Canterbury",
      "Chichester",
      "Concord",
      "Contoocook",
      "Epsom",
      "Henniker",
      "Hopkinton",
      "Loudon",
      "Pembroke",
      "Penacook",
      "Pittsfield",
    ],
  },
  {
    title: "Greater Laconia",
    towns: [
      "Alton",
      "Andover",
      "Ashland",
      "Belmont",
      "Bristol",
      "Franklin",
      "Gilford",
      "Gilmanton",
      "Laconia",
      "Meredith",
      "Moultonborough",
      "New London",
      "Tilton",
      "Warner",
      "Webster",
      "Wolfeboro",
    ],
  },
];

export function CoverageMap({}: CoverageMapProps) {
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

  return (
    <section
      id="coverage"
      className="py-8 sm:py-12 bg-[#faf9f6] border-b border-slate-200 text-slate-800 scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 md:p-8 shadow-xs space-y-6">
            {/* Header: Title & Description on Left, Direct Dispatch Call Button on Right */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2 shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>Mobile Service Fleet</span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  New Hampshire Service Area
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">
                  Mobile locksmith service dispatched across Greater Manchester and surrounding New Hampshire communities.
                </p>
              </div>

              {/* Call Dispatch Button on Right */}
              <a
                href={phoneRaw}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-black text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Dispatch: +1 (603) 290-5554</span>
              </a>
            </div>

            {/* Filter Controls: Regional Tabs + Instant Town Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
              {/* Regional Tabs Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {NH_REGIONS_TOWNS.map((region, idx) => {
                  const isActive = selectedRegionIndex === idx && !searchQuery;
                  return (
                    <button
                      key={region.title}
                      type="button"
                      onClick={() => {
                        setSelectedRegionIndex(idx);
                        setSearchQuery("");
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        isActive
                          ? "bg-slate-900 text-white shadow-xs"
                          : "bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-transparent"
                      }`}
                    >
                      <span>{region.title}</span>
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {region.towns.length}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Instant Search Bar */}
              <div className="relative w-full md:w-64 shrink-0">
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

            {/* Town Chips Container */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80">
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
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{item.town}</span>
                          <span className="text-[10px] text-slate-400 font-normal ml-0.5">
                            ({item.region})
                          </span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 py-2">
                      No specific town found matching &quot;{searchQuery}&quot;. We cover most surrounding areas — call dispatch directly at{" "}
                      <a href={phoneRaw} className="text-emerald-700 font-bold underline">
                        +1 (603) 290-5554
                      </a>.
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {activeRegion.title} Communities
                    </span>
                    <span className="text-xs text-slate-400">
                      {activeRegion.towns.length} towns
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeRegion.towns.map((town) => (
                      <a
                        key={town}
                        href={phoneRaw}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200/90 hover:border-emerald-400 text-xs font-bold text-slate-800 hover:text-emerald-950 transition-all shadow-2xs group cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{town}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Reassurance (Clean, No Arrival Times) */}
              <div className="mt-4 pt-3.5 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 font-medium">
                <span>Mobile locksmith dispatch available across all listed towns.</span>
                <a
                  href={phoneRaw}
                  className="font-bold text-slate-900 hover:text-emerald-700 inline-flex items-center gap-1 transition-colors"
                >
                  <span>Need lockout service? Call (603) 290-5554</span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
