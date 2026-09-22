# operator.codes

Essay-first newsletter, built as the first real deployment of a composable
Next.js/Supabase newsletter-and-monetization template. Build Sessions is a
CTA, not the whole site. Free content is fully open; preview and premium
essays gate behind a Stripe-backed pro tier.

## Stack

Next.js (App Router) + TypeScript + Tailwind v4 + MDX for content, Supabase
(auth + Postgres), Stripe (billing), Cloudflare R2 (digital downloads),
Upstash Redis (API rate limiting), pnpm, deployed on Vercel.

Every integration is null-safe when its env vars aren't set: the app builds
and runs with zero infra provisioned, and each unconfigured route fails with
a clear 503 instead of silently no-opping. See `.env.example` for the full
contract.

## Structure

```
app/
  page.tsx                    home: latest essays + framing
  essays/                     archive + [slug] reader, paywall-gated
  build-sessions/             compressed funnel page, one CTA
  apply/                      application form -> /api/apply
  subscribe/                  email capture -> /api/subscribe (writes to `subscribers`)
  login/                      magic-link sign in
  dashboard/                  tier status, upgrade CTA, API key manager
  auth/confirm/                exchanges magic-link code for a session
  api/
    subscribe/                writes subscribers table
    apply/                    still a no-op logger, not yet wired
    stripe/checkout/          creates a Checkout session for the pro tier
    stripe/webhook/           syncs profiles.tier on subscription events
    downloads/[productId]/    presigned R2 URL, gated on a purchases row
    keys/                     list + create API keys (SHA-256 hashed at rest)

content/essays/*.mdx          essay source; frontmatter: title, description,
                               date, domain, tier (free | preview | premium)
components/                   nav, footer, subscribe-form, key-manager, upgrade-button
lib/
  essays.ts                   reads + sorts content/essays
  paywall.ts                  tier -> access-level resolution, preview truncation
  auth.ts                     resolves the current viewer's tier server-side
  supabase/{client,server}.ts null-safe Supabase clients (browser + server + service-role)
  stripe.ts, r2.ts, rate-limit.ts, api-keys.ts
supabase/migrations/0001_init.sql   full schema + RLS policies
_legacy-static/               the original single-file HTML site, reference only, not deployed
```

## Schema deviations from the source PRD

The original PRD only specified `profiles`, `api_keys`, and `purchases`.
Two changes were made reconciling it against an actual newsletter's needs:

- **`subscribers` added.** The PRD's `profiles` table is 1:1 with
  `auth.users`, meaning every newsletter signup would require a full
  account. That's a conversion killer for a free email list. Free
  subscribes go into `subscribers` (email only); `profiles`/Auth is
  reserved for pro tier, API keys, and purchases.
- **`products` added.** `purchases.product_id` had nothing to reference
  in the original schema.

## Known tradeoff

Essay pages (`/essays/[slug]`) are `force-dynamic`, not statically
generated, because the paywall check depends on per-request session
state. That's real latency cost on every essay view versus serving
static HTML. Worth revisiting if free-tier essays (the majority of
content) end up needing to be fast and cacheable, since only
preview/premium essays actually need the dynamic check.

## Open decisions before launch

- [ ] Provision the actual infra: Supabase project, Stripe account + a
      real `STRIPE_PRO_PRICE_ID`, an R2 bucket, an Upstash Redis
      instance. None of this can be created from here, it needs real
      accounts and credentials.
- [ ] Run `supabase/migrations/0001_init.sql` against the provisioned project.
- [ ] Pick an ESP for actual newsletter dispatch. Capture (`/api/subscribe`
      writing to `subscribers`) works; sending the emails themselves
      doesn't exist yet. PRD mentions Resend or Loops.so.
- [ ] Backend for `/api/apply`: still a no-op logger. The Formspree ID
      (`xpwzgvrl`) referenced in the pre-rebuild `LAUNCH.md` was never
      wired to a real endpoint either, that gap predates this rebuild.
- [ ] Real essay content. Only one seed post exists. Do not point DNS
      here with an empty archive.
- [ ] Decide whether the original 5-step apply wizard is worth porting
      verbatim, or whether the current single-page version is good enough.
- [ ] Invoice-payment-failed handling in the Stripe webhook currently
      just logs, no downgrade action. Decide the grace-period policy
      before this matters in production.

## Dev

```
pnpm install
cp .env.example .env.local   # fill in what you have; everything else fails open/closed safely
pnpm dev
```
