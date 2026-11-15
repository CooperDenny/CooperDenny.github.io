import Script from 'next/script';

/** Google Analytics (gtag.js), loaded after the page is interactive. */
export default function Analytics({ gaId }: { gaId: string }) {
  return (
    <>
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}
      </Script>
    </>
  );
}
