// Single source for the facts machines read about this site and its
// author: canonical origin, author identity, and the profiles that
// corroborate it. Metadata, JSON-LD, the sitemap, and the RSS feed all
// read from here so they can't drift apart.

export const SITE_URL = "https://operator.codes";
export const SITE_NAME = "Operator";
export const SITE_DESCRIPTION =
  "Analysis and frameworks on AI systems, climate infrastructure, legal engineering, and protocol design, from Tyler Malin.";

export const AUTHOR = {
  name: "Tyler Malin",
  url: `${SITE_URL}/about`,
  jobTitle: "Founder, Beneficial Technology",
  // Profiles and sites that independently confirm who the author is.
  sameAs: [
    "https://x.com/tylermalin",
    "https://github.com/tylermalin",
    "https://beneficial.technology",
  ],
};

// Interactive guides are static pages in public/guides, mapped to clean
// URLs in next.config.ts. Listed here so the sitemap includes them.
export const GUIDES = [
  {
    slug: "measured-not-ranked",
    title: "Measured, Not Ranked",
    date: "2026-11-09",
  },
];

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
