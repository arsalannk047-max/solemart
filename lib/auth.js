import { serverAuthClient } from './supabase/serverAuthClient';
import { adminClient } from './supabase/adminClient';

// Returns { id, email } for the logged-in customer/admin, or null.
export async function getCurrentUser() {
  const supabase = serverAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return { id: user.id, email: user.email };
}

// Returns the profile row (with is_admin, full_name) for the current user, or null.
export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;
  const db = adminClient();
  const { data: profile } = await db.from('profiles').select('*').eq('id', user.id).single();
  return profile ? { ...profile, email: user.email } : null;
}
