"use client";

import { useMemo, useState, type ReactNode } from "react";

// Interactive for "LexOps: Law as Infrastructure for Autonomous Actors".
// A sample company, not real data. It reconciles records against each
// other (principle 2), states the basis for every result (principle 3),
// and stops at critical defects instead of judging validity (principle 4).
// The 83(b) rule follows IRS Form 15620's instructions: file no later than
// 30 days after transfer, rolling to the next business day when day 30
// falls on a weekend. Federal holidays are not modeled.

type Founder = {
  name: string;
  capTable: number;
  approved: number;
  issued: string;
  filed83b: boolean;
  filedOn: string;
  ipSigned: boolean;
};

const START: Founder[] = [
  { name: "Founder A", capTable: 4_000_000, approved: 4_000_000, issued: "2026-03-02", filed83b: true, filedOn: "2026-04-03", ipSigned: true },
  { name: "Founder B", capTable: 4_000_000, approved: 3_500_000, issued: "2026-03-02", filed83b: true, filedOn: "2026-03-20", ipSigned: false },
];

const DAY = 86_400_000;
const parse = (s: string) => new Date(`${s}T12:00:00Z`);
const fmt = (d: Date) =>
  d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

function deadline83b(issued: string) {
  const d = new Date(parse(issued).getTime() + 30 * DAY);
  while (d.getUTCDay() === 0 || d.getUTCDay() === 6) d.setUTCDate(d.getUTCDate() + 1);
  return d;
}

type Check = { label: string; ok: boolean; critical: boolean; basis: string };

function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="not-prose my-12 rounded-[14px] border border-border-md bg-surface">
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3 sm:px-6">
        <span className="type-meta text-foreground">{label}</span>
        <span className="type-meta shrink-0">Interactive</span>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

const input =
  "mt-1.5 h-10 w-full rounded-[10px] border border-border-md bg-background px-3 text-[15px] tabular-nums text-foreground";

export function DriftCheck() {
  const [fs, setFs] = useState<Founder[]>(START);
  const set = (i: number, patch: Partial<Founder>) => setFs((xs) => xs.map((f, j) => (j === i ? { ...f, ...patch } : f)));

  const checks = useMemo(() => {
    const out: Check[] = [];
    for (const f of fs) {
      out.push({
        label: `${f.name}: shares match board approval`,
        ok: f.capTable === f.approved,
        critical: true,
        basis: `Cap table ${f.capTable.toLocaleString()} vs. board consent ${f.approved.toLocaleString()}`,
      });
      const due = deadline83b(f.issued);
      if (!f.filed83b) {
        out.push({ label: `${f.name}: 83(b) election on file`, ok: false, critical: true, basis: `No filing recorded. Deadline was ${fmt(due)}.` });
      } else {
        const late = Math.round((parse(f.filedOn).getTime() - due.getTime()) / DAY);
        out.push({
          label: `${f.name}: 83(b) filed within 30 days`,
          ok: late <= 0,
          critical: true,
          basis:
            late <= 0
              ? `Filed ${fmt(parse(f.filedOn))}. Deadline ${fmt(due)}.`
              : `Filed ${fmt(parse(f.filedOn))}, ${late} ${late === 1 ? "day" : "days"} after the ${fmt(due)} deadline.`,
        });
      }
      out.push({
        label: `${f.name}: IP assignment covers this founder`,
        ok: f.ipSigned,
        critical: true,
        basis: f.ipSigned ? "Signed assignment on file." : "No signed assignment found for this founder.",
      });
    }
    return out;
  }, [fs]);

  const defects = checks.filter((c) => !c.ok);
  const passed = checks.length - defects.length;

  return (
    <Frame label="Records drift check · sample company">
      <div className="grid gap-6">
        {fs.map((f, i) => (
          <fieldset key={f.name} className="rounded-[12px] border border-border p-4">
            <legend className="type-meta px-1 text-foreground">{f.name}</legend>
            <div className="grid grid-cols-1 gap-3 min-[440px]:grid-cols-2">
              <label className="text-[13px] text-muted">
                Cap table shares
                <input type="number" step={100000} value={f.capTable} onChange={(e) => set(i, { capTable: Number(e.target.value) })} className={input} />
              </label>
              <label className="text-[13px] text-muted">
                Board-approved
                <input type="number" step={100000} value={f.approved} onChange={(e) => set(i, { approved: Number(e.target.value) })} className={input} />
              </label>
              <label className="text-[13px] text-muted">
                Shares issued on
                <input type="date" value={f.issued} onChange={(e) => e.target.value && set(i, { issued: e.target.value })} className={input} />
              </label>
              <label className="text-[13px] text-muted">
                83(b) filed on
                <input
                  type="date"
                  value={f.filedOn}
                  disabled={!f.filed83b}
                  onChange={(e) => e.target.value && set(i, { filedOn: e.target.value })}
                  className={`${input} disabled:opacity-40`}
                />
              </label>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={f.filed83b} onChange={(e) => set(i, { filed83b: e.target.checked })} className="h-4 w-4 accent-[var(--foreground)]" />
                83(b) filed
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={f.ipSigned} onChange={(e) => set(i, { ipSigned: e.target.checked })} className="h-4 w-4 accent-[var(--foreground)]" />
                IP assignment signed
              </label>
            </div>
          </fieldset>
        ))}
      </div>

      <div className="mt-8 flex items-baseline justify-between gap-4">
        <p className="type-meta text-foreground">Reconciliation</p>
        <p className="type-meta tabular-nums">
          {passed} of {checks.length} checks pass
        </p>
      </div>
      <ul className="mt-3 divide-y divide-border">
        {checks.map((c) => (
          <li key={c.label} className="flex items-start gap-3 py-2.5">
            <span className={`type-meta mt-0.5 w-16 shrink-0 ${c.ok ? "text-faint" : "text-amber"}`}>{c.ok ? "Pass" : "Defect"}</span>
            <span className="text-[15px] leading-snug">
              {c.label}
              <span className="block text-[13px] text-muted">Basis: {c.basis}</span>
            </span>
          </li>
        ))}
      </ul>

      <div
        role="status"
        className={`mt-6 rounded-[12px] border p-4 text-[15px] leading-relaxed ${defects.length ? "border-amber/60 text-foreground" : "border-border text-muted"}`}
      >
        {defects.length
          ? `Stopped: ${defects.length} critical ${defects.length === 1 ? "defect" : "defects"}. Each file looks fine on its own; the defects live between them. This is where the system's authority ends. Bring in counsel before anyone relies on these records.`
          : "No mismatches between these records. That is a consistency result, not a legal opinion that anything is valid or enforceable."}
      </div>

      <p className="mt-5 border-t border-border pt-4 text-[13px] leading-relaxed text-muted">
        Sample company, illustrative only. The 83(b) deadline follows IRS Form 15620: no later than 30 days after transfer,
        moved to the next business day if day 30 lands on a weekend. Federal holidays are not modeled. This tool reports
        mismatches between records. It does not decide that any document is valid, and it is not legal advice.
      </p>
    </Frame>
  );
}
