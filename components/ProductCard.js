'use client';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { money, priceFrom, totalStock } from '@/lib/format';
import { useWishlist } from './WishlistProvider';
import { useCart } from './CartProvider';

const FALLBACK = 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=60';

const ACCENTS = ['bg-volt text-voltink', 'bg-crimson text-white', 'bg-ink text-volt'];
function accentFor(id) {
  let hash = 0;
  for (let i = 0; i < String(id).length; i++) hash = (hash + String(id).charCodeAt(i)) % 997;
  return ACCENTS[hash % ACCENTS.length];
}

export default function ProductCard({ product }) {
  const { isSaved, toggle } = useWishlist();
  const { addItem } = useCart();
  const saved = isSaved(product.id);
  const price = priceFrom(product);
  const stock = totalStock(product);
  const isNew = Date.now() - new Date(product.created_at).getTime() < 1000 * 60 * 60 * 24 * 21;
  const onSale = product.compare_at_price && product.compare_at_price > price;
  const soldOut = stock === 0;
  const lowStock = !soldOut && stock <= 5;
  const discountPct = onSale ? Math.round(((product.compare_at_price - price) / product.compare_at_price) * 100) : 0;
  const accent = accentFor(product.id);

  function handleQuickAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    const variant = (product.product_variants || []).find(v => v.stock > 0);
    if (!variant) return;
    addItem({
      product_id: product.id,
      variant_id: variant.id,
      name: product.name,
      size: variant.size,
      color: variant.color,
      price,
      qty: 1,
      stock: variant.stock
    });
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className={`group relative block bg-surface rounded-2xl border border-line overflow-hidden transition-all duration-300 hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.35)] hover:-translate-y-1 ${
        soldOut ? 'opacity-70' : ''
      }`}
    >
      {/* small brand ribbon, top-left */}
      <div className={`absolute top-0 left-0 z-10 px-2.5 py-1 rounded-br-lg text-[10px] font-bold uppercase tracking-widest ${accent}`}>
        {product.brand || 'SoleMart'}
      </div>

      {/* status badge, top-right */}
      {soldOut ? (
        <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wide bg-ink/85 text-white backdrop-blur-sm">
          Sold out
        </span>
      ) : onSale ? (
        <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wide bg-crimson text-white">
          -{discountPct}%
        </span>
      ) : isNew ? (
        <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wide bg-volt text-voltink">
          New
        </span>
      ) : null}

      {/* full-bleed product photo, no mismatched background box */}
      <div className="relative aspect-square overflow-hidden bg-surfacealt">
        <img
          src={(product.images && product.images[0]) || FALLBACK}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
            soldOut ? '' : 'group-hover:scale-[1.06]'
          }`}
        />
      </div>

      {/* bottom row: wishlist · name+price · quick add */}
      <div className="flex items-center justify-between gap-2 px-4 py-3.5">
        <button
          type="button"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            toggle(product.id);
          }}
          className="w-8 h-8 shrink-0 rounded-full border border-line flex items-center justify-center hover:bg-surfacealt transition-colors"
          aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={15} className={saved ? 'fill-crimson text-crimson' : 'text-ink'} />
        </button>

        <div className="text-center min-w-0 flex-1">
          <div className="font-bold text-[14px] leading-tight truncate mb-0.5">{product.name}</div>
          <div className="flex items-baseline gap-1.5 justify-center font-mono">
            {onSale && <span className="text-[11px] text-muted line-through">{money(product.compare_at_price)}</span>}
            <span className="font-bold text-sm">{money(price)}</span>
          </div>
          {lowStock && <div className="text-[10px] font-mono font-semibold text-crimson mt-0.5">Only {stock} left</div>}
        </div>

        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={soldOut}
          className="w-8 h-8 shrink-0 rounded-full bg-ink text-volt flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-40 disabled:hover:scale-100"
          aria-label="Quick add to cart"
        >
          <ShoppingBag size={15} />
        </button>
      </div>
    </Link>
  );
}