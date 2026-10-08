"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DispatchKanban } from "@/components/admin/DispatchKanban";
import { DispatchTable } from "@/components/admin/DispatchTable";
import { KanbanSquare, Table, RefreshCw } from "lucide-react";
import { DispatchRequest } from "@/types/database.types";
import { initialDispatchRequests } from "@/lib/data/mock-data";

export default function AdminDispatchPage() {
  const [requests, setRequests] = useState<DispatchRequest[]>(initialDispatchRequests);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLeads = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/dispatch");
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch {
      // Keep state
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Live Dispatch & Emergency Leads"
        subtitle="Active GPS mobile units, incoming caller queue, and live technician dispatching"
        onRefresh={fetchLeads}
      />

      <div className="p-6 sm:p-8 space-y-6">
        {/* View Switcher Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-xs">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === "kanban"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <KanbanSquare className="w-4 h-4" />
              <span>Live Kanban Board</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === "table"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Data Table View</span>
            </button>
          </div>

          <button
            onClick={fetchLeads}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl transition cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-600" : ""}`} />
            <span>Sync Queue</span>
          </button>
        </div>

        {/* Selected View */}
        {viewMode === "kanban" ? (
          <DispatchKanban requests={requests} onDataChanged={fetchLeads} />
        ) : (
          <DispatchTable requests={requests} onDataChanged={fetchLeads} />
        )}
      </div>
    </div>
  );
}
