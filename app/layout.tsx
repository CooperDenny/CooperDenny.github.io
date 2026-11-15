import Analytics from '@/components/layout/Analytics';
import Footer from '@/components/layout/Footer';
import MobileCta from '@/components/layout/MobileCta';
import Navbar from '@/components/layout/Navbar';
import { siteConfig } from '@/config/site';
import { education, profile } from '@/content/profile';
import { NAV_ITEMS } from '@/content/sections';
import { personJsonLd, siteMetadata, siteViewport } from '@/lib/seo';
import { themeScript } from '@/lib/themeScript';
import './globals.css';

export const metadata = siteMetadata(profile);
export const viewport = siteViewport;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: lib/theme.js sets data-theme on <html> before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Must run before first paint, so it's inlined rather than loaded. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={siteConfig.fontsHref} rel="stylesheet" />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(profile, education)) }}
        />
      </head>
      <body>
        <Analytics gaId={siteConfig.gaId} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar brand={profile.name} items={NAV_ITEMS} />
        <main id="main">{children}</main>
        <Footer name={profile.name} role={profile.role} location={profile.location} />
        <MobileCta email={profile.contact.email} />
      </body>
    </html>
  );
}
