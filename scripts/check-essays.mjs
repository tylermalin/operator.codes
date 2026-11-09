// Build gate for essay frontmatter:
// - `image` must exist under public/ and stay under 1 MB. Cards use it
//   as the thumbnail and social cards as the preview.
// - `keyPoints` must hold 2 to 4 sentences. They render as the "Key
//   points" block and the Article abstract, the part answer engines are
//   most likely to quote, so an essay can't ship without them.
//
// Runs before `next build` (see package.json). Drafts are checked too:
// they're one frontmatter flip from public.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const dir = path.join(process.cwd(), "content", "essays");
const problems = [];

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
  const { data } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
  const slug = file.replace(/\.mdx$/, "");
  const kp = data.keyPoints;
  if (!Array.isArray(kp) || kp.length < 2 || kp.length > 4) {
    problems.push(`${slug}: "keyPoints" needs 2 to 4 items`);
  } else if (kp.some((p) => typeof p !== "string" || p.length > 240)) {
    problems.push(`${slug}: each key point must be one sentence or two, under 240 characters`);
  }
  if (!data.image) {
    problems.push(`${slug}: no "image" in frontmatter`);
    continue;
  }
  const disk = path.join(process.cwd(), "public", data.image);
  if (!fs.existsSync(disk)) {
    problems.push(`${slug}: image ${data.image} not found in public/`);
    continue;
  }
  const kb = fs.statSync(disk).size / 1024;
  if (kb > 1024) {
    problems.push(`${slug}: image ${data.image} is ${Math.round(kb)} KB (limit 1024 KB)`);
  }
}

if (problems.length) {
  console.error("Essay check failed:\n  " + problems.join("\n  "));
  process.exit(1);
}
console.log("Essay check passed.");
