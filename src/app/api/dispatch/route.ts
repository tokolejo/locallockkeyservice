import { NextResponse } from "next/server";
import { getDispatchRequests } from "@/lib/data/store";
import { requireAdminUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdminUser();
  } catch {
    return NextResponse.json(
      { success: false, error: "Unauthorized access: Admin authentication required" },
      { status: 401 }
    );
  }

  const requests = await getDispatchRequests();
  return NextResponse.json(requests);
}
