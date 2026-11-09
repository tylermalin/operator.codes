"use client";

import { useMemo, useState } from "react";
import { SOURCES } from "@/lib/guides/fence-line";
import { Cite, Note } from "@/components/guide/kit";

// Boundary Envelope builder: set the property-line limits, get draft
// covenant language and the monitoring spec that would enforce it.
// Noise presets come from COMAR 26.02.03.02 Table 1; every other number
// is the user's own input.

const ZONES = {
  residential: { label: "Residential", day: 65, night: 55 },
  commercial: { label: "Commercial", day: 67, night: 62 },
  industrial: { label: "Industrial", day: 75, night: 75 },
} as const;
type Zone = keyof typeof ZONES;

const fmt = (n: number) => n.toLocaleString("en-US");

function NumberField({
  label,
  value,
  onChange,
  min = 0,
  step = 1,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="mt-1.5 flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={value}
          onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
          className="field h-10 w-full rounded-lg px-3 text-[15px] tabular-nums"
        />
        {suffix && <span className="shrink-0 text-[13px] text-muted">{suffix}</span>}
      </span>
    </label>
  );
}

export default function Envelope() {
  const [zone, setZone] = useState<Zone>("residential");
  const [dayDb, setDayDb] = useState<number>(ZONES.residential.day);
  const [nightDb, setNightDb] = useState<number>(ZONES.residential.night);
  const [water, setWater] = useState(3_000_000);
  const [genHours, setGenHours] = useState(50);
  const [curtailMw, setCurtailMw] = useState(30);
  const [window, setWindow] = useState(15);
  const [damages, setDamages] = useState(25_000);

  const legal = ZONES[zone];
  const dayOver = dayDb > legal.day;
  const nightOver = nightDb > legal.night;

  function pickZone(z: Zone) {
    setZone(z);
    setDayDb(ZONES[z].day);
    setNightDb(ZONES[z].night);
  }

  const covenant = useMemo(
    () =>
      [
        `1. Potable water. The Company shall not withdraw more than ${fmt(water)} gallons of potable water in any calendar month, measured at the utility meter and published daily.`,
        `2. Sound at the property line. Sound levels measured at the property line shall not exceed ${dayDb} dBA during daytime hours or ${nightDb} dBA from 10 p.m. to 7 a.m., measured by continuous monitors and published in raw form.`,
        `3. Backup generation. Scheduled testing of backup generators shall not exceed ${fmt(genHours)} hours per calendar year and shall occur on weekdays during daytime hours, except during a grid emergency declared by the grid operator.`,
        `4. Grid emergencies. On a declared grid emergency, the Company shall curtail at least ${fmt(curtailMw)} MW of load within the time set by the grid operator.`,
        `5. Breach. A reading above any limit in Sections 1 to 3 for more than ${window} consecutive minutes, outside a declared grid emergency, is a Breach. Each Breach-hour pays $${fmt(damages)} in liquidated damages into the Community Fund, without further action by either party.`,
        `6. Expansion consent. While any Breach remains uncured, the Company shall not seek permits for, or commence, any expansion of the facility without the written consent of the Class B shareholder.`,
      ].join("\n\n"),
    [water, dayDb, nightDb, genHours, curtailMw, window, damages],
  );

  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(covenant);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: text is selectable */
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr]">
      <div className="space-y-5">
        <fieldset>
          <legend className="text-[13px] text-muted">
            Noise baseline: Maryland zone limit at the property line
            <Cite registry={SOURCES} id="comar-noise" />
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {(Object.keys(ZONES) as Zone[]).map((z) => (
              <button
                key={z}
                type="button"
                aria-pressed={zone === z}
                onClick={() => pickZone(z)}
                className="chip h-8 px-3.5 text-sm"
              >
                {ZONES[z].label} {ZONES[z].day}/{ZONES[z].night}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="grid grid-cols-2 gap-4">
          <NumberField label="Day limit" value={dayDb} onChange={setDayDb} suffix="dBA" />
          <NumberField label="Night limit" value={nightDb} onChange={setNightDb} suffix="dBA" />
        </div>
        {(dayOver || nightOver) && (
          <p role="alert" className="text-[13px] text-red">
            Above the state limit for this zone ({legal.day}/{legal.night} dBA). A covenant can be stricter
            than the regulation, never looser.
          </p>
        )}
        <NumberField label="Potable water cap" value={water} onChange={setWater} step={100000} suffix="gal / month" />
        <NumberField label="Generator testing cap" value={genHours} onChange={setGenHours} suffix="hours / year" />
        <NumberField label="Curtailment on grid emergency" value={curtailMw} onChange={setCurtailMw} suffix="MW" />
        <div className="grid grid-cols-2 gap-4">
          <NumberField label="Breach window" value={window} onChange={setWindow} min={1} suffix="min" />
          <NumberField label="Damages" value={damages} onChange={setDamages} step={1000} suffix="$ / hr" />
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex items-center justify-between">
          <p className="type-meta text-foreground">Draft covenant</p>
          <button type="button" onClick={copy} className="btn-secondary h-8 rounded-full px-3.5 text-sm">
            {copied ? "Copied" : "Copy text"}
          </button>
        </div>
        <pre className="mt-3 max-h-[26rem] overflow-auto whitespace-pre-wrap rounded-xl border border-border bg-background-deep p-5 font-serif text-[16px] leading-relaxed text-foreground">
          {covenant}
        </pre>
        <table className="mt-6 w-full text-left text-[14px]">
          <caption className="type-meta pb-3 text-left text-foreground">Monitoring that makes it enforceable</caption>
          <thead>
            <tr className="border-b border-border-md text-muted">
              <th className="py-2 pr-4 font-medium">Limit</th>
              <th className="py-2 pr-4 font-medium">Instrument</th>
              <th className="py-2 font-medium">Published</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            <tr className="border-b border-border">
              <td className="py-2.5 pr-4">Water</td>
              <td className="py-2.5 pr-4">Utility revenue meter</td>
              <td className="py-2.5">Daily totals</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 pr-4">Sound</td>
              <td className="py-2.5 pr-4">Class 1 sound level meters at each property line</td>
              <td className="py-2.5">1-minute readings</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2.5 pr-4">Generators</td>
              <td className="py-2.5 pr-4">Run-hour meters and testing log</td>
              <td className="py-2.5">Each test</td>
            </tr>
            <tr>
              <td className="py-2.5 pr-4">Curtailment</td>
              <td className="py-2.5 pr-4">Utility interval data</td>
              <td className="py-2.5">Each event</td>
            </tr>
          </tbody>
        </table>
        <Note>
          Draft language for discussion, not legal advice. Water, generator, curtailment, window, and damages
          values are your inputs, not benchmarks. What a covenant cannot do: bind a county&apos;s permit
          process. Section 6 works because the Class B shareholder&apos;s consent is written into the
          company&apos;s own charter, so the restraint is on the company, not the government.
        </Note>
      </div>
    </div>
  );
}
