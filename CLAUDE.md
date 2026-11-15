# CooperDenny.github.io

Personal portfolio website for Cooper Denny, live at https://cooperdenny.github.io

## Stack

Next.js 14 (App Router), TypeScript, React 18, Tailwind CSS — statically exported (`output: 'export'` in `next.config.js`) and deployed on GitHub Pages via `.github/workflows/deploy.yml`.

There's no database and no Supabase: this site has no dynamic content (no CMS, no forms, no per-request data), so it's plain static generation — every route is prerendered at build time, which is also what makes static export possible (no server actions, no API routes, no image optimization API to give up).

## Structure

```
├── .github/workflows/
│   └── deploy.yml       # Builds the static export and publishes it to GitHub Pages
├── app/
│   ├── layout.tsx       # Root layout: metadata, JSON-LD, GA, skip link, Navbar/Footer, theme-init script
│   ├── page.tsx         # Home page — assembles the section components below
│   ├── resume/page.tsx  # One-page printable résumé (Save as PDF via window.print())
│   ├── globals.css      # Design system: theme tokens + component styles + @media print
│   ├── robots.ts        # robots.txt (Next.js metadata route)
│   └── sitemap.ts       # sitemap.xml (Next.js metadata route)
├── content/
│   └── profile.ts       # ALL site copy: profile, experience, projects, skills, education
├── components/
│   ├── Navbar.tsx, ThemeToggle.tsx, PrintButton.tsx, MobileCta.tsx   # the only 'use client' components
│   ├── Icon.tsx         # Inline SVG icons (Font Awesome Free paths, CC BY 4.0) — no icon font
│   ├── Section.tsx      # Shared section wrapper (eyebrow + heading + intro)
│   ├── Hero.tsx, Experience.tsx, Projects.tsx, Skills.tsx, Education.tsx, Contact.tsx
│   └── Footer.tsx
├── config/
│   └── site.ts          # title/description, resolveSiteUrl(); social links derived from content/profile.ts
└── public/
    ├── .nojekyll        # Stops GitHub Pages running Jekyll over the _next/ output folder
    ├── favicon.svg
    ├── images/          # hero-image.webp (desktop), hero-avatar.webp (mobile), hero-image.png (OG only),
    │                    # self-hosted employer/university logos (logo-*.webp / .svg, ≤240px)
    └── projects/        # Static project write-up pages — see below, NOT app routes
```

## Content lives in `content/profile.ts` — edit there, not in JSX

The home page and `/resume` both render from `content/profile.ts`, so they can't drift apart. Components are presentational only. Rule for that file: every claim must trace to a real role, a write-up under `public/projects/`, or a published result — no invented metrics.

The site is written for a data-science recruiter / hiring manager: outcome-first bullets, a visible promotion ladder (multiple `roles` on one `Job`), metrics on the featured project, plain-text skill chips (scannable, keyword-searchable) rather than logo walls. Collaboration tools (Slack, Teams, Meet, Drive, Office) were deliberately removed from Skills as low-signal padding — don't add them back.

**Brownlow metrics caveat:** the write-ups report ~93% game-level accuracy, but the no-information rate (all player-games = 0 votes) is ~93.5%. Never headline accuracy. Use season-tally correlation (r = 0.93), MAE (2.0 votes), and 3-vote recall (56%) — the evaluation note on the card explains why.

## Layout is designed against drop-off — and mobile-first

Measured on an iPhone 13 viewport: the page went from 14.5 screens to ~9.7, and the first screen now shows name, headline, pitch, Résumé/Email/LinkedIn/GitHub and the proof tiles. Keep it that way:

- **Above the fold is sacred.** The hero must keep: identity, one-line headline, short pitch (≤ ~2 sentences), CTAs, and the `proof` tiles (each tile links to the section that backs it up). Don't add paragraphs to the hero.
- **Cards show headlines; detail is one tap away.** Project cards use `oneLiner` (one sentence); the full write-up is the project page. The Brownlow method lives in a native `<details>` (works without JS, content still in the HTML for crawlers).
- **Whole project cards are tap targets** (stretched-link pattern: `.project__link::after`). Keep one link per side-project card.
- **`MobileCta`** is a phone-only sticky Résumé/Email bar: shown after the hero CTAs scroll away, hidden whenever `#contact` is on screen. It's additive only — never use JS to hide page content.
- **CSS is mobile-first**: base rules = phone; `@media (min-width: 600px)` and `(min-width: 861px)` add larger layouts. Every interactive element ≥ 44px (`--tap`). The footer reserves space for the sticky bar + `env(safe-area-inset-bottom)`.
- **Weight budget**: no icon fonts (use `components/Icon.tsx`; add paths from `@fortawesome/fontawesome-free` svgs if you need a new one), images as WebP sized to their display (2× max). The page is ~410 KB on mobile, ~180 KB of which is Google Analytics.
- Check after layout changes: no horizontal overflow at 320–1440px, hero CTAs on one row at ≥ 360px.

## The résumé must stay one A4 page

