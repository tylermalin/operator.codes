import type { EssayMeta } from "@/lib/essays";

// Topics come from each essay's `domain` frontmatter. Slugs are derived,
// so adding an essay with a new domain adds a hub automatically; add an
// intro here to give that hub its own description.

export type Topic = { slug: string; label: string; count: number };

export const TOPIC_INTROS: Record<string, string> = {
  "ai-systems":
    "How autonomous software gets legal standing, authority, and accountability, and how AI answer engines decide what to cite.",
  "legal-engineering":
    "Contracts, entities, and professional duties treated as systems: where they fail under stress, and how to design them so they don't.",
  "digital-assets":
    "Custody, reserves, stablecoins, and tokenization through one question: who verifies, and how often?",
  "climate-infrastructure":
    "Data centers, carbon markets, and the physical systems behind climate numbers: who carries the cost, and whether the data is real.",
  "capital-markets":
    "How early-stage capital is priced right now, from Carta's data, and how founders should raise in a market that concentrates.",
};

export function topicSlug(domain: string): string {
  return domain
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function topicLabel(domain: string): string {
  return domain.charAt(0).toUpperCase() + domain.slice(1);
}

export function topicHref(domain: string): string {
  return `/topics/${topicSlug(domain)}`;
}

export function getTopics(essays: EssayMeta[]): Topic[] {
  const map = new Map<string, Topic>();
  for (const e of essays) {
    const slug = topicSlug(e.domain);
    const t = map.get(slug);
    if (t) t.count += 1;
    else map.set(slug, { slug, label: topicLabel(e.domain), count: 1 });
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
