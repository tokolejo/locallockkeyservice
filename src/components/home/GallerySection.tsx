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
  Clock,
} from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SiteSettings } from "@/types/database.types";

export interface GallerySectionProps {
  items?: any[];
  siteSettings?: SiteSettings;
  onOpenCallback?: () => void;
}

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

const GALLERY_ITEMS: GalleryItem[] = [
  {
    "id": "g-ford-explorer",
    "order": 19,
    "title": "Ford Explorer Smart Key Fob & OBD-II Programming",
    "category": "auto",
    "categoryLabel": "Car Keys & Fobs",
    "location": "Manchester, NH",
    "images": [
      "/gallery/jobs/ford-smart-fob-1.jpg",
      "/gallery/jobs/ford-smart-fob-2.jpg"
    ],
    "cover_image": "/gallery/jobs/ford-smart-fob-1.jpg",
    "description": "On-site all-keys-lost origination: Autel diagnostic tablet OBD-II pairing and push-to-start smart key fob generation for Ford Explorer.",
    "dateBadge": "Today"
  },
  {
    "id": "g-cadillac-escalade",
    "order": 18,
    "title": "Cadillac Escalade Advanced ECU Immobilizer Flashing",
    "category": "auto",
    "categoryLabel": "Car Keys & Fobs",
    "location": "Bedford, NH",
    "images": [
      "/gallery/cadillac-car-key.jpg"
    ],
    "cover_image": "/gallery/cadillac-car-key.jpg",
    "description": "High-end GM immobilizer security clearance: online SPS2 module calibration and proximity key sync on new Cadillac Escalade.",
    "dateBadge": "Today"
  },
  {
    "id": "g-toyota-smart-key",
    "order": 17,
    "title": "Toyota Smart Proximity Key Fob Replacement",
    "category": "auto",
    "categoryLabel": "Car Keys & Fobs",
    "location": "Nashua, NH",
    "images": [
      "/gallery/toyota-car-key.jpg"
    ],
    "cover_image": "/gallery/toyota-car-key.jpg",
    "description": "Roadside smart key replacement: laser emergency blade cut and push-to-start proximity remote pairing via Autel tablet.",
    "dateBadge": "Yesterday"
  },
  {
    "id": "g-subaru-laser-key",
    "order": 16,
    "title": "Subaru High-Security Laser Cut Keys & Chip Sync",
    "category": "auto",
    "categoryLabel": "Car Keys & Fobs",
    "location": "Merrimack, NH",
    "images": [
      "/gallery/jobs/subaru-laser-key-programming.jpg"
    ],
    "cover_image": "/gallery/jobs/subaru-laser-key-programming.jpg",
    "description": "Laser side-mill track key duplication and transponder chip synchronization via OBD-II diagnostic computer on Subaru.",
    "dateBadge": "2 days ago"
  },
  {
    "id": "g-nissan-transponder",
    "order": 15,
    "title": "Nissan Transponder Chip Keys & Remote Fob Pairing",
    "category": "auto",
    "categoryLabel": "Car Keys & Fobs",
    "location": "Bedford, NH",
    "images": [
      "/gallery/jobs/nissan-key-programming.jpg"
    ],
    "cover_image": "/gallery/jobs/nissan-key-programming.jpg",
    "description": "Roadside rescue: precision blade cutting for two Nissan chip keys and keyless entry remote paired using XTool diagnostic tablet.",
    "dateBadge": "3 days ago"
  },
  {
    "id": "g-mazda-proximity",
    "order": 14,
    "title": "Mazda Smart Proximity Key Fob Origination",
    "category": "auto",
    "categoryLabel": "Car Keys & Fobs",
    "location": "Manchester, NH",
    "images": [
      "/gallery/mazda-car-key.jpg"
    ],
    "cover_image": "/gallery/mazda-car-key.jpg",
    "description": "All-keys-lost replacement for Mazda: push-button start proximity smart key programmed with full keyless functions.",
    "dateBadge": "4 days ago"
  },
  {
    "id": "g-chevy-flip-key",
    "order": 13,
    "title": "Chevrolet Laser Flip Key Cutting & Programming",
    "category": "auto",
    "categoryLabel": "Car Keys & Fobs",
    "location": "Derry, NH",
    "images": [
      "/gallery/chevrolet-car-key.jpg"
    ],
    "cover_image": "/gallery/chevrolet-car-key.jpg",
    "description": "Precision high-security side-cut flip key origination and remote start immobilizer pairing for Chevrolet.",
    "dateBadge": "5 days ago"
  },
  {
    "id": "g-ford-transit-key",
    "order": 12,
    "title": "Ford Fleet Van Remote Flip Key Programming",
    "category": "auto",
    "categoryLabel": "Car Keys & Fobs",
    "location": "Hooksett, NH",
    "images": [
      "/gallery/ford-car-key.jpg"
    ],
    "cover_image": "/gallery/ford-car-key.jpg",
    "description": "Commercial fleet service: roadside duplicate flip key cutting and onboard immobilizer programming for Ford van.",
    "dateBadge": "1 week ago"
  },
  {
    "id": "g-laser-key-machine",
    "order": 11,
    "title": "Computerized Mobile Laser Key Cutting Machine",
    "category": "auto",
    "categoryLabel": "Car Keys & Fobs",
    "location": "Mobile Service Van",
    "images": [
      "/gallery/key-cutting-machine.jpg"
    ],
    "cover_image": "/gallery/key-cutting-machine.jpg",
    "description": "Factory-spec computerized automatic laser key cutting machine operating inside mobile van for precision roadside key origination.",
    "dateBadge": "1 week ago"
  },
  {
    "id": "g-yale-smart-lock",
    "order": 10,
    "title": "Yale Keyless Touchscreen Smart Deadbolt Installation",
    "category": "locks",
    "categoryLabel": "Residential Locks",
    "location": "Manchester, NH",
    "images": [
      "/gallery/technician-work-2.jpg",
      "/gallery/technician-work-1.jpg"
    ],
    "cover_image": "/gallery/technician-work-2.jpg",
    "description": "Complete inside-and-outside smart lock upgrade: Yale touchscreen electronic deadbolt installed on residential front door with safety chain.",
    "dateBadge": "Today"
  },
  {
    "id": "g-multlock-cylinder",
    "order": 9,
    "title": "Mul-T-Lock MTL 800 High-Security Cylinder & Keys",
    "category": "locks",
    "categoryLabel": "Residential Locks",
    "location": "Manchester, NH",
    "images": [
      "/gallery/jobs/multlock-high-security-cylinder.jpg"
    ],
    "cover_image": "/gallery/jobs/multlock-high-security-cylinder.jpg",
    "description": "Apartment entry security upgrade: pick-proof, drill-resistant Mul-T-Lock MTL 800 interactive cylinder system with duplicated restricted keys.",
    "dateBadge": "Yesterday"
  },
  {
    "id": "g-blue-door-cylinder",
    "order": 8,
    "title": "High-Security Cylinder & Architectural Lever Installation",
    "category": "locks",
    "categoryLabel": "Residential Locks",
    "location": "Concord, NH",
    "images": [
      "/gallery/van-work.jpg"
    ],
    "cover_image": "/gallery/van-work.jpg",
    "description": "Modern entrance door security: high-security cylinder, architectural lever handle, and precision dimple keys on entrance door.",
    "dateBadge": "3 days ago"
  },
  {
    "id": "g-brass-deadbolt-lockset",
    "order": 7,
    "title": "Polished Brass Deadbolt & Entry Knob Lockset Upgrade",
    "category": "locks",
    "categoryLabel": "Residential Locks",
    "location": "Bedford, NH",
    "images": [
      "/gallery/technician-work-3.jpg"
    ],
    "cover_image": "/gallery/technician-work-3.jpg",
    "description": "Classic residential entry upgrade: heavy solid brass deadbolt lock and matching knob lockset keyed alike on apartment door.",
    "dateBadge": "4 days ago"
  },
  {
    "id": "g-interior-knob-latch",
    "order": 6,
    "title": "Interior Door Passage Knob & Latch Assembly",
    "category": "locks",
    "categoryLabel": "Residential Locks",
    "location": "Londonderry, NH",
    "images": [
      "/gallery/lock-repair-door.jpg"
    ],
    "cover_image": "/gallery/lock-repair-door.jpg",
    "description": "Home door hardware replacement: modern matte black passage knob and latch mechanism installation on interior wooden door.",
    "dateBadge": "1 week ago"
  },
  {
    "id": "g-storefront-mortise",
    "order": 5,
    "title": "Storefront Glass Door Mortise Lock & Lever Handle",
    "category": "commercial",
    "categoryLabel": "Commercial Doors",
    "location": "Manchester, NH",
    "images": [
      "/gallery/jobs/storefront-mortise-lock-1.jpg",
      "/gallery/jobs/storefront-mortise-lock-2.jpg"
    ],
    "cover_image": "/gallery/jobs/storefront-mortise-lock-1.jpg",
    "description": "Commercial storefront entrance door service: front mortise cylinder replacement, heavy-duty latch mechanism, and commercial lever handle.",
    "dateBadge": "Yesterday"
  },
  {
    "id": "g-securitech-multipoint",
    "order": 4,
    "title": "Securitech Multi-Point Commercial Entrance Lock Service",
    "category": "commercial",
    "categoryLabel": "Commercial Doors",
    "location": "Manchester, NH",
    "images": [
      "/gallery/jobs/securitech-multipoint-lock.jpg"
    ],
    "cover_image": "/gallery/jobs/securitech-multipoint-lock.jpg",
    "description": "Multi-point deadlocking security mechanism and heavy-duty architectural lever set serviced on commercial entrance door with intercom.",
    "dateBadge": "2 days ago"
  },
  {
    "id": "g-commercial-panic-bar",
    "order": 3,
    "title": "Heavy-Duty Emergency Panic Exit Crash Bar Installation",
    "category": "commercial",
    "categoryLabel": "Commercial Doors",
    "location": "Concord, NH",
    "images": [
      "/gallery/jobs/commercial-panic-bar-exit.jpg"
    ],
    "cover_image": "/gallery/jobs/commercial-panic-bar-exit.jpg",
    "description": "Life safety & fire-code compliant commercial panic exit push bar and exterior rim cylinder trim installed on heavy steel exit door.",
    "dateBadge": "3 days ago"
  },
  {
    "id": "g-electric-strike-frame",
    "order": 2,
    "title": "Access Control Low-Voltage Electric Strike Frame Retrofit",
    "category": "commercial",
    "categoryLabel": "Commercial Doors",
    "location": "Manchester, NH",
    "images": [
      "/gallery/jobs/commercial-electric-strike.jpg"
    ],
    "cover_image": "/gallery/jobs/commercial-electric-strike.jpg",
    "description": "Precision metal frame cutout and low-voltage electric strike installation for building intercom buzzer integration.",
    "dateBadge": "5 days ago"
  },
  {
    "id": "g-steel-door-mortise",
    "order": 1,
    "title": "Commercial Steel Door Mortise Lock Replacement",
    "category": "commercial",
    "categoryLabel": "Commercial Doors",
    "location": "Nashua, NH",
    "images": [
      "/gallery/jobs/commercial-steel-door-mortise.jpg"
    ],
    "cover_image": "/gallery/jobs/commercial-steel-door-mortise.jpg",
    "description": "Heavy-duty brass mortise cylinder installation, deadlocking latch service, and exterior handle alignment on warehouse steel door.",
    "dateBadge": "1 week ago"
  }
];

