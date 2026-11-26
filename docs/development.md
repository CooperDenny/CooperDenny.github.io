# Development

Setting up, running, verifying and troubleshooting the site locally.

## Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Commands](#commands)
- [Before you push](#before-you-push)
- [Verifying layout](#verifying-layout)
- [Checking the CV's page count](#checking-the-cvs-page-count)
- [Conventions](#conventions)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Tool | Version | Why |
|---|---|---|
| Node.js | ≥ 18.17 (Next.js 14's minimum); CI uses **20** | Builds the site |
| npm | bundled with Node | Installs dependencies from `package-lock.json` |
| Python | ≥ 3.8, standard library only (verified on 3.8, 3.9, 3.11 and 3.13) | Runs the project-page generator |
| R + RStudio | optional | Only to re-knit the R Markdown reports |

## Setup

```bash
git clone https://github.com/CooperDenny/CooperDenny.github.io.git
cd CooperDenny.github.io
npm ci
npm run dev        # http://localhost:3000
```

Use `npm ci` rather than `npm install`: it installs exactly what `package-lock.json` pins, which is what CI does.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload at <http://localhost:3000> |
| `npm run build` | Production static export to `out/` (what gets deployed) |
| `npm run start` | Serves `out/` at <http://localhost:3000> (`npx serve`); run `build` first |
| `npm run lint` | ESLint (Next.js core-web-vitals rules) |
| `npx tsc --noEmit` | TypeScript type-check (strict mode) |
| `python3 scripts/build-project-pages.py` | Regenerates the project pages; only rewrites pages that changed |
| `python3 scripts/build-project-pages.py --check` | Exit 1 if any project page is out of date (CI runs this) |

`next start` doesn't work with a static export ([decision D01](decisions.md#d01-static-export-to-github-pages)). Use `npm run start`, which serves the exported files the way GitHub Pages will.

The dev server serves `public/` as-is, so project pages at `/projects/<slug>/` work in `npm run dev` too. After regenerating them, just reload.

---

## Before you push

Run all four. CI runs the last two, and a failure there blocks the deploy.

```bash
npx tsc --noEmit                                  # 1. types
npm run lint                                      # 2. lint — expect "No ESLint warnings or errors"
python3 scripts/build-project-pages.py --check    # 3. generated pages current
npm run build                                     # 4. the export builds
```

Then look at what you changed in the browser: see the next section.

---

## Verifying layout

The site's quality bar is "works for a recruiter on a phone". After any visual change, check:

- [ ] **Widths:** 320px (smallest phone), 390px (typical phone), 768px (tablet), 1366px (laptop). Use your browser's device toolbar. There must be no horizontal scroll at any width.
- [ ] **First screen on a phone (home page):** photo, name (on one line, the ball not past the edge), headline, pitch and the CV/LinkedIn buttons are visible without scrolling (checked at 390 × 844), and the hero ends well before the bottom of the screen.
- [ ] **Hero motion:** the name rises and the ball rolls to rest just past it, once. With reduced motion on, nothing moves and the ball is already at rest.
- [ ] **Keyboard:** Tab reaches every link and button with a visible focus ring; Escape closes the mobile menu.
- [ ] **Project pages too**, if you touched shared CSS, tokens or the generator.

Check the static export rather than only the dev server: `npm run build && npm run start`.

---

## Checking the CV's page count

The quick way: open <http://localhost:3000/cv/>, click **Save as PDF**, and check the print preview shows **2 pages or fewer**, with no entry split across the break.

Scripted, with [Playwright](https://playwright.dev/). It isn't a project dependency, so install it wherever you keep tools:

```js
// check-cv.js — run with `node check-cv.js` while `npm run start` is serving out/
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/cv/', { waitUntil: 'networkidle' });
  const pdf = await page.pdf({ format: 'A4', preferCSSPageSize: true });
  const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  console.log(pages <= 2 ? `OK: ${pages} page(s)` : `TOO LONG: ${pages} pages`);
  await browser.close();
})();
```

Without Playwright, headless Chrome works too: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf=cv.pdf http://localhost:3000/cv/`, then open `cv.pdf`.

If it's over two pages, trim content (or set `onResume: false` on a skill group, or drop `onResume` from a project) rather than shrinking the print styles.

---

## Conventions

- **Where things go:** see [Architecture → Directory map](architecture.md#directory-map) and the [rules](architecture.md#the-rules). The short version: copy goes in `content/`, styles use tokens, components take props, and each fact lives in one place.
- **TypeScript** runs in strict mode. Components are function components; `'use client'` only where state or effects are needed (currently `Navbar`, `MobileCta`, `PrintButton`).
- **CSS:** BEM-style class names (`.block__element--modifier`), mobile-first `min-width` queries at 600px and 861px, colours only through tokens ([Design system](design-system.md)).
- **Python:** standard library only; type-annotated; every module starts with a docstring stating its responsibility.
- **Comments explain *why*,** not what. Non-obvious decisions get an entry in [decisions.md](decisions.md).
- **Generated files** (`public/projects/<slug>/index.html`) are committed, never hand-edited.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `next start` errors | Static export has no Next server | `npm run start` (serves `out/`) |
| Port 3000 already in use | Another dev server is running | Stop it, or `npm run dev -- -p 3001` |
| CI fails at "Check project pages are up to date" | An input changed without regenerating | `python3 scripts/build-project-pages.py`, commit, push |
| Changes don't show after a build | Stale build cache | `rm -rf .next out && npm run build` |
| Build fails: `Unknown project page "<slug>"` | A `pageProject('<slug>', …)` card isn't in `content/projects.json` | Register the page, or fix the slug typo |
| Build fails: `Design token --band not found in public/tokens.css` | `--band` renamed or removed | Restore it; it's used for the browser theme colour |
| Fonts look like system fonts | Offline, or Google Fonts blocked | Expected fallback; the font stacks degrade gracefully |
| Generator error messages | — | See [Project pages → Troubleshooting](project-pages.md#troubleshooting) |
