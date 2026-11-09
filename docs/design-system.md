# Operator design system: Ink

Monochrome on near-black. The words carry the page. Tokens live in
`app/globals.css`; fonts load in `app/layout.tsx`.

## Rules

1. **One primary action per view.** Primary is paper on ink (`.btn-primary`). Everything else is outlined (`.btn-secondary`) or a plain link.
2. **Color means state.** Moss (`--accent`) appears only for success and focus. No colored links, no colored buttons, no gradients for decoration.
3. **Nothing moves unless the reader asks.** Hover changes a border or an underline. The only entrance animation is the toast.
4. **Real text, not pictures of text.** Card thumbnails are typeset HTML (`TitlePlate`), so titles stay crisp, searchable, and free.
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

| Role | Face | Class | Use |
|---|---|---|---|
| Title | Instrument Serif 400 | `.type-title` + a clamp size | Page titles, essay titles, plate titles, CTA headline |
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
| `TitlePlate` | `components/cards/title-plate.tsx` | Topic pill + serif title on an ink plate with grain. 16:10. Light position derived from the slug, so plates are stable but never identical. Title size scales with the card through container units. |
| `PostCard` | `components/cards/post-card.tsx` | `variant="featured"`: plate, large title, two-line dek, meta. `variant="grid"`: plate, title, meta. The whole card is one link. |
| `TopicChips` | `components/cards/topic-chips.tsx` | `All` + one chip per essay `domain`. Plain links to `/essays?topic=slug`. Active chip inverts. |

### Layout
- **Archive** (`/essays`): serif title and dek, Subscribe at right, chips, featured 2-up (two newest), then "More essays" in a 3-column grid (2 on tablet, 1 on phone).
- **Home**: hero with inline subscribe, featured 2-up, next three in the grid, field guides list.
- Filtered views keep `/essays` as their canonical URL.

### Accessibility
- Plates are `aria-hidden`. The visible title under the plate is the link's name.
- Chips are a `nav` with `aria-current="page"` on the active one.
- Hover shows an underline on the title and brightens the plate border. Nothing else moves.

### Do and don't
| Do | Don't |
|---|---|
| Let the plate carry the title in serif, and the card heading repeat it in sans | Put a different headline on the plate than on the card |
| Keep essay hero illustrations inside the essay and in social cards | Mix photos and plates in one grid |
| Add a topic by setting `domain` in frontmatter | Hardcode topic lists |

---

## Retired
- `HeroGlobe` (ambient particle canvas) and the page-wide radial gradient: decoration that competed with the words.
- `EssayCard` (row layout): replaced by `PostCard`.
- Gradient primary button with glow and hover lift: replaced by the flat inverted pill.
- Syne and DM Mono: replaced by Instrument Serif, Geist, Geist Mono.
