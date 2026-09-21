import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import { getEssay, getAllEssays } from "@/lib/essays";

export function generateStaticParams() {
  return getAllEssays().map((e) => ({ slug: e.slug }));
}

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
      </p>
      <div className="prose-essay">
        <MDXRemote source={essay.content} />
      </div>
    </article>
  );
}
