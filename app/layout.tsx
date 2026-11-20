import Analytics from '@/components/layout/Analytics';
import { siteConfig } from '@/config/site';
import { education, profile } from '@/content/profile';
import { personJsonLd, siteMetadata, siteViewport } from '@/lib/seo';
import './globals.css';

// Next.js conventions: exported `metadata`/`viewport` become <head> tags for every route.
export const metadata = siteMetadata(profile);
export const viewport = siteViewport;

/**
 * The shell of every Next-rendered page: fonts, JSON-LD and analytics.
 * Site chrome (nav, footer, sticky bar) lives in app/(site)/layout.tsx, so /links/ can go without it.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
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
        {children}
      </body>
    </html>
  );
}
