import { NextResponse } from "next/server";
import { getActivityLogs } from "@/lib/data/store";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            message: "Unauthorized access: Admin authentication required",
            logs: [],
          },
          { status: 401 }
        );
      }
    }

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
