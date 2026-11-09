import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const ESSAYS_DIR = path.join(process.cwd(), "content", "essays");

export type Tier = "free" | "preview" | "premium";

export type EssayMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  /** Last substantive revision, ISO date. Optional. */
  updated?: string;
  domain: string;
  tier: Tier;
  draft: boolean;
  image?: string;
  /** Two to four answer-first sentences shown at the top and used as the abstract */
  keyPoints: string[];
  readingTime: string;
};

/** An external source linked from an essay's body */
export type EssaySource = { title: string; url: string; host: string };

export type Essay = EssayMeta & { content: string; sources: EssaySource[] };

function readSlugs(): string[] {
  if (!fs.existsSync(ESSAYS_DIR)) return [];
  return fs
    .readdirSync(ESSAYS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

// Drafts are excluded here (the archive and home page), but still
// reachable by direct URL via getEssay(), so a draft link can be
// shared for review without appearing in any public listing.
export function getAllEssays(): EssayMeta[] {
  return readSlugs()
    .map((slug) => getEssayMeta(slug))
    .filter((e): e is EssayMeta => e !== null && !e.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getEssayMeta(slug: string): EssayMeta | null {
  const filePath = path.join(ESSAYS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "",
    updated: data.updated,
    domain: data.domain ?? "general",
    tier: (data.tier as Tier) ?? "free",
    draft: data.draft === true,
    image: data.image,
    keyPoints: Array.isArray(data.keyPoints) ? data.keyPoints : [],
    readingTime: readingTime(content).text,
  };
}

export function getEssay(slug: string): Essay | null {
  const filePath = path.join(ESSAYS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "",
    updated: data.updated,
    domain: data.domain ?? "general",
    tier: (data.tier as Tier) ?? "free",
    draft: data.draft === true,
    image: data.image,
    keyPoints: Array.isArray(data.keyPoints) ? data.keyPoints : [],
    readingTime: readingTime(content).text,
    content,
    sources: extractSources(content),
  };
}

// Every external link in the body, in order of first appearance, once
// per URL. Rendered as the numbered Sources list at the end of the essay
// and emitted as `citation` in the Article JSON-LD, so readers and
// answer engines see the same evidence.
const SELF_HOSTS = ["operator.codes", "www.operator.codes"];
export function extractSources(content: string): EssaySource[] {
  const seen = new Set<string>();
  const out: EssaySource[] = [];
  const re = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content))) {
    const url = m[2];
    let host = "";
    try {
      host = new URL(url).hostname.replace(/^www\./, "");
    } catch {
      continue;
    }
    if (SELF_HOSTS.includes(host) || seen.has(url)) continue;
    seen.add(url);
    out.push({ title: m[1].replace(/[*_`]/g, ""), url, host });
  }
  return out;
}

// For the weekly digest: essays published within [since, until]
// (both inclusive, ISO date strings, until defaults to today). Draft
// essays are already excluded by getAllEssays().
export function getEssaysBetween(since: string, until?: string): EssayMeta[] {
  const untilDate = until ?? new Date().toISOString().slice(0, 10);
  return getAllEssays().filter((e) => e.date >= since && e.date <= untilDate);
}
