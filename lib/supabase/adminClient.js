import { createClient } from '@supabase/supabase-js';

// Uses the SECRET key. Bypasses Row Level Security.
// Only ever import this inside Server Components, Server Actions, or Route Handlers —
// never in a file marked "use client".
export function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
