'use client';
import { useEffect, useState } from 'react';
import { useWishlist } from '@/components/WishlistProvider';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default function WishlistPage() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    })
      .then(res => res.json())
      .then(data => setProducts(data.products || []))
      .finally(() => setLoading(false));
  }, [ids]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-10">
        <div className="font-mono text-crimson text-xs tracking-widest uppercase font-bold">Saved for later</div>
        <h1 className="font-display text-4xl uppercase mt-2">Your Wishlist</h1>
      </div>

      {loading && <div className="text-center text-muted py-16">Loading...</div>}

      {!loading && products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted mb-6">Nothing saved yet — tap the heart on any product to add it here.</p>
          <Link href="/shop" className="bg-volt text-voltink font-bold uppercase text-sm tracking-wide px-7 py-3.5 rounded-full inline-block">
            Browse the shop
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}