import type { Metadata, Viewport } from 'next';
import { siteConfig } from '@/config/site';
import { contactChannels } from '@/content/selectors';
import type { Education, Profile } from '@/content/types';

const shareDescription =
  'Data Scientist at PlayHQ. Experience, résumé and projects in statistical modelling, product analytics and analytics engineering — including an out-of-sample-validated AFL Brownlow prediction model.';

export function siteMetadata(profile: Profile): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: siteConfig.title,
    description: siteConfig.description,
    keywords: [
      profile.name,
      profile.role,
      'Melbourne',
      'Australia',
      profile.employer,
      'Sports Analytics',
      'AFL Brownlow',
      'Machine Learning',
      'SQL',
      'Python',
      'dbt',
      'Snowflake',
      'Tableau',
      'Data Science Portfolio',
    ],
    authors: [{ name: profile.name }],
    robots: { index: true, follow: true },
    alternates: { canonical: '/' },
    icons: { icon: '/favicon.svg' },
    openGraph: {
      type: 'website',
      url: '/',
      title: siteConfig.title,
      description: shareDescription,
      images: [profile.photo],
      locale: 'en_AU',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.title,
      description:
        'Data Scientist at PlayHQ. Résumé and projects in statistical modelling, product analytics and analytics engineering.',
      images: [profile.photo],
      creator: profile.contact.x.handle,
    },
  };
}

/** Mobile browser chrome matches the default (dark) background; lib/theme.js updates it on toggle. */
export const siteViewport: Viewport = {
  themeColor: siteConfig.themeColor,
  colorScheme: 'dark light',
};

/** schema.org Person, built from the same content as the page. */
export function personJsonLd(profile: Profile, education: Education) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    url: siteConfig.url,
    image: `${siteConfig.url}${profile.photo}`,
    jobTitle: profile.role,
    worksFor: { '@type': 'Organization', name: profile.employer },
    alumniOf: { '@type': 'CollegeOrUniversity', name: education.institution },
    address: { '@type': 'PostalAddress', addressLocality: 'Melbourne', addressRegion: 'VIC', addressCountry: 'AU' },
    email: `mailto:${profile.contact.email}`,
    sameAs: contactChannels(profile.contact)
      .filter((ch) => ch.key !== 'email')
      .map((ch) => ch.href),
    knowsAbout: ['Data Science', 'Machine Learning', 'Sports Analytics', 'SQL', 'Python', 'R', 'dbt', 'Snowflake', 'Tableau'],
  };
}
