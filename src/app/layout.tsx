import type { Metadata, Viewport } from "next";
import "./globals.css";
import { JsonLdSchema } from "@/components/seo/JsonLdSchema";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://locallockservice.com"),
  title: "Local Lock & Key Service | 24/7 Locksmith Manchester NH",
  description:
    "Local Lock & Key Service provides 24/7 emergency car lockout, house lockout, commercial lock change & key duplication in Manchester NH & surrounding areas. Call +1 (603) 290-5554.",
  keywords: [
    "Local Lock & Key Service",
    "locksmith Manchester NH",
    "car lockout Manchester NH",
    "house lockout NH",
    "lock change Manchester",
    "24/7 locksmith New Hampshire",
    "emergency locksmith 6032905554",
    "car key replacement Manchester NH",
  ],
  authors: [{ name: "Local Lock & Key Service" }],
  alternates: {
    canonical: "https://locallockservice.com",
  },
  openGraph: {
    title: "Local Lock & Key Service | 24/7 Locksmith Manchester NH",
    description: "24/7 Emergency locksmith service in Manchester, NH and surrounding areas. Fast 15-30 min dispatch.",
    url: "https://locallockservice.com",
    siteName: "Local Lock & Key Service",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://locallockservice.com/gallery/hero-banner.png",
        width: 1200,
        height: 630,
        alt: "Local Lock & Key Service - 24/7 Locksmith Manchester NH",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Local Lock & Key Service | 24/7 Locksmith Manchester NH",
    description: "24/7 Emergency locksmith service in Manchester, NH. Fast dispatch.",
    images: ["https://locallockservice.com/gallery/hero-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased scroll-smooth"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=Google+Sans+Text:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
        />
        {/* Geo Meta Tags for Local SEO */}
        <meta name="geo.region" content="US-NH" />
        <meta name="geo.placename" content="Manchester, New Hampshire" />
        <meta name="geo.position" content="42.9956;-71.4548" />
        <meta name="ICBM" content="42.9956, -71.4548" />
        <JsonLdSchema />
      </head>
      <body className="min-h-full flex flex-col bg-[#faf9f6] text-slate-800 font-sans selection:bg-emerald-600 selection:text-white overflow-x-clip w-full">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
