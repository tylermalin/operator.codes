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

// Interactive guides. Native guides live at app/guides/<slug> and use the
// guide kit; older standalone ones are static pages in public/guides,
// mapped in next.config.ts. Listed here for the sitemap and home page.
export const GUIDES = [
  {
    slug: "own-what-you-host",
    title: "The Fence Line",
    description:
      "Where host communities have stopped or paused data centers, what a permitting fight costs the capital side, and a builder that turns property-line limits into draft covenant language.",
    topic: "Climate infrastructure",
    image: "/images/essays/own-what-you-host/hero.jpg",
    blurb: "4 tools · 12 sources",
    date: "2026-11-09",
  },
  {
    slug: "measured-not-ranked",
    title: "Measured, Not Ranked",
    description:
      "How AI answer engines choose what to cite, what the evidence says works and what wastes the budget, and a 90-day plan with hard dates.",
    topic: "AI systems",
    image: "/images/essays/measured-not-ranked/hero.jpg",
    blurb: "6 tools · 27 sources",
    date: "2026-11-09",
  },
];

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
