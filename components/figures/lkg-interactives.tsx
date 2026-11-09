"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

// Interactives for "Law Firm AI Has a Links Problem".
// None of these tools carry market data. The hop counter and the pilot
// plan encode the essay's framework and say so. The wall filter is
// arithmetic on the reader's own inputs, with the formula shown.

function Frame({ label, children, kind = "Interactive" }: { label: string; children: ReactNode; kind?: string }) {
  return (
    <div className="not-prose my-12 rounded-[14px] border border-border-md bg-surface">
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3 sm:px-6">
        <span className="type-meta text-foreground">{label}</span>
        <span className="type-meta shrink-0">{kind}</span>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

function Slider(p: {
  label: string;
  value: number;
  set: (n: number) => void;
  min: number;
  max: number;
  step: number;
  fmt: (n: number) => string;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3 text-[13px] text-muted">
        {p.label}
        <span className="text-[15px] tabular-nums text-foreground">{p.fmt(p.value)}</span>
      </span>
      <input
        type="range"
        min={p.min}
        max={p.max}
        step={p.step}
        value={p.value}
        onChange={(e) => p.set(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--foreground)]"
      />
    </label>
  );
}

function Chips<T extends string>({
  options,
  value,
  set,
  label,
}: {
  options: { id: T; label: string }[];
  value: T;
  set: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o.id} type="button" aria-pressed={value === o.id} onClick={() => set(o.id)} className="chip h-9 px-4 text-[14px]">
          {o.label}
        </button>
      ))}
    </div>
  );
}

const Note = ({ children }: { children: ReactNode }) => (
  <p className="mt-5 border-t border-border pt-4 text-[13px] leading-relaxed text-muted">{children}</p>
);

/* ------------------------------------------------------------------ */
/* 1. How many joins is your question?                                 */
/* ------------------------------------------------------------------ */

type FacetId = "clause" | "variance" | "law" | "practice" | "dates" | "executed" | "client" | "partner" | "counsel";

const FACETS: { id: FacetId; label: string; lives: string; inClause: boolean; match?: string; where?: string }[] = [
  { id: "clause", label: "Clause type", lives: "The clause text itself", inClause: true },
  { id: "variance", label: "Departs from our standard", lives: "A comparison against the firm's precedent", inClause: false, where: "c.deviation > $threshold" },
  { id: "law", label: "Governing law", lives: "The boilerplate, often dozens of pages away", inClause: false, match: "MATCH (d)-[:GOVERNED_BY]->(:Jurisdiction {code: $law})" },
  { id: "practice", label: "Practice group", lives: "The matter intake record", inClause: false, match: "MATCH (m)-[:IN_PRACTICE]->(:PracticeArea {name: $practice})" },
  { id: "dates", label: "Date window", lives: "Matter and execution metadata", inClause: false, where: "m.closed_on >= $from AND m.closed_on <= $to" },
  { id: "executed", label: "Signed version only", lives: "The DMS version history", inClause: false, where: "d.is_executed = true" },
  { id: "client", label: "Client", lives: "The matter intake record", inClause: false, match: "MATCH (:Client {id: $client})-[:RETAINS_FOR]->(m)" },
  { id: "partner", label: "Partner who approved it", lives: "Staffing and billing records", inClause: false, match: "MATCH (p:Person)-[:APPROVED]->(d)" },
  { id: "counsel", label: "Opposing counsel", lives: "Signature pages, cover emails, matter parties", inClause: false, match: "MATCH (m)-[:OPPOSED_BY]->(oc:Firm)" },
];

const PRESETS: { id: string; label: string; q: string; on: FacetId[] }[] = [
  {
    id: "carveouts",
    label: "Carve-outs",
    q: "Find our non-standard non-solicit carve-outs in Delaware tech M&A deals from 2023 to 2025, who approved them, and who sat across the table.",
    on: ["clause", "variance", "law", "practice", "dates", "executed", "partner", "counsel"],
  },
  {
    id: "onboard",
    label: "Lateral onboarding",
    q: "Brief me on everything we've signed for this client: the executed agreements, what we conceded, and who led each deal.",
    on: ["client", "executed", "variance", "partner"],
  },
  {
    id: "expert",
    label: "Who has done this",
    q: "Who in the firm has actually negotiated equity warrants in private credit deals under German law?",
    on: ["clause", "law", "practice", "executed", "partner"],
  },
];

