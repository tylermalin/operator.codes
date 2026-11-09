import type { MetadataRoute } from "next";
import { getAllEssays } from "@/lib/essays";
import { GUIDES, absoluteUrl } from "@/lib/site";
import { getTopics, topicSlug } from "@/lib/topics";

export default function sitemap(): MetadataRoute.Sitemap {
  const essays = getAllEssays();
  const latest = essays[0]?.date;

  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: latest, priority: 1 },
    { url: absoluteUrl("/essays"), lastModified: latest, priority: 0.9 },
    { url: absoluteUrl("/about"), priority: 0.7 },
    { url: absoluteUrl("/standards"), lastModified: "2026-11-09", priority: 0.6 },
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

  // A hub changes whenever one of its essays does.
  const topicEntries: MetadataRoute.Sitemap = getTopics(essays).map((t) => ({
    url: absoluteUrl(`/topics/${t.slug}`),
    lastModified: essays
      .filter((e) => topicSlug(e.domain) === t.slug)
      .map((e) => e.updated ?? e.date)
      .sort()
      .at(-1),
    priority: 0.7,
  }));

  return [...pages, ...topicEntries, ...essayEntries, ...guideEntries];
}
