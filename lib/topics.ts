import type { EssayMeta } from "@/lib/essays";

// Topics come from each essay's `domain` frontmatter. Slugs are derived,
// so adding an essay with a new domain adds a chip automatically.

export type Topic = { slug: string; label: string; count: number };

export function topicSlug(domain: string): string {
  return domain
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function topicLabel(domain: string): string {
  return domain.charAt(0).toUpperCase() + domain.slice(1);
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
