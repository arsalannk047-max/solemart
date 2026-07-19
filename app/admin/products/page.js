import Link from 'next/link';
import { requireAdmin } from '@/lib/requireAdmin';
import { adminClient } from '@/lib/supabase/adminClient';
import { money } from '@/lib/format';
import AdminShell from '@/components/AdminShell';
import DeleteProductButton from '@/components/DeleteProductButton';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  await requireAdmin();
  const db = adminClient();
  const { data: products } = await db
    .from('products')
    .select('*, categories(name), product_variants(*)')
    .order('created_at', { ascending: false });

  return (
    <AdminShell active="products">
      <div className="flex justify-between items-center mb-7">
        <h1 className="font-display text-2xl uppercase">Products</h1>
        <Link href="/admin/products/new" className="bg-volt text-voltink font-bold text-xs uppercase px-5 py-2.5 rounded-full">
          + Add product
        </Link>
      </div>

      <table className="w-full bg-surface border border-line rounded-xl overflow-hidden text-sm">
        <thead>
          <tr className="bg-ink text-white text-left text-xs uppercase">
            <th className="px-4 py-3">Image</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(!products || products.length === 0) && (
            <tr><td colSpan={7} className="text-center text-muted py-8">No products yet — add your first pair.</td></tr>
          )}
          {(products || []).map(p => {
            const stock = (p.product_variants || []).reduce((s, v) => s + v.stock, 0);
            return (
              <tr key={p.id} className="border-t border-line align-middle">
                <td className="px-4 py-3">
                  <img src={(p.images && p.images[0]) || 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=100&q=50'} className="w-11 h-11 object-cover rounded-md" />
                </td>
                <td className="px-4 py-3">
                  <div className="font-bold">{p.name}</div>
                  <div className="font-mono text-xs text-muted">{p.brand || ''}</div>
                </td>
                <td className="px-4 py-3">{p.categories ? p.categories.name : '—'}</td>
                <td className="px-4 py-3 font-mono">{money(p.base_price)}</td>
                <td className="px-4 py-3">{stock}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold ${p.is_active ? 'bg-lime-100 text-green-800' : 'bg-rose-100 text-crimson'}`}>
                    {p.is_active ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Link href={`/admin/products/${p.id}/edit`} className="border-2 border-ink text-xs font-bold uppercase px-3 py-1.5 rounded-full mr-2">Edit</Link>
                  <DeleteProductButton productId={p.id} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </AdminShell>
  );
}
