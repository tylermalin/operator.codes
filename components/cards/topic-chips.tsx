import Link from "next/link";
import type { Topic } from "@/lib/topics";

// Topic filter as plain links (/essays?topic=slug), so every filtered
// view is server-rendered, shareable, and crawlable. Scrolls
// horizontally on narrow screens instead of wrapping into a wall.
export default function TopicChips({
  topics,
  active,
}: {
  topics: Topic[];
  active?: string;
}) {
  return (
    <nav aria-label="Filter by topic" className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <ul className="flex w-max gap-2.5">
        <li>
          <Link href="/essays" className="chip" aria-current={!active ? "page" : undefined} scroll={false}>
            All
          </Link>
        </li>
        {topics.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/essays?topic=${t.slug}`}
              className="chip"
              aria-current={active === t.slug ? "page" : undefined}
              scroll={false}
            >
              {t.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
