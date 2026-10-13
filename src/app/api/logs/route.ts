import { NextResponse } from "next/server";
import { getActivityLogs } from "@/lib/data/store";
import { requireAdminUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdminUser();
    const logs = await getActivityLogs(200);
    return NextResponse.json({
      success: true,
      logs: logs || [],
    });
  } catch (error: any) {
    const isAuthError =
      error?.message?.includes("Unauthorized") ||
      error?.message?.includes("Forbidden");

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to retrieve activity logs",
        logs: [],
      },
      { status: isAuthError ? 401 : 500 }
    );
  }
}
