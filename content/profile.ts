// Single source of truth for everything the site says about Cooper.
// Both the home page (app/page.tsx) and the printable résumé (app/resume/page.tsx)
// render from this file, so they can never drift apart. Edit content here, not in JSX.
//
// Rule for this file: every claim must be traceable to something real — a role,
// a write-up under public/projects/, or a published result. No invented metrics.

export type Role = {
  title: string;
  start: string;
  end: string;
};

export type Job = {
  company: string;
  logo: string;
  logoAlt: string;
  employmentType: string;
  /** Most recent first. More than one entry renders as a promotion ladder. */
  roles: Role[];
  summary: string;
  highlights: string[];
  stack: string[];
};

export type Metric = {
  value: string;
  label: string;
};

export type ProjectLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  stack: string[];
  links: ProjectLink[];
};

export type FeaturedProject = Project & {
  problem: string;
  approach: string[];
  metrics: Metric[];
  iteration: string;
  evaluationNote: string;
};

export type SkillGroup = {
  label: string;
  items: string[];
};

export const profile = {
  name: 'Cooper Denny',
  role: 'Data Scientist',
  employer: 'PlayHQ',
  location: 'Melbourne, Australia',
  photo: '/images/hero-image.png',
  headline:
    'I turn messy sports and product data into models, metrics and dashboards that people actually use.',
  pitch:
    'Data Scientist at PlayHQ, the platform powering community sport across Australia, New Zealand, the UK and Canada. I work end to end — dbt models in Snowflake, churn and retention regressions, success metrics, and the dashboards that put them in front of Product, Engineering, Finance and Community teams.',
  resumeSummary:
    'Data Scientist with industry experience across product analytics, statistical modelling and analytics engineering in sport. Builds end-to-end: dbt models in Snowflake, regression-based churn and retention analysis, metric design, and BI in Tableau, Omni and Lightdash. Applied Data Science graduate (Monash, Distinction average) with a published, out-of-sample-validated AFL Brownlow prediction model.',
  quickFacts: [
    { label: 'Current', value: 'Data Scientist, PlayHQ' },
    { label: 'Core stack', value: 'SQL · Python · R · dbt · Snowflake' },
    { label: 'Education', value: 'B. Applied Data Science, Monash' },
    { label: 'Based in', value: 'Melbourne, Australia' },
  ],
  contact: {
    email: 'cooper.denny@icloud.com',
    linkedin: { href: 'https://www.linkedin.com/in/cooper-denny/', handle: 'in/cooper-denny' },
    github: { href: 'https://github.com/CooperDenny', handle: 'CooperDenny' },
    x: { href: 'https://x.com/coopercdenny', handle: '@CooperCDenny' },
  },
};

export const experience: Job[] = [
  {
    company: 'PlayHQ',
    logo: '/images/logo-playhq.png',
    logoAlt: 'PlayHQ logo',
    employmentType: 'Full-time',
    roles: [
      { title: 'Data Scientist', start: 'Jul 2026', end: 'Present' },
      { title: 'Junior Data Scientist', start: 'Nov 2024', end: 'Jul 2026' },
    ],
    summary:
      'Sports-tech platform powering community sport in Australia, New Zealand, the UK and Canada — tens of thousands of games every week. Promoted to Data Scientist after 20 months.',
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
    logo: '/images/logo-boccia.png',
    logoAlt: 'Boccia Australia logo',
    employmentType: 'Contract',
    roles: [{ title: 'Data Support & App Developer', start: 'Jul 2024', end: 'Sep 2024' }],
    summary:
      'Performance-analysis support for the national Paralympic program through the Paris 2024 campaign — Australia’s best-ever Paralympic Boccia result (two silver medals).',
    highlights: [
      'Extended the team’s R Shiny match-analysis app to cover Pairs and Teams events.',
      'Migrated historical match data into Snowflake so it could be queried at scale.',
      'Worked alongside analysts from the AIS, VIS and Paralympics Australia.',
    ],
    stack: ['R', 'R Shiny', 'Snowflake'],
  },
  {
    company: 'Victorian Institute of Sport',
    logo: '/images/logo-vis.jpg',
    logoAlt: 'Victorian Institute of Sport logo',
    employmentType: 'Internship',
    roles: [{ title: 'Data Science Intern', start: 'Jul 2023', end: 'Oct 2023' }],
    summary: 'High-performance sport analytics in an elite athlete environment.',
    highlights: [
      'Built an R Shiny performance-analysis app with interactive, filterable dashboards that replaced commercial software (Hudl Sportscode).',
      'Cleaned and integrated historical match data to power it.',
      'Worked directly with stakeholders in a high-performance environment.',
    ],
    stack: ['R', 'R Shiny'],
  },
];

