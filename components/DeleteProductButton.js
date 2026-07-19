'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteProductAction } from '@/actions/products';

export default function DeleteProductButton({ productId }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm('Delete this product?')) return;
    startTransition(() => deleteProductAction(productId));
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 border-2 border-crimson text-crimson text-xs font-bold uppercase px-3 py-1.5 rounded-full disabled:opacity-50"
    >
      <Trash2 size={13} strokeWidth={2.5} />
      {isPending ? '…' : 'Delete'}
    </button>
  );
}
