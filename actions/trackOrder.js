'use server';
import { adminClient } from '@/lib/supabase/adminClient';

export async function trackOrderAction(orderNumber, phone) {
  if (!orderNumber || !phone) return { error: 'Please enter your order number and phone number.', order: null };

  const db = adminClient();
  const { data: order, error } = await db
    .from('orders')
    .select('*, order_items(*)')
    .eq('order_number', orderNumber.trim())
    .single();

  if (error || !order) return { error: 'No order found with that order number.', order: null };

  const savedPhone = (order.shipping_address?.phone || '').replace(/\D/g, '');
  const enteredPhone = phone.replace(/\D/g, '');
  if (!savedPhone || savedPhone !== enteredPhone) {
    return { error: 'Order number and phone number do not match.', order: null };
  }

  return { error: null, order };
}