'use client';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { money, priceFrom, totalStock } from '@/lib/format';
import { useWishlist } from './WishlistProvider';

const FALLBACK = 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=60';

export default function ProductCard({ product }) {
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(product.id);
  const price = priceFrom(product);
  const stock = totalStock(product);
  const isNew = Date.now() - new Date(product.created_at).getTime() < 1000 * 60 * 60 * 24 * 21;
  const onSale = product.compare_at_price && product.compare_at_price > price;
  const soldOut = stock === 0;
  const lowStock = !soldOut && stock <= 5;
  const discountPct = onSale ? Math.round(((product.compare_at_price - price) / product.compare_at_price) * 100) : 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className={`group block bg-surface border border-line rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.35)] hover:border-line/60 hover:-translate-y-1 ${
        soldOut ? 'opacity-70' : ''
      }`}
    >
      <div className="relative aspect-square overflow-hidden bg-surfacealt">
        {soldOut ? (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wide bg-ink/85 text-white backdrop-blur-sm">
            Sold out
          </span>
        ) : onSale ? (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wide bg-crimson text-white">
            -{discountPct}%
          </span>
        ) : isNew ? (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wide bg-volt text-voltink">
            New
          </span>
        ) : null}

        <button
          type="button"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            toggle(product.id);
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
          aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} className={saved ? 'fill-crimson text-crimson' : 'text-ink'} />
        </button>

        <img
          src={(product.images && product.images[0]) || FALLBACK}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
            soldOut ? '' : 'group-hover:scale-[1.06]'
          }`}
        />

        {!soldOut && (
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </div>

      <div className="p-4">
        <div className="text-[10px] text-muted uppercase tracking-widest font-semibold">
          {product.brand || 'SoleMart'}
        </div>
        <div className="font-bold text-[15px] leading-snug mt-1 mb-2 line-clamp-1">{product.name}</div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2 font-mono">
            <span className="font-bold text-base">{money(price)}</span>
            {onSale && <span className="text-xs text-muted line-through">{money(product.compare_at_price)}</span>}
          </div>
          {lowStock && (
            <span className="text-[10px] font-mono font-semibold text-crimson">Only {stock} left</span>
          )}
        </div>
      </div>
    </Link>
  );
}