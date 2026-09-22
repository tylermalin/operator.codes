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
  domain: string;
  tier: Tier;
  readingTime: string;
};

export type Essay = EssayMeta & { content: string };

function readSlugs(): string[] {
  if (!fs.existsSync(ESSAYS_DIR)) return [];
  return fs
    .readdirSync(ESSAYS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getAllEssays(): EssayMeta[] {
  return readSlugs()
    .map((slug) => getEssayMeta(slug))
    .filter((e): e is EssayMeta => e !== null)
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
    domain: data.domain ?? "general",
    tier: (data.tier as Tier) ?? "free",
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
    domain: data.domain ?? "general",
    tier: (data.tier as Tier) ?? "free",
    readingTime: readingTime(content).text,
    content,
  };
}
