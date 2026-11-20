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

/**
 * Read a default-theme (dark) design token from public/tokens.css at build time, so values such as
 * theme-color stay in sync with --band. Only the plain `:root { … }` block is searched — never the
 * `:root[data-theme='light']` overrides — and a missing token fails the build.
 */
function designToken(name: string): string {
  const css = readFileSync(join(process.cwd(), 'public', 'tokens.css'), 'utf8');
  const defaults = css.match(/^:root\s*\{([^}]*)\}/m)?.[1] ?? '';
  const match = defaults.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!match) throw new Error(`Design token --${name} not found in public/tokens.css`);
  return match[1].trim();
}

/** Resolved site-wide settings for the Next.js app. */
export const siteConfig = {
  name: profile.name,
  title: `${profile.name} — ${profile.role} | ${profile.location}`,
  description:
    'Cooper Denny is a Data Scientist at PlayHQ in Melbourne: an embedded analytics product used by 50,000+ people, an XGBoost churn model built in Snowflake, and the dbt pipelines behind them. Résumé, experience and projects, including an AFL Brownlow prediction model validated on a held-out season.',
  url: resolveSiteUrl(),
  gaId: site.gaId,
  fontsHref: site.fontsHref,
  /** The petrol --band (same in both themes), so the browser bar matches the nav; lib/theme.js keeps the meta tag in sync. */
  themeColor: designToken('band'),
};
