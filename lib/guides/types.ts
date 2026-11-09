// The guide kit's contract: a figure cannot render without a source.
//
// Each guide defines a source registry. Components that show a fact
// (Stat, Cite, case cards) take a source id typed against that
// registry, so an unknown or missing source is a compile error, not a
// silent gap. Numbers that are inputs or assumptions are labeled as
// such in the UI and never take a source.

export type Source = {
  title: string;
  publisher: string;
  /** Publication date as shown by the source, ISO or "YYYY-MM" */
  date: string;
  url: string;
  kind: "primary" | "regulator" | "court" | "research" | "reporting";
};

export type SourceRegistry = Record<string, Source>;

/** Stable numbering: order of keys in the registry */
export function sourceNumber<R extends SourceRegistry>(registry: R, id: keyof R): number {
  return Object.keys(registry).indexOf(id as string) + 1;
}
