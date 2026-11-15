// Everything the site says about Cooper — data only (types: content/types.ts,
// derived views: content/selectors.ts). The home page and the printable résumé both
// render from this file, so they can never drift apart. Edit content here, not in JSX.
//
// Rule for this file: every claim must be traceable to something real — a role,
// a write-up under public/projects/, or a published result. No invented metrics.

import { pageHref, pageTitle, type PageSlug } from '@/content/catalog';
import identity from '@/content/identity.json';
import { anchor } from '@/content/sections';
import type { Education, FeaturedProject, Job, Profile, Project, SkillGroup } from '@/content/types';

/** A home-page card for a project that has its own /projects/<slug>/ page: title and URL come from the catalog. */
function pageProject(
  slug: PageSlug,
  { linkLabel, ...card }: Omit<Project, 'slug' | 'title' | 'links'> & { linkLabel: string },
): Project {
  return { slug, title: pageTitle(slug), ...card, links: [{ label: linkLabel, href: pageHref(slug) }] };
}

/** Identity, hero copy, proof tiles and contact details. */
export const profile: Profile = {
  name: identity.name,
  role: identity.role,
  employer: identity.employer,
  location: identity.location,
  /** Large PNG kept for Open Graph / JSON-LD; the page itself uses the WebP variants. */
  photo: '/images/hero-image.png',
  photoWebp: '/images/hero-image.webp',
  avatarWebp: '/images/hero-avatar.webp',
  headline:
    'I turn messy sports and product data into models, metrics and dashboards that people actually use.',
  pitch:
    'Data Scientist at PlayHQ, the platform behind community sport in Australia, New Zealand, the UK and Canada. I work end to end: dbt and Snowflake, churn and retention modelling, metric design, and BI.',
  resumeSummary:
    'Data Scientist with industry experience across product analytics, statistical modelling and analytics engineering in sport. Builds end-to-end: dbt models in Snowflake, regression-based churn and retention analysis, metric design, and BI in Tableau, Omni and Lightdash. Applied Data Science graduate (Monash, Distinction average) with a published, out-of-sample-validated AFL Brownlow prediction model.',
  // Above-the-fold evidence. Each tile jumps to the section that backs it up.
  proof: [
    { value: '20 mo', label: 'Junior → Data Scientist at PlayHQ', href: anchor('experience') },
    { value: 'r = 0.93', label: 'Brownlow model, tested on an unseen season', href: anchor('projects') },
    { value: '3', label: 'Sport orgs: PlayHQ, Boccia Australia, VIS', href: anchor('experience') },
    { value: 'Distinction', label: 'Applied Data Science, Monash', href: anchor('education') },
  ],
  coreStack: ['SQL', 'Python', 'R', 'dbt', 'Snowflake', 'Tableau'],
  contact: {
    email: 'cooper.denny@icloud.com',
    linkedin: { href: 'https://www.linkedin.com/in/cooper-denny/', handle: 'in/cooper-denny' },
    github: { href: 'https://github.com/CooperDenny', handle: 'CooperDenny' },
    x: { href: 'https://x.com/coopercdenny', handle: '@CooperCDenny' },
  },
};

