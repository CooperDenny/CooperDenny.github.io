# cooperdenny.github.io

Portfolio, résumé and project write-ups for **Cooper Denny**, Data Scientist in Melbourne, Australia.

**Live:** <https://cooperdenny.github.io> · **Résumé:** <https://cooperdenny.github.io/resume/>

A statically exported Next.js site, written for data-science recruiters and hiring managers: the evidence (results, metrics, promotion) is on the first screen, every page works on a phone, and each project has a write-up that leads with its outcome.

---

## Quick start

**Prerequisites:** Node.js ≥ 18.17 (CI uses Node 20) and Python ≥ 3.8 (standard library only — nothing to `pip install`).

```bash
npm ci                 # install exact dependency versions from package-lock.json
npm run dev            # dev server at http://localhost:3000
```

To see exactly what will be deployed:

```bash
npm run build          # static export → out/
npm run start          # serve out/ at http://localhost:3000
```

## Common tasks

| I want to… | Edit | Then |
|---|---|---|
| Change my headline, pitch, experience, skills or education | [`content/profile.ts`](content/profile.ts) | `npm run dev` to preview |
| Change a project page's wording | [`scripts/project_pages/content.py`](scripts/project_pages/content.py) | `python3 scripts/build-project-pages.py` |
| Update a project report after re-knitting it in R | Replace `public/projects/<slug>/index.html` | `python3 scripts/build-project-pages.py` |
| Change a colour, font or spacing value | [`public/tokens.css`](public/tokens.css) | Check both themes |
| Add a project | See [Editing content → Add a project](docs/editing-content.md#add-a-project) | |

Step-by-step recipes for these and more are in **[docs/editing-content.md](docs/editing-content.md)**.

## Before you push

```bash
npx tsc --noEmit                                   # type-check
npm run lint                                       # ESLint (expect zero warnings)
python3 scripts/build-project-pages.py --check     # project pages up to date? (CI enforces this)
npm run build                                      # the static export must build
```

Every push to `main` deploys automatically — see [docs/deployment.md](docs/deployment.md).

## Documentation

| Document | Read it when you want to… |
|---|---|
| [Editing content](docs/editing-content.md) | change what the site says — recipes for every common edit |
| [Architecture](docs/architecture.md) | understand how the code is organised and the rules that keep it that way |
| [Design system](docs/design-system.md) | change styles: tokens, light/dark themes, breakpoints, components, accessibility |
| [Project pages](docs/project-pages.md) | work on `/projects/*`: the page generator and the R Markdown workflow |
| [Development](docs/development.md) | set up, run, verify and troubleshoot locally |
| [Deployment](docs/deployment.md) | understand or fix the GitHub Pages pipeline |
| [Decisions](docs/decisions.md) | know *why* something is the way it is before changing it |
| [CLAUDE.md](CLAUDE.md) | brief AI coding agents (the rules, condensed) |

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router), React 18, TypeScript (strict) |
| Output | Static export (`output: 'export'`) — plain HTML/CSS/JS, no server |
| Styling | Hand-written CSS on shared design tokens; light and dark themes |
| Project pages | Static HTML produced by a Python generator; three are R Markdown (knitr) reports |
| Hosting | GitHub Pages, deployed by GitHub Actions on every push to `main` |
| Analytics | Google Analytics 4 |

## Repository layout

```
app/                  Next.js routes: layout, (site)/ home page + /resume, /links (unlisted), robots.txt, sitemap.xml
components/           React components — ui/ primitives, home/ sections, layout/ chrome, links/, resume/
content/              What the site says: data, types, and JSON shared with the Python generator
config/               Site constants (URL, analytics ID, fonts)
lib/                  Framework-free helpers and the theme script
public/               Static files: tokens.css, images/, projects/ (generated pages)
scripts/              The project-page generator (Python)
docs/                 Documentation
.github/workflows/    The deploy pipeline
```

A file-by-file map is in [docs/architecture.md](docs/architecture.md#directory-map).

## Projects

| Project | Tools | Write-up |
|---|---|---|
| AFL Brownlow Medal prediction model ([code](https://github.com/CooperDenny/AFLBrownlowPredictor)) | R, ordinal regression | [2024](https://cooperdenny.github.io/projects/afl-brownlow-2024/) · [2023](https://cooperdenny.github.io/projects/afl-brownlow-2023/) |
| Australian betting arbitrage finder | R, REST API | [Write-up](https://cooperdenny.github.io/projects/h2h-arbitrage-finder/) |
| Cricket club records & stats platform | Data modelling, Claude Code | [Write-up](https://cooperdenny.github.io/projects/eildon-park-cricket-club/) |
| Melbourne pedestrian traffic dashboard | Python, Power BI | [Write-up](https://cooperdenny.github.io/projects/melbourne-pedestrian-counting/) |
| Victorian property prices dashboard | Power BI, DAX | [Write-up](https://cooperdenny.github.io/projects/victorian-property-prices-dashboard/) |
| CricketStatsHub | Data cleaning | [GitHub](https://github.com/CooperDenny/CricketStatsHub) |

## Credits

Icons are from [Font Awesome Free](https://fontawesome.com/) 6.5.2, licensed [CC BY 4.0](https://fontawesome.com/license/free); their SVG paths are stored in [`content/icons.json`](content/icons.json). Fonts are [Archivo](https://fonts.google.com/specimen/Archivo) and [JetBrains Mono](https://www.jetbrains.com/lp/mono/), served by Google Fonts.
