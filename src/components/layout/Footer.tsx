"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, PhoneCall, Clock, CheckCircle2, MessageCircle } from "lucide-react";
import { SiteSettings } from "@/types/database.types";

interface FooterProps {
  siteSettings?: SiteSettings;
}

export function Footer({ siteSettings }: FooterProps) {
  const phoneDisplay = siteSettings?.phone_display || process.env.NEXT_PUBLIC_DISPATCH_PHONE || "+1 (603) 290-5554";
  const phoneRaw = siteSettings?.phone_raw || process.env.NEXT_PUBLIC_DISPATCH_PHONE_RAW || "tel:+16032905554";
  const rawWa = siteSettings?.whatsapp_number?.replace(/[^0-9]/g, "") || "16032905554";
  const whatsappUrl = `https://wa.me/${rawWa}?text=${encodeURIComponent(
    "Hello, I need locksmith service (Local Lock & Key Service)"
  )}`;

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mb-8">
          {/* Brand & Assurance */}
          <div className="space-y-3">
            {/* Logo + Side Trust Highlights (fills horizontal width nicely) */}
            <div className="flex items-center justify-between gap-3">
              <Link
                href="/"
                className="inline-flex items-center group transition-transform duration-200 hover:scale-[1.02] shrink-0"
                aria-label="Local Lock & Key Service Homepage"
              >
                <img
                  src="/gallery/logo-light.png"
                  alt="Local Lock & Key Service Logo"
                  className="h-10 sm:h-12 w-auto max-w-[190px] sm:max-w-[220px] object-contain drop-shadow-sm"
                />
              </Link>

              {/* Side Trust Badges immediately right of logo */}
              <div className="flex flex-col justify-center border-l border-slate-800 pl-2.5 sm:pl-3 space-y-1 shrink-0 text-[10px] sm:text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">15–20 Min Arrival</span>
                </div>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-[11px] sm:text-xs">
              Local Lock & Key Service provides 24/7 fast, reliable, and professional mobile locksmith solutions across Manchester, NH & surrounding towns. 100% damage-free entry guarantee.
            </p>
          </div>

          {/* Core Services */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Core Services
            </h4>
            <ul className="space-y-2 text-slate-400 text-[11px] sm:text-xs">
              <li>
                <Link href="#services" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500/80 shrink-0" />
                  <span>24/7 Car Lockout Rescue</span>
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500/80 shrink-0" />
                  <span>House & Apartment Lockout</span>
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500/80 shrink-0" />
                  <span>Lock Change & Rekeying</span>
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500/80 shrink-0" />
                  <span>Smart Key & Fob Programming</span>
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500/80 shrink-0" />
                  <span>Commercial Master Key Systems</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Manchester & NH Service Areas */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              NH Service Areas
            </h4>
            <ul className="space-y-2 text-slate-400 text-[11px] sm:text-xs">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>Manchester, NH (All Neighborhoods)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>Bedford & Merrimack, NH</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>Concord & Hooksett, NH</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>Nashua & Derry, NH</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>Londonderry & Salem, NH</span>
              </li>
            </ul>
          </div>

          {/* Direct 24/7 Call Center & Action Buttons */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              24/7 Emergency Dispatch
            </h4>
            <p className="text-slate-400 text-[11px]">
              Fast roadside & residential response across Greater Manchester:
            </p>

            {/* Twin Equal-Sized Action Buttons */}
            <div className="flex flex-col gap-2 pt-0.5">
              <a
                href={phoneRaw}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/90 text-white border border-slate-700 hover:border-emerald-500/50 font-bold text-xs shadow-xs transition-all active:scale-[0.99]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{phoneDisplay}</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 font-bold text-xs shadow-xs transition-all active:scale-[0.99]"
              >
                <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                <span>WhatsApp</span>
              </a>
            </div>

            <div className="text-[10px] text-slate-500 space-y-0.5 pt-0.5">
              <p>• 15–20 min average dispatch arrival</p>
              <p>• Local GPS tracked mobile patrol units</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} Local Lock & Key Service. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#about" className="hover:text-slate-200 transition">About Us</Link>
            <Link href="#services" className="hover:text-slate-200 transition">Services</Link>
            <Link href="#coverage" className="hover:text-slate-200 transition">Coverage</Link>
            <span className="text-emerald-400 font-medium">100% Damage-Free Entry</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
