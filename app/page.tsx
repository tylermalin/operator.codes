import Link from "next/link";
import { getAllEssays } from "@/lib/essays";

export default function HomePage() {
  const essays = getAllEssays().slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto px-6">
      <section className="pt-20 pb-16 border-b border-border">
        <p className="font-mono text-sm text-accent-light mb-4">
          operator.codes
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-bold max-w-2xl leading-tight">
          Systems, incentives, and infrastructure. Written by someone who
          builds them.
        </h1>
        <p className="text-muted mt-6 max-w-xl">
          Analysis and frameworks on AI systems, climate infrastructure,
          legal engineering, and protocol design, from Tyler Malin.
        </p>
        <div className="flex gap-4 mt-8">
          <Link
            href="/subscribe"
            className="bg-accent text-background font-medium rounded-full px-5 py-2.5 text-sm hover:bg-accent-light transition-colors"
          >
            Subscribe
          </Link>
          <Link
            href="/build-sessions"
            className="border border-border-md rounded-full px-5 py-2.5 text-sm hover:border-border-hi transition-colors"
          >
            Build Sessions →
          </Link>
        </div>
      </section>

      <section className="py-16">
        <h2 className="font-mono text-sm text-muted uppercase tracking-wide mb-8">
          Latest essays
        </h2>
        {essays.length === 0 ? (
          <p className="text-muted">
            Nothing published yet. Seed content lives in{" "}
            <code className="font-mono">/content/essays</code>.
          </p>
        ) : (
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
                <h3 className="text-2xl font-semibold group-hover:text-accent-light transition-colors">
                  {essay.title}
                </h3>
                <p className="text-muted mt-2">{essay.description}</p>
                <p className="font-mono text-xs text-faint mt-3">
                  {essay.date} · {essay.readingTime}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
