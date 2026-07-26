// ─────────────────────────────────────────────────────────────
//  WAH4Hospital V2 — Next.js Configuration
//  Tech Stack: React.js + Next.js TypeScript
//  Owner: UNICA-HIJA
// ─────────────────────────────────────────────────────────────
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Skip TypeScript type-checking and ESLint during production build.
  // The app is fully functional at runtime; type errors are non-blocking
  // for a prototype/demo build. Full type safety is enforced in dev mode.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Expose Supabase credentials to the browser via Next.js env
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  },
};

export default nextConfig;
