import Link from "next/link";
import Image from "next/image";
import type { EssayMeta } from "@/lib/essays";
import { formatDate, topicLabel } from "@/lib/topics";
import TitlePlate from "./title-plate";

// One post card, two sizes. Featured cards (2-up, top of the archive)
// carry the dek; grid cards (3-up) carry title and meta only. The whole
// card is one link.
//
// Thumbnail is the essay's own hero image (every essay must have one;
// scripts/check-essays.mjs fails the build otherwise), with the topic
// in a glass pill over it. TitlePlate is the fallback only.
export default function PostCard({
  essay,
  variant = "grid",
  headingLevel = "h3",
  priority = false,
}: {
  essay: EssayMeta;
  variant?: "featured" | "grid";
  headingLevel?: "h2" | "h3";
  priority?: boolean;
}) {
  const H = headingLevel;
  const featured = variant === "featured";

  return (
    <Link href={`/essays/${essay.slug}`} className="group block">
      {essay.image ? (
        <div className="thumb aspect-[16/9]">
          <Image
            src={essay.image}
            alt=""
            fill
            priority={priority}
            sizes={
              featured
                ? "(min-width: 1152px) 544px, (min-width: 768px) 50vw, 100vw"
                : "(min-width: 1152px) 352px, (min-width: 640px) 50vw, 100vw"
            }
            className="object-cover"
          />
          <span className="glass glass-ink absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium text-white">
            {topicLabel(essay.domain)}
          </span>
        </div>
      ) : (
        <TitlePlate slug={essay.slug} title={essay.title} topic={essay.domain} size={variant} />
      )}
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
