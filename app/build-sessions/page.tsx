import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build Sessions",
  description:
    "A recorded format where founders and builders work with Tyler Malin live to architect real systems. No budget required.",
};

const steps = [
  {
    n: "01",
    title: "Apply with a real problem",
    body: "A system you need built, a structure you need designed, a workflow that doesn't exist. Not an idea. Applications are screened for specificity and fit.",
  },
  {
    n: "02",
    title: "Build it live together",
    body: "Recorded session. Real decisions made in real time. Architecture, tradeoffs, and reasoning visible throughout. No script, no polish.",
  },
  {
    n: "03",
    title: "Leave with a working system",
    body: "Code, a deployed prototype, or a structured framework. Not a slide deck. The session publishes publicly. You retain your IP.",
  },
];

const domains = [
  {
    title: "AI systems & agent design",
    body: "Agentic workflows, MCP integrations, eval pipelines, AI-assisted operations, AgentCorp entity structures, LLM orchestration.",
  },
  {
    title: "Climate & carbon infrastructure",
    body: "dMRV pipeline design, registry strategy, permanence modeling, continuous verification, carbon asset structuring.",
  },
  {
    title: "Legal & entity engineering",
    body: "Series LLC design, token structure, protocol governance, regulatory framing.",
  },
];

export default function BuildSessionsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      <p className="font-mono text-sm text-muted mb-6">
        operator.codes / build sessions
      </p>
      <h1 className="text-4xl sm:text-5xl font-normal tracking-tight max-w-2xl leading-[1.1] mb-7">
        Real problems. Live systems. No budget required.
      </h1>
      <p className="text-muted max-w-xl mb-10 text-lg leading-relaxed">
        A recorded session format where builders, founders, and creators
        work with Tyler to architect and ship real systems live. If you
        have a real problem, we build the solution on record.
      </p>
      <Link
        href="/apply"
        className="btn-primary inline-block rounded-full px-6 py-3 text-sm font-medium"
      >
        Apply for a session
      </Link>

      <div className="grid sm:grid-cols-3 gap-10 mt-28">
        {steps.map((step) => (
          <div key={step.n}>
            <p className="font-mono text-xs text-faint mb-3">{step.n}</p>
            <h3 className="font-medium mb-2">{step.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{step.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-28 border-t border-border pt-14">
        <h2 className="font-mono text-sm text-muted mb-10">Domains</h2>
        <div className="grid sm:grid-cols-3 gap-10">
          {domains.map((d) => (
            <div key={d.title}>
              <h3 className="font-medium mb-2">{d.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{d.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