export function GallerySection({
  items,
  siteSettings,
  onOpenCallback,
}: GallerySectionProps) {
  const [filter, setFilter] = useState<"all" | "auto" | "locks" | "commercial">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedJob, setSelectedJob] = useState<GalleryItem | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

  // 3 items initially on both desktop and mobile
  const INITIAL_COUNT = 3;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_COUNT);

  const phone = siteSettings?.phone_display || process.env.NEXT_PUBLIC_DISPATCH_PHONE || "+1 (603) 290-5554";
  const phoneRaw = siteSettings?.phone_raw || process.env.NEXT_PUBLIC_DISPATCH_PHONE_RAW || "tel:+16032905554";

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

  // Lock body scroll and handle keyboard navigation for lightbox
  useEffect(() => {
    if (!selectedJob) return;

    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

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
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
      window.removeEventListener("keydown", handleKeyDown);
    };
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
                <span>Real Work Portfolio &amp; Proof</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Recent Jobs Across Our Service Area
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
                Authentic on-site photos from our certified mobile technicians: precision car key programming, high-security cylinders, and commercial door hardware.
              </p>
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
                Call our mobile dispatch hub now for immediate free phone estimates and fast NH mobile dispatch.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto">
              <a
                href={phoneRaw}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-98 cursor-pointer text-center"
              >
                <PhoneCall className="w-4 h-4 text-white shrink-0" />
                <span>Call Dispatch Now</span>
              </a>
              <button
                type="button"
                onClick={onOpenCallback}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-950 hover:bg-black text-white font-bold text-xs sm:text-sm transition-all border border-slate-700 active:scale-98 cursor-pointer text-center"
              >
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Request Callback</span>
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Lightbox Modal with Multi-Photo Switcher */}
      {selectedJob && (
        <div
          onClick={() => setSelectedJob(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:p-6 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-white flex flex-col max-h-[calc(100dvh-5.5rem)] sm:max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedJob(null)}
              aria-label="Close"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition cursor-pointer backdrop-blur-sm shadow-md"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Frame with Carousel Controls */}
            <div className="relative aspect-4/3 sm:aspect-16/10 max-h-[38vh] sm:max-h-[48vh] w-full bg-black shrink-0 overflow-hidden group/modal">
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
              <div className="bg-slate-950 px-4 sm:px-6 py-2 border-t border-slate-800 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar shrink-0">
                <span className="text-[11px] font-semibold text-slate-400 mr-1 shrink-0">
                  Photos:
                </span>
                {modalImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative w-12 h-10 sm:w-14 sm:h-11 rounded-lg overflow-hidden border-2 transition cursor-pointer shrink-0 ${
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
            <div className="p-4 sm:p-6 bg-slate-900 space-y-3 overflow-y-auto overscroll-contain flex-1">
              <div className="flex items-center justify-between gap-4">
                <span className="px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 font-bold text-xs">
                  {selectedJob.categoryLabel}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {selectedJob.location} • {selectedJob.dateBadge}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold leading-snug">
                {selectedJob.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedJob.description}
              </p>

              {/* Desktop Only Action Row (Hidden on mobile as floating bottom bar covers CTAs) */}
              <div className="hidden sm:flex pt-3 border-t border-slate-800 items-center justify-between gap-3 shrink-0">
                <span className="text-xs text-slate-400 font-medium text-left">
                  24/7 Mobile Dispatch Across NH
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={phoneRaw}
                    className="flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-black text-white font-bold text-xs transition border border-slate-700 active:scale-98"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    <span>CALL</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJob(null);
                      onOpenCallback?.();
                    }}
                    className="flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition active:scale-98 cursor-pointer shadow-sm"
                  >
                    <Clock className="w-3.5 h-3.5 text-emerald-100" />
                    <span>Request Callback</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
