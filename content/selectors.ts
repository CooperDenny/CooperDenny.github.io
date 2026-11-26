// Derived views over the content. Components render these; they never re-derive them.

import { dateRange, listSentence } from '@/lib/format';
import { waHref } from '@/lib/links';
import type {
  ContactChannel,
  ContactLinks,
  FeaturedProject,
  Job,
  Metric,
  Profile,
  Project,
  ResumeEntry,
  SkillGroup,
} from '@/content/types';

/** Every contact method, normalised for rendering. Use contactChannels() or linkInBioChannels() to pick. */
function allChannels(c: ContactLinks): ContactChannel[] {
  return [
    { key: 'email', label: 'Email', href: `mailto:${c.email}`, display: c.email, icon: 'envelope' },
    { key: 'linkedin', label: 'LinkedIn', href: c.linkedin.href, display: c.linkedin.handle, icon: 'linkedin' },
    { key: 'github', label: 'GitHub', href: c.github.href, display: c.github.handle, icon: 'github' },
    { key: 'x', label: 'X', href: c.x.href, display: c.x.handle, icon: 'x' },
  ];
}

/**
 * The professional contact methods (hero, contact section, CV, JSON-LD), in display order.
 * X and the personal socials are left out: they appear only on /links/ (D32, see linkInBioChannels()).
 */
export const contactChannels = (c: ContactLinks): ContactChannel[] =>
  allChannels(c).filter((ch) => ch.key !== 'x');

/**
 * Every link on the unlisted /links/ page (the Instagram bio link), in display order:
 * the portfolio home page first, then socials, then WhatsApp and email.
 */
export function linkInBioChannels(c: ContactLinks, siteHref: string): ContactChannel[] {
  return [
    { key: 'website', label: 'Website', href: siteHref, display: 'Portfolio and CV', icon: 'globe' },
    { key: 'instagram', label: 'Instagram', href: c.instagram.href, display: c.instagram.handle, icon: 'instagram' },
    { key: 'facebook', label: 'Facebook', href: c.facebook.href, display: c.facebook.handle, icon: 'facebook' },
    { key: 'spotify', label: 'Spotify', href: c.spotify.href, display: c.spotify.handle, icon: 'spotify' },
    contactChannel(c, 'linkedin'),
    { ...contactChannel(c, 'x'), label: 'X (Twitter)' },
    contactChannel(c, 'github'),
    { key: 'phone', label: 'WhatsApp', href: waHref(c.phone), display: 'Message or call', icon: 'whatsapp' },
    contactChannel(c, 'email'),
  ];
}

/** A single contact channel by key, normalised for rendering. */
export function contactChannel(c: ContactLinks, key: ContactChannel['key']): ContactChannel {
  return allChannels(c).find((ch) => ch.key === key)!;
}

/** The job's current (most recent) role. */
export const currentRole = (job: Job) => job.roles[0];
/** Earlier roles at the same job — each renders as a promotion. */
export const previousRoles = (job: Job) => job.roles.slice(1);
/** Whole time at the company: first role's start to current role's end. */
export const tenure = (job: Job) => dateRange(job.roles[job.roles.length - 1].start, currentRole(job).end);

/** Bullets per job on the home page; the CV lists every one. */
export const HOME_HIGHLIGHTS = 3;
/** A job's leading highlights for the home page (put the strongest first in profile.ts). */
export const homeHighlights = (job: Job) => job.highlights.slice(0, HOME_HIGHLIGHTS);

/** Rows of the home-page results table: the leading metric first, then the rest in their order. */
export const resultRows = (p: FeaturedProject): Metric[] => [
  ...p.metrics.filter((m) => m.onCard),
  ...p.metrics.filter((m) => !m.onCard),
];

/** "Data Scientist at PlayHQ": the hero's plain role line. */
export const roleAt = (p: Pick<Profile, 'role' | 'employer'>) => `${p.role} at ${p.employer}`;

/** CV project entries: the featured project (with its results) then any flagged side projects. */
export function resumeProjects(featured: FeaturedProject, projects: Project[]): ResumeEntry[] {
  const tagline = (p: Project) => p.stack.slice(0, 3).join(' · ');
  const featuredEntry: ResumeEntry = {
    title: featured.title,
    tagline: tagline(featured),
    bullets: [
      featured.summary,
      `Held-out 2024 season: ${listSentence(featured.metrics.map((m) => m.sentence))}.`,
      featured.iteration,
    ],
  };
  const others = projects
    .filter((p) => p.onResume)
    .map((p) => ({ title: p.title, tagline: tagline(p), bullets: p.resumeBullets ?? [p.summary] }));
  return [featuredEntry, ...others];
}

/** Skill groups for the printed CV (drops groups with `onResume: false`). */
export const resumeSkills = (groups: SkillGroup[]) => groups.filter((g) => g.onResume !== false);

/** The hero name split into first name and the rest (the rest carries the delivery underline). */
export function nameLines(name: string): [string, string] {
  const [first, ...rest] = name.split(' ');
  return [first, rest.join(' ')];
}

