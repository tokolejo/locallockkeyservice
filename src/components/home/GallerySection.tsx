"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Camera,
  CheckCircle2,
  X,
  PhoneCall,
  Car,
  Home,
  Building2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Images,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

interface GalleryItem {
  id: string;
  order: number; // Higher means newer
  title: string;
  category: "auto" | "locks" | "commercial";
  categoryLabel: string;
  location: string;
  images: string[];
  cover_image?: string;
  description: string;
  dateBadge: string;
}

export interface GallerySectionProps {
  items?: any[];
  siteSettings?: any;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g-ford",
    order: 10,
    title: "Ford Explorer Smart Key Fob & OBD-II Programming",
    category: "auto",
    categoryLabel: "Car Keys & Fobs",
    location: "Manchester, NH",
    images: [
      "/gallery/jobs/ford-smart-fob-1.jpg",
      "/gallery/jobs/ford-smart-fob-2.jpg",
    ],
    cover_image: "/gallery/jobs/ford-smart-fob-1.jpg",
    description: "Push-to-start smart key fob generation and immobilizer programming for Ford Explorer using our Autel MaxiIM diagnostic tablet on-site.",
    dateBadge: "Today",
  },
  {
    id: "g-storefront",
    order: 9,
    title: "Storefront Glass Door Mortise Lock & Commercial Lever",
    category: "commercial",
    categoryLabel: "Commercial Doors",
    location: "Manchester, NH",
    images: [
      "/gallery/jobs/storefront-mortise-lock-1.jpg",
      "/gallery/jobs/storefront-mortise-lock-2.jpg",
    ],
    cover_image: "/gallery/jobs/storefront-mortise-lock-1.jpg",
    description: "Complete storefront aluminum entrance door lock installation: high-security mortise cylinder, latch mechanism, and commercial lever handle.",
    dateBadge: "Yesterday",
  },
  {
    id: "g-lockout",
    order: 8,
    title: "Emergency Vehicle Lockout - Zero Damage Roadside Rescue",
    category: "auto",
    categoryLabel: "Lockout Rescue",
    location: "Nashua, NH",
    images: [
      "/gallery/technician-work-1.jpg",
      "/gallery/technician-work-2.jpg",
      "/gallery/technician-work-3.jpg",
    ],
    cover_image: "/gallery/technician-work-1.jpg",
    description: "Rapid non-destructive vehicle entry: automotive air-wedge bypass tools and long-reach equipment used on-site with 100% zero damage.",
    dateBadge: "2 days ago",
  },
  {
    id: "g-nissan",
    order: 7,
    title: "Nissan Transponder Keys & Remote Pairing",
    category: "auto",
    categoryLabel: "Car Keys & Fobs",
    location: "Bedford, NH",
    images: [
      "/gallery/jobs/nissan-key-programming.jpg",
    ],
    cover_image: "/gallery/jobs/nissan-key-programming.jpg",
    description: "All-keys-lost roadside rescue: precision blade cutting for two Nissan chip keys and remote programming via OBD-II tablet.",
    dateBadge: "3 days ago",
  },
  {
    id: "g-multlock",
    order: 6,
    title: "Mul-T-Lock MTL 800 High-Security Cylinder Upgrade",
    category: "locks",
    categoryLabel: "Residential Locks",
    location: "Manchester, NH",
    images: [
      "/gallery/jobs/multlock-high-security-cylinder.jpg",
      "/gallery/lock-repair-door.jpg",
    ],
    cover_image: "/gallery/jobs/multlock-high-security-cylinder.jpg",
    description: "Home security upgrade: drill-resistant, pick-proof Mul-T-Lock MTL 800 interactive cylinder system and duplicate security keys installed on front door.",
    dateBadge: "4 days ago",
  },
  {
    id: "g-subaru",
    order: 5,
    title: "Subaru Laser Cut Key Origination & Chip Sync",
    category: "auto",
    categoryLabel: "Car Keys & Fobs",
    location: "Merrimack, NH",
    images: [
      "/gallery/jobs/subaru-laser-key-programming.jpg",
      "/gallery/key-cutting-machine.jpg",
    ],
    cover_image: "/gallery/jobs/subaru-laser-key-programming.jpg",
    description: "High-security laser side-mill key duplication with integrated remote heads cut and programmed via computerized machine inside mobile van.",
    dateBadge: "5 days ago",
  },
  {
    id: "g-panic-bar",
    order: 4,
    title: "Commercial Fire-Exit Panic Crash Bar Installation",
    category: "commercial",
    categoryLabel: "Commercial Doors",
    location: "Concord, NH",
    images: [
      "/gallery/jobs/commercial-panic-bar-exit.jpg",
    ],
    cover_image: "/gallery/jobs/commercial-panic-bar-exit.jpg",
    description: "Fire-code compliant commercial panic exit push bar and exterior rim cylinder trim installed on heavy steel exit door.",
    dateBadge: "1 week ago",
  },
  {
    id: "g-electric-strike",
    order: 3,
    title: "Access Control Electric Strike Frame Retrofit",
    category: "commercial",
    categoryLabel: "Commercial & Access",
    location: "Manchester, NH",
    images: [
      "/gallery/jobs/commercial-electric-strike.jpg",
    ],
    cover_image: "/gallery/jobs/commercial-electric-strike.jpg",
    description: "Precision steel frame cutout and low-voltage electric strike installation for commercial building intercom buzzer entry.",
    dateBadge: "1 week ago",
  },
  {
    id: "g-securitech",
    order: 2,
    title: "Securitech Multi-Point Lever Lock Service",
    category: "commercial",
    categoryLabel: "Commercial Doors",
    location: "Manchester, NH",
    images: [
      "/gallery/jobs/securitech-multipoint-lock.jpg",
      "/gallery/jobs/commercial-steel-door-mortise.jpg",
    ],
    cover_image: "/gallery/jobs/securitech-multipoint-lock.jpg",
    description: "Multi-point deadlocking security mechanism and heavy-duty architectural lever set installed on commercial entrance door.",
    dateBadge: "2 weeks ago",
  },
  {
    id: "g-toyota",
    order: 1,
    title: "Toyota Smart Proximity Key Fob Replacement",
    category: "auto",
    categoryLabel: "Car Keys & Fobs",
    location: "Derry, NH",
    images: [
      "/gallery/toyota-car-key.jpg",
    ],
    cover_image: "/gallery/toyota-car-key.jpg",
    description: "Emergency roadside proximity key replacement for Toyota: precision emergency blade cut and push-to-start smart fob paired on-site.",
    dateBadge: "2 weeks ago",
  },
];

