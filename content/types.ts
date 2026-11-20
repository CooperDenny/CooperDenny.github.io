// Domain model for everything the site says. Types only — no data, no rendering.
// Components depend on these types (not on the content modules), and app/ pages
// inject the data: see app/(site)/page.tsx, app/(site)/cv/page.tsx and app/links/page.tsx.

import type { IconName } from '@/content/icons';

/** A title held for a date range at one employer. */
export type Role = {
  title: string;
  start: string;
  end: string;
};

/** One employer, with every role held there (a promotion is several roles). */
export type Job = {
  company: string;
  logo: string;
  logoAlt: string;
  employmentType: string;
  /** Most recent first. More than one entry renders as a promotion. */
  roles: Role[];
  summary: string;
  highlights: string[];
  stack: string[];
};

/** A headline result, e.g. `r = 0.93`, shown as a tile and in CV prose. */
export type Metric = {
  value: string;
  /** Full description (tooltip, screen readers). */
  label: string;
  /** Two-to-four-word caption for the compact metric tiles. */
  short: string;
  /** Clause used in running prose, e.g. on the CV. */
  sentence: string;
  /** Shown on the home-page featured card. The CV always lists every metric. */
  onCard?: boolean;
};

/** A hero proof tile: a short value, what it means, and a link to the evidence. */
export type Proof = {
  value: string;
  label: string;
  href: string;
};

/** A link; whether it opens in a new tab is derived from the URL (see lib/links.ts). */
export type Link = {
  label: string;
  href: string;
};

/** A project card on the home page (and optionally the CV). */
export type Project = {
  slug: string;
  title: string;
  kicker: string;
  /** One sentence for the home-page card. Full detail lives on the project page. */
  oneLiner: string;
  /** Longer description, used on the CV. */
  summary: string;
  stack: string[];
  links: Link[];
  /** Include on the printed CV. */
  onResume?: boolean;
  /** CV bullets for a bigger project; without them the CV shows `summary` as one bullet. */
  resumeBullets?: string[];
};

/** A titled, compact list of secondary projects (rendered as links, not cards). */
export type ProjectList = {
  title: string;
  projects: Project[];
};

/** The large featured card: a project plus its question, method, results and caveats. */
export type FeaturedProject = Project & {
  problem: string;
  approach: string[];
  metrics: Metric[];
  iteration: string;
  evaluationNote: string;
};

/** A labelled group of skills, shown as chips. */
export type SkillGroup = {
  label: string;
  items: string[];
  /** Set false to keep a low-signal group off the printed CV. */
  onResume?: boolean;
};

/** A degree. */
export type Education = {
  degree: string;
  institution: string;
  logo: string;
  start: string;
  end: string;
  result: string;
  detail: string;
};

/** Contact details. Normalise them for display with `contactChannels()` (content/selectors.ts). */
export type ContactLinks = {
  email: string;
  linkedin: { href: string; handle: string };
  github: { href: string; handle: string };
  x: { href: string; handle: string };
  /** Personal socials: shown only on the unlisted /links/ page, never on the portfolio or CV. */
  instagram: { href: string; handle: string };
  facebook: { href: string; handle: string };
  spotify: { href: string; handle: string };
  /** Australian mobile as displayed, e.g. '0400 000 000'. Shown only on /links/, as a WhatsApp link. */
  phone: string;
};

/** Who the site is about and how they're introduced (hero, CV header, SEO). */
export type Profile = {
  name: string;
  role: string;
  employer: string;
  location: string;
  /** Large PNG kept for Open Graph / JSON-LD. */
  photo: string;
  /** Small round portrait, used on /links/. */
  avatarWebp: string;
  headline: string;
  pitch: string;
  resumeSummary: string;
  proof: Proof[];
  coreStack: string[];
  contact: ContactLinks;
};

/** A contact method, normalised so every surface (hero, contact, CV, /links/) renders it the same way. */
export type ContactChannel = {
  key: keyof ContactLinks | 'website';
  label: string;
  href: string;
  display: string;
  icon: IconName;
};

/** The charts lib/charts can draw. */
export type ChartScene = 'pitch' | 'wagon' | 'disposals';

/**
 * One chart in the hero's console: the SQL it appears to run and how it's labelled.
 * The data is simulated in the browser (illustrative only, never a real player or result).
 */
export type ChartView = {
  scene: ChartScene;
  /** Plain name, e.g. 'Wagon wheel' (the → button and the canvas's accessible name). */
  label: string;
  /** Shown as the console's file name, e.g. 'wagon_wheel.sql'. */
  file: string;
  /** Typed into the console; keywords, strings and numbers are highlighted by `sqlTokens()`. */
  query: string;
  /** Status-bar prompt, e.g. 'click the field to play a shot'. */
  hint: string;
};

/**
 * One of Cooper's match photos behind the hero name, with its tracking overlay.
 * Coordinates are in the photo's own pixels. Only ever box or tag Cooper, never another player.
 */
export type HeroShot = {
  /** Full-size WebP (2000 px wide). */
  src: string;
  /** 1000 px wide copy for phones. */
  srcSmall: string;
  width: number;
  height: number;
  alt: string;
  /** Subject sits left of centre: frame the photo so he clears the name. */
  push?: boolean;
  /** Cooper's tracking box and its tag, e.g. 'BOWLER · DENNY'. */
  subject: { x: number; y: number; w: number; h: number; tag: string };
  /** Where the ball is, for the reticle. */
  ball: { x: number; y: number };
};

/** A home-page section: one definition drives its anchor id, nav link and heading. */
export type SectionDef = {
  id: string;
  label: string;
  title: string;
  intro?: string;
};

/** A prepared CV entry (built by content/selectors.ts). */
export type ResumeEntry = {
  title: string;
  tagline: string;
  bullets: string[];
};
