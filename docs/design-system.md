# Design system

"Test match day": tokens, the one light theme, layout rules, components, motion and accessibility standards. Everything you need to change how the site looks without breaking it.

## Contents

- [Principles](#principles)
- [Design tokens](#design-tokens)
- [One theme](#one-theme)
- [Layout and breakpoints](#layout-and-breakpoints)
- [Typography](#typography)
- [The hero](#the-hero)
- [Components](#components)
- [Motion](#motion)
- [Accessibility standards](#accessibility-standards)
- [Print](#print)
- [Stylesheets: what goes where](#stylesheets-what-goes-where)
- [Adding a token](#adding-a-token)

---

## Principles

1. **Tokens, not values.** Components never hard-code a colour, font or spacing value; they use a `var(--token)` from [`public/tokens.css`](../public/tokens.css). The deliberate exceptions are listed under [Deliberate fixed colours](#deliberate-fixed-colours).
2. **Mobile first.** Base styles are for a phone; `min-width` media queries add the larger layouts.
3. **Evidence first.** Layout decisions serve one goal: a recruiter sees the important things before they leave ([decision D06](decisions.md#d06-the-home-page-is-designed-against-drop-off)).
4. **Accessible by default.** AA contrast, 44px touch targets, keyboard-operable, respects reduced motion, and nothing moves for more than five seconds (so nothing needs a pause button).
5. **Cricket, not costume.** The sport shows up in the details (a ball, a seam, a crease, the delivery underline), never as slang or fake scores.

---

## Design tokens

All tokens live in [`public/tokens.css`](../public/tokens.css) on `:root`. They're loaded by the Next.js app (`@import` at the top of `app/globals.css`) and by every project page (`<link href="/tokens.css">`), so the whole site has exactly one palette.

### Colour

| Token | Value | Use |
|---|---|---|
| `--bg` | `#fbfcfa` | Page background: a cool flannel white, never cream |
| `--bg-alt` | `#f1f4ef` | Alternating section background |
| `--surface` | `#ffffff` | Cards |
| `--surface-2` | `#eaefe7` | Chips, metric rows, raised areas inside cards |
| `--border` / `--border-strong` | `#dbe2d8` / `#c3cdc0` | Decorative borders and rules only |
| `--control-line` | `#7a877c` | Ghost-button and toggle edges (3:1 or more on every surface) |
| `--text` | `#0f1f17` | Body text, headings: turf ink |
| `--text-muted` | `#3d4d43` | Secondary text |
| `--text-faint` | `#5b6a60` | Tertiary text: dates, captions, labels |
| `--accent` | `#16305c` | Navy: links, primary buttons, labels, metric values and bars, bullets |
| `--accent-strong` | `#24467f` | Primary button hover |
| `--accent-ink` | `#ffffff` | Text on `--accent` |
| `--accent-soft` | `rgba(22, 48, 92, 0.08)` | Tinted backgrounds (badges) |
| `--focus` | `#0f1f17` | Focus rings |
| `--ball` / `--ball-shine` / `--ball-shade` | `#b3122b` / `#e0566a` / `#5e0914` | The leather ball. **The only red on the site**: the cricket ball and the footy, nothing else |
| `--ball-seam` | `#fff3e0` | The stitched seam on the hero's SVG ball (`ui/CricketBall`); decorative only |
| `--nav-bg` | `rgba(251, 252, 250, 0.88)` | The sticky nav and phone action bar: translucent `--band` |
| `--hover-tint` | `rgba(15, 31, 23, 0.05)` | Hover wash on ghost buttons and nav links |
| `--mow` | `#f2f5ef` | Faint mowing stripes behind project headers; decorative only |
| `--code-bg` | `#f4f6f2` | Code blocks on project pages |
| `--shadow` / `--shadow-glow` | soft green-grey / navy ring | Card elevation / hover lift |

**The band.** The nav (and the mobile menu sheet) sit on a band that is the same white as the page:

| Token | Value | Use |
|---|---|---|
| `--band` | `#fbfcfa` | Band background (nav, mobile menu sheet) |
| `--band-text` / `--band-muted` | `#0f1f17` / `#3d4d43` | Text on the band |
| `--band-accent` / `--band-accent-ink` | `#16305c` / `#ffffff` | Primary buttons, the live dot |
| `--band-line` | `rgba(15, 31, 23, 0.12)` | Rules on the band |

On the band, always use the `--band-*` tokens, not `--accent`, so the band can change without touching the page palette. `--band` is also read for `theme-color` and by the project pages, so changing it changes the browser bar and every project header too.

**The hero.** The home hero is a deep navy band under the light nav ([D31](decisions.md#d31-the-hero-is-a-navy-band)). In the hero, use only these:

| Token | Value | Use |
|---|---|---|
| `--hero` | `#0f2142` | Hero background, and the gap round the photo |
| `--hero-text` | `#ffffff` | Name, headline, the delivery rule, the photo's ring, focus outlines (15.95:1) |
| `--hero-muted` | `#c3cee0` | Pitch and the location tag (10.05:1) |
| `--hero-line` | `rgba(255, 255, 255, 0.5)` | Ghost-button and tag outlines (about 5:1 as an edge) |
| `--hero-accent` / `--hero-accent-ink` | `#ffffff` / `#16305c` | The primary CV button and the role tag: white with navy text (13.03:1) |
| `--hero-accent-hover` / `--hero-hover` | `#dfe6f1` / `rgba(255, 255, 255, 0.1)` | Primary and ghost button hover |
| `--hero-glow` | `rgba(255, 255, 255, 0.06)` | A soft light behind the photo; decorative only |

The red ball is 2.3:1 on `--hero`; it's decoration (`aria-hidden`), and its shine and drop shadow carry it.

### Type, shape, motion and layout

| Token | Value | Use |
|---|---|---|
| `--font-display` | Barlow Condensed (700–900), then Arial Narrow | `h1`, `h2`, the brand and metric values; always upper case |
| `--font-sans` | Barlow (400–700), then system UI fonts | All other text |
| `--font-mono` | IBM Plex Mono (500–600), then system monospace | Labels, dates, chips, stack lists and code |
| `--radius` / `--radius-sm` | `12px` / `6px` | Cards / small elements |
| `--radius-pill` | `999px` | Buttons, chips and tags are always full pills |
| `--ease-out` / `--ease-ball` | cubic-béziers | General easing / a ball decelerating |
| `--dur-fast` / `--dur` | `160ms` / `280ms` | Colour changes / movement |
| `--tap` | `44px` | Minimum touch-target size |
| `--container` | `1120px` | Max content width (home page) |
| `--gutter` | `16px` → `24px` at ≥ 600px | Horizontal page padding |
| `--nav-h` | `56px` → `64px` at ≥ 861px | Sticky nav height (also offsets anchor scrolling) |
| `--section-y` | `48px` → `64px` → `80px` | Vertical section padding |

Project pages add one local token, `--cd-wrap: 860px`, a narrower reading column defined in `public/projects/site.css`.

---

## One theme

The site has **one light theme**: no dark mode, no theme switch, and no theme script ([decision D26](decisions.md#d26-test-match-day-light-theme-playhq-type-and-a-photo-hero)). `:root` sets `color-scheme: light`.

- **Browser chrome.** `<meta name="theme-color">` is `--band` (read from `tokens.css` at build time, never hard-coded), so the browser bar runs into the nav.
- **Don't add a dark theme back** without reversing D26: it would need a second value for every colour, a no-flash script in every page's `<head>`, and toggles in both kinds of nav.

### Contrast

Every text colour meets **WCAG AA (≥ 4.5:1)** against every background it's used on. The tightest pairs:

| Pair | Ratio |
|---|---|
| `--text-faint` on `--surface-2` | 4.90:1 |
| `--text-faint` on `--bg-alt` | 5.15:1 |
| `--text-faint` on `--code-bg` | 5.25:1 |
| `--text-muted` on `--surface-2` | 7.69:1 |
| `--accent-ink` on `--accent-strong` (button hover) | 9.30:1 |
| `--accent` on `--surface-2` | 11.17:1 |

Non-text edges: `--control-line` is 3.39:1 on `--bg-alt` and 3.76:1 on `--surface`.

If you change a colour, re-check it against `--bg`, `--bg-alt`, `--surface`, `--surface-2` and `--code-bg`, for example with the [WebAIM contrast checker](https://webaim.org/resources/contrastchecker/).

### Deliberate fixed colours

| Element | Why |
|---|---|
| The ball: `--ball-*` | Red is reserved for the leather ball so it stays special |
| Report plots (`.cd-report .section img`): white background | ggplot output has a white background baked in |

---

## Layout and breakpoints

| Breakpoint | Meaning | Typical changes |
|---|---|---|
| base (< 600px) | Phones | Compact hero: 72px round photo beside the tags, the name on one line, single column, hamburger menu, sticky action bar |
| `min-width: 600px` | Large phones, small tablets | 88px photo, two-column project grid |
| `min-width: 861px` | Desktop | 240px photo beside the copy, inline nav, 3-column grid, sticky bar hidden |

One component-specific exception: on project pages, the nav's "Projects" label collapses to its arrow icon below 420px, so the nav fits a 320px screen.

Every layout must work from **320px to 1440px wide with no horizontal scroll**. That's checked as part of [verification](development.md#verifying-layout).

---

## Typography

- **PlayHQ's type family.** Barlow for text and Barlow Condensed for display, the family PlayHQ's participant portal uses; IBM Plex Mono for data. All three come from Google Fonts via `<link>`; the URL is in `config/site.json` ([D05](decisions.md#d05-fonts-load-via-link-icons-are-inline-svg), [D26](decisions.md#d26-test-match-day-light-theme-playhq-type-and-a-photo-hero)). PlayHQ's paid display face (Athletics) is not used.
- Display type (`h1`, `h2`, the brand, big numbers) is Barlow Condensed, upper case, weight 800–900, tight line height. Numbers use `tabular-nums`.
- Small labels (dates, chips, stack lists, skill groups, the hero tags) are IBM Plex Mono, upper case where they're labels, letter-spaced 0.12em.
- Headings use `text-wrap: balance`, and paragraphs `text-wrap: pretty`, to avoid orphans.
- **Code ligatures are off** in code blocks, so R's `<-` and `%>%` show as typed.

---

## The hero

The home hero (`components/home/Hero.tsx`) is server-rendered and deliberately quiet ([D28](decisions.md#d28-a-quieter-hero-and-shorter-sections), [D29](decisions.md#d29-the-hero-is-a-profile-picture-not-match-photos)), on a navy band (D31):

1. **The profile picture** (`profile.portrait`): a round crop with a navy gap and a white ring. On phones it sits beside the role and location tags at 72px (88px from 600px), served from the 160px `hero-avatar.webp` through `srcset`; on desktop it is 240px, beside the copy, from the 480px `hero-image.webp`.
2. **The copy**: the role and location tags (a white pill and an outlined one), the name in display type on **one line**, the headline, the pitch and the actions: CV, LinkedIn (labelled, since it's the fastest way to reach Cooper), and Email and GitHub as icons.

The hero is kept short on purpose: about 465px on a 390px phone and 445px on desktop, so the next section starts on the first screen. Every piece is a direct grid item of `.hero__inner`, placed by `grid-template-areas` at each breakpoint.
3. **The delivery underline**: the name's second line carries a white rule that draws as an SVG cricket ball (`ui/CricketBall`, with a curved stitched seam) rolls in and comes to rest just past its end. It plays once, in under two seconds, so the hero needs no pause button.

There is no photo masthead, tracking overlay, chart console, HUD, proof strip or core-stack line any more (D28, D29). The portrait is data in `content/profile.ts`; see [Editing content](editing-content.md#the-profile-picture).

---

## Components

Home-page and CV styles live in `app/globals.css`, in BEM-style blocks (`.block__element--modifier`). The main building blocks:

| Class | Component | Notes |
|---|---|---|
| `.btn` + `--primary` / `--ghost` / `--small` / `--icon` | `ui/ActionLink` | Pill button, at least 44px tall (`--small` keeps a 44px hit area); primary lifts with `--shadow-glow` |
| `.chips` / `.chip` (+ `--lg`) | `ui/Chips` | Mono tag lists |
| `.bullets` | `ui/Bullets` | Navy ball bullets |
| `.card` | — | Surface, border, radius, shadow |
| `.section` (+ `--alt`) | `ui/Section` | One heading, no label above it; `.section__header` ends in **the crease**: a hairline with one short tick |
| `.hero__photo` | Hero | The round profile picture with its white ring |
| `.tag` (+ `--ghost`), `.live` | Hero | Role and location tags: a white pill and an outlined one; the breathing dot. `.hero .btn--*` invert the buttons for the navy band |
| `.delivery` | Hero + `ui/CricketBall` | The name's underline: a rule that draws as the SVG ball rolls to rest just past its end |
| `.metrics` | FeaturedProjectCard | Metric rows (label, bar for percentages, value) |
| `.project` (+ `::before` / `::after`) | ProjectCard | **The seam**: a stitched navy line draws across the top on hover, the ball riding it; the whole card is a link |
| `.job__logo` (+ `--wide`) | `ui/Logo` | White logo tile |
| `.mobile-cta` (+ `--shown`) | MobileCta | Fixed bottom bar on phones; reserves `env(safe-area-inset-bottom)` |
| `.bio`, `.bio__link` | LinkInBio | `/links/`: 480px column, 58px-tall link buttons, safe-area padding |

Project pages use the same vocabulary with a `cd-` prefix (`.cd-btn`, `.cd-chips`, `.cd-glance`, …), defined in `public/projects/site.css`. Their header (`.cd-hero`) is the light band with faint mowing stripes, a display-type title and a CSS-only delivery underline (a navy rule that draws, the ball at its end). Hand-page bodies also have building blocks for figures, system maps, cards, timelines, bar charts and screenshot galleries, listed in [Project pages → Body building blocks](project-pages.md#body-building-blocks). The prefix is needed because the R Markdown reports load Bootstrap 3, which already defines `.btn`, `.nav` and others ([decision D02](decisions.md#d02-project-pages-are-static-html-not-react)).

---

## Motion

- CSS animates **transform and opacity of decoration only**, and plays on first paint. Text never waits on JavaScript or an animation to appear ([D08](decisions.md#d08-no-scroll-triggered-reveal-animations)): the name rises from an offset, never from invisible.
- The hero needs no JavaScript at all: its only motion is CSS that plays once on load (the name rising, the ball rolling in).
- Nothing moves for more than five seconds, so there is no pause button. Anything added that does must come with one (WCAG 2.2.2).
- `prefers-reduced-motion: reduce` lands every animation on its final frame.

---

## Accessibility standards

| Standard | How it's met |
|---|---|
| Contrast ≥ 4.5:1 | Token palette checked ([table above](#contrast)) |
| Touch targets ≥ 44px | `--tap` on every button, nav link, menu toggle; whole project cards are links |
| Keyboard | Everything is a real `<a>` or `<button>`; visible `:focus-visible` outline; Escape closes the mobile menu |
| Pause, stop, hide | Nothing moves for more than five seconds, so no control is needed |
| Skip link | "Skip to content" is the first focusable element on every page with a nav; `/links/` has none |
| Screen readers | The profile picture has alt text; the delivery ball is `aria-hidden`; icon-only buttons have `aria-label`; the hidden sticky bar is `aria-hidden` with `tabindex="-1"` |
| Reduced motion | See [Motion](#motion) |
| Works without JavaScript | No content is hidden until scripts run ([decision D08](decisions.md#d08-no-scroll-triggered-reveal-animations)) |
| Zoom / text size | Relative units for type; no fixed-height text containers |

---

## Print

`/cv/` prints on **at most two A4 pages** (`@page { size: A4; margin: 10mm 13mm }`, 10pt body type). CV items and section headings avoid page breaks (`break-inside` / `break-after: avoid`), so no entry splits across pages. In print, the nav, footer, sticky bar and toolbar are hidden, and the sheet loses its card styling. If you add content, check the page count: see [Development](development.md#checking-the-cvs-page-count).

---

## Stylesheets: what goes where

| File | Loaded by | Contains |
|---|---|---|
| `public/tokens.css` | Every page | Tokens only: the palette and the breakpoint overrides |
| `app/globals.css` | Home, CV, `/links/` (bundled by Next) | Reset, base, components, hero, print |
| `public/projects/site.css` | Project pages | Shared project-page chrome (`cd-` classes) |
| `public/projects/report.css` | Report pages only | Overrides for pandoc, Bootstrap 3 and DataTables, scoped to `.cd-report` |

Tailwind is installed, but its preflight reset is disabled and existing components don't use utilities. Prefer extending the semantic classes ([decision D03](decisions.md#d03-tailwind-preflight-is-disabled)).

---

## Adding a token

1. Add it to `:root` in [`public/tokens.css`](../public/tokens.css).
2. Check contrast if text will sit on it, or it will sit behind text.
3. Use it as `var(--name)` in any stylesheet.
4. Run `python3 scripts/build-project-pages.py --check`. Token changes don't alter project-page HTML, but the check confirms nothing else drifted.
