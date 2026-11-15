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
    'I build machine-learning models, data pipelines and analytics products for community sport.',
  pitch:
    'Data Scientist at PlayHQ, the platform behind community sport in Australia, New Zealand, the UK and Canada. I own the reporting product clubs and associations use, and built a churn model that flags players unlikely to return next season, and what’s driving each score, so clubs can act early.',
  resumeSummary:
    'Data Scientist with 2+ years at PlayHQ across machine learning, analytics engineering and analytics products in community sport. Owns a reporting product used by 50,000+ people and built the churn model end to end in Snowflake. Monash Applied Data Science graduate (Distinction average).',
  // Above-the-fold evidence. Each tile jumps to the section that backs it up.
  proof: [
    { value: '2+ yrs', label: 'Junior → Data Scientist at PlayHQ', href: anchor('experience') },
    { value: '50,000+', label: 'People using the embedded analytics product I own', href: anchor('experience') },
    { value: '3', label: 'Sport orgs: PlayHQ, Boccia Australia, VIS', href: anchor('experience') },
    { value: 'Distinction', label: 'Applied Data Science, Monash', href: anchor('education') },
  ],
  coreStack: ['SQL', 'Python', 'dbt', 'Snowflake', 'XGBoost', 'Omni'],
  contact: {
    email: 'cooper.denny@icloud.com',
    linkedin: { href: 'https://www.linkedin.com/in/cooper-denny/', handle: 'in/cooper-denny' },
    github: { href: 'https://github.com/CooperDenny', handle: 'CooperDenny' },
    x: { href: 'https://x.com/coopercdenny', handle: '@CooperCDenny' },
    instagram: { href: 'https://www.instagram.com/cooper.denny/', handle: '@cooper.denny' },
    facebook: { href: 'https://www.facebook.com/share/1MuhUnZd65/', handle: identity.name },
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
      'Own AnalyticsHQ, PlayHQ’s Omni-based reporting product, used by 50,000+ people at 15,000+ local sporting organisations, with an AI assistant that answers questions in plain English.',
      'Built the dashboards on the Admin Portal home page, among them Registrations, Finances, Retention, Season Readiness, Child Safety, Concussion and Memberships, with French versions for Canada.',
      'Rebuilt the Report Builder: 63 topics across 11 domains, every pre-built report carried over, and game-level statistics and custom registration questions reportable for the first time.',
      'Built the Finances dashboard treasurers use to reconcile payouts to bank deposits and track refunds, instalments and shop sales, plus Finance’s revenue and invoicing dashboards.',
      'Rebuilt churn prediction inside Snowflake: a 286-feature dbt dataset over 2M+ participant-seasons, XGBoost trained and scored in Snowpark (0.81 ROC AUC on unseen seasons), and TreeSHAP reasons for each score.',
      'Helped set up self-serve analytics, and build data shares for national bodies such as AFL and Cricket Australia.',
    ],
    stack: ['SQL', 'Python', 'dbt', 'Snowflake', 'Snowpark', 'XGBoost', 'Omni', 'Lightdash', 'Tableau'],
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
      'Built an R Shiny performance-analysis app with filterable dashboards that replaced Hudl Sportscode, a paid tool.',
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
    'v1 (2023) over-rated ruckmen such as Max Gawn; v2 (2024) added player position, lifting r from 0.885 to 0.928 and cutting MAE from 2.17 to 2.01. In 2025 it found the 3-vote player in 59% of games, its best yet.',
  evaluationNote:
    'Raw game-level accuracy (93%) is deliberately not the headline: with ~93.5% of player-games polling zero, an all-zeros baseline scores about the same. Per-class recall and season-level error are the honest measures.',
  stack: ['R', 'Ordinal regression', 'tidyverse', 'Feature engineering'],
  onResume: true,
  links: [
    { label: '2024 model write-up', href: pageHref('afl-brownlow-2024') },
    { label: '2025 model write-up', href: pageHref('afl-brownlow-2025') },
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
    linkLabel: 'Read the write-up',
  }),
  pageProject('eildon-park-cricket-club', {
    kicker: 'Data engineering · Web',
    oneLiner: 'The club’s website, built on every senior season since 1989/90 plus live Play Cricket data: records and 800+ player pages that update themselves.',
    summary:
      'Built epcc.org.au for Eildon Park Cricket Club with Claude Code: 37 seasons of player statistics cleaned into one dataset and joined to 1,100+ Play Cricket scorecards and live hourly data, powering self-updating records, a page for every player and a match centre for every game.',
    stack: ['Data modelling', 'Play Cricket API', 'Next.js', 'Supabase', 'Claude Code'],
    linkLabel: 'See the project',
  }),
  pageProject('melbourne-pedestrian-counting', {
    kicker: 'Time series · BI',
    oneLiner: 'Python pipeline over ~100 city sensors (hourly, 2010 to 2024) into a Power BI dashboard with rolling trends.',
    summary:
      'Python pipeline over the City of Melbourne’s hourly sensor files (~100 sensors, January 2010 to October 2024) feeding an interactive Power BI dashboard with 4- and 52-week rolling averages and mapped sensor locations.',
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
    kicker: 'Open data · R',
    oneLiner: 'An R library that fetches clean ball-by-ball, batting, bowling and match data for 40+ cricket competitions, plus a BBL dashboard.',
    summary:
      'R library over Cricsheet (via cricketdata) that returns tidy ball-by-ball, per-innings batting and bowling, and match data for 40+ men’s and women’s international and domestic competitions, with a Big Bash League dashboard built on it.',
    stack: ['R', 'cricketdata', 'Data cleaning'],
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
      'XGBoost',
      'SHAP',
      'Optuna',
      'Churn & retention modelling',
      'Metric design',
      'Feature engineering',
      'Model evaluation',
    ],
  },
  {
    label: 'Data engineering',
    items: ['dbt / dbt Cloud', 'Snowflake', 'Snowpark', 'Windmill', 'Fivetran', 'Make.com', 'Git'],
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
