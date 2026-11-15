import Footer from '@/components/layout/Footer';
import MobileCta from '@/components/layout/MobileCta';
import Navbar from '@/components/layout/Navbar';
import { profile } from '@/content/profile';
import { NAV_ITEMS } from '@/content/sections';

/**
 * Site chrome for the home page and résumé: skip link, nav, footer and the sticky phone bar.
 * Kept out of the root layout so chromeless routes (the /links/ bio page) can skip it.
 * `(site)` is a route group: it adds no segment to the URL.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar brand={profile.name} items={NAV_ITEMS} />
      <main id="main">{children}</main>
      <Footer name={profile.name} role={profile.role} location={profile.location} />
      <MobileCta email={profile.contact.email} />
    </>
  );
}
