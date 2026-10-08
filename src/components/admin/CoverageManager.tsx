"use client";

import React, { useState } from "react";
import { MapPin, Clock, Radio, CheckCircle2, XCircle, Plus, Edit2, Save } from "lucide-react";
import { CoverageArea } from "@/types/database.types";
import { updateCoverageAction } from "@/app/actions";

interface CoverageManagerProps {
  initialCoverage: CoverageArea[];
}

export function CoverageManager({ initialCoverage }: CoverageManagerProps) {
  const [areas, setAreas] = useState<CoverageArea[]>(initialCoverage);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEta, setEditEta] = useState(15);
  const [editUnits, setEditUnits] = useState(3);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // New Zone Inputs
  const [newZip, setNewZip] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("CA");

  const startEdit = (area: CoverageArea) => {
    setEditingId(area.id);
    setEditEta(area.avg_eta_minutes);
    setEditUnits(area.active_units);
  };

  const handleSave = async (id: string) => {
    const res = await updateCoverageAction(id, {
      avg_eta_minutes: editEta,
      active_units: editUnits,
    });
    if (res.success) {
      setAreas((prev) =>
        prev.map((a) => (a.id === id ? { ...a, avg_eta_minutes: editEta, active_units: editUnits } : a))
      );
      setEditingId(null);
      setStatusMsg("Coverage district updated successfully.");
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const toggleServiceable = async (area: CoverageArea) => {
    const newServiceable = !area.is_serviceable;
    await updateCoverageAction(area.id, { is_serviceable: newServiceable });
    setAreas((prev) =>
      prev.map((a) => (a.id === area.id ? { ...a, is_serviceable: newServiceable } : a))
    );
  };

  const handleAddNewZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZip || !newCity) return;
    const newZone: CoverageArea = {
      id: `cov-${Date.now()}`,
      zip_code: newZip,
      city: newCity,
      county: `${newCity} District`,
      state: newState,
      avg_eta_minutes: 18,
      is_serviceable: true,
      active_units: 3,
    };
    setAreas([newZone, ...areas]);
    setNewZip("");
    setNewCity("");
    setStatusMsg(`Added new ZIP code zone: ${newZone.zip_code}`);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {statusMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Add New ZIP Zone Form */}
      <form
        onSubmit={handleAddNewZone}
        className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-3 text-xs shadow-xs"
      >
        <span className="font-bold text-slate-800 uppercase text-[11px] shrink-0">
          Add Regional Zone:
        </span>
        <input
          type="text"
          placeholder="5-Digit ZIP (e.g. 77001)"
          maxLength={5}
          value={newZip}
          onChange={(e) => setNewZip(e.target.value.replace(/[^\d]/g, ""))}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 w-full sm:w-36 focus:bg-white focus:border-emerald-600 focus:outline-none"
        />
        <input
          type="text"
          placeholder="City / Metro Name (e.g. Houston)"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 w-full sm:w-48 focus:bg-white focus:border-emerald-600 focus:outline-none"
        />
        <input
          type="text"
          placeholder="State (e.g. TX)"
          maxLength={2}
          value={newState}
          onChange={(e) => setNewState(e.target.value.toUpperCase())}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 w-full sm:w-20 focus:bg-white focus:border-emerald-600 focus:outline-none"
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Zone</span>
        </button>
      </form>

      {/* Districts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {areas.map((area) => {
          const isEditing = editingId === area.id;

          return (
            <div
              key={area.id}
              className={`bg-white border rounded-2xl p-5 text-slate-800 flex flex-col justify-between shadow-xs ${
                area.is_serviceable ? "border-slate-200" : "border-rose-200 opacity-60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-emerald-800 border border-slate-200 font-bold">
                      {area.zip_code}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {area.city}, {area.state}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleServiceable(area)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase cursor-pointer ${
                      area.is_serviceable
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {area.is_serviceable ? "Active" : "Disabled"}
                  </button>
                </div>

                {isEditing ? (
                  <div className="space-y-3 text-xs mb-3">
                    <div>
                      <label className="block text-slate-600 mb-1 font-semibold">Avg ETA (Minutes)</label>
                      <input
                        type="number"
                        value={editEta}
                        onChange={(e) => setEditEta(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-semibold">Active Mobile Units</label>
                      <input
                        type="number"
                        value={editUnits}
                        onChange={(e) => setEditUnits(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(area.id)}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-bold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs py-2">
                    <div className="flex justify-between text-slate-500">
                      <span>Dispatch Response ETA:</span>
                      <span className="font-bold text-slate-900">{area.avg_eta_minutes} Mins</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Assigned Mobile Units:</span>
                      <span className="font-bold text-emerald-700">{area.active_units} Units</span>
                    </div>
                  </div>
                )}
              </div>

              {!isEditing && (
                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => startEdit(area)}
                    className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Edit2 className="w-3 h-3 text-emerald-600" />
                    <span>Configure ETA & Units</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
