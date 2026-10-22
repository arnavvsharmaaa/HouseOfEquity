import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Commercial pages first (brand guide §12), then trust and legal pages.
const routes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/heloc", priority: 0.9, changeFrequency: "monthly" },
  { path: "/home-equity-loan", priority: 0.9, changeFrequency: "monthly" },
  { path: "/debt-consolidation", priority: 0.9, changeFrequency: "monthly" },
  { path: "/cash-out-refinance", priority: 0.9, changeFrequency: "monthly" },
  { path: "/buy", priority: 0.8, changeFrequency: "monthly" },
  { path: "/refinance", priority: 0.8, changeFrequency: "monthly" },
  { path: "/programs", priority: 0.7, changeFrequency: "monthly" },
  { path: "/rate-match", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/licensing", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((r) => ({
    url: `${site.url}${r.path === "/" ? "" : r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}

