import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SettingsManager } from "@/components/admin/SettingsManager";
import { getSiteSettings } from "@/lib/data/store";

export const metadata = {
  title: "Site Settings & Maps | Locksmith Admin",
  description: "Manage hotline phone numbers, WhatsApp link, Google Maps embed, and service details",
};

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Site Settings & Contact Coordinates"
        subtitle="Configure dispatch phone numbers, WhatsApp links, Google Maps embed, and business hours"
      />
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
        <SettingsManager initialSettings={settings} />
      </div>
    </div>
  );
}
