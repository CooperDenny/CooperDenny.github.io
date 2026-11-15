import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import site from '@/config/site.json';
import { profile } from '@/content/profile';

// Site-wide settings. Constants shared with scripts/project_pages live in config/site.json.

/** NEXT_PUBLIC_SITE_URL if set and valid, else the production URL — so builds never throw. */
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) return site.url;
  try {
    return new URL(raw).toString().replace(/\/$/, '');
  } catch {
    return site.url;
  }
}

/** Read a design token from public/tokens.css at build time (keeps e.g. theme-color in sync with --bg). */
function designToken(name: string): string {
  const css = readFileSync(join(process.cwd(), 'public', 'tokens.css'), 'utf8');
  const match = css.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!match) throw new Error(`Design token --${name} not found in public/tokens.css`);
  return match[1].trim();
}

export const siteConfig = {
  name: profile.name,
  title: `${profile.name} — ${profile.role} | ${profile.location}`,
  description:
    'Cooper Denny is a Data Scientist at PlayHQ in Melbourne, working across statistical modelling, product analytics and analytics engineering (SQL, Python, R, dbt, Snowflake). Résumé, experience and projects — including an AFL Brownlow prediction model validated on a held-out season.',
  url: resolveSiteUrl(),
  gaId: site.gaId,
  fontsHref: site.fontsHref,
  themeColor: designToken('bg'),
};
