// Links an essay to its companion interactive guide. Guides are static
// pages served from public/guides (see next.config.ts rewrites), so this
// uses a plain anchor rather than next/link: client-side routing would
// try to resolve a Next route that doesn't exist.
//
// `tools` is a pipe-separated string, not an array: next-mdx-remote v6
// blocks JS expressions in MDX props by default, so array literals are
// silently dropped.

export function GuideCallout({
  href,
  title,
  summary,
  tools,
}: {
  href: string;
  title: string;
  summary: string;
  tools?: string;
}) {
  const toolList = (tools ?? "")
    .split("|")
    .map((t) => t.trim())
    .filter(Boolean);
  return (
    <aside className="not-prose my-12 rounded-2xl border border-accent-border bg-accent-dim p-6 sm:p-8">
      <p className="font-mono text-xs text-muted mb-3">interactive field guide</p>
      <p className="text-xl sm:text-2xl font-normal tracking-tight leading-snug mb-3">
        {title}
      </p>
      <p className="text-muted leading-relaxed mb-5">{summary}</p>
      {toolList.length > 0 && (
        <ul className="flex flex-wrap gap-2 mb-6 list-none p-0">
          {toolList.map((t) => (
            <li
              key={t}
              className="font-mono text-[11px] text-muted border border-accent-border rounded px-2 py-0.5"
            >
              {t}
            </li>
          ))}
        </ul>
      )}
      <a
        href={href}
        className="btn-primary inline-block rounded-full px-6 py-3 text-sm font-medium no-underline"
      >
        Open the field guide →
      </a>
    </aside>
  );
}
