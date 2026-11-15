// Derived views over the content. Components render these; they never re-derive them.

import { dateRange, listSentence } from '@/lib/format';
import type { ContactChannel, ContactLinks, FeaturedProject, Job, Project, ResumeEntry, SkillGroup } from '@/content/types';

/** All contact methods, normalised for rendering. Order here is display order. */
export function contactChannels(c: ContactLinks): ContactChannel[] {
  return [
    { key: 'email', label: 'Email', href: `mailto:${c.email}`, display: c.email, icon: 'envelope' },
    { key: 'linkedin', label: 'LinkedIn', href: c.linkedin.href, display: c.linkedin.handle, icon: 'linkedin' },
    { key: 'github', label: 'GitHub', href: c.github.href, display: c.github.handle, icon: 'github' },
    { key: 'x', label: 'X', href: c.x.href, display: c.x.handle, icon: 'x' },
  ];
}

/** A single contact channel by key, normalised for rendering. */
export function contactChannel(c: ContactLinks, key: ContactChannel['key']): ContactChannel {
  return contactChannels(c).find((ch) => ch.key === key)!;
}

/** The job's current (most recent) role. */
export const currentRole = (job: Job) => job.roles[0];
/** Earlier roles at the same job — each renders as a promotion. */
export const previousRoles = (job: Job) => job.roles.slice(1);
/** Whole time at the company: first role's start to current role's end. */
export const tenure = (job: Job) => dateRange(job.roles[job.roles.length - 1].start, currentRole(job).end);

/** Résumé project entries: the featured project (with its results) then any flagged side projects. */
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
    .map((p) => ({ title: p.title, tagline: tagline(p), bullets: [p.summary] }));
  return [featuredEntry, ...others];
}

/** Skill groups for the printed résumé (drops groups with `onResume: false`). */
export const resumeSkills = (groups: SkillGroup[]) => groups.filter((g) => g.onResume !== false);
