// Derived views over the content. Components render these; they never re-derive them.

import { dateRange, listSentence } from '@/lib/format';
import { waHref } from '@/lib/links';
import type {
  ContactChannel,
  ChartView,
  ContactLinks,
  FeaturedProject,
  HeroShot,
  Job,
  Metric,
  Project,
  ResumeEntry,
  SkillGroup,
} from '@/content/types';

/**
 * The professional contact methods (hero, contact section, CV, JSON-LD), normalised for
 * rendering. Order here is display order. Personal socials are deliberately left out: see linkInBioChannels().
 */
export function contactChannels(c: ContactLinks): ContactChannel[] {
  return [
    { key: 'email', label: 'Email', href: `mailto:${c.email}`, display: c.email, icon: 'envelope' },
    { key: 'linkedin', label: 'LinkedIn', href: c.linkedin.href, display: c.linkedin.handle, icon: 'linkedin' },
    { key: 'github', label: 'GitHub', href: c.github.href, display: c.github.handle, icon: 'github' },
    { key: 'x', label: 'X', href: c.x.href, display: c.x.handle, icon: 'x' },
  ];
}

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
  return contactChannels(c).find((ch) => ch.key === key)!;
}

/** The job's current (most recent) role. */
export const currentRole = (job: Job) => job.roles[0];
/** Earlier roles at the same job — each renders as a promotion. */
export const previousRoles = (job: Job) => job.roles.slice(1);
/** Whole time at the company: first role's start to current role's end. */
export const tenure = (job: Job) => dateRange(job.roles[job.roles.length - 1].start, currentRole(job).end);

/** Metrics shown on the home-page featured card (the CV lists them all). */
export const cardMetrics = (p: FeaturedProject) => p.metrics.filter((m) => m.onCard);

/** A percentage metric's value as a number (for its meter bar), or undefined if it isn't one. */
export function metricPercent(m: Metric): number | undefined {
  const match = /^(\d+(?:\.\d+)?)%$/.exec(m.value);
  return match ? Number(match[1]) : undefined;
}

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

/** Width of a tracking tag (13px mono caps, 0.1em tracking) holding `text`, in photo pixels. */
const tagWidth = (text: string) => Math.round(text.length * 9.2 + 18);

/** The drawn parts of a hero photo's tracking overlay: corner brackets round Cooper, his tag, and the ball reticle. */
export function trackOverlay(shot: HeroShot) {
  const { x, y, w, h, tag } = shot.subject;
  const c = Math.round(0.16 * Math.min(w, h));
  const r = x + w;
  const b = y + h;
  const ballTag = 'BALL';
  return {
    box: { x, y, w, h },
    brackets: `M${x} ${y + c}V${y}H${x + c}M${r - c} ${y}H${r}V${y + c}M${r} ${b - c}V${b}H${r - c}M${x + c} ${b}H${x}V${b - c}`,
    tag: { text: tag, width: tagWidth(tag) },
    ball: { ...shot.ball, tag: { text: ballTag, width: tagWidth(ballTag) } },
  };
}

/** A piece of highlighted SQL: `k` keyword, `s` string, `n` number, none for plain text. */
export type SqlToken = { text: string; kind?: 'k' | 's' | 'n' };

/** Splits a hero-console query into highlighted tokens. */
export function sqlTokens(sql: string): SqlToken[] {
  const re = /('[^']*')|\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|AS|COUNT)\b|\b(\d+)\b/g;
  const out: SqlToken[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(sql))) {
    if (m.index > last) out.push({ text: sql.slice(last, m.index) });
    out.push({ text: m[0], kind: m[1] ? 's' : m[2] ? 'k' : 'n' });
    last = m.index + m[0].length;
  }
  if (last < sql.length) out.push({ text: sql.slice(last) });
  return out;
}

/** The hero name set on two lines: first name, then the rest (which carries the delivery underline). */
export function nameLines(name: string): [string, string] {
  const [first, ...rest] = name.split(' ');
  return [first, rest.join(' ')];
}

/** Accessible name for the hero chart console. */
export const chartsLabel = (views: ChartView[]) =>
  `Live charts: ${listSentence(views.map((v) => v.label))} (illustrative data)`;
