# Admin Panel Page Overrides

> **PROJECT:** DevLabs
> **Page Type:** Operate mode (dashboard, inventory, orders, product editing) — distinct from the storefront's Persuade mode

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules (type scale, spacing, shape/depth, component specs for inputs and modals), refer to the Master — the admin panel uses them unchanged.

---

## Page-Specific Rules

### Sidebar: permanently dark, not theme-reactive

The admin sidebar (`AdminSidebar.jsx`) stays dark regardless of the site's light/dark toggle — the classic fixed-dark-chrome dashboard pattern (Vercel, Linear, GitHub), and part of the originally-approved "fixed dark sidebar" structural plan.

This means its colors are **hardcoded literal hex values**, not the swappable `dl-*` Tailwind classes:

| Role | Value | Note |
|------|-------|------|
| Background | `#15181B` | The light-mode value of `--dl-ink`, used as a permanent dark ground |
| Primary text | `#EDEEEF` | The light-mode value of `--dl-chalk` |
| Muted text | `#8A9298` | The **dark**-mode value of `--dl-charcoal` (calibrated for text on a dark ground) |
| Hairlines | `#2A3034` | The dark-mode value of `--dl-rule` |
| Active nav indicator | `#FF4A1F` | The dark-mode value of `--dl-signal` (calibrated for contrast against dark) |

Using the theme-reactive class names here would be wrong: e.g. `text-dl-charcoal` resolves to `#3A4045` in light site-mode, which is illegible against this permanently-dark background. Contrast for this exact palette was verified directly (not inherited from the light/dark pair checks): chalk-on-ink 15.34:1, muted-charcoal-on-ink 5.64:1, signal-on-ink 5.31:1 — all pass 4.5:1.

Everything else in the admin panel (topbar, page background, tables, drawer) **does** follow the normal site-wide light/dark toggle via the standard `dl-*` classes.

### Status badge color vocabulary (the reason `--dl-success` / `--dl-warning` exist)

`OrderStatusBadge` and `StockStatusBadge` are the one place in the whole product that uses a real multi-tone semantic system, by explicit user decision (asked before adding these two tokens — they are not a default reach).

**Order status → tone mapping:**

| Status | Tone | Token |
|--------|------|-------|
| `paid`, `shipped`, `delivered` | success | `--dl-success` |
| `processing` | warning | `--dl-warning` |
| `pending` | neutral | `--dl-rule` / `--dl-charcoal` (no new hue) |
| `cancelled`, `refunded`, `payment_failed` | danger | `--dl-signal-ink` (reused, not a new token) |

**Stock status:** `out of stock` → danger (`--dl-signal-ink`), `low stock` → warning (`--dl-warning`), `in stock` → success (`--dl-success`).

All badges render as a bordered tag (`border + font-dl-mono text-dl-spec uppercase tracking-wide`), not a filled/colored pill — consistent with the Master's hairline-over-shadow shape language even where color vocabulary expands.

**These two tokens must never appear on a storefront page.** The storefront's low-stock/sold-out tags reuse the existing `--dl-signal-ink` precisely so the achromatic-plus-signal rule holds there.

### Density

Admin tables use tighter vertical rhythm than storefront cards: `py-3` per table cell (not the Master's `stack-lg`/`stack-md` defaults), matching Operate-mode's denser, scan-first information density versus the storefront's more generous Persuade-mode spacing. Table header rows use `bg-dl-sheet` to separate them from body rows.

Order-number (mono identifier) and date cells use `whitespace-nowrap` — the table wrapper already scrolls horizontally (`overflow-x-auto`), so letting a column size to its content reads better than an awkward mid-token wrap. This was a real fix during build (both columns wrapped across 2–3 lines before).

### Typography scale usage

Follows Operate-mode guidance from the Master's linked UX skill: a single family (Archivo) carries headings, labels, body, and data — no second display face is introduced for the admin panel, and no fluid/`clamp()` sizing is used anywhere here (unlike the storefront landing hero's documented exception) — dashboard headings use the fixed `--text-dl-headline` token directly.

### Icons

Admin-specific icon usage follows the Master's rule (words or small authored SVGs, never Material Symbols): sidebar nav items are plain text links (no icons at all — dropped entirely rather than replaced, since the labels alone are unambiguous), and the only SVGs in this surface are the shared `CloseIcon` (drawer/close, remove-variant, remove-image) and the shared `SunIcon`/`MoonIcon` (theme toggle, shared with the storefront navbar).

## Page-Specific Components

- **Add/Edit Product Drawer** — native `<dialog>`, per the Master's Modals spec. Verified with a real authenticated session: focus trap holds (Tab cycles through name → description → category → price fields → variant rows → Save, never escapes to the page behind it), Escape closes it and returns focus to whichever control opened it (the sidebar "+ New Product" link or a table row's "Edit" link).
- **Revenue chart bars** — plain `div`s with an inline `style={{ height: '${pct}%' }}`, colored `bg-dl-ink` (current day) / `bg-dl-rule` (other days). No charting library. This uses the Master's spacing/color tokens but has no separate "chart" component spec in the Master since the storefront has no charts.

## Recommendations

- If the admin panel ever needs a genuinely dense, high-row-count table (100+ orders), revisit `--spacing-stack-*` usage in table cells specifically — the current `py-3` was chosen for the current data volumes, not stress-tested against a long list.
