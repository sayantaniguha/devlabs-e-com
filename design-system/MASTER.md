# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

> **This file documents an already-decided, locked token system.** It is a
> record of what exists in `src/app/globals.css`, `src/app/layout.js`, and the
> established component patterns — not a generated recommendation. Do not
> treat anything below as a starting point for alternative palettes, fonts,
> or styles; propose changes to the user first.

---

**Project:** DevLabs (developer-education merch + courses storefront, plus its admin panel)
**Source of truth:** `src/app/globals.css` (`dl-*` tokens), `src/app/layout.js` (font loading)
**Category:** E-commerce + Admin dashboard (two visitor modes, one token system)

---

## Global Rules

### Color Palette

All colors are CSS custom properties, defined once in `:root` (light) and re-declared in `.dark` (dark), then exposed to Tailwind via `@theme inline` in `src/app/globals.css`. `@theme inline` (not plain `@theme`) is required — Tailwind otherwise folds the reference to its light-mode value at build time and the dark override silently fails to apply.

| Role | Light | Dark | CSS Variable | Tailwind Utility |
|------|-------|------|--------------|-------------------|
| Page ground | `#EDEEEF` | `#0E1113` | `--dl-chalk` | `bg-dl-chalk` / `text-dl-chalk` |
| Goods plane (product/course imagery background, sampled from the photography seamless) | `#DCDFE1` | `#191D20` | `--dl-sheet` | `bg-dl-sheet` |
| Primary text + primary fill (inverted CTAs) | `#15181B` | `#E8EBED` | `--dl-ink` | `text-dl-ink` / `bg-dl-ink` |
| Secondary text | `#3A4045` | `#8A9298` | `--dl-charcoal` | `text-dl-charcoal` |
| Hairlines (borders, dividers) | `#C7CBCD` | `#2A3034` | `--dl-rule` | `border-dl-rule` / `divide-dl-rule` |
| Reserved accent — focus states, live/interactive affordances **only**, never decoration | `#E0350C` | `#FF4A1F` | `--dl-signal` | `outline-dl-signal` (focus rings) |
| Signal hover/active + the AA-safe variant for **small text** in the accent color (plain `--dl-signal` fails 4.5:1 as text — verified, not assumed) | `#B02A08` | `#FF6A42` | `--dl-signal-ink` | `text-dl-signal-ink` |
| Admin-only: success (status badges) | `#166840` | `#34C77E` | `--dl-success` | `text-dl-success` / `border-dl-success` |
| Admin-only: warning (status badges) | `#7A4E00` | `#E3A73D` | `--dl-warning` | `text-dl-warning` / `border-dl-warning` |

**Color notes:**
- The storefront (Persuade mode) is achromatic-plus-one-reserved-accent by design. `--dl-signal` is spent on focus rings and genuine live-data signals (cart count, low-stock count) — never as page decoration. Do not introduce additional hues on storefront surfaces.
- `--dl-success` / `--dl-warning` exist **only** for the admin panel's status-badge vocabulary (order status, stock status). They must never appear on a storefront/Persuade surface — see `pages/admin.md`.
- `--dl-sheet` was sampled from the product photography's light-grey seamless background specifically so photographed goods sit inside it without a visible seam.
- Old Material-derived tokens (`--color-secondary`, `--color-surface-container-*`, `--color-on-*`, etc., lines 5–53 of `globals.css`) are still present and still render on any component not yet migrated to `dl-*`. They are not part of this system going forward; do not add new usages of them.

### Typography

- **Sans (headings, body, UI labels, prices):** Archivo (variable), loaded via `next/font/google` with the `wdth` axis, exposed as `--font-dl-sans`. Self-hosted, no external `<link>`.
- **Mono (identifiers and measurements only — never words, never section labels, never prices):** Martian Mono, loaded the same way, exposed as `--font-dl-mono`. Substituted for the originally-specified Commit Mono, which has no Google Fonts entry and no local files in this repo — flagged, not silently swapped.
- **The mono rule, stated precisely:** mono renders SKU/order-number identifiers, stock counts, percentages, and genuine measurements (`22 left`, `DL-MTMJ6WQF-IZUD`, `+100.0%`). It never renders category names, status words, or prices — those are sans. This distinction was tightened deliberately after an earlier pass used mono for category *words*, which the "monospace as a costume for technical" anti-pattern flags.

**Type scale** (`--text-dl-*`, each a compound Tailwind utility carrying size + line-height + letter-spacing + weight together):

