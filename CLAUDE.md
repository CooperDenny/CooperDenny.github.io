# CooperDenny.github.io

Personal portfolio website for Cooper Denny, live at https://cooperdenny.github.io

## Stack

Next.js 14 (App Router), TypeScript, React 18, Tailwind CSS — statically exported (`output: 'export'` in `next.config.js`) and deployed on GitHub Pages via `.github/workflows/deploy.yml`.

There's no database and no Supabase: this site has no dynamic content (no CMS, no forms, no per-request data), so it's plain static generation — every route is prerendered at build time, which is also what makes static export possible (no server actions, no API routes, no image optimization API to give up).

## Structure

```
├── .github/workflows/deploy.yml   # --check project pages, build the export, publish to GitHub Pages
├── app/                     # Next.js routes — composition roots only (data in, components out)
│   ├── layout.tsx           # <html>, analytics, skip link, Navbar / Footer / MobileCta
│   ├── page.tsx             # Home: injects content into the home sections
│   ├── resume/page.tsx      # One-page printable résumé
│   ├── globals.css          # Component styles + print styles (@imports public/tokens.css)
│   └── robots.ts, sitemap.ts
├── components/              # Presentational. Import TYPES from content/, never content data.
│   ├── ui/                  # Primitives: Icon, SmartLink, ActionLink, Chips, Bullets, Logo, Section
│   ├── home/                # Hero, Experience, Projects (+ FeaturedProjectCard, ProjectCard), Skills, Education, Contact
│   ├── layout/              # Navbar, Footer, MobileCta, Analytics
│   └── resume/              # ResumeSections (header, experience, projects, …), PrintButton
├── content/                 # What the site says — the single source of truth
│   ├── types.ts             # Domain model (types only)
│   ├── profile.ts           # The data: profile, experience, projects, skills, education
│   ├── selectors.ts         # Derived views (contact channels, tenure, résumé entries) — no derivation in JSX
│   ├── sections.ts          # Section ids / nav labels / headings, HERO_ACTIONS_ID, RESUME_HREF
│   ├── catalog.ts + projects.json   # Project pages: slug, title, teaser, order  (shared with Python)
│   ├── icons.ts + icons.json        # SVG icon paths                             (shared with Python)
│   └── identity.json        # name, role, employer, location                      (shared with Python)
├── config/
│   ├── site.json            # url, gaId, fontsHref                                (shared with Python)
│   └── site.ts              # siteConfig: resolved URL, SEO strings, themeColor read from tokens.css
├── lib/                     # Framework-free helpers: format (dateRange, listSentence, cx), links, seo
├── public/
│   ├── tokens.css           # Design tokens — colour, type, spacing — for EVERY page (Next + static)
│   ├── images/              # WebP photos/logos (hero-image.png kept for Open Graph only)
│   └── projects/            # Static project pages (generated — see below), site.css, report.css
└── scripts/
    ├── build-project-pages.py   # CLI shim: build, or --check
    └── project_pages/           # The generator package (OOD — see below)
```

## Architecture rules (SOLID / DRY / SLAP, applied where they fit)

The React side uses **composition, not classes** — React's class components are legacy, so SOLID is applied by intent, not by inheritance. The Python generator *is* object-oriented, because that's where it earns its keep.

- **DRY — one source per fact.** Copy → `content/profile.ts` / `scripts/project_pages/content.py`. Project titles + order → `content/projects.json`. Name/role/location → `content/identity.json`. URL, GA id, fonts → `config/site.json`. Colours/spacing → `public/tokens.css` (theme-color is *read* from `--bg`, not repeated). Icons → `content/icons.json`. Section anchors → `content/sections.ts`. Date ranges → `dateRange()`. External-link behaviour is derived from the URL (`lib/links.ts`, `model.Action.external`), never flagged by hand. If you find yourself typing a fact a second time, it belongs in one of these.
- **Dependency inversion.** `components/` import types from `content/types.ts`; only `app/*` (composition roots) import content data and pass it down. Dependencies point one way: `app → components → content/lib`. `content/`, `lib/`, `config/` must never import from `components/`.
- **SRP / SLAP.** A component's top-level function reads at one level of abstraction (e.g. `JobCard` = header, promotions, summary, bullets, chips); markup details live in named sub-components below it. Data shaping lives in `content/selectors.ts`, not JSX.
- **Open/closed.** Adding a job, project, skill group, section, nav item or contact channel is a data change. What appears on the résumé is a data flag (`onResume`), not a slice or a label check. In the generator, new report behaviour = a new `Transform` or `ReportExtension`, registered in `site.py` — never an `if slug == …` in `ReportPage`.
- **Interface segregation.** Components take the narrowest props they need (`Chips` gets `string[]`; `Hero` gets a `Pick<Profile, …>`).

## Content lives in `content/profile.ts` — edit there, not in JSX