`/resume` prints to one A4 page via `@media print` in `globals.css`. If you add content to `profile.ts`, regenerate a PDF (e.g. Playwright `page.pdf({ format: 'A4', preferCSSPageSize: true })`) and check the page count. The résumé shows the first project from `projects` after the featured one, and omits the Tooling skills row.

## Why static export, and what it rules out

`next.config.js` sets `output: 'export'` so `npm run build` writes plain HTML/CSS/JS to `out/`, which GitHub Pages then serves directly — no server, so no `next start` in production (`next start` errors immediately if you try it against an export build; `npm run start` runs `npx serve out` instead). This constrains what future changes can do here: no server actions, no API routes (`app/api/*`), no middleware, no ISR/on-demand revalidation, no `next/image`'s optimization API without a custom loader, and no `next.config.js` `rewrites()`/`redirects()` (Next errors at build time if you set either under `output: 'export'`). Nothing on this site currently needs any of those — if a future feature does, static export is the first thing to reconsider, not something to work around.

## Why Tailwind's preflight is disabled

`tailwind.config.ts` sets `corePlugins.preflight = false`. `app/globals.css` is a hand-written design system with its own reset and light/dark tokens; preflight would double-reset it. Tailwind utilities are available for new code, but the existing components use the semantic classes in `globals.css` (`.card`, `.chip`, `.btn--primary`, …) — prefer extending those over mixing in utilities.

## Fonts are loaded via `<link>`, not `next/font`

Inter + JetBrains Mono (Google Fonts, with preconnect) are loaded via `<link>` tags in `app/layout.tsx`'s `<head>` rather than `next/font/google`; `globals.css` references them by literal name via `--font-sans` / `--font-mono`. Font Awesome is **no longer loaded** — icons are inline SVGs in `components/Icon.tsx` (saves ~275 KB of render-blocking CSS + webfonts). This produces one known/expected `@next/next/no-page-custom-font` ESLint *warning* on `app/layout.tsx` — don't "fix" it by migrating to `next/font` unless a real font-loading problem shows up.

## Images: plain `<img>` everywhere, not `next/image`

Every image uses a plain `<img>` tag. This produces expected `@next/next/no-img-element` lint *warnings*, suppressed per-line. `next/image`'s optimization API needs a server, which static export doesn't have. Employer/university logos are self-hosted in `public/images/logo-*` rather than hotlinked (hotlinks — especially Wikimedia — rate-limit and break silently).

## Project pages are static files, not app routes

`public/projects/<slug>/index.html` are hand-authored or R-Markdown/pandoc-generated static HTML pages (two of them, the AFL Brownlow write-ups, are ~4,000-line knitr output with their own embedded jQuery/Bootstrap/code-folding). They are **not** React components and shouldn't be converted into any — there's no benefit and real risk of breaking their data-heavy layouts. They're served as-is from `public/`, same as before.

Their "Home" nav links point to `/` (previously the relative `../../index.html`, which no longer exists as a file since the home page is now rendered by `app/page.tsx`, not a static `index.html`). If a project page is ever edited, keep that link as `/`, not a relative path back to a static file that doesn't exist.

`next.config.js` sets `trailingSlash: true`, so app routes export as `<route>/index.html` (e.g. `out/resume/index.html`) and both `/resume` and `/resume/` work on GitHub Pages. A trailing-slash request to `/projects/<slug>/` likewise resolves to that folder's `index.html` automatically — GitHub Pages (and any static file server, including the `out/` directory the export produces) has always served directory-style URLs that way, no extra config needed. Adding a new project folder needs no extra config either.

## Theming

Dark by default. `ThemeToggle.tsx` flips `data-theme` on `<body>` and persists it in `localStorage`; a small inline script in `app/layout.tsx` (before hydration, with `suppressHydrationWarning` on `<body>`) applies the saved theme synchronously to avoid a flash. All colours are CSS custom properties defined on `body` and overridden under `body[data-theme='light']` — components must use tokens, never raw colours (the résumé sheet is the one exception: it's always black-on-white).

No scroll-triggered reveal animations: the previous site hid content at `opacity: 0` until an IntersectionObserver fired, which left whole sections blank for fast scrollers, print, and crawlers. Don't reintroduce that pattern.

## Deployment

`.github/workflows/deploy.yml` builds the site (`npm run build` → `out/`) and publishes it to GitHub Pages via `actions/upload-pages-artifact` + `actions/deploy-pages` on every push to `main`. The repo's Settings → Pages → Source must be set to "GitHub Actions" (not the classic branch-based source) for this to take effect. `config/site.ts`'s `resolveSiteUrl()` falls back to `https://cooperdenny.github.io` if `NEXT_PUBLIC_SITE_URL` is unset or malformed — since that fallback is the real production domain here, there's normally no need to set the env var at all.

## Key things to know

- The projects grid in `components/Projects.tsx` uses CSS Grid (`project-grid` class, defined in `globals.css`)
- Each project card links to its own subdirectory under `/projects/`
- The Brownlow predictor is represented as a single consolidated card linking to both the 2023 and 2024 model pages
- Do not add a separate card per Brownlow year — keep them consolidated