| Token | Size | Line-height | Tracking | Weight | Use |
|-------|------|-------------|----------|--------|-----|
| `--text-dl-nameplate` | 72px | 0.98 | -0.01em | 800 | Landing hero headline only. Rendered as a fluid `clamp(2.25rem, 5vw+1rem, 4.5rem)` on that one element (see Exceptions) — this token's fixed 72px value describes its **desktop** ceiling. |
| `--text-dl-headline` | 28px | 1.2 | -0.005em | 600 | Section headings (`Shop by Category`, `Revenue Overview`, dialog titles, product H1). |
| `--text-dl-body-lg` | 18px | 1.6 | 0 | 400 | Hero/lede paragraphs, product price display. |
| `--text-dl-body` | 15px | 1.6 | 0 | 400 | Default body text, nav links, form labels, table cells. |
| `--text-dl-spec` | 13px | 1.4 | 0.02em | 500 | Small caps labels, mono identifiers/counts, badge text. |

**Exceptions (documented, not accidents):**
- The landing hero H1 is the *only* element using fluid `clamp()` sizing instead of the fixed token value — a real mobile-overflow bug (confirmed via Playwright at 320/390px, not assumed) forced this. Every other heading in the system uses the fixed `--text-dl-*` scale. Do not generalize the clamp() pattern to other headings without a reason as concrete as this one.
- `[font-stretch:110%]`/`[font-stretch:125%]` (arbitrary values, not tokens) widen Archivo's variable `wdth` axis for the wordmark and hero headline specifically. Not applied elsewhere.

### Spacing Variables

