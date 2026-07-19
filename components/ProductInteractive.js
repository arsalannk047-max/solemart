'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';
import { money } from '@/lib/format';

const FALLBACK = 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=70';

export default function ProductInteractive({ product, priceValue }) {
  const { addItem } = useCart();
  const images = product.images && product.images.length ? product.images : [FALLBACK];
  const [mainImage, setMainImage] = useState(images[0]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const sizes = [...new Set(product.product_variants.map(v => v.size))];

  function handleSelect(size) {
    const variantsForSize = product.product_variants.filter(v => v.size === size);
    const variant = variantsForSize.find(v => v.stock > 0) || variantsForSize[0];
    setSelectedVariant(variant);
    setAdded(false);
  }

  function handleAdd() {
    if (!selectedVariant || selectedVariant.stock === 0) return;
    addItem({
      product_id: product.id,
      product_slug: product.slug,
      variant_id: selectedVariant.id,
      name: product.name,
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: selectedVariant.price_override || product.base_price,
      qty,
      stock: selectedVariant.stock,
      image: images[0]
    });
    setAdded(true);
  }

  return (
    <div className="grid md:grid-cols-2 gap-12">
      <div>
        <img src={mainImage} alt={product.name} className="w-full aspect-square object-cover rounded-2xl bg-surfacealt mb-3" />
        {images.length > 1 && (
          <div className="flex gap-2.5">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setMainImage(img)}
                className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${mainImage === img ? 'border-ink' : 'border-transparent'}`}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="text-[11px] text-muted uppercase tracking-wide font-semibold">
          {product.brand || 'SoleMart'} {product.categories ? `· ${product.categories.name}` : ''}
        </div>
        <h1 className="font-display text-3xl uppercase my-1.5">{product.name}</h1>
        <div className="font-mono text-2xl font-bold my-3">
          {money(priceValue)}{' '}
          {product.compare_at_price > priceValue && (
            <span className="text-base text-muted line-through">{money(product.compare_at_price)}</span>
          )}
        </div>
        <p className="text-muted leading-relaxed mb-5">
          {product.description || 'A dependable everyday pair, catalogued and counted.'}
        </p>

        <div className="text-xs font-bold uppercase tracking-wide mb-2.5">Select size (UK)</div>
        <div className="flex flex-wrap gap-2.5">
          {sizes.map(size => {
            const variantsForSize = product.product_variants.filter(v => v.size === size);
            const stock = variantsForSize.reduce((a, v) => a + v.stock, 0);
            const isSelected = selectedVariant && selectedVariant.size === size;
            return (
              <button
                key={size}
                type="button"
                disabled={stock === 0}
                onClick={() => handleSelect(size)}
                className={`px-4 py-2.5 border-2 border-ink rounded-md font-mono font-bold text-sm
                  ${stock === 0 ? 'opacity-30 line-through cursor-not-allowed' : ''}
                  ${isSelected ? 'bg-ink text-volt' : 'bg-surface'}`}
              >
                {size}
              </button>
            );
          })}
        </div>
        {selectedVariant && (
          <div className="text-xs font-mono font-semibold text-crimson mt-3">
            {selectedVariant.stock} left in stock {selectedVariant.color ? `· ${selectedVariant.color}` : ''}
          </div>
        )}

        <div className="flex items-center gap-3.5 mt-6">
          <input
            type="number"
            min="1"
            value={qty}
            onChange={e => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="w-20 border border-line rounded-lg px-3 py-2.5 text-sm"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!selectedVariant || selectedVariant.stock === 0}
            className="bg-volt text-voltink font-bold uppercase text-sm tracking-wide px-7 py-3.5 rounded-full shadow-volt disabled:opacity-40 disabled:shadow-none hover:-translate-y-0.5 transition-transform"
          >
            Add to cart
          </button>
        </div>
        {added && <div className="text-sm font-semibold text-ink mt-3">Added to cart ✓ — <a href="/cart" className="underline">view cart</a></div>}
      </div>
    </div>
  );
}
