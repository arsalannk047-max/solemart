'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { serverAuthClient } from '@/lib/supabase/serverAuthClient';
import { adminClient } from '@/lib/supabase/adminClient';

export async function signUpAction(prevState, formData) {
  const full_name = formData.get('full_name');
  const email = formData.get('email');
  const password = formData.get('password');

  if (!full_name || !email || !password) {
    return { error: 'All fields are required.' };
  }

  const supabase = serverAuthClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name } }
  });

  if (error) return { error: error.message };

  if (!data.session) {
    return { error: null, message: 'Account created! Please check your email to confirm, then log in.' };
  }

  revalidatePath('/');
  redirect('/');
}

export async function signInAction(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const supabase = serverAuthClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  revalidatePath('/');
  redirect('/');
}

export async function signOutAction() {
  const supabase = serverAuthClient();
  await supabase.auth.signOut();
  revalidatePath('/');
  redirect('/');
}

export async function adminSignInAction(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const supabase = serverAuthClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: 'Invalid credentials' };

  const db = adminClient();
  const { data: profile } = await db.from('profiles').select('is_admin').eq('id', data.user.id).single();

  if (!profile || !profile.is_admin) {
    await supabase.auth.signOut();
    return { error: 'This account is not an admin.' };
  }

  revalidatePath('/admin');
  redirect('/admin');
}
