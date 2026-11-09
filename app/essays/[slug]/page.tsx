import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";
import { getEssay } from "@/lib/essays";
import { mdxComponents } from "@/components/mdx";
import { getViewerTier } from "@/lib/auth";
import { resolveAccess, truncateForPreview } from "@/lib/paywall";
import ShareBar from "@/components/share-bar";
import EssaySubscribeCta from "@/components/essay-subscribe-cta";
import { AUTHOR, SITE_NAME, absoluteUrl } from "@/lib/site";
import { formatDate, topicLabel, topicSlug } from "@/lib/topics";

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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: essay.title,
    description: essay.description,
    datePublished: essay.date,
    dateModified: essay.updated ?? essay.date,
    url: absoluteUrl(`/essays/${slug}`),
    mainEntityOfPage: absoluteUrl(`/essays/${slug}`),
    image: essay.image ? absoluteUrl(essay.image) : undefined,
    articleSection: essay.domain,
    isAccessibleForFree: essay.tier === "free",
    author: {
      "@type": "Person",
      name: AUTHOR.name,
      url: AUTHOR.url,
      sameAs: AUTHOR.sameAs,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
      logo: absoluteUrl("/brand/operator-logo.png"),
    },
  };

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
            href={`/essays?topic=${topicSlug(essay.domain)}`}
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
        <p className="type-meta mt-6">
          <Link href="/about" rel="author" className="link-underline text-foreground">
            {AUTHOR.name}
          </Link>
          <span className="mx-2 text-faint">·</span>
          {essay.readingTime}
          {essay.updated && essay.updated !== essay.date && (
            <>
              <span className="mx-2 text-faint">·</span>
              Updated <time dateTime={essay.updated}>{formatDate(essay.updated)}</time>
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
          alt=""
          width={1200}
          height={655}
          priority
          className="mt-10 h-auto w-full rounded-[14px] border border-border"
        />
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
          {access === "full" && <EssaySubscribeCta />}
        </>
      )}
      </div>
    </article>
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
