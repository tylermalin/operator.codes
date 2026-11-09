import Link from "next/link";
import Image from "next/image";
import NavSubscribe from "@/components/subscribe/nav-subscribe";

const links = [
  { href: "/essays", label: "Essays" },
  { href: "/about", label: "About" },
  { href: "/build-sessions", label: "Build Sessions" },
];

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-[15px] font-medium tracking-tight">
          <Image
            src="/brand/operator-mark-light.png"
            alt=""
            width={506}
            height={320}
            className="h-[14px] w-auto"
            priority
          />
          Operator
        </Link>
        <div className="flex items-center gap-6 sm:gap-8">
          <div className="hidden items-center gap-7 sm:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/essays"
            className="text-[15px] text-muted transition-colors hover:text-foreground sm:hidden"
          >
            Essays
          </Link>
          <NavSubscribe />
        </div>
      </div>
    </nav>
  );
}
