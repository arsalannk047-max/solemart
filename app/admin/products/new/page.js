import { requireAdmin } from '@/lib/requireAdmin';
import { adminClient } from '@/lib/supabase/adminClient';
import AdminShell from '@/components/AdminShell';
import ProductForm from '@/components/ProductForm';
import { createProductAction } from '@/actions/products';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  await requireAdmin();
  const db = adminClient();
  const { data: categories } = await db.from('categories').select('*').order('name');

  return (
    <AdminShell active="products">
      <div className="flex justify-between items-center mb-7">
        <h1 className="font-display text-2xl uppercase">Add product</h1>
        <Link href="/admin/products" className="border-2 border-ink text-xs font-bold uppercase px-4 py-2 rounded-full">← Back to products</Link>
      </div>
      <ProductForm product={null} categories={categories || []} action={createProductAction} />
    </AdminShell>
  );
}