export function GallerySection({ items, siteSettings }: GallerySectionProps) {
  const [filter, setFilter] = useState<"all" | "auto" | "locks" | "commercial">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedJob, setSelectedJob] = useState<GalleryItem | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

  // 3 items initially on both desktop and mobile
  const INITIAL_COUNT = 3;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_COUNT);

  const phone = siteSettings?.phone_display || process.env.NEXT_PUBLIC_DISPATCH_PHONE || "+1 (603) 290-5554";
  const phoneRaw = siteSettings?.phone_raw || process.env.NEXT_PUBLIC_DISPATCH_PHONE_RAW || "tel:+16032905554";
  const whatsappNumber = siteSettings?.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "+16032905554";
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hello! I need mobile locksmith assistance in Manchester, NH.")}`;

  const rawList: GalleryItem[] = useMemo(() => {
    if (items && items.length > 0) {
      return items
        .filter((it: any) => it.is_active !== false)
        .map((it: any) => {
          const validImgs: string[] = Array.isArray(it.images)
            ? it.images.filter((img: any) => typeof img === "string" && img.trim().length > 0)
            : [];
          const validCover = (typeof it.cover_image === "string" && it.cover_image.trim().length > 0)
            ? it.cover_image.trim()
            : validImgs[0] || "/gallery/hero-banner.png";
          const finalImgs = validImgs.length > 0 ? validImgs : [validCover];

          return {
            id: it.id,
            order: it.display_order ?? it.order ?? 0,
            title: it.title || "Locksmith Service",
            category: it.category || "commercial",
            categoryLabel: it.category_label || it.categoryLabel || "Service Work",
            location: it.location || "Manchester, NH",
            images: finalImgs,
            cover_image: validCover,
            description: it.description || "",
            dateBadge: it.date_badge || it.dateBadge || "Recent",
          };
        });
    }
    return GALLERY_ITEMS;
  }, [items]);

  // Filter and sort items
  const processedItems = useMemo(() => {
    const list = filter === "all" ? [...rawList] : rawList.filter((item) => item.category === filter);

    list.sort((a, b) => {
      if (sortOrder === "newest") {
        return b.order - a.order;
      } else {
        return a.order - b.order;
      }
    });

    return list;
  }, [filter, sortOrder, rawList]);

  const displayedItems = processedItems.slice(0, visibleCount);
  const hasMore = visibleCount < processedItems.length;

  const filterTabs = useMemo(() => [
    { id: "all" as const, label: `All (${rawList.length})`, icon: Images },
    { id: "auto" as const, label: "Car Keys", icon: Car },
    { id: "locks" as const, label: "Locks", icon: Home },
    { id: "commercial" as const, label: "Commercial Doors", icon: Building2 },
  ], [rawList.length]);

  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const handleFilterChange = (newFilter: "all" | "auto" | "locks" | "commercial") => {
    setFilter(newFilter);
    setVisibleCount(INITIAL_COUNT);
  };

  const handlePrevCategory = () => {
    const currentIndex = filterTabs.findIndex((t) => t.id === filter);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : filterTabs.length - 1;
    handleFilterChange(filterTabs[prevIndex].id);
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({ left: -140, behavior: "smooth" });
    }
  };

  const handleNextCategory = () => {
    const currentIndex = filterTabs.findIndex((t) => t.id === filter);
    const nextIndex = currentIndex < filterTabs.length - 1 ? currentIndex + 1 : 0;
    handleFilterChange(filterTabs[nextIndex].id);
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({ left: 140, behavior: "smooth" });
    }
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
  };

  const handleOpenJobModal = (job: GalleryItem) => {
    setSelectedJob(job);
    setActivePhotoIdx(0);
  };

  const modalImages = useMemo(() => {
    if (!selectedJob) return [];
    const validList = (selectedJob.images || []).filter(
      (img) => typeof img === "string" && img.trim().length > 0
    );
    if (validList.length > 0) return validList;
    if (selectedJob.cover_image && selectedJob.cover_image.trim().length > 0) {
      return [selectedJob.cover_image.trim()];
    }
    return ["/gallery/hero-banner.png"];
  }, [selectedJob]);

  const currentModalImage = modalImages[activePhotoIdx] || modalImages[0] || "/gallery/hero-banner.png";

  const handleNextPhoto = useCallback(() => {
    if (modalImages.length <= 1) return;
    setActivePhotoIdx((prev) => (prev + 1) % modalImages.length);
  }, [modalImages.length]);

  const handlePrevPhoto = useCallback(() => {
    if (modalImages.length <= 1) return;
    setActivePhotoIdx((prev) => (prev - 1 + modalImages.length) % modalImages.length);
  }, [modalImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!selectedJob) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedJob(null);
      } else if (e.key === "ArrowRight") {
        handleNextPhoto();
      } else if (e.key === "ArrowLeft") {
        handlePrevPhoto();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedJob, handleNextPhoto, handlePrevPhoto]);

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-white border-b border-slate-200 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3 shadow-2xs">
                <Camera className="w-3.5 h-3.5 text-emerald-600" />
                <span>Real Work Portfolio & Proof</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Recent Jobs Across Manchester & NH
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
                Authentic on-site photos from our certified mobile technicians: precision car key programming, high-security cylinders, and commercial door hardware.
              </p>
            </div>

            {/* Damage-Free Guarantee Proof Badge */}
            <div className="flex items-center gap-3.5 bg-gradient-to-br from-white to-emerald-50/50 border border-emerald-200/80 rounded-2xl p-3 sm:p-3.5 shadow-2xs w-full md:w-auto md:shrink-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center shadow-sm shadow-emerald-700/25 shrink-0 ring-4 ring-emerald-50">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-extrabold text-slate-900 text-xs sm:text-sm">Damage-Free Guarantee</p>
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black leading-none tracking-wide">
                    100%
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5">Certified Mobile Technicians</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Filter and Sorting Controls Toolbar */}
        <ScrollReveal direction="up" delay={0.08}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
            {/* Horizontal Category Switcher matching ServicesSection reference */}
            <div className="p-1 sm:p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 shadow-inner flex items-center gap-0.5 sm:gap-1 flex-1 max-w-2xl">
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
                {filterTabs.map((tab) => {
                  const isActive = filter === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleFilterChange(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap text-center ${
                        isActive
                          ? "bg-emerald-700 text-white shadow-sm shadow-emerald-700/20"
                          : "text-slate-700 hover:text-slate-900 hover:bg-white/60"
                      }`}
                    >
                      <span className="shrink-0">
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </span>
                      <span className="leading-tight text-[11px] sm:text-xs">{tab.label}</span>
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

            {/* Sort Toggle Button */}
            <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
              <span className="text-xs font-semibold text-slate-500 sm:hidden">
                {processedItems.length} {processedItems.length === 1 ? "job" : "jobs"}
              </span>
              <button
                type="button"
                onClick={toggleSort}
                className="flex items-center gap-1.5 px-3.5 py-2 sm:py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold shadow-2xs hover:shadow-xs transition cursor-pointer"
                title="Toggle Date Sort"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                <span>{sortOrder === "newest" ? "Newest First" : "Oldest First"}</span>
                {sortOrder === "newest" ? (
                  <ArrowDown className="w-3 h-3 text-emerald-600" />
                ) : (
                  <ArrowUp className="w-3 h-3 text-emerald-600" />
                )}
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Gallery Grid: 3 Columns on desktop = Exactly 2 Rows for 6 items initially */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((item, idx) => {
            const photoCount = item.images.length;

            return (
              <ScrollReveal key={item.id} direction="up" delay={idx * 0.05} scale>
                <div
                  onClick={() => handleOpenJobModal(item)}
                  className="group relative bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-2xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer flex flex-col"
                >
                  {/* Photo Frame */}
                  <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={
                        (typeof item.cover_image === "string" && item.cover_image.trim()) ||
                        (typeof item.images?.[0] === "string" && item.images[0].trim()) ||
                        "/gallery/hero-banner.png"
                      }
                      alt={item.title || "Locksmith Work"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-65 group-hover:opacity-85 transition-opacity" />

                    {/* Top Left: Category & Multi-photo Indicator Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md text-[11px] font-bold text-white border border-white/20">
                        {item.categoryLabel}
                      </span>
                      {photoCount > 1 && (
                        <span className="px-2 py-1 rounded-lg bg-emerald-950/90 backdrop-blur-md text-[11px] font-bold text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow-sm">
                          <Images className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{photoCount} Photos</span>
                        </span>
                      )}
                    </div>

                    {/* Top Right Date Indicator */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 backdrop-blur-md text-[10px] font-semibold text-emerald-300 border border-emerald-500/40">
                        {item.dateBadge}
                      </span>
                    </div>

                    {/* Bottom Location */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <span className="text-xs font-semibold drop-shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {item.location}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/85 px-2.5 py-1 rounded-lg border border-emerald-500/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        <span>View Details</span>
                      </span>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-800 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        Verified Job
                      </span>
                      <span className="font-medium text-slate-500">Manchester Metro</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Load More / Show Less Button */}
        <div className="mt-10 flex justify-center">
          {hasMore ? (
            <button
              onClick={() => setVisibleCount((prev) => prev + 3)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer"
            >
              <span>Load More Jobs</span>
              <ChevronDown className="w-4 h-4 text-emerald-400" />
            </button>
          ) : processedItems.length > INITIAL_COUNT ? (
            <button
              onClick={() => {
                setVisibleCount(INITIAL_COUNT);
                const galleryEl = document.getElementById("gallery");
                if (galleryEl) {
                  galleryEl.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              <span>Show Less</span>
              <ChevronUp className="w-3.5 h-3.5 text-slate-600" />
            </button>
          ) : null}
        </div>

        {/* Bottom Call Banner */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="mt-14 bg-linear-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-slate-700">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                Need Fast Lockout or Key Assistance in Manchester & NH?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm">
                Call our mobile dispatch hub now for immediate free phone estimates and 15-20 min arrival.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <a
                href={phoneRaw}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-950 hover:bg-black text-white font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95 border border-slate-700"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>CALL</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Lightbox Modal with Multi-Photo Switcher */}
      {selectedJob && (
        <div
          onClick={() => setSelectedJob(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-white flex flex-col max-h-[92vh]"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedJob(null)}
              aria-label="Close"
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition cursor-pointer backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Frame with Carousel Controls */}
            <div className="relative aspect-4/3 sm:aspect-16/10 w-full bg-black shrink-0 overflow-hidden group/modal">
              {currentModalImage ? (
                <Image
                  src={currentModalImage}
                  alt={selectedJob.title}
                  fill
                  priority
                  className="object-contain"
                />
              ) : null}

              {/* Photo Counter Badge */}
              {modalImages.length > 1 && (
                <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-1.5">
                  <Images className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {activePhotoIdx + 1} / {modalImages.length}
                  </span>
                </div>
              )}

              {/* Previous / Next Arrow Controls */}
              {modalImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevPhoto();
                    }}
                    aria-label="Previous photo"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-sm hover:scale-105 active:scale-95"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextPhoto();
                    }}
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-sm hover:scale-105 active:scale-95"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Interactive Photo Thumbnail Switcher (if multi-photo) */}
            {modalImages.length > 1 && (
              <div className="bg-slate-950 px-6 py-2.5 border-t border-slate-800 flex items-center justify-center gap-3 shrink-0">
                <span className="text-[11px] font-semibold text-slate-400 mr-1">
                  Job Photos:
                </span>
                {modalImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative w-14 h-11 rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                      activePhotoIdx === idx
                        ? "border-emerald-500 scale-105 shadow-md shadow-emerald-500/20"
                        : "border-slate-700 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Modal Details */}
            <div className="p-6 bg-slate-900 space-y-3 overflow-y-auto">
              <div className="flex items-center justify-between gap-4">
                <span className="px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 font-bold text-xs">
                  {selectedJob.categoryLabel}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {selectedJob.location} • {selectedJob.dateBadge}
                </span>
              </div>
              <h3 className="text-xl font-bold">
                {selectedJob.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedJob.description}
              </p>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  Instant Dispatch
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={phoneRaw}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition border border-slate-700"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    <span>CALL</span>
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
