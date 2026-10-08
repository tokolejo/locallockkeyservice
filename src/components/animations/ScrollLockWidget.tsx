"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Lock, Unlock, KeyRound, Sparkles } from "lucide-react";
import { useAnimation } from "@/context/AnimationContext";

export function ScrollLockWidget() {
  const { mode } = useAnimation();
  const { scrollYProgress } = useScroll();

  // In mode "dynamic", show an interactive floating indicator in the corner
  // that rotates the key and unlocks the lock based on scroll progress!
  const rotation = useTransform(scrollYProgress, [0, 0.5, 1], [0, 180, 360]);
  const isUnlocked = useTransform(scrollYProgress, (pos) => pos > 0.15);

  const [unlockedState, setUnlockedState] = React.useState(false);

  React.useEffect(() => {
    return isUnlocked.on("change", (latest) => {
      setUnlockedState(latest);
    });
  }, [isUnlocked]);

  if (mode !== "dynamic") return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed left-6 bottom-20 z-40 hidden lg:flex items-center gap-3 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3 shadow-lg shadow-emerald-950/5 select-none"
    >
      <div className="relative w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
        {unlockedState ? (
          <Unlock className="w-5 h-5 text-emerald-400 transition-transform duration-300 scale-110" />
        ) : (
          <Lock className="w-5 h-5 text-amber-400 transition-transform duration-300" />
        )}

        {/* Orbiting key icon rotating with scroll */}
        <motion.div
          style={{ rotate: rotation }}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-xs"
        >
          <KeyRound className="w-3 h-3 text-slate-950" />
        </motion.div>
      </div>

      <div className="text-left pr-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-900">
            {unlockedState ? "Lock Unlocked" : "Scroll Turns The Key"}
          </span>
          {unlockedState && <Sparkles className="w-3 h-3 text-emerald-500" />}
        </div>
        <p className="text-[10px] text-slate-500">
          Interactive Story Mode
        </p>
      </div>
    </motion.div>
  );
}
