import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";
import { getAllEssays, getEssay } from "@/lib/essays";
import { mdxComponents } from "@/components/mdx";
import { getViewerTier } from "@/lib/auth";
import { resolveAccess, truncateForPreview } from "@/lib/paywall";
import ShareBar from "@/components/share-bar";
import EssaySubscribeCta from "@/components/essay-subscribe-cta";
import { AUTHOR, SITE_NAME, absoluteUrl } from "@/lib/site";
import { formatDate, topicHref, topicLabel, topicSlug } from "@/lib/topics";
import PostCard from "@/components/cards/post-card";
import AuthorAvatar from "@/components/author-avatar";

// Gating depends on per-request session state, so this route can't be
// statically generated. Named as a real tradeoff in the plan: every
// essay view now costs a server round trip instead of serving static
// HTML from the edge.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssay(slug);
  if (!essay) return {};
  const url = `/essays/${slug}`;
  return {
    title: essay.title,
    description: essay.description,
    authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title: essay.title,
      description: essay.description,
      publishedTime: essay.date,
      modifiedTime: essay.updated,
      authors: [AUTHOR.url],
      section: essay.domain,
      images: essay.image ? [{ url: essay.image }] : undefined,
    },
    twitter: {
      card: essay.image ? "summary_large_image" : "summary",
      title: essay.title,
      description: essay.description,
      images: essay.image ? [essay.image] : undefined,
    },
  };
}

