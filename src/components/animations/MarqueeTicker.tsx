"use client";

import React from "react";
import { motion } from "framer-motion";
import { KeyRound, Shield, CheckCircle } from "lucide-react";
import { useAnimation } from "@/context/AnimationContext";

const CAR_BRANDS = [
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Porsche",
  "Toyota",
  "Lexus",
  "Honda",
  "Ford",
  "Tesla",
  "Subaru",
  "Jeep",
  "Hyundai",
  "Chevrolet",
  "Nissan",
  "Volkswagen",
  "Dodge",
];

export function MarqueeTicker() {
  const { mode } = useAnimation();

  // If in minimal mode, render a clean static or simpler flex row
  if (mode === "minimal") {
    return (
      <div className="w-full overflow-x-auto py-3 border-y border-slate-200/70 bg-slate-50/50">
        <div className="flex items-center justify-center gap-6 px-4 min-w-max">
          {CAR_BRANDS.slice(0, 8).map((brand, i) => (
            <span key={i} className="text-xs font-semibold text-slate-500">
              {brand}
            </span>
          ))}
        </div>
      </div>
    );
  }

  const speed = mode === "dynamic" ? 22 : 32;

  return (
    <div className="relative w-full overflow-hidden py-4 border-y border-slate-200/70 bg-[#faf9f6]/80 backdrop-blur-xs select-none">
      {/* Left/Right Vignette gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#faf9f6] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#faf9f6] to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex items-center gap-8 whitespace-nowrap min-w-max"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: speed,
          ease: "linear",
        }}
      >
        {[...CAR_BRANDS, ...CAR_BRANDS].map((brand, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-2xs text-xs font-bold text-slate-700 hover:text-emerald-700 hover:border-emerald-300 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{brand}</span>
            <span className="text-[10px] text-slate-400 font-normal">OEM Key</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
