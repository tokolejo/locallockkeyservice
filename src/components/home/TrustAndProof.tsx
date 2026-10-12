"use client";

import React, { useState, useRef, useEffect } from "react";
import { ShieldCheck, Clock, FileCheck, PhoneCall, Star, HelpCircle, ChevronDown, Sparkles, ChevronLeft, ChevronRight, CheckCircle2, ExternalLink } from "lucide-react";
import { Testimonial } from "@/types/database.types";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { CountUpNumber } from "@/components/animations/CountUpNumber";
import { ReviewAvatar } from "@/components/ui/ReviewAvatar";

interface TrustAndProofProps {
  testimonials?: Testimonial[];
}

export function TrustAndProof({ testimonials = [] }: TrustAndProofProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [googleStats, setGoogleStats] = useState<{ rating: number; totalReviews: number }>({
    rating: 5.0,
    totalReviews: testimonials?.length || 35
  });

  useEffect(() => {
    if (testimonials?.length) {
      setGoogleStats((prev) => ({
        ...prev,
        totalReviews: testimonials.length,
      }));
    }
  }, [testimonials]);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const offset = direction === "left" ? -340 : 340;
      carouselRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const faqs = [
    {
      question: "Do you guarantee 100% damage-free entry on locked cars and doors?",
      answer: "Yes. Our technicians use professional locksmith picks and automotive air-wedge bypass tools. We never break car windows or pry door frames."
    },
    {
      question: "Why is ID and proof of ownership legally required before unlocking?",
      answer: "Under state regulations, professional locksmiths are required to verify photo ID and vehicle registration or property lease to protect owners from unlawful entry."
    },
    {
      question: "What payment methods are accepted on-site by mobile units?",
      answer: "Every mobile unit carries wireless POS card terminals accepting Visa, MasterCard, Amex, Apple Pay, Google Pay, and Cash with printed receipts."
    },
    {
      question: "Why direct phone call instead of Instagram DMs?",
      answer: "Emergencies cannot wait for social media DMs. Calling directly at +1 (603) 290-5554 immediately assigns the nearest patrolling mobile unit via GPS dispatch."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section id="reviews" className="py-6 sm:py-14 md:py-20 bg-white border-b border-slate-200 text-slate-800 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-12 md:space-y-16">
        {/* 0. Live Scroll-Triggered Impact Numbers */}
        <ScrollReveal direction="up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 p-2.5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-radial from-slate-900 to-slate-950 text-white shadow-xl shadow-slate-900/10 border border-slate-800">
            <div className="text-center p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-center gap-1 text-emerald-400 mb-0.5 sm:mb-1">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-lg sm:text-3xl font-black">
                  <CountUpNumber end={15} suffix=" Min" />
                </span>
              </div>
              <p className="text-[9px] sm:text-xs text-slate-400 font-medium truncate">
                Average Response Time
              </p>
            </div>

            <div className="text-center p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-center gap-1 text-emerald-400 mb-0.5 sm:mb-1">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-lg sm:text-3xl font-black">
                  <CountUpNumber end={830} suffix="+" />
                </span>
              </div>
              <p className="text-[9px] sm:text-xs text-slate-400 font-medium truncate">
                Successful Lockouts
              </p>
            </div>

            <div className="text-center p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-center gap-1 text-emerald-400 mb-0.5 sm:mb-1">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-lg sm:text-3xl font-black">
                  <CountUpNumber end={99.8} decimals={1} suffix="%" />
                </span>
              </div>
              <p className="text-[9px] sm:text-xs text-slate-400 font-medium truncate">
                Zero Damage Entry Rate
              </p>
            </div>

            <a
              href="https://maps.app.goo.gl/j9Zvw9xhNKP5Rgk29"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 hover:border-amber-400/50 hover:bg-white/10 transition group cursor-pointer block"
              title="View Google Reviews"
            >
              <div className="flex items-center justify-center gap-1 text-amber-400 mb-0.5 sm:mb-1">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-lg sm:text-3xl font-black">
                  <CountUpNumber end={googleStats.rating} decimals={1} suffix=" / 5.0" />
                </span>
              </div>
              <p className="text-[9px] sm:text-xs text-slate-400 font-medium truncate group-hover:text-amber-300 transition-colors">
                {googleStats.totalReviews} Google Reviews
              </p>
            </a>
          </div>
        </ScrollReveal>

        {/* Google Reviews Showcase Section */}
        <div>
          <ScrollReveal direction="up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold mb-2.5 shadow-2xs">
                  {/* Google "G" Icon */}
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google Verified Reviews</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="text-amber-500 font-extrabold flex items-center gap-0.5">
                    ★ 5.0
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  Verified Customer Reviews in Manchester & NH
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  100% authentic ratings from local emergency lockout & key services
                </p>
              </div>

              {/* Overall Google Rating Badge & Link + Arrow Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
                <a
                  href="https://maps.app.goo.gl/j9Zvw9xhNKP5Rgk29"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition shadow-xs group cursor-pointer shrink-0"
                >
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400" />
                    <span className="font-black text-base sm:text-lg text-slate-900">5.0</span>
                  </div>
                  <div className="text-left border-l border-slate-200 pl-2.5 sm:pl-3">
                    <div className="text-[11px] sm:text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Local Lock & Key Service
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500">
                      {testimonials.length || 35} Google Reviews • Manchester, NH
                    </div>
                  </div>
                </a>

                {/* Arrow Navigation Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => scrollCarousel("left")}
                    aria-label="Previous reviews"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 transition active:scale-90 cursor-pointer shadow-xs"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollCarousel("right")}
                    aria-label="Next reviews"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 transition active:scale-90 cursor-pointer shadow-xs"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Testimonials Horizontal Carousel Track */}
            <div
              ref={carouselRef}
              className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 no-scrollbar -mx-3.5 px-3.5 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
            >
              {testimonials.map((item) => {
                const reviewUrl = item.review_url || "https://maps.app.goo.gl/j9Zvw9xhNKP5Rgk29";
                return (
                  <a
                    key={item.id}
                    href={reviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View original review on Google Maps"
                    className="shrink-0 w-[78vw] min-w-[250px] max-w-[290px] sm:w-[320px] sm:max-w-none md:w-[340px] snap-start bg-[#fbfbf9] hover:bg-white border border-slate-200/90 hover:border-blue-400 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-200 shadow-xs group/card cursor-pointer"
                  >
                    <div className="space-y-2.5 sm:space-y-3">
                      {/* Stars and verified badge */}
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: item.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 group-hover/card:border-blue-300 transition-colors">
                          <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600" />
                          Google Verified
                        </span>
                      </div>

                      {/* Review Text */}
                      <p className="text-xs sm:text-sm text-slate-700 group-hover/card:text-slate-900 leading-relaxed italic line-clamp-4 min-h-[64px] sm:min-h-[72px] transition-colors">
                        &ldquo;{item.review_text}&rdquo;
                      </p>
                    </div>

                    <div className="pt-3 sm:pt-3.5 mt-3 border-t border-slate-200/70 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                        <ReviewAvatar name={item.author_name} photoUrl={item.author_photo} size="sm" />
                        <div className="min-w-0">
                          <div className="font-bold text-xs sm:text-sm text-slate-900 truncate group-hover/card:text-blue-600 transition-colors">
                            {item.author_name}
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                            {item.location}
                          </div>
                        </div>
                      </div>

                      {/* Click to Google Maps link pill */}
                      <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-blue-600 group-hover/card:text-blue-700 shrink-0 bg-blue-50 group-hover/card:bg-blue-100 px-2 py-1 rounded-lg transition-colors">
                        <span>Google</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 block sm:hidden text-center">
              ← Swipe to view more verified Google reviews →
            </p>
          </ScrollReveal>
        </div>
        <div className="max-w-3xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-4 sm:mb-8">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
                Frequently Asked Questions
              </h3>
            </div>
          </ScrollReveal>

          <div className="space-y-2 sm:space-y-2.5">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <ScrollReveal key={index} direction="up" delay={index * 0.05}>
                  <div className="bg-[#fbfbf9] border border-slate-200 rounded-xl sm:rounded-2xl overflow-hidden transition">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full p-3.5 sm:p-5 text-left flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-slate-900 hover:text-emerald-700 transition cursor-pointer"
                    >
                      <span className="leading-snug">{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-emerald-700" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 pt-1 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
