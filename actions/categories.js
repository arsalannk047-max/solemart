'use server';

import { revalidatePath } from 'next/cache';
import { adminClient } from '@/lib/supabase/adminClient';
import { requireAdmin } from '@/lib/requireAdmin';
import { slugify } from '@/lib/format';

export async function createCategoryAction(formData) {
  await requireAdmin();
  const db = adminClient();
  const name = formData.get('name');
  if (!name) return;
  await db.from('categories').insert({ name, slug: slugify(name) });
  revalidatePath('/admin/categories');
  revalidatePath('/');
  revalidatePath('/shop');
}

export async function deleteCategoryAction(categoryId) {
  await requireAdmin();
  const db = adminClient();
  await db.from('categories').delete().eq('id', categoryId);
  revalidatePath('/admin/categories');
  revalidatePath('/');
  revalidatePath('/shop');
}
