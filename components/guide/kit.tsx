import type { ReactNode } from "react";
import { sourceNumber, type SourceRegistry } from "@/lib/guides/types";

// Guide kit: the building blocks every interactive guide uses, styled
// on the Ink system. See docs/design-system.md, "Guides".

/** Superscript citation linking to the numbered source list */
export function Cite<R extends SourceRegistry>({ registry, id }: { registry: R; id: keyof R & string }) {
  const n = sourceNumber(registry, id);
  return (
    <sup className="ml-0.5 align-super text-[0.65em] font-medium">
      <a href={`#src-${id}`} className="text-muted no-underline hover:text-foreground" aria-label={`Source ${n}`}>
        [{n}]
      </a>
    </sup>
  );
}

/** A sourced figure. `source` is required by type: no source, no stat. */
export function Stat<R extends SourceRegistry>({
  registry,
  source,
  value,
  label,
}: {
  registry: R;
  source: keyof R & string;
  value: string;
  label: string;
}) {
  return (
    <div className="border-t border-border-md pt-5">
      <p className="type-title text-[clamp(2.25rem,4vw,3.25rem)] leading-none">{value}</p>
      <p className="mt-3 text-[15px] leading-snug text-muted">
        {label}
        <Cite registry={registry} id={source} />
      </p>
    </div>
  );
}

/** Numbered section with a meta label, Garamond heading, and Inter dek */
export function Section({
  id,
  n,
  label,
  title,
  dek,
  children,
}: {
  id: string;
  n: string;
  label: string;
  title: string;
  dek?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 border-t border-border pt-12">
      <p className="type-meta">
        <span className="text-foreground">{n}</span>
        <span className="mx-2 text-faint">·</span>
        {label}
      </p>
      <h2 id={`${id}-h`} className="type-title mt-4 max-w-[26ch] text-[clamp(2rem,4vw,3rem)]">
        {title}
      </h2>
      {dek && <div className="type-dek mt-4 max-w-[62ch]">{dek}</div>}
      <div className="mt-10">{children}</div>
    </section>
  );
}

/** Frame for an interactive tool */
export function ToolFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-[14px] border border-border-md bg-surface">
      <div className="flex items-center justify-between border-b border-border px-5 py-3 sm:px-6">
        <span className="type-meta text-foreground">{label}</span>
        <span className="type-meta">Tool</span>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

/** Callout used to label inputs, assumptions, and framework claims */
export function Note({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-[13px] leading-relaxed text-muted">{children}</p>;
}

/** The numbered source list. Anchors match <Cite>. */
export function Sources<R extends SourceRegistry>({ registry, accessed }: { registry: R; accessed: string }) {
  return (
    <section id="sources" aria-labelledby="sources-h" className="scroll-mt-24 border-t border-border pt-12">
      <p className="type-meta">Sources · accessed {accessed}</p>
      <h2 id="sources-h" className="type-title mt-4 text-[clamp(2rem,4vw,3rem)]">
        {Object.keys(registry).length} sources
      </h2>
      <ol className="mt-8 grid gap-x-10 gap-y-4 text-[15px] leading-snug md:grid-cols-2">
        {Object.entries(registry).map(([id, s], i) => (
          <li key={id} id={`src-${id}`} className="flex scroll-mt-24 gap-3">
            <span className="type-meta w-6 shrink-0 pt-0.5 text-right">{i + 1}</span>
            <span>
              <a href={s.url} className="link-underline text-foreground" rel="noopener">
                {s.title}
              </a>
              <span className="block text-muted">
                {s.publisher} · {s.date}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
