"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wrench,
  Camera,
  Sliders,
  Settings,
  Star,
  Activity,
  ExternalLink,
  KeyRound,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close drawer on path change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
      exact: true,
    },
    {
      label: "Services & Categories",
      href: "/admin/services",
      icon: <Wrench className="w-4 h-4 shrink-0" />,
    },
    {
      label: "Completed Works",
      href: "/admin/gallery",
      icon: <Camera className="w-4 h-4 shrink-0" />,
    },
    {
      label: "Hero Slider",
      href: "/admin/slider",
      icon: <Sliders className="w-4 h-4 shrink-0" />,
    },
    {
      label: "Site Settings & Maps",
      href: "/admin/settings",
      icon: <Settings className="w-4 h-4 shrink-0" />,
    },
    {
      label: "Reviews",
      href: "/admin/reviews",
      icon: <Star className="w-4 h-4 shrink-0" />,
    },
    {
      label: "Activity Logs",
      href: "/admin/logs",
      icon: <Activity className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <>
      {/* 1. Mobile Top Sticky Header with Hamburger Button (< md) */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between text-slate-800 shadow-xs">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1">
              LOCAL LOCK <span className="text-emerald-600">ADMIN</span>
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition"
            title="View Live Site"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 transition cursor-pointer"
          >
            {isOpen ? <X className="w-5 h-5 text-emerald-600" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* 2. Mobile Slide-Over Drawer & Overlay Backdrop (< md) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
          />

          {/* Drawer Menu */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white border-r border-slate-200 p-5 flex flex-col justify-between z-50 shadow-2xl animate-slide-right text-slate-700">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-6">
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1">
                      LOCAL LOCK <span className="text-emerald-600">ADMIN</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                      Content Management
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
                  Management Navigation
                </div>
                {navLinks.map((item) => {
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                        isActive
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent"
                      }`}
                    >
                      <span className={isActive ? "text-emerald-600" : "text-slate-500"}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Drawer Actions */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 transition"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>View Live Website</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <div className="text-[11px] text-slate-400 text-center">
                Local Locksmith Admin v2.4 • Production
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Desktop Persistent Sidebar (>= md) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200/90 flex-col justify-between shrink-0 min-h-screen text-slate-700 shadow-xs">
        <div className="p-5">
          {/* Brand */}
          <Link href="/admin" className="flex items-center gap-2.5 mb-8 group">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1">
                LOCAL LOCK <span className="text-emerald-600">ADMIN</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Content & Site Control
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Management Portal
            </div>
            {navLinks.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent"
                  }`}
                >
                  <span className={isActive ? "text-emerald-600" : "text-slate-500"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Info */}
        <div className="p-5 border-t border-slate-200/90 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 hover:text-slate-900 transition group"
          >
            <span>Live Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition" />
          </Link>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>Admin Status:</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Online
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
