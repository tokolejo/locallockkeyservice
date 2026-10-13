import { NextRequest, NextResponse } from "next/server";

export const revalidate = 86400; // Cache 24 hours

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl || !targetUrl.startsWith("https://")) {
    return new NextResponse("Invalid URL parameter: Only secure HTTPS URLs are permitted", { status: 400 });
  }

  // Security: strictly allow trusted CDN domains only
  const allowedHostnames = [
    "lh3.googleusercontent.com",
    "lh4.googleusercontent.com",
    "lh5.googleusercontent.com",
    "lh6.googleusercontent.com",
    "googleusercontent.com",
    "images.unsplash.com"
  ];

  try {
    const parsed = new URL(targetUrl);
    if (parsed.protocol !== "https:") {
      return new NextResponse("Protocol not allowed", { status: 403 });
    }

    const isAllowed = allowedHostnames.some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith("." + host)
    );
    if (!isAllowed) {
      return new NextResponse("Hostname not allowed", { status: 403 });
    }

    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
      next: { revalidate: 86400 }, // Cache server-side for 24 hours
    });

    if (!res.ok) {
      return new NextResponse(`Upstream returned ${res.status}`, { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400",
        "CDN-Cache-Control": "public, s-maxage=604800, stale-while-revalidate=86400",
        "Vercel-CDN-Cache-Control": "public, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    console.error("Avatar proxy error:", error?.message || error);
    return new NextResponse("Failed to proxy image", { status: 500 });
  }
}
