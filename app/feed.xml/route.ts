import { getAllEssays } from "@/lib/essays";
import { AUTHOR, SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/site";

// RSS 2.0 feed of published essays. Readers, aggregators, and some
// answer engines discover new posts through feeds faster than through
// a sitemap recrawl.

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rfc822(date: string): string {
  return new Date(`${date}T12:00:00Z`).toUTCString();
}

export function GET() {
  const essays = getAllEssays();
  const items = essays
    .map((e) => {
      const url = absoluteUrl(`/essays/${e.slug}`);
      return `    <item>
      <title>${esc(e.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(e.date)}</pubDate>
      <dc:creator>${esc(AUTHOR.name)}</dc:creator>
      <category>${esc(e.domain)}</category>
      <description>${esc(e.description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(SITE_NAME)} · ${esc(AUTHOR.name)}</title>
    <link>${absoluteUrl("/")}</link>
    <description>${esc(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml"/>
${essays[0] ? `    <lastBuildDate>${rfc822(essays[0].date)}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
