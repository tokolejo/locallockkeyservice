import { NextResponse } from "next/server";
import { getActivityLogs } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const logs = await getActivityLogs(200);
    return NextResponse.json({
      success: true,
      logs: logs || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to retrieve activity logs",
        logs: [],
      },
      { status: 500 }
    );
  }
}
