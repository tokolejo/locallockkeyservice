"use client";

import React from "react";
import {
  Home,
  Car,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Lock,
  PhoneCall,
} from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const ABOUT_SERVICES = [
  {
    icon: Car,
    iconColor: "text-amber-700",
    iconBg: "bg-amber-50 border-amber-100",
    badgeColor: "text-amber-700",
    title: "Automotive Roadside Rescue & Keys",
    desc: "Emergency vehicle lockouts, smart transponder key fob programming, laser key origination, duplicate remotes, and ignition lock cylinder repairs on-site across NH.",
    badge: "Professional Vehicle Opening",
  },
  {
    icon: Home,
    iconColor: "text-emerald-700",
    iconBg: "bg-emerald-50 border-emerald-100",
    badgeColor: "text-emerald-700",
    title: "Residential Lock & Rekey Services",
    desc: "Complete home security solutions: house lockouts, deadbolt lock change, precision cylinder rekeying, high-security hardware, and keyless keypad upgrades.",
    badge: "Precision Rekeying & Lock Replacement",
  },
  {
    icon: Building2,
    iconColor: "text-blue-700",
    iconBg: "bg-blue-50 border-blue-100",
    badgeColor: "text-blue-700",
    title: "Commercial & Business Security",
    desc: "Storefront mortise lock repair, crash panic exit bar hardware, tiered master key systems, and heavy-duty high-security hardware engineered for Manchester NH businesses.",
    badge: "ADA & Fire Code Compliant Hardware",
  },
  {
    icon: ShieldCheck,
    iconColor: "text-emerald-700",
    iconBg: "bg-emerald-50 border-emerald-100",
    badgeColor: "text-emerald-700",
    title: "24/7 Emergency Mobile Dispatch",
    desc: "Round-the-clock emergency mobile dispatch units stationed across Greater Manchester and Southern NH ready 24/7 for lockouts, lost keys, and urgent lock repairs.",
    badge: "Fast Mobile Patrol Dispatch Across NH",
  },
  {
    icon: Lock,
    iconColor: "text-purple-700",
    iconBg: "bg-purple-50 border-purple-100",
    badgeColor: "text-purple-700",
    title: "Safe Opening & Lock Maintenance",
    desc: "Professional non-destructive safe cracking, mechanical dial combination changes, digital electronic keypad servicing, and precision lock maintenance for residential & commercial safes.",
    badge: "Certified Safe Technicians",
  },
];

export function AboutUsSection() {
  const phoneRaw = process.env.NEXT_PUBLIC_DISPATCH_PHONE_RAW || "tel:+16032905554";

  return (
    <section id="about" className="py-16 sm:py-24 bg-[#fdfdfb] border-b border-slate-200 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tag & Title */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Trusted &amp; Professional Locksmith Solutions in Manchester, NH
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
              Local Lock &amp; Key Service is a premier mobile locksmith company based in Manchester, NH. We serve Manchester and surrounding southern New Hampshire communities with fast, reliable, and professional mobile locksmith services across the region.
            </p>
          </div>
        </ScrollReveal>

        {/* 6 Balanced Information Cards Grid (5 Core Services + 1 Direct Dispatch Action Card) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {ABOUT_SERVICES.map((s, idx) => {
            const Icon = s.icon;
            return (
              <ScrollReveal key={s.title} direction="up" delay={idx * 0.05}>
                <div className="bg-white p-5 sm:p-7 md:p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3.5 mb-3.5">
                      <div className={`w-11 h-11 rounded-2xl ${s.iconBg} border flex items-center justify-center ${s.iconColor} shrink-0 shadow-2xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug">
                        {s.title}
                      </h3>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                  <div className={`pt-5 mt-5 sm:pt-6 sm:mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold ${s.badgeColor}`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{s.badge}</span>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}

          {/* 6th Card: Direct Phone Dispatch Card to Complete Balanced 3x2 Grid */}
          <ScrollReveal direction="up" delay={0.25}>
            <div className="bg-slate-950 p-5 sm:p-7 md:p-8 rounded-3xl border border-slate-800 shadow-md text-white h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3.5 mb-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-2xs">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base sm:text-lg leading-snug">
                    Immediate Phone Estimates
                  </h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Need rapid roadside assistance or upfront lock quotes? Speak directly with our mobile dispatch hub for clear phone estimates with zero hidden fees.
                </p>
              </div>
              <div className="pt-5 mt-5 sm:pt-6 sm:mt-6 border-t border-slate-800 flex items-center justify-between">
                <a
                  href={phoneRaw}
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call Dispatch Now</span>
                </a>
                <span className="text-[11px] font-mono text-slate-400">24/7 Available in NH</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
