import { requireAdmin } from '@/lib/requireAdmin';
import { adminClient } from '@/lib/supabase/adminClient';
import { money } from '@/lib/format';
import AdminShell from '@/components/AdminShell';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await requireAdmin();
  const db = adminClient();

  const [
    { count: productCount },
    { count: orderCount },
    { count: pendingCount },
    { data: revenueRows },
    { data: recentOrders }
  ] = await Promise.all([
    db.from('products').select('*', { count: 'exact', head: true }),
    db.from('orders').select('*', { count: 'exact', head: true }),
    db.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    db.from('orders').select('total').neq('status', 'cancelled'),
    db.from('orders').select('*').order('created_at', { ascending: false }).limit(5)
  ]);
  const revenue = (revenueRows || []).reduce((s, o) => s + Number(o.total), 0);

  return (
    <AdminShell active="dashboard">
      <h1 className="font-display text-2xl uppercase mb-7">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-9">
        {[
          ['Products', productCount || 0],
          ['Total orders', orderCount || 0],
          ['Pending orders', pendingCount || 0],
          ['Revenue', money(revenue)]
        ].map(([label, val]) => (
          <div key={label} className="bg-surface border border-line rounded-xl p-5">
            <div className="font-mono text-2xl font-bold">{val}</div>
            <div className="text-xs text-muted uppercase font-bold tracking-wide mt-1">{label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-bold uppercase mb-3">Recent orders</h2>
      <table className="w-full bg-surface border border-line rounded-xl overflow-hidden text-sm">
        <thead>
          <tr className="bg-ink text-white text-left text-xs uppercase">
            <th className="px-4 py-3">Order #</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Placed</th>
          </tr>
        </thead>
        <tbody>
          {(!recentOrders || recentOrders.length === 0) && (
            <tr><td colSpan={4} className="text-center text-muted py-6">No orders yet.</td></tr>
          )}
          {(recentOrders || []).map(o => (
            <tr key={o.id} className="border-t border-line">
              <td className="px-4 py-3 font-mono">{o.order_number}</td>
              <td className="px-4 py-3 capitalize">{o.status}</td>
              <td className="px-4 py-3 font-mono">{money(o.total)}</td>
              <td className="px-4 py-3">{new Date(o.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
