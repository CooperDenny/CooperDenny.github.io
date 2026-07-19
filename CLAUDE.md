# CooperDenny.github.io

Personal portfolio website for Cooper Denny, live at https://cooperdenny.github.io

## Stack

Next.js 14 (App Router), TypeScript, React 18, Tailwind CSS. Deployed on Netlify (`netlify.toml`, `@netlify/plugin-nextjs`) — no longer served by GitHub Pages, since GitHub Pages can't run a Next.js server/build.

There's no database and no Supabase: this site has no dynamic content (no CMS, no forms, no per-request data), so it's plain static generation — every route is prerendered at build time.

## Structure

```
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
├── public/
│   ├── favicon.svg
│   ├── images/           # Profile photo and locally-hosted skill/tool logos
│   └── projects/         # Static project write-up pages — see below, NOT app routes
└── netlify.toml
```

## Why Tailwind's preflight is disabled

`tailwind.config.ts` sets `corePlugins.preflight = false`. This site's `app/globals.css` is a direct port of the original hand-rolled `styles.css` (2,000+ lines, its own `* { margin/padding/box-sizing }` reset, full light/dark theme via CSS custom properties). Tailwind's preflight would re-reset the same properties and risk subtly shifting spacing on every ported element. Tailwind utility classes are still available for any new code; the existing design system is not expressed in Tailwind utilities and wasn't rewritten to be — this was a stack migration, not a redesign.

## Fonts and icons are still loaded via `<link>`, not `next/font`

Inter (Google Fonts) and Font Awesome are loaded via `<link>` tags in `app/layout.tsx`'s `<head>`, exactly as the static site did, rather than migrated to `next/font/google`. `globals.css` references the font by the literal name `'Inter'` throughout; switching to `next/font` would mean touching that CSS to match its generated scoped font-family, which risks the exact pixel-parity this port was meant to preserve. This produces one known/expected `@next/next/no-page-custom-font` ESLint *warning* on `app/layout.tsx` — don't "fix" it by migrating to `next/font` unless a real font-loading problem shows up.

## Images: plain `<img>` everywhere, not `next/image`

Every image on the site — local (`public/images/...`) and external (company/university logos, devicon/simpleicons CDN icons) — uses a plain `<img>` tag, matching the original static markup exactly. This produces expected `@next/next/no-img-element` lint *warnings* (same acceptable-warning pattern as the EPCC repo). Local images were deliberately **not** migrated to `next/image`: their sizing today is fully controlled by existing CSS classes tuned for a plain `<img>`, and `next/image` requires explicit dimensions/`fill` + a `sizes` prop that risk changing layout for a port whose goal was "same look, new stack only."

## Project pages are static files, not app routes

`public/projects/<slug>/index.html` are hand-authored or R-Markdown/pandoc-generated static HTML pages (two of them, the AFL Brownlow write-ups, are ~4,000-line knitr output with their own embedded jQuery/Bootstrap/code-folding). They are **not** React components and shouldn't be converted into any — there's no benefit and real risk of breaking their data-heavy layouts. They're served as-is from `public/`, same as GitHub Pages did.

Their "Home" nav links point to `/` (previously the relative `../../index.html`, which no longer exists as a file since the home page is now rendered by `app/page.tsx`, not a static `index.html`). If a project page is ever edited, keep that link as `/`, not a relative path back to a static file that doesn't exist.

A trailing-slash request to `/projects/<slug>/` doesn't automatically resolve to that folder's `index.html` on the Next.js/Netlify runtime (unlike plain static hosting or `next export`), so `netlify.toml` has an explicit `/projects/:slug/ → /projects/:slug/index.html` redirect covering all of them. Adding a new project folder needs no extra redirect config — the existing rule is a wildcard on `:slug`.

## Theming

Light/dark mode is toggled via a button (`SiteEffects.tsx`) and persisted in `localStorage`, applied via a `data-theme` attribute set on `<body>`. A small inline script in `app/layout.tsx` (before hydration, with `suppressHydrationWarning` on `<body>`) reads the saved theme and sets `data-theme` synchronously, avoiding a flash of the wrong theme.

## Deployment

Deployed on Netlify from the `main` branch via `netlify.toml` + `@netlify/plugin-nextjs`. Set `NEXT_PUBLIC_SITE_URL` in the Netlify site's environment variables once the production URL/custom domain is known — `config/site.ts`'s `resolveSiteUrl()` falls back to `https://cooperdenny.github.io` if it's unset or malformed, so metadata/sitemap generation never throws.

## Key things to know

- The projects grid in `components/Projects.tsx` uses CSS Grid (`projects-grid` class, defined in `globals.css`)
- Each project card links to its own subdirectory under `/projects/`
- The Brownlow predictor is represented as a single consolidated card linking to both the 2023 and 2024 model pages
- Do not add a separate card per Brownlow year — keep them consolidated
