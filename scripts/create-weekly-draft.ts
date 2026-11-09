// Creates a DRAFT weekly-digest Broadcast in Resend. Never sends —
// review and click Send yourself in the Resend dashboard. That's the
// deliberate human checkpoint: "Top News and Insights" requires
// editorial judgment (picking real stories, writing real blurbs) that
// has no honest way to be fully automated, and nothing in this build
// auto-emails your list unsupervised.
//
// Usage: pnpm weekly:draft <path-to-input.json>
//
// input.json shape:
// {
//   "newsItems": [
//     { "title": "...", "url": "...", "source": "...", "blurb": "..." }
//   ],
//   "since": "2026-09-15",   // optional, defaults to 7 days ago
//   "until": "2026-09-22",   // optional, defaults to today
//   "subject": "..."          // optional, auto-generated if omitted
// }
//
// Workflow for filling that file in: ask Claude, in a chat session,
// to research the week's top stories across AI systems, climate
// infrastructure, legal engineering, and protocol design, and draft
// candidate items in your voice. Review, cut to the ones worth
// sending, save as this file, then run this script.

import fs from "fs";
import { Resend } from "resend";
import { getEssaysBetween } from "../lib/essays";
import { WeeklyDigest, type NewsItem } from "../components/emails/weekly-digest";

const apiKey = process.env.RESEND_API_KEY;
const segmentId = process.env.RESEND_SEGMENT_ID;
const fromAddress =
  process.env.RESEND_FROM_ADDRESS || "Operator <hello@operator.codes>";

if (!apiKey || !segmentId) {
  console.error(
    "Missing RESEND_API_KEY or RESEND_SEGMENT_ID. Run with --env-file=.env.local " +
      "(see package.json's weekly:draft script) or export them first.",
  );
  process.exit(1);
}

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: pnpm weekly:draft <path-to-input.json>");
  process.exit(1);
}

type Input = {
  newsItems: NewsItem[];
  since?: string;
  until?: string;
  subject?: string;
};

const input: Input = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10);
const since = input.since ?? sevenDaysAgo;
const until = input.until ?? new Date().toISOString().slice(0, 10);

const essaysInRange = getEssaysBetween(since, until).map((e) => ({
  title: e.title,
  description: e.description,
  url: `https://operator.codes/essays/${e.slug}`,
}));

const dateRangeLabel = `${since} — ${until}`;

const subject =
  input.subject ??
  (essaysInRange.length > 0
    ? `This week: ${essaysInRange[0].title}`
    : "This week's top news and insights");

async function main() {
  const client = new Resend(apiKey!);

  const { data, error } = await client.broadcasts.create({
    segmentId: segmentId!,
    from: fromAddress,
    subject,
    previewText:
      essaysInRange.length > 0
        ? `New: ${essaysInRange[0].title}`
        : "This week's top news and insights",
    // No unsubscribeUrl passed: Resend appends its own unsubscribe
    // link and List-Unsubscribe header to every Broadcast
    // automatically. It's mandatory and can't be removed, so a
    // second one from this template would just be a duplicate.
    react: WeeklyDigest({
      dateRangeLabel,
      essays: essaysInRange,
      newsItems: input.newsItems,
    }),
    send: false,
  });

  if (error) {
    console.error("Failed to create draft broadcast:", error);
    process.exit(1);
  }

  console.log(`Draft broadcast created: ${data?.id}`);
  console.log(
    `${essaysInRange.length} essay(s) in range, ${input.newsItems.length} news item(s).`,
  );
  console.log("Review and send from https://resend.com/broadcasts");
}

main();
