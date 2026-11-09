import type { Metadata } from "next";
import Link from "next/link";
import { AUTHOR, SITE_NAME, absoluteUrl } from "@/lib/site";

// The page answer engines and careful readers both look for before they
// trust a source: how claims get checked, what was wrong and fixed, and
// who the author has a stake in. Keep it short and keep it true. Add a
// correction here the same day an essay is corrected.

const UPDATED = "2026-11-09";

export const metadata: Metadata = {
  title: "Editorial standards and corrections",
  description:
    "How Operator sources and checks its claims, every correction made to a published essay, how AI tools are used, and the author's conflicts of interest.",
  alternates: { canonical: "/standards" },
};

type Correction = { date: string; essay: string; slug: string; text: string };

const CORRECTIONS: Correction[] = [
  {
    date: "2026-11-09",
    essay: "Own What You Host",
    slug: "own-what-you-host",
    text: "The essay credited the e-corporation structure to a group of Stanford economists. It was designed by Tyler Malin and Jamie Daves at Everyone, Inc., and is called the E-Corp. The passage now says so.",
  },
  {
    date: "2026-11-09",
    essay: "Your Agent Can Sign. You're the One Bound.",
    slug: "agent-can-sign",
    text: "The earlier version described the Delaware series liability shield without the three conditions in § 18-215(b) that it depends on, and did not state California's per-series tax. The redraft adds both, with sources, along with Delaware's 2026 fee change under HB 400.",
  },
];

const RULES = [
  ["Every figure links to its source.", "A number, date, or named finding in an essay links to the primary document it came from: the statute, filing, dataset, or study. Field guides attach a source to every stat."],
  ["Every source is opened before it is cited.", "Summaries from other writers and drafts from AI tools are treated as leads. A claim is used only after the original has been read and says what the essay says it does."],
  ["Inputs are labeled as inputs.", "Calculator defaults are examples, not market data, and the tools say so. Formulas are shown."],
  ["Argument is labeled as argument.", "Where a tool or section encodes an Operator framework rather than established practice, the text says so."],
  ["Dates are explicit.", "Essays show when they were published and when they were last updated. Time-sensitive facts carry the date they were checked."],
  ["Nothing here is legal, tax, or investment advice.", "Essays explain how systems work. Your situation needs your own counsel."],
] as const;

const CONFLICTS = [
  { name: "AgentCorp", href: "https://www.agentscorp.xyz", text: "Tyler Malin is building AgentCorp, which forms Delaware series LLC structures for AI agents. Relevant to essays on agent liability and legal entities." },
  { name: "Mālama Labs", href: "https://malamalabs.com", text: "Co-founder. Mālama Labs works on verified physical-world environmental data. Relevant to essays on carbon markets and climate infrastructure." },
  { name: "Beneficial Technology", href: "https://beneficial.technology", text: "Founder. A legal engineering consultancy and venture studio. Relevant to essays on legal engineering and capital markets." },
];

export default function StandardsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: absoluteUrl("/standards"),
    name: `Editorial standards · ${SITE_NAME}`,
    dateModified: UPDATED,
    about: { "@id": `${absoluteUrl("/")}#organization` },
    author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
  };

  return (
    <div className="mx-auto max-w-3xl px-5 pb-8 pt-16 sm:px-8 sm:pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <p className="type-meta">Standards</p>
      <h1 className="type-title mt-5 text-[clamp(2.75rem,6vw,4.5rem)]">How Operator checks its claims</h1>
      <p className="type-dek mt-5 max-w-[52ch]">
        The rules every essay and field guide follows, every correction made after publishing, and what the author
        has a stake in. Updated Nov 9, 2026.
      </p>

      <section aria-labelledby="sourcing" className="mt-14">
        <h2 id="sourcing" className="type-title text-[32px]">Sourcing</h2>
        <ol className="mt-6 space-y-6">
          {RULES.map(([head, body], i) => (
            <li key={head} className="grid grid-cols-[2rem_1fr] gap-x-2">
              <span className="type-meta pt-1.5 text-faint">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-serif text-[21px] leading-snug text-foreground">{head}</p>
                <p className="mt-1.5 text-[16px] leading-relaxed text-muted">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="corrections" className="mt-16 border-t border-border pt-10">
        <h2 id="corrections" className="type-title text-[32px]">Corrections</h2>
        <p className="mt-4 text-[16px] leading-relaxed text-muted">
          When a published essay gets a fact wrong, the fix is made in the essay, its updated date changes, and the
          correction is listed here. To report an error, email{" "}
          <a href="mailto:corrections@operator.codes" className="link-underline text-foreground">
            corrections@operator.codes
          </a>{" "}
          with the essay and the source that shows it.
        </p>
        <ul className="mt-8 space-y-7">
          {CORRECTIONS.map((c) => (
            <li key={c.slug + c.date} className="border-l-2 border-border-md pl-5">
              <p className="type-meta">
                <time dateTime={c.date}>Nov 9, 2026</time>
                <span className="text-faint"> · </span>
                <Link href={`/essays/${c.slug}`} className="link-underline text-foreground/85">
                  {c.essay}
                </Link>
              </p>
              <p className="mt-2 text-[16px] leading-relaxed text-foreground/90">{c.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ai-use" className="mt-16 border-t border-border pt-10">
        <h2 id="ai-use" className="type-title text-[32px]">How AI tools are used</h2>
        <p className="mt-4 text-[16px] leading-relaxed text-foreground/90">
          AI tools, including Claude, help with research, drafting, and building the interactive tools. They do not
          decide what gets published. Every factual claim is checked against its original source before it runs, and
          AI-suggested sources that could not be found or did not say what was claimed are dropped. The arguments
          and the responsibility for every claim are Tyler Malin&apos;s.
        </p>
      </section>

      <section aria-labelledby="conflicts" className="mt-16 border-t border-border pt-10">
        <h2 id="conflicts" className="type-title text-[32px]">Interests</h2>
        <p className="mt-4 text-[16px] leading-relaxed text-muted">
          Tyler Malin writes about fields he works in. Essays that touch one of these companies say so at the top.
        </p>
        <ul className="mt-6 space-y-5">
          {CONFLICTS.map((c) => (
            <li key={c.name}>
              <a href={c.href} className="link-underline font-serif text-[21px] text-foreground" rel="noopener">
                {c.name}
              </a>
              <p className="mt-1 text-[16px] leading-relaxed text-muted">{c.text}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-[15px] text-muted">
          More about the author on the <Link href="/about" className="link-underline text-foreground">about page</Link>.
        </p>
      </section>
    </div>
  );
}
