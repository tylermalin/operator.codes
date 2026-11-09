import type { Metadata } from "next";
import Link from "next/link";
import { SOURCES, CASES } from "@/lib/guides/fence-line";
import { AUTHOR, SITE_NAME, absoluteUrl } from "@/lib/site";
import { Cite, Section, Sources, Stat, ToolFrame } from "@/components/guide/kit";
import Radar from "@/components/guide/fence-line/radar";
import Envelope from "@/components/guide/fence-line/envelope";
import Delay from "@/components/guide/fence-line/delay";
import Structures from "@/components/guide/fence-line/structures";

const TITLE = "The Fence Line";
const DEK =
  "A field guide for host communities, developers, and funds: where data center fights are happening, what they cost, and how to govern the property line instead of the server room.";
const UPDATED = "2026-11-09";
const PATH = "/guides/own-what-you-host";

export const metadata: Metadata = {
  title: `${TITLE}: hosting hyperscale data centers`,
  description: DEK,
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    url: PATH,
    title: TITLE,
    description: DEK,
    images: [{ url: "/images/essays/own-what-you-host/hero.jpg" }],
  },
};

const TOC = [
  ["pressure", "The pressure"],
  ["radar", "Resistance radar"],
  ["delay", "Delay vs. mitigation"],
  ["envelope", "Boundary envelope"],
  ["structures", "Who decides"],
  ["sources", "Sources"],
] as const;

export default function FenceLineGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    description: DEK,
    datePublished: UPDATED,
    dateModified: UPDATED,
    url: absoluteUrl(PATH),
    author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
    publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
    citation: Object.values(SOURCES).map((s) => s.url),
  };

  return (
    <article className="mx-auto max-w-6xl px-5 pb-8 pt-14 sm:px-8 sm:pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <header className="mx-auto max-w-3xl text-center">
        <p className="type-meta">
          Field guide <span className="text-faint">in</span>{" "}
          <Link href="/essays?topic=climate-infrastructure" className="link-underline text-foreground/85">
            Climate infrastructure
          </Link>
        </p>
        <h1 className="type-title mt-5 text-[clamp(3rem,8vw,5.5rem)]">{TITLE}</h1>
        <p className="type-dek mx-auto mt-5 max-w-[56ch]">{DEK}</p>
        <p className="type-meta mt-6">
          <Link href="/about" rel="author" className="link-underline text-foreground">
            {AUTHOR.name}
          </Link>
          <span className="mx-2 text-faint">·</span>
          Updated Nov 9, 2026
          <span className="mx-2 text-faint">·</span>
          {Object.keys(SOURCES).length} sources · 4 tools
        </p>
        <p className="mt-6 text-[15px] text-muted">
          Companion to the essay{" "}
          <Link href="/essays/own-what-you-host" className="link-underline text-foreground">
            Own What You Host
          </Link>
          .
        </p>
      </header>

      <nav aria-label="On this page" className="mx-auto mt-12 max-w-3xl border-y border-border py-4">
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[14px] text-muted">
          {TOC.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className="link-underline hover:text-foreground">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-16 space-y-24">
        <Section
          id="pressure"
          n="01"
          label="The pressure"
          title="Demand is real, and the grid and the river are already feeling it."
          dek={
            <>
              The fights on this page are not about whether data centers get built. They are about who carries the
              cost at the fence line when they do.
            </>
          }
        >
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            <Stat registry={SOURCES} source="lbnl-2024" value="4.4%" label="of US electricity used by data centers in 2023 (176 TWh)" />
            <Stat registry={SOURCES} source="lbnl-2024" value="6.7–12%" label="projected share by 2028 (325 to 580 TWh)" />
            <Stat registry={SOURCES} source="pjm-bra-2728" value="$333.44" label="per MW-day: PJM's 2027/28 capacity price, at the cap, 6,623 MW short of target" />
            <Stat registry={SOURCES} source="icprb-water" value="12%" label="of summer consumptive water use in the Washington region goes to data centers" />
          </div>
          <p className="mt-10 max-w-[64ch] text-[16px] leading-relaxed text-foreground/90">
            PJM attributes nearly 5,100 MW of its latest peak-load forecast increase to data centers
            <Cite registry={SOURCES} id="pjm-bra-2728" />. In the Potomac basin, summer data center water use runs near
            three times the annual average and peak days near ten times, landing exactly when river flows are lowest
            <Cite registry={SOURCES} id="icprb-water" />.
          </p>
        </Section>

        <Section
          id="radar"
          n="02"
          label="Resistance radar"
          title="Where host communities and regulators have said no, or not yet."
          dek={`${CASES.length} verified cases. Filter by the lever that moved them.`}
        >
          <Radar />
        </Section>

        <Section
          id="delay"
          n="03"
          label="Tool · Delay vs. mitigation"
          title="What a fight costs the capital side."
          dek="Set the project, the capital at risk, and the delay. Compare it with the community package that might have avoided the fight."
        >
          <ToolFrame label="Delay vs. mitigation calculator">
            <Delay />
          </ToolFrame>
        </Section>

        <Section
          id="envelope"
          n="04"
          label="Tool · Boundary envelope"
          title="Govern the property line, not the server room."
          dek="Set the limits where the facility touches its neighbors. Get draft covenant language and the monitoring that makes it enforceable."
        >
          <ToolFrame label="Boundary envelope builder">
            <Envelope />
          </ToolFrame>
        </Section>

        <Section
          id="structures"
          n="05"
          label="Tool · Who decides"
          title="Same pressure, three structures, three different answers."
          dek="Pick a situation. See who holds the decision under a standard deal, under public ownership, and under split rights."
        >
          <ToolFrame label="Decision rights comparison">
            <Structures />
          </ToolFrame>
        </Section>

        <Sources registry={SOURCES} accessed="Nov 9, 2026" />
      </div>
    </article>
  );
}
