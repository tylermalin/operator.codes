# operator.codes

Essay-first rebuild of Operator. Newsletter is the primary surface, Build Sessions is a CTA, not the whole site.

## Stack

Next.js (App Router) + TypeScript + Tailwind v4 + MDX, pnpm, deployed on Vercel.

## Structure

```
app/
  page.tsx              home: latest essays + framing
  essays/                essay archive + [slug] reader
  build-sessions/        compressed funnel page, one CTA
  apply/                 application form -> /api/apply
  subscribe/             email capture -> /api/subscribe
  api/                   route handlers, backend swappable without frontend changes
content/essays/*.mdx     essay source, frontmatter: title, description, date, domain
components/              nav, footer, subscribe-form
lib/essays.ts            reads + sorts content/essays
_legacy-static/          the old single-file HTML site, kept for reference only, not deployed
```

## Open decisions before launch

- [ ] ESP for /api/subscribe: currently a no-op logger. Pick Beehiiv, ConvertKit, or raw email forward.
- [ ] Backend for /api/apply: currently a no-op logger. Formspree ID `xpwzgvrl` referenced in the old LAUNCH.md was never wired to a real endpoint, that's unresolved independent of this rebuild.
- [ ] Real essay content. Only one seed post exists (`content/essays/truth-is-infrastructure.mdx`). Do not point DNS here with an empty archive.
- [ ] Decide whether the original 5-step apply wizard's step logic is worth porting verbatim, or whether the single-page version in `app/apply/page.tsx` is good enough.

## Dev

```
pnpm install
pnpm dev
```
