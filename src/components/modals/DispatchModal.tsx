"use client";

import React, { useActionState, useEffect, useState } from "react";
import { X, ShieldCheck, Clock, CheckCircle2, PhoneCall, AlertCircle, Navigation, MapPin } from "lucide-react";
import { submitEmergencyDispatchAction, ActionResponse } from "@/app/actions";
import { formatPhoneNumber } from "@/lib/utils";
import { ServiceCategory } from "@/types/database.types";
import { useLanguage } from "@/context/LanguageContext";

interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMapPicker?: () => void;
  initialCategory?: ServiceCategory;
  initialSubType?: string;
  initialEstimatedMin?: number;
  initialEstimatedMax?: number;
  initialAddress?: string;
  initialZip?: string;
}

export function DispatchModal({
  isOpen,
  onClose,
  onOpenMapPicker,
  initialCategory = "emergency",
  initialSubType = "24/7 Car Lockout Rescue",
  initialAddress = "",
  initialZip = "",
}: DispatchModalProps) {
  const { t } = useLanguage();
  const [state, formAction, isPending] = useActionState<ActionResponse | null, FormData>(
    submitEmergencyDispatchAction,
    null
  );

  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState(initialZip);
  const [address, setAddress] = useState(initialAddress);
  const [category, setCategory] = useState<ServiceCategory>(initialCategory);
  const [subType, setSubType] = useState(initialSubType);
  const [gpsLoading, setGpsLoading] = useState(false);

  useEffect(() => {
    if (initialCategory) setCategory(initialCategory);
    if (initialSubType) setSubType(initialSubType);
    if (initialAddress) setAddress(initialAddress);
    if (initialZip) setZip(initialZip);
  }, [initialCategory, initialSubType, initialAddress, initialZip]);

  if (!isOpen) return null;

  const phoneRaw = process.env.NEXT_PUBLIC_DISPATCH_PHONE_RAW || "tel:+16032905554";
  const displayPhone = process.env.NEXT_PUBLIC_DISPATCH_PHONE || "+1 (603) 290-5554";

  const handleQuickGps = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        setZip("03101");
        setAddress(`GPS Coords: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (Manchester NH Zone)`);
      },
      () => {
        setGpsLoading(false);
        if (onOpenMapPicker) onOpenMapPicker();
      },
      { timeout: 6000 }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-slate-800 max-h-[92dvh] sm:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img src="/gallery/logo.png" alt="Local Lock & Key Service" className="h-7 w-auto object-contain" />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Request Immediate Mobile Dispatch
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Fast Dispatch</span>
                <span>•</span>
                <span>Manchester & NH</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {state?.success ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Dispatch Confirmed!
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                  {state.message}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Target Window:</span>
                  <span className="text-emerald-700 font-bold">15–20 Minutes</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Quote Status:</span>
                  <span className="text-emerald-700 font-bold">Free Phone Estimate</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>ID Verification:</span>
                  <span className="text-slate-700">Mandatory on arrival</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={phoneRaw}
                  className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call Dispatch Directly: {displayPhone}</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form action={formAction} className="space-y-3.5">
              {state?.message && !state.success && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{state.message}</span>
                </div>
              )}

              <input type="hidden" name="estimated_price_min" value={0} />
              <input type="hidden" name="estimated_price_max" value={0} />

              {/* Interactive Service Selector Bar */}
              <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-600 font-bold uppercase text-[10px] tracking-wider block">
                    Select Required Service:
                  </label>
                  <span className="font-bold text-emerald-800 text-[11px] sm:text-xs bg-emerald-100/70 px-2 py-0.5 rounded-md border border-emerald-200">
                    Free Phone Quote
                  </span>
                </div>
                <div className="relative">
                  <select
                    value={subType}
                    onChange={(e) => {
                      const selectedVal = e.target.value;
                      setSubType(selectedVal);
                      if (selectedVal.includes("Car") || selectedVal.includes("Key")) {
                        setCategory("automotive");
                      } else if (selectedVal.includes("House") || selectedVal.includes("Apartment") || selectedVal.includes("Lock Change")) {
                        setCategory("residential");
                      } else if (selectedVal.includes("Commercial") || selectedVal.includes("Storefront")) {
                        setCategory("commercial");
                      }
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs cursor-pointer"
                  >
                    <optgroup label="Automotive & Car Lockout">
                      <option value="24/7 Car Lockout Rescue">24/7 Car Lockout Rescue</option>
                      <option value="Car Key Cutting & Fob Programming">Car Key Cutting & Fob Programming</option>
                      <option value="All Car Keys Lost (On-Site Origination)">All Car Keys Lost (On-Site Origination)</option>
                      <option value="Broken Key Extracted from Door / Ignition">Broken Key Extraction</option>
                    </optgroup>
                    <optgroup label="Residential House Lockout">
                      <option value="House & Apartment Lockout">House & Apartment Lockout (Pick & Entry)</option>
                      <option value="Lock Change & Re-Keying">Lock Change & Re-Keying</option>
                      <option value="Smart Keypad & Deadbolt Installation">Smart Keypad & Deadbolt Installation</option>
                      <option value="Key Snapped in Deadbolt Cylinder">Key Snapped in Deadbolt</option>
                    </optgroup>
                    <optgroup label="Commercial & Storefront">
                      <option value="Commercial Storefront Lockout">Commercial Storefront Lockout</option>
                      <option value="Panic Crash Bar Exit Device Repair">Panic Crash Bar Exit Device Repair</option>
                      <option value="Storefront Master Key System">Master Key System Setup</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* 1-Click GPS & Map Trigger Inside Modal */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleQuickGps}
                  disabled={gpsLoading}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Navigation className={`w-3.5 h-3.5 text-emerald-700 ${gpsLoading ? "animate-spin" : ""}`} />
                  <span>{gpsLoading ? t("gps_loading") : t("gps_btn")}</span>
                </button>

                {onOpenMapPicker && (
                  <button
                    type="button"
                    onClick={onOpenMapPicker}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-slate-600" />
                    <span>{t("map_pin_btn")}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t("phone_label")}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="(603) 290-5554"
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                  />
                  {state?.errors?.phone && (
                    <p className="text-[11px] text-rose-600 mt-1">{state.errors.phone}</p>
                  )}
                </div>

                {/* 5-digit US ZIP Code */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t("zip_label")}
                  </label>
                  <input
                    type="text"
                    name="zip_code"
                    required
                    maxLength={5}
                    placeholder="03101"
                    value={zip}
                    onChange={(e) => setZip(e.target.value.replace(/[^\d]/g, ""))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                  />
                  {state?.errors?.zip_code && (
                    <p className="text-[11px] text-rose-600 mt-1">{state.errors.zip_code}</p>
                  )}
                </div>
              </div>

              {/* Exact Address / Location landmark */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t("address_label")}
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="e.g. Elm St, Manchester, NH or nearby landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Customer Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    placeholder="e.g. Michael"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Service Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    name="service_category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="emergency">Emergency Lockout</option>
                    <option value="automotive">Car Key & Fob Programming</option>
                    <option value="residential">House Lockout / Lock Change</option>
                    <option value="commercial">Commercial Storefront</option>
                  </select>
                </div>
              </div>

              {/* Specific Problem description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Scenario Details
                </label>
                <input
                  type="text"
                  name="service_sub_type"
                  value={subType}
                  onChange={(e) => setSubType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Trust & Legal Compliance Note */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Security Compliance:</strong>{" "}
                  Valid photo ID and registration/lease match required prior to opening.
                </p>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold text-sm tracking-wide shadow-md transition active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <span>{t("submitting")}</span>
                ) : (
                  <span>{t("submit_dispatch")}</span>
                )}
              </button>

              <div className="text-center pt-1">
                <a
                  href={phoneRaw}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 transition"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call Directly: {displayPhone}</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
