import { profile } from '@/content/profile';

// Falls back to the current production URL if NEXT_PUBLIC_SITE_URL is unset
// or malformed, so metadata/sitemap generation never throws during build.
function resolveSiteUrl(): string {
  const fallback = 'https://cooperdenny.github.io';
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) return fallback;
  try {
    return new URL(raw).toString().replace(/\/$/, '');
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  name: 'Cooper Denny',
  title: 'Cooper Denny — Data Scientist | Melbourne, Australia',
  description:
    'Cooper Denny is a Data Scientist at PlayHQ in Melbourne, working across statistical modelling, product analytics and analytics engineering (SQL, Python, R, dbt, Snowflake). Résumé, experience and projects — including an AFL Brownlow prediction model validated on a held-out season.',
  url: resolveSiteUrl(),
  // Derived from content/profile.ts so contact details live in exactly one place.
  social: {
    email: profile.contact.email,
    linkedin: profile.contact.linkedin.href,
    github: profile.contact.github.href,
    twitter: profile.contact.x.href,
  },
};
