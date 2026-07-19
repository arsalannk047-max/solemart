import Link from 'next/link';
import { money, priceFrom, totalStock } from '@/lib/format';

const FALLBACK = 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=60';

export default function ProductCard({ product }) {
  const price = priceFrom(product);
  const stock = totalStock(product);
  const isNew = Date.now() - new Date(product.created_at).getTime() < 1000 * 60 * 60 * 24 * 21;
  const onSale = product.compare_at_price && product.compare_at_price > price;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="cut-card bg-surface border border-line p-4 block hover:-translate-y-1 transition-transform"
    >
      <div className="relative mb-3.5">
        {stock === 0 ? (
          <span className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-muted text-white">Sold out</span>
        ) : onSale ? (
          <span className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-crimson text-white">Sale</span>
        ) : isNew ? (
          <span className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-volt text-voltink">New</span>
        ) : null}
        <img
          src={(product.images && product.images[0]) || FALLBACK}
          alt={product.name}
          className="w-full aspect-square object-cover rounded-md bg-surfacealt"
        />
      </div>
      <div className="text-[11px] text-muted uppercase tracking-wide font-semibold">{product.brand || 'SoleMart'}</div>
      <div className="font-bold text-base my-1">{product.name}</div>
      <div className="flex items-baseline gap-2.5 font-mono">
        <span className="font-bold text-base">{money(price)}</span>
        {onSale && <span className="text-xs text-muted line-through">{money(product.compare_at_price)}</span>}
      </div>
    </Link>
  );
}
