import type { MetadataRoute } from "next";

export const revalidate = 86400; // Static generation / 24 hour CDN cache

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://locallockservice.com").replace(/\/+$/, "");

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];
}
