import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Used only for Supabase Auth (sign up / sign in / sign out / getUser).
// Reads and writes the auth session via Next.js cookies.
export function serverAuthClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll is called from a Server Component sometimes; middleware handles refresh there.
          }
        }
      }
    }
  );
}
