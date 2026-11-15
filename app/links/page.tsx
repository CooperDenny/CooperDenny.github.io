import type { Metadata } from 'next';
import LinkInBio from '@/components/links/LinkInBio';
import { profile } from '@/content/profile';
import { linkInBioChannels } from '@/content/selectors';

// The Instagram bio link. Deliberately unlisted: nothing on the site links here, it is left out of
// sitemap.xml, and it asks search engines not to index it. It is not disallowed in robots.txt,
// because that would advertise the URL and stop crawlers from seeing the noindex. See decision D19.
export const metadata: Metadata = {
  title: `${profile.name} — Links`,
  description: `Find ${profile.name} online: portfolio, Instagram, Facebook, LinkedIn, X, GitHub and email.`,
  robots: { index: false, follow: false },
  // The root layout's canonical points at '/'; an unindexed page shouldn't claim to be the home page.
  alternates: { canonical: null },
};

export default function LinksPage() {
  return <LinkInBio profile={profile} channels={linkInBioChannels(profile.contact, '/')} />;
}
