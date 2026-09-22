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
  return {
    title: essay.title,
    description: essay.description,
    openGraph: {
      type: "article",
      title: essay.title,
      description: essay.description,
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

  return (
    <article className="max-w-3xl mx-auto px-6 py-24">
      <p className="font-mono text-xs text-muted mb-4">{essay.domain}</p>
      <h1 className="text-4xl sm:text-5xl font-normal tracking-tight leading-[1.1] mb-5">
        {essay.title}
      </h1>
      <p className="font-mono text-xs text-faint mb-16">
        {essay.date} · {essay.readingTime}
        {essay.tier !== "free" && (
          <span className="ml-2 text-amber">· {essay.tier}</span>
        )}
      </p>

      {essay.image && (
        <Image
          src={essay.image}
          alt={essay.title}
          width={1200}
          height={655}
          priority
          className="rounded-2xl w-full h-auto mb-16"
        />
      )}

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
        </>
      )}
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
    <div className="mt-10 border border-accent-border bg-accent-dim rounded-2xl p-10 text-center">
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
        className="btn-primary inline-block rounded-full px-6 py-3 text-sm font-medium"
      >
        Upgrade to pro
      </Link>
    </div>
  );
}
