"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

import {
  LocationItem,
  RegionGroup,
  NH_SERVICE_AREAS_DATA,
} from "@/lib/data/coverage-areas";

export type { LocationItem, RegionGroup };
export { NH_SERVICE_AREAS_DATA };

export function CoverageMap() {
  const [searchQuery, setSearchQuery] = useState("");
  // All regions 100% collapsed by default
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});

  const totalTowns = useMemo(() => {
    return NH_SERVICE_AREAS_DATA.reduce((acc, curr) => acc + curr.locations.length, 0);
  }, []);

  const toggleRegion = (regionName: string) => {
    setExpandedRegions((prev) => ({
      ...prev,
      [regionName]: !prev[regionName],
    }));
  };

  const isAllExpanded = useMemo(() => {
    return NH_SERVICE_AREAS_DATA.every((g) => expandedRegions[g.region]);
  }, [expandedRegions]);

  const toggleAll = () => {
    const nextState = !isAllExpanded;
    const updated: Record<string, boolean> = {};
    NH_SERVICE_AREAS_DATA.forEach((g) => {
      updated[g.region] = nextState;
    });
    setExpandedRegions(updated);
  };

  const filteredAreas = useMemo(() => {
    if (!searchQuery.trim()) return NH_SERVICE_AREAS_DATA;
    const q = searchQuery.toLowerCase().trim();

    return NH_SERVICE_AREAS_DATA.map((group) => {
      const matchingLocations = group.locations.filter(
        (loc) =>
          loc.city.toLowerCase().includes(q) ||
          loc.zip.includes(q) ||
          group.region.toLowerCase().includes(q)
      );
      return {
        ...group,
        locations: matchingLocations,
      };
    }).filter((group) => group.locations.length > 0);
  }, [searchQuery]);

  return (
    <section
      id="coverage"
      className="py-10 sm:py-14 bg-white border-b border-slate-200 text-slate-800 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          {/* Header Row: Title & Subtitle + Search & Toggle (Standard full max-w-7xl width) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                New Hampshire Service Area
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Serving {totalTowns}+ towns across Greater Manchester, Nashua, Concord, Salem, Derry &amp; Laconia.
              </p>
            </div>

            {/* Compact Controls */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search town or ZIP..."
                  className="w-full pl-8 pr-7 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
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

              {!searchQuery && (
                <button
                  type="button"
                  onClick={toggleAll}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer shrink-0 active:scale-95"
                >
                  <ChevronsUpDown className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isAllExpanded ? "Collapse All" : "Expand All"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Harmonized 3-Column Grid across full 7xl layout - items-start ensures collapsed cards don't stretch */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-5 items-start">
            {filteredAreas.map((group) => {
              const isSearching = !!searchQuery.trim();
              const isExpanded = isSearching || !!expandedRegions[group.region];

              return (
                <div
                  key={group.region}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? "border-slate-300 bg-white shadow-sm ring-1 ring-slate-200"
                      : "border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 hover:border-slate-300"
                  }`}
                >
                  {/* Compact Accordion Header */}
                  <button
                    type="button"
                    onClick={() => !isSearching && toggleRegion(group.region)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer transition select-none"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold text-slate-900 text-sm tracking-tight truncate">
                        {group.region}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 bg-white/80 border border-slate-200/80 px-2 py-0.5 rounded-full shrink-0">
                        {group.locations.length} {group.region === "Manchester" ? "ZIPs" : "Towns"}
                      </span>
                    </div>

                    <div className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 group-hover:text-slate-700 transition-colors shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Town & ZIP Pills Grid */}
                  {isExpanded && (
                    <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-100 bg-white">
                      <div className="grid grid-cols-1 gap-1 max-h-80 overflow-y-auto pr-1">
                        {group.locations.map((loc) => (
                          <div
                            key={loc.full}
                            className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                          >
                            <span className="text-xs font-medium text-slate-700 truncate">
                              {loc.city}, {loc.state}
                            </span>
                            <span className="text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50/80 px-1.5 py-0.5 rounded border border-emerald-100 shrink-0">
                              {loc.zip}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredAreas.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-500">
              No towns or ZIP codes found matching &quot;{searchQuery}&quot;.
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
