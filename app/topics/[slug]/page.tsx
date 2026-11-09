import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllEssays } from "@/lib/essays";
import { GUIDES, SITE_NAME, absoluteUrl } from "@/lib/site";
import { TOPIC_INTROS, getTopics, topicSlug } from "@/lib/topics";
import PostCard from "@/components/cards/post-card";
import TopicChips from "@/components/cards/topic-chips";
import SubscribeButton from "@/components/subscribe/subscribe-button";

// One indexable hub per topic. Replaces the old /essays?topic= filter,
// which shared the archive's canonical and so could never rank for the
// topic itself. Each hub collects the topic's field guides and essays
// under one URL with its own description.

export function generateStaticParams() {
  return getTopics(getAllEssays()).map((t) => ({ slug: t.slug }));
}

export const dynamicParams = false;

function load(slug: string) {
  const all = getAllEssays();
  const topic = getTopics(all).find((t) => t.slug === slug);
  if (!topic) return null;
  return {
    topic,
    all,
    intro: TOPIC_INTROS[slug] ?? `Every Operator essay on ${topic.label.toLowerCase()}.`,
    essays: all.filter((e) => topicSlug(e.domain) === slug),
    guides: GUIDES.filter((g) => topicSlug(g.topic) === slug),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = load(slug);
  if (!data) return {};
  const path = `/topics/${slug}`;
  return {
    title: `${data.topic.label}: essays and field guides`,
    description: data.intro,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, siteName: SITE_NAME, title: data.topic.label, description: data.intro },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = load(slug);
  if (!data) notFound();
  const { topic, all, intro, essays, guides } = data;
  const url = absoluteUrl(`/topics/${slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#page`,
        url,
        name: `${topic.label} · ${SITE_NAME}`,
        description: intro,
        inLanguage: "en-US",
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: [
            ...guides.map((g) => ({ url: absoluteUrl(`/guides/${g.slug}`), name: g.title })),
            ...essays.map((e) => ({ url: absoluteUrl(`/essays/${e.slug}`), name: e.title })),
          ].map((item, i) => ({ "@type": "ListItem", position: i + 1, ...item })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Essays", item: absoluteUrl("/essays") },
          { "@type": "ListItem", position: 3, name: topic.label, item: url },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-16 sm:px-8 sm:pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <header className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="type-meta">
            <Link href="/essays" className="link-underline">
              Essays
            </Link>
            <span className="text-faint"> / </span>
            Topic
          </p>
          <h1 className="type-title mt-4 text-[clamp(3rem,7.5vw,5.25rem)]">{topic.label}</h1>
          <p className="type-dek mt-4 max-w-[52ch]">{intro}</p>
          <p className="type-meta mt-5">
            {essays.length} {essays.length === 1 ? "essay" : "essays"}
            {guides.length > 0 && ` · ${guides.length} field ${guides.length === 1 ? "guide" : "guides"}`}
          </p>
        </div>
        <div className="shrink-0">
          <SubscribeButton />
        </div>
      </header>

      <div className="mt-12">
        <TopicChips topics={getTopics(all)} active={slug} />
      </div>

      {guides.length > 0 && (
        <section aria-labelledby="guides" className="mt-12">
          <h2 id="guides" className="type-meta text-foreground">
            Field guides
          </h2>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            {guides.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="group grid gap-5 rounded-[14px] border border-border p-4 transition-colors hover:border-border-md sm:grid-cols-[180px_1fr]"
              >
                <Image
                  src={g.image}
                  alt={g.title}
                  width={360}
                  height={240}
                  className="thumb aspect-[3/2] h-auto w-full rounded-[10px] object-cover"
                />
                <div>
                  <h3 className="type-title text-[28px] group-hover:underline">{g.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{g.description}</p>
                  <p className="type-meta mt-3">{g.blurb}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="topic-essays" className="mt-16 border-t border-border pt-10">
        <h2 id="topic-essays" className="type-meta text-foreground">
          Essays
        </h2>
        <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {essays.map((e, i) => (
            <PostCard key={e.slug} essay={e} variant="grid" headingLevel="h3" priority={i < 3} />
          ))}
        </div>
      </section>
    </div>
  );
}