/** Jobs, most recent first. Within a job, `roles` are most recent first. */
export const experience: Job[] = [
  {
    company: 'PlayHQ',
    logo: '/images/logo-playhq.webp',
    logoAlt: 'PlayHQ logo',
    employmentType: 'Full-time',
    roles: [
      { title: 'Data Scientist', start: 'Jul 2026', end: 'Present' },
      { title: 'Junior Data Scientist', start: 'Nov 2024', end: 'Jul 2026' },
    ],
    summary:
      'Sports-tech platform running tens of thousands of community games a week across Australia, New Zealand, the UK and Canada.',
    highlights: [
      'Model participant churn and retention with regression analysis, translating the results into recommendations for the business.',
      'Define success metrics and analyse user behaviour across the platform.',
      'Refactor dbt models in Snowflake and design data pipelines for PlayHQ’s first-party data platform.',
      'Build and own dashboards in Tableau, Omni and Lightdash for Product, Engineering, Finance and Community teams.',
    ],
    stack: ['SQL', 'Python', 'dbt', 'Snowflake', 'Tableau', 'Omni', 'Lightdash'],
  },
  {
    company: 'Boccia Australia',
    logo: '/images/logo-boccia.webp',
    logoAlt: 'Boccia Australia logo',
    employmentType: 'Contract',
    roles: [{ title: 'Data Support & App Developer', start: 'Jul 2024', end: 'Sep 2024' }],
    summary:
      'Paris 2024 Paralympic campaign — Australia’s best-ever Boccia result (two silver medals).',
    highlights: [
      'Extended the team’s R Shiny match-analysis app to cover Pairs and Teams events.',
      'Migrated historical match data into Snowflake so it could be queried at scale.',
      'Worked alongside analysts from the AIS, VIS and Paralympics Australia.',
    ],
    stack: ['R', 'R Shiny', 'Snowflake'],
  },
  {
    company: 'Victorian Institute of Sport',
    logo: '/images/logo-vis.webp',
    logoAlt: 'Victorian Institute of Sport logo',
    employmentType: 'Internship',
    roles: [{ title: 'Data Science Intern', start: 'Jul 2023', end: 'Oct 2023' }],
    summary: 'High-performance sport analytics for elite athletes.',
    highlights: [
      'Built an R Shiny performance-analysis app with interactive, filterable dashboards that replaced commercial software (Hudl Sportscode).',
      'Cleaned and integrated historical match data to power it.',
      'Worked directly with stakeholders in a high-performance environment.',
    ],
    stack: ['R', 'R Shiny'],
  },
];

/** The large featured card (the Brownlow model — one card for both seasons). */
export const featuredProject: FeaturedProject = {
  slug: 'afl-brownlow',
  title: 'AFL Brownlow Medal Prediction Model',
  kicker: 'Statistical modelling · Out-of-sample validated',
  oneLiner:
    'Predicts the 3-2-1 umpire votes for every player in every game. Called Patrick Cripps breaking the all-time vote record in 2024.',
  summary:
    'Predicts the 3-2-1 umpire votes for every player in every AFL game, then rolls them up into a season leaderboard. Correctly forecast Patrick Cripps breaking the all-time Brownlow vote record in 2024.',
  problem:
    'Brownlow votes are awarded by umpires, not stats — so can player-game statistics predict who polls, game by game?',
  approach: [
    'Compiled a player-game dataset (88 raw variables) from fitzRoy, afl.com.au, AFL Tables and the AFL Coaches Association; engineered features such as ineffective disposals and prior-season votes.',
    'Fitted an ordinal logistic regression (cumulative link model) on 2015–2023 home-and-away seasons, then scored the unseen 2024 season.',
    'Converted per-player vote probabilities into expected votes and allocated 3-2-1 within each game, mirroring how umpires vote.',
  ],
  metrics: [
    {
      value: 'r = 0.93',
      label: 'Predicted vs actual season vote tallies (2024)',
      short: 'Season-tally correlation',
      sentence: 'r = 0.93 between predicted and actual season tallies',
    },
    {
      value: '2.0',
      label: 'Mean absolute error, votes per player',
      short: 'Avg error (votes)',
      sentence: 'MAE of 2.0 votes per player',
    },
    {
      value: '56%',
      label: 'Games where the model picked the 3-vote player, from 46 on the field',
      short: '3-vote player found',
      sentence: 'the 3-vote player identified in 56% of games',
    },
  ],
  iteration:
    'v1 (2023) over-predicted ruckmen such as Max Gawn and Tim English. v2 (2024) added player position: correlation rose from 0.885 to 0.928 and MAE fell from 2.17 to 2.01.',
  evaluationNote:
    'Raw game-level accuracy (93%) is deliberately not the headline: with ~93.5% of player-games polling zero, an all-zeros baseline scores about the same. Per-class recall and season-level error are the honest measures.',
  stack: ['R', 'Ordinal regression', 'tidyverse', 'Feature engineering'],
  onResume: true,
  links: [
    { label: '2024 model write-up', href: pageHref('afl-brownlow-2024') },
    { label: '2023 model write-up', href: pageHref('afl-brownlow-2023') },
  ],
};

