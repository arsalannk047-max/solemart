import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { adminClient } from '@/lib/supabase/adminClient';
import { money } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function OrdersPage({ searchParams }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const db = adminClient();
  const { data: orders } = await db
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <h1 className="font-display text-3xl uppercase mb-6">Your orders</h1>

      {searchParams.justPlaced && (
        <div className="bg-lime-100 text-green-800 font-semibold text-sm rounded-lg px-4 py-3 mb-6">
          Order placed! Your order <span className="font-mono">{searchParams.justPlaced}</span> is confirmed — cash on delivery.
        </div>
      )}

      {(!orders || orders.length === 0) ? (
        <div className="text-center text-muted py-16">
          No orders yet. <Link href="/shop" className="text-azure underline">Go shop →</Link>
        </div>
      ) : (
        orders.map(o => (
          <div key={o.id} className="cut-card bg-surface border border-line p-6 mb-4">
            <div className="flex justify-between items-center">
              <div className="font-mono font-bold">{o.order_number}</div>
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-volt text-voltink capitalize">{o.status}</span>
            </div>
            <div className="text-xs text-muted my-2">
              {new Date(o.created_at).toLocaleDateString()} · {o.order_items.length} item(s)
            </div>
            {o.order_items.map(it => (
              <div key={it.id} className="text-sm py-1">{it.product_name} — size {it.size} × {it.quantity}</div>
            ))}
            <div className="font-mono font-bold mt-2.5">Total: {money(o.total)}</div>
          </div>
        ))
      )}
    </div>
  );
}
