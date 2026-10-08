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
  CheckCircle2,
} from "lucide-react";
import {
  getServiceCategories,
  getServiceScenarios,
  getGalleryItems,
  getHeroSlides,
  getSiteSettings,
  getAllTestimonials,
  getActivityLogs,
} from "@/lib/data/store";

export const metadata = {
  title: "Admin Dashboard | Local Lock & Key Service",
  description: "Centralized management of services, gallery, hero slider, site settings, and reviews",
};

export default async function AdminOverviewPage() {
  const [categories, scenarios, galleryItems, heroSlides, siteSettings, testimonials, logs] =
    await Promise.all([
      getServiceCategories(),
      getServiceScenarios(),
      getGalleryItems(),
      getHeroSlides(),
      getSiteSettings(),
      getAllTestimonials(),
      getActivityLogs(5),
    ]);

  const activeCategoriesCount = categories.filter((c) => c.is_active).length;
  const activeSlidesCount = heroSlides.filter((s) => s.is_active).length;
  const approvedReviewsCount = testimonials.filter((t) => t.is_approved).length;

  const quickSections = [
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

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl">
        {/* Quick Highlights / Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-white to-slate-50 border border-emerald-200/80 rounded-2xl p-5 sm:p-7 text-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Direct Phone & WhatsApp Dispatch Ready</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Real-Time Content & Dispatch Control
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Every content change made here updates the live customer site immediately.
              Manage lockout scenarios, portfolio proofs, contact endpoints, and customer feedback across all devices.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-2 min-w-[260px] shadow-xs">
            <div className="text-slate-500 font-medium">Active Dispatch Hotline:</div>
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>{siteSettings.phone_display}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span className="truncate">{siteSettings.address}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Google Rating:</span>
              <span className="text-amber-500 font-bold">
                {siteSettings.google_rating} ★ ({siteSettings.google_review_count} Reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Management Sections Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Control Modules
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {quickSections.map((sec) => (
              <div
                key={sec.href}
                className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between group shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                      {sec.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/80">
                      {sec.count}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-emerald-700 transition-colors">
                    {sec.title}
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed mb-5">
                    {sec.description}
                  </p>
                </div>

                <Link
                  href={sec.href}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-600 hover:text-white border border-slate-200 text-slate-700 text-xs font-semibold transition group/btn"
                >
                  <span>{sec.actionText}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover/btn:text-white transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* System Architecture Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 text-slate-600 text-xs space-y-2.5 shadow-xs">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Dual Persistence Architecture (Supabase & Local Cache)</span>
          </h4>
          <p className="text-slate-500 leading-relaxed">
            The platform is built with high availability: when <code className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">SUPABASE_SERVICE_ROLE_KEY</code> are configured,
            all mutations persist straight to the Supabase PostgreSQL database. When running without external database credentials, the system operates in continuous local cache mode.
          </p>
        </div>
      </div>
    </div>
  );
}
