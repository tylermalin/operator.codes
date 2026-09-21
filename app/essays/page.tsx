import Link from "next/link";
import type { Metadata } from "next";
import { getAllEssays } from "@/lib/essays";

export const metadata: Metadata = { title: "Essays" };

export default function EssaysPage() {
  const essays = getAllEssays();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Essays</h1>
      <p className="text-muted mb-12">
        AI systems, climate infrastructure, legal engineering, protocol
        design.
      </p>
      <div className="grid gap-8">
        {essays.map((essay) => (
          <Link
            key={essay.slug}
            href={`/essays/${essay.slug}`}
            className="block border-b border-border pb-8 group"
          >
            <p className="font-mono text-xs text-accent-light mb-2">
              {essay.domain}
            </p>
            <h2 className="text-2xl font-semibold group-hover:text-accent-light transition-colors">
              {essay.title}
            </h2>
            <p className="text-muted mt-2">{essay.description}</p>
            <p className="font-mono text-xs text-faint mt-3">
              {essay.date} · {essay.readingTime}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
