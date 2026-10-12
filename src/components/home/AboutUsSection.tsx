"use client";

import React from "react";
import {
  Home,
  Car,
  Building2,
  Award,
  CheckCircle2,
} from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

export function AboutUsSection() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-[#fdfdfb] border-b border-slate-200 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tag & Title */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-3 shadow-2xs">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>About Local Lock & Key Service</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Trusted & Professional Locksmith Solutions in Manchester, NH
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
              Local Lock & Key Service is a premier mobile locksmith company based in Manchester, NH. We serve Manchester and surrounding southern New Hampshire communities with fast, reliable, and professional locksmith services with 15–20 minute rapid response times.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Information Cards Grid (Pure Information - No Images) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* 1. Residential */}
          <ScrollReveal direction="up" delay={0.1}>
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 mb-5 shadow-2xs">
                  <Home className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg sm:text-xl mb-2.5">
                  Residential Locksmith Expertise
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Whether your home door lock or electronic keypad is broken, jammed, or malfunctioning, or you’ve lost your keys or locked yourself out, we are ready to assist you quickly and professionally with standard and high-security hardware.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Damage-Free Door Unlocking</span>
              </div>
            </div>
          </ScrollReveal>

          {/* 2. Automotive */}
          <ScrollReveal direction="up" delay={0.15}>
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 mb-5 shadow-2xs">
                  <Car className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg sm:text-xl mb-2.5">
                  Automotive Roadside Rescue
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We solve any automotive issue roadside: damage-free car lockouts, new car key generation, transponder & smart key programming, key duplication, and ignition lock cylinder repair.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-amber-700">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>15–20 Min Emergency Arrival</span>
              </div>
            </div>
          </ScrollReveal>

          {/* 3. Commercial */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 mb-5 shadow-2xs">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg sm:text-xl mb-2.5">
                  Commercial & Safe Specialists
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Commercial lockout services, lock installation, rekeying, master key systems, panic exit bars, and safe unlocking using advanced tools and expert techniques.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-blue-700">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Fully Insured & Registered in NH</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
