# Operator design system: Ink

Monochrome on near-black. The words carry the page. Tokens live in
`app/globals.css`; fonts load in `app/layout.tsx`.

## Rules

1. **One primary action per view.** Primary is paper on ink (`.btn-primary`). Everything else is outlined (`.btn-secondary`) or a plain link.
2. **Color means state.** Moss (`--accent`) appears only for success and focus. No colored links, no colored buttons, no gradients for decoration.
3. **Nothing moves unless the reader asks, with one exception.** Hover changes a border, an underline, or a 2.5% image zoom. The home hero headline blurs in word by word once on load (`BlurWords`, CSS only); the toast slides in. `prefers-reduced-motion` turns both off.
4. **Every essay has an image, and cards use it.** `scripts/check-essays.mjs` runs before every build and fails it if an essay has no `image`, the file is missing, or it is over 1 MB. `TitlePlate` is only a fallback.
6. **Glass needs something behind it.** `.glass` / `.glass-strong` (liquid glass: blurred fill, gradient stroke) are used over imagery and on floating layers only. Over light art, add `.glass-ink` so white text stays legible.
5. **Copy states facts.** UI copy never promises what the system doesn't do. The subscribe toast says a welcome email is coming because there is no confirm step.

## Tokens

| Group | Tokens | Notes |
|---|---|---|
| Surface | `--background` `#0b0b0c`, `--surface`, `--surface-2`, `--surface-3`, `--background-deep` | Plates sit on `--background-deep` |
| Line | `--border` 8%, `--border-md` 13%, `--border-hi` 24% | Paper at opacity, so lines read the same on any surface |
| Ink | `--foreground` `#edece8`, `--muted` `#9b9a95`, `--faint` `#66655f` | Muted passes 4.5:1 on background; faint is for separators and placeholders only |
| State | `--accent`, `--accent-light`, `--amber` (tier), `--red` (error) | |
| Radius | `--radius-card` 14px, `--radius-control` pill | |
| Motion | `--dur` 160ms, `--ease` | |

## Type

EB Garamond for anything you read as writing; Inter for anything you scan or click.

| Role | Face | Class | Use |
|---|---|---|---|
| Masthead | EB Garamond caps, 0.08em tracking, hairlines both sides | `.masthead` + `.type-title` | Home page only |
| Title | EB Garamond 400, -0.012em, 1.08 leading, old-style figures | `.type-title` + a clamp size | Page, essay, and card titles; CTA headlines |
| Dek | Inter, muted | `.type-dek` | One-sentence summary under a title |
| Meta | Inter 12px, 500, uppercase, 0.06em | `.type-meta` | "NOV 9, 2026 IN AI SYSTEMS", bylines, section labels |
| Body | EB Garamond 21px / 1.6, 64ch, centered column | `.prose-essay` | Essay text |
| Prose h2 / h3 | Garamond 500 30px / Inter caps label | in `.prose-essay` | Section heads / sub-labels |
| Tables, captions, embeds | Inter | in `.prose-essay` | Anything tabular or UI-like inside an essay |
| Code | Geist Mono | `code`, `pre` | Code only |
| UI | Inter 15px | Tailwind | Nav, buttons, chips, forms |

Essay headers are centered: meta line, title, dek, byline, share row between hairlines.

---|---|---|---|
| Title | EB Garamond 400 | `.type-title` + a clamp size | Page titles, essay titles, plate titles, CTA headline |
| Dek | Geist | `.type-dek` | One-sentence summary under a title |
| Body | Geist 19px / 1.75 | `.prose-essay` | Essay text, 66ch measure |
| Heading in prose | Geist 600 | `h2`, `h3` in `.prose-essay` | Sans so the outline scans |
| UI | Geist 15px | Tailwind | Nav, buttons, cards |
| Meta | Geist Mono 13px | `.type-meta` | Dates, read time, small labels |

---

## Pattern: Subscribe

### Problem
Subscribing lived in one inline form on the home page and at the end of essays. Readers on the archive or mid-site had no way in.

### Components
| Component | File | Use when |
|---|---|---|
| `SubscribeButton` | `components/subscribe/subscribe-button.tsx` | In chrome: nav, archive header. Opens a popover. |
| `NavSubscribe` | `components/subscribe/nav-subscribe.tsx` | Nav wrapper. Hides itself on pages with their own Subscribe (`/essays`, `/subscribe`) |
| `SubscribeForm` | `components/subscribe-form.tsx` | Inline: home hero, `/subscribe`, end of essay |
| `Toast` | `components/subscribe/toast.tsx` | Confirmation after any successful subscribe |
| `useSubscribe` | `components/subscribe/use-subscribe.ts` | Shared submit and error logic. Every surface uses it. |

