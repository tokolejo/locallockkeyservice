import React from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  Wrench,
  Camera,
  Sliders,
  Settings,
  Star,
  Activity,
  PhoneCall,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import {
  getServiceCategories,
  getServiceScenarios,
  getGalleryItems,
  getHeroSlides,
  getSiteSettings,
  getAllTestimonials,
  getActivityLogs,
  getDispatchRequests,
} from "@/lib/data/store";

export const metadata = {
  title: "Admin Dashboard | Local Lock & Key Service",
  description: "Centralized management of services, gallery, hero slider, site settings, and reviews",
};

export default async function AdminOverviewPage() {
  const [categories, scenarios, galleryItems, heroSlides, siteSettings, testimonials, logs, dispatchRequests] =
    await Promise.all([
      getServiceCategories(),
      getServiceScenarios(),
      getGalleryItems(),
      getHeroSlides(),
      getSiteSettings(),
      getAllTestimonials(),
      getActivityLogs(5),
      getDispatchRequests(),
    ]);

  const activeCategoriesCount = categories.filter((c) => c.is_active).length;
  const activeSlidesCount = heroSlides.filter((s) => s.is_active).length;
  const approvedReviewsCount = testimonials.filter((t) => t.is_approved).length;
  const newLeadsCount = dispatchRequests.filter((r) => r.status === "new").length;

  const quickSections = [
    {
      title: "Call Dispatch & Callback Leads",
      count: `${newLeadsCount} New (${dispatchRequests.length} Total)`,
      description: "Monitor incoming emergency callback requests from the website, dispatch technicians, and manage Resend email alerts.",
      href: "/admin/dispatch",
      icon: <PhoneCall className="w-5 h-5 text-emerald-600" />,
      actionText: "Open Dispatch Queue",
    },
    {
      title: "Services & Categories",
      count: `${categories.length} Categories (${scenarios.length} Scenarios)`,
      description: "Manage lockout categories, dispatch scenarios, response times, and service specifications with zero pricing.",
      href: "/admin/services",
      icon: <Wrench className="w-5 h-5 text-emerald-600" />,
      actionText: "Manage Categories",
    },
    {
      title: "Completed Works",
      count: `${galleryItems.length} Gallery Projects`,
      description: "Upload verified job photos, set cover pictures, categorize work types, and manage descriptions.",
      href: "/admin/gallery",
      icon: <Camera className="w-5 h-5 text-blue-600" />,
      actionText: "Manage Gallery",
    },
    {
      title: "Hero Slider",
      count: `${heroSlides.length} Slides (${activeSlidesCount} Active)`,
      description: "Configure homepage banner slides, background images, emergency badges, and headline titles.",
      href: "/admin/slider",
      icon: <Sliders className="w-5 h-5 text-amber-600" />,
      actionText: "Edit Slider",
    },
    {
      title: "Site Settings & Maps",
      count: siteSettings.phone_display,
      description: "Update direct phone numbers, 24/7 WhatsApp link, Google Maps embed, and service address.",
      href: "/admin/settings",
      icon: <Settings className="w-5 h-5 text-purple-600" />,
      actionText: "Update Settings",
    },
    {
      title: "Customer Reviews",
      count: `${siteSettings.google_rating} ★ (${testimonials.length} Reviews)`,
      description: "Manage customer reviews, moderate approval status, and trigger live Google Maps synchronization.",
      href: "/admin/reviews",
      icon: <Star className="w-5 h-5 text-amber-500" />,
      actionText: "Moderate Reviews",
    },
    {
      title: "Activity & Audit Logs",
      count: `${logs.length}+ Audited Logs`,
      description: "Inspect chronological system modifications, category updates, media changes, and operational logs.",
      href: "/admin/logs",
      icon: <Activity className="w-5 h-5 text-teal-600" />,
      actionText: "View Activity Logs",
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Admin Control Center"
        subtitle="Centralized management of services, gallery works, hero slides, contacts, and customer reviews"
      />

      <div className="p-3.5 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 max-w-7xl">
        {/* Quick Highlights / Compact Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-white to-slate-50 border border-emerald-200/80 rounded-xl p-4 sm:p-5 text-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Direct Phone & WhatsApp Dispatch Ready</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Real-Time Content & Dispatch Control
            </h2>
            <p className="text-slate-600 text-xs max-w-xl leading-relaxed">
              Content changes publish to the live site immediately.
              Manage lockout scenarios, portfolio works, contact endpoints, and customer feedback with zero pricing.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5 min-w-[240px] shadow-xs">
            <div className="text-slate-500 font-medium text-[11px]">Active Dispatch Hotline:</div>
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>{siteSettings.phone_display}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
              <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
              <span className="truncate">{siteSettings.address}</span>
            </div>
            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Google Rating:</span>
              <span className="text-amber-500 font-bold">
                {siteSettings.google_rating} ★ ({siteSettings.google_review_count} Reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Management Sections Grid (Compact) */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Control Modules
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
            {quickSections.map((sec) => (
              <div
                key={sec.href}
                className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 hover:border-slate-300 hover:shadow-sm transition flex flex-col justify-between group shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center">
                      {sec.icon}
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/80">
                      {sec.count}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
                    {sec.title}
                  </h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed mb-3 line-clamp-2">
                    {sec.description}
                  </p>
                </div>

                <Link
                  href={sec.href}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-emerald-600 hover:text-white border border-slate-200 text-slate-700 text-xs font-semibold transition group/btn"
                >
                  <span>{sec.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-white transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
