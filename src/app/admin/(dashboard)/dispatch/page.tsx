"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DispatchKanban } from "@/components/admin/DispatchKanban";
import { DispatchTable } from "@/components/admin/DispatchTable";
import {
  KanbanSquare,
  Table,
  RefreshCw,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react";
import { DispatchRequest } from "@/types/database.types";
import { initialDispatchRequests } from "@/lib/data/mock-data";
import { getResendStatusAction, testResendLeadAction } from "@/app/actions";

export default function AdminDispatchPage() {
  const [requests, setRequests] = useState<DispatchRequest[]>(initialDispatchRequests);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("table");
  const [sourceFilter, setSourceFilter] = useState<"all" | "callback_modal" | "direct_call">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [resendStatus, setResendStatus] = useState<{
    isConfigured: boolean;
    alertEmail: string | null;
    fromEmail: string;
  }>({
    isConfigured: false,
    alertEmail: null,
    fromEmail: "Local Lock Dispatch <onboarding@resend.dev>",
  });
  const [isTestingResend, setIsTestingResend] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

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
    getResendStatusAction().then((status) => setResendStatus(status));
  }, []);

  const handleTestResend = async () => {
    setIsTestingResend(true);
    setTestResult(null);
    try {
      const res = await testResendLeadAction();
      setTestResult({
        success: res.success,
        message: res.message,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || "Test dispatch failed.",
      });
    } finally {
      setIsTestingResend(false);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (sourceFilter === "callback_modal") return r.source === "callback_modal";
    if (sourceFilter === "direct_call") return r.source !== "callback_modal";
    return true;
  });

  const totalCount = requests.length;
  const newCount = requests.filter((r) => r.status === "new").length;
  const callbackCount = requests.filter((r) => r.source === "callback_modal").length;
  const completedCount = requests.filter((r) => r.status === "completed").length;

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Live Dispatch & Emergency Leads"
        subtitle="Incoming callback requests, mobile technician dispatches, and Resend email alerts"
        onRefresh={fetchLeads}
      />

      <div className="p-6 sm:p-8 space-y-6">
        {/* Resend Email Integration Status Banner */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center shrink-0 border border-slate-700">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-black text-white">Resend Email Notifications</span>
                {resendStatus.isConfigured ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Active (API Key Connected)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800/80">
                    <Clock className="w-3 h-3 text-amber-400" />
                    Standby (Awaiting RESEND_API_KEY)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Whenever a customer requests a callback, the system automatically logs it here and triggers an email notification via Resend to{" "}
                <span className="font-mono text-emerald-400 font-bold">
                  {resendStatus.alertEmail || "dispatch@locallockandkey.com"}
                </span>.
              </p>
              {testResult && (
                <div
                  className={`mt-2 p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    testResult.success
                      ? "bg-emerald-900/60 text-emerald-200 border border-emerald-700"
                      : "bg-amber-900/60 text-amber-200 border border-amber-700"
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={handleTestResend}
              disabled={isTestingResend}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
            >
              {isTestingResend ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Testing Resend...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-white" />
                  <span>Test Resend Alert</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-slate-500 text-xs font-medium">Total Inbound Leads</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Recorded dispatches</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs bg-emerald-50/20">
            <div className="text-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>New Actionable Leads</span>
            </div>
            <div className="text-2xl font-black text-emerald-900 mt-1">{newCount}</div>
            <div className="text-[11px] text-emerald-700 mt-0.5">Pending response</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-slate-500 text-xs font-medium flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
              <span>Callback Modal Leads</span>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{callbackCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Submitted via website popup</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-slate-500 text-xs font-medium">Completed Jobs</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{completedCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Closed dispatches</div>
          </div>
        </div>

        {/* View Switcher & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          {/* Source Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setSourceFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                sourceFilter === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              All Leads ({requests.length})
            </button>
            <button
              type="button"
              onClick={() => setSourceFilter("callback_modal")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                sourceFilter === "callback_modal"
                  ? "bg-emerald-700 text-white"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
              }`}
            >
              <PhoneCall className="w-3 h-3" />
              <span>Callback Modal Leads ({callbackCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setSourceFilter("direct_call")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                sourceFilter === "direct_call"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              Direct Calls ({requests.length - callbackCount})
            </button>
          </div>

          {/* Kanban / Table Toggle */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "kanban"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <KanbanSquare className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
            </div>

            <button
              type="button"
              onClick={fetchLeads}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl transition cursor-pointer shadow-2xs"
              title="Refresh Leads"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-600" : ""}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>
          </div>
        </div>

        {/* Selected View */}
        {viewMode === "kanban" ? (
          <DispatchKanban requests={filteredRequests} onDataChanged={fetchLeads} />
        ) : (
          <DispatchTable requests={filteredRequests} onDataChanged={fetchLeads} />
        )}
      </div>
    </div>
  );
}
