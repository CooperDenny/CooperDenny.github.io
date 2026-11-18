# Editing content

Recipes for every common change. Each one says **which file to edit**, shows **what to write**, and ends with **how to check it**.

> **The one rule:** every claim on the site must be traceable to something real — a role, a project write-up, or a published result. Don't invent metrics. (See [decision D11](decisions.md#d11-brownlow-results-are-reported-without-headline-accuracy) for the Brownlow example of why this matters.)

## Contents

- [Where content lives](#where-content-lives)
- [Profile: headline, pitch, summary](#profile-headline-pitch-summary)
- [Name, role, employer, location](#name-role-employer-location)
- [Proof tiles](#proof-tiles)
- [Experience](#experience) — [add a job](#add-a-job) · [record a promotion](#record-a-promotion) · [add a logo](#add-a-logo)
- [Projects](#projects) — [edit a card](#edit-a-project-card) · [add a project](#add-a-project) · [the featured project](#the-featured-project)
- [Project pages](#project-pages) — [edit wording](#edit-a-project-pages-wording) · [update a report after re-knitting](#update-a-report-after-re-knitting-it)
- [Skills](#skills)
- [Education](#education)
- [Contact details](#contact-details)
- [Section headings and navigation](#section-headings-and-navigation)
- [The résumé](#the-résumé)
- [Site settings: URL, analytics, fonts](#site-settings-url-analytics-fonts)
- [Checklist before you push](#checklist-before-you-push)

---

## Where content lives

| Content | File |
|---|---|
| Home page and résumé: profile, experience, project cards, skills, education | [`content/profile.ts`](../content/profile.ts) |
| Name, role, employer, location (shared with project pages) | [`content/identity.json`](../content/identity.json) |
| Project page list: slug, title, one-line teaser, order | [`content/projects.json`](../content/projects.json) |
| Project page wording | [`scripts/project_pages/content.py`](../scripts/project_pages/content.py) |
| Section headings, nav labels, section intros | [`content/sections.ts`](../content/sections.ts) |
| Site URL, Google Analytics ID, Google Fonts URL | [`config/site.json`](../config/site.json) |
| SEO title/description and share text | [`config/site.ts`](../config/site.ts), [`lib/seo.ts`](../lib/seo.ts) |

Components never contain copy. If you're editing text inside a `.tsx` file under `components/`, stop: it belongs in one of the files above. ([Why](architecture.md#rule-1-one-source-per-fact).)

Each fact lives in exactly one place. Change it there and every page that shows it updates: the home page, the résumé, project pages, structured data and the sitemap.

---

## Profile: headline, pitch, summary

Edit `profile` in [`content/profile.ts`](../content/profile.ts):

| Field | Where it appears | Guidance |
|---|---|---|
| `headline` | Large line under your name on the home page | One sentence. It's the first thing a recruiter reads. |
| `pitch` | Paragraph under the headline | At most two sentences: the hero must fit one phone screen ([why](decisions.md#d06-the-home-page-is-designed-against-drop-off)). |
| `resumeSummary` | Opening paragraph of `/resume` | Three or four sentences. |
| `coreStack` | "Core stack" line under the proof tiles | Five or six tools, most important first. |

**Check:** `npm run dev`, then look at `/` on a narrow window: the headline, pitch, buttons and first proof tiles should all be visible without scrolling.

## Name, role, employer, location

Edit [`content/identity.json`](../content/identity.json). These four values appear on the home page, the résumé, the page title, structured data (JSON-LD) and the nav and footer of every project page. Then regenerate the project pages, which read the same file:

```bash
python3 scripts/build-project-pages.py
```

When your **role** changes, also update the matching entry in [Experience](#record-a-promotion).

## Proof tiles

The four tiles under the hero buttons are the "evidence at a glance". Each one links to the section that backs it up. Edit `profile.proof` in [`content/profile.ts`](../content/profile.ts):

```ts
proof: [
  { value: '2+ yrs', label: 'Junior → Data Scientist at PlayHQ', href: anchor('experience') },
  // value: short and numeric if possible · label: what it means · href: anchor('<section>')
],
```

Use `anchor('experience' | 'projects' | 'skills' | 'education' | 'contact')` for `href`, never a hand-typed `'#…'`, so links can't break if a section id changes.

Tile text is **not** computed from your data. If a fact behind a tile changes (for example tenure), update the tile by hand.

---

## Experience

`experience` in [`content/profile.ts`](../content/profile.ts) is a list of jobs, **most recent first**.

### Add a job

Add an object at the top of the list:

```ts
{
  company: 'Example Co',
  logo: '/images/logo-example.webp',      // see "Add a logo" below
  logoAlt: 'Example Co logo',
  employmentType: 'Full-time',            // Full-time | Contract | Internship | …
  roles: [{ title: 'Senior Data Scientist', start: 'Jan 2027', end: 'Present' }],
  summary: 'One sentence on what the company does and the scale you worked at.',
  highlights: [
    'Lead with the outcome, then how — a number if you have a real one.',
    // 3–4 bullets
  ],
  stack: ['SQL', 'Python', 'dbt'],        // shown as chips; keep to the tools you actually used here
},
```

Dates are free text in `Mmm YYYY` form. They're shown exactly as written, as ranges like "Jan 2027 – Present". The page shows the whole time at the company (first role's start to current role's end), so you never type the tenure.

### Record a promotion

Add the new role at the **front** of that job's `roles`, and close off the previous one:

```ts
roles: [
  { title: 'Senior Data Scientist', start: 'Mar 2028', end: 'Present' },   // new, first
  { title: 'Data Scientist', start: 'Jul 2026', end: 'Mar 2028' },         // was "Present"
  { title: 'Junior Data Scientist', start: 'Nov 2024', end: 'Jul 2026' },
],
```

The job card then shows the current title, and a "Promoted from …" line for each earlier role. The résumé lists every role with its dates. Also update:

- `role` in [`content/identity.json`](../content/identity.json), then run `python3 scripts/build-project-pages.py`;
- the promotion [proof tile](#proof-tiles), if its wording no longer holds.

### Add a logo

Put the file in `public/images/` as `logo-<name>.webp`, **at most 240px on the long side** (it's shown at 48–56px, so 240px is ample even on high-density screens). Any converter works, for example [Squoosh](https://squoosh.app/), or `cwebp -resize 240 0 logo.png -o logo-name.webp`. Host logos locally; don't hotlink ([why](decisions.md#d04-images-are-plain-img-self-hosted-webp)). SVG is fine too, as with `logo-monash.svg`.

---

## Projects

The home page has one **featured project** (the Brownlow model), a grid of **project cards** (`projects`), and a compact **Earlier work** list of title links (`earlierProjects`), all in [`content/profile.ts`](../content/profile.ts). Entries in both `projects` and `earlierProjects` have the same shape, so to demote or promote a project, move its entry from one list to the other ([why](decisions.md#d20-lower-signal-projects-are-listed-not-carded)).

### Edit a project card

Each card in `projects` has a `kicker` (a small category label), a `oneLiner` (the one sentence shown on the card), a `summary` (the longer version used on the résumé) and a `stack`.

Keep `oneLiner` to **one sentence**: the card is a teaser, and the project page has the detail ([why](decisions.md#d06-the-home-page-is-designed-against-drop-off)).

### Add a project

**A. A card that links somewhere else** (GitHub, a live site). Add a plain object to `projects`:

```ts
{
  slug: 'my-project',
  title: 'My Project',
  kicker: 'Category · Category',
  oneLiner: 'One sentence a recruiter will read.',
  summary: 'Two sentences for the résumé.',
  stack: ['Python', 'dbt'],
  links: [{ label: 'View on GitHub', href: 'https://github.com/CooperDenny/my-project' }],
},
```

External links open in a new tab automatically, because `https://` URLs are detected; there's no flag to set.

**B. A card with its own project page.** Four steps:

1. **Register the page** in [`content/projects.json`](../content/projects.json). Its position in `pages` sets the "Next project" order.
   ```json
   { "slug": "my-project", "title": "My Project", "teaser": "Shown in the previous page's Next project card." }
   ```
2. **Write the page copy** in [`scripts/project_pages/content.py`](../scripts/project_pages/content.py):
   - in `HAND_PAGES`, for a page generated entirely from that copy (copy an existing entry as a template);
   - in `REPORT_PAGES`, for an R Markdown report. Knit it first, so `public/projects/<slug>/index.html` exists.

   The generator creates `public/projects/<slug>/` for a new hand page; put any images it uses in that folder. Field reference: [Project pages → Page copy](project-pages.md#page-copy-reference).
3. **Generate it:** `python3 scripts/build-project-pages.py`.
4. **Add the card** to `projects` with `pageProject`, which takes the title and URL from the catalog so you don't type them twice:
   ```ts
   pageProject('my-project', {
     kicker: 'Category · Category',
     oneLiner: 'One sentence a recruiter will read.',
     summary: 'Two sentences for the résumé.',
     stack: ['Python', 'dbt'],
     linkLabel: 'Read the write-up',
   }),
   ```

The sitemap picks up the new page automatically. If you register a page in `projects.json` but give it no copy, the generator refuses to run and names the page. A `pageProject` slug that isn't in `projects.json` fails the Next build with `Unknown project page "<slug>"`.

To put a project on the printed résumé, add `onResume: true` to its card, and check the résumé still [fits two pages](#the-résumé). The résumé shows its `summary` as one bullet; for a bigger project, give it `resumeBullets: ['…', '…']` instead (the club platform has four).

### The featured project

`featuredProject` is the large Brownlow card. Keep it as **one consolidated card** linking to every season's write-up; don't add a card per season. Its `metrics` each have four fields:

| Field | Used for |
|---|---|
| `value` | The big number on the tile, e.g. `'r = 0.93'` |
| `short` | The tile caption, 2–4 words |
| `label` | The full description (tooltip) |
| `sentence` | The clause used on the résumé, where the metrics are joined into one sentence |

**Never use game-level accuracy as a headline metric** for the Brownlow model. It sits at the all-zeros baseline ([decision D11](decisions.md#d11-brownlow-results-are-reported-without-headline-accuracy)).

---

## Project pages

All seven `/projects/<slug>/` pages are produced by a generator. **Don't edit their HTML by hand**: it gets overwritten, and the deploy fails if the pages are out of date. Full reference: [docs/project-pages.md](project-pages.md).

### Edit a project page's wording

1. Edit the page's entry in [`scripts/project_pages/content.py`](../scripts/project_pages/content.py). Titles and teasers are in [`content/projects.json`](../content/projects.json).
2. Run `python3 scripts/build-project-pages.py`.
3. Commit both the copy change and the regenerated `public/projects/<slug>/index.html`.

### Update a report after re-knitting it

1. Knit the `.Rmd` in R as usual, and replace `public/projects/<slug>/index.html` with the new output.
2. Run `python3 scripts/build-project-pages.py`. It re-applies the site's header, summary, navigation and code folding. For the arbitrage finder, it also recomputes the headline numbers and snapshot date from the new data.
3. Open the page and check that the "At a glance" summary still matches the new results. The **Brownlow** numbers are written by hand in `content.py`, so update them there if the model changed.

---

## Skills

`skills` in [`content/profile.ts`](../content/profile.ts) is a list of groups, each with a `label` and `items`:

```ts
{ label: 'Data engineering', items: ['dbt / dbt Cloud', 'Snowflake', 'Fivetran'] },
```

Skills are plain text on purpose: recruiters scan and search for keywords ([why](decisions.md#d07-skills-are-text-not-logos)). Don't add collaboration tools (Slack, Teams, Zoom, Google Drive, Office); they read as padding.

A group with `onResume: false` (currently Tooling) is shown on the website but left off the printed résumé.

## Education

Edit `education` in [`content/profile.ts`](../content/profile.ts). `result` is shown verbatim, for example `'WAM 77.6 — Distinction average'`.

## Contact details

Edit `profile.contact` in [`content/profile.ts`](../content/profile.ts). Every contact surface reads from there: the hero buttons, the contact section, the sticky mobile bar, the résumé header, the structured data and the `/links/` page.

`instagram`, `facebook`, `spotify` and `phone` are personal, so they appear **only** on `/links/` (the Instagram bio link). `phone` is stored as displayed (`'0478 944 105'`); `waHref()` in `lib/links.ts` turns it into a `https://wa.me/61…` WhatsApp link (message or call); `/links/` shows it as "WhatsApp", not as a number. `contactChannels()` in `content/selectors.ts` is the professional set used everywhere else; `linkInBioChannels()` sets the `/links/` order. To add a link to `/links/`, add it to `ContactLinks` in `content/types.ts`, fill it in here, and list it in `linkInBioChannels()`. Never link to `/links/` from the site or add it to the sitemap ([D19](decisions.md#d19-the-link-in-bio-page-is-unlisted)).

## Section headings and navigation

Edit [`content/sections.ts`](../content/sections.ts). Each section has:

| Field | Used for |
|---|---|
| `id` | The `#anchor` |
| `label` | The nav link and the small label above the heading |
| `title` | The heading |
| `intro` | An optional line under the heading |

The nav menu is generated from this list, in this order. Changing an `id` updates the nav, the proof-tile links and the sticky bar together.

## The résumé

`/resume` is built from the same data as the home page, so there's nothing separate to update. It shows:

- every job and role;
- the featured project, plus any project card with `onResume: true`;
- education;
- every skill group except those with `onResume: false`.

**It must print on at most two A4 pages** ([D22](decisions.md#d22-the-résumé-is-two-pages)). Page one should carry the summary, experience and the featured project; entries never split across the break. After adding content, open `/resume`, choose **Save as PDF**, and check the page count and where the break falls. To check from the command line, use the Playwright snippet in [Development → Checking the résumé](development.md#checking-the-résumés-page-count).

## Site settings: URL, analytics, fonts

[`config/site.json`](../config/site.json) holds the production URL, the Google Analytics ID and the Google Fonts stylesheet URL. The Next.js app and the project-page generator both read it. After changing it, run `python3 scripts/build-project-pages.py`.

The page title and the search/share descriptions are in [`config/site.ts`](../config/site.ts) and [`lib/seo.ts`](../lib/seo.ts).

---

## Checklist before you push

- [ ] `npm run dev` and look at what you changed, on a narrow window and a wide one, in **both themes** (sun/moon button).
- [ ] If you changed project-page copy or a shared input (`content/*.json`, `config/site.json`, `lib/theme.js`, or `--bg` in `tokens.css`): run `python3 scripts/build-project-pages.py`. When unsure, just run it; it only rewrites pages that changed.
- [ ] If you added content that appears on the résumé: it still prints on two pages at most, with no entry split across the break.
- [ ] Run the four checks in [Development → Before you push](development.md#before-you-push).
