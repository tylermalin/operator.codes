// Build gate: every published essay must have an `image` in frontmatter
// that exists under public/. Cards across the site use it as the
// thumbnail and social cards use it as the preview, so a missing image
// fails the build instead of shipping a broken card.
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
  console.error("Essay image check failed:\n  " + problems.join("\n  "));
  process.exit(1);
}
console.log("Essay image check passed.");
