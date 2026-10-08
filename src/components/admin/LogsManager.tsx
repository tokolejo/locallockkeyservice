"use client";

import React, { useState, useTransition } from "react";
import {
  RotateCw,
  Search,
  Filter,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Info,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  Activity,
  Layers,
  Terminal,
} from "lucide-react";
import { ActivityLog } from "@/types/database.types";
import { getActivityLogsAction } from "@/app/actions";

interface LogsManagerProps {
  initialLogs: ActivityLog[];
}

export function LogsManager({ initialLogs }: LogsManagerProps) {
  const [logs, setLogs] = useState<ActivityLog[]>(initialLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  // Entities list for filter
  const entities = Array.from(new Set(logs.map((l) => l.entity).filter(Boolean)));

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await getActivityLogsAction(200);
      if (res.success && Array.isArray(res.data)) {
        setLogs(res.data as ActivityLog[]);
        setRefreshMessage("Logs refreshed successfully");
      } else {
        // Fallback to fetch /api/logs
        const apiRes = await fetch("/api/logs");
        const apiData = await apiRes.json();
        if (apiData.success && Array.isArray(apiData.logs)) {
          setLogs(apiData.logs);
          setRefreshMessage("Logs refreshed successfully");
        }
      }
    } catch (err) {
      console.error("Refresh logs error:", err);
      setRefreshMessage("Failed to refresh logs");
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setRefreshMessage(null), 3000);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.ip_address && log.ip_address.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesEntity = selectedEntity === "all" || log.entity === selectedEntity;
    const matchesStatus = selectedStatus === "all" || log.status === selectedStatus;

    return matchesSearch && matchesEntity && matchesStatus;
  });

  const getActionBadgeColor = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes("CREATE") || act.includes("ADD")) {
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    }
    if (act.includes("UPDATE") || act.includes("EDIT")) {
      return "bg-blue-50 text-blue-800 border-blue-200";
    }
    if (act.includes("DELETE") || act.includes("REMOVE")) {
      return "bg-rose-50 text-rose-800 border-rose-200";
    }
    if (act.includes("UPLOAD") || act.includes("IMAGE")) {
      return "bg-amber-50 text-amber-800 border-amber-200";
    }
    if (act.includes("SYNC") || act.includes("IMPORT")) {
      return "bg-purple-50 text-purple-800 border-purple-200";
    }
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case "error":
      case "failed":
        return <AlertCircle className="w-3.5 h-3.5 text-rose-600" />;
      default:
        return <Info className="w-3.5 h-3.5 text-sky-600" />;
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  const renderDetails = (details: string | null) => {
    if (!details) return <span className="text-slate-400 italic">No details recorded</span>;
    try {
      const parsed = JSON.parse(details);
      return (
        <pre className="text-[11px] font-mono text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 overflow-x-auto whitespace-pre-wrap max-h-48 scrollbar-thin">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      );
    } catch {
      return <p className="text-xs text-slate-700 break-words leading-relaxed">{details}</p>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                System Activity Log
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                  {filteredLogs.length} events
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Audited modifications across categories, scenarios, settings, and media
              </p>
            </div>
          </div>

          {/* Live Refresh Button */}
          <div className="flex items-center gap-2">
            {refreshMessage && (
              <span className="text-xs text-emerald-600 font-medium animate-fade-in hidden sm:inline">
                {refreshMessage}
              </span>
            )}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition cursor-pointer disabled:opacity-50"
              title="Refresh logs from database"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-600" : ""}`} />
              <span>{isRefreshing ? "Refreshing..." : "Live Refresh"}</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-2 border-t border-slate-100">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by action, entity, details..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Entity Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 capitalize"
            >
              <option value="all">All Entities</option>
              {entities.map((ent) => (
                <option key={ent} value={ent}>
                  {ent.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            >
              <option value="all">All Statuses</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
              <option value="info">Info</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Card List View (Mobile screen: < md) */}
      <div className="block md:hidden space-y-2.5">
        {filteredLogs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 shadow-xs">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="text-sm font-semibold text-slate-800">No activity logs found</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing filters or refreshing.</p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isExpanded = expandedLogId === log.id;
            return (
              <div
                key={log.id}
                className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs shadow-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase border ${getActionBadgeColor(
                      log.action
                    )}`}
                  >
                    {log.action}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    {getStatusIcon(log.status)}
                    <span className="capitalize">{log.status}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 text-slate-500 text-[11px]">
                  <span className="font-semibold text-slate-800 capitalize">{log.entity.replace(/_/g, " ")}</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" />
                    {formatDate(log.created_at)}
                  </span>
                </div>

                {log.details && (
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className="flex items-center justify-between w-full text-slate-500 hover:text-slate-900 py-0.5"
                    >
                      <span className="font-semibold text-[11px] text-slate-600">Details Payload</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    {isExpanded && <div className="mt-2">{renderDetails(log.details)}</div>}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Compact Table View (>= md) */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
              <th className="py-3 px-4 w-44">Timestamp</th>
              <th className="py-3 px-4 w-44">Action</th>
              <th className="py-3 px-4 w-36">Entity</th>
              <th className="py-3 px-4 w-28">Status</th>
              <th className="py-3 px-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-800">No matching activity records</p>
                  <p className="text-xs text-slate-500 mt-1">Adjust search filter or press Live Refresh</p>
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const isExpanded = expandedLogId === log.id;
                return (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-slate-50/80 transition">
                      {/* Timestamp */}
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {formatDate(log.created_at)}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md font-mono text-[11px] font-bold border ${getActionBadgeColor(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>

                      {/* Entity */}
                      <td className="py-3 px-4 text-slate-800 font-medium capitalize">
                        {log.entity.replace(/_/g, " ")}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-700">
                          {getStatusIcon(log.status)}
                          <span className="capitalize">{log.status}</span>
                        </span>
                      </td>

                      {/* Details button / excerpt */}
                      <td className="py-3 px-4">
                        {log.details ? (
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-slate-500 font-mono text-[11px] truncate max-w-xs block">
                              {typeof log.details === "string" && log.details.startsWith("{")
                                ? log.details.slice(0, 50) + "..."
                                : log.details}
                            </span>
                            <button
                              onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                              className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 shrink-0 transition"
                            >
                              {isExpanded ? "Collapse" : "Inspect"}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None</span>
                        )}
                      </td>
                    </tr>

                    {/* Expandable JSON details row */}
                    {isExpanded && log.details && (
                      <tr className="bg-slate-50/70 border-t border-slate-200">
                        <td colSpan={5} className="py-3 px-6">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span className="font-semibold text-slate-800">Log ID: {log.id}</span>
                              {log.ip_address && <span>IP: {log.ip_address}</span>}
                            </div>
                            {renderDetails(log.details)}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
