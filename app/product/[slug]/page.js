import { notFound } from 'next/navigation';
import { adminClient } from '@/lib/supabase/adminClient';
import { priceFrom } from '@/lib/format';
import ProductInteractive from '@/components/ProductInteractive';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }) {
  const db = adminClient();
  const { data: product, error } = await db
    .from('products')
    .select('*, product_variants(*), categories(name)')
    .eq('slug', params.slug)
    .single();

  if (error || !product) notFound();

  const { data: reviews } = await db
    .from('reviews')
    .select('*')
    .eq('product_id', product.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto px-6 pt-10 pb-20">
      <ProductInteractive product={product} priceValue={priceFrom(product)} />

      {reviews && reviews.length > 0 && (
        <div className="mt-14 max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-wide mb-3">Reviews</div>
          {reviews.map(r => (
            <div key={r.id} className="border-t border-line py-4">
              <div className="font-mono font-bold">★ {r.rating}/5</div>
              <div className="text-sm text-muted">{r.comment}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
