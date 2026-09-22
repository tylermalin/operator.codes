import Link from "next/link";
import type { Metadata } from "next";
import { getAllEssays } from "@/lib/essays";

export const metadata: Metadata = { title: "Essays" };

export default function EssaysPage() {
  const essays = getAllEssays();

  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-normal tracking-tight mb-4">Essays</h1>
      <p className="text-muted mb-16 max-w-lg leading-relaxed">
        AI systems, climate infrastructure, legal engineering, protocol
        design.
      </p>
      <div className="flex flex-col gap-16">
        {essays.map((essay) => (
          <Link key={essay.slug} href={`/essays/${essay.slug}`} className="group">
            <p className="font-mono text-xs text-muted mb-3">
              {essay.domain}
            </p>
            <h2 className="link-underline inline text-2xl sm:text-3xl font-normal tracking-tight leading-snug">
              {essay.title}
            </h2>
            <p className="text-muted mt-3 max-w-xl leading-relaxed">
              {essay.description}
            </p>
            <p className="font-mono text-xs text-faint mt-4">
              {essay.date} · {essay.readingTime}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
