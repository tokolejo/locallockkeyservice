"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  PhoneCall,
  Clock,
  CheckCircle2,
  ShieldCheck,
  KeyRound,
  Home,
  Building2,
  Vault,
  Car,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { requestCallbackAction } from "@/app/actions";
import { SiteSettings } from "@/types/database.types";

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteSettings?: SiteSettings;
}

const SERVICE_OPTIONS = [
  { id: "Residential Locksmith", label: "Residential Locksmith", icon: Home },
  { id: "Commercial Locksmith", label: "Commercial Locksmith", icon: Building2 },
  { id: "Car/Truck Locksmith", label: "Car/Truck Locksmith", icon: Car },
  { id: "Emergency Locksmith", label: "Emergency Locksmith", icon: ShieldCheck },
  { id: "Safe Locksmith", label: "Safe Locksmith", icon: Vault },
];

function formatUsPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function CallbackModal({ isOpen, onClose, siteSettings }: CallbackModalProps) {
  const [phone, setPhone] = useState("");
  const [selectedService, setSelectedService] = useState(SERVICE_OPTIONS[0].id);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const phoneDisplay =
    siteSettings?.phone_display ||
    process.env.NEXT_PUBLIC_DISPATCH_PHONE ||
    "+1 (603) 290-5554";
  const phoneRaw =
    siteSettings?.phone_raw ||
    process.env.NEXT_PUBLIC_DISPATCH_PHONE_RAW ||
    "tel:+16032905554";

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Reset form when reopened
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setErrorMessage("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUsPhoneNumber(e.target.value);
    setPhone(formatted);
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      setErrorMessage("Please enter a valid 10-digit US phone number.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.set("phone", phone);
      formData.set("service", selectedService);
      formData.set("notes", notes);

      const result = await requestCallbackAction(null, formData);
      if (result.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(result.message || "Failed to submit callback request. Please try calling directly.");
      }
    } catch {
      setErrorMessage("Connection error. Please call our 24/7 dispatch hotline directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:pb-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200 max-h-[calc(100dvh-5.5rem)] sm:max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="relative bg-linear-to-r from-slate-900 via-slate-950 to-slate-900 text-white p-4 sm:p-6 pb-4 sm:pb-5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Live Dispatch Queue • Fast Response
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-emerald-400" />
            <span>Request a Callback</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Leave Your Cellphone Number Below and Our Locksmith Technician Will be Calling You Back.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {isSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xl font-black text-slate-900">
                  Callback Request Confirmed!
                </h4>
                <p className="text-sm text-slate-600 max-w-sm mx-auto">
                  We received your request for <strong>{selectedService}</strong>. Our on-duty dispatch specialist will call you at <strong className="text-slate-900">{phone}</strong> within minutes.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-sm transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Phone Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="callback-phone"
                  className="block text-xs font-bold text-slate-900 uppercase tracking-wider"
                >
                  Your Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <PhoneCall className="w-4 h-4 text-emerald-600" />
                  </div>
                  <input
                    id="callback-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="(603) 555-0199"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold text-base focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition shadow-2xs"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  U.S. phone format. We will only call you regarding this service request.
                </p>
              </div>

              {/* Service Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Service Needed <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SERVICE_OPTIONS.map((opt) => {
                    const isSelected = selectedService === opt.id;
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedService(opt.id)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs font-bold transition cursor-pointer ${
                          isSelected
                            ? "bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500 shadow-2xs"
                            : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isSelected ? "text-emerald-700" : "text-slate-500"
                          }`}
                        />
                        <span className="leading-tight">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes / Address / ZIP */}
              <div className="space-y-1.5">
                <label
                  htmlFor="callback-notes"
                  className="block text-xs font-bold text-slate-900 uppercase tracking-wider"
                >
                  Location/Zip code <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="callback-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Manchester, NH or 03104"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition shadow-2xs"
                />
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-60 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-600/25 transition cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>Request Callback Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Helper block: Direct Call Dispatch Button */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-slate-500 text-[11px] font-semibold text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Need immediate roadside or door dispatch?</span>
            </div>
            <a
              href={phoneRaw}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-slate-950 hover:bg-black text-white font-black text-xs sm:text-sm transition-all shadow-md active:scale-[0.99] border border-slate-800 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Call Dispatch: {phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
