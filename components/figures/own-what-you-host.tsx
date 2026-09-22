import { FigureFrame } from "@/components/figures/figure-frame";

// The essay's central mechanism as a two-column comparison rather
// than the source draft's ASCII table (unpublishable as markdown —
// renders as a stray code block, not a table). Same light-plate
// language as the agent-can-sign figures.

const operatorControls = [
  "Chip architecture & rack layout",
  "Server workload management",
  "Chiller plant dispatch",
  "Generator maintenance timing",
];

const communityControls = [
  "Substation peak-demand limits",
  "Potable water consumption caps",
  "Perimeter acoustic limits",
  "Phase II physical expansion veto",
];

function ControlColumn({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: string[];
}) {
  return (
    <div className="bg-white p-5">
      <p className="font-mono text-[11px] uppercase tracking-wide text-stone-500 mb-1">
        {title}
      </p>
      <p className="text-xs text-stone-400 mb-4 italic">{subtitle}</p>
      <ul className="space-y-2 text-sm text-stone-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function ControlBoundary() {
  return (
    <FigureFrame label="Figure 1.0 // The Control Boundary" badge="Own What You Host">
      <div className="grid sm:grid-cols-2 gap-px bg-stone-300/70 rounded-xl overflow-hidden border border-stone-300/70">
        <ControlColumn
          title="What the operator controls"
          subtitle="Inside the walls"
          items={operatorControls}
        />
        <ControlColumn
          title="What the community controls"
          subtitle="At the property line"
          items={communityControls}
        />
      </div>
    </FigureFrame>
  );
}
