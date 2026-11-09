import Link from "next/link";
import type { EssayMeta } from "@/lib/essays";
import { formatDate } from "@/lib/topics";
import TitlePlate from "./title-plate";

// One post card, two sizes. Featured cards (2-up, top of the archive)
// carry the dek; grid cards (3-up) carry title and meta only. The whole
// card is one link; the plate is decorative, so the visible title is
// the accessible name.
export default function PostCard({
  essay,
  variant = "grid",
  headingLevel = "h3",
}: {
  essay: EssayMeta;
  variant?: "featured" | "grid";
  headingLevel?: "h2" | "h3";
}) {
  const H = headingLevel;
  const featured = variant === "featured";

  return (
    <Link href={`/essays/${essay.slug}`} className="group block">
      <TitlePlate slug={essay.slug} title={essay.title} topic={essay.domain} size={variant} />
      <H
        className={
          featured
            ? "mt-5 text-[clamp(1.5rem,2.6vw,2.125rem)] font-medium leading-[1.15] tracking-[-0.02em] text-balance"
            : "mt-4 text-lg font-medium leading-snug tracking-[-0.01em] text-balance"
        }
      >
        <span className="link-underline">{essay.title}</span>
      </H>
      {featured && (
        <p className="mt-3 line-clamp-2 max-w-[60ch] text-[16px] leading-relaxed text-muted">
          {essay.description}
        </p>
      )}
      <p className={`type-meta ${featured ? "mt-4" : "mt-2.5"}`}>
        <time dateTime={essay.date}>{formatDate(essay.date)}</time>
        <span className="mx-2 text-faint">·</span>
        {essay.readingTime}
        {essay.tier !== "free" && <span className="ml-2 text-amber">· {essay.tier}</span>}
      </p>
    </Link>
  );
}
