import Link from 'next/link';
import { adminClient } from '@/lib/supabase/adminClient';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function ShopPage({ searchParams }) {
  const category = searchParams.category || '';
  const q = searchParams.q || '';

  const db = adminClient();
  let productQuery = db.from('products').select('*, product_variants(*)').eq('is_active', true);
  if (category) productQuery = productQuery.eq('category_id', category);
  if (q) productQuery = productQuery.ilike('name', `%${q}%`);
  productQuery = productQuery.order('created_at', { ascending: false });

  const [{ data: categories }, { data: products }] = await Promise.all([
    db.from('categories').select('*').order('name'),
    productQuery
  ]);

  const qs = (extra) => {
    const params = new URLSearchParams();
    if (extra.category) params.set('category', extra.category);
    if (q) params.set('q', q);
    return params.toString() ? `?${params.toString()}` : '';
  };

  return (
    <section className="max-w-6xl mx-auto px-6 pt-12 pb-20">
      <div className="flex justify-between items-end flex-wrap gap-4 mb-7">
        <div>
          <div className="font-mono text-crimson text-xs tracking-widest uppercase font-bold">Full catalog</div>
          <h1 className="font-display text-3xl uppercase mt-1">Shop all</h1>
        </div>
        <form method="GET" className="w-full max-w-xs">
          {category && <input type="hidden" name="category" value={category} />}
          <input
            type="text"
            name="q"
            placeholder="Search shoes…"
            defaultValue={q}
            className="w-full border border-line rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-volt"
          />
        </form>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 mb-8">
        <Link href={`/shop${qs({})}`} className={`whitespace-nowrap px-5 py-2.5 rounded-full border-2 border-ink font-bold text-sm uppercase ${!category ? 'bg-ink text-volt' : 'bg-surface'}`}>
          All
        </Link>
        {(categories || []).map(c => (
          <Link
            key={c.id}
            href={`/shop${qs({ category: c.id })}`}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full border-2 border-ink font-bold text-sm uppercase ${category === c.id ? 'bg-ink text-volt' : 'bg-surface'}`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {(!products || products.length === 0) && (
          <div className="col-span-full text-center text-muted py-16">No pairs match right now — try a different search or category.</div>
        )}
        {(products || []).map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
