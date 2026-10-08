import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Portal | Local Lock & Key Service",
  description: "Centralized management portal for services, portfolio gallery, hero slider, contacts, and customer reviews",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 flex flex-col md:flex-row font-sans selection:bg-emerald-500 selection:text-white">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