export function HopCounter() {
  const [preset, setPreset] = useState("carveouts");
  const [on, setOn] = useState<Set<FacetId>>(new Set(PRESETS[0].on));

  function pick(id: string) {
    const p = PRESETS.find((x) => x.id === id)!;
    setPreset(id);
    setOn(new Set(p.on));
  }
  function toggle(id: FacetId) {
    setPreset("custom");
    setOn((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  const chosen = FACETS.filter((f) => on.has(f.id));
  const outside = chosen.filter((f) => !f.inClause).length;
  const joins = Math.max(chosen.length - 1, 0);
  const q = PRESETS.find((p) => p.id === preset)?.q;

  const cypher = useMemo(() => {
    const lines = [
      on.has("clause")
        ? "MATCH (m:Matter)-[:PRODUCED]->(d:Document)-[:CONTAINS]->(c:Clause {type: $clause})"
        : "MATCH (m:Matter)-[:PRODUCED]->(d:Document)",
    ];
    const wheres: string[] = [];
    for (const f of FACETS) {
      if (!on.has(f.id)) continue;
      if (f.match) lines.push(f.match);
      if (f.where && (f.id !== "variance" || on.has("clause"))) wheres.push(f.where);
    }
    if (wheres.length) lines.push(`WHERE ${wheres.join("\n  AND ")}`);
    lines.push("RETURN m.title, d.dms_uri" + (on.has("clause") ? ", c.text" : "") + (on.has("partner") ? ", p.name" : "") + (on.has("counsel") ? ", oc.name" : ""));
    return lines.join("\n");
  }, [on]);

  const verdict =
    chosen.length === 0
      ? "Pick at least one fact the answer has to satisfy."
      : outside === 0
        ? "Everything this question needs sits in the clause text. Plain search can answer it."
        : outside === 1
          ? "One fact lives outside the clause text. Search with good metadata filters can still cope."
          : `${outside} of the ${chosen.length} facts live outside the clause text. A retriever that returns passages has to get lucky ${outside} times. A graph joins them.`;

  return (
    <Frame label="How many joins is your question?" kind="Framework">
      <Chips
        label="Example question"
        value={preset}
        set={pick}
        options={[...PRESETS.map((p) => ({ id: p.id, label: p.label })), ...(preset === "custom" ? [{ id: "custom", label: "Your own" }] : [])]}
      />
      {q && <p className="mt-4 font-serif text-[19px] leading-snug text-foreground">&ldquo;{q}&rdquo;</p>}

      <p className="mt-6 text-[13px] text-muted">Facts the answer has to satisfy. Toggle to build your own question.</p>
      <ul className="mt-2 divide-y divide-border">
        {FACETS.map((f) => (
          <li key={f.id}>
            <label className="flex cursor-pointer items-start gap-3 py-2.5 text-[15px] leading-snug">
              <input type="checkbox" checked={on.has(f.id)} onChange={() => toggle(f.id)} className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--foreground)]" />
              <span className="flex-1">
                {f.label}
                <span className="block text-[13px] text-muted">Lives in: {f.lives}</span>
              </span>
              {on.has(f.id) && (
                <span className={`type-meta shrink-0 ${f.inClause ? "text-faint" : "text-amber"}`}>{f.inClause ? "In the text" : "Elsewhere"}</span>
              )}
            </label>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="type-meta">Facts</p>
          <p className="font-serif text-[40px] leading-none tabular-nums">{chosen.length}</p>
        </div>
        <div>
          <p className="type-meta">Outside the clause</p>
          <p className="font-serif text-[40px] leading-none tabular-nums">{outside}</p>
        </div>
        <div>
          <p className="type-meta">Joins</p>
          <p className="font-serif text-[40px] leading-none tabular-nums">{joins}</p>
        </div>
      </div>
      <p className="mt-4 text-[16px] leading-relaxed text-foreground/90">{verdict}</p>

      <details className="mt-5 rounded-[10px] border border-border bg-background/40">
        <summary className="cursor-pointer px-4 py-3 text-[14px] text-muted">The same question as a graph query</summary>
        <pre className="overflow-x-auto px-4 pb-4 font-mono text-[12.5px] leading-relaxed text-foreground/85">{cypher}</pre>
      </details>

      <Note>
        Framework, not a benchmark. Where each fact lives depends on your firm&apos;s systems; the point is the count. Every
        fact outside the passage is a join that passage retrieval cannot see and a graph makes explicit. The query uses
        illustrative names, and it runs only over nodes the asking lawyer is cleared to see.
      </Note>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Filter before or after?                                          */
/* ------------------------------------------------------------------ */

export function WallFilter() {
  const [walled, setWalled] = useState(10);
  const [boost, setBoost] = useState(2);
  const [k, setK] = useState(20);

  const w = walled / 100;
  const p = (w * boost) / (w * boost + (1 - w)); // share of top-k that is walled
  const touched = k * p;
  const kept = k - touched;
  const slots = Array.from({ length: k }, (_, i) => Math.floor((i + 1) * p) > Math.floor(i * p));

  const f1 = (n: number) => (Math.round(n * 10) / 10).toString();

  return (
    <Frame label="Filter before or after?">
      <div className="grid gap-5 sm:grid-cols-3">
        <Slider label="Documents behind a wall for this lawyer" value={walled} set={setWalled} min={1} max={40} step={1} fmt={(n) => `${n}%`} />
        <Slider label="How relevant walled matters are" value={boost} set={setBoost} min={1} max={4} step={0.5} fmt={(n) => `${n}×`} />
        <Slider label="Results retrieved (top k)" value={k} set={setK} min={5} max={50} step={5} fmt={(n) => `${n}`} />
      </div>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div>
          <p className="type-meta text-foreground">Filter after retrieval</p>
          <div className="mt-3 flex flex-wrap gap-1" aria-hidden>
            {slots.map((x, i) => (
              <span key={i} className={`h-5 w-3 rounded-[3px] ${x ? "bg-amber" : "bg-foreground/70"}`} />
            ))}
          </div>
          <dl className="mt-4 space-y-1.5 text-[15px]">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Walled documents the pipeline read</dt>
              <dd className="tabular-nums text-amber">{f1(touched)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Usable results left</dt>
              <dd className="tabular-nums">{f1(kept)} of {k}</dd>
            </div>
          </dl>
        </div>
        <div>
          <p className="type-meta text-foreground">Filter during traversal</p>
          <div className="mt-3 flex flex-wrap gap-1" aria-hidden>
            {Array.from({ length: k }, (_, i) => (
              <span key={i} className="h-5 w-3 rounded-[3px] bg-foreground/70" />
            ))}
          </div>
          <dl className="mt-4 space-y-1.5 text-[15px]">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Walled documents the pipeline read</dt>
              <dd className="tabular-nums">0</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Usable results left</dt>
              <dd className="tabular-nums">{k} of {k}</dd>
            </div>
          </dl>
        </div>
      </div>

      <p className="mt-6 text-[16px] leading-relaxed text-foreground/90">
        {boost > 1
          ? `Walled matters are ${walled}% of the corpus but ${Math.round(p * 100)}% of what the search ranks highest. The wall exists because those matters are close to this one.`
          : `Walled matters take ${Math.round(p * 100)}% of the top results. Every one of them was read by the pipeline before it was dropped.`}{" "}
        Each document read and then dropped has already passed through a reranker, a cache, a log, or a prompt. Those are the
        disclosure paths ABA Formal Opinion 512 warns about.
      </p>

      <Note>
        Your inputs, simple math: share of top k behind a wall = w·b / (w·b + 1 − w), where w is the walled share of the
        corpus and b is how much more relevant walled matters are. Assumes walled documents are spread evenly through the
        ranking.
      </Note>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 3. One practice group, hard dates                                   */
/* ------------------------------------------------------------------ */

const KEY = "lkg-pilot-v1";

const GROUPS = [
  { id: "debt", label: "Debt finance" },
  { id: "ma", label: "M&A" },
  { id: "re", label: "Real estate leasing" },
  { id: "lit", label: "Commercial litigation" },
] as const;
type Group = (typeof GROUPS)[number]["id"];

const STAGES: { id: string; name: string; from: number; to: number; items: string[] }[] = [
  {
    id: "s1",
    name: "Scope and schema",
    from: 1,
    to: 4,
    items: [
      "Name a practice group leader and a knowledge lawyer as owners",
      "Fix five node types: client, matter, document, clause, person",
      "Agree 10 to 15 clause types the group actually negotiates",
      "Draft the golden set: partner questions with partner-approved answers",
    ],
  },
  {
    id: "s2",
    name: "Connect and secure",
    from: 5,
    to: 10,
    items: [
      "Read-only connection to the DMS with a service account",
      "Permissions synced from the DMS on every change, never copied by hand",
      "Every active ethical screen loaded as a hard path break",
      "Executed documents ingested from the history window, drafts flagged",
    ],
  },
  {
    id: "s3",
    name: "Validate",
    from: 11,
    to: 14,
    items: [
      "Run the full golden set and score every answer",
      "Run adversarial queries across each active screen",
      "Trace every sentence of every answer to a source document",
    ],
  },
];

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + n);
  return x;
}
function nextMonday(from: Date) {
  const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  const add = (8 - d.getUTCDay()) % 7 || 7;
  return addDays(d, add);
}
const fmt = (d: Date) =>
  d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export function PilotPlan() {
  const [group, setGroup] = useState<Group>("debt");
  const [start, setStart] = useState("2026-11-16");
  const [golden, setGolden] = useState(50);
  const [recall, setRecall] = useState(90);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  // Restore saved progress after hydration, deferred a tick so the first
  // client render matches the server's.
  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(KEY);
    } catch {
      /* storage unavailable */
    }
    if (!raw) return;
    const t = setTimeout(() => setDone(JSON.parse(raw) as Record<string, boolean>), 0);
    return () => clearTimeout(t);
  }, []);

  function toggle(id: string) {
    setDone((d) => {
      const next = { ...d, [id]: !d[id] };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }

  const s0 = useMemo(() => {
    const parsed = new Date(`${start}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime())) return nextMonday(new Date());
    const day = parsed.getUTCDay();
    return day === 1 ? parsed : nextMonday(parsed);
  }, [start]);

  const weekStart = (w: number) => addDays(s0, (w - 1) * 7);
  const weekEnd = (w: number) => addDays(s0, (w - 1) * 7 + 4);
  const decision = weekEnd(16);
  const groupLabel = GROUPS.find((g) => g.id === group)!.label;

  const rules = [
    `Wall leakage: zero. One walled document in any answer's context stops the pilot until the cause is fixed.`,
    `Attribution: 100%. Every sentence in every golden answer traces to a specific document.`,
    `Recall: at least ${recall}% of the precedents partners expected to see.`,
  ];

  const all = STAGES.flatMap((s) => s.items.map((t, i) => ({ id: `${s.id}-${i}`, t })));
  const count = all.filter((x) => done[x.id]).length;

  const text = [
    `Legal knowledge graph pilot: ${groupLabel}`,
    ...STAGES.map((s) => `\n${s.name} (${fmt(weekStart(s.from))} to ${fmt(weekEnd(s.to))})\n${s.items.map((i) => `- ${i}`).join("\n")}`),
    `\nGolden set: ${golden} questions`,
    `\nGo / no-go: ${fmt(decision)}\n${rules.map((r) => `- ${r}`).join("\n")}`,
    `\nFrom "Law Firm AI Has a Links Problem", https://operator.codes/essays/law-firm-knowledge-graph`,
  ].join("\n");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <Frame label={`Pilot plan · ${count} of ${all.length}`} kind="Framework">
      <Chips label="Practice group" value={group} set={setGroup} options={GROUPS.map((g) => ({ id: g.id, label: g.label }))} />
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <label className="block">
          <span className="text-[13px] text-muted">Start (moves to a Monday)</span>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="mt-2 h-10 w-full rounded-[10px] border border-border-md bg-background px-3 text-[15px] text-foreground"
          />
        </label>
        <Slider label="Golden set questions" value={golden} set={setGolden} min={20} max={100} step={10} fmt={(n) => `${n}`} />
        <Slider label="Recall needed to expand" value={recall} set={setRecall} min={70} max={100} step={5} fmt={(n) => `${n}%`} />
      </div>

      <ol className="mt-8 space-y-7">
        {STAGES.map((s) => (
          <li key={s.id}>
            <p className="flex flex-wrap items-baseline justify-between gap-x-4">
              <span className="font-serif text-[22px] text-foreground">{s.name}</span>
              <span className="type-meta">
                Weeks {s.from} to {s.to} · {fmt(weekStart(s.from))} to {fmt(weekEnd(s.to))}
              </span>
            </p>
            <ul className="mt-2 divide-y divide-border">
              {s.items.map((t, i) => {
                const id = `${s.id}-${i}`;
                return (
                  <li key={id}>
                    <label className="flex cursor-pointer items-start gap-3 py-2.5 text-[15px] leading-snug">
                      <input type="checkbox" checked={!!done[id]} onChange={() => toggle(id)} className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--foreground)]" />
                      <span className={done[id] ? "text-muted line-through decoration-faint" : ""}>
                        {i === 3 && s.id === "s1" ? `${t} (${golden} questions)` : t}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-[12px] border border-border-md bg-background/40 p-5">
        <p className="type-meta text-foreground">Go / no-go for {groupLabel.toLowerCase()}</p>
        <p className="mt-1 font-serif text-[30px] leading-tight">{fmt(decision)}</p>
        <ul className="mt-4 space-y-2 text-[15px] leading-snug text-foreground/90">
          {rules.map((r) => (
            <li key={r} className="border-l-2 border-border-md pl-3">
              {r}
            </li>
          ))}
        </ul>
        <button type="button" onClick={copy} className="btn-primary mt-5 inline-flex h-10 items-center rounded-full px-5 text-[14px]">
          {copied ? "Copied" : "Copy the plan"}
        </button>
      </div>

      <Note>
        Framework: the stage lengths and the expansion rules are Operator&apos;s, built to be tested and changed. The zero
        leakage rule is not adjustable, because a screen that leaks once isn&apos;t a screen. Progress saves in this browser
        only.
      </Note>
    </Frame>
  );
}
