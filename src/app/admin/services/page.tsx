import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ServicesManager } from "@/components/admin/ServicesManager";
import { getServiceCategories, getServiceScenarios } from "@/lib/data/store";

export const metadata = {
  title: "Services & Categories | Locksmith Admin",
  description: "Manage service categories, emergency scenarios, and response dispatch times",
};

export default async function AdminServicesPage() {
  const [categories, scenarios] = await Promise.all([
    getServiceCategories(),
    getServiceScenarios(),
  ]);

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Services & Categories Manager"
        subtitle="Organize lockout categories, specialized service scenarios, and emergency response ETAs"
      />
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
        <ServicesManager initialCategories={categories} initialScenarios={scenarios} />
      </div>
    </div>
  );
}