export default async function EssayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const essay = getEssay(slug);
  if (!essay) notFound();

  const viewerTier = await getViewerTier();
  const access = resolveAccess(essay.tier, viewerTier);

  const displayContent =
    access === "preview" ? truncateForPreview(essay.content) : essay.content;

  // Article structured data. States plainly who wrote this, when, and
  // whether it's free to read; it isn't a ranking lever on its own.
  const url = absoluteUrl(`/essays/${slug}`);
  const topicUrl = absoluteUrl(topicHref(essay.domain));
  const related = getAllEssays()
    .filter((e) => e.slug !== slug && topicSlug(e.domain) === topicSlug(essay.domain))
    .slice(0, 3);

  const article = {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: essay.title,
    description: essay.description,
    datePublished: essay.date,
    dateModified: essay.updated ?? essay.date,
    url,
    mainEntityOfPage: url,
    inLanguage: "en-US",
    // The key points double as the abstract: the same answer-first
    // summary readers see at the top of the page.
    abstract: essay.keyPoints.length ? essay.keyPoints.join(" ") : undefined,
    citation: essay.sources.length
      ? essay.sources.map((src) => src.url)
      : undefined,
    image: essay.image ? absoluteUrl(essay.image) : undefined,
    articleSection: essay.domain,
    isAccessibleForFree: essay.tier === "free",
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    author: {
      "@type": "Person",
      "@id": `${AUTHOR.url}#person`,
      name: AUTHOR.name,
      url: AUTHOR.url,
      image: absoluteUrl(AUTHOR.image),
      sameAs: AUTHOR.sameAs,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${absoluteUrl("/")}#organization`,
      name: SITE_NAME,
      url: absoluteUrl("/"),
      logo: absoluteUrl("/brand/operator-logo.png"),
    },
  };

  const breadcrumbs = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Essays", item: absoluteUrl("/essays") },
      { "@type": "ListItem", position: 3, name: topicLabel(essay.domain), item: topicUrl },
      { "@type": "ListItem", position: 4, name: essay.title, item: url },
    ],
  };

  const jsonLd = { "@context": "https://schema.org", "@graph": [article, breadcrumbs] };

  return (
    <article className="mx-auto max-w-3xl px-5 pb-8 pt-14 sm:px-8 sm:pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <header className="text-center">
        <p className="type-meta">
          <time dateTime={essay.date}>{formatDate(essay.date)}</time>
          <span className="text-faint"> in </span>
          <Link
            href={topicHref(essay.domain)}
            className="link-underline text-foreground/85"
          >
            {topicLabel(essay.domain)}
          </Link>
          {essay.tier !== "free" && (
            <span className="ml-2 text-amber">· {essay.tier}</span>
          )}
        </p>
        <h1 className="type-title mx-auto mt-5 max-w-[22ch] text-[clamp(2.5rem,6.2vw,4.5rem)]">
          {essay.title}
        </h1>
        {essay.description && (
          <p className="type-dek mx-auto mt-5 max-w-[52ch]">{essay.description}</p>
        )}
        <p className="type-meta mt-6 flex flex-wrap items-center justify-center gap-y-1">
          <Link href="/about" rel="author" className="inline-flex items-center gap-2.5 text-foreground">
            <AuthorAvatar />
            <span className="link-underline">{AUTHOR.name}</span>
          </Link>
          <span className="mx-2 text-faint">·</span>
          {essay.readingTime}
          {essay.updated && essay.updated !== essay.date && (
            <>
              <span className="mx-2 text-faint">·</span>
              <span>
                Updated <time dateTime={essay.updated}>{formatDate(essay.updated)}</time>
              </span>
            </>
          )}
        </p>
        <div className="mt-6 flex justify-center border-y border-border py-3">
          <ShareBar
            url={`https://operator.codes/essays/${slug}`}
            title={essay.title}
          />
        </div>
      </header>

      {/* Skip the hero when the essay body already shows the same image
          as its first figure, so the reader never sees it twice. */}
      {essay.image && !essay.content.includes(essay.image) && (
        <Image
          src={essay.image}
          alt={essay.title}
          width={1200}
          height={655}
          priority
          className="mt-10 h-auto w-full rounded-[14px] border border-border"
        />
      )}

      {essay.keyPoints.length > 0 && (
        <aside
          aria-labelledby="key-points"
          className="mx-auto mt-12 max-w-[64ch] border-l-2 border-foreground/80 pl-6"
        >
          <h2 id="key-points" className="type-meta text-foreground">
            Key points
          </h2>
          <ul className="mt-4 space-y-3 font-serif text-[19px] leading-[1.5] text-foreground/90">
            {essay.keyPoints.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </aside>
      )}

      <div className="mt-12">
      {access === "blocked" ? (
        <PaywallBlock title={essay.title} />
      ) : (
        <>
          <div className="prose-essay">
            <MDXRemote
              source={displayContent}
              components={mdxComponents}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </div>
          {access === "preview" && (
            <PaywallBlock title={essay.title} isPreview />
          )}
          {access === "full" && essay.sources.length > 0 && (
            <EssaySources sources={essay.sources} />
          )}
          {access === "full" && <EssaySubscribeCta />}
        </>
      )}
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="mt-20 border-t border-border pt-10">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="related" className="type-meta text-foreground">
              More in {topicLabel(essay.domain)}
            </h2>
            <Link href={topicHref(essay.domain)} className="type-meta link-underline">
              All {topicLabel(essay.domain).toLowerCase()}
            </Link>
          </div>
          <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2">
            {related.slice(0, 2).map((e) => (
              <PostCard key={e.slug} essay={e} variant="grid" headingLevel="h3" />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

// Built from the essay's own outbound links, so the list can't drift
// from the text: cite something in the body and it appears here.
function EssaySources({ sources }: { sources: { title: string; url: string; host: string }[] }) {
  return (
    <section aria-labelledby="sources" className="mx-auto mt-16 max-w-[64ch] border-t border-border pt-8">
      <h2 id="sources" className="type-meta text-foreground">
        Sources
      </h2>
      <ol className="mt-5 list-decimal space-y-2.5 pl-6 text-[15px] leading-relaxed text-muted marker:text-faint">
        {sources.map((src) => (
          <li key={src.url} className="pl-1">
            <a href={src.url} className="link-underline text-foreground/90" rel="noopener">
              {src.host}
            </a>
            <span className="text-faint"> · </span>
            <span className="italic">&ldquo;{src.title}&rdquo;</span>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-[14px] text-faint">
        Each source is linked at the phrase quoted. Spot an error?{" "}
        <Link href="/standards#corrections" className="link-underline">
          How corrections work
        </Link>
        .
      </p>
    </section>
  );
}

function PaywallBlock({
  title,
  isPreview = false,
}: {
  title: string;
  isPreview?: boolean;
}) {
  return (
    <div className="mt-10 rounded-[14px] border border-border-md bg-surface p-10 text-center">
      <p className="font-normal text-lg mb-2">
        {isPreview
          ? `The rest of "${title}" is for pro subscribers.`
          : `"${title}" is for pro subscribers.`}
      </p>
      <p className="text-sm text-muted mb-7">
        Upgrade to read the full archive.
      </p>
      <Link
        href="/subscribe"
        className="btn-primary inline-flex h-11 items-center rounded-full px-6 text-[15px]"
      >
        Upgrade to pro
      </Link>
    </div>
  );
}
