import Link from "next/link";

const links = [
  { href: "/essays", label: "essays" },
  { href: "/build-sessions", label: "build sessions" },
  { href: "/about", label: "about" },
];

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-14 z-50 bg-background/92 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto h-full flex items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-sm tracking-tight"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
          operator.codes
        </Link>
        <div className="hidden sm:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline text-sm text-muted hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/subscribe"
            className="btn-secondary text-sm px-4 py-1.5 rounded-full"
          >
            subscribe
          </Link>
        </div>
      </div>
    </nav>
  );
}
