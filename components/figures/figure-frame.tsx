// Shared figure chrome: a light plate on the dark page (label + badge
// header, paper-toned body), matching the hero-illustration treatment.
// Extracted once a second essay needed the same wrapper around
// different content (SVG in one case, a designed comparison panel in
// another) rather than duplicating the header markup a second time.

export function FigureFrame({
  label,
  badge,
  children,
}: {
  label: string;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="my-10 rounded-2xl bg-[#f4f2ed] p-5 sm:p-6">
      <figcaption className="flex items-center justify-between gap-3 border-b border-stone-300/70 pb-3 mb-4">
        <span className="font-mono text-xs font-medium text-stone-500">
          {label}
        </span>
        <span className="font-mono text-[11px] bg-stone-200 text-stone-600 px-2 py-0.5 rounded whitespace-nowrap">
          {badge}
        </span>
      </figcaption>
      {children}
    </figure>
  );
}

// For figures whose content is static trusted SVG markup (authored
// for the essay, not user input): inject raw to avoid a lossy
// hand-conversion to JSX attributes.
export function SvgBlock({ svg }: { svg: string }) {
  return (
    <div
      className="flex justify-center [&_svg]:w-full [&_svg]:h-auto [&_svg]:max-w-2xl"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
