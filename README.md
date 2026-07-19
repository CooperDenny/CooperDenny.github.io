# CooperDenny.github.io

Personal portfolio and project showcase site for Cooper Denny, Data Scientist based in Melbourne, Victoria.

**Live site:** [cooperdenny.github.io](https://cooperdenny.github.io)

## Overview

Built with Next.js 14 (App Router), TypeScript, React 18, and Tailwind CSS, deployed on Netlify. Features a light/dark theme toggle (persisted via `localStorage`), a responsive mobile layout, and individual project write-up pages for data science work.

## Stack

- **Framework**: Next.js 14 (App Router), TypeScript, React 18
- **Styling**: Tailwind CSS (utilities only — see `tailwind.config.ts`; the site's existing hand-written design system lives in `app/globals.css` with Tailwind's preflight disabled to keep it byte-for-byte the same look it always had)
- **Deployment**: Netlify, auto-deploys on push to `main` (`netlify.toml`)

## Structure

```
├── app/
│   ├── layout.tsx        # Root layout: fonts, metadata, JSON-LD, GA, navbar/footer
│   ├── page.tsx          # Home page — assembles the section components below
│   ├── globals.css       # Full site design system (ported from the previous static styles.css)
│   ├── robots.ts         # Generated robots.txt (Next.js metadata route)
│   └── sitemap.ts        # Generated sitemap.xml (Next.js metadata route)
├── components/           # Hero, Experience, Projects, Skills, Education, Contact,
│                         # Navbar, Footer, and SiteEffects (scroll/theme/particle behaviour)
├── config/
│   └── site.ts           # Site name, description, social links, site URL resolution
├── public/
│   ├── images/           # Profile photo and local logo assets
│   └── projects/         # Project write-up pages — see below
└── netlify.toml
```

## Project pages are static, not app routes

Each project write-up under `public/projects/<slug>/index.html` is plain static HTML, not a Next.js route. Two of them (`afl-brownlow-2023`, `afl-brownlow-2024`) are ~4,000-line pandoc/knitr-generated R Markdown reports with their own embedded jQuery/Bootstrap and code-folding; `h2h-arbitrage-finder` is similar. Porting these into React components would add risk for no benefit, so they're served as-is from `public/`, exactly like GitHub Pages did.

Their internal "Home"/"Cooper Denny" links point to `/` (updated from the old relative `../../index.html`, since there's no longer a static `index.html` file at the root — the home page is now rendered by `app/page.tsx`).

Because a trailing-slash request like `/projects/<slug>/` doesn't automatically resolve to that folder's `index.html` under the Next.js runtime (unlike plain static hosting), `netlify.toml` has an explicit redirect for it. If you add a new project folder under `public/projects/`, no extra config is needed — the existing `/projects/:slug/` redirect rule covers it.

## Commands

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
npm run start    # serve a production build
npm run lint     # next lint
```

## Projects

| Project | Tools | Description |
|---|---|---|
| [AFL Brownlow Prediction Model](https://github.com/CooperDenny/AFLBrownlowPredictor) | R, Machine Learning | Ordinal logistic regression predicting Brownlow Medal votes — 2023 and 2024 editions |
| [Eildon Park Cricket Club Website](https://cooperdenny.github.io/projects/eildon-park-cricket-club/) | Claude Code, Web Development | Full club website with a historical player stats dashboard |
| [Australian Arbitrage Betting Finder](https://cooperdenny.github.io/projects/h2h-arbitrage-finder/) | R, API | Real-time arbitrage detection across Australian bookmakers |
| [Melbourne Pedestrian Counting System](https://cooperdenny.github.io/projects/melbourne-pedestrian-counting/) | Power BI, Python | Dashboard analysing pedestrian traffic from ~100 CBD sensors |
| [Victorian Property Prices Dashboard](https://cooperdenny.github.io/projects/victorian-property-prices-dashboard/) | Power BI | Interactive property market explorer with geographic mapping |
