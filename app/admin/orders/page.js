import { requireAdmin } from '@/lib/requireAdmin';
import { adminClient } from '@/lib/supabase/adminClient';
import { money } from '@/lib/format';
import AdminShell from '@/components/AdminShell';
import { updateOrderStatusAction } from '@/actions/orders';

export const dynamic = 'force-dynamic';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['unpaid', 'paid', 'refunded'];

export default async function AdminOrdersPage() {
  await requireAdmin();
  const db = adminClient();
  const { data: orders } = await db.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });

  return (
    <AdminShell active="orders">
      <h1 className="font-display text-2xl uppercase mb-7">Orders</h1>

      {(!orders || orders.length === 0) && <p className="text-muted">No orders yet.</p>}

      {(orders || []).map(o => {
        const boundAction = updateOrderStatusAction.bind(null, o.id);
        return (
          <div key={o.id} className="bg-surface border border-line rounded-xl p-5 mb-4">
            <div className="flex justify-between flex-wrap gap-2.5 items-center">
              <div>
                <div className="font-mono font-bold">{o.order_number}</div>
                <div className="text-xs text-muted">{new Date(o.created_at).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold">{money(o.total)}</div>
                <div className="text-xs">{o.shipping_address ? `${o.shipping_address.full_name} · ${o.shipping_address.phone}` : ''}</div>
              </div>
            </div>

            <div className="my-3.5">
              {o.order_items.map(it => (
                <div key={it.id} className="text-sm py-0.5">
                  {it.product_name} — size {it.size} {it.color ? `· ${it.color}` : ''} × {it.quantity}{' '}
                  <span className="font-mono text-muted">(Rs. {it.unit_price} ea)</span>
                </div>
              ))}
            </div>

            <form action={boundAction} className="flex gap-3 flex-wrap items-end">
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-muted block mb-1">Order status</label>
                <select name="status" defaultValue={o.status} className="border border-line rounded-lg px-3 py-2 text-sm">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-muted block mb-1">Payment status</label>
                <select name="payment_status" defaultValue={o.payment_status} className="border border-line rounded-lg px-3 py-2 text-sm">
                  {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button type="submit" className="bg-ink text-white text-xs font-bold uppercase px-4 py-2.5 rounded-full">Update</button>
            </form>
          </div>
        );
      })}
    </AdminShell>
  );
}
