import Link from "next/link";
import Image from "next/image";
import type { EssayMeta } from "@/lib/essays";

// One card, two surfaces (home's Latest essays, /essays archive).
// Thumbnail renders only when the essay has a hero image: above the
// text on mobile, right column on wider screens.
export default function EssayCard({
  essay,
  headingLevel = "h3",
}: {
  essay: EssayMeta;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <Link
      href={`/essays/${essay.slug}`}
      className="group grid gap-6 sm:grid-cols-[1fr_260px] sm:items-center"
    >
      <div>
        <p className="font-mono text-xs text-muted mb-3">{essay.domain}</p>
        <Heading className="link-underline inline text-2xl sm:text-3xl font-normal tracking-tight leading-snug">
          {essay.title}
        </Heading>
        <p className="text-muted mt-3 max-w-xl leading-relaxed">
          {essay.description}
        </p>
        <p className="font-mono text-xs text-faint mt-4">
          {essay.date} · {essay.readingTime}
        </p>
      </div>
      {essay.image && (
        <Image
          src={essay.image}
          alt=""
          width={520}
          height={284}
          className="rounded-xl w-full h-auto order-first sm:order-none"
        />
      )}
    </Link>
  );
}
