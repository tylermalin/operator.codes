import type { Tier } from "@/lib/essays";

export type AccessLevel = "full" | "preview" | "blocked";

// free: everyone gets full content, indexed by SEO
// preview: first 20% visible to everyone, rest requires pro
// premium: nothing visible without pro
export function resolveAccess(
  essayTier: Tier,
  viewerTier: "anonymous" | "free" | "pro",
): AccessLevel {
  if (essayTier === "free") return "full";
  if (viewerTier === "pro") return "full";
  if (essayTier === "preview") return "preview";
  return "blocked"; // premium, no pro tier
}

// Splits MDX source at the paragraph boundary closest to `fraction`
// through the raw character count. Approximate by design: exact word
// counting on unrendered MDX isn't meaningful, and "close enough" is
// fine for a preview teaser.
export function truncateForPreview(source: string, fraction = 0.2): string {
  const paragraphs = source.split(/\n\n+/);
  const cutIndex = Math.max(1, Math.ceil(paragraphs.length * fraction));
  return paragraphs.slice(0, cutIndex).join("\n\n");
}
