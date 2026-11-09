import Link from "next/link";
import type { Topic } from "@/lib/topics";

// Topic navigation as plain links to each topic hub (/topics/slug), so
// every view is server-rendered, shareable, and has its own canonical. Scrolls
// horizontally on narrow screens instead of wrapping into a wall.
export default function TopicChips({
  topics,
  active,
}: {
  topics: Topic[];
  active?: string;
}) {
  return (
    <nav aria-label="Topics" className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <ul className="flex w-max gap-2.5">
        <li>
          <Link href="/essays" className="chip" aria-current={!active ? "page" : undefined} scroll={false}>
            All
          </Link>
        </li>
        {topics.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/topics/${t.slug}`}
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
