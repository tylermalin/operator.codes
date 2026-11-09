"use client";

import { useState } from "react";
import { SOURCES } from "@/lib/guides/fence-line";
import { Cite, Note } from "@/components/guide/kit";

// Who decides? Pick a real-world pressure point and see how each deal
// structure answers it. This is the essay's framework, labeled as
// analysis, not a survey of existing deals.

const STRUCTURES = ["Standard deal + CBA", "Public ownership", "Split rights (Class A / B)"] as const;

const SCENARIOS: { q: string; a: [string, string, string] }[] = [
  {
    q: "A drought summer. The plant wants 20% more potable water for cooling.",
    a: [
      "The operator decides. The community's recourse is whatever the zoning approval and the benefits agreement said, enforced by lawsuit.",
      "The public owner decides, under political pressure from both residents and the utility's budget.",
      "The water cap is a covenant the Class B holder controls. The operator can switch to reclaimed water or dial back load without asking; exceeding the cap needs Class B consent.",
    ],
  },
  {
    q: "The operator wants to add a second building.",
    a: [
      "A new rezoning fight at the county council, with the outcome uncertain for both sides.",
      "A legislative or bond approval, on the public calendar.",
      "Class B consent is needed only if a boundary limit is in breach. Otherwise the expansion is the operator's call, inside the existing envelope.",
    ],
  },
  {
    q: "Engineers want to change the server cooling design.",
    a: [
      "The operator decides.",
      "Board oversight can reach inside the walls, which lenders price as risk.",
      "The operator decides. The community governs the fence line, not the racks.",
    ],
  },
  {
    q: "The cash flows and depreciation.",
    a: [
      "All to the fund. The community gets the benefits agreement.",
      "Public, financed with public debt.",
      "All to Class A investors. Class B holds governance rights, not economics.",
    ],
  },
];

export default function Structures() {
  const [s, setS] = useState(0);
  const scenario = SCENARIOS[s];

  return (
    <div>
      <div role="group" aria-label="Pick a situation" className="flex flex-col gap-2">
        {SCENARIOS.map((x, i) => (
          <button
            key={i}
            type="button"
            aria-pressed={s === i}
            onClick={() => setS(i)}
            className={`rounded-xl border px-4 py-3 text-left text-[15px] transition-colors ${
              s === i
                ? "border-foreground bg-foreground text-background"
                : "border-border-md bg-surface hover:border-border-hi"
            }`}
          >
            {x.q}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {STRUCTURES.map((name, i) => (
          <div
            key={name}
            className={`rounded-xl border p-5 ${i === 2 ? "border-border-hi bg-surface-2" : "border-border bg-surface"}`}
          >
            <p className="type-meta text-foreground">{name}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">{scenario.a[i]}</p>
          </div>
        ))}
      </div>
      <Note>
        Framework from the essay, not a survey of deals in operation; no data center uses this structure yet that
        we know of. The legal footing is ordinary: Delaware lets a corporation issue classes of stock with full,
        limited, or no voting powers and their own special rights
        <Cite registry={SOURCES} id="dgcl-151" />, which is how dual-class companies already separate control
        from economics.
      </Note>
    </div>
  );
}
