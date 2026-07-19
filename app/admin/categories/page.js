import { requireAdmin } from '@/lib/requireAdmin';
import { adminClient } from '@/lib/supabase/adminClient';
import AdminShell from '@/components/AdminShell';
import { createCategoryAction } from '@/actions/categories';
import DeleteCategoryButton from '@/components/DeleteCategoryButton';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const db = adminClient();
  const { data: categories } = await db.from('categories').select('*').order('name');

  return (
    <AdminShell active="categories">
      <h1 className="font-display text-2xl uppercase mb-7">Categories</h1>

      <form action={createCategoryAction} className="flex gap-2.5 mb-7 max-w-md">
        <input name="name" placeholder="New category name" required className="flex-1 border border-line rounded-lg px-3.5 py-2.5 text-sm" />
        <button type="submit" className="bg-volt text-voltink font-bold text-xs uppercase px-5 py-2.5 rounded-full">Add</button>
      </form>

      <table className="w-full bg-surface border border-line rounded-xl overflow-hidden text-sm">
        <thead>
          <tr className="bg-ink text-white text-left text-xs uppercase">
            <th className="px-4 py-3">Name</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(!categories || categories.length === 0) && (
            <tr><td colSpan={3} className="text-center text-muted py-6">No categories yet.</td></tr>
          )}
          {(categories || []).map(c => (
            <tr key={c.id} className="border-t border-line">
              <td className="px-4 py-3">{c.name}</td>
              <td className="px-4 py-3 font-mono text-xs text-muted">{c.slug}</td>
              <td className="px-4 py-3"><DeleteCategoryButton categoryId={c.id} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
