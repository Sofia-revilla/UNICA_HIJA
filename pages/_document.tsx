// ─────────────────────────────────────────────────────────────
//  WAH4Hospital V2 — Custom HTML Document (Next.js)
//  Controls the <html>, <head>, and <body> shell
// ─────────────────────────────────────────────────────────────
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect for Google Fonts (loaded via index.css) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
