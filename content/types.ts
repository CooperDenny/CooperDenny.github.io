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
  /** Strongest first: the home page shows the first few (selectors.homeHighlights), the CV all. */
  highlights: string[];
  stack: string[];
};

/** A headline result, e.g. `r = 0.93`, shown as a tile and in CV prose. */
export type Metric = {
  value: string;
  /** Full description (tooltip, screen readers). */
  label: string;
  /** Two-to-four-word caption, for tight spaces. */
  short: string;
  /** Clause used in running prose, e.g. on the CV. */
  sentence: string;
  /** Leads the home-page results table (the CV lists every metric in its own order). */
  onCard?: boolean;
};

/** A link; whether it opens in a new tab is derived from the URL (see lib/links.ts). */
export type Link = {
  label: string;
  href: string;
};

/** A project row on the home page (and optionally the CV). */
export type Project = {
  slug: string;
  title: string;
  /** One sentence for the home-page row. Full detail lives on the project page. */
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

/** The featured project: a project plus its results and how it improved. */
export type FeaturedProject = Project & {
  metrics: Metric[];
  /** Caption under the home-page results table: what the figures were scored on. */
  resultsCaption: string;
  iteration: string;
};

/** A labelled group of skills, shown as one plain comma-separated line. */
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
  /**
   * The hero's round profile picture: `src` is the 480 px square WebP (desktop, shown at 240 px),
   * `srcSmall` a 160 px copy for phones, so neither is more than 2× its display size (D04).
   */
  portrait: { src: string; srcSmall: string; width: number; height: number };
  headline: string;
  pitch: string;
  resumeSummary: string;
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
