// Domain model for everything the site says. Types only — no data, no rendering.
// Components depend on these types (not on the content modules), and app/ pages
// inject the data: see app/page.tsx and app/resume/page.tsx.

import type { IconName } from '@/content/icons';

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
  /** Most recent first. More than one entry renders as a promotion. */
  roles: Role[];
  summary: string;
  highlights: string[];
  stack: string[];
};

export type Metric = {
  value: string;
  /** Full description (tooltip, screen readers). */
  label: string;
  /** Two-to-four-word caption for the compact metric tiles. */
  short: string;
  /** Clause used in running prose, e.g. on the résumé. */
  sentence: string;
};

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

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  /** One sentence for the home-page card. Full detail lives on the project page. */
  oneLiner: string;
  /** Longer description, used on the résumé. */
  summary: string;
  stack: string[];
  links: Link[];
  /** Include on the one-page printed résumé. */
  onResume?: boolean;
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
  /** Set false to keep a low-signal group off the printed résumé. */
  onResume?: boolean;
};

export type Education = {
  degree: string;
  institution: string;
  logo: string;
  start: string;
  end: string;
  result: string;
  detail: string;
};

export type ContactLinks = {
  email: string;
  linkedin: { href: string; handle: string };
  github: { href: string; handle: string };
  x: { href: string; handle: string };
};

export type Profile = {
  name: string;
  role: string;
  employer: string;
  location: string;
  /** Large PNG kept for Open Graph / JSON-LD; the page itself uses the WebP variants. */
  photo: string;
  photoWebp: string;
  avatarWebp: string;
  headline: string;
  pitch: string;
  resumeSummary: string;
  proof: Proof[];
  coreStack: string[];
  contact: ContactLinks;
};

/** A contact method, normalised so every surface (hero, contact, résumé) renders it the same way. */
export type ContactChannel = {
  key: keyof ContactLinks;
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

/** A prepared résumé entry (built by content/selectors.ts). */
export type ResumeEntry = {
  title: string;
  tagline: string;
  bullets: string[];
};
