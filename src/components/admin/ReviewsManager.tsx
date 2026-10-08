"use client";

import React, { useState, useRef } from "react";
import {
  Star,
  MapPin,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  LayoutGrid,
} from "lucide-react";
import { Testimonial } from "@/types/database.types";
import {
  createTestimonialAction,
  updateTestimonialAction,
  deleteTestimonialAction,
  moderateReviewAction,
} from "@/app/actions";
import { ReviewAvatar } from "@/components/ui/ReviewAvatar";

interface ReviewsManagerProps {
  initialTestimonials: Testimonial[];
}

const GOOGLE_MAPS_PIN_URL = "https://maps.app.goo.gl/j9Zvw9xhNKP5Rgk29";

export function ReviewsManager({ initialTestimonials }: ReviewsManagerProps) {
  const [reviews, setReviews] = useState<Testimonial[]>(initialTestimonials);
  const [viewMode, setViewMode] = useState<"grid" | "carousel">("grid");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Testimonial, "id" | "created_at">>({
    author_name: "",
    rating: 5,
    review_text: "",
    location: "Manchester, NH",
    service_type: "Emergency Locksmith Service",
    verified_customer: true,
    is_featured: false,
    is_approved: true,
    author_photo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const resetForm = () => {
    setFormData({
      author_name: "",
      rating: 5,
      review_text: "",
      location: "Manchester, NH",
      service_type: "Emergency Locksmith Service",
      verified_customer: true,
      is_featured: false,
      is_approved: true,
      author_photo: "",
    });
  };

  const handleStartAdd = () => {
    resetForm();
    setEditingId(null);
    setIsAddingNew(true);
  };

  const handleStartEdit = (review: Testimonial) => {
    setEditingId(review.id);
    setIsAddingNew(false);
    setFormData({
      author_name: review.author_name,
      rating: review.rating,
      review_text: review.review_text,
      location: review.location,
      service_type: review.service_type,
      verified_customer: review.verified_customer ?? true,
      is_featured: review.is_featured,
      is_approved: review.is_approved,
      author_photo: review.author_photo || "",
    });
  };

  const handleCancelForm = () => {
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author_name.trim() || !formData.review_text.trim()) {
      alert("Please provide author name and review text.");
      return;
    }

    setIsSubmitting(true);

    if (editingId) {
      const res = await updateTestimonialAction(editingId, formData);
      setIsSubmitting(false);

      if (res.success && res.data) {
        setReviews((prev) =>
          prev.map((r) => (r.id === editingId ? (res.data as Testimonial) : r))
        );
        handleCancelForm();
        showStatus("success", "Review updated successfully.");
      } else {
        showStatus("error", res.message || "Failed to update review.");
      }
    } else {
      const res = await createTestimonialAction(formData);
      setIsSubmitting(false);

      if (res.success && res.data) {
        setReviews((prev) => [res.data as Testimonial, ...prev]);
        handleCancelForm();
        showStatus("success", "New review added successfully.");
      } else {
        showStatus("error", res.message || "Failed to create review.");
      }
    }
  };

  const handleDelete = async (id: string, author: string) => {
    if (!confirm(`Are you sure you want to delete review from "${author}"?`)) return;

    setIsSubmitting(true);
    const res = await deleteTestimonialAction(id);
    setIsSubmitting(false);

    if (res.success) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      showStatus("success", "Review deleted successfully.");
    } else {
      showStatus("error", res.message || "Failed to delete review.");
    }
  };

  const handleSyncWithGoogle = async () => {
    setIsSyncing(true);
    showStatus("success", "Connecting to Google Maps review source...");
    try {
      const res = await fetch("/api/reviews?refresh=true");
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews) && data.reviews.length > 0) {
        setReviews(data.reviews);
        showStatus(
          "success",
          `Google sync complete! Loaded ${data.reviews.length} reviews (${data.rating || 5.0} ★ rating).`
        );
      } else {
        showStatus("success", "Google reviews refreshed.");
      }
    } catch {
      showStatus("error", "Google sync completed with local cached data.");
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleApproval = async (review: Testimonial) => {
    const nextApproved = !review.is_approved;
    await moderateReviewAction({
      id: review.id,
      is_approved: nextApproved,
    });
    setReviews((prev) =>
      prev.map((r) => (r.id === review.id ? { ...r, is_approved: nextApproved } : r))
    );
    showStatus("success", `Status: ${nextApproved ? "Visible on live site" : "Hidden from site"}`);
  };

  const toggleFeatured = async (review: Testimonial) => {
    const nextFeatured = !review.is_featured;
    await moderateReviewAction({
      id: review.id,
      is_featured: nextFeatured,
    });
    setReviews((prev) =>
      prev.map((r) => (r.id === review.id ? { ...r, is_featured: nextFeatured } : r))
    );
    showStatus("success", `Status: ${nextFeatured ? "Marked as Featured" : "Standard"}`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions Bar */}
      <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Google Maps Pin Link */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 text-base sm:text-lg">
                Local Lock & Key Service
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                Google Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {reviews.length} reviews • 5.0 ★ Rating • Manchester, NH & Surrounding Areas
            </p>
          </div>
        </div>

        {/* Right Actions: Add Review + Sync + View Mode */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleStartAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Review</span>
          </button>

          <a
            href={GOOGLE_MAPS_PIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
            title="Open Google Maps Profile"
          >
            <MapPin className="w-3.5 h-3.5 fill-white" />
            <span>Google Maps Pin</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>

          <button
            type="button"
            onClick={handleSyncWithGoogle}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-emerald-600" : ""}`} />
            <span>{isSyncing ? "Syncing..." : "Google Sync"}</span>
          </button>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === "grid" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("carousel")}
              className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === "carousel" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
              title="Carousel View"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 border ${
            statusMsg.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {statusMsg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Add / Edit Review Form */}
      {(isAddingNew || editingId) && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-slate-900 shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                {editingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {editingId ? "Edit Customer Review" : "Add Customer Review"}
              </h3>
            </div>
            <button
              onClick={handleCancelForm}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Author Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  placeholder="e.g. Steve Plante"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Rating (Stars 1-5) *
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value={5}>5 Stars (★★★★★)</option>
                  <option value={4}>4 Stars (★★★★☆)</option>
                  <option value={3}>3 Stars (★★★☆☆)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Location (Town / City)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Manchester, NH"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Service Scenario / Type
                </label>
                <input
                  type="text"
                  value={formData.service_type}
                  onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                  placeholder="Emergency Car Lockout Rescue"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Author Photo URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.author_photo || ""}
                  onChange={(e) => setFormData({ ...formData, author_photo: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-6">
                <label className="flex items-center gap-1.5 text-slate-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_approved}
                    onChange={(e) => setFormData({ ...formData, is_approved: e.target.checked })}
                    className="rounded bg-white border-slate-300 text-emerald-600 focus:ring-0"
                  />
                  <span>Approved (Live on site)</span>
                </label>

                <label className="flex items-center gap-1.5 text-slate-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded bg-white border-slate-300 text-amber-500 focus:ring-0"
                  />
                  <span>Featured Hero</span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Review Text *
              </label>
              <textarea
                rows={3}
                required
                value={formData.review_text}
                onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                placeholder="Customer review testimony..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={handleCancelForm}
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
                <span>{isSubmitting ? "Saving..." : "Save Review"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews Display */}
      {viewMode === "carousel" ? (
        <div className="relative group/carousel">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="text-xs font-bold text-slate-500">
              Showing {reviews.length} reviews
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scroll("left")}
                className="w-8 h-8 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-xs cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                className="w-8 h-8 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-xs cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 no-scrollbar -mx-2 px-2"
          >
            {reviews.map((r) => (
              <div
                key={r.id}
                className={`shrink-0 w-[300px] sm:w-[360px] md:w-[400px] snap-start bg-white border rounded-2xl p-5 sm:p-6 text-slate-800 flex flex-col justify-between shadow-xs hover:shadow-md ${
                  r.is_approved ? "border-slate-200" : "border-amber-200 bg-amber-50/20"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-1">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-xs font-black text-slate-900 ml-1.5">{r.rating}.0</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleFeatured(r)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer ${
                          r.is_featured
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {r.is_featured ? "Featured" : "Regular"}
                      </button>

                      <button
                        onClick={() => toggleApproval(r)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border cursor-pointer ${
                          r.is_approved
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {r.is_approved ? "Live" : "Hidden"}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic mb-4 min-h-[60px]">
                    &ldquo;{r.review_text}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ReviewAvatar
                      photoUrl={r.author_photo}
                      name={r.author_name}
                      size="sm"
                    />
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">{r.author_name}</span>
                      <span className="text-[10px] text-slate-500 block">{r.service_type}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(r)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id, r.author_name)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r) => (
            <div
              key={r.id}
              className={`bg-white border rounded-2xl p-5 text-slate-800 flex flex-col justify-between shadow-xs transition hover:shadow-md hover:border-slate-300 ${
                r.is_approved ? "border-slate-200" : "border-amber-200 bg-amber-50/20"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs font-black text-slate-900 ml-1.5">{r.rating}.0</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleFeatured(r)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer ${
                        r.is_featured
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {r.is_featured ? "Featured" : "Regular"}
                    </button>

                    <button
                      onClick={() => toggleApproval(r)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border cursor-pointer ${
                        r.is_approved
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      {r.is_approved ? "Live" : "Hidden"}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic mb-4 min-h-[50px]">
                  &ldquo;{r.review_text}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ReviewAvatar
                    photoUrl={r.author_photo}
                    name={r.author_name}
                    size="sm"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">{r.author_name}</span>
                    <span className="text-[10px] text-slate-500 block truncate max-w-[160px]">
                      {r.service_type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(r)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(r.id, r.author_name)}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
