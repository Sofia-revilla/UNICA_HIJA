import { createClient, SupabaseClient } from '@supabase/supabase-js';

function buildClient(): SupabaseClient | null {
  try {
    const url = (process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined)?.trim();
    const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined)?.trim();

    if (!url || !url.startsWith('http') || !key) {
      console.warn('[WAH4H] Supabase env vars missing — using mock data');
      return null;
    }

    return createClient(url, key);
  } catch (err) {
    console.warn('[WAH4H] Supabase init failed:', err);
    return null;
  }
}

// null = no env vars, DataContext falls back to mock data
export const supabase = buildClient();
