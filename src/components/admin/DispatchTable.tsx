"use client";

import React, { useState } from "react";
import { Search, Download, PhoneCall, MapPin, Edit3, CheckCircle2, UserCheck, ShieldCheck } from "lucide-react";
import { DispatchRequest, DispatchStatus } from "@/types/database.types";
import { updateLeadStatusAction } from "@/app/actions";

interface DispatchTableProps {
  requests: DispatchRequest[];
  onDataChanged: () => void;
}

export function DispatchTable({ requests, onDataChanged }: DispatchTableProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = requests.filter((r) => {
    const matchesQuery =
      r.customer_name.toLowerCase().includes(query.toLowerCase()) ||
      r.phone.includes(query) ||
      r.zip_code.includes(query) ||
      r.service_sub_type.toLowerCase().includes(query.toLowerCase());

    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: DispatchStatus) => {
    await updateLeadStatusAction({
      id,
      status: newStatus,
    });
    onDataChanged();
  };

  const exportCsv = () => {
    const headers = "ID,Customer,Phone,ZIP,Address,Service,Vehicle,Status,Est Min,Est Max,Final Price,Technician\n";
    const rows = filtered
      .map(
        (r) =>
          `"${r.id}","${r.customer_name}","${r.phone}","${r.zip_code}","${r.address || ""}","${r.service_sub_type}","${r.vehicle_make || ""} ${r.vehicle_model || ""}","${r.status}",${r.estimated_price_min},${r.estimated_price_max},${r.final_price || ""},"${r.assigned_technician || ""}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `locksmith-dispatches-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search phone, name, ZIP, car..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600"
          >
            <option value="all">All Statuses ({requests.length})</option>
            <option value="new">New</option>
            <option value="dispatched">Dispatched</option>
            <option value="en_route">En Route</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <button
          onClick={exportCsv}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Caller & Contact</th>
                <th className="py-3.5 px-4 font-semibold">Location & ZIP</th>
                <th className="py-3.5 px-4 font-semibold">Service & Vehicle</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Assigned Tech</th>
                <th className="py-3.5 px-4 font-semibold text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{r.customer_name}</span>
                      {r.source === "callback_modal" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Callback
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Direct
                        </span>
                      )}
                    </div>
                    <a
                      href={`tel:${r.phone.replace(/[^\d+]/g, "")}`}
                      className="text-emerald-700 hover:text-emerald-900 font-mono text-xs flex items-center gap-1 mt-1 font-bold hover:underline"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>{r.phone}</span>
                    </a>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {r.zip_code}
                    </span>
                    <div className="text-slate-500 text-[11px] truncate max-w-[150px] mt-0.5">
                      {r.address || "On-site dispatch"}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{r.service_sub_type}</div>
                    {r.vehicle_make && (
                      <div className="text-[11px] text-slate-500">
                        {r.vehicle_year} {r.vehicle_make} {r.vehicle_model}
                      </div>
                    )}
                    {r.internal_notes && (
                      <div className="text-[11px] text-slate-600 mt-1 max-w-xs bg-slate-100/80 p-1.5 rounded-lg border border-slate-200/60 leading-snug">
                        <span className="font-semibold text-slate-800">Note:</span> {r.internal_notes}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={r.status}
                      onChange={(e) => handleStatusChange(r.id, e.target.value as DispatchStatus)}
                      className={`text-[10px] font-bold uppercase rounded-lg px-2 py-1 border focus:outline-none cursor-pointer ${
                        r.status === "completed"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : r.status === "cancelled"
                          ? "bg-rose-50 text-rose-800 border-rose-200"
                          : "bg-blue-50 text-blue-800 border-blue-200"
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="en_route">En Route</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4">
                    {r.assigned_technician ? (
                      <span className="text-indigo-700 font-medium flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        <span>{r.assigned_technician}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[11px] text-slate-400">
                        {new Date(r.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <a
                        href={`tel:${r.phone.replace(/[^\d+]/g, "")}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] tracking-tight transition active:scale-95 shadow-2xs"
                      >
                        <PhoneCall className="w-2.5 h-2.5" />
                        <span>Call</span>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No matching dispatch leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
