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
    <aside className="not-prose my-12 rounded-[14px] border border-border-md bg-surface p-6 sm:p-8">
      <p className="type-meta mb-3">Interactive field guide</p>
      <p className="type-title mb-3 text-[2rem]">
        {title}
      </p>
      <p className="text-muted leading-relaxed mb-5">{summary}</p>
      {toolList.length > 0 && (
        <ul className="flex flex-wrap gap-2 mb-6 list-none p-0">
          {toolList.map((t) => (
            <li
              key={t}
              className="font-mono text-[11px] text-muted border border-border-md rounded-full px-2.5 py-0.5"
            >
              {t}
            </li>
          ))}
        </ul>
      )}
      <a
        href={href}
        className="btn-primary inline-flex h-11 items-center rounded-full px-6 text-[15px] no-underline"
      >
        Open the field guide →
      </a>
    </aside>
  );
}
