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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.locallockkeyservice.com"),
  title: {
    default: "Local Lock & Key Service | 24/7 Locksmith Manchester NH",
    template: "%s | Local Lock & Key Service",
  },
  description:
    "Local Lock & Key Service provides 24/7 mobile emergency locksmith solutions across Manchester, NH and 63+ Southern New Hampshire communities. Fast 24/7 mobile service for car lockouts, house lockouts, commercial locks, deadbolt rekeying, smart key fobs & safe opening. Call +1 (603) 290-5554.",
  keywords: [
    "Local Lock & Key Service",
    "locksmith Manchester NH",
    "emergency locksmith Manchester NH",
    "car lockout Manchester NH",
    "house lockout NH",
    "lock change Manchester NH",
    "lock rekeying Manchester NH",
    "car key replacement Manchester NH",
    "smart key fob programming NH",
    "commercial locksmith Manchester NH",
    "storefront mortise lock repair",
    "panic crash bar installation NH",
    "safe opening locksmith NH",
    "24/7 locksmith New Hampshire",
    "mobile locksmith Hillsborough County",
    "locksmith Bedford NH",
    "locksmith Nashua NH",
    "locksmith Concord NH",
    "locksmith Derry NH",
  ],
  authors: [{ name: "Local Lock & Key Service", url: "https://www.locallockkeyservice.com" }],
  creator: "Local Lock & Key Service",
  publisher: "Local Lock & Key Service",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Local Lock & Key Service | 24/7 Locksmith Manchester NH",
    description:
      "24/7 Mobile emergency locksmith in Manchester, NH and 63+ Southern New Hampshire communities. Fast 24/7 mobile service. Call (603) 290-5554.",
    url: "https://www.locallockkeyservice.com",
    siteName: "Local Lock & Key Service",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Local Lock & Key Service - 24/7 Locksmith Manchester NH",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Local Lock & Key Service | 24/7 Locksmith Manchester NH",
    description:
      "24/7 Mobile emergency locksmith in Manchester, NH and 63+ Southern New Hampshire communities. Fast 24/7 mobile service. Call (603) 290-5554.",
    images: ["/og-image.jpg"],
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
