import Link from "next/link";
import type { Metadata } from "next";
import { getAllEssays } from "@/lib/essays";
import { GUIDES } from "@/lib/site";
import PostCard from "@/components/cards/post-card";
import SubscribeForm from "@/components/subscribe-form";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function HomePage() {
  const essays = getAllEssays();
  const featured = essays.slice(0, 2);
  const more = essays.slice(2, 5);

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <section className="pb-20 pt-16 sm:pb-28 sm:pt-28">
        <p className="type-meta">Operator · Tyler Malin</p>
        <h1 className="type-title mt-6 max-w-4xl text-[clamp(2.75rem,7vw,5.5rem)]">
          Systems, incentives, and infrastructure.{" "}
          <span className="italic text-muted">Written by someone who builds them.</span>
        </h1>
        <p className="type-dek mt-7 max-w-2xl">
          Essays on AI systems, legal engineering, digital assets, and climate
          infrastructure, by Tyler Malin. New essays by email.
        </p>
        <div className="mt-9">
          <SubscribeForm />
        </div>
      </section>

      {featured.length > 0 && (
        <section aria-labelledby="latest" className="border-t border-border pt-10">
          <div className="flex items-baseline justify-between">
            <h2 id="latest" className="text-[15px] font-medium text-muted">
              Latest
            </h2>
            <Link href="/essays" className="link-underline text-[15px] text-muted hover:text-foreground">
              All essays →
            </Link>
          </div>
          <div className="mt-8 grid gap-x-8 gap-y-14 md:grid-cols-2">
            {featured.map((e) => (
              <PostCard key={e.slug} essay={e} variant="featured" />
            ))}
          </div>
          {more.length > 0 && (
            <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((e) => (
                <PostCard key={e.slug} essay={e} variant="grid" />
              ))}
            </div>
          )}
        </section>
      )}

      {GUIDES.length > 0 && (
        <section aria-labelledby="guides" className="mt-24 border-t border-border pt-10">
          <h2 id="guides" className="text-[15px] font-medium text-muted">
            Field guides
          </h2>
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {GUIDES.map((g) => (
              <li key={g.slug}>
                <a
                  href={`/guides/${g.slug}`}
                  className="group flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <span className="type-title text-[clamp(1.75rem,3.5vw,2.5rem)]">
                    <span className="link-underline">{g.title}</span>
                  </span>
                  <span className="type-meta">{g.blurb}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
