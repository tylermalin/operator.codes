"use client";

import { useMemo, useState } from "react";
import { Note } from "@/components/guide/kit";

// Delay vs. mitigation: what a months-long entitlement fight costs the
// capital side, against the price of the community package that might
// have avoided it. Every input is the user's; nothing here is market
// data. The formula is shown in full.

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
  format: (n: number) => string;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-[13px] text-muted">
        {label}
        <span className="text-[15px] tabular-nums text-foreground">{format(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--foreground)]"
      />
    </label>
  );
}

const money = (m: number) =>
  m >= 1000 ? `$${(m / 1000).toFixed(2)}B` : `$${m.toFixed(m < 10 ? 1 : 0)}M`;

export default function Delay() {
  const [value, setValue] = useState(800);
  const [committed, setCommitted] = useState(120);
  const [rate, setRate] = useState(9);
  const [months, setMonths] = useState(24);
  const [mitigation, setMitigation] = useState(40);

  const r = rate / 100;
  const calc = useMemo(() => {
    const cost = (m: number) => {
      const t = m / 12;
      const carry = committed * (Math.pow(1 + r, t) - 1);
      const deferral = value * (1 - Math.pow(1 + r, -t));
      return { carry, deferral, total: carry + deferral };
    };
    let breakEven: number | null = null;
    for (let m = 0; m <= 120; m += 0.25) {
      if (cost(m).total >= mitigation) {
        breakEven = m;
        break;
      }
    }
    return { ...cost(months), breakEven };
  }, [value, committed, r, months, mitigation]);

  const ratio = mitigation > 0 ? calc.total / mitigation : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr]">
      <div className="space-y-5">
        <Slider label="Project value at operation" value={value} onChange={setValue} min={100} max={5000} step={50} format={money} />
        <Slider label="Capital committed before entitlement" value={committed} onChange={setCommitted} min={0} max={1000} step={10} format={money} />
        <Slider label="Cost of capital" value={rate} onChange={setRate} min={3} max={15} step={0.5} format={(n) => `${n}% / yr`} />
        <Slider label="Entitlement delay" value={months} onChange={setMonths} min={0} max={60} step={1} format={(n) => `${n} months`} />
        <Slider label="Community mitigation package" value={mitigation} onChange={setMitigation} min={0} max={500} step={5} format={money} />
      </div>

      <div className="min-w-0">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="border-t border-border-md pt-4">
            <p className="type-meta">Cost of delay</p>
            <p className="type-title mt-2 text-[2.5rem] leading-none tabular-nums">{money(calc.total)}</p>
          </div>
          <div className="border-t border-border-md pt-4">
            <p className="type-meta">vs. mitigation</p>
            <p className="type-title mt-2 text-[2.5rem] leading-none tabular-nums">
              {mitigation > 0 ? `${ratio.toFixed(1)}×` : "n/a"}
            </p>
          </div>
          <div className="border-t border-border-md pt-4">
            <p className="type-meta">Break-even delay</p>
            <p className="type-title mt-2 text-[2.5rem] leading-none tabular-nums">
              {calc.breakEven === null ? "> 10 yr" : `${calc.breakEven.toFixed(calc.breakEven % 1 ? 1 : 0)} mo`}
            </p>
          </div>
        </div>

        <div className="mt-8" aria-hidden>
          <div className="flex h-3 overflow-hidden rounded-full bg-surface-3">
            <div className="bg-foreground/80" style={{ width: `${(calc.carry / Math.max(calc.total, mitigation, 1)) * 100}%` }} />
            <div className="bg-muted/70" style={{ width: `${(calc.deferral / Math.max(calc.total, mitigation, 1)) * 100}%` }} />
          </div>
          <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-surface-3">
            <div className="bg-accent" style={{ width: `${(mitigation / Math.max(calc.total, mitigation, 1)) * 100}%` }} />
          </div>
        </div>
        <dl className="mt-4 grid gap-2 text-[14px] text-muted sm:grid-cols-3">
          <div>
            <dt className="inline">Carry on committed capital </dt>
            <dd className="inline text-foreground tabular-nums">{money(calc.carry)}</dd>
          </div>
          <div>
            <dt className="inline">Value lost to deferral </dt>
            <dd className="inline text-foreground tabular-nums">{money(calc.deferral)}</dd>
          </div>
          <div>
            <dt className="inline">Mitigation package </dt>
            <dd className="inline text-accent-light tabular-nums">{money(mitigation)}</dd>
          </div>
        </dl>

        <p className="mt-8 rounded-xl border border-border bg-background-deep p-4 font-mono text-[12.5px] leading-relaxed text-muted">
          delay cost = committed × ((1 + r)<sup>t</sup> − 1) + value × (1 − (1 + r)<sup>−t</sup>)
          <br />t = months ÷ 12, r = cost of capital
        </p>
        <Note>
          Example inputs, not market data. The $800M default echoes the essay&apos;s illustration of an
          infrastructure fund&apos;s equity check; change everything. The model counts only time: it ignores
          the chance the project never gets built, which is what happened in Prince William County and Tucson
          (see the radar above), so it understates the cost of a fight.
        </Note>
      </div>
    </div>
  );
}
