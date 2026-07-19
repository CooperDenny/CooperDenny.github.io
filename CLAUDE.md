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
│   ├── layout.tsx      # Root layout: metadata, JSON-LD, GA, Navbar/Footer, theme-init script
│   ├── page.tsx         # Home page — assembles the section components below
│   ├── globals.css      # Full design system, ported from the old static styles.css
│   ├── robots.ts        # robots.txt (Next.js metadata route)
│   └── sitemap.ts        # sitemap.xml (Next.js metadata route)
├── components/
│   ├── Navbar.tsx, Footer.tsx
│   ├── Hero.tsx, Experience.tsx, Projects.tsx, Skills.tsx, Education.tsx, Contact.tsx
│   └── SiteEffects.tsx  # 'use client' — theme toggle, mobile nav, scroll navbar,
│                         # fade-in-on-scroll, floating charts, particle system
├── config/
│   └── site.ts          # name/description/social links, resolveSiteUrl() (NEXT_PUBLIC_SITE_URL
│                         # with a fallback, same pattern as the EPCC repo's config/site.ts)
└── public/
    ├── .nojekyll          # Stops GitHub Pages running Jekyll over the _next/ output folder
    ├── favicon.svg
    ├── images/            # Profile photo and locally-hosted skill/tool logos
    └── projects/          # Static project write-up pages — see below, NOT app routes
```

## Why static export, and what it rules out

`next.config.js` sets `output: 'export'` so `npm run build` writes plain HTML/CSS/JS to `out/`, which GitHub Pages then serves directly — no server, so no `next start` in production (`next start` errors immediately if you try it against an export build; `npm run start` runs `npx serve out` instead). This constrains what future changes can do here: no server actions, no API routes (`app/api/*`), no middleware, no ISR/on-demand revalidation, no `next/image`'s optimization API without a custom loader, and no `next.config.js` `rewrites()`/`redirects()` (Next errors at build time if you set either under `output: 'export'`). Nothing on this site currently needs any of those — if a future feature does, static export is the first thing to reconsider, not something to work around.

## Why Tailwind's preflight is disabled

`tailwind.config.ts` sets `corePlugins.preflight = false`. This site's `app/globals.css` is a direct port of the original hand-rolled `styles.css` (2,000+ lines, its own `* { margin/padding/box-sizing }` reset, full light/dark theme via CSS custom properties). Tailwind's preflight would re-reset the same properties and risk subtly shifting spacing on every ported element. Tailwind utility classes are still available for any new code; the existing design system is not expressed in Tailwind utilities and wasn't rewritten to be — this was a stack migration, not a redesign.

## Fonts and icons are still loaded via `<link>`, not `next/font`

Inter (Google Fonts) and Font Awesome are loaded via `<link>` tags in `app/layout.tsx`'s `<head>`, exactly as the static site did, rather than migrated to `next/font/google`. `globals.css` references the font by the literal name `'Inter'` throughout; switching to `next/font` would mean touching that CSS to match its generated scoped font-family, which risks the exact pixel-parity this port was meant to preserve. This produces one known/expected `@next/next/no-page-custom-font` ESLint *warning* on `app/layout.tsx` — don't "fix" it by migrating to `next/font` unless a real font-loading problem shows up.

## Images: plain `<img>` everywhere, not `next/image`

Every image on the site — local (`public/images/...`) and external (company/university logos, devicon/simpleicons CDN icons) — uses a plain `<img>` tag, matching the original static markup exactly. This produces expected `@next/next/no-img-element` lint *warnings* (same acceptable-warning pattern as the EPCC repo). Local images were deliberately **not** migrated to `next/image`: its optimization API needs a server (not available under static export without a custom loader), and their sizing today is fully controlled by existing CSS classes tuned for a plain `<img>` — changing that risks the "same look, new stack only" goal of this port.

## Project pages are static files, not app routes

`public/projects/<slug>/index.html` are hand-authored or R-Markdown/pandoc-generated static HTML pages (two of them, the AFL Brownlow write-ups, are ~4,000-line knitr output with their own embedded jQuery/Bootstrap/code-folding). They are **not** React components and shouldn't be converted into any — there's no benefit and real risk of breaking their data-heavy layouts. They're served as-is from `public/`, same as before.

Their "Home" nav links point to `/` (previously the relative `../../index.html`, which no longer exists as a file since the home page is now rendered by `app/page.tsx`, not a static `index.html`). If a project page is ever edited, keep that link as `/`, not a relative path back to a static file that doesn't exist.

A trailing-slash request to `/projects/<slug>/` resolves to that folder's `index.html` automatically — GitHub Pages (and any static file server, including the `out/` directory the export produces) has always served directory-style URLs that way, no extra config needed. Adding a new project folder needs no extra config either.

## Theming

Light/dark mode is toggled via a button (`SiteEffects.tsx`) and persisted in `localStorage`, applied via a `data-theme` attribute set on `<body>`. A small inline script in `app/layout.tsx` (before hydration, with `suppressHydrationWarning` on `<body>`) reads the saved theme and sets `data-theme` synchronously, avoiding a flash of the wrong theme.

## Deployment

`.github/workflows/deploy.yml` builds the site (`npm run build` → `out/`) and publishes it to GitHub Pages via `actions/upload-pages-artifact` + `actions/deploy-pages` on every push to `main`. The repo's Settings → Pages → Source must be set to "GitHub Actions" (not the classic branch-based source) for this to take effect. `config/site.ts`'s `resolveSiteUrl()` falls back to `https://cooperdenny.github.io` if `NEXT_PUBLIC_SITE_URL` is unset or malformed — since that fallback is the real production domain here, there's normally no need to set the env var at all.

## Key things to know

- The projects grid in `components/Projects.tsx` uses CSS Grid (`projects-grid` class, defined in `globals.css`)
- Each project card links to its own subdirectory under `/projects/`
- The Brownlow predictor is represented as a single consolidated card linking to both the 2023 and 2024 model pages
- Do not add a separate card per Brownlow year — keep them consolidated
