import { Head, Html, Main, NextScript } from "next/document";

import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Only configure google analytics for production */}
        {process.env.GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}

        <meta name="author" content="Molly Gudka, mkgmagicpours@gmail.com" />
        <meta name="designer" content="Rory Gudka, rory.gudka@gmail.com" />
        <meta name="og:site_name" content="MGKMagic Pours" />
        <meta name="og:url" content="https://mkgmagic.com/" />
        <meta name="og:type" content="art website" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script async src="https://kit.fontawesome.com/810db1b20c.js" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Gabriela&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
