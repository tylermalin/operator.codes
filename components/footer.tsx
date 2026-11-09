import Link from "next/link";

const links = [
  { href: "/essays", label: "Essays" },
  { href: "/about", label: "About" },
  { href: "/build-sessions", label: "Build Sessions" },
  { href: "/feed.xml", label: "RSS" },
  { href: "https://x.com/tylermalin", label: "X" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span>Operator, by Tyler Malin</span>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((l) =>
            l.href.startsWith("http") || l.href.endsWith(".xml") ? (
              <a key={l.href} href={l.href} className="transition-colors hover:text-foreground">
                {l.label}
              </a>
            ) : (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-foreground">
                {l.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </footer>
  );
}
