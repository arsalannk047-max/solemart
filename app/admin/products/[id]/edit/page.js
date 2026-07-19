import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/requireAdmin';
import { adminClient } from '@/lib/supabase/adminClient';
import AdminShell from '@/components/AdminShell';
import ProductForm from '@/components/ProductForm';
import { updateProductAction } from '@/actions/products';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }) {
  await requireAdmin();
  const db = adminClient();
  const { data: product, error } = await db.from('products').select('*, product_variants(*)').eq('id', params.id).single();
  if (error || !product) notFound();
  const { data: categories } = await db.from('categories').select('*').order('name');

  const boundAction = updateProductAction.bind(null, product.id);

  return (
    <AdminShell active="products">
      <div className="flex justify-between items-center mb-7">
        <h1 className="font-display text-2xl uppercase">Edit product</h1>
        <Link href="/admin/products" className="border-2 border-ink text-xs font-bold uppercase px-4 py-2 rounded-full">← Back to products</Link>
      </div>
      <ProductForm product={product} categories={categories || []} action={boundAction} />
    </AdminShell>
  );
}
