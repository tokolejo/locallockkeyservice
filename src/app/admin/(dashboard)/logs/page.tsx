import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { LogsManager } from "@/components/admin/LogsManager";
import { getActivityLogs } from "@/lib/data/store";

export const metadata = {
  title: "Activity & Audit Logs | Locksmith Admin",
  description: "View real-time system audit logs and administrator actions",
};

export default async function AdminLogsPage() {
  const logs = await getActivityLogs(150);

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Activity & Audit Logs"
        subtitle="Real-time chronological log of administrative operations, category updates, and system activity"
      />
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
        <LogsManager initialLogs={logs} />
      </div>
    </div>
  );
}
