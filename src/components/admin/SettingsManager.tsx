"use client";

import React, { useState } from "react";
import {
  Settings,
  PhoneCall,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  AlertCircle,
  Save,
  Globe,
  Share2,
} from "lucide-react";
import { SiteSettings } from "@/types/database.types";
import { updateSiteSettingsAction } from "@/app/actions";

interface SettingsManagerProps {
  initialSettings: SiteSettings;
}

export function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const [formData, setFormData] = useState<SiteSettings>(initialSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await updateSiteSettingsAction(formData);
    setIsSubmitting(false);

    if (res.success && res.data) {
      setFormData(res.data as SiteSettings);
      showStatus("success", "Site settings updated successfully!");
    } else {
      showStatus("error", res.message || "Failed to update settings.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Site Settings & Coordinates
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure hotline phone numbers, WhatsApp, dispatch coverage address, Google Maps embeds, and reviews ratings.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 border ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* 1. Contact Numbers & Messaging */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Direct Hotline & Messaging</h3>
              <p className="text-[11px] text-slate-500">
                Phone numbers dialed by customers from all call buttons and quick dispatch forms across the site.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Display Phone Number *
              </label>
              <input
                type="text"
                required
                value={formData.phone_display}
                onChange={(e) =>
                  setFormData({ ...formData, phone_display: e.target.value })
                }
                placeholder="+1 (603) 290-5554"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Visual phone text displayed on UI
              </span>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Direct Dial URL (tel:) *
              </label>
              <input
                type="text"
                required
                value={formData.phone_raw}
                onChange={(e) =>
                  setFormData({ ...formData, phone_raw: e.target.value })
                }
                placeholder="tel:+16032905554"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Click-to-call link target (e.g. tel:+16032905554)
              </span>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                WhatsApp Phone Number *
              </label>
              <input
                type="text"
                required
                value={formData.whatsapp_number}
                onChange={(e) =>
                  setFormData({ ...formData, whatsapp_number: e.target.value })
                }
                placeholder="+16032905554"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Includes country code with leading + (e.g. +1...)
              </span>
            </div>
          </div>
        </div>

        {/* 2. Address & Google Maps */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Location & Google Maps Integration</h3>
              <p className="text-[11px] text-slate-500">
                Primary business address, direct Google Maps link, and embedded map iframe.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Primary Address / Coverage Region *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Manchester, NH & Greater Southern NH Area"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Google Maps Direct URL (Short URL / Maps Link) *
              </label>
              <input
                type="url"
                required
                value={formData.google_maps_url}
                onChange={(e) =>
                  setFormData({ ...formData, google_maps_url: e.target.value })
                }
                placeholder="https://maps.app.goo.gl/j9Zvw9xhNKP5Rgk29"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Google Maps Embed Iframe URL
              </label>
              <input
                type="text"
                value={formData.google_maps_embed_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, google_maps_embed_url: e.target.value })
                }
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-[11px] focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Obtain from Google Maps &gt; Share &gt; Embed a map &gt; src URL
              </span>
            </div>
          </div>

          {/* Map Preview */}
          {formData.google_maps_embed_url && (
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-slate-500 mb-2">
                Live Embed Preview:
              </div>
              <div className="h-56 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <iframe
                  src={formData.google_maps_embed_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps Preview"
                ></iframe>
              </div>
            </div>
          )}
        </div>

        {/* 3. Operational Info & Live Badges */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Operations & Emergency ETAs</h3>
              <p className="text-[11px] text-slate-500">
                Availability schedules, arrival metrics, and live patrol status badges.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Working Hours *
              </label>
              <input
                type="text"
                required
                value={formData.working_hours}
                onChange={(e) =>
                  setFormData({ ...formData, working_hours: e.target.value })
                }
                placeholder="24/7 Emergency Dispatch"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Emergency Response ETA *
              </label>
              <input
                type="text"
                required
                value={formData.emergency_eta}
                onChange={(e) =>
                  setFormData({ ...formData, emergency_eta: e.target.value })
                }
                placeholder="15–20 Min Rapid Mobile Units"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Header Live Patrol Badge
              </label>
              <input
                type="text"
                value={formData.emergency_badge}
                onChange={(e) =>
                  setFormData({ ...formData, emergency_badge: e.target.value })
                }
                placeholder="Live Patrols in Manchester & NH Areas"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 4. Google Reviews Stats */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Google Reviews Metrics</h3>
              <p className="text-[11px] text-slate-500">
                Aggregate star rating and verified total count displayed across website proofs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Google Star Rating (1.0 - 5.0)
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={formData.google_rating}
                onChange={(e) =>
                  setFormData({ ...formData, google_rating: Number(e.target.value) })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Total Verified Review Count
              </label>
              <input
                type="number"
                value={formData.google_review_count}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    google_review_count: Number(e.target.value),
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs transition cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? "Saving..." : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
