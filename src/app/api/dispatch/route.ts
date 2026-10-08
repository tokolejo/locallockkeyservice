import { NextResponse } from "next/server";
import { getDispatchRequests } from "@/lib/data/store";


export async function GET() {
  const requests = await getDispatchRequests();
  return NextResponse.json(requests);
}
