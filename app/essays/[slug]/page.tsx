import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import { getEssay } from "@/lib/essays";
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
  return { title: essay.title, description: essay.description };
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
    <article className="max-w-3xl mx-auto px-6 py-16">
      <p className="font-mono text-xs text-accent-light mb-3">
        {essay.domain}
      </p>
      <h1 className="text-4xl font-bold leading-tight mb-3">
        {essay.title}
      </h1>
      <p className="font-mono text-xs text-faint mb-12">
        {essay.date} · {essay.readingTime}
        {essay.tier !== "free" && (
          <span className="ml-2 text-amber">· {essay.tier}</span>
        )}
      </p>

      {access === "blocked" ? (
        <PaywallBlock title={essay.title} />
      ) : (
        <>
          <div className="prose-essay">
            <MDXRemote source={displayContent} />
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
    <div className="mt-8 border border-accent-border bg-accent-dim rounded-xl p-8 text-center">
      <p className="font-semibold mb-2">
        {isPreview
          ? `The rest of "${title}" is for pro subscribers.`
          : `"${title}" is for pro subscribers.`}
      </p>
      <p className="text-sm text-muted mb-6">
        Upgrade to read the full archive.
      </p>
      <Link
        href="/subscribe"
        className="inline-block bg-accent text-background font-medium rounded-full px-5 py-2.5 text-sm hover:bg-accent-light transition-colors"
      >
        Upgrade to pro
      </Link>
    </div>
  );
}
