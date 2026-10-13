"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PhoneCall,
  Menu,
  X,
  Navigation,
  Wrench,
  Calculator,
  Car,
  MapPin,
  Star,
  ShieldCheck,
  ChevronRight,
  Camera,
  Clock,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { SiteSettings } from "@/types/database.types";

interface HeaderProps {
  siteSettings?: SiteSettings;
  onOpenDispatch?: (prefill?: { category?: string; subType?: string }) => void;
  onOpenMapPicker?: () => void;
  onOpenCallback?: () => void;
}

export function Header({
  siteSettings,
  onOpenDispatch,
  onOpenMapPicker,
  onOpenCallback,
}: HeaderProps) {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const sectionIds = ["about", "services", "gallery", "coverage", "reviews"];

    const handleScroll = () => {
      const headerOffset = 140;

      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 60
      ) {
        setActiveSection("reviews");
        return;
      }

      let current = "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= headerOffset && rect.bottom > headerOffset) {
            current = id;
            break;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "about", label: "About Us" },
    { id: "services", label: t("nav_services") },
    { id: "gallery", label: t("nav_gallery") },
    { id: "coverage", label: t("nav_coverage") },
    { id: "reviews", label: t("nav_reviews") },
  ];

  const phone = siteSettings?.phone_display || process.env.NEXT_PUBLIC_DISPATCH_PHONE || "+1 (603) 290-5554";
  const phoneRaw = siteSettings?.phone_raw || process.env.NEXT_PUBLIC_DISPATCH_PHONE_RAW || "tel:+16032905554";

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const wasMenuOpen = mobileMenuOpen;
    if (wasMenuOpen) {
      setMobileMenuOpen(false);
    }

    if (typeof window === "undefined") return;

    if (window.location.pathname !== "/") {
      window.location.href = targetId === "top" ? "/" : `/#${targetId}`;
      return;
    }

    if (targetId === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (window.location.hash) {
        window.history.pushState(null, "", window.location.pathname);
      }
      return;
    }

    const executeScroll = () => {
      const element = document.getElementById(targetId);
      if (element) {
        let actualTop = 0;
        let curr: HTMLElement | null = element;
        while (curr) {
          actualTop += curr.offsetTop;
          curr = curr.offsetParent as HTMLElement | null;
        }

        // Generous offset so sticky header never clips badges or titles
        const headerOffset = window.innerWidth >= 768 ? 115 : 95;
        const targetScroll = Math.max(0, actualTop - headerOffset);

        window.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });

        window.history.pushState(null, "", `#${targetId}`);
      }
    };

    if (wasMenuOpen) {
      setTimeout(executeScroll, 120);
    } else {
      executeScroll();
    }
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs text-slate-800 transition-colors">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-18 sm:h-20 md:h-22 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center shrink-0">
          <Link
            href="/"
            onClick={(e) => handleScrollTo(e, "top")}
            className="flex items-center group cursor-pointer shrink-0 py-1"
            title="Local Lock & Key Service - Manchester NH Locksmith"
            aria-label="Local Lock & Key Service - Manchester NH Locksmith"
          >
            <img
              src="/gallery/logo.png"
              alt="Local Lock & Key Service Logo"
              className="h-11 sm:h-13 md:h-15 w-auto max-w-[240px] sm:max-w-[300px] md:max-w-[340px] object-contain transition-transform duration-200 group-hover:scale-[1.03]"
            />
          </Link>
        </div>

        {/* Center: Desktop Quick Nav Links with Clean Scrollspy Highlight */}
        <nav className="hidden lg:flex items-center justify-center gap-1.5 xl:gap-2 text-sm font-semibold text-slate-700 flex-1 px-4">
          {navLinks.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleScrollTo(e, item.id)}
                className={`px-3 py-1.5 rounded-lg transition-all duration-150 ${
                  isActive
                    ? "text-emerald-800 bg-emerald-50 font-bold border border-emerald-200/80 shadow-2xs"
                    : "text-slate-600 hover:text-emerald-700 hover:bg-slate-50 border border-transparent"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right: Desktop Actions */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenCallback}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs hover:shadow active:scale-[0.98] cursor-pointer"
          >
            <Clock className="w-4 h-4 text-emerald-100" />
            <span>Request Callback</span>
          </button>

          <a
            href={phoneRaw}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs hover:shadow active:scale-[0.98]"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>CALL</span>
          </a>
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <div className="flex md:hidden items-center shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition cursor-pointer shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-slate-900" />
            ) : (
              <Menu className="w-5 h-5 text-slate-900" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer (Smooth, full-width with clean icons) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150">
          {/* Nav Links with Clear Icons & Scrollspy Sync */}
          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-800 pt-1">
            <a
              href="#about"
              onClick={(e) => handleScrollTo(e, "about")}
              className={`flex items-center gap-2 p-3 rounded-xl border transition-colors ${
                activeSection === "about"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                  : "bg-slate-50 hover:bg-emerald-50/50 border-slate-200/80 text-slate-800"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="truncate">About Us</span>
            </a>

            <a
              href="#services"
              onClick={(e) => handleScrollTo(e, "services")}
              className={`flex items-center gap-2 p-3 rounded-xl border transition-colors ${
                activeSection === "services"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                  : "bg-slate-50 hover:bg-emerald-50/50 border-slate-200/80 text-slate-800"
              }`}
            >
              <Wrench className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="truncate">{t("nav_services")}</span>
            </a>

            <a
              href="#gallery"
              onClick={(e) => handleScrollTo(e, "gallery")}
              className={`flex items-center gap-2 p-3 rounded-xl border transition-colors ${
                activeSection === "gallery"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                  : "bg-slate-50 hover:bg-emerald-50/50 border-slate-200/80 text-slate-800"
              }`}
            >
              <Camera className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="truncate">{t("nav_gallery")}</span>
            </a>

            <a
              href="#coverage"
              onClick={(e) => handleScrollTo(e, "coverage")}
              className={`flex items-center gap-2 p-3 rounded-xl border transition-colors ${
                activeSection === "coverage"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                  : "bg-slate-50 hover:bg-emerald-50/50 border-slate-200/80 text-slate-800"
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="truncate">{t("nav_coverage")}</span>
            </a>

            <a
              href="#reviews"
              onClick={(e) => handleScrollTo(e, "reviews")}
              className={`col-span-2 flex items-center justify-center gap-2 p-3 rounded-xl border transition-colors text-center ${
                activeSection === "reviews"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                  : "bg-slate-50 hover:bg-emerald-50/50 border-slate-200/80 text-slate-800"
              }`}
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
              <span>{t("nav_reviews")}</span>
            </a>
          </div>

          {/* Quick Action Buttons in Menu */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCallback?.();
              }}
              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-emerald-100" />
              <span>Request Callback</span>
            </button>

            <a
              href={phoneRaw}
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-2xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>CALL</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