### Props
| Component | Prop | Type | Default |
|---|---|---|---|
| `SubscribeButton` | `size` | `"sm" \| "md"` | `"md"` |
| `Toast` | `message`, `onDismiss`, `duration` | `string`, `() => void`, `number` | 6000ms |

### States
| State | Popover | Inline form |
|---|---|---|
| Default | Field + Submit (Submit disabled while empty) | Field + Subscribe (always enabled; browser validation handles empty) |
| Loading | "Subscribing…", disabled | Same |
| Error | Red line under the field, `role="alert"` | Same |
| Success | Popover closes, focus returns to button, toast shows | Form becomes "Subscribed as …", toast shows |

### Accessibility
- Button: `aria-expanded`, `aria-controls`. Popover: `role="dialog"` with a label.
- Opening focuses the field. Escape closes and returns focus. Clicking outside closes.
- Field has a visually hidden label. Errors are linked by `aria-describedby`.
- Toast is `role="status"`, `aria-live="polite"`, dismissible, auto-hides after 6s.

---

## Pattern: Post cards and title plates

### Problem
The archive was a single column of text rows with mixed illustration thumbnails. It didn't scan, and it gave no sense of breadth.

### Components
| Component | File | Notes |
|---|---|---|
| `TitlePlate` | `components/cards/title-plate.tsx` | Fallback only, for an essay without an image. Topic pill + serif title on an ink plate with grain. |
| `PostCard` | `components/cards/post-card.tsx` | Thumbnail is the essay hero image, 16:9, with the topic in an ink-glass pill top left. `variant="featured"`: large title, two-line dek, meta, `priority` loading. `variant="grid"`: title, meta. The whole card is one link. |
| `TopicChips` | `components/cards/topic-chips.tsx` | `All` + one chip per essay `domain`. Plain links to `/essays?topic=slug`. Active chip inverts. |

### Layout
- **Archive** (`/essays`): serif title and dek, Subscribe at right, chips, featured 2-up (two newest), then "More essays" in a 3-column grid (2 on tablet, 1 on phone).
- **Home**: hero with inline subscribe, featured 2-up, next three in the grid, field guides list.
- Filtered views keep `/essays` as their canonical URL.

### Accessibility
- Thumbnails have empty `alt`; the visible title under them is the link's name.
- Chips are a `nav` with `aria-current="page"` on the active one.
- Hover shows an underline on the title and brightens the plate border. Nothing else moves.

### Do and don't
| Do | Don't |
|---|---|
| Give every essay a hero image at 16:9, under 1 MB | Ship an essay without one (the build will stop you) |
| Reuse the first figure as the hero when it tells the story | Worry about duplication: the essay page skips the hero when the body already shows it |
| Add a topic by setting `domain` in frontmatter | Hardcode topic lists |

---

## Retired
- `HeroGlobe` (ambient particle canvas) and the page-wide radial gradient: decoration that competed with the words.
- `EssayCard` (row layout): replaced by `PostCard`.
- Typeset plates as the default thumbnail: replaced by essay images; kept as fallback.
- Gradient primary button with glow and hover lift: replaced by the flat inverted pill.
- Syne and DM Mono, then Instrument Serif and Geist: replaced by EB Garamond and Inter (Geist Mono kept for code).
- Topic pill over card images: topic moved into the uppercase meta line.

---

## Reviewed and declined (from the "liquid glass agency" landing prompt, Nov 2026)
- **Background videos** on third-party CDN URLs: unknown license, several MB per view, and they compete with reading.
- **Stat cards and a logo trust bar**: invented numbers and placeholder brands. Operator only shows claims it can source.
- **Italic serif for every heading**: kept for emphasis (the home hero's second sentence); roman stays the default because long essay titles read faster upright.
- **Framer Motion**: the one entrance needed is done in CSS, so no client animation library ships.

---

## Pattern: Interactive guides

Native guides live at `app/guides/<slug>` and use the guide kit in `components/guide/kit.tsx`. Roadmap and sourcing rules: `docs/guides-roadmap.md`.

| Component | Use |
|---|---|
| `Section` | Numbered section: meta label, Garamond heading, Inter dek |
| `Stat` | Big Garamond figure with label and a **required** source |
| `Cite` | Superscript `[n]` linking to the source list |
| `ToolFrame` | Bordered surface with a labeled header for each tool |
| `Note` | Small muted text under a tool: inputs vs. data, framework vs. fact, limits of the model |
| `Sources` | Numbered list; anchors match `Cite` |

Source registries (`lib/guides/<guide>.ts`) are typed with `satisfies SourceRegistry`, so a `Stat` or `Cite` with an unknown id fails the build. Guide pages emit Article JSON-LD with every source URL as a `citation`.
