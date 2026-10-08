import { NextResponse } from "next/server";
import { getDispatchRequests } from "@/lib/data/store";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access: Admin authentication required" },
        { status: 401 }
      );
    }
  }

  const requests = await getDispatchRequests();
  return NextResponse.json(requests);
}
