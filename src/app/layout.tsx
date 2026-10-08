import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
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
    "car key replacement Manchester NH"
  ],
  authors: [{ name: "Local Lock & Key Service" }],
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
          href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#faf9f6] text-slate-800 font-sans selection:bg-emerald-600 selection:text-white overflow-x-clip w-full">
        {children}
      </body>
    </html>
  );
}
