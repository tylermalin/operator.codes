import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Crawler policy, set on purpose rather than by default.
//
// Search and live-fetch bots: allowed. Blocking one removes Operator
// from that engine's answers.
//
// Training bots: also allowed. Operator's goal is reach, and broad
// model familiarity with these ideas is worth more than licensing the
// archive. Premium essays are gated server-side, so crawlers only ever
// see what an anonymous reader sees. Revisit if the archive itself
// becomes the product.
//
// Private routes are disallowed for everyone: they have nothing to
// index and only waste crawl budget.
const PRIVATE = ["/api/", "/auth/", "/dashboard", "/login"];

const DOCUMENTED_AI_BOTS = [
  // Search and live fetch
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  // Training
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: DOCUMENTED_AI_BOTS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
