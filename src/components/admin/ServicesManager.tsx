"use client";

import React, { useState } from "react";
import {
  Car,
  Home,
  Building2,
  Key,
  Shield,
  Wrench,
  Lock,
  Zap,
  Clock,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  Layers,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import {
  ServiceCategoryItem,
  ServiceScenarioItem,
  ServiceItem,
} from "@/types/database.types";
import {
  createServiceCategoryAction,
  updateServiceCategoryAction,
  deleteServiceCategoryAction,
  createServiceScenarioAction,
  updateServiceScenarioAction,
  deleteServiceScenarioAction,
} from "@/app/actions";

interface ServicesManagerProps {
  initialCategories?: ServiceCategoryItem[];
  initialScenarios?: ServiceScenarioItem[];
  // For backwards compatibility if called with initialServices
  initialServices?: ServiceItem[];
}

// Icon helper mapping
const AVAILABLE_ICONS = [
  { id: "Car", label: "Automotive / Car", icon: Car },
  { id: "Home", label: "Residential / House", icon: Home },
  { id: "Building2", label: "Commercial / Storefront", icon: Building2 },
  { id: "Key", label: "Key / Locksmith", icon: Key },
  { id: "Shield", label: "Security / Shield", icon: Shield },
  { id: "Wrench", label: "Repair / Wrench", icon: Wrench },
  { id: "Lock", label: "Deadbolt / Padlock", icon: Lock },
  { id: "Zap", label: "Emergency / Fast", icon: Zap },
];

export function renderCategoryIcon(iconName: string, className = "w-4 h-4") {
  const match = AVAILABLE_ICONS.find(
    (i) => i.id.toLowerCase() === (iconName || "").toLowerCase()
  );
  if (match) {
    const IconComponent = match.icon;
    return <IconComponent className={className} />;
  }
  return <Key className={className} />;
}

export function ServicesManager({
  initialCategories = [],
  initialScenarios = [],
}: ServicesManagerProps) {
  // Fallbacks if empty
  const defaultCategories: ServiceCategoryItem[] = [
    { id: "automotive", name: "Car Lockout & Keys", icon: "Car", display_order: 1, is_active: true },
    { id: "residential", name: "House & Apartment", icon: "Home", display_order: 2, is_active: true },
    { id: "commercial", name: "Commercial Storefront", icon: "Building2", display_order: 3, is_active: true },
  ];

  const [categories, setCategories] = useState<ServiceCategoryItem[]>(
    initialCategories.length > 0 ? initialCategories : defaultCategories
  );
  const [scenarios, setScenarios] = useState<ServiceScenarioItem[]>(initialScenarios);

  // Active selected category for tabs
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    categories[0]?.id || "automotive"
  );

  // Pagination for scenarios (6 per batch)
  const SCENARIOS_PAGE_SIZE = 6;
  const [scenarioLimit, setScenarioLimit] = useState<number>(SCENARIOS_PAGE_SIZE);

  const handleSelectCategory = (id: string) => {
    setActiveCategoryId(id);
    setScenarioLimit(SCENARIOS_PAGE_SIZE);
  };

  // Status feedback toast
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategoryItem | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    icon: "Car",
    display_order: 1,
    is_active: true,
  });

  // Scenario Modal State
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [editingScenario, setEditingScenario] = useState<ServiceScenarioItem | null>(null);
  const [scenarioFormData, setScenarioFormData] = useState({
    category_id: "",
    label: "",
    notes: "",
    eta: "15–20 mins",
    display_order: 1,
    is_active: true,
  });

  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Get active category object
  const activeCategory =
    categories.find((c) => c.id === activeCategoryId) || categories[0];

  // Scenarios belonging to active category
  const activeScenarios = scenarios.filter(
    (s) => s.category_id === activeCategory?.id
  );

  // ==========================================
  // Category Modal Handlers
  // ==========================================
  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: "",
      icon: "Car",
      display_order: categories.length + 1,
      is_active: true,
    });
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: ServiceCategoryItem) => {
    setEditingCategory(cat);
    setCategoryFormData({
      name: cat.name,
      icon: cat.icon || "Car",
      display_order: cat.display_order,
      is_active: cat.is_active,
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.name.trim()) {
      showStatus("error", "Category name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        // Update
        const res = await updateServiceCategoryAction(editingCategory.id, categoryFormData);
        if (res.success) {
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editingCategory.id ? { ...c, ...categoryFormData } : c
            )
          );
          setIsCategoryModalOpen(false);
          showStatus("success", `Category "${categoryFormData.name}" updated successfully.`);
        } else {
          showStatus("error", res.message || "Failed to update category.");
        }
      } else {
        // Create
        const slugId = categoryFormData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        const res = await createServiceCategoryAction({
          id: slugId || `cat-${Date.now()}`,
          name: categoryFormData.name,
          icon: categoryFormData.icon,
          display_order: categoryFormData.display_order,
          is_active: categoryFormData.is_active,
        });

        if (res.success && res.data) {
          const newCat = res.data as ServiceCategoryItem;
          setCategories((prev) => [...prev, newCat]);
          setActiveCategoryId(newCat.id);
          setIsCategoryModalOpen(false);
          showStatus("success", `Category "${newCat.name}" created successfully.`);
        } else {
          showStatus("error", res.message || "Failed to create category.");
        }
      }
    } catch (err: any) {
      showStatus("error", err?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (cat: ServiceCategoryItem) => {
    if (categories.length <= 1) {
      alert("At least one category must remain in the catalog.");
      return;
    }

    const confirmMsg = `Are you sure you want to delete category "${cat.name}"?\nAll associated service scenarios within this category will also be removed.`;
    if (!window.confirm(confirmMsg)) return;

    setIsSubmitting(true);
    try {
      const res = await deleteServiceCategoryAction(cat.id);
      if (res.success) {
        const remaining = categories.filter((c) => c.id !== cat.id);
        setCategories(remaining);
        setScenarios((prev) => prev.filter((s) => s.category_id !== cat.id));
        if (activeCategoryId === cat.id && remaining.length > 0) {
          setActiveCategoryId(remaining[0].id);
        }
        showStatus("success", `Category "${cat.name}" deleted successfully.`);
      } else {
        showStatus("error", res.message || "Failed to delete category.");
      }
    } catch (err: any) {
      showStatus("error", err?.message || "Failed to delete category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // Scenario Modal Handlers
  // ==========================================
  const openAddScenarioModal = () => {
    setEditingScenario(null);
    setScenarioFormData({
      category_id: activeCategory ? activeCategory.id : categories[0]?.id || "automotive",
      label: "",
      notes: "",
      eta: "15–20 mins",
      display_order: activeScenarios.length + 1,
      is_active: true,
    });
    setIsScenarioModalOpen(true);
  };

  const openEditScenarioModal = (scenario: ServiceScenarioItem) => {
    setEditingScenario(scenario);
    setScenarioFormData({
      category_id: scenario.category_id,
      label: scenario.label,
      notes: scenario.notes || "",
      eta: scenario.eta || "15–20 mins",
      display_order: scenario.display_order,
      is_active: scenario.is_active,
    });
    setIsScenarioModalOpen(true);
  };

  const handleSaveScenario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenarioFormData.label.trim()) {
      showStatus("error", "Scenario title is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingScenario) {
        // Update
        const res = await updateServiceScenarioAction(editingScenario.id, scenarioFormData);
        if (res.success) {
          setScenarios((prev) =>
            prev.map((s) =>
              s.id === editingScenario.id ? { ...s, ...scenarioFormData } : s
            )
          );
          setIsScenarioModalOpen(false);
          showStatus("success", `Scenario "${scenarioFormData.label}" updated.`);
        } else {
          showStatus("error", res.message || "Failed to update scenario.");
        }
      } else {
        // Create
        const res = await createServiceScenarioAction({
          category_id: scenarioFormData.category_id,
          label: scenarioFormData.label,
          notes: scenarioFormData.notes,
          eta: scenarioFormData.eta,
          display_order: scenarioFormData.display_order,
          is_active: scenarioFormData.is_active,
        });

        if (res.success && res.data) {
          const newScenario = res.data as ServiceScenarioItem;
          setScenarios((prev) => [...prev, newScenario]);
          setIsScenarioModalOpen(false);
          showStatus("success", `Scenario "${newScenario.label}" added successfully.`);
        } else {
          showStatus("error", res.message || "Failed to create scenario.");
        }
      }
    } catch (err: any) {
      showStatus("error", err?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteScenario = async (scenario: ServiceScenarioItem) => {
    if (!window.confirm(`Are you sure you want to delete scenario "${scenario.label}"?`)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await deleteServiceScenarioAction(scenario.id);
      if (res.success) {
        setScenarios((prev) => prev.filter((s) => s.id !== scenario.id));
        showStatus("success", `Scenario "${scenario.label}" deleted.`);
      } else {
        showStatus("error", res.message || "Failed to delete scenario.");
      }
    } catch (err: any) {
      showStatus("error", err?.message || "Failed to delete scenario.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold shadow-md transition-all ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="p-1 hover:bg-black/5 rounded-lg text-slate-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Bar: Section Title & Add Category Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Service Categories & Scenarios</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {categories.length} Categories
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage public dispatch categories, lockout scenarios, response times, and specifications (Zero Pricing)
          </p>
        </div>

        <button
          onClick={openAddCategoryModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs transition shadow-sm shadow-emerald-600/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* 1. Horizontal Category Tab Bar */}
      <div className="bg-slate-100/80 border border-slate-200/90 rounded-2xl p-1.5 sm:p-2 shadow-inner">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
          {categories.map((cat) => {
            const isActive = cat.id === activeCategoryId;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-white text-emerald-800 shadow-sm border border-emerald-200"
                    : "bg-transparent hover:bg-white/60 text-slate-600 hover:text-slate-900 border border-transparent"
                }`}
              >
                <span className={isActive ? "text-emerald-600" : "text-slate-400"}>
                  {renderCategoryIcon(cat.icon, "w-4 h-4")}
                </span>
                <span>{cat.name}</span>
                {!cat.is_active && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-600 border border-slate-300">
                    Draft
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Category Header & Controls Bar */}
      {activeCategory && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
              {renderCategoryIcon(activeCategory.icon, "w-5 h-5")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {activeCategory.name}
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {activeScenarios.length} scenarios
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Dispatch scenarios displayed on the public website for this category
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Edit Category Button */}
            <button
              onClick={() => openEditCategoryModal(activeCategory)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 transition cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Category</span>
            </button>

            {/* Delete Category Button */}
            <button
              onClick={() => handleDeleteCategory(activeCategory)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold text-rose-700 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Category</span>
            </button>

            {/* Add Scenario to Active Category */}
            <button
              onClick={openAddScenarioModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-xs cursor-pointer ml-auto sm:ml-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Scenario</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Scenario Cards Grid for the Active Category */}
      <div className="space-y-3">
        {activeScenarios.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 sm:p-12 text-center text-slate-500 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">No scenarios found in this category</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Add emergency situations such as lockout rescue, key origination, or broken key extraction.
              </p>
            </div>
            <button
              onClick={openAddScenarioModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Scenario</span>
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {activeScenarios.slice(0, scenarioLimit).map((scenario) => {
                return (
                  <div
                    key={scenario.id}
                    className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl p-3 sm:p-4 flex flex-col justify-between gap-3 transition shadow-xs hover:shadow-sm group"
                  >
                    <div className="space-y-2">
                      {/* Top Row: Icon badge + Active toggle / Actions */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                            {renderCategoryIcon(activeCategory?.icon, "w-3 h-3")}
                          </div>
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 truncate max-w-[140px]">
                            {activeCategory?.name}
                          </span>
                        </div>

                        {/* Status indicator */}
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            scenario.is_active
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                        >
                          {scenario.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>

                      {/* Scenario Label */}
                      <div>
                        <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                          {scenario.label}
                        </h4>
                        {scenario.notes && (
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {scenario.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Row: ETA & Action buttons */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
                        <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{scenario.eta || "15–20 mins"}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditScenarioModal(scenario)}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                          title="Edit Scenario"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteScenario(scenario)}
                          className="p-1 rounded-md text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete Scenario"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination / Load More Footer */}
            {activeScenarios.length > SCENARIOS_PAGE_SIZE && (
              <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-xs">
                <span className="text-xs text-slate-500 font-medium">
                  Showing {Math.min(scenarioLimit, activeScenarios.length)} of {activeScenarios.length} scenarios
                </span>
                <div className="flex items-center gap-2">
                  {scenarioLimit < activeScenarios.length && (
                    <button
                      onClick={() => setScenarioLimit((prev) => prev + SCENARIOS_PAGE_SIZE)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold text-emerald-700 transition cursor-pointer"
                    >
                      Load More ({activeScenarios.length - scenarioLimit} remaining)
                    </button>
                  )}
                  {scenarioLimit > SCENARIOS_PAGE_SIZE && (
                    <button
                      onClick={() => setScenarioLimit(SCENARIOS_PAGE_SIZE)}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600 transition cursor-pointer"
                    >
                      Show Less
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ========================================================= */}
      {/* ADD / EDIT CATEGORY MODAL                                 */}
      {/* ========================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {editingCategory ? "Edit Category" : "Add Service Category"}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              {/* Category Name */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={categoryFormData.name}
                  onChange={(e) =>
                    setCategoryFormData({ ...categoryFormData, name: e.target.value })
                  }
                  placeholder="e.g. Car Lockout & Keys"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Icon Selector */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  Category Icon
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {AVAILABLE_ICONS.map((item) => {
                    const isSelected = categoryFormData.icon === item.id;
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setCategoryFormData({ ...categoryFormData, icon: item.id })
                        }
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition cursor-pointer text-center ${
                          isSelected
                            ? "bg-emerald-50 border-emerald-400 text-emerald-800 font-semibold shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        <IconComp className="w-4 h-4 mb-1" />
                        <span className="text-[10px] font-medium truncate w-full">
                          {item.id}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Display Order & Active status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={categoryFormData.display_order}
                    onChange={(e) =>
                      setCategoryFormData({
                        ...categoryFormData,
                        display_order: Number(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      checked={categoryFormData.is_active}
                      onChange={(e) =>
                        setCategoryFormData({
                          ...categoryFormData,
                          is_active: e.target.checked,
                        })
                      }
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 bg-white w-4 h-4"
                    />
                    <span>Active on site</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD / EDIT SCENARIO MODAL                                 */}
      {/* ========================================================= */}
      {isScenarioModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {editingScenario ? "Edit Service Scenario" : "Add Service Scenario"}
              </h3>
              <button
                onClick={() => setIsScenarioModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveScenario} className="space-y-3.5 text-xs">
              {/* Category selector */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  Assign to Category *
                </label>
                <select
                  required
                  value={scenarioFormData.category_id}
                  onChange={(e) =>
                    setScenarioFormData({
                      ...scenarioFormData,
                      category_id: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scenario Label */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  Scenario Label / Title *
                </label>
                <input
                  type="text"
                  required
                  value={scenarioFormData.label}
                  onChange={(e) =>
                    setScenarioFormData({ ...scenarioFormData, label: e.target.value })
                  }
                  placeholder="e.g. Car Door / Trunk Lockout Rescue"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Technical Notes / Description */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  Service Notes / Methodology
                </label>
                <textarea
                  rows={2}
                  value={scenarioFormData.notes}
                  onChange={(e) =>
                    setScenarioFormData({ ...scenarioFormData, notes: e.target.value })
                  }
                  placeholder="e.g. Non-destructive air-wedge & specialized reach tools"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 resize-none"
                />
              </div>

              {/* Response Time (ETA) & Display Order */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    Estimated Response (ETA)
                  </label>
                  <input
                    type="text"
                    value={scenarioFormData.eta}
                    onChange={(e) =>
                      setScenarioFormData({ ...scenarioFormData, eta: e.target.value })
                    }
                    placeholder="e.g. 15–20 mins"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={scenarioFormData.display_order}
                    onChange={(e) =>
                      setScenarioFormData({
                        ...scenarioFormData,
                        display_order: Number(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="pt-1">
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={scenarioFormData.is_active}
                    onChange={(e) =>
                      setScenarioFormData({
                        ...scenarioFormData,
                        is_active: e.target.checked,
                      })
                    }
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 bg-white w-4 h-4"
                  />
                  <span>Display on live dispatch grid</span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsScenarioModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Scenario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export const CategoryManager = ServicesManager;
