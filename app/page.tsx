import Link from "next/link";
import { getAllEssays } from "@/lib/essays";

export default function HomePage() {
  const essays = getAllEssays().slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto px-6">
      <section className="relative pt-28 pb-24 overflow-hidden">
        <div
          className="ambient-glow w-[560px] h-[560px] -top-40 -left-20"
          aria-hidden="true"
        />
        <p className="relative font-mono text-sm text-muted mb-6">
          operator.codes
        </p>
        <h1 className="relative font-[family-name:var(--font-display)] text-5xl sm:text-6xl font-normal tracking-tight leading-[1.08] max-w-3xl">
          Systems, incentives, and infrastructure.
          <br />
          Written by someone who builds them.
        </h1>
        <p className="relative text-muted mt-8 max-w-xl text-lg leading-relaxed">
          Analysis and frameworks on AI systems, climate infrastructure,
          legal engineering, and protocol design, from Tyler Malin.
        </p>
        <div className="relative flex gap-4 mt-10">
          <Link
            href="/subscribe"
            className="btn-primary rounded-full px-6 py-3 text-sm font-medium"
          >
            Subscribe
          </Link>
          <Link
            href="/build-sessions"
            className="btn-secondary rounded-full px-6 py-3 text-sm"
          >
            Build Sessions
          </Link>
        </div>
      </section>

      <section className="py-24 border-t border-border">
        <h2 className="font-mono text-sm text-muted mb-12">Latest essays</h2>
        {essays.length === 0 ? (
          <p className="text-muted">
            Nothing published yet. Seed content lives in{" "}
            <code className="font-mono">/content/essays</code>.
          </p>
        ) : (
          <div className="flex flex-col gap-16">
            {essays.map((essay) => (
              <Link key={essay.slug} href={`/essays/${essay.slug}`} className="group">
                <p className="font-mono text-xs text-muted mb-3">
                  {essay.domain}
                </p>
                <h3 className="link-underline inline text-2xl sm:text-3xl font-normal tracking-tight leading-snug">
                  {essay.title}
                </h3>
                <p className="text-muted mt-3 max-w-xl leading-relaxed">
                  {essay.description}
                </p>
                <p className="font-mono text-xs text-faint mt-4">
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
