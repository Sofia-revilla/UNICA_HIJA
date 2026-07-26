// ─────────────────────────────────────────────────────────────
//  WAH4Hospital V2 — Next.js App Entry Point
//  All pages are wrapped here (global CSS + providers)
// ─────────────────────────────────────────────────────────────
import type { AppProps } from 'next/app';
import '../src/index.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
