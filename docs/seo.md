# Search and AI search: how this site earns citations

Operator follows the evidence in its own field guide, [Measured, Not Ranked](../public/guides/measured-not-ranked/index.html): answer engines cite sources they can safely repeat. That means checkable claims, corroboration, and first-hand work. Nothing here is a trick. Every item makes a page easier to verify.

## Per essay (enforced by `scripts/check-essays.mjs`)

- **`keyPoints`**: 2 to 4 answer-first sentences in frontmatter. Each one is a standalone claim with its number, date, or named source, and each must hold up without the rest of the essay. They render as "Key points" under the header and as the Article `abstract`.
- **`image`**: required, under 1 MB. Its alt text is the essay title.
- **`updated`**: set it whenever a fact changes. It drives the visible "Updated" line, `dateModified`, and the sitemap `lastmod`.

## Per essay (automatic)

- **Sources**: every external markdown link in the body becomes a numbered entry at the end and a `citation` in the JSON-LD. To cite something, link the phrase that makes the claim. Don't hand-write a separate "Sources" list.
- **Breadcrumbs**: Home > Essays > Topic > Essay, in JSON-LD.
- **More in {topic}**: two related essays at the end.

## Site structure

- **Topic hubs** at `/topics/[slug]`. Each one is indexable, has its own canonical and intro (`TOPIC_INTROS` in `lib/topics.ts`), and lists the topic's field guides and essays. Old `/essays?topic=` links get a 308 redirect from `proxy.ts`.
- **`/standards`**: sourcing rules, the corrections log, AI-use disclosure, and conflicts of interest. Referenced as `publishingPrinciples` and `correctionsPolicy` in the Organization JSON-LD. **Add a correction there the same day an essay is corrected.**
- **Entity graph**: the home page carries WebSite, Organization, and Person JSON-LD. Every Article points to it by `@id` (`/#website`, `/#organization`, `/about#person`).
- **Disclosure**: any essay that touches AgentCorp, Mālama Labs, or Beneficial Technology opens with a one-line disclosure. `/standards` promises it.

## Discovery

- `sitemap.xml` lists every page, hub, essay, and guide with a real `lastmod`.
- **IndexNow**: `.github/workflows/indexnow.yml` runs `scripts/indexnow.mjs` after every successful production deploy. The key file is `public/058180b9ecf9b12f564bb7b030ce6b06.txt`. It is public by design; IndexNow uses it to verify ownership. Use `node scripts/indexnow.mjs --dry-run` to see what would be sent.
- `proxy.ts` logs AI crawler hits and AI referrals. Filter the Vercel logs for `"aiseo"`.

## Deliberately not done

- **No `llms.txt`.** Server logs show 97% of these files get no AI crawler requests.
- **No FAQ or other AI-targeted schema.** The one controlled test found no citation lift.
- **No hidden text or "summarize with AI" prompts.** Microsoft catalogues these as an attack.

## Manual steps (owner)

1. Submit `https://operator.codes/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
2. Where an essay is syndicated to Medium, set its canonical link to the operator.codes URL.
3. Each month, check Search Console's Generative AI report and the `aiseo` logs.
