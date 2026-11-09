"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

// Interactives for "The Seed Founder's Guide to Capital Markets".
// Benchmarks come from Carta's State of Private Markets Q1 2026, checked
// against the published report on 2026-11-09. Seed medians by category
// are the essay's table. Everything else is the founder's own input.

const CARTA = "https://carta.com/data/state-of-private-markets-q1-2026-full-report/";
const SEED = { p25: 12.4, median: 21.6, p75: 35, p90: 78.8, dilution: 19 };
const CATEGORY = {
  nonai: { label: "Non-AI", post: 20.6, round: 2.0 },
  applied: { label: "AI applied", post: 21.5, round: 2.9 },
  foundational: { label: "AI foundational model", post: 250, round: 9.0 },
} as const;
type Cat = keyof typeof CATEGORY;

const m = (n: number) => `$${n >= 100 ? n.toFixed(0) : n.toFixed(1)}M`;

function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="not-prose my-12 rounded-[14px] border border-border-md bg-surface">
      <div className="flex items-center justify-between border-b border-border px-5 py-3 sm:px-6">
        <span className="type-meta text-foreground">{label}</span>
        <span className="type-meta">Interactive</span>
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
      <span className="flex items-baseline justify-between text-[13px] text-muted">
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

const Src = () => (
  <a className="link-underline text-foreground" href={CARTA}>
    Carta, State of Private Markets Q1 2026
  </a>
);

/* ------------------------------------------------------------------ */
/* 1. Where your round sits                                            */
/* ------------------------------------------------------------------ */

