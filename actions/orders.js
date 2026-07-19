'use server';

import { revalidatePath } from 'next/cache';
import { adminClient } from '@/lib/supabase/adminClient';
import { requireAdmin } from '@/lib/requireAdmin';

export async function updateOrderStatusAction(orderId, formData) {
  await requireAdmin();
  const db = adminClient();
  await db
    .from('orders')
    .update({
      status: formData.get('status'),
      payment_status: formData.get('payment_status'),
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId);
  revalidatePath('/admin/orders');
}
