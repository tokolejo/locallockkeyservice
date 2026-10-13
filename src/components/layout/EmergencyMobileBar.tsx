"use client";

import React, { useState, useEffect } from "react";
import { PhoneCall, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EmergencyMobileBarProps {
  onOpenCallback?: () => void;
}

export function EmergencyMobileBar({ onOpenCallback }: EmergencyMobileBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const phone = process.env.NEXT_PUBLIC_DISPATCH_PHONE || "+1 (603) 290-5554";
  const phoneRaw = process.env.NEXT_PUBLIC_DISPATCH_PHONE_RAW || "tel:+16032905554";

  useEffect(() => {
    const handleScroll = () => {
      // Reveal only after scrolling past header / hero initial view
      if (window.scrollY > 120) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-xl"
        >
          <div className="flex items-center gap-2 max-w-sm mx-auto">
            {/* Request Callback Action */}
            <button
              type="button"
              onClick={onOpenCallback}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-tight shadow-xs transition active:scale-[0.98] cursor-pointer"
            >
              <Clock className="w-4 h-4 text-emerald-100 shrink-0" />
              <span className="truncate">Request Callback</span>
            </button>

            {/* Direct Phone Call */}
            <a
              href={phoneRaw}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-tight shadow-xs transition active:scale-[0.98]"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">CALL</span>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
