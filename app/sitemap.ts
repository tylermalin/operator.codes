import type { MetadataRoute } from "next";
import { getAllEssays } from "@/lib/essays";
import { GUIDES, absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const essays = getAllEssays();
  const latest = essays[0]?.date;

  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: latest, priority: 1 },
    { url: absoluteUrl("/essays"), lastModified: latest, priority: 0.9 },
    { url: absoluteUrl("/about"), priority: 0.7 },
    { url: absoluteUrl("/build-sessions"), priority: 0.5 },
    { url: absoluteUrl("/subscribe"), priority: 0.5 },
  ];

  const essayEntries: MetadataRoute.Sitemap = essays.map((e) => ({
    url: absoluteUrl(`/essays/${e.slug}`),
    lastModified: e.updated ?? e.date,
    priority: 0.8,
  }));

  const guideEntries: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: absoluteUrl(`/guides/${g.slug}`),
    lastModified: g.date,
    priority: 0.8,
  }));

  return [...pages, ...essayEntries, ...guideEntries];
}