The home page and `/resume` both render from `content/profile.ts`, so they can't drift apart. Components are presentational only. Rule for that file: every claim must trace to a real role, a write-up under `public/projects/`, or a published result — no invented metrics. Page-backed project cards are built with `pageProject(slug, …)`, which takes the title and URL from the catalog.

The site is written for a data-science recruiter / hiring manager: outcome-first bullets, a visible promotion ladder (multiple `roles` on one `Job`), metrics on the featured project, plain-text skill chips (scannable, keyword-searchable) rather than logo walls. Collaboration tools (Slack, Teams, Meet, Drive, Office) were deliberately removed from Skills as low-signal padding — don't add them back.

**Brownlow metrics caveat:** the write-ups report ~93% game-level accuracy, but the no-information rate (all player-games = 0 votes) is ~93.5%. Never headline accuracy. Use season-tally correlation (r = 0.93), MAE (2.0 votes), and 3-vote recall (56%) — the evaluation note on the card explains why.

## Layout is designed against drop-off — and mobile-first

Measured on an iPhone 13 viewport: the page went from 14.5 screens to ~9.7, and the first screen now shows name, headline, pitch, Résumé/Email/LinkedIn/GitHub and the proof tiles. Keep it that way:

- **Above the fold is sacred.** The hero must keep: identity, one-line headline, short pitch (≤ ~2 sentences), CTAs, and the `proof` tiles (each tile links to the section that backs it up). Don't add paragraphs to the hero.
- **Cards show headlines; detail is one tap away.** Project cards use `oneLiner` (one sentence); the full write-up is the project page. The Brownlow method lives in a native `<details>` (works without JS, content still in the HTML for crawlers).
- **Whole project cards are tap targets** (stretched-link pattern: `.project__link::after`). Keep one link per side-project card.
- **`MobileCta`** is a phone-only sticky Résumé/Email bar: shown after the hero CTAs scroll away, hidden whenever `#contact` is on screen. It's additive only — never use JS to hide page content.
- **CSS is mobile-first**: base rules = phone; `@media (min-width: 600px)` and `(min-width: 861px)` add larger layouts. Every interactive element ≥ 44px (`--tap`). The footer reserves space for the sticky bar + `env(safe-area-inset-bottom)`.
- **Weight budget**: no icon fonts (use `components/ui/Icon.tsx`; add paths from `@fortawesome/fontawesome-free` svgs to `content/icons.json` if you need a new one), images as WebP sized to their display (2× max). The page is ~410 KB on mobile, ~180 KB of which is Google Analytics.
- Check after layout changes: no horizontal overflow at 320–1440px, hero CTAs on one row at ≥ 360px.

## The résumé must stay one A4 page

`/resume` prints to one A4 page via `@media print` in `globals.css`. If you add content to `profile.ts`, regenerate a PDF (e.g. Playwright `page.pdf({ format: 'A4', preferCSSPageSize: true })`) and check the page count. The résumé shows the featured project plus any project with `onResume: true`, and every skill group except those with `onResume: false` (Tooling).

## Why static export, and what it rules out

`next.config.js` sets `output: 'export'` so `npm run build` writes plain HTML/CSS/JS to `out/`, which GitHub Pages then serves directly — no server, so no `next start` in production (`next start` errors immediately if you try it against an export build; `npm run start` runs `npx serve out` instead). This constrains what future changes can do here: no server actions, no API routes (`app/api/*`), no middleware, no ISR/on-demand revalidation, no `next/image`'s optimization API without a custom loader, and no `next.config.js` `rewrites()`/`redirects()` (Next errors at build time if you set either under `output: 'export'`). Nothing on this site currently needs any of those — if a future feature does, static export is the first thing to reconsider, not something to work around.

## Why Tailwind's preflight is disabled

`tailwind.config.ts` sets `corePlugins.preflight = false`. `app/globals.css` is a hand-written design system with its own reset (tokens in `public/tokens.css`); preflight would double-reset it. Tailwind utilities are available for new code, but the existing components use the semantic classes in `globals.css` (`.card`, `.chip`, `.btn--primary`, …) — prefer extending those over mixing in utilities.

## Fonts are loaded via `<link>`, not `next/font`

Inter + JetBrains Mono (Google Fonts, with preconnect) are loaded via `<link>` tags — the URL lives in `config/site.json` (`fontsHref`) and is used by both `app/layout.tsx` and the project-page generator — rather than `next/font/google`. Tokens reference them by literal name (`--font-sans` / `--font-mono`). Icons are inline SVGs (`components/ui/Icon.tsx`), not Font Awesome. Code font ligatures are disabled in code blocks so R's `<-` renders as typed.

## Images: plain `<img>` everywhere, not `next/image`

