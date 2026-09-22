import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <p className="font-mono text-sm text-muted mb-6">
        operator.codes / about
      </p>
      <h1 className="text-4xl sm:text-5xl font-normal tracking-tight mb-12">
        Tyler Malin
      </h1>
      <div className="prose-essay">
        <p>
          Twenty-plus years building at the intersection of technology,
          law, and markets. The thread connecting all of it: systems that
          people said couldn&apos;t work, and figuring out how to make them
          work anyway.
        </p>
        <p>
          Currently CEO and co-founder of Mālama Labs, a seed-stage dMRV
          platform replacing manual, episodic carbon verification with
          continuous, sensor-driven monitoring. The core thesis is that
          high-integrity carbon markets are a data infrastructure problem,
          not a standards problem.
        </p>
        <p>
          Creator of AgentCorp, a Delaware Series LLC protocol designed
          specifically for AI agents. As autonomous systems begin to hold
          assets, enter contracts, and generate revenue, they need legal
          infrastructure that matches their operating reality. AgentCorp is
          that infrastructure.
        </p>
        <p>
          Principal at Beneficial Technology, a legal engineering
          consultancy operating at the intersection of emerging technology,
          securities law, and regulatory frameworks. Background includes a
          CFTC regulatory fellowship and litigation at Cravath Swaine &amp;
          Moore.
        </p>
        <p>
          Prior exit: Idea Farmer (Inc. 500 #95, acquired by Zealot
          Networks). Co-founded ReSeed Carbon Assets ($4.6M raised). JD,
          Fordham Law School.
        </p>
        <p>
          Operator is the platform for everything that doesn&apos;t fit
          neatly inside any one company: analysis, frameworks, and
          experiments in AI systems, climate infrastructure, legal
          engineering, and protocol design.
        </p>
      </div>
    </div>
  );
}
