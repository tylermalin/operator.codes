import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between gap-4 text-sm text-muted">
        <span className="font-mono">operator.codes · Tyler Malin</span>
        <div className="flex gap-5">
          <Link href="/essays" className="hover:text-foreground transition-colors">
            essays
          </Link>
          <Link
            href="/build-sessions"
            className="hover:text-foreground transition-colors"
          >
            build sessions
          </Link>
          <a
            href="https://x.com/tylermalin"
            className="hover:text-foreground transition-colors"
          >
            x.com/tylermalin
          </a>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            terms
          </Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
