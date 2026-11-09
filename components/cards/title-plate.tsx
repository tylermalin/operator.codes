import { topicLabel } from "@/lib/topics";

// A typeset cover for a post: topic pill and serif title on an ink
// plate with fine grain (see .plate in globals.css). Rendered as HTML,
// not an image, so it is crisp at any size, costs no bytes, and the
// title stays real text.
//
// Light position is derived from the slug, so every plate is stable
// across builds but no two adjacent plates look stamped.

function seed(slug: string): { x: number; y: number } {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const u = h >>> 0;
  return { x: 15 + (u % 70), y: 5 + ((u >>> 8) % 40) };
}

export default function TitlePlate({
  slug,
  title,
  topic,
  size = "grid",
}: {
  slug: string;
  title: string;
  topic: string;
  size?: "featured" | "grid";
}) {
  const { x, y } = seed(slug);
  const titleSize =
    size === "featured" ? "text-[clamp(1.9rem,8.6cqw,4.25rem)]" : "text-[clamp(1.5rem,9.6cqw,2.75rem)]";

  return (
    <div
      aria-hidden
      className="plate @container aspect-[16/10] w-full"
      style={{ ["--plate-x" as string]: `${x}%`, ["--plate-y" as string]: `${y}%` }}
    >
      <div className="relative z-[1] flex h-full flex-col items-center justify-center gap-[4.5cqw] px-[8cqw] text-center">
        <span className="rounded-full border border-border-md bg-surface/70 px-3 py-1 text-xs text-foreground/90 backdrop-blur-sm">
          {topicLabel(topic)}
        </span>
        <span className={`type-title line-clamp-3 text-foreground ${titleSize}`}>{title}</span>
      </div>
    </div>
  );
}
