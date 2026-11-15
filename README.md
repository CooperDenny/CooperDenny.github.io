# CooperDenny.github.io

Personal portfolio and project showcase site for Cooper Denny, Data Scientist based in Melbourne, Victoria.

**Live site:** [cooperdenny.github.io](https://cooperdenny.github.io)

## Overview

Built with Next.js 14 (App Router), TypeScript, React 18, and Tailwind CSS, statically exported and deployed on GitHub Pages via GitHub Actions. Features a one-page printable résumé at `/resume`, a light/dark theme toggle (persisted via `localStorage`), a responsive mobile layout, and individual project write-up pages for data science work.

## Stack

- **Framework**: Next.js 14 (App Router), TypeScript, React 18 — statically exported (`output: 'export'` in `next.config.js`); there's no server, API routes, or database, since nothing on this site is dynamic
- **Content**: every word of copy lives in `content/profile.ts`, rendered by both the home page and the printable `/resume` page
- **Styling**: a hand-written token-based design system in `app/globals.css` (light/dark + print styles); Tailwind is installed with preflight disabled
- **Deployment**: GitHub Pages, built and deployed by `.github/workflows/deploy.yml` on every push to `main`

## Structure

```
├── .github/workflows/deploy.yml   # Builds the static export and publishes it to GitHub Pages
├── app/
│   ├── layout.tsx        # Root layout: fonts, metadata, JSON-LD, GA, navbar/footer
│   ├── page.tsx          # Home page
│   ├── resume/page.tsx   # Printable one-page résumé
│   ├── globals.css       # Design system (tokens, components, print)
│   ├── robots.ts, sitemap.ts
├── content/profile.ts    # All site copy — edit content here
├── components/           # Presentational sections + Navbar/ThemeToggle/PrintButton (client)
├── config/site.ts        # Site URL resolution + SEO strings
└── public/
    ├── images/           # Hero photo and self-hosted logos
    └── projects/         # Static project write-up pages
```

## Project pages are static, not app routes

Each project write-up under `public/projects/<slug>/index.html` is plain static HTML, not a Next.js route. Two of them (`afl-brownlow-2023`, `afl-brownlow-2024`) are ~4,000-line pandoc/knitr-generated R Markdown reports with their own embedded jQuery/Bootstrap and code-folding; `h2h-arbitrage-finder` is similar. Porting these into React components would add risk for no benefit, so they're served as-is from `public/`, exactly like before.

Their internal "Home"/"Cooper Denny" links point to `/` (updated from the old relative `../../index.html`, since there's no longer a static `index.html` file at the root — the home page is now rendered by `app/page.tsx`).

A trailing-slash request like `/projects/<slug>/` resolves to that folder's `index.html` automatically — that's just how GitHub Pages (and the static export in `out/`) has always served directory-style URLs, no extra config needed. If you add a new project folder under `public/projects/`, nothing else needs to change.

## Commands

```bash
npm install
npm run dev      # start dev server
npm run build    # production build → writes static output to out/
npm run start    # serve the exported out/ directory locally (next start doesn't work with output: 'export')
npm run lint     # next lint
```

## Deployment

`.github/workflows/deploy.yml` runs `npm run build` and publishes the resulting `out/` directory to GitHub Pages on every push to `main`, using `actions/upload-pages-artifact` + `actions/deploy-pages`. The repo's Settings → Pages → Source must be set to "GitHub Actions" for this to take effect.

## Projects

| Project | Tools | Description |
|---|---|---|
| [AFL Brownlow Prediction Model](https://github.com/CooperDenny/AFLBrownlowPredictor) | R, Machine Learning | Ordinal logistic regression predicting Brownlow Medal votes — 2023 and 2024 editions |
| [Eildon Park Cricket Club Website](https://cooperdenny.github.io/projects/eildon-park-cricket-club/) | Claude Code, Web Development | Full club website with a historical player stats dashboard |
| [Australian Arbitrage Betting Finder](https://cooperdenny.github.io/projects/h2h-arbitrage-finder/) | R, API | Real-time arbitrage detection across Australian bookmakers |
| [Melbourne Pedestrian Counting System](https://cooperdenny.github.io/projects/melbourne-pedestrian-counting/) | Power BI, Python | Dashboard analysing pedestrian traffic from ~100 CBD sensors |
| [Victorian Property Prices Dashboard](https://cooperdenny.github.io/projects/victorian-property-prices-dashboard/) | Power BI | Interactive property market explorer with geographic mapping |
