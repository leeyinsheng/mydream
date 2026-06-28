import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://finpulse.app";
  const staticPages = [
    { path: "", priority: 1.0 },
    { path: "/forex", priority: 0.9 },
    { path: "/commodities", priority: 0.9 },
    { path: "/stocks", priority: 0.9 },
    { path: "/industry", priority: 0.8 },
    { path: "/real-estate", priority: 0.9 },
    { path: "/screener", priority: 0.7 },
    { path: "/login", priority: 0.3 },
    { path: "/register", priority: 0.3 },
  ];
  return staticPages.map((p) => ({
    url: `${base}${p.path}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: p.priority,
  }));
}
