"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, PhoneCall, Clock, CheckCircle2, Star } from "lucide-react";
import { SiteSettings } from "@/types/database.types";

interface FooterProps {
  siteSettings?: SiteSettings;
  onOpenCallback?: () => void;
}

export function Footer({ siteSettings, onOpenCallback }: FooterProps) {
  const phoneDisplay = siteSettings?.phone_display || process.env.NEXT_PUBLIC_DISPATCH_PHONE || "+1 (603) 290-5554";
  const phoneRaw = siteSettings?.phone_raw || process.env.NEXT_PUBLIC_DISPATCH_PHONE_RAW || "tel:+16032905554";

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (typeof window === "undefined") return;

    if (window.location.pathname !== "/") {
      window.location.href = `/#${targetId}`;
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      let actualTop = 0;
      let curr: HTMLElement | null = element;
      while (curr) {
        actualTop += curr.offsetTop;
        curr = curr.offsetParent as HTMLElement | null;
      }

      const headerOffset = window.innerWidth >= 768 ? 115 : 95;
      const targetScroll = Math.max(0, actualTop - headerOffset);

      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });

      window.history.pushState(null, "", `#${targetId}`);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-7 lg:gap-8 mb-8">
          {/* Brand & Assurance */}
          <div className="lg:col-span-5 space-y-3">
            {/* Logo + Side Trust Badges (Side-by-side on all screens) */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center group transition-transform duration-200 hover:scale-[1.02] shrink-0"
                aria-label="Local Lock & Key Service Homepage"
              >
                <img
                  src="/gallery/logo-light.png"
                  alt="Local Lock & Key Service Logo"
                  className="h-10 sm:h-11 w-auto max-w-[170px] sm:max-w-[185px] object-contain drop-shadow-sm"
                />
              </Link>

              {/* Side Trust Badges immediately right of logo */}
              <div className="flex flex-col justify-center border-l border-slate-800 pl-3 space-y-1 shrink-0 text-[10px] sm:text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-200 font-semibold whitespace-nowrap">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Fully Insured & Registered in NH</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium whitespace-nowrap">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Fast 24/7 Mobile Service</span>
                </div>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-[11px] sm:text-xs">
              Local Lock & Key Service provides 24/7 fast, reliable, and professional mobile locksmith solutions across Manchester, NH &amp; surrounding towns.
            </p>

            {/* Prominent Clickable Google Review Link */}
            <div className="pt-1">
              <a
                href="https://maps.app.goo.gl/j9Zvw9xhNKP5Rgk29"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/60 text-slate-200 transition-all group/review shadow-xs"
                title="Google Rating • Verified Profile"
              >
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 group-hover/review:scale-110 transition-transform shrink-0" />
                  <span className="font-bold text-xs text-white">5.0 ★</span>
                </div>
                <span className="text-[11px] text-slate-300 group-hover/review:text-amber-300 transition-colors font-medium">
                  Google Rating • Verified Profile ↗
                </span>
              </a>
            </div>
          </div>

          {/* Core Services (Updated to match all 5 categories) */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Core Services
            </h4>
            <ul className="space-y-2 text-slate-400 text-[11px] sm:text-xs">
              <li>
                <a
                  href="#services"
                  onClick={(e) => handleScrollTo(e, "services")}
                  className="hover:text-emerald-400 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-500/80 shrink-0" />
                  <span>Residential Locksmith</span>
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  onClick={(e) => handleScrollTo(e, "services")}
                  className="hover:text-emerald-400 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-500/80 shrink-0" />
                  <span>Automotive Locksmith</span>
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  onClick={(e) => handleScrollTo(e, "services")}
                  className="hover:text-emerald-400 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-500/80 shrink-0" />
                  <span>Commercial Locksmith</span>
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  onClick={(e) => handleScrollTo(e, "services")}
                  className="hover:text-emerald-400 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-500/80 shrink-0" />
                  <span>Emergency Lockout</span>
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  onClick={(e) => handleScrollTo(e, "services")}
                  className="hover:text-emerald-400 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-500/80 shrink-0" />
                  <span>Safe &amp; Vault Services</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Manchester & NH Service Areas */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              NH Service Areas
            </h4>
            <ul className="space-y-2 text-slate-400 text-[11px] sm:text-xs">
              <li>
                <a
                  href="#coverage"
                  onClick={(e) => handleScrollTo(e, "coverage")}
                  className="hover:text-emerald-400 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Greater Manchester, NH</span>
                </a>
              </li>
              <li>
                <a
                  href="#coverage"
                  onClick={(e) => handleScrollTo(e, "coverage")}
                  className="hover:text-emerald-400 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Greater Nashua, NH</span>
                </a>
              </li>
              <li>
                <a
                  href="#coverage"
                  onClick={(e) => handleScrollTo(e, "coverage")}
                  className="hover:text-emerald-400 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Greater Concord, NH</span>
                </a>
              </li>
              <li>
                <a
                  href="#coverage"
                  onClick={(e) => handleScrollTo(e, "coverage")}
                  className="hover:text-emerald-400 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Salem &amp; Derry, NH</span>
                </a>
              </li>
              <li>
                <a
                  href="#coverage"
                  onClick={(e) => handleScrollTo(e, "coverage")}
                  className="hover:text-emerald-400 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Greater Laconia (63+ Towns)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Direct 24/7 Call Center & Action Buttons */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              24/7 Mobile Service
            </h4>
            <p className="text-slate-400 text-[11px]">
              Fast roadside &amp; residential mobile service across Southern NH:
            </p>

            {/* Twin Equal-Sized Action Buttons */}
            <div className="flex flex-col gap-2 pt-0.5">
              <a
                href={phoneRaw}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/90 text-white border border-slate-700 hover:border-emerald-500/50 font-bold text-xs shadow-xs transition-all active:scale-[0.99]"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{phoneDisplay}</span>
              </a>

              <button
                type="button"
                onClick={onOpenCallback}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 font-bold text-xs shadow-xs transition-all active:scale-[0.99] cursor-pointer"
              >
                <Clock className="w-4 h-4 text-emerald-100 shrink-0" />
                <span>Request a Callback</span>
              </button>
            </div>

            <div className="text-[10px] text-slate-500 space-y-0.5 pt-0.5">
              <p>• Fast 24/7 mobile service across NH</p>
              <p>• Local GPS tracked mobile service vans</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/90 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 text-center md:text-left">
          <p>© {new Date().getFullYear()} Local Lock &amp; Key Service. All rights reserved.</p>
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap text-slate-400">
            <a
              href="#services"
              onClick={(e) => handleScrollTo(e, "services")}
              className="hover:text-slate-200 transition cursor-pointer"
            >
              Services
            </a>
            <span className="text-slate-700">•</span>
            <a
              href="#gallery"
              onClick={(e) => handleScrollTo(e, "gallery")}
              className="hover:text-slate-200 transition cursor-pointer"
            >
              Our Work
            </a>
            <span className="text-slate-700">•</span>
            <a
              href="#reviews"
              onClick={(e) => handleScrollTo(e, "reviews")}
              className="hover:text-slate-200 transition cursor-pointer"
            >
              Reviews
            </a>
            <span className="text-slate-700">•</span>
            <a
              href="#coverage"
              onClick={(e) => handleScrollTo(e, "coverage")}
              className="hover:text-slate-200 transition cursor-pointer"
            >
              Service Areas
            </a>
            <span className="text-slate-700">•</span>
            <a
              href="https://maps.app.goo.gl/j9Zvw9xhNKP5Rgk29"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold transition"
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
              <span>5.0 ★ Google</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
