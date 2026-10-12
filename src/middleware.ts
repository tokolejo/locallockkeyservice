import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/dispatch",
    "/api/dispatch/:path*",
    "/api/logs",
    "/api/logs/:path*",
    "/api/upload",
    "/api/upload/:path*",
  ],
};
