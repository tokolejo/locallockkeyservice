"use client";

import React, { useState } from "react";
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
  MessageCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { SiteSettings } from "@/types/database.types";

interface HeaderProps {
  siteSettings?: SiteSettings;
  onOpenDispatch?: (prefill?: { category?: string; subType?: string }) => void;
  onOpenMapPicker?: () => void;
}

export function Header({ siteSettings, onOpenDispatch, onOpenMapPicker }: HeaderProps) {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const phone = siteSettings?.phone_display || process.env.NEXT_PUBLIC_DISPATCH_PHONE || "+1 (603) 290-5554";
  const phoneRaw = siteSettings?.phone_raw || process.env.NEXT_PUBLIC_DISPATCH_PHONE_RAW || "tel:+16032905554";
  const rawWa = siteSettings?.whatsapp_number?.replace(/[^0-9]/g, "") || "16032905554";
  const whatsappUrl = `https://wa.me/${rawWa}?text=${encodeURIComponent(
    "Hello, I need locksmith service (Local Lock & Key Service)"
  )}`;

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

        {/* Center: Desktop Quick Nav Links */}
        <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 text-sm font-semibold text-slate-700 flex-1 px-4">
          <a
            href="#about"
            onClick={(e) => handleScrollTo(e, "about")}
            className="hover:text-emerald-700 transition"
          >
            About Us
          </a>
          <a
            href="#services"
            onClick={(e) => handleScrollTo(e, "services")}
            className="hover:text-emerald-700 transition"
          >
            {t("nav_services")}
          </a>
          <a
            href="#gallery"
            onClick={(e) => handleScrollTo(e, "gallery")}
            className="hover:text-emerald-700 transition flex items-center gap-1.5 font-bold text-slate-900 bg-slate-100 hover:bg-emerald-50 px-3 py-1 rounded-lg"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {t("nav_gallery")}
          </a>
          <a
            href="#coverage"
            onClick={(e) => handleScrollTo(e, "coverage")}
            className="hover:text-emerald-700 transition"
          >
            {t("nav_coverage")}
          </a>
          <a
            href="#reviews"
            onClick={(e) => handleScrollTo(e, "reviews")}
            className="hover:text-emerald-700 transition"
          >
            {t("nav_reviews")}
          </a>
        </nav>

        {/* Right: Desktop Actions */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs hover:shadow active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>WhatsApp</span>
          </a>

          <a
            href={phoneRaw}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs hover:shadow active:scale-[0.98]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
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
          {/* Nav Links with Clear Icons */}
          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-800 pt-1">
            <a
              href="#about"
              onClick={(e) => handleScrollTo(e, "about")}
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="truncate">About Us</span>
            </a>

            <a
              href="#services"
              onClick={(e) => handleScrollTo(e, "services")}
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 transition-colors"
            >
              <Wrench className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="truncate">{t("nav_services")}</span>
            </a>

            <a
              href="#gallery"
              onClick={(e) => handleScrollTo(e, "gallery")}
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 transition-colors"
            >
              <Camera className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="truncate">{t("nav_gallery")}</span>
            </a>

            <a
              href="#coverage"
              onClick={(e) => handleScrollTo(e, "coverage")}
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 transition-colors"
            >
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="truncate">{t("nav_coverage")}</span>
            </a>

            <a
              href="#reviews"
              onClick={(e) => handleScrollTo(e, "reviews")}
              className="col-span-2 flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 transition-colors text-center"
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
              <span>{t("nav_reviews")}</span>
            </a>
          </div>

          {/* Quick Action Buttons in Menu */}
          <div className="flex gap-2 pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp 24/7</span>
            </a>

            <a
              href={phoneRaw}
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-2xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>CALL</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
