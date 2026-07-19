'use server';

import { getCurrentUser } from '@/lib/auth';
import { adminClient } from '@/lib/supabase/adminClient';
import { sendOrderNotification } from '@/lib/mailer';

export async function placeOrderAction(cart, shipping) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Please log in first.' };
  if (!cart || cart.length === 0) return { error: 'Your cart is empty.' };

  const { full_name, phone, address, city, postal_code } = shipping;
  if (!full_name || !phone || !address || !city) {
    return { error: 'Please fill in all required fields.' };
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping_fee = subtotal > 5000 ? 0 : 250;
  const total = subtotal + shipping_fee;

  const db = adminClient();
  const { data: order, error: orderErr } = await db
    .from('orders')
    .insert({
      user_id: user.id,
      status: 'pending',
      subtotal,
      shipping_fee,
      total,
      payment_method: 'cod',
      payment_status: 'unpaid',
      shipping_address: { full_name, phone, address, city, postal_code }
    })
    .select()
    .single();

  if (orderErr) return { error: orderErr.message };

  const items = cart.map(i => ({
    order_id: order.id,
    product_id: i.product_id,
    variant_id: i.variant_id,
    product_name: i.name,
    size: i.size,
    color: i.color,
    unit_price: i.price,
    quantity: i.qty
  }));

  const { error: itemsErr } = await db.from('order_items').insert(items);
  if (itemsErr) return { error: itemsErr.message };

  await sendOrderNotification(order, cart, shipping);

  return { error: null, order };
}
