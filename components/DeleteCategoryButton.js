'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteCategoryAction } from '@/actions/categories';

export default function DeleteCategoryButton({ categoryId }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm('Delete this category?')) return;
    startTransition(() => deleteCategoryAction(categoryId));
  }

  return (
    <button onClick={handleClick} disabled={isPending} className="inline-flex items-center gap-1.5 border-2 border-crimson text-crimson text-xs font-bold uppercase px-3 py-1.5 rounded-full disabled:opacity-50">
      <Trash2 size={13} strokeWidth={2.5} />
      {isPending ? '…' : 'Delete'}
    </button>
  );
}