export function SeedPosition() {
  const [cat, setCat] = useState<Cat>("applied");
  const [post, setPost] = useState(28);
  const [raise, setRaise] = useState(4);

  const dilution = (raise / post) * 100;
  const c = CATEGORY[cat];

  // Log scale from $5M to $300M for the band
  const lo = Math.log(5);
  const hi = Math.log(300);
  const x = (v: number) => `${((Math.log(Math.min(Math.max(v, 5), 300)) - lo) / (hi - lo)) * 100}%`;

  const bucket =
    post < SEED.p25
      ? "Bottom quartile of seed post-money."
      : post <= SEED.median
        ? "Between the 25th percentile and the median."
        : post <= SEED.p75
          ? "Between the median and the 75th percentile."
          : post <= SEED.p90
            ? "Top quartile. You should have a specific reason."
            : "Above the 90th percentile. These are the deals you hear about, not comps.";

  const flags: string[] = [];
  if (cat !== "foundational" && post > SEED.p75)
    flags.push("Above $35M without foundational-model characteristics or a hardware moat: name the moat.");
  if (dilution > 20) flags.push(`${dilution.toFixed(0)}% dilution is above the 19% overall median. The essay's rule: a term sheet asking 20%+ is mispriced. Say so.`);
  if (dilution < 10) flags.push("Under 10% dilution: check the round is big enough to reach the Series A milestone.");
  if (cat === "foundational") flags.push("The foundational column is a different asset class. If you are not training models, switch rows.");

  return (
    <Frame label="Where your seed round sits">
      <Chips
        label="Your category"
        value={cat}
        set={setCat}
        options={(Object.keys(CATEGORY) as Cat[]).map((k) => ({ id: k, label: CATEGORY[k].label }))}
      />
      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,18rem)_1fr]">
        <div className="space-y-5">
          <Slider label="Post-money valuation" value={post} set={setPost} min={5} max={300} step={0.5} fmt={m} />
          <Slider label="Round size" value={raise} set={setRaise} min={0.5} max={40} step={0.1} fmt={m} />
          <div className="border-t border-border-md pt-4">
            <p className="type-meta">Implied dilution</p>
            <p className="type-title mt-1 text-[2.5rem] leading-none tabular-nums">{dilution.toFixed(1)}%</p>
          </div>
        </div>
        <div className="min-w-0">
          <p className="type-meta">All seed rounds, post-money (log scale)</p>
          <div className="relative mt-8 h-14">
            <div className="absolute inset-x-0 top-5 h-2 rounded-full bg-surface-3" />
            <div
              className="absolute top-5 h-2 rounded-full bg-muted/60"
              style={{ left: x(SEED.p25), width: `calc(${x(SEED.p75)} - ${x(SEED.p25)})` }}
            />
            {[
              { v: SEED.median, l: "Median $21.6M" },
              { v: SEED.p90, l: "90th $78.8M" },
            ].map((t) => (
              <div key={t.l} className="absolute top-3 h-6 w-px bg-foreground/60" style={{ left: x(t.v) }}>
                <span className="absolute -top-6 -translate-x-1/2 whitespace-nowrap text-[11px] text-muted">{t.l}</span>
              </div>
            ))}
            <div
              className="absolute top-[14px] h-[22px] w-[22px] -translate-x-1/2 rounded-full border-2 border-background bg-foreground shadow"
              style={{ left: x(post) }}
              aria-hidden
            />
            <span className="absolute top-11 text-[11px] text-muted" style={{ left: x(SEED.p25) }}>
              Middle 50%: $12.4M to $35M
            </span>
          </div>
          <p className="type-title mt-6 text-[1.5rem] leading-snug">{bucket}</p>
          <p className="mt-2 text-[15px] text-muted">
            {c.label} seed median: {m(c.post)} post, {m(c.round)} round. You are{" "}
            {post >= c.post ? `${((post / c.post - 1) * 100).toFixed(0)}% above` : `${((1 - post / c.post) * 100).toFixed(0)}% below`} your row.
          </p>
          {flags.length > 0 && (
            <ul className="mt-4 space-y-1.5 text-[14px] text-amber">
              {flags.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <p className="mt-5 text-[13px] leading-relaxed text-muted">
        Band, median, 90th percentile, and 19% median dilution: <Src />. Category medians: the essay&apos;s table from the same report.
      </p>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Term sheet check                                                 */
/* ------------------------------------------------------------------ */

export function TermSheetCheck() {
  const [pref, setPref] = useState(1);
  const [participating, setParticipating] = useState(false);
  const [stake, setStake] = useState(18);
  const [invested, setInvested] = useState(4);
  const [exit, setExit] = useState(30);

  const result = useMemo(() => {
    const prefAmt = invested * pref;
    const share = stake / 100;
    let investor: number;
    if (participating) {
      const p = Math.min(prefAmt, exit);
      investor = p + Math.max(0, exit - p) * share;
    } else {
      investor = Math.max(Math.min(prefAmt, exit), exit * share);
    }
    return { investor, rest: Math.max(0, exit - investor), clean: exit * share };
  }, [pref, participating, stake, invested, exit]);

  const outliers: string[] = [];
  if (pref > 1) outliers.push("Liquidation preference above 1x: in 2.7% of primary rounds.");
  if (participating) outliers.push("Participation rights: in 5.4% of primary rounds.");

  return (
    <Frame label="Term sheet check: what the terms do at exit">
      <div className="grid gap-8 md:grid-cols-[minmax(0,18rem)_1fr]">
        <div className="space-y-5">
          <Chips
            label="Liquidation preference"
            value={String(pref) as "1" | "1.5" | "2" | "3"}
            set={(v) => setPref(Number(v))}
            options={[
              { id: "1", label: "1x" },
              { id: "1.5", label: "1.5x" },
              { id: "2", label: "2x" },
              { id: "3", label: "3x" },
            ]}
          />
          <label className="flex items-center gap-2.5 text-[14px]">
            <input type="checkbox" checked={participating} onChange={(e) => setParticipating(e.target.checked)} className="h-4 w-4 accent-[var(--foreground)]" />
            Participating preferred
          </label>
          <Slider label="Investor ownership" value={stake} set={setStake} min={5} max={40} step={1} fmt={(n) => `${n}%`} />
          <Slider label="Amount invested" value={invested} set={setInvested} min={0.5} max={20} step={0.5} fmt={m} />
          <Slider label="Exit value" value={exit} set={setExit} min={1} max={300} step={1} fmt={m} />
        </div>
        <div className="min-w-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="border-t border-border-md pt-4">
              <p className="type-meta">Investor takes</p>
              <p className="type-title mt-1 text-[2.25rem] leading-none tabular-nums">{m(result.investor)}</p>
              <p className="mt-1 text-[13px] text-muted">{exit > 0 ? ((result.investor / exit) * 100).toFixed(0) : 0}% of the exit</p>
            </div>
            <div className="border-t border-border-md pt-4">
              <p className="type-meta">Founders and team</p>
              <p className="type-title mt-1 text-[2.25rem] leading-none tabular-nums">{m(result.rest)}</p>
              <p className="mt-1 text-[13px] text-muted">{exit > 0 ? ((result.rest / exit) * 100).toFixed(0) : 0}% of the exit</p>
            </div>
          </div>
          <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-surface-3" aria-hidden>
            <div className="bg-amber/80" style={{ width: `${exit ? (result.investor / exit) * 100 : 0}%` }} />
            <div className="bg-foreground/75" style={{ width: `${exit ? (result.rest / exit) * 100 : 0}%` }} />
          </div>
          <p className="mt-4 text-[15px] leading-relaxed text-foreground/90">
            With a clean 1x non-participating preference, the investor would take {m(Math.max(Math.min(invested, exit), result.clean))}.
            {result.investor - Math.max(Math.min(invested, exit), result.clean) > 0.05 &&
              ` These terms move ${m(result.investor - Math.max(Math.min(invested, exit), result.clean))} from the team to the investor at this exit.`}
          </p>
          {outliers.length > 0 ? (
            <ul className="mt-3 space-y-1 text-[14px] text-amber">
              {outliers.map((o) => (
                <li key={o}>{o} Treat it as an outlier in negotiation.</li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[14px] text-accent-light">Standard terms. This is what most seed primaries look like.</p>
          )}
        </div>
      </div>
      <p className="mt-5 text-[13px] leading-relaxed text-muted">
        Simplified: one preferred class over common, no option pool or debt. Term prevalence: <Src />, primary rounds. Carta notes bridge rounds carry
        more investor-protective terms.
      </p>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Runway to Series A                                               */
/* ------------------------------------------------------------------ */

export function RunwayToA() {
  const [cash, setCash] = useState(3);
  const [burn, setBurn] = useState(110);
  const [process, setProcess] = useState(6);

  const runway = (cash * 1000) / Math.max(burn, 1);
  const startBy = runway - process;
  const ok = runway >= 24;
  const burnFor24 = (cash * 1000) / 24;

  return (
    <Frame label="Runway to Series A">
      <div className="grid gap-8 md:grid-cols-[minmax(0,18rem)_1fr]">
        <div className="space-y-5">
          <Slider label="Cash raised" value={cash} set={setCash} min={0.5} max={15} step={0.1} fmt={m} />
          <Slider label="Monthly net burn" value={burn} set={setBurn} min={20} max={800} step={5} fmt={(n) => `$${n}K`} />
          <Slider label="Months to run a Series A process" value={process} set={setProcess} min={3} max={9} step={1} fmt={(n) => `${n} mo`} />
        </div>
        <div className="min-w-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="border-t border-border-md pt-4">
              <p className="type-meta">Runway</p>
              <p className={`type-title mt-1 text-[2.5rem] leading-none tabular-nums ${ok ? "" : "text-amber"}`}>{runway.toFixed(0)} mo</p>
            </div>
            <div className="border-t border-border-md pt-4">
              <p className="type-meta">Start the A by</p>
              <p className="type-title mt-1 text-[2.5rem] leading-none tabular-nums">{Math.max(0, startBy).toFixed(0)} mo</p>
            </div>
          </div>
          <div className="relative mt-8 h-10" aria-hidden>
            <div className="absolute inset-x-0 top-4 h-2 rounded-full bg-surface-3" />
            <div className="absolute top-4 h-2 rounded-full bg-foreground/70" style={{ width: `${Math.min(runway / 36, 1) * 100}%` }} />
            <div className="absolute top-1 h-8 w-px bg-accent" style={{ left: `${(24 / 36) * 100}%` }}>
              <span className="absolute -top-5 -translate-x-1/2 whitespace-nowrap text-[11px] text-muted">Median seed to A: 24 mo</span>
            </div>
          </div>
          <p className="mt-6 text-[15px] leading-relaxed text-foreground/90">
            {ok
              ? "You clear the median time to Series A with room to run the process. Hold burn until the A milestone is named and dated."
              : `Short of the 24-month median. To reach it, burn would need to fall to about $${burnFor24.toFixed(0)}K a month. Otherwise, plan a bridge now, and only to a named milestone that moves your valuation tier.`}
          </p>
        </div>
      </div>
      <p className="mt-5 text-[13px] leading-relaxed text-muted">
        Median time from seed to Series A (about two years) and median company age at the A (2.8 years): <Src />. Burn and process length are your
        inputs.
      </p>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Checklist                                                        */
/* ------------------------------------------------------------------ */

const ITEMS = [
  "Know your row: non-AI, applied AI, or foundational. Benchmark against that row's median.",
  "Answer the replacement question on one slide: why a capable model does not do this.",
  "Price inside the band: $12.4M to $35M post covers half of all seed rounds. Above $35M needs a moat you can name.",
  "Push back on 20%+ dilution.",
  "Reject non-standard terms: participation, multiples, preferences above 1x.",
  "Fund 24 months minimum.",
  "Look for non-dilutive capital first: grants, customer prepayment, revenue-based financing.",
  "Bridge only to a named milestone. Never to wait.",
  "Raise where your category concentrates, not where you live.",
  "Design equity for a decade: option plan, tender policy, cap table hygiene.",
  "Thirteen slides, team by slide 3, problem stacked before product, one-line analogy.",
  "Give your strongest evidence the slide count.",
  "Name the Series A milestone on the fundraising slide: timing, target, allocation.",
];

const SECTOR = {
  ai: "AI/SaaS: a proprietary model, autonomy, or a unique data asset. Not a wrapper.",
  climate: "Climate: a cost advantage over the incumbent plus a grant strategy.",
  fintech: "Fintech: a charter, license, or regulatory position, plus unit economics.",
  health: "Health: an FDA pathway and a reimbursement story, one slide each.",
  consumer: "Consumer: a visible path to profitability.",
} as const;
type Sector = keyof typeof SECTOR;

const KEY = "operator-seed-checklist";

export function SeedChecklist() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [sector, setSector] = useState<Sector>("ai");

  // Restore saved progress after hydration (server render has no storage),
  // deferred a tick so the first client render matches the server's.
  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(KEY);
    } catch {
      /* storage unavailable */
    }
    if (!raw) return;
    const saved = JSON.parse(raw) as Record<string, boolean>;
    const t = setTimeout(() => setDone(saved), 0);
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

  const all = [...ITEMS.map((t, i) => ({ id: `i${i}`, t })), { id: "sector", t: `State your sector's moat. ${SECTOR[sector]}` }];
  const count = all.filter((x) => done[x.id]).length;

  return (
    <Frame label={`Seed readiness · ${count} of ${all.length}`}>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-3" aria-hidden>
        <div className="h-full bg-accent transition-[width]" style={{ width: `${(count / all.length) * 100}%` }} />
      </div>
      <div className="mt-5">
        <Chips
          label="Your sector"
          value={sector}
          set={setSector}
          options={[
            { id: "ai", label: "AI / SaaS" },
            { id: "climate", label: "Climate" },
            { id: "fintech", label: "Fintech" },
            { id: "health", label: "Health" },
            { id: "consumer", label: "Consumer" },
          ]}
        />
      </div>
      <ul className="mt-5 divide-y divide-border">
        {all.map((x) => (
          <li key={x.id}>
            <label className="flex cursor-pointer items-start gap-3 py-3 text-[15px] leading-snug">
              <input
                type="checkbox"
                checked={!!done[x.id]}
                onChange={() => toggle(x.id)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--foreground)]"
              />
              <span className={done[x.id] ? "text-muted line-through decoration-faint" : ""}>{x.t}</span>
            </label>
          </li>
        ))}
      </ul>
    </Frame>
  );
}
