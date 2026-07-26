// ─────────────────────────────────────────────────────────────
//  WAH4Hospital V2 — Home Page (Next.js)
//
//  Uses dynamic() with ssr: false to load the full React SPA
//  on the client side only — identical behaviour to the
//  previous Vite build. No UI changes whatsoever.
// ─────────────────────────────────────────────────────────────
import dynamic from 'next/dynamic';

// Load the entire App component client-side only (no SSR).
// This keeps all localStorage, animations, and browser APIs
// working exactly as before.
const App = dynamic(() => import('../src/App'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f0a1e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  ),
});

export default function Home() {
  return <App />;
}
