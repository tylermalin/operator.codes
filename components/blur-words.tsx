// Word-by-word blur-in for a single headline, rendered on the server
// with CSS animation delays (no client JS). Use once per page, on the
// home hero only. Respects prefers-reduced-motion via globals.css.
export default function BlurWords({
  text,
  className = "",
  start = 0,
  step = 70,
}: {
  text: string;
  className?: string;
  start?: number;
  step?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="word-in" style={{ animationDelay: `${start + i * step}ms` }}>
            {w}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}
