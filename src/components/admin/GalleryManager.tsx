"use client";

import React, { useState, useRef } from "react";
import {
  Camera,
  Plus,
  Edit2,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  Star,
  Image as ImageIcon,
  MapPin,
} from "lucide-react";
import { GalleryItem, GalleryCategory } from "@/types/database.types";
import {
  createGalleryItemAction,
  updateGalleryItemAction,
  deleteGalleryItemAction,
} from "@/app/actions";

interface GalleryManagerProps {
  initialItems: GalleryItem[];
}

export function GalleryManager({ initialItems }: GalleryManagerProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Pagination (6 items per batch)
  const GALLERY_PAGE_SIZE = 6;
  const [displayLimit, setDisplayLimit] = useState<number>(GALLERY_PAGE_SIZE);

  // Form states for creating / editing
  const [formData, setFormData] = useState<{
    title: string;
    category: GalleryCategory;
    category_label: string;
    location: string;
    description: string;
    date_badge: string;
    display_order: number;
    images: string[];
    cover_image: string;
  }>({
    title: "",
    category: "auto",
    category_label: "Car Keys & Fobs",
    location: "Manchester, NH",
    description: "",
    date_badge: "Today",
    display_order: 10,
    images: [],
    cover_image: "",
  });

  const [imageUrlInput, setImageUrlInput] = useState("");
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
      category: "auto",
      category_label: "Car Keys & Fobs",
      location: "Manchester, NH",
      description: "",
      date_badge: "Today",
      display_order: items.length + 1,
      images: [],
      cover_image: "",
    });
    setImageUrlInput("");
  };

  const handleStartAdd = () => {
    resetForm();
    setEditingId(null);
    setIsAddingNew(true);
  };

  const handleStartEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    setIsAddingNew(false);
    setFormData({
      title: item.title,
      category: item.category,
      category_label: item.category_label,
      location: item.location,
      description: item.description,
      date_badge: item.date_badge,
      display_order: item.display_order,
      images: [...item.images],
      cover_image: item.cover_image || item.images[0] || "",
    });
  };

  const handleCancelForm = () => {
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
        const updatedImages = [...formData.images, data.url];
        setFormData({
          ...formData,
          images: updatedImages,
          cover_image: formData.cover_image || data.url,
        });
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

  const handleAddUrlImage = () => {
    if (!imageUrlInput.trim()) return;
    const url = imageUrlInput.trim();
    const updatedImages = [...formData.images, url];
    setFormData({
      ...formData,
      images: updatedImages,
      cover_image: formData.cover_image || url,
    });
    setImageUrlInput("");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const removedUrl = formData.images[indexToRemove];
    const updated = formData.images.filter((_, i) => i !== indexToRemove);
    let newCover = formData.cover_image;
    if (newCover === removedUrl) {
      newCover = updated[0] || "";
    }
    setFormData({
      ...formData,
      images: updated,
      cover_image: newCover,
    });
  };

  const handleSetCover = (url: string) => {
    setFormData({
      ...formData,
      cover_image: url,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please provide a project title.");
      return;
    }

    if (formData.images.length === 0) {
      alert("Please upload or add at least 1 image.");
      return;
    }

    const cover = formData.cover_image || formData.images[0];

    setIsSubmitting(true);

    if (editingId) {
      // Update
      const res = await updateGalleryItemAction(editingId, {
        ...formData,
        cover_image: cover,
      });
      setIsSubmitting(false);

      if (res.success && res.data) {
        setItems((prev) =>
          prev.map((it) => (it.id === editingId ? (res.data as GalleryItem) : it))
        );
        handleCancelForm();
        showStatus("success", "Project updated successfully.");
      } else {
        showStatus("error", res.message || "Failed to update project.");
      }
    } else {
      // Create
      const res = await createGalleryItemAction({
        ...formData,
        cover_image: cover,
        is_active: true,
      });
      setIsSubmitting(false);

      if (res.success && res.data) {
        setItems((prev) => [res.data as GalleryItem, ...prev]);
        handleCancelForm();
        showStatus("success", "Project published to gallery successfully.");
      } else {
        showStatus("error", res.message || "Failed to add project.");
      }
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete project: "${title}"?`)) return;

    setIsSubmitting(true);
    const res = await deleteGalleryItemAction(id);
    setIsSubmitting(false);

    if (res.success) {
      setItems((prev) => prev.filter((it) => it.id !== id));
      showStatus("success", "Project deleted from gallery.");
    } else {
      showStatus("error", res.message || "Failed to delete project.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Completed Works Portfolio
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {items.length} projects published. Upload verified job photos, set cover imagery, and assign tags.
          </p>
        </div>

        {!isAddingNew && !editingId && (
          <button
            onClick={handleStartAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
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

      {/* Create / Edit Form */}
      {(isAddingNew || editingId) && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-slate-900 shadow-md space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                {editingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {editingId ? "Edit Completed Project" : "Add New Project"}
              </h3>
            </div>
            <button
              onClick={handleCancelForm}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* Basic Info Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Ford Smart Key Fob & OBD-II Programming"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    const cat = e.target.value as GalleryCategory;
                    let label = "Car Keys & Fobs";
                    if (cat === "locks") label = "Residential Locks";
                    if (cat === "commercial") label = "Commercial Doors";
                    if (cat === "residential") label = "Residential Security";
                    setFormData({
                      ...formData,
                      category: cat,
                      category_label: label,
                    });
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="auto">Automotive Keys & Fobs (auto)</option>
                  <option value="locks">Residential Locks & Deadbolts (locks)</option>
                  <option value="commercial">Commercial Doors & Storefronts (commercial)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Location (City / Area)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Manchester, NH"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Date Badge
                </label>
                <input
                  type="text"
                  value={formData.date_badge}
                  onChange={(e) => setFormData({ ...formData, date_badge: e.target.value })}
                  placeholder="e.g. Today, Yesterday, 2 days ago"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
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
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Detailed Work Description
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe key origination, lockout resolution, tools utilized..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            {/* Photos & Cover Selection Section */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Upload Imagery & Choose Cover Picture</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Upload photos. Click any thumbnail to designate it as the primary cover picture.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="gallery-file-input"
                  />
                  <label
                    htmlFor="gallery-file-input"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition cursor-pointer shadow-xs ${
                      isUploading ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? "Uploading..." : "Upload Photo"}</span>
                  </label>
                </div>
              </div>

              {/* URL fallback adder */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Or paste direct image URL (e.g. /gallery/jobs/sample.jpg or https://...)"
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-none text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddUrlImage}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition"
                >
                  Add URL
                </button>
              </div>

              {/* Uploaded Images Preview Grid with Cover Selector */}
              {formData.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                  {formData.images.map((imgUrl, idx) => {
                    const isCover = (formData.cover_image || formData.images[0]) === imgUrl;

                    return (
                      <div
                        key={idx}
                        className={`relative rounded-xl overflow-hidden border-2 transition group ${
                          isCover
                            ? "border-emerald-600 ring-2 ring-emerald-600/20"
                            : "border-slate-200 hover:border-slate-400 bg-white"
                        }`}
                      >
                        <div className="h-32 w-full relative bg-slate-100">
                          <img
                            src={imgUrl}
                            alt={`Preview ${idx}`}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                          {isCover ? (
                            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                              <Star className="w-3 h-3 fill-white" />
                              <span>Cover</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetCover(imgUrl)}
                              className="bg-black/60 hover:bg-emerald-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md transition backdrop-blur-xs"
                            >
                              Set as Cover
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1 rounded-md bg-black/60 hover:bg-rose-600 text-white transition"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Bottom path info */}
                        <div className="p-1.5 bg-slate-100 border-t border-slate-200 text-[10px] text-slate-600 truncate">
                          {imgUrl.split("/").pop()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center border border-dashed border-slate-300 rounded-xl text-slate-500 text-xs bg-white">
                  No images added yet. Click Upload Photo or paste a direct image URL above.
                </div>
              )}
            </div>

            {/* Buttons */}
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
                <span>{isSubmitting ? "Saving..." : "Save Project"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gallery Items Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.slice(0, displayLimit).map((item) => {
            const coverImg = item.cover_image || item.images[0] || "/gallery/hero-banner.png";

            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs hover:shadow-sm flex flex-col justify-between group hover:border-slate-300 transition"
              >
                <div>
                  {/* Photo Preview Container with Cover indicator (h-36 max) */}
                  <div className="relative h-36 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={coverImg}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Compact Badges on image */}
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                      <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/10">
                        {item.category_label}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-[10px] font-bold text-white flex items-center gap-1 shadow-xs">
                        <Star className="w-2.5 h-2.5 fill-white" />
                        Cover
                      </span>
                    </div>

                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-medium text-white flex items-center gap-1 border border-white/10">
                      <ImageIcon className="w-3 h-3 text-emerald-400" />
                      <span>{item.images.length}</span>
                    </div>

                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] text-white flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span className="truncate max-w-[140px]">{item.location}</span>
                    </div>
                  </div>

                  {/* Content (compact p-3.5) */}
                  <div className="p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <span>{item.date_badge}</span>
                      <span>#{item.display_order}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-xs sm:text-[13px] line-clamp-1 group-hover:text-emerald-700 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Compact Action buttons */}
                <div className="px-3.5 pb-3 pt-2 border-t border-slate-100 flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3 text-emerald-600" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1 rounded-md bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs transition cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination / Load More Footer */}
        {items.length > GALLERY_PAGE_SIZE && (
          <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">
              Showing {Math.min(displayLimit, items.length)} of {items.length} items
            </span>
            <div className="flex items-center gap-2">
              {displayLimit < items.length && (
                <button
                  onClick={() => setDisplayLimit((prev) => prev + GALLERY_PAGE_SIZE)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold text-emerald-700 transition cursor-pointer"
                >
                  Load More ({items.length - displayLimit} remaining)
                </button>
              )}
              {displayLimit > GALLERY_PAGE_SIZE && (
                <button
                  onClick={() => setDisplayLimit(GALLERY_PAGE_SIZE)}
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
