import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CoverageManager } from "@/components/admin/CoverageManager";
import { getCoverageAreas } from "@/lib/data/store";


export default async function AdminCoveragePage() {
  const coverageAreas = await getCoverageAreas();

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Coverage Areas & ZIP Code Manager"
        subtitle="Configure active dispatch zones, regional mobile units, and estimated response minutes"
      />
      <div className="p-6 sm:p-8">
        <CoverageManager initialCoverage={coverageAreas} />
      </div>
    </div>
  );
}