/** Project cards under the featured card, in display order. */
export const projects: Project[] = [
  pageProject('h2h-arbitrage-finder', {
    kicker: 'APIs · Data pipelines',
    oneLiner: 'Scans live odds from 12 Australian bookmakers for guaranteed-profit markets — and shows why real edges are rare and under 1%.',
    summary:
      'Pulls live head-to-head odds from 12 Australian bookmakers via The Odds API, adjusts for exchange commission and back/lay pricing, and flags any market where the best implied probabilities sum to under 100%.',
    stack: ['R', 'REST API', 'tidyverse'],
    onResume: true,
    linkLabel: 'Read the write-up',
  }),
  pageProject('eildon-park-cricket-club', {
    kicker: 'Data engineering · Web',
    oneLiner: 'A club’s full playing history turned into a dataset that keeps every record and career stat up to date automatically.',
    summary:
      'Compiled Eildon Park Cricket Club’s senior playing history into a structured dataset that automatically derives club records, career profiles and season splits — no manual updates each season. Shipped as part of a full club website built with Claude Code.',
    stack: ['Data modelling', 'Claude Code', 'Web'],
    linkLabel: 'See the project',
  }),
  pageProject('melbourne-pedestrian-counting', {
    kicker: 'Time series · BI',
    oneLiner: 'Python pipeline over ~100 city sensors (hourly since 2010) into a Power BI dashboard with rolling trends.',
    summary:
      'Python pipeline over the City of Melbourne’s hourly sensor feed (~100 sensors, data since 2010) feeding an interactive Power BI dashboard with 4- and 52-week rolling averages and mapped sensor locations.',
    stack: ['Python', 'Jupyter', 'Power BI'],
    linkLabel: 'Open the dashboard',
  }),
  pageProject('victorian-property-prices-dashboard', {
    kicker: 'Geospatial · BI',
    oneLiner: 'Power BI view of Victorian sales: cleaned in Power Query, DAX medians and year-on-year change, suburb maps.',
    summary:
      'Interactive Power BI view of Victorian property sales: Power Query cleaning, DAX measures for median prices and year-on-year change, and suburb-level mapping.',
    stack: ['Power BI', 'DAX', 'Power Query'],
    linkLabel: 'Open the dashboard',
  }),
  {
    slug: 'cricket-stats-hub',
    title: 'CricketStatsHub',
    kicker: 'Open data',
    oneLiner: 'Open, standardised batting and bowling datasets from international and domestic cricket.',
    summary:
      'Open repository of batting and bowling statistics from international and domestic competitions, standardised into consistent formats for analysis.',
    stack: ['Data cleaning', 'GitHub'],
    links: [{ label: 'View on GitHub', href: 'https://github.com/CooperDenny/CricketStatsHub' }],
  },
];

/** Skill groups, in display order. `onResume: false` keeps a group off the printed résumé. */
export const skills: SkillGroup[] = [
  { label: 'Languages', items: ['SQL', 'Python', 'R', 'Cypher (Neo4j)'] },
  {
    label: 'Modelling & analysis',
    items: [
      'Regression (linear, logistic, ordinal)',
      'Churn & retention analysis',
      'Metric design',
      'Feature engineering',
      'Model evaluation',
    ],
  },
  {
    label: 'Data engineering',
    items: ['dbt / dbt Cloud', 'Snowflake', 'Fivetran', 'Make.com', 'Git'],
  },
  {
    label: 'BI & product analytics',
    items: ['Tableau', 'Power BI', 'Omni', 'Lightdash', 'Explo', 'R Shiny', 'PostHog', 'Google Analytics'],
  },
  {
    label: 'Tooling',
    items: ['Jupyter', 'VS Code', 'Claude Code', 'Jira', 'Confluence', 'Excel'],
    onResume: false, // low-signal on paper; stays on the web page
  },
];

/** Highest qualification. */
export const education: Education = {
  degree: 'Bachelor of Applied Data Science',
  institution: 'Monash University',
  logo: '/images/logo-monash.svg',
  start: 'Feb 2021',
  end: 'Jun 2024',
  result: 'WAM 77.6 — Distinction average',
  detail:
    'Statistical and machine learning modelling, mathematical modelling, data visualisation, and communicating analysis to non-technical audiences, in R and Python.',
};
