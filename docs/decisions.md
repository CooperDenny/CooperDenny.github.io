# Decisions

The reasoning behind choices that a future change might want to undo. Before reversing one, read its context: most of these were made to fix a specific, observed problem.

Each record has the **context** (the problem), the **decision**, and its **consequences** (including the costs). Status is *Accepted* unless noted.

| # | Decision |
|---|---|
| [D01](#d01-static-export-to-github-pages) | Static export to GitHub Pages |
| [D02](#d02-project-pages-are-static-html-not-react) | Project pages are static HTML, not React |
| [D03](#d03-tailwind-preflight-is-disabled) | Tailwind preflight is disabled |
| [D04](#d04-images-are-plain-img-self-hosted-webp) | Images are plain `<img>`, self-hosted WebP |
| [D05](#d05-fonts-load-via-link-icons-are-inline-svg) | Fonts load via `<link>`; icons are inline SVG |
| [D06](#d06-the-home-page-is-designed-against-drop-off) | The home page is designed against drop-off |
| [D07](#d07-skills-are-text-not-logos) | Skills are text, not logos |
| [D08](#d08-no-scroll-triggered-reveal-animations) | No scroll-triggered reveal animations |
| [D09](#d09-dark-by-default-with-a-lightdark-switcher) | Dark by default, with a light/dark switcher |
| [D10](#d10-one-set-of-design-tokens-for-every-page) | One set of design tokens for every page |
| [D11](#d11-brownlow-results-are-reported-without-headline-accuracy) | Brownlow results are reported without headline accuracy |
| [D12](#d12-the-résumé-is-generated-and-fits-one-a4-page) | The résumé is generated and fits one A4 page |
| [D13](#d13-one-source-per-fact-across-typescript-and-python) | One source per fact, across TypeScript and Python |
| [D14](#d14-react-uses-composition-the-generator-uses-classes) | React uses composition; the generator uses classes |
| [D15](#d15-generated-project-pages-are-committed-and-checked-in-ci) | Generated project pages are committed and checked in CI |
| [D16](#d16-trailing-slashes-on-every-route) | Trailing slashes on every route |
| [D17](#d17-playhq-work-leads-the-hero-brownlow-figures-stay-on-its-card) | PlayHQ work leads the hero; Brownlow figures stay on its card |

---

### D01. Static export to GitHub Pages

**Context.** The site has no dynamic content: no CMS, forms, accounts or per-request data. It's hosted free on GitHub Pages, which serves only static files.

**Decision.** `output: 'export'` in `next.config.js`; `npm run build` writes plain HTML/CSS/JS to `out/`, which GitHub Actions publishes.

**Consequences.** No server, so none of: server actions, API routes (`app/api/*`), middleware, ISR/revalidation, the `next/image` optimisation API, or `rewrites()`/`redirects()` in `next.config.js` (Next errors at build time if you set them). `next start` doesn't work; `npm run start` serves `out/` instead. If a future feature genuinely needs a server, revisit this decision rather than working around it.

### D02. Project pages are static HTML, not React

**Context.** Three write-ups are R Markdown reports: knitr output of around 2 MB, with jQuery, Bootstrap 3 and interactive DataTables embedded. They're regenerated from R whenever the analysis changes.

**Decision.** All project pages live in `public/projects/<slug>/index.html` and are served as-is. A Python generator wraps the reports in the site's chrome without modifying their bodies, and generates the three simpler pages in full ([project-pages.md](project-pages.md)).

**Consequences.** The R workflow is untouched: knit, then run the generator. Shared styles need a `cd-` class prefix to avoid Bootstrap's `.nav`, `.btn` and similar, and project pages have their own small stylesheet (`public/projects/site.css`). Rewriting the reports as React would cost a lot, gain nothing, and break on every re-knit.

### D03. Tailwind preflight is disabled

**Context.** The site's CSS is a hand-written design system with its own reset. Tailwind's preflight would reset the same properties a second time and subtly change spacing.

**Decision.** `corePlugins.preflight = false` in `tailwind.config.ts`. Tailwind utilities remain available.

**Consequences.** Existing components use semantic classes (`.card`, `.chip`, `.btn--primary`); new code should extend those rather than mix in utilities, to keep one styling vocabulary.

### D04. Images are plain `<img>`, self-hosted WebP

**Context.** `next/image` optimisation needs a server (see D01). The original site hot-linked employer logos from third-party sites, and Wikimedia rate-limited them, so logos broke silently. The hero photo was a 317 KB PNG shown at 64–260px.

**Decision.** Plain `<img>` tags (the `no-img-element` lint rule is disabled per line). Every image is self-hosted in `public/images/` as WebP, sized to at most 2× its display size. The hero uses a `<picture>` with a 5 KB mobile avatar and a 14 KB desktop portrait.

**Consequences.** Images load fast and can't break due to someone else's server. New images must be resized before committing ([how](editing-content.md#add-a-logo)). `hero-image.png` is kept only for social-preview images.

### D05. Fonts load via `<link>`; icons are inline SVG

**Context.** Font Awesome's CSS and webfonts cost about 275 KB, render-blocking, for about 15 icons. `next/font` would scope font-family names, which the hand-written CSS references by name.

**Decision.** Inter and JetBrains Mono load from Google Fonts via `<link>` (URL in `config/site.json`). Icons are inline SVG paths from Font Awesome Free 6.5.2 (CC BY 4.0), stored once in `content/icons.json` and used by both React and the generator.

**Consequences.** No icon font, and icons can't fail to load. Adding an icon means copying its path from the `@fortawesome/fontawesome-free` package into `icons.json`.

### D06. The home page is designed against drop-off

**Context.** Recruiters skim. On a phone (iPhone 13 viewport), the old home page was 14.5 screens long, its first screen showed only the name, and the projects started on screen 5.

**Decision.**
- The first screen holds identity, a one-sentence headline, a short pitch, the Résumé/Email/LinkedIn/GitHub actions, and **proof tiles** that link to their evidence.
- Cards show a one-sentence `oneLiner`; detail is one tap away. The Brownlow method sits in a native `<details>`.
- Whole project cards are tap targets.
- A phone-only sticky Résumé/Email bar appears between the hero and Contact.

**Consequences.** The page is about 9.7 screens on a phone (measured November 2026), and 408 KB versus 1.07 MB before. New content has to earn its place: no extra paragraphs in the hero, one sentence per card.

### D07. Skills are text, not logos

**Context.** The original "tech stack" was a wall of 28 logos, including Google Meet, Teams, Slack and Office. Logos can't be scanned or searched for keywords, and the collaboration tools read as padding to a data-science reviewer.

**Decision.** Grouped plain-text chips (languages, modelling, data engineering, BI, tooling); collaboration tools removed.

**Consequences.** Better for skimming and keyword search. Don't add collaboration tools back.

### D08. No scroll-triggered reveal animations

**Context.** The original site kept cards at `opacity: 0` until an IntersectionObserver fired. Fast scrolling, printing, crawlers and link previews saw blank sections. Most of the experience, every project and the education section were invisible in a full-page screenshot.

**Decision.** No content depends on JavaScript to become visible. The particle system and floating charts went too.

**Consequences.** Every page shows everything with JavaScript off. Motion is limited to small transitions, which turn off under `prefers-reduced-motion`.

### D09. Dark by default, with a light/dark switcher

**Context.** The owner prefers the dark look, but some visitors read better in light, and a switcher had existed before. A theme switcher on a server-rendered site risks a flash of the wrong theme, and React hydration mismatches.

**Decision.** Dark is the default; the choice is saved in `localStorage`. One script, `lib/theme.js`, is inlined in the `<head>` of every page (Next and generated), so the theme applies before the body renders. Toggle buttons are stateless `[data-theme-toggle]` elements: the script handles clicks by delegation, and CSS picks the icon. The light palette meets WCAG AA throughout.

**Consequences.** No flash, no hydration warnings, and identical behaviour on every page. Every new colour needs a value in both themes ([design system](design-system.md#adding-a-token)).

**History.** The site briefly went dark-only (the switcher was removed), then the switcher was restored at the owner's request.

### D10. One set of design tokens for every page

**Context.** Home-page and project-page styles had separate copies of the palette, "kept in sync" by hand: a guaranteed future inconsistency.

**Decision.** `public/tokens.css` is the only place colours, type and spacing are defined. The Next app `@import`s it, and project pages load it via `<link>`. The browser `theme-color` is read from `--bg` at build time, not repeated.

**Consequences.** Change a value once and every page follows. Project pages load one extra small stylesheet.

### D11. Brownlow results are reported without headline accuracy

**Context.** The Brownlow reports show 93.1% game-level accuracy. But about 93.5% of player-games poll zero votes, so a model that predicts zero for everyone scores about the same (the reports' own output gives p = 0.92 for accuracy beating the no-information rate). Any technical reviewer would spot an "accuracy" headline as meaningless.

**Decision.** Headline the metrics that carry information:
- season-tally correlation, r = 0.93 (2024);
- mean absolute error, 2.0 votes per player;
- 3-vote-player recall, 56% of games, from 46 players;
- the qualitative result: Cripps and Daicos called as the top two, in order.

A short note on the card and on the project pages explains why accuracy isn't used.

**Consequences.** The claims survive scrutiny, and the note itself signals statistical judgement. Never reintroduce accuracy as a headline.

### D12. The résumé is generated and fits one A4 page

**Context.** Recruiters ask for a CV first. A separately maintained PDF would drift from the site.

**Decision.** `/resume/` renders from the same `content/profile.ts` data, with print styles for one A4 page and a "Save as PDF" button. What goes on paper is controlled by `onResume` flags.

**Consequences.** One source for the site and the CV. Adding content can push it past one page, so check after edits ([how](development.md#checking-the-résumé-is-one-page)).

### D13. One source per fact, across TypeScript and Python

**Context.** Names, titles, URLs, icons, colours and anchors were each defined in two or more places across the React app and the generator.

**Decision.** Facts both tools need live in JSON (`content/projects.json`, `identity.json`, `icons.json`, `config/site.json`) or in shared assets (`tokens.css`, `lib/theme.js`), read by both. Within TypeScript, derived values live in `content/selectors.ts` and section anchors in `content/sections.ts`. External-link behaviour is derived from the URL. The full table is in [architecture → Rule 1](architecture.md#rule-1-one-source-per-fact).

**Consequences.** Changes happen in one place. Some values that used to be inline now need a short trip to a JSON file.

### D14. React uses composition; the generator uses classes

**Context.** The codebase was refactored for SOLID, DRY and SLAP. SOLID comes from class-based design, but React's class components are a legacy API.

**Decision.** In React, apply the principles through composition: small single-purpose components, props instead of imports (dependency inversion via `app/` composition roots), narrow props, and data-driven extension. In the Python generator, use real classes: `ProjectPage` → `HandPage`/`ReportPage`, a `Transform` pipeline and a `ReportExtension` hook.

**Consequences.** Each side follows its language's idioms. There are more, smaller files; [architecture.md](architecture.md) maps them.

### D15. Generated project pages are committed and checked in CI

**Context.** Project pages are produced by a script, so a copy edit made without re-running it would ship stale pages, and nothing would notice.

**Decision.** Commit the generated HTML, so the repo is the deployed site and diffs are reviewable. CI runs `build-project-pages.py --check` before building and fails the deploy if any page differs from what the generator would produce.

**Consequences.** Stale pages can't be deployed. After editing an input, you must run the generator and commit its output.

### D16. Trailing slashes on every route

**Context.** With the default `trailingSlash: false`, Next exports `out/resume.html`, so `/resume/` 404s on GitHub Pages. Project pages are folders (`/projects/<slug>/`).

**Decision.** `trailingSlash: true`; routes export as `<route>/index.html`, and links use the trailing-slash form.

**Consequences.** `/resume` and `/resume/` both work, consistent with the project pages.

### D17. PlayHQ work leads the hero; Brownlow figures stay on its card

**Context.** The hero proof tiles used to include the Brownlow model's r = 0.93. By November 2026 the stronger evidence is production work at PlayHQ: an embedded analytics product used by 50,000+ people at 15,000+ sporting organisations, and a churn model trained, scored and explained in Snowflake (0.81 test ROC AUC on the latest, unseen season pairs, recorded for model V10 in the analytics-platform churn README). A university side project shouldn't headline over that.

**Decision.**
- Proof tiles: tenure ("2+ yrs"), the 50,000+ users figure, the three sport organisations, and the degree. The Brownlow figures (D11) stay on the featured card, its project pages and the résumé's project entry, not in the hero.
- PlayHQ highlights describe the specific systems (embedded analytics, churn model, explanations, self-serve analytics, reporting for national bodies), each traceable to the GameOnSports repositories.
- To keep `/resume/` on one A4 page with the longer PlayHQ entry, the betting arbitrage card is no longer `onResume`. It stays on the website.

**Consequences.** Tile text isn't computed, so update "2+ yrs" and the user count by hand as they change. If the served churn model is re-evaluated, update the 0.81 figure in `content/profile.ts` to match.

