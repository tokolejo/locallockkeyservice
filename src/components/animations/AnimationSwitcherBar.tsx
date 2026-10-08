"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Feather, X, SlidersHorizontal, Check } from "lucide-react";
import { useAnimation, AnimationMode } from "@/context/AnimationContext";

export function AnimationSwitcherBar() {
  const { mode, setMode, isSwitcherOpen, setIsSwitcherOpen } = useAnimation();
  const [minimized, setMinimized] = useState(false);

  const modes: {
    id: AnimationMode;
    label: string;
    sub: string;
    badge: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "clean",
      label: "Version A: Clean Pro",
      sub: "Smooth Stagger, Count-Up, Apple-like feel",
      badge: "Recommended",
      icon: <Sparkles className="w-4 h-4 text-emerald-600" />,
    },
    {
      id: "dynamic",
      label: "Version B: Dynamic",
      sub: "Scroll lock trigger, Marquee, Spring Physics",
      badge: "High Motion",
      icon: <Zap className="w-4 h-4 text-amber-500" />,
    },
    {
      id: "minimal",
      label: "Version C: Snappy CSS",
      sub: "Ultra-fast micro transitions, 0 latency",
      badge: "Fastest",
      icon: <Feather className="w-4 h-4 text-sky-500" />,
    },
  ];

  if (!isSwitcherOpen) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[95vw] sm:max-w-xl w-full px-3 pointer-events-auto">
      <AnimatePresence mode="wait">
        {minimized ? (
          <motion.button
            key="minimized-pill"
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            onClick={() => setMinimized(false)}
            type="button"
            className="mx-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/95 text-white border border-slate-700/80 shadow-2xl backdrop-blur-md hover:bg-slate-800 transition cursor-pointer text-xs font-semibold"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Animation Mode: {mode.toUpperCase()}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </motion.button>
        ) : (
          <motion.div
            key="expanded-card"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-3 sm:p-4 shadow-2xl shadow-slate-900/15"
          >
            {/* Header with Title and Minimize */}
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Live Animation Style Tester
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setMinimized(true)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer text-[11px] font-medium px-2 flex items-center gap-1"
                  title="Minimize"
                >
                  <span>Minimize</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSwitcherOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3 Version Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {modes.map((item) => {
                const isActive = mode === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMode(item.id)}
                    className={`relative text-left p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? "bg-slate-950 text-white border-slate-950 shadow-md ring-2 ring-emerald-500/50"
                        : "bg-slate-50/80 hover:bg-white text-slate-800 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 w-full">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`p-1 rounded-lg ${
                            isActive ? "bg-white/10" : "bg-white shadow-2xs"
                          }`}
                        >
                          {item.icon}
                        </div>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-slate-200/70 text-slate-600"
                          }`}
                        >
                          {item.badge}
                        </span>
                      </div>
                      {isActive && (
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                    </div>

                    <div>
                      <div
                        className={`text-xs font-bold ${
                          isActive ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {item.label}
                      </div>
                      <div
                        className={`text-[10px] mt-0.5 line-clamp-1 ${
                          isActive ? "text-slate-300" : "text-slate-500"
                        }`}
                      >
                        {item.sub}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-[10px] text-center text-slate-400 mt-2">
              Click any style and scroll the page to test the interactions in real-time
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
