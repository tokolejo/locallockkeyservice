"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useAnimation } from "@/context/AnimationContext";

export function ScrollProgressBar() {
  const { mode } = useAnimation();
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: mode === "dynamic" ? 200 : 100,
    damping: mode === "dynamic" ? 20 : 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0%" }}
      className={`fixed top-0 left-0 right-0 z-50 h-1 pointer-events-none ${
        mode === "dynamic"
          ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
          : "bg-emerald-600"
      }`}
    />
  );
}
