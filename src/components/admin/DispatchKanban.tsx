"use client";

import React, { useState } from "react";
import {
  PhoneCall,
  MapPin,
  Clock,
  UserCheck,
  Wrench,
  DollarSign,
  Edit3,
  X,
  CheckCircle2,
  AlertCircle,
  FileText
} from "lucide-react";
import { DispatchRequest, DispatchStatus } from "@/types/database.types";
import { updateLeadStatusAction } from "@/app/actions";

interface DispatchKanbanProps {
  requests: DispatchRequest[];
  onDataChanged: () => void;
}

const statusColumns: { id: DispatchStatus; label: string; color: string }[] = [
  { id: "new", label: "New Request", color: "text-amber-800" },
  { id: "dispatched", label: "Dispatched", color: "text-blue-800" },
  { id: "en_route", label: "En Route", color: "text-indigo-800" },
  { id: "in_progress", label: "On Site (Working)", color: "text-purple-800" },
  { id: "completed", label: "Completed", color: "text-emerald-800" },
  { id: "cancelled", label: "Cancelled", color: "text-rose-800" },
];

export function DispatchKanban({ requests, onDataChanged }: DispatchKanbanProps) {
  const [editingItem, setEditingItem] = useState<DispatchRequest | null>(null);
  const [techName, setTechName] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<DispatchStatus>("new");
  const [isSaving, setIsSaving] = useState(false);

  const openEditDrawer = (item: DispatchRequest) => {
    setEditingItem(item);
    setTechName(item.assigned_technician || "");
    setNotes(item.internal_notes || "");
    setSelectedStatus(item.status);
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSaving(true);
    await updateLeadStatusAction({
      id: editingItem.id,
      status: selectedStatus,
      assigned_technician: techName || undefined,
      internal_notes: notes || undefined,
    });
    setIsSaving(false);
    setEditingItem(null);
    onDataChanged();
  };

  const handleQuickStatusChange = async (item: DispatchRequest, nextStatus: DispatchStatus) => {
    await updateLeadStatusAction({
      id: item.id,
      status: nextStatus,
    });
    onDataChanged();
  };

  return (
    <div className="space-y-6">
      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
        {statusColumns.map((col) => {
          const colItems = requests.filter((r) => r.status === col.id);
          return (
            <div
              key={col.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col min-w-[260px] max-h-[80vh] overflow-y-auto shadow-xs"
            >
              {/* Column Title */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <span className={`text-[11px] font-semibold uppercase tracking-wider ${col.color}`}>
                  {col.label}
                </span>
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center text-[11px] font-mono">
                  {colItems.length}
                </span>
              </div>

              {/* Cards in Column */}
              <div className="space-y-3 flex-1">
                {colItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-3.5 space-y-2.5 transition text-xs shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">
                            {item.customer_name}
                          </h4>
                          {item.source === "callback_modal" && (
                            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              Callback
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => openEditDrawer(item)}
                        className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1 text-slate-600">
                      <div className="flex items-center justify-between gap-1 text-emerald-700 font-mono font-bold text-xs">
                        <a
                          href={`tel:${item.phone.replace(/[^\d+]/g, "")}`}
                          className="flex items-center gap-1.5 hover:underline"
                        >
                          <PhoneCall className="w-3 h-3 shrink-0" />
                          <span>{item.phone}</span>
                        </a>
                        <a
                          href={`tel:${item.phone.replace(/[^\d+]/g, "")}`}
                          className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-0.5 rounded transition"
                        >
                          Call
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          {item.zip_code} {item.address ? `• ${item.address}` : ""}
                        </span>
                      </div>
                    </div>

                    <div className="p-2 rounded bg-white border border-slate-200 text-[11px] space-y-1">
                      <p className="font-semibold text-slate-800">{item.service_sub_type}</p>
                      {item.vehicle_make && (
                        <p className="text-slate-500">
                          {item.vehicle_year} {item.vehicle_make} {item.vehicle_model}
                        </p>
                      )}
                      {item.internal_notes && (
                        <p className="text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200/60 text-[10px] leading-tight">
                          <span className="font-bold text-slate-800">Note:</span> {item.internal_notes}
                        </p>
                      )}
                    </div>

                    {item.assigned_technician && (
                      <div className="text-[11px] text-indigo-700 flex items-center gap-1 font-medium">
                        <UserCheck className="w-3 h-3" />
                        <span className="truncate">{item.assigned_technician}</span>
                      </div>
                    )}

                    {/* Quick Move Buttons */}
                    <div className="flex items-center justify-between gap-1 pt-1">
                      {col.id === "new" && (
                        <button
                          onClick={() => handleQuickStatusChange(item, "dispatched")}
                          className="w-full py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-semibold border border-blue-200 transition cursor-pointer"
                        >
                          Dispatch Unit →
                        </button>
                      )}
                      {col.id === "dispatched" && (
                        <button
                          onClick={() => handleQuickStatusChange(item, "en_route")}
                          className="w-full py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-semibold border border-indigo-200 transition cursor-pointer"
                        >
                          Mark En Route →
                        </button>
                      )}
                      {col.id === "en_route" && (
                        <button
                          onClick={() => handleQuickStatusChange(item, "in_progress")}
                          className="w-full py-1 rounded bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-semibold border border-purple-200 transition cursor-pointer"
                        >
                          Arrived On Site →
                        </button>
                      )}
                      {col.id === "in_progress" && (
                        <button
                          onClick={() => handleQuickStatusChange(item, "completed")}
                          className="w-full py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-semibold border border-emerald-200 transition cursor-pointer"
                        >
                          Mark Completed ✓
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {colItems.length === 0 && (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    No active dispatches
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Drawer Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 text-slate-900 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Manage Dispatch: {editingItem.customer_name}
                </h3>
                <p className="text-xs text-slate-500">{editingItem.phone} • ZIP {editingItem.zip_code}</p>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDetails} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Dispatch Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as DispatchStatus)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                >
                  <option value="new">New Request</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="en_route">En Route</option>
                  <option value="in_progress">In Progress (On Site)</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Assigned Mobile Technician
                </label>
                <input
                  type="text"
                  placeholder="e.g. Unit 3 - Dave K."
                  value={techName}
                  onChange={(e) => setTechName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Internal Notes & Ownership ID Verification
                </label>
                <textarea
                  rows={3}
                  placeholder="Driver license verified, non-destructive pick, dispatch resolution details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-white transition"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