export const featuredProject: FeaturedProject = {
  slug: 'afl-brownlow',
  title: 'AFL Brownlow Medal Prediction Model',
  kicker: 'Statistical modelling · Out-of-sample validated',
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
    { value: 'r = 0.93', label: 'Predicted vs actual season vote tallies (2024)' },
    { value: '2.0', label: 'Mean absolute error, votes per player' },
    { value: '56%', label: 'Games where the model picked the 3-vote player, from 46 on the field' },
  ],
  iteration:
    'v1 (2023) over-predicted ruckmen such as Max Gawn and Tim English. v2 (2024) added player position: correlation rose from 0.885 to 0.928 and MAE fell from 2.17 to 2.01.',
  evaluationNote:
    'Raw game-level accuracy (93%) is deliberately not the headline: with ~93.5% of player-games polling zero, an all-zeros baseline scores about the same. Per-class recall and season-level error are the honest measures.',
  stack: ['R', 'ordinal', 'tidyverse', 'Feature engineering'],
  links: [
    { label: '2024 model write-up', href: '/projects/afl-brownlow-2024/' },
    { label: '2023 model write-up', href: '/projects/afl-brownlow-2023/' },
  ],
};

export const projects: Project[] = [
  {
    slug: 'h2h-arbitrage-finder',
    title: 'Australian Betting Arbitrage Finder',
    kicker: 'APIs · Data pipelines',
    summary:
      'Pulls live head-to-head odds from 12 Australian bookmakers via The Odds API, adjusts for exchange commission and back/lay pricing, and flags any market where the best implied probabilities sum to under 100%.',
    stack: ['R', 'REST API', 'tidyverse'],
    links: [{ label: 'Read the write-up', href: '/projects/h2h-arbitrage-finder/' }],
  },
  {
    slug: 'eildon-park-cricket-club',
    title: 'Cricket Club Records & Stats Platform',
    kicker: 'Data engineering · Web',
    summary:
      'Compiled Eildon Park Cricket Club’s senior playing history into a structured dataset that automatically derives club records, career profiles and season splits — no manual updates each season. Shipped as part of a full club website built with Claude Code.',
    stack: ['Data modelling', 'Claude Code', 'Web'],
    links: [{ label: 'See the project', href: '/projects/eildon-park-cricket-club/' }],
  },
  {
    slug: 'melbourne-pedestrian-counting',
    title: 'Melbourne Pedestrian Traffic Dashboard',
    kicker: 'Time series · BI',
    summary:
      'Python pipeline over the City of Melbourne’s hourly sensor feed (~100 sensors, data since 2010) feeding an interactive Power BI dashboard with 4- and 52-week rolling averages and mapped sensor locations.',
    stack: ['Python', 'Jupyter', 'Power BI'],
    links: [{ label: 'Open the dashboard', href: '/projects/melbourne-pedestrian-counting/' }],
  },
  {
    slug: 'victorian-property-prices-dashboard',
    title: 'Victorian Property Prices Dashboard',
    kicker: 'Geospatial · BI',
    summary:
      'Interactive Power BI view of Victorian property sales: Power Query cleaning, DAX measures for median prices and year-on-year change, and suburb-level mapping.',
    stack: ['Power BI', 'DAX', 'Power Query'],
    links: [{ label: 'Open the dashboard', href: '/projects/victorian-property-prices-dashboard/' }],
  },
  {
    slug: 'cricket-stats-hub',
    title: 'CricketStatsHub',
    kicker: 'Open data',
    summary:
      'Open repository of batting and bowling statistics from international and domestic competitions, standardised into consistent formats for analysis.',
    stack: ['Data cleaning', 'GitHub'],
    links: [
      { label: 'View on GitHub', href: 'https://github.com/CooperDenny/CricketStatsHub', external: true },
    ],
  },
];

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
  { label: 'Tooling', items: ['Jupyter', 'VS Code', 'Claude Code', 'Jira', 'Confluence', 'Excel'] },
];

export const education = {
  degree: 'Bachelor of Applied Data Science',
  institution: 'Monash University',
  logo: '/images/logo-monash.svg',
  start: 'Feb 2021',
  end: 'Jun 2024',
  result: 'WAM 77.6 — Distinction average',
  detail:
    'Statistical and machine learning modelling, mathematical modelling, data visualisation, and communicating analysis to non-technical audiences, in R and Python.',
};