Every image uses a plain `<img>` tag. This produces expected `@next/next/no-img-element` lint *warnings*, suppressed per-line. `next/image`'s optimization API needs a server, which static export doesn't have. Employer/university logos are self-hosted in `public/images/logo-*` rather than hotlinked (hotlinks — especially Wikimedia — rate-limit and break silently).

## Project pages are static files, not app routes — built by `scripts/project_pages`

`public/projects/<slug>/index.html` are static HTML served as-is (not React, and shouldn't become React). One generator owns all six. Outputs are committed:

```bash
python3 scripts/build-project-pages.py          # rebuild (idempotent)
python3 scripts/build-project-pages.py --check  # exit 1 if any page is stale — CI runs this before every deploy
```

- **Copy** lives in `scripts/project_pages/content.py` (titles/teasers/order in `content/projects.json`). **Edit there, then re-run** — hand edits to the generated HTML are overwritten, and CI fails if you forget to regenerate.
- **Hand pages** (`eildon-park-cricket-club`, `melbourne-pedestrian-counting`, `victorian-property-prices-dashboard`) are `HandPage`s: generated in full.
- **Report pages** (`afl-brownlow-2023`, `afl-brownlow-2024`, `h2h-arbitrage-finder`) are `ReportPage`s: knitr/pandoc output (~2 MB each, embedded jQuery/Bootstrap 3/DataTables) whose bodies are never touched. A `Pipeline` of small `Transform`s swaps head assets for `/tokens.css` + `../site.css` + `../report.css`, removes legacy chrome, upserts the shared nav / header + "At a glance" panel / next-project footer between `<!-- cd:… -->` markers, and folds R chunks (and printed output > 14 lines, except the confusion matrix) into `<details>`. **After re-knitting a report, just re-run the script** — a fresh knit and a re-run both produce the same page (verified byte-for-byte).
- **`ReportExtension`s** add page-specific behaviour without touching `ReportPage`. `ArbitrageFacts` computes the arbitrage page's headline metrics and snapshot date from the report's own embedded DataTables data on every run, so a re-knit can't leave stale numbers. Register extensions in `site.py`. Brownlow numbers are fixed historical results, written in `content.py`.
- **Package layout** (`scripts/project_pages/`, dependencies point down): `cli` → `site` (composition root) → `pages` (`ProjectPage` ABC → `HandPage` / `ReportPage`) → `extensions`, `transforms`, `render` (`Renderer`: shared chrome as HTML) → `model` (frozen dataclasses), `content` (data) → `catalog`, `icons`, `settings` (read the shared JSON/CSS).
- **Adding a project page**: a folder under `public/projects/`, an entry in `content/projects.json` (sets the "Next project" order), and copy in `HAND_PAGES` or `REPORT_PAGES`. `site.py` refuses to build if the catalog lists a page with no copy.
- Every page links home via `/` and `/#projects`. Shared classes are `cd-` prefixed because Bootstrap 3 (inlined in the reports) already owns `.nav`, `.btn`, etc.

`next.config.js` sets `trailingSlash: true`, so app routes export as `<route>/index.html` (e.g. `out/resume/index.html`) and both `/resume` and `/resume/` work on GitHub Pages. `/projects/<slug>/` likewise resolves to that folder's `index.html` — no extra config needed.

## Theming: dark only

The site is **dark only** — a deliberate choice; the light theme and toggle were removed. Every colour is a token in `public/tokens.css`, loaded by the Next app (`@import` in `globals.css`) and by every project page (`<link href="/tokens.css">`), so there is exactly one palette. `viewport.themeColor` is read from `--bg` at build time (`config/site.ts`), as is the generator's `theme-color` meta. The résumé sheet is the one exception: always black-on-white, because it's a printable page.

No scroll-triggered reveal animations: the previous site hid content at `opacity: 0` until an IntersectionObserver fired, which left whole sections blank for fast scrollers, print, and crawlers. Don't reintroduce that pattern.

## Deployment

`.github/workflows/deploy.yml` checks the generated project pages are current (`build-project-pages.py --check`), builds the site (`npm run build` → `out/`) and publishes it to GitHub Pages via `actions/upload-pages-artifact` + `actions/deploy-pages` on every push to `main`. The repo's Settings → Pages → Source must be set to "GitHub Actions" (not the classic branch-based source) for this to take effect. `config/site.ts`'s `resolveSiteUrl()` falls back to `config/site.json`'s `url` if `NEXT_PUBLIC_SITE_URL` is unset or malformed — since that fallback is the real production domain here, there's normally no need to set the env var at all.

## Key things to know

- The projects grid in `components/home/Projects.tsx` uses CSS Grid (`project-grid` class, defined in `globals.css`)
- Each project card links to its own subdirectory under `/projects/`
- The Brownlow predictor is represented as a single consolidated card linking to both the 2023 and 2024 model pages
- Do not add a separate card per Brownlow year — keep them consolidated
