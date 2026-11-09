import type { Metadata } from "next";
import { getAllEssays } from "@/lib/essays";
import { getTopics, topicSlug } from "@/lib/topics";
import PostCard from "@/components/cards/post-card";
import TopicChips from "@/components/cards/topic-chips";
import SubscribeButton from "@/components/subscribe/subscribe-button";

// Filtered views share the archive's canonical, so ?topic= pages never
// compete with /essays in search.
export const metadata: Metadata = {
  title: "Essays",
  description:
    "Every Operator essay: AI systems, climate infrastructure, legal engineering, and protocol design, by Tyler Malin.",
  alternates: { canonical: "/essays" },
};

export default async function EssaysPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  const all = getAllEssays();
  const topics = getTopics(all);
  const active = topics.some((t) => t.slug === topic) ? topic : undefined;
  const essays = active ? all.filter((e) => topicSlug(e.domain) === active) : all;

  const featured = essays.slice(0, 2);
  const rest = essays.slice(2);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-16 sm:px-8 sm:pt-24">
      <header className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="type-title text-[clamp(3.5rem,9vw,6.5rem)]">Essays</h1>
          <p className="type-dek mt-4 max-w-xl">
            Systems, incentives, and infrastructure across AI, law, digital assets, and climate.
          </p>
        </div>
        <div className="shrink-0">
          <SubscribeButton />
        </div>
      </header>

      <div className="mt-12">
        <TopicChips topics={topics} active={active} />
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
          <h2 id="latest" className="text-[15px] font-medium text-muted">
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
