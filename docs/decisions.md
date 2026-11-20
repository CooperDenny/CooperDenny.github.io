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
| [D09](#d09-dark-by-default-with-a-lightdark-switcher) | Dark by default, with a light/dark switcher (superseded by D25) |
| [D10](#d10-one-set-of-design-tokens-for-every-page) | One set of design tokens for every page |
| [D11](#d11-brownlow-results-are-reported-without-headline-accuracy) | Brownlow results are reported without headline accuracy |
| [D12](#d12-the-résumé-is-generated-and-fits-one-a4-page) | The résumé is generated and fits one A4 page (*superseded by D22*) |
| [D13](#d13-one-source-per-fact-across-typescript-and-python) | One source per fact, across TypeScript and Python |
| [D14](#d14-react-uses-composition-the-generator-uses-classes) | React uses composition; the generator uses classes |
| [D15](#d15-generated-project-pages-are-committed-and-checked-in-ci) | Generated project pages are committed and checked in CI |
| [D16](#d16-trailing-slashes-on-every-route) | Trailing slashes on every route |
| [D17](#d17-playhq-work-leads-the-hero-brownlow-figures-stay-on-its-card) | PlayHQ work leads the hero; Brownlow figures stay on its card |
| [D18](#d18-project-pages-follow-their-source-repositories) | Project pages follow their source repositories |
| [D19](#d19-the-link-in-bio-page-is-unlisted) | The link-in-bio page is unlisted |
| [D20](#d20-lower-signal-projects-are-listed-not-carded) | Lower-signal projects are listed, not carded |
| [D21](#d21-the-cricket-club-page-is-an-engineering-case-study) | The cricket club page is an engineering case study |
| [D22](#d22-the-résumé-is-two-pages) | The résumé is two pages |
| [D23](#d23-the-cricket-club-page-has-a-full-feature-tour) | The cricket club page has a full feature tour |
| [D24](#d24-navy-band-cyan-accent-and-archivo) | Navy band, cyan accent and Archivo |
| [D25](#d25-one-dark-theme) | One dark theme |

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

**Decision.** The fonts (Archivo and JetBrains Mono since [D24](#d24-navy-band-cyan-accent-and-archivo); Inter before) load from Google Fonts via `<link>` (URL in `config/site.json`). Icons are inline SVG paths from Font Awesome Free 6.5.2 (CC BY 4.0), stored once in `content/icons.json` and used by both React and the generator.

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

**History.** The site briefly went dark-only (the switcher was removed), then the switcher was restored at the owner's request. In November 2026 it went dark-only again: **superseded by [D25](#d25-one-dark-theme)**.

### D10. One set of design tokens for every page

**Context.** Home-page and project-page styles had separate copies of the palette, "kept in sync" by hand: a guaranteed future inconsistency.

**Decision.** `public/tokens.css` is the only place colours, type and spacing are defined. The Next app `@import`s it, and project pages load it via `<link>`. The browser `theme-color` is read from `--band` at build time, not repeated.

**Consequences.** Change a value once and every page follows. Project pages load one extra small stylesheet.

### D11. Brownlow results are reported without headline accuracy

**Context.** The Brownlow reports show 93.1% game-level accuracy. But about 93.5% of player-games poll zero votes, so a model that predicts zero for everyone scores about the same (the reports' own output gives p = 0.92 for accuracy beating the no-information rate). Any technical reviewer would spot an "accuracy" headline as meaningless.

**Decision.** Headline the metrics that carry information:
- season-tally correlation, r = 0.93 (2024);
- mean absolute error, 2.0 votes per player;
- 3-vote-player recall, 56% of games, from 46 players;
- the qualitative result: Cripps and Daicos called as the top two, in order.

(Since [D24](#d24-navy-band-cyan-accent-and-archivo) the home-page card shows only the 3-vote recall; the résumé and project pages keep all of these.)

A short note on the card and on the project pages explains why accuracy isn't used.

**Consequences.** The claims survive scrutiny, and the note itself signals statistical judgement. Never reintroduce accuracy as a headline.

### D12. The résumé is generated and fits one A4 page

**Status.** The one-page limit is superseded by [D22](#d22-the-résumé-is-two-pages). Generating the résumé from `content/profile.ts` still stands.

**Context.** Recruiters ask for a CV first. A separately maintained PDF would drift from the site.

**Decision.** `/resume/` renders from the same `content/profile.ts` data, with print styles for one A4 page and a "Save as PDF" button. What goes on paper is controlled by `onResume` flags.

**Consequences.** One source for the site and the CV. Adding content can push it past one page, so check after edits ([how](development.md#checking-the-résumés-page-count)).

### D13. One source per fact, across TypeScript and Python

**Context.** Names, titles, URLs, icons, colours and anchors were each defined in two or more places across the React app and the generator.

**Decision.** Facts both tools need live in JSON (`content/projects.json`, `identity.json`, `icons.json`, `config/site.json`) or in shared assets (`tokens.css`), read by both. Within TypeScript, derived values live in `content/selectors.ts` and section anchors in `content/sections.ts`. External-link behaviour is derived from the URL. The full table is in [architecture → Rule 1](architecture.md#rule-1-one-source-per-fact).

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
- PlayHQ highlights describe the specific systems (AnalyticsHQ ownership, the Admin Portal dashboards, the Report Builder rebuild, financial reporting, the churn model, self-serve analytics, data shares for national bodies), traceable to the GameOnSports repositories and PlayHQ's public help-centre articles on Dashboards and Reports.
- To keep `/resume/` on one A4 page with the longer PlayHQ entry, the betting arbitrage card is no longer `onResume`. It stays on the website. (*Reversed by [D22](#d22-the-résumé-is-two-pages): with two pages it is back on the résumé.*)

**Consequences.** Tile text isn't computed, so update "2+ yrs" and the user count by hand as they change. If the served churn model is re-evaluated, update the 0.81 figure in `content/profile.ts` to match.

### D18. Project pages follow their source repositories

**Context.** By November 2026 several projects had moved on from what their pages described: the Brownlow model had a third tested season (2025), the cricket club stats page had grown into the full club website at epcc.org.au, CricketStatsHub had become an R library with a BBL dashboard, and the pedestrian notebook's date range was fixed at January 2010 to October 2024.

**Decision.**
- Each page's copy is checked against its repository (CooperDenny/AFLBrownlowPredictor, EPCC-Website, MelbournePedestrianCountingSystem, CricketStatsHub, AussieArbFinder), and figures come from the repo or the live site.
- 2025 gets its own report page (`afl-brownlow-2025`), linked from the one Brownlow card (D11 still applies). Its 44 MB dataset is linked on GitHub rather than copied here. The 2026 folder is a pre-count prediction with no results yet, so it has no page.
- The 2025 page leads with its strongest honest result (best 3-vote hit rate of the three seasons, top pick runner-up) and still reports the missed winner in the outcome.
- Cricket club screenshots are taken from the live site (the player page shown is Cooper's own) and stored as WebP at 1600px wide.

**Consequences.** Live-site figures drift as games are played. For the cricket club page this is handled by writing them so they can't go stale ([D21](#d21-the-cricket-club-page-is-an-engineering-case-study)); screenshots are snapshots and only need re-shooting if the site's design changes a lot. When a new Brownlow season is tested, add a page and a card link rather than a new card.

### D19. The link-in-bio page is unlisted

**Context.** Cooper wanted one URL for his Instagram bio that lists all his socials, including personal ones (Instagram, Facebook) that don't belong in front of recruiters on the portfolio or résumé.

**Decision.**
- `/links/` is a separate, chromeless page (`app/links/page.tsx`). The home page and résumé moved into the `app/(site)/` route group, whose layout owns the nav, footer and sticky bar, so `/links/` can render without them. URLs are unchanged.
- It is unlisted, not secret: nothing on the site links to it, `app/sitemap.ts` leaves it out, and it sets `robots: noindex, nofollow` with no canonical. It is **not** disallowed in `robots.txt`, because that would publish the path and stop crawlers from reading the `noindex`.
- Instagram, Facebook and the mobile number live in `profile.contact` like every other channel, but only `linkInBioChannels()` uses them; `contactChannels()` (hero, contact section, résumé, JSON-LD `sameAs`) stays professional.

**Consequences.** Anyone with the URL can open it, and Instagram shows it publicly in the bio, so it must hold nothing private. That includes the mobile number: putting it there was Cooper's call, and it is exposed to scrapers as a `https://wa.me/…` WhatsApp link (changed from a `tel:` link so people can message or call via WhatsApp; the number itself is not shown on the page). It still ships the shared Next.js runtime (about 87 kB of JS), but the HTML is prerendered and readable before any script runs.

### D20. Lower-signal projects are listed, not carded

**Context.** The home grid gave the Melbourne pedestrian and Victorian property Power BI dashboards the same weight as the stronger projects. Next to a Data Scientist role and a production churn model, they pulled the portfolio toward "BI analyst". Readers judge a portfolio partly by its weakest visible item.

**Decision.**
- Both moved from `projects` (cards) to `earlierProjects` in `content/profile.ts`: a `ProjectList` rendered by `components/home/ProjectLinkList.tsx` as a compact "Earlier work" list under the grid, with a title link and the one-liner for each.
- Their pages are unchanged and stay in `content/projects.json`, so they keep their place in the "Next project" chain, the "All projects" link and the sitemap. Nothing is unlinked or hidden.
- The list is always visible (no `<details>` or JavaScript toggle; see [D08](#d08-no-scroll-triggered-reveal-animations)).

**Consequences.** The grid holds three cards, which fills one row at desktop width. To promote or demote a project, move its `pageProject(...)` entry between `projects` and `earlierProjects`. Neither dashboard was on the résumé, so the résumé doesn't change.

### D21. The cricket club page is an engineering case study

**Context.** By November 2026 epcc.org.au had grown from a stats site into the club's platform: 531 commits and 131 merged pull requests in eight months, an admin portal, an SES email platform, an in-browser video editor, a clubroom TV, an MCP server, and eleven architecture decision records. The page still described a stats site, which undersold the largest and most current piece of work in the portfolio, and told a recruiter nothing about how Cooper designs, decides and iterates.

**Decision.**
- The page is a case study: the brief, a tour, a system map, the data model, six decisions taken from the club repo's ADRs (each with *why* and *cost*), three hard problems, the Claude Code workflow, and an iteration timeline with a commits-by-month chart. Its card moves to the front of the home grid.
- Every figure traces to the club repo or the live site: commit and PR counts and the monthly series from `git log` on `main`; pages, tables, policies, ADRs and docs from the repo tree; players, runs, wickets and seasons from the live `/stats` page; the MCP tool count from a `tools/list` call to `/api/mcp`. Claude Code's share is stated plainly (277 of 531 commits written by Claude Code sessions), because hiding it would be the kind of claim D11 forbids.
- Charts are generated from data in `content.py` by the generator's `Renderer.bar_chart()`, as an HTML list with every value printed: no JavaScript, no SVG to keep legible at 320px, and the values are readable without the bars. Only single-series bar charts are supported; anything more complex should be a screenshot of the real thing.
- New screenshots (clubroom TV slides, three phone views) are taken from the live site and stored as WebP at 1600px wide, per D18.

**Consequences.** Cooper does not want to maintain this page, so **every figure on it must stay true without edits**:
- Growing counts (players, scorecards, runs, wickets, docs) are written as minimums (`800+`, `1,100+`), never exact live values.
- Build figures (commits, pull requests, pages, tables, ADRs, weeks shipped, Claude Code's share) are tied to a period: "in its first eight months" or "by November 2026". The glance note says so.
- Nothing names in-flight work (an open pull request, "this season"), and the timeline's last entry describes the ongoing practice, not a dated item.
- Figures are not fetched at build time: that would add a deploy dependency on the club site or its private repo, and break D15's committed-and-checked pages.

When editing the page, keep to these rules; then it needs no routine refresh. Screenshots are snapshots and stay valid until the club site's design changes a lot.

### D22. The résumé is two pages

**Context.** D12 held `/resume/` to one A4 page. By November 2026 that limit was costing more than it saved: the arbitrage project had been dropped to make room (D17), the cricket club platform (the largest current project, D21) couldn't be added even as a one-line entry, and the print type had been squeezed to 9pt. Cooper prefers a two-page résumé.

**Decision.**
- `/resume/` prints on at most two A4 pages. Page one carries the header, summary, experience and the featured Brownlow project; the remaining projects, education and skills follow.
- Print type goes from 9pt to 10pt, with looser spacing, since the squeeze existed only to fit one page.
- Résumé items keep `break-inside: avoid`, and section headings get `break-after: avoid`, so no entry or heading is split from its content across the break.
- The cricket club platform, the arbitrage finder and CricketStatsHub are all `onResume`. A big project can give the résumé several bullets through `resumeBullets` instead of its one-sentence `summary`. The club platform's bullets follow D21's rule: minimums and dated figures only, so they never need refreshing.

**Consequences.** There's room to add content again, but the limit is now two pages, and page one should still lead with the strongest material. Check the page count and where the break falls after résumé edits ([how](development.md#checking-the-résumés-page-count)). Some screeners read only page one, which is why experience and the featured project stay there.

### D23. The cricket club page has a full feature tour

**Context.** The cricket club case study showed six screenshots. Cooper wanted every feature of epcc.org.au shown, including the admin portal, which is behind an invite-only login, and the emails, which only exist in inboxes.

**Decision.**
- A **Feature tour** section ends the page: 120 screenshots in eight galleries (homepage, fixtures and match centre, stats and player pages, club pages, phone views, clubroom TV, admin portal, emails). It comes last, with its own jump link, so the case study still reads first.
- Galleries are data in `content.py`, rendered by the generator like charts. Each grid image is a thumbnail sized to D04's 2× rule that links to a full-size copy. The generator reads each thumbnail's real size for `width` and `height`, and refuses one that's missing or too wide.
- Every image lazy-loads; a first visit fetches only the few above the fold. The thumbnails total about 2.7 MB, and the full-size copies about 6.7 MB, fetched only when clicked.
- **Public pages** were captured from the live site. **The admin portal** was captured from a local copy of the club repo, with two lines temporarily changed so the auth check accepts a demo admin when Supabase isn't configured. Those changes were reverted and never committed. With no database the portal shows empty lists, so no member's details appear; the highlights screens use public Play Cricket data. Headless Chromium can't decode the clips' H.264 video, so the editor is shown on its branded intro cards and cropped above the clip thumbnails. **Emails** are the club repo's `scripts/preview-email.ts` output, with its sample content.
- Captions describe each screen and carry no live figures, per D21.

**Consequences.** The screenshots are a November 2026 snapshot. They stay accurate as a record and need re-taking only if the club site's design changes a lot. The repository grows by about 9 MB of images.

### D24. Navy band, cyan accent and Archivo

**Context.** By November 2026 the site used Tailwind's stock slate background, its `cyan-400`, Inter, cyan mono uppercase labels over every heading, 14px rounded cards and a radial glow: the default look of generated portfolios. The brief was to keep the navy-and-cyan feel but make it personal, taking cues from PlayHQ's products (an indigo header band over the page, bold sans type, data shown as tables and scores) without copying its brand: no PlayHQ colours, fonts, logo or code.

**Decision.**
- **Colour:** the existing palette stays: navy page `#0b1120`, cyan accent `#22d3ee`. The nav and hero are a band in the raised navy `#131c31` (the card surface), so the hero's curved edge shows against the page. Every pair meets AA ([contrast table](design-system.md#contrast)).
- **Type:** Archivo for everything, expanded (125% width, weight 800) for `h1`, `h2`, the brand and big numbers. Mono is kept for code only. Barlow, PlayHQ's font, was tried and rejected so the site doesn't read as PlayHQ-branded.
- **Hero:** the band has a curved bottom edge and faint lines of a footy oval and centre square. The proof stats are a ruled strip inside it, led by the 50,000+ figure in cyan, so the first phone screen still meets D06.
- **Brownlow card:** shows only the 3-vote recall (56%, with a bar), described in plain words. r = 0.93 and MAE 2.0 read as confusing without context on a skim; they stay on the résumé, in the card's method panel and on the project pages ([D11](#d11-brownlow-results-are-reported-without-headline-accuracy)).
- **Rejected:** a new palette (a petrol `#0b3c49` band with cyan `#3dd3d6` was built and dropped: the owner preferred the existing navy and cyan), sports slang for status (LIVE/FINAL tags, "Now playing"), a stats table in the hero, and condensed uppercase "scoreboard" type.

**Consequences.** The band is `--band-*` tokens; anything placed on it must use them, not `--accent`. Project pages match: their header is the same navy band with a curved bottom (full-bleed on the knitr reports too, via `report.css`), their labels are Archivo, and mono is kept for inline code only. The browser `theme-color` is `--band`, so the address bar runs into the nav. The résumé still prints on two pages with Archivo.

### D25. One dark theme

**Context.** After the redesign (D24) the band, nav and hero were the same in both themes, so the light theme only changed the page below the hero. Keeping it meant every colour needed two AA-checked values, every page inlined a theme script, and both navs carried a toggle. The owner said one mode is fine.

**Decision.** The site has one theme, dark. The light token block, `lib/theme.js`, `lib/themeScript.ts`, `ThemeToggle.tsx`, the generator's theme script and toggle, and the sun/moon icons are gone. `:root` keeps `color-scheme: dark`, and `theme-color` stays `--band`.

**Consequences.** Every page has no script in `<head>` and one fewer button in the nav (and on `/links/`). New colours need one value. A visitor's old saved `theme` key in `localStorage` is now ignored. Bringing a light mode back means reversing this record and re-doing D09's no-flash script.
