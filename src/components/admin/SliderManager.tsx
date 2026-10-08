"use client";

import React, { useState, useRef } from "react";
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  MapPin,
} from "lucide-react";
import { HeroSlide } from "@/types/database.types";
import {
  createHeroSlideAction,
  updateHeroSlideAction,
  deleteHeroSlideAction,
} from "@/app/actions";

interface SliderManagerProps {
  initialSlides: HeroSlide[];
}

export function SliderManager({ initialSlides }: SliderManagerProps) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Pagination (6 slides per batch)
  const SLIDES_PAGE_SIZE = 6;
  const [slidesLimit, setSlidesLimit] = useState<number>(SLIDES_PAGE_SIZE);

  const [formData, setFormData] = useState<Omit<HeroSlide, "id" | "created_at">>({
    title: "",
    badge: "24/7 Mobile Dispatch",
    location: "Manchester, NH",
    image_url: "",
    display_order: 1,
    is_active: true,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      badge: "24/7 Mobile Dispatch",
      location: "Manchester, NH",
      image_url: "",
      display_order: slides.length + 1,
      is_active: true,
    });
  };

  const handleStartAdd = () => {
    resetForm();
    setEditingId(null);
    setIsAddingNew(true);
  };

  const handleStartEdit = (slide: HeroSlide) => {
    setEditingId(slide.id);
    setIsAddingNew(false);
    setFormData({
      title: slide.title,
      badge: slide.badge,
      location: slide.location,
      image_url: slide.image_url,
      display_order: slide.display_order,
      is_active: slide.is_active,
    });
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
    resetForm();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();

      if (data.success && data.url) {
        setFormData({ ...formData, image_url: data.url });
        showStatus("success", "Image uploaded successfully!");
      } else {
        showStatus("error", data.message || "Failed to upload image.");
      }
    } catch (err: any) {
      showStatus("error", err?.message || "An error occurred during upload.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please provide a headline title for the slide.");
      return;
    }
    if (!formData.image_url.trim()) {
      alert("Please upload or enter a background image URL.");
      return;
    }

    setIsSubmitting(true);

    if (editingId) {
      const res = await updateHeroSlideAction(editingId, formData);
      setIsSubmitting(false);

      if (res.success && res.data) {
        setSlides((prev) =>
          prev.map((s) => (s.id === editingId ? (res.data as HeroSlide) : s))
        );
        handleCancel();
        showStatus("success", "Hero slide updated successfully.");
      } else {
        showStatus("error", res.message || "Failed to update slide.");
      }
    } else {
      const res = await createHeroSlideAction(formData);
      setIsSubmitting(false);

      if (res.success && res.data) {
        setSlides((prev) => [...prev, res.data as HeroSlide]);
        handleCancel();
        showStatus("success", "Hero slide published successfully.");
      } else {
        showStatus("error", res.message || "Failed to create slide.");
      }
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete slide: "${title}"?`)) return;

    setIsSubmitting(true);
    const res = await deleteHeroSlideAction(id);
    setIsSubmitting(false);

    if (res.success) {
      setSlides((prev) => prev.filter((s) => s.id !== id));
      showStatus("success", "Slide deleted successfully.");
    } else {
      showStatus("error", res.message || "Failed to delete slide.");
    }
  };

  const handleToggleActive = async (slide: HeroSlide) => {
    const updated = !slide.is_active;
    const res = await updateHeroSlideAction(slide.id, { is_active: updated });
    if (res.success) {
      setSlides((prev) =>
        prev.map((s) => (s.id === slide.id ? { ...s, is_active: updated } : s))
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Homepage Hero Slider
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Top banner rotating imagery and emergency badges. Total {slides.length} slides configured.
          </p>
        </div>

        {!isAddingNew && !editingId && (
          <button
            onClick={handleStartAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Slide</span>
          </button>
        )}
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

      {/* Add / Edit Form */}
      {(isAddingNew || editingId) && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-slate-900 shadow-md space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                {editingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {editingId ? "Edit Hero Slide" : "Add New Hero Slide"}
              </h3>
            </div>
            <button
              onClick={handleCancel}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Headline Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 24/7 Mobile Locksmith Service"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g. Active Mobile Fleet"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Location (City / State)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Manchester, NH"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({ ...formData, display_order: Number(e.target.value) })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="slide-active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded bg-white border-slate-300 text-emerald-600 focus:ring-0"
                />
                <label htmlFor="slide-active" className="text-slate-700 font-semibold cursor-pointer">
                  Slide is Active
                </label>
              </div>
            </div>

            {/* Slide Image Upload / URL */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <label className="text-[11px] font-semibold text-slate-700 block">
                Slide Background Image *
              </label>

              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="slide-file-upload"
                />
                <label
                  htmlFor="slide-file-upload"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition cursor-pointer shrink-0 shadow-xs ${
                    isUploading ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? "Uploading..." : "Upload Photo"}</span>
                </label>

                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="Or paste direct image path: /gallery/hero-banner.png or https://..."
                  className="flex-1 w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              {formData.image_url && (
                <div className="pt-2">
                  <div className="h-44 w-full max-w-md rounded-xl overflow-hidden border border-slate-200 bg-white relative">
                    <img
                      src={formData.image_url}
                      alt="Slide preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-white">
                      Live Preview
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? "Saving..." : "Save Slide"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Slides Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {slides.slice(0, slidesLimit).map((slide) => (
            <div
              key={slide.id}
              className={`bg-white border rounded-xl overflow-hidden shadow-xs hover:shadow-sm flex flex-col justify-between group transition ${
                slide.is_active ? "border-slate-200/90 hover:border-slate-300" : "border-slate-200/50 opacity-60"
              }`}
            >
              <div>
                {/* Image banner preview (compact h-28 to h-32) */}
                <div className="relative h-28 sm:h-32 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={slide.image_url}
                    alt={slide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-[10px] font-bold text-white shadow-xs">
                      {slide.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] text-white flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span className="truncate max-w-[140px]">{slide.location}</span>
                  </div>

                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => handleToggleActive(slide)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                        slide.is_active
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {slide.is_active ? "Active" : "Disabled"}
                    </button>
                  </div>
                </div>

                {/* Title & info (compact p-3) */}
                <div className="p-3 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span>Order #{slide.display_order}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-[13px] leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    {slide.title}
                  </h3>
                </div>
              </div>

              {/* Compact Actions */}
              <div className="px-3 pb-3 pt-2 border-t border-slate-100 flex items-center justify-end gap-1.5">
                <button
                  onClick={() => handleStartEdit(slide)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                >
                  <Edit2 className="w-3 h-3 text-emerald-600" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(slide.id, slide.title)}
                  className="p-1 rounded-md bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs transition cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination / Load More Footer */}
        {slides.length > SLIDES_PAGE_SIZE && (
          <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">
              Showing {Math.min(slidesLimit, slides.length)} of {slides.length} slides
            </span>
            <div className="flex items-center gap-2">
              {slidesLimit < slides.length && (
                <button
                  onClick={() => setSlidesLimit((prev) => prev + SLIDES_PAGE_SIZE)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold text-emerald-700 transition cursor-pointer"
                >
                  Load More ({slides.length - slidesLimit} remaining)
                </button>
              )}
              {slidesLimit > SLIDES_PAGE_SIZE && (
                <button
                  onClick={() => setSlidesLimit(SLIDES_PAGE_SIZE)}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600 transition cursor-pointer"
                >
                  Show Less
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
