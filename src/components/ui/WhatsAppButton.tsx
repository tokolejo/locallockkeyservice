"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneCall, X } from "lucide-react";

export const WHATSAPP_PHONE_RAW = "16032905554";
export const WHATSAPP_DISPLAY = "+1 (603) 290-5554";

export function getWhatsAppUrl(customText?: string) {
  const defaultText = "Hello! I need emergency locksmith assistance (Local Lock & Key Service).";
  const text = customText || defaultText;
  return `https://wa.me/${WHATSAPP_PHONE_RAW}?text=${encodeURIComponent(text)}`;
}

export function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.711 1.456h.005c6.554 0 11.89-5.336 11.893-11.893a11.821 11.821 0 00-3.48-8.414z" />
    </svg>
  );
}

interface WhatsAppButtonProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  customText?: string;
  label?: string;
}

export function WhatsAppButton({
  className = "",
  size = "md",
  customText,
  label = "WhatsApp 24/7",
}: WhatsAppButtonProps) {
  const waUrl = getWhatsAppUrl(customText);

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-3 text-sm gap-2",
    lg: "px-7 py-4 text-base gap-3",
  };

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center font-bold rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] cursor-pointer ${sizeClasses[size]} ${className}`}
    >
      <WhatsAppIcon className={size === "sm" ? "w-4 h-4" : size === "lg" ? "w-5 h-5" : "w-4 h-4"} />
      <span>{label}</span>
    </a>
  );
}

export function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const waUrl = getWhatsAppUrl();
  const phoneDisplay = process.env.NEXT_PUBLIC_DISPATCH_PHONE || "+1 (603) 290-5554";
  const phoneRaw = process.env.NEXT_PUBLIC_DISPATCH_PHONE_RAW || "tel:+16032905554";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <aside
          aria-label="Fast Contact Actions"
          className="fixed bottom-5 md:bottom-7 right-4 md:right-6 z-50 flex flex-col items-end"
        >
          {/* Backdrop on click to close */}
          {isOpen && (
            <div
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
            />
          )}

          {/* Compact Popup Menu above button */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="mb-2.5 z-50 bg-white/98 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2 shadow-2xl space-y-1.5 w-56 sm:w-60"
              >
                {/* Header title */}
                <div className="px-2 py-1 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Quick Contact 24/7
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                {/* Option 1: WhatsApp */}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200/80 text-emerald-950 transition active:scale-[0.98] group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold block text-slate-900 group-hover:text-emerald-950">
                      WhatsApp Chat
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      Fast reply roadside
                    </span>
                  </div>
                </a>

                {/* Option 2: Direct Call */}
                <a
                  href={phoneRaw}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-900 transition active:scale-[0.98] group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <PhoneCall className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold block text-slate-900 group-hover:text-emerald-900">
                      Call Dispatch
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 block truncate">
                      {phoneDisplay}
                    </span>
                  </div>
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Floating Trigger Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Open contact actions"
            className="relative z-50 w-13 h-13 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/90 cursor-pointer"
            title="Contact (WhatsApp & Call)"
          >
            {/* Ping pulse glow animation */}
            {!isOpen && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-35 pointer-events-none" />
            )}

            {isOpen ? (
              <X className="w-6 h-6 text-white transition-transform duration-200" />
            ) : (
              <WhatsAppIcon className="w-7 h-7 text-white relative z-10" />
            )}
          </button>
        </aside>
      )}
    </AnimatePresence>
  );
}
