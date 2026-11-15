import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileCta from '@/components/MobileCta';
import { siteConfig } from '@/config/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: [
    'Cooper Denny',
    'Data Scientist',
    'Melbourne',
    'Australia',
    'PlayHQ',
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
  authors: [{ name: 'Cooper Denny' }],
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    url: '/',
    title: siteConfig.title,
    description:
      'Data Scientist at PlayHQ. Experience, résumé and projects in statistical modelling, product analytics and analytics engineering — including an out-of-sample-validated AFL Brownlow prediction model.',
    images: ['/images/hero-image.png'],
    locale: 'en_AU',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description:
      'Data Scientist at PlayHQ. Résumé and projects in statistical modelling, product analytics and analytics engineering.',
    images: ['/images/hero-image.png'],
    creator: '@CooperCDenny',
  },
};

// Dark-only site: match the mobile browser chrome to the page background.
export const viewport: Viewport = {
  themeColor: '#0b1120',
  colorScheme: 'dark',
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Cooper Denny',
  url: siteConfig.url,
  image: `${siteConfig.url}/images/hero-image.png`,
  jobTitle: 'Data Scientist',
  worksFor: {
    '@type': 'Organization',
    name: 'PlayHQ',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Monash University',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Melbourne',
    addressRegion: 'VIC',
    addressCountry: 'AU',
  },
  email: `mailto:${siteConfig.social.email}`,
  sameAs: [siteConfig.social.linkedin, siteConfig.social.github, siteConfig.social.twitter],
  knowsAbout: [
    'Data Science',
    'Machine Learning',
    'Sports Analytics',
    'SQL',
    'Python',
    'R',
    'dbt',
    'Snowflake',
    'Tableau',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ colorScheme: 'dark' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-GPHTSF6Q5B"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GPHTSF6Q5B');
          `}
        </Script>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <MobileCta />
      </body>
    </html>
  );
}
