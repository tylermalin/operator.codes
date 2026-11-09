import type { Metadata } from "next";
import Image from "next/image";
import { AUTHOR, SITE_NAME, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Tyler Malin: founder of Beneficial Technology, creator of AgentCorp, co-founder of Mālama Labs, and former named partner at a New York labor law firm. Writes Operator.",
  alternates: { canonical: "/about" },
  openGraph: { type: "profile", url: "/about", images: [{ url: "/brand/tyler-malin.jpg", width: 768, height: 768 }] },
};

// This page is the entity record answer engines draw on for "who is
// Tyler Malin". Every line should be a fact that holds up, and the
// links below are the third-party profiles that corroborate it.
const LINKS = [
  { href: "https://beneficial.technology", label: "beneficial.technology" },
  { href: "https://www.agentscorp.xyz", label: "agentscorp.xyz" },
  { href: "https://malamalabs.com", label: "malamalabs.com" },
  { href: "https://x.com/tylermalin", label: "x.com/tylermalin" },
  { href: "https://github.com/tylermalin", label: "github.com/tylermalin" },
];

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: absoluteUrl("/about"),
    mainEntity: {
      "@type": "Person",
      name: AUTHOR.name,
      url: AUTHOR.url,
      image: absoluteUrl(AUTHOR.image),
      jobTitle: AUTHOR.jobTitle,
      sameAs: [
        ...AUTHOR.sameAs,
        "https://www.agentscorp.xyz",
        "https://malamalabs.com",
      ],
      alumniOf: { "@type": "CollegeOrUniversity", name: "Fordham University School of Law" },
      worksFor: { "@type": "Organization", name: "Beneficial Technology", url: "https://beneficial.technology" },
    },
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
  };

  return (
    <div className="mx-auto max-w-3xl px-5 pb-8 pt-16 sm:px-8 sm:pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mb-12 flex flex-col-reverse gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="type-meta mb-6">About</p>
          <h1 className="type-title text-[clamp(2.75rem,6vw,4.5rem)]">Tyler Malin</h1>
          <p className="type-dek mt-3">Founder, Beneficial Technology · Creator of AgentCorp</p>
        </div>
        <Image
          src={AUTHOR.image}
          alt="Tyler Malin"
          width={768}
          height={768}
          priority
          className="h-auto w-40 shrink-0 rounded-[14px] border border-border-md sm:w-52"
        />
      </div>
      <div className="prose-essay">
        <p>
          Twenty-plus years building at the intersection of technology,
          law, and markets. The thread connecting all of it: systems that
          people said couldn&apos;t work, and figuring out how to make them
          work anyway.
        </p>
        <p>
          Founder of Beneficial Technology, a legal engineering consultancy
          and venture studio operating at the intersection of emerging
          technology, securities law, and regulatory frameworks.
        </p>
        <p>
          Creator of AgentCorp, a Delaware Series LLC protocol designed
          specifically for AI agents. As autonomous systems begin to hold
          assets, enter contracts, and generate revenue, they need legal
          infrastructure that matches their operating reality. AgentCorp is
          that infrastructure.
        </p>
        <p>
          Co-founder of Mālama Labs, a dMRV platform replacing manual,
          episodic carbon verification with continuous, sensor-driven
          monitoring. The core thesis is that high-integrity carbon markets
          are a data infrastructure problem, not a standards problem.
        </p>
        <p>
          Started in litigation at one of the largest law firms in the
          world, then clerked at the CFTC on energy and FX market
          litigation and investigations. Moved to a small New York labor
          law firm, grew the business, and became named partner in under
          five years, leading ERISA litigation and building an audit
          practice that recovered more than $1.5M in unpaid employer
          contributions in two years.
        </p>
        <p>
          Prior exit: Idea Farmer (Inc. 500 #95, acquired by Zealot
          Networks). Co-founded ReSeed Carbon Assets ($4.6M raised). Author
          of <em>The Latent Commons</em>. JD, Fordham Law School.
        </p>
        <p>
          Operator is the platform for everything that doesn&apos;t fit
          neatly inside any one company: analysis, frameworks, and
          experiments in AI systems, climate infrastructure, legal
          engineering, and protocol design.
        </p>
        <p className="font-mono text-sm">
          {LINKS.map((l, i) => (
            <span key={l.href}>
              {i > 0 && " · "}
              <a href={l.href} rel="me">
                {l.label}
              </a>
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
