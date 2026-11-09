"use client";

import { useMemo, useState, type ReactNode } from "react";

// Interactives for "Your Agent Can Sign. You're the One Bound."
// Every number a reader sees is either their own input or a fee with a
// linked source and a note when sources disagree. Doctrine outputs are
// general and labeled as such, not advice on a specific deployment.

const usd = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(n % 1_000_000 ? 1 : 0)}M` : `$${Math.round(n).toLocaleString("en-US")}`;

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

function Slider(props: {
  label: string;
  value: number;
  set: (n: number) => void;
  min: number;
  max: number;
  step: number;
  fmt?: (n: number) => string;
}) {
  const f = props.fmt ?? usd;
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-[13px] text-muted">
        {props.label}
        <span className="text-[15px] tabular-nums text-foreground">{f(props.value)}</span>
      </span>
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(e) => props.set(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--foreground)]"
      />
    </label>
  );
}

function Seg<T extends string>({
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
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => set(o.id)}
          className="chip h-9 px-4 text-[14px]"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

const Note = ({ children }: { children: ReactNode }) => (
  <p className="mt-5 text-[13px] leading-relaxed text-muted">{children}</p>
);

/* ------------------------------------------------------------------ */
/* 1. Who is bound                                                     */
/* ------------------------------------------------------------------ */

type Structure = "anon" | "direct" | "series";

export function WhoIsBound() {
  const [s, setS] = useState<Structure>("direct");
  const [parent, setParent] = useState(20_000_000);
  const [capital, setCapital] = useState(250_000);
  const [loss, setLoss] = useState(3_000_000);
  const [shield, setShield] = useState(true);

  const out = useMemo(() => {
    if (s === "anon")
      return {
        sues: "No one. There is no identifiable principal with assets.",
        parentAtRisk: 0,
        recovered: 0,
        verdict: "Counterparty recovers nothing, so serious counterparties never sign.",
        tone: "text-amber",
      };
    if (s === "direct") {
      const hit = Math.min(loss, parent);
      return {
        sues: "Your company, because the agent ran on your credentials.",
        parentAtRisk: hit,
        recovered: hit,
        verdict: "Every dollar of the loss can reach the parent balance sheet.",
        tone: "text-red",
      };
    }
    if (!shield) {
      const hit = Math.min(loss, parent + capital);
      return {
        sues: "The series, then the parent: the records weren't kept separately, so the wall is contestable.",
        parentAtRisk: Math.max(0, hit - capital),
        recovered: hit,
        verdict: "Commingling turns a firewall into an argument.",
        tone: "text-red",
      };
    }
    const hit = Math.min(loss, capital);
    return {
      sues: "The agent's series, a real defendant with its own assets.",
      parentAtRisk: 0,
      recovered: hit,
      verdict: "Recourse stops at the capital the agent was given.",
      tone: "text-accent-light",
    };
  }, [s, parent, capital, loss, shield]);

  const max = Math.max(loss, 1);
  return (
    <Frame label="Who is bound when the agent loses money">
      <Seg
        label="How the agent is deployed"
        value={s}
        set={setS}
        options={[
          { id: "anon", label: "Anonymous wallet" },
          { id: "direct", label: "Your company's credentials" },
          { id: "series", label: "Its own series" },
        ]}
      />
      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,18rem)_1fr]">
        <div className="space-y-5">
          <Slider label="Loss caused by the agent" value={loss} set={setLoss} min={50_000} max={20_000_000} step={50_000} />
          <Slider label="Parent balance sheet" value={parent} set={setParent} min={500_000} max={100_000_000} step={500_000} />
          <Slider label="Capital in the agent's series" value={capital} set={setCapital} min={0} max={5_000_000} step={25_000} />
          {s === "series" && (
            <label className="flex items-center gap-2.5 text-[14px]">
              <input type="checkbox" checked={shield} onChange={(e) => setShield(e.target.checked)} className="h-4 w-4 accent-[var(--foreground)]" />
              Series keeps its own books and wallet
            </label>
          )}
        </div>
        <div className="min-w-0">
          <p className="type-meta">Counterparty sues</p>
          <p className="mt-1.5 text-[16px] leading-snug">{out.sues}</p>
          <div className="mt-6 space-y-3 text-[14px]">
            <div>
              <div className="flex justify-between text-muted">
                <span>Parent balance sheet exposed</span>
                <span className="tabular-nums text-foreground">{usd(out.parentAtRisk)}</span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-surface-3">
                <div className="h-full bg-red/80" style={{ width: `${(out.parentAtRisk / max) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-muted">
                <span>Counterparty can recover</span>
                <span className="tabular-nums text-foreground">{usd(out.recovered)}</span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-surface-3">
                <div className="h-full bg-foreground/70" style={{ width: `${(out.recovered / max) * 100}%` }} />
              </div>
            </div>
          </div>
          <p className={`type-title mt-6 text-[1.5rem] leading-snug ${out.tone}`}>{out.verdict}</p>
        </div>
      </div>
      <Note>
        A simplified model of where recourse lands, not a prediction of any case. It assumes the claim is valid and
        ignores insurance, guarantees, and veil-piercing on other grounds.
      </Note>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Authority check                                                  */
/* ------------------------------------------------------------------ */

const CATEGORIES = ["Data vendors", "Cloud compute", "Freelancers", "Exchanges"] as const;
type Cat = (typeof CATEGORIES)[number];

export function AuthorityCheck() {
  const [perTx, setPerTx] = useState(5_000);
  const [daily, setDaily] = useState(20_000);
  const [allowed, setAllowed] = useState<Cat[]>(["Data vendors", "Cloud compute"]);
  const [amount, setAmount] = useState(7_500);
  const [spent, setSpent] = useState(4_000);
  const [cat, setCat] = useState<Cat>("Cloud compute");
  const [notice, setNotice] = useState(true);
  const [tolerated, setTolerated] = useState(false);

  const breaches: string[] = [];
  if (amount > perTx) breaches.push(`over the ${usd(perTx)} per-transaction cap`);
  if (spent + amount > daily) breaches.push(`would take today's spend to ${usd(spent + amount)}, over the ${usd(daily)} daily cap`);
  if (!allowed.includes(cat)) breaches.push(`${cat.toLowerCase()} are not a permitted counterparty class`);
  const inside = breaches.length === 0;

  let verdict: { title: string; body: string; tone: string };
  if (inside)
    verdict = {
      title: "Inside actual authority.",
      body: "The series is bound, and that is the point: the grant says this deal is allowed.",
      tone: "text-accent-light",
    };
  else if (notice && !tolerated)
    verdict = {
      title: "Outside the grant, and the counterparty had notice.",
      body: "A counterparty that received the limits before transacting has a hard time claiming it reasonably believed the agent could do more. This is the position the manifest exists to create.",
      tone: "text-foreground",
    };
  else
    verdict = {
      title: "Outside the grant, with apparent-authority risk.",
      body: tolerated
        ? "The owner has let the agent exceed its limits before. A counterparty can argue the written limits weren't the real ones."
        : "The counterparty never saw the limits. It can argue it reasonably believed the agent had authority for this deal.",
      tone: "text-amber",
    };

  const manifest = JSON.stringify(
    {
      agent: "series-07",
      principal: "Example Master LLC, Series 07",
      limits: { perTransactionUSD: perTx, dailyUSD: daily },
      counterpartyClasses: allowed,
      expires: "2027-01-01",
      note: "Authority is limited to the above. Transactions outside it are not authorized.",
    },
    null,
    2,
  );

  const toggle = (c: Cat) =>
    setAllowed((a) => (a.includes(c) ? a.filter((x) => x !== c) : [...a, c]));

  return (
    <Frame label="Authority check: would this deal bind the series?">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-5">
          <p className="type-meta text-foreground">The grant</p>
          <Slider label="Per-transaction cap" value={perTx} set={setPerTx} min={500} max={50_000} step={500} />
          <Slider label="Daily cap" value={daily} set={setDaily} min={1_000} max={200_000} step={1_000} />
          <fieldset>
            <legend className="text-[13px] text-muted">Permitted counterparties</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button key={c} type="button" aria-pressed={allowed.includes(c)} onClick={() => toggle(c)} className="chip h-8 px-3.5 text-[13px]">
                  {c}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="space-y-5">
          <p className="type-meta text-foreground">The proposed deal</p>
          <Slider label="Amount" value={amount} set={setAmount} min={100} max={60_000} step={100} />
          <Slider label="Already spent today" value={spent} set={setSpent} min={0} max={200_000} step={500} />
          <label className="block">
            <span className="text-[13px] text-muted">Counterparty</span>
            <select value={cat} onChange={(e) => setCat(e.target.value as Cat)} className="field mt-1.5 h-10 w-full rounded-lg px-3 text-[15px]">
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2.5 text-[14px]">
            <input type="checkbox" checked={notice} onChange={(e) => setNotice(e.target.checked)} className="h-4 w-4 accent-[var(--foreground)]" />
            Agent sent its limits before transacting
          </label>
          <label className="flex items-center gap-2.5 text-[14px]">
            <input type="checkbox" checked={tolerated} onChange={(e) => setTolerated(e.target.checked)} className="h-4 w-4 accent-[var(--foreground)]" />
            Owner has let it exceed limits before
          </label>
        </div>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <p className={`type-title text-[1.75rem] leading-tight ${verdict.tone}`}>{verdict.title}</p>
        {!inside && (
          <ul className="mt-3 list-disc space-y-1 pl-5 text-[14px] text-muted">
            {breaches.map((b) => (
              <li key={b}>The deal is {b}.</li>
            ))}
          </ul>
        )}
        <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-foreground/90">{verdict.body}</p>
      </div>

      <details className="mt-6">
        <summary className="cursor-pointer text-[14px] text-muted hover:text-foreground">
          The limits manifest this grant would produce
        </summary>
        <pre className="mt-3 overflow-x-auto rounded-xl border border-border bg-background-deep p-4 font-mono text-[12.5px] leading-relaxed text-muted">
          {manifest}
        </pre>
      </details>
      <Note>
        General doctrine (actual authority, Restatement (Third) of Agency § 2.01; apparent authority, § 2.03), not
        advice on a specific deployment. Outcomes turn on facts this tool can&apos;t see.
      </Note>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 3. What the structure costs each year                              */
/* ------------------------------------------------------------------ */

type Form = "llcs" | "protected" | "registered";

export function SeriesCost() {
  const [n, setN] = useState(50);
  const [form, setForm] = useState<Form>("protected");
  const [ca, setCa] = useState(false);
  const [deTax, setDeTax] = useState(400);
  const [regTax, setRegTax] = useState(100);

  const de = form === "llcs" ? n * deTax : form === "registered" ? deTax + n * regTax : deTax;
  const caTax = ca ? n * 800 : 0;
  const total = de + caTax;

  return (
    <Frame label="What the structure costs each year">
      <div className="grid gap-8 md:grid-cols-[minmax(0,18rem)_1fr]">
        <div className="space-y-5">
          <Slider label="Agents" value={n} set={setN} min={1} max={500} step={1} fmt={(v) => String(v)} />
          <Seg
            label="Structure"
            value={form}
            set={setForm}
            options={[
              { id: "llcs", label: "Separate LLCs" },
              { id: "protected", label: "Protected series" },
              { id: "registered", label: "Registered series" },
            ]}
          />
          <label className="flex items-center gap-2.5 text-[14px]">
            <input type="checkbox" checked={ca} onChange={(e) => setCa(e.target.checked)} className="h-4 w-4 accent-[var(--foreground)]" />
            Registered or doing business in California
          </label>
          <details className="text-[14px]">
            <summary className="cursor-pointer text-muted hover:text-foreground">Fee assumptions</summary>
            <div className="mt-3 space-y-4">
              <Slider label="Delaware annual tax per LLC (2025: $300, 2026 on: $400)" value={deTax} set={setDeTax} min={300} max={400} step={100} />
              <Slider label="Delaware annual tax per registered series (2025: $75, 2026 on: $100)" value={regTax} set={setRegTax} min={75} max={100} step={25} />
            </div>
          </details>
        </div>
        <div className="min-w-0">
          <p className="type-meta">Annual state cost</p>
          <p className="type-title mt-2 text-[3rem] leading-none tabular-nums">{usd(total)}</p>
          <dl className="mt-5 space-y-2 text-[14px]">
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted">Delaware</dt>
              <dd className="tabular-nums">{usd(de)}</dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted">California ($800 × each series)</dt>
              <dd className="tabular-nums">{usd(caTax)}</dd>
            </div>
          </dl>
          <p className="mt-5 text-[15px] leading-relaxed text-foreground/90">
            {form === "protected" &&
              "One Delaware filing covers every series. The catch is that none of them appears on the public record on its own."}
            {form === "registered" &&
              "Each series has its own certificate, its own name on the public record, and its own good standing certificate, which is what enterprise counterparties and lenders ask for."}
            {form === "llcs" && "Full separation, full cost: every agent is its own entity, with its own tax."}
            {ca && " California treats each series as its own LLC, so the $800 minimum tax scales with your agent count."}
          </p>
        </div>
      </div>
      <Note>
        Annual taxes only; formation and registered-agent fees excluded. Delaware&apos;s HB 400 raised the LLC annual tax
        from $300 to $400 and the registered series tax from $75 to $100, starting with tax year 2026; the higher bills
        first come due in 2027 (
        <a className="link-underline text-foreground" href="https://www.withum.com/resources/delaware-businesses-face-increased-annual-taxes-and-filing-costs/">
          Withum
        </a>
        ). That is why Delaware&apos;s{" "}
        <a className="link-underline text-foreground" href="https://corp.delaware.gov/alt-entitytaxinstructions/">
          tax instructions
        </a>{" "}
        say $400 while its{" "}
        <a className="link-underline text-foreground" href="https://corp.delaware.gov/taxfaq/">
          FAQ
        </a>{" "}
        still says $300: pick $300 to model 2025.{" "}
        <a className="link-underline text-foreground" href="https://www.ftb.ca.gov/forms/2025/2025-568-booklet.html">
          California Form 568 instructions
        </a>
        : each series files and pays its own $800 if registered or doing business in California. The master LLC may
        owe its own $800 too.
      </Note>
    </Frame>
  );
}
