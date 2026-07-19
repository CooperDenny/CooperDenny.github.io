import type { Metadata } from 'next';
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SiteEffects from '@/components/SiteEffects';
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
      'Data Scientist at PlayHQ Sports. Portfolio of machine learning, sports analytics, and BI work — including the AFL Brownlow prediction model.',
    images: ['/images/hero-image.png'],
    locale: 'en_AU',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description:
      'Data Scientist at PlayHQ Sports. Portfolio of machine learning, sports analytics, and BI work.',
    images: ['/images/hero-image.png'],
    creator: '@CooperCDenny',
  },
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
    name: 'PlayHQ Sports',
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
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme')||'dark';document.body.setAttribute('data-theme',t);}catch(e){}})();",
          }}
        />
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
        <Navbar />
        {children}
        <Footer />
        <SiteEffects />
      </body>
    </html>
  );
}
