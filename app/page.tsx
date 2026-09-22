import { getAllEssays } from "@/lib/essays";
import EssayCard from "@/components/essay-card";
import HeroGlobe from "@/components/hero-globe";
import SubscribeForm from "@/components/subscribe-form";
import Link from "next/link";

export default function HomePage() {
  const essays = getAllEssays().slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto px-6">
      <section className="relative pt-28 pb-24 overflow-hidden">
        <HeroGlobe />
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
        <div className="relative mt-10">
          <SubscribeForm />
          <Link
            href="/build-sessions"
            className="link-underline inline-block mt-5 font-mono text-xs text-muted"
          >
            Or book a Build Session
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
              <EssayCard key={essay.slug} essay={essay} headingLevel="h3" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
