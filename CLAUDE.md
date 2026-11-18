# CLAUDE.md

Instructions for AI coding agents working in this repository. Humans: start with [README.md](README.md).

**What this is:** Cooper Denny's portfolio and résumé — Next.js 14 (App Router, TypeScript strict), statically exported to GitHub Pages, plus seven project pages produced by a Python generator. Audience: data-science recruiters and hiring managers. Live at <https://cooperdenny.github.io>.

## Read before changing

| Task | Read |
|---|---|
| Change copy / add a job, project, skill | [docs/editing-content.md](docs/editing-content.md) |
| Change code structure | [docs/architecture.md](docs/architecture.md) |
| Change styles, tokens, themes | [docs/design-system.md](docs/design-system.md) |
| Touch `public/projects/` or `scripts/` | [docs/project-pages.md](docs/project-pages.md) |
| Reverse an existing choice | [docs/decisions.md](docs/decisions.md) — find the record first |

## Hard rules

**Content and claims**
- Never invent facts or metrics. Every claim must trace to a real role, a project write-up, or a published result.
- Never headline the Brownlow model's game-level accuracy (it equals the all-zeros baseline). Use r = 0.93, MAE 2.0, 56% 3-vote recall, and the Cripps/Daicos call ([D11](docs/decisions.md#d11-brownlow-results-are-reported-without-headline-accuracy)).
- The Brownlow model is one consolidated card linking to every season's write-up. Never one card per season.
- Don't add collaboration tools (Slack, Teams, Zoom, Drive, Office) to Skills.

**Architecture** ([rules](docs/architecture.md#the-rules))
- One source per fact. Copy → `content/profile.ts` or `scripts/project_pages/content.py`; project slugs/titles/order → `content/projects.json`; name/role → `content/identity.json`; URL/GA/fonts → `config/site.json`; colours/spacing → `public/tokens.css`; icons → `content/icons.json`; section anchors → `content/sections.ts`. Don't duplicate any of these.
- `components/` import **types** from `content/types.ts` (plus `sections.ts` and `selectors.ts`), never content data. Only `app/*` imports `content/profile.ts`. `content/`, `lib/` and `config/` never import from `components/`.
- No copy in components. No derivation in JSX: put it in `content/selectors.ts`. No hard-coded `'#anchor'`: use `anchor()`.
- React: function components and composition only; `'use client'` only where state or effects are required.
- Generator: extend with a new `Transform` or `ReportExtension` (registered in `site.py`), never `if slug == …` in `ReportPage`.

**Platform** ([D01](docs/decisions.md#d01-static-export-to-github-pages))
- Static export only: no API routes, server actions, middleware, ISR, `rewrites`/`redirects`, or `next/image` optimisation. `next start` doesn't work; use `npm run start`.
- Plain `<img>`, self-hosted WebP at most 2× display size. No hot-linked images.
- No icon fonts (inline SVG via `content/icons.json`). Fonts via `<link>`, not `next/font`.

**Design** ([design system](docs/design-system.md))
- Colours only via tokens; every new colour needs a dark **and** a light value meeting WCAG AA (4.5:1).
- Two themes, dark default. The theme logic lives only in `lib/theme.js`; toggles are stateless `[data-theme-toggle]` buttons. Don't add React theme state.
- Mobile-first: base styles for phones, `min-width` at 600px and 861px. No horizontal scroll from 320px to 1440px. Touch targets ≥ 44px (`--tap`).
- Never hide content until JavaScript runs (no scroll-reveal) ([D08](docs/decisions.md#d08-no-scroll-triggered-reveal-animations)).
- The home page's first phone screen must keep: name, headline, pitch, CTAs, proof tiles ([D06](docs/decisions.md#d06-the-home-page-is-designed-against-drop-off)).
- `/resume/` prints on at most two A4 pages, with no entry split across the break ([D22](docs/decisions.md#d22-the-résumé-is-two-pages)).

**Project pages**
- Never hand-edit `public/projects/<slug>/index.html`. Edit the inputs, run `python3 scripts/build-project-pages.py`, and commit the output. CI fails if pages are stale.
- Never modify the body of the knitr reports; the generator only wraps them.
- Shared project-page classes use the `cd-` prefix (Bootstrap 3 is present on the reports).

## Verify before committing

```bash
npx tsc --noEmit
npm run lint                                     # must report no warnings or errors
python3 scripts/build-project-pages.py --check   # must report "all project pages up to date"
npm run build
```

For visual changes, also check both themes at 320px, 390px and desktop widths ([checklist](docs/development.md#verifying-layout-and-themes)), and that `/resume/` still prints on two pages at most.

## Keep the docs true

If you change behaviour, a file location, a command, or a convention, update the matching doc in `docs/` in the same commit. If you make a non-obvious decision, add a record to [docs/decisions.md](docs/decisions.md).