Defined as `--spacing-*` in the original (pre-`dl-`) `@theme` block and still authoritative — the redesign did not introduce a new spacing scale, since these are layout mechanics, not brand expression.

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-stack-xs` | `4px` | Tightest gaps (icon-to-label). |
| `--spacing-stack-sm` | `8px` | Inline spacing, filter chip gaps. |
| `--spacing-stack-md` | `16px` | Standard component padding. |
| `--spacing-stack-lg` | `24px` | Section-internal padding, card padding. |
| `--spacing-stack-xl` | `48px` | Section-to-section vertical rhythm. |
| `--spacing-gutter` | `24px` | Grid/flex gap between cards. |
| `--spacing-margin-mobile` / `--spacing-margin-desktop` | `16px` / `32px` | Page-edge horizontal padding. |
| `--spacing-container-max` | `1280px` | Drives `max-w-container-max`. |
| `--spacing-dl-hairline` | `1px` | The base unit of the plates-and-rules system — rule thickness, not used for anything else. |

### Shape and Depth

This is the one place the system actively **departs** from generic defaults, and it is load-bearing, not incidental:

- **Radius: 0, site-wide.** No rounded corners anywhere in the `dl-*` system — cards, buttons, inputs, images, badges. This is a deliberate "specification sheet" identity choice from the original approved design plan, not an oversight.
- **No decorative shadows.** Product tiles, cards, and buttons carry no elevation. The only shadow token, `--shadow-dl-overlay` (`0 8px 24px -8px rgb(21 24 27 / 0.18)`), is reserved for functional overlays (dropdowns, modals) — never applied to a product tile or card.
- **Hairlines and plates replace cards.** Where a generic system would reach for a bordered/shadowed card, this system uses a `--dl-rule` hairline border or a `divide-dl-rule` divider, with `--dl-sheet` as the "goods plane" background where a surface is genuinely needed (e.g., behind a product photo).
- **Admin permanently-dark sidebar is the one exception to token-driven theming** — see `pages/admin.md`.

---

## Component Specs

These describe the actual patterns in use, not generic defaults.

### Buttons

```
Primary (inverted): bg-dl-ink text-dl-chalk, radius 0, no shadow, hover:opacity-90, active:scale-[0.98]
Secondary (outline): border border-dl-rule text-dl-ink, hover:border-dl-ink
Destructive: text-dl-signal-ink, no fill, hover:underline
All: focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2
```

There is no filled/colored secondary button and no rounded button anywhere in this system.

### Cards / Tiles (Product, Course)

```
No border, no shadow, no radius.
Image area: bg-dl-sheet
Caption area: bg-dl-chalk, border-t border-dl-rule
Category/level label: font-dl-sans text-dl-spec text-dl-charcoal uppercase (sans, NOT mono — see Typography)
Price: font-dl-sans text-dl-body font-semibold text-dl-ink tabular-nums
Sold-out: full-fidelity photo (no dimming/grayscale) + a bordered "Sold out" tag (border-dl-charcoal) replacing the price
Low-stock: a bordered "N left" tag (border-dl-signal-ink, mono, tabular-nums) — the one legitimate non-focus use of the reserved accent, since it's live inventory data
```

### Inputs (text, select, textarea, range, checkbox)

```
border border-dl-rule bg-dl-chalk text-dl-ink placeholder:text-dl-charcoal
focus:border-dl-signal (border-color change is the focus indicator for text-style inputs)
Native checkboxes/range sliders: accent-dl-ink (theme via accent-color, not hand-drawn replacements)
Custom toggle switches (no native equivalent exists): bg-dl-ink (on) / bg-dl-rule (off), knob bg-dl-chalk, focus-visible ring
```

### Modals / Drawers

```
Native <dialog> + showModal() — not a hand-rolled overlay div.
Gives a real focus trap, Escape-to-close, and focus-restore-to-trigger for free.
Initial focus is set with an explicit imperative .focus() call in the same
effect that calls showModal() — NOT the `autoFocus` prop. React's autoFocus
and showModal()'s own attribute-scanning fallback do not reliably compose on
every navigation path (confirmed bug, fixed in CartDrawer and ProductDrawer).
Backdrop: backdrop:bg-dl-ink backdrop:opacity-50 backdrop:backdrop-blur-sm (native ::backdrop, not a manually-stacked div)
```

---

## Style Guidelines

**Style:** Institutional / specification-sheet. The core idea: DevLabs merch is the school's insignia, courses are its curriculum, expressed through technical-documentation language (real specs, real counts, real identifiers) rather than collegiate iconography or generic SaaS card kits.

**Keywords:** achromatic, hairline, flat, spec-sheet, restrained accent, real-data-only.

**Explicitly rejected as generic defaults for this brief** (do not reintroduce without a new decision from the user):
- Kicker/eyebrow labels above headings — banned outright, not just discouraged.
- Decorative section numbers (`01 / 02 / 03`) unless the sequence itself is real information.
- Colored filled badges/pills as a default for any status that isn't genuinely multi-state (see the admin exception).
- Material Symbols or any icon-font dependency — icons are either words, plain Unicode characters for simple affordances (→, ×, +, −), or small authored single-stroke SVGs (`src/components/ui/icons.jsx`), never a font icon library.
- Mono font "for the technical feel" on anything that isn't an actual identifier or measurement.

### Page Pattern

Every page section follows the same two-layer structure: an outer full-bleed `<section>` carrying the background color/border, with an inner `max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop` div constraining content width. This keeps full-bleed color bands (trust bar, footer, admin sidebar) visually distinct from the narrower content column.

---

## Anti-Patterns (Do NOT Use)

- ❌ New hues on storefront surfaces (achromatic-plus-signal is the whole point).
- ❌ Rounded corners or shadows on any card/tile/button (radius 0, no elevation, is a locked decision).
- ❌ Mono font on category names, status words, section labels, or prices.
- ❌ A kicker/eyebrow line above any heading, even with real data behind it.
- ❌ Sequential numbering (`01/02/03`) as a decorative device.
- ❌ Material Symbols or any other icon font.
- ❌ `--dl-success` / `--dl-warning` outside the admin panel.
- ❌ A hand-rolled modal overlay where native `<dialog>` + `showModal()` will do.
- ❌ `autoFocus` prop for drawer/dialog initial focus — use an explicit `.focus()` call (see Modals / Drawers).

---

## Pre-Delivery Checklist

- [ ] Contrast ≥4.5:1 for body/small text, ≥3:1 for large text and non-text UI (verify computed hex pairs, not assumed)
- [ ] Every interactive element has a visible `focus-visible` ring in `--dl-signal`
- [ ] `prefers-reduced-motion` is respected — **currently not implemented anywhere; see audit findings**
- [ ] Responsive: 375px, 768px, 1024px, 1440px, no horizontal scroll
- [ ] Icon-only controls have an accessible name; decorative glyphs (including plain Unicode arrows) are hidden from the accessibility tree
- [ ] Chip/badge collections wrap rather than clip; long values disclosed, not truncated silently
- [ ] Sticky headers don't obscure keyboard focus after scroll (`scroll-padding-top` or equivalent) — **currently not implemented; see audit findings**
- [ ] Dark mode contrast checked independently, not inferred from light mode
- [ ] `radius: 0` and no decorative shadow on every new card/tile/button
