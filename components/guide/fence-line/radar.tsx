"use client";

import { useState } from "react";
import { CASES, SOURCES, type Lever } from "@/lib/guides/fence-line";
import { Cite } from "@/components/guide/kit";

const LEVERS: ("All" | Lever)[] = ["All", "Water", "Power", "Noise", "Process", "Tax"];

const STATUS_TONE: Record<string, string> = {
  Blocked: "text-red",
  Paused: "text-amber",
  Conditioned: "text-accent-light",
  Proposed: "text-muted",
};

// Resistance radar: verified cases where a host community or regulator
// stopped, paused, or conditioned a data center, filterable by the lever
// that moved it.
export default function Radar() {
  const [lever, setLever] = useState<(typeof LEVERS)[number]>("All");
  const cases = lever === "All" ? CASES : CASES.filter((c) => c.levers.includes(lever));

  return (
    <div>
      <div role="group" aria-label="Filter by lever" className="flex flex-wrap gap-2">
        {LEVERS.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLever(l)}
            aria-pressed={lever === l}
            className="chip h-8 px-3.5 text-sm"
          >
            {l}
          </button>
        ))}
      </div>
      <ul className="mt-6 divide-y divide-border border-y border-border">
        {cases.map((c) => (
          <li key={c.place} className="grid gap-3 py-6 md:grid-cols-[minmax(0,15rem)_1fr] md:gap-8">
            <div>
              <p className="type-meta">
                <span className={STATUS_TONE[c.status]}>{c.status}</span>
                <span className="mx-2 text-faint">·</span>
                {c.date}
              </p>
              <p className="type-title mt-2 text-[1.5rem]">{c.place}</p>
              <p className="mt-1 text-[15px] text-muted">{c.what}</p>
            </div>
            <ul className="space-y-2.5 text-[15px] leading-relaxed">
              {c.facts.map((f, i) => (
                <li key={i}>
                  {f.text}
                  <Cite registry={SOURCES} id={f.source} />
                </li>
              ))}
              <li className="type-meta pt-1">Levers: {c.levers.join(", ")}</li>
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
