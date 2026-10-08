"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Database, Globe } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  return (
    <header className="h-16 sm:h-18 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between gap-4 text-slate-900 shrink-0 shadow-xs">
      <div className="min-w-0">
        <h1 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        {/* Architecture Badges */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>Supabase Ready</span>
        </div>

        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition cursor-pointer shadow-sm shadow-emerald-600/30"
          title="Visit Public Website"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Live Site</span>
          <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
        </Link>
      </div>
    </header>
  );
}
