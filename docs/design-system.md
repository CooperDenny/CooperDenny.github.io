# Design system

Tokens, the one dark theme, layout rules, components and accessibility standards: everything you need to change how the site looks without breaking it.

## Contents

- [Principles](#principles)
- [Design tokens](#design-tokens)
- [One theme](#one-theme)
- [Layout and breakpoints](#layout-and-breakpoints)
- [Typography](#typography)
- [Components](#components)
- [Accessibility standards](#accessibility-standards)
- [Print](#print)
- [Stylesheets: what goes where](#stylesheets-what-goes-where)
- [Adding a token](#adding-a-token)

---

## Principles

1. **Tokens, not values.** Components never hard-code a colour, font or spacing value; they use a `var(--token)` from [`public/tokens.css`](../public/tokens.css). The deliberate exceptions are listed under [Deliberate fixed colours](#deliberate-fixed-colours).
2. **Mobile first.** Base styles are for a phone; `min-width` media queries add the larger layouts.
3. **Evidence first.** Layout decisions serve one goal: a recruiter sees the important things before they leave ([decision D06](decisions.md#d06-the-home-page-is-designed-against-drop-off)).
4. **Accessible by default.** AA contrast, 44px touch targets, keyboard-operable, respects reduced motion.

---

## Design tokens

All tokens live in [`public/tokens.css`](../public/tokens.css) on `:root`. They're loaded by the Next.js app (`@import` at the top of `app/globals.css`) and by every project page (`<link href="/tokens.css">`), so the whole site has exactly one palette.

### Colour

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0b1120` | Page background |
| `--bg-alt` | `#0f172a` | Alternating section background |
| `--surface` | `#131c31` | Cards |
| `--surface-2` | `#1a2540` | Chips, the metric panel, raised areas inside cards |
| `--border` | `#23304d` | Default borders; the empty part of a metric bar |
| `--border-strong` | `#2f3f63` | Ghost buttons, emphasised borders |
| `--text` | `#e8edf6` | Body text, headings |
| `--text-muted` | `#a3b0c5` | Secondary text |
| `--text-faint` | `#8090a8` | Tertiary text: dates, captions, labels |
| `--accent` | `#22d3ee` | Links, primary buttons, labels, metric values and bars |
| `--accent-strong` | `#67e8f9` | Primary button hover |
| `--accent-ink` | `#04222a` | Text on an `--accent` background |
| `--accent-soft` | `rgba(34, 211, 238, 0.12)` | Tinted backgrounds (badges) |
| `--nav-bg` | `rgba(19, 28, 49, 0.94)` | The sticky nav: translucent `--band` |
| `--code-bg` | `#070c18` | Code blocks on report pages |
| `--shadow` | dark shadow | Card elevation |

**The brand band.** The nav and the hero on every page are a band of raised navy, the same colour as cards, so the hero's curved edge shows against the page:

| Token | Value | Use |
|---|---|---|
| `--band` | `#131c31` | Band background (hero, mobile menu sheet) |
| `--band-text` | `#e8edf6` | Text on the band |
| `--band-muted` | `#a3b0c5` | Secondary text on the band (pitch, proof labels, nav links) |
| `--band-accent` | `#22d3ee` | Cyan on the band: primary buttons, first proof value, avatar ring, focus |
| `--band-accent-ink` | `#04222a` | Text on `--band-accent` |
| `--band-line` | `rgba(255, 255, 255, 0.14)` | Rules and outlines on the band |

On the band, always use the `--band-*` tokens, not `--accent`, so the band can change without touching the page palette.

### Type, shape and layout

| Token | Value | Use |
|---|---|---|
| `--font-sans` | Archivo, then system UI fonts | All text |
| `--display-stretch` | `125%` | Archivo's width for display text: `h1`, `h2`, the brand, proof and metric values |
| `--font-mono` | JetBrains Mono, then system monospace | Code only |
| `--radius` / `--radius-sm` | `10px` / `6px` | Cards / small elements (buttons and chips stay full pills) |
| `--tap` | `44px` | Minimum touch-target size |
| `--container` | `1080px` | Max content width (home page) |
| `--gutter` | `16px` → `24px` at ≥ 600px | Horizontal page padding |
| `--nav-h` | `56px` → `64px` at ≥ 861px | Sticky nav height (also offsets anchor scrolling) |
| `--section-y` | `48px` → `64px` → `80px` | Vertical section padding |

Project pages add one local token, `--cd-wrap: 860px`, a narrower reading column defined in `public/projects/site.css`.

---

## One theme

The site has **one dark theme**: no light mode, no theme switch, and no theme script ([decision D25](decisions.md#d25-one-dark-theme)). `:root` sets `color-scheme: dark`, so form controls and scrollbars match.

- **Browser chrome.** `<meta name="theme-color">` is the `--band` navy (read from `tokens.css` at build time, never hard-coded), so the browser bar runs into the nav.
- **Don't add a light theme back** without reversing D25: it would need a second value for every colour, a no-flash script in every page's `<head>`, and toggles in both kinds of nav.

### Contrast

Every text colour meets **WCAG AA (≥ 4.5:1)** against every background it's used on. The tightest pairs:

| Pair | Ratio |
|---|---|
| `--text-faint` on `--surface-2` | 4.68:1 |
| `--text-faint` on `--surface` | 5.23:1 |
| `--text-faint` on `--bg-alt` | 5.50:1 |
| `--accent` on `--surface-2` | 8.40:1 |
| `--accent-ink` on `--accent` (buttons) | 9.17:1 |

On the band: `--band-text` 14.44:1, `--band-muted` 7.73:1, `--band-accent` 9.39:1, and `--band-accent-ink` on `--band-accent` 9.17:1.

If you change a colour, re-check it against `--bg`, `--bg-alt`, `--surface` and `--surface-2`, for example with the [WebAIM contrast checker](https://webaim.org/resources/contrastchecker/).

### Deliberate fixed colours

These don't follow the page palette, on purpose:

| Element | Why |
|---|---|
| The nav and hero: `--band-*` | The brand band has its own palette |
| Logo tiles (`.job__logo`): white | Organisation logos are designed for light backgrounds |
| The résumé sheet (`.resume`): black on white | It's paper; it must print correctly and look like a document |
| Report plots (`.cd-report .section img`): white background | ggplot output has a white background baked in |

---

## Layout and breakpoints

| Breakpoint | Meaning | Typical changes |
|---|---|---|
| base (< 600px) | Phones | Single column, compact hero with a 68px round avatar, 2×2 proof strip, hamburger menu, sticky action bar |
| `min-width: 600px` | Large phones, small tablets | Wider gutters, two-column project grid, roomier cards |
| `min-width: 861px` | Desktop | Inline nav, large round portrait, 4-up proof strip, 3-column grid, sticky bar hidden |

One component-specific exception: on project pages, the nav's "Projects" label collapses to its arrow icon below 420px, so the nav fits a 320px screen.

Every layout must work from **320px to 1440px wide with no horizontal scroll**. That's checked as part of [verification](development.md#verifying-layout).

---

## Typography

- **Archivo** for all text. `h1`, `h2`, the nav brand and the big numbers (proof and metric values) use its expanded width (`font-stretch: var(--display-stretch)`, 125%) at weight 800; everything else is normal width. Numbers use `tabular-nums`. **JetBrains Mono** is for code only, on every page. Both come from Google Fonts via `<link>`; the URL is in `config/site.json` ([D05](decisions.md#d05-fonts-load-via-link-icons-are-inline-svg), [D24](decisions.md#d24-navy-band-cyan-accent-and-archivo)).
- Headings use `text-wrap: balance`, and paragraphs `text-wrap: pretty`, to avoid orphans.
- **Code ligatures are off** in code blocks, so R's `<-` and `%>%` show as typed rather than as arrow glyphs.
- Small uppercase labels (`.eyebrow`, `.kicker`, sans, letter-spaced) introduce sections and cards.

---

## Components

Home-page and résumé styles live in `app/globals.css`, in BEM-style blocks (`.block__element--modifier`). The main building blocks:

| Class | Component | Notes |
|---|---|---|
| `.btn` + `--primary` / `--ghost` / `--small` / `--icon` | `ui/ActionLink` | Pill button, at least 44px tall; `--icon` is square |
| `.chips` / `.chip` (+ `--lg`) | `ui/Chips` | Tag lists |
| `.bullets` | `ui/Bullets` | Accent-square bullets |
| `.card` | — | Surface, border, radius, shadow |
| `.section` (+ `--alt`) | `ui/Section` | Alternate `--alt` between neighbouring sections |
| `.eyebrow`, `.kicker` | — | Uppercase, letter-spaced labels |
| `.hero` (+ `::before`) | Hero | The navy band: curved bottom edge, faint footy-oval lines (an inline SVG background) |
| `.job__logo` (+ `--wide`) | `ui/Logo` | White logo tile |
| `.proof`, `.metrics`, `.disclosure` | Hero, FeaturedProjectCard | Proof strip (ruled, first value in cyan), metric panel (label, bar for percentages, value), `<details>` panel |
| `.project__link::after` | ProjectCard | Stretched link: the whole card is clickable |
| `.mobile-cta` (+ `--shown`) | MobileCta | Fixed bottom bar on phones; reserves `env(safe-area-inset-bottom)` |
| `.bio`, `.bio__link` | LinkInBio | `/links/`: 480px column, 58px-tall link buttons, safe-area padding for notched phones |

Project pages use the same vocabulary with a `cd-` prefix (`.cd-btn`, `.cd-chips`, `.cd-glance`, …), defined in `public/projects/site.css`. Hand-page bodies also have building blocks for figures, system maps, cards, timelines, bar charts and screenshot galleries, listed in [Project pages → Body building blocks](project-pages.md#body-building-blocks). Charts use one hue (`--accent`) and keep their text in the text tokens. The project header (`.cd-hero`) and nav are on the navy band like the home hero, so anything inside them uses the `--band-*` tokens. The prefix is needed because the R Markdown reports load Bootstrap 3, which already defines `.btn`, `.nav` and others ([decision D02](decisions.md#d02-project-pages-are-static-html-not-react)).

---

## Accessibility standards

| Standard | How it's met |
|---|---|
| Contrast ≥ 4.5:1 | Token palette checked ([table above](#contrast)) |
| Touch targets ≥ 44px | `--tap` on every button, nav link and menu toggle; whole project cards are links |
| Keyboard | Everything is a real `<a>` or `<button>`; visible `:focus-visible` outline; Escape closes the mobile menu |
| Skip link | "Skip to content" is the first focusable element on every page with a nav; `/links/` has none, because there is nothing to skip |
| Screen readers | Icon-only buttons have `aria-label`; decorative SVGs are `aria-hidden`; the menu button has `aria-expanded` / `aria-controls`; the hidden sticky bar is `aria-hidden` with `tabindex="-1"` |
| Reduced motion | `prefers-reduced-motion` turns off smooth scrolling and transitions |
| Works without JavaScript | No content is hidden until scripts run ([decision D08](decisions.md#d08-no-scroll-triggered-reveal-animations)) |
| Zoom / text size | Relative units for type; no fixed-height text containers |

---

## Print

`/resume` prints on **at most two A4 pages** (`@page { size: A4; margin: 10mm 13mm }`, 10pt body type). Résumé items and section headings avoid page breaks (`break-inside` / `break-after: avoid`), so no entry splits across pages. In print, the nav, footer, sticky bar and toolbar are hidden, and the sheet loses its card styling. If you add content, check the page count: see [Development](development.md#checking-the-résumés-page-count).

---

## Stylesheets: what goes where

| File | Loaded by | Contains |
|---|---|---|
| `public/tokens.css` | Every page | Tokens only: the palette and the breakpoint overrides |
| `app/globals.css` | Home, résumé (bundled by Next) | Reset, base, components, print |
| `public/projects/site.css` | Project pages | Shared project-page chrome (`cd-` classes) |
| `public/projects/report.css` | Report pages only | Overrides for pandoc, Bootstrap 3 and DataTables, scoped to `.cd-report` |

Tailwind is installed, but its preflight reset is disabled and existing components don't use utilities. Prefer extending the semantic classes ([decision D03](decisions.md#d03-tailwind-preflight-is-disabled)).

---

## Adding a token

1. Add it to `:root` in [`public/tokens.css`](../public/tokens.css).
2. Check contrast if text will sit on it, or it will sit behind text.
3. Use it as `var(--name)` in any stylesheet.
4. Run `python3 scripts/build-project-pages.py --check`. Token changes don't alter project-page HTML, but the check confirms nothing else drifted.
