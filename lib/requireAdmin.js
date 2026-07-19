import { redirect } from 'next/navigation';
import { getCurrentProfile } from './auth';

export async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (!profile || !profile.is_admin) {
    redirect('/admin/login');
  }
  return profile;
}
