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
    'Cooper Denny is a Data Scientist at PlayHQ Sports in Melbourne. Portfolio of work in SQL, Python, dbt, Snowflake, Tableau, machine learning, and sports analytics — including the AFL Brownlow prediction model.',
  url: resolveSiteUrl(),
  social: {
    email: 'cooper.denny@icloud.com',
    linkedin: 'https://www.linkedin.com/in/cooper-denny/',
    github: 'https://github.com/CooperDenny',
    twitter: 'https://x.com/coopercdenny',
  },
};
