import type { Metadata } from "next";
import { getAllEssays } from "@/lib/essays";
import { getTopics } from "@/lib/topics";
import PostCard from "@/components/cards/post-card";
import TopicChips from "@/components/cards/topic-chips";
import SubscribeButton from "@/components/subscribe/subscribe-button";

// The full archive. Topic views live at /topics/[slug]; old
// /essays?topic= links redirect there (next.config.ts).
export const metadata: Metadata = {
  title: "Essays",
  description:
    "Every Operator essay by Tyler Malin: AI systems, legal engineering, digital assets, climate infrastructure, and capital markets. Sourced, with interactive tools.",
  alternates: { canonical: "/essays" },
};

export default function EssaysPage() {
  const essays = getAllEssays();
  const topics = getTopics(essays);

  const featured = essays.slice(0, 2);
  const rest = essays.slice(2);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-16 sm:px-8 sm:pt-24">
      <header className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="type-title text-[clamp(3.25rem,8vw,5.75rem)]">Essays</h1>
          <p className="type-dek mt-4 max-w-xl">
            Systems, incentives, and infrastructure across AI, law, digital assets, and climate.
          </p>
        </div>
        <div className="shrink-0">
          <SubscribeButton />
        </div>
      </header>

      <div className="mt-12">
        <TopicChips topics={topics} />
      </div>

      {featured.length > 0 && (
        <section aria-label="Featured" className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-2">
          {featured.map((e) => (
            <PostCard key={e.slug} essay={e} variant="featured" headingLevel="h2" priority />
          ))}
        </section>
      )}

      {rest.length > 0 && (
        <section aria-labelledby="latest" className="mt-20 border-t border-border pt-10">
          <h2 id="latest" className="type-meta text-foreground">
            More essays
          </h2>
          <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((e) => (
              <PostCard key={e.slug} essay={e} variant="grid" headingLevel="h3" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
