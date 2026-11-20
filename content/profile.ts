// Everything the site says about Cooper — data only (types: content/types.ts,
// derived views: content/selectors.ts). The home page and the printable CV both
// render from this file, so they can never drift apart. Edit content here, not in JSX.
//
// Rule for this file: every claim must be traceable to something real — a role,
// a write-up under public/projects/, or a published result. No invented metrics.

import { pageHref, pageTitle, type PageSlug } from '@/content/catalog';
import identity from '@/content/identity.json';
import { anchor } from '@/content/sections';
import type {
  ChartView,
  Education,
  FeaturedProject,
  HeroShot,
  Job,
  Profile,
  Project,
  ProjectList,
  SkillGroup,
} from '@/content/types';

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
  /** Large PNG kept for Open Graph / JSON-LD. */
  photo: '/images/hero-image.png',
  avatarWebp: '/images/hero-avatar.webp',
  headline:
    'I build machine-learning models, data pipelines and analytics products for community sport.',
  pitch:
    'Data Scientist at PlayHQ, the platform behind community sport in Australia, New Zealand, the UK and Canada. I own the reporting product clubs and associations use, and built a churn model that flags players unlikely to return next season, and what’s driving each score, so clubs can act early.',
  resumeSummary:
    'Data Scientist with 2+ years at PlayHQ across machine learning, analytics engineering and analytics products in community sport. Owns a reporting product used by 50,000+ people and built the churn model end to end in Snowflake. Monash Applied Data Science graduate (Distinction average).',
  // Above-the-fold evidence. Each tile jumps to the section that backs it up. The first is
  // highlighted in navy, so it leads with the strongest figure.
  proof: [
    { value: '50,000+', label: 'People using the embedded analytics product I own', href: anchor('experience') },
    { value: '2+ yrs', label: 'Junior → Data Scientist at PlayHQ', href: anchor('experience') },
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
    spotify: { href: 'https://open.spotify.com/user/cooper.denny', handle: 'cooper.denny' },
    phone: '0478 944 105',
  },
};

/**
 * Cooper's own match photos behind the hero name, in the order they crossfade. The tracking
 * overlay boxes and tags Cooper only: never add a box or tag for another player.
 */
export const heroShots: HeroShot[] = [
  {
    src: '/images/hero-bowling.webp',
    srcSmall: '/images/hero-bowling-1000.webp',
    width: 2000,
    height: 1333,
    alt: `${identity.name} bowling in a club cricket match`,
    subject: { x: 868, y: 405, w: 347, h: 637, tag: 'BOWLER · DENNY' },
    ball: { x: 916, y: 428 },
  },
  {
    src: '/images/hero-batting.webp',
    srcSmall: '/images/hero-batting-1000.webp',
    width: 2000,
    height: 1333,
    alt: `${identity.name} batting in a club cricket match`,
    push: true,
    subject: { x: 628, y: 548, w: 494, h: 474, tag: 'BATTER · DENNY' },
    ball: { x: 682, y: 860 },
  },
];

/**
 * The hero console's charts, in the order the → button cycles them. Simulated, illustrative data:
 * the disposal heatmap follows FootyStatsApp's field model and disposal summary.
 */
export const heroCharts: ChartView[] = [
  {
    scene: 'pitch',
    label: 'Pitch map',
    file: 'pitch_map.sql',
    query: "SELECT line, length, COUNT(*) AS balls\nFROM   deliveries\nWHERE  format = 'Test'\nGROUP BY line, length;",
    hint: 'click the pitch to bowl',
  },
  {
    scene: 'wagon',
    label: 'Wagon wheel',
    file: 'wagon_wheel.sql',
    query: "SELECT shot_angle, distance, runs\nFROM   deliveries\nWHERE  format = 'Test'\nORDER BY innings, ball;",
    hint: 'click the field to play a shot',
  },
  {
    scene: 'disposals',
    label: 'AFL disposal heatmap',
    file: 'disposals.sql',
    query: 'SELECT disposal_start_x, disposal_start_y,\n       kick, effective_disposal\nFROM   player_data\nWHERE  quarter = 1;',
    hint: 'click the oval to dispose',
  },
];

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
      // The one figure on the home card: r and MAE read as confusing without context (D24).
      onCard: true,
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
  pageProject('eildon-park-cricket-club', {
    kicker: 'Data engineering · Full-stack',
    oneLiner: 'Designed, built and still run my cricket club’s platform: every senior season since 1989/90 joined to live Play Cricket data, plus an admin portal, email, video and an MCP server.',
    summary:
      'Built and run epcc.org.au solo with Claude Code (531 commits and 131 PRs in its first eight months): 36 seasons of club records joined to 1,100+ Play Cricket scorecards and live data for 800+ player pages, plus an invite-only admin portal, SES email platform, in-browser MP4 highlights editor and a public MCP server.',
    stack: ['Data modelling', 'Play Cricket API', 'Next.js', 'Supabase', 'Claude Code'],
    linkLabel: 'Read the case study',
    onResume: true,
    resumeBullets: [
      'Designed, built and run epcc.org.au solo with Claude Code since March 2026: 531 commits and 131 merged pull requests in its first eight months, governed by architecture decision records and a rulebook for AI-assisted development.',
      'Cleaned 36 seasons of club records (1989/90 to 2025/26) into one player-season dataset and joined it to 1,100+ Play Cricket scorecards and live data, powering self-updating records and a page for each of 800+ players.',
      'Next.js, TypeScript and Supabase (Postgres with row-level security): an invite-only admin portal, a resumable-batch email platform on Amazon SES, and an in-browser MP4 highlights editor built on WebCodecs.',
      'Made the club answerable by AI assistants with schema.org structured data, a live /llms.txt and a public, read-only MCP server.',
    ],
  }),
  pageProject('h2h-arbitrage-finder', {
    kicker: 'APIs · Data pipelines',
    oneLiner: 'Scans live odds from 12 Australian bookmakers for guaranteed-profit markets — and shows why real edges are rare and under 1%.',
    summary:
      'Pulls live head-to-head odds from 12 Australian bookmakers via The Odds API, adjusts for exchange commission and back/lay pricing, and flags any market where the best implied probabilities sum to under 100%.',
    stack: ['R', 'REST API', 'tidyverse'],
    linkLabel: 'Read the write-up',
    onResume: true,
  }),
  {
    slug: 'cricket-stats-hub',
    title: 'CricketStatsHub',
    kicker: 'Open data · R',
    oneLiner: 'An R library that fetches clean ball-by-ball, batting, bowling and match data for 40+ cricket competitions, plus a BBL dashboard.',
    summary:
      'R library over Cricsheet (via cricketdata) that returns tidy ball-by-ball, per-innings batting and bowling, and match data for 40+ men’s and women’s international and domestic competitions, with a Big Bash League dashboard built on it.',
    stack: ['R', 'cricketdata', 'Data cleaning'],
    onResume: true,
    links: [{ label: 'View on GitHub', href: 'https://github.com/CooperDenny/CricketStatsHub' }],
  },
];

/**
 * Older, lower-signal projects: kept linked from the home page as a compact list under the
 * card grid rather than as full cards (decision D20). Their pages stay in the catalog and sitemap.
 */
export const earlierProjects: ProjectList = {
  title: 'Earlier work',
  projects: [
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
  ],
};

/** Skill groups, in display order. `onResume: false` keeps a group off the printed CV. */
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
