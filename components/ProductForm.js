'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { removeProductImageAction } from '@/actions/products';

export default function ProductForm({ product, categories, action }) {
  const [variants, setVariants] = useState(
    product && product.product_variants && product.product_variants.length
      ? product.product_variants.map(v => ({
          size: v.size, color: v.color || '', stock: v.stock, sku: v.sku || '', price_override: v.price_override || ''
        }))
      : [{ size: '', color: '', stock: '', sku: '', price_override: '' }]
  );
  const [images, setImages] = useState(product ? product.images || [] : []);

  function addRow() {
    setVariants(v => [...v, { size: '', color: '', stock: '', sku: '', price_override: '' }]);
  }
  function removeRow(i) {
    setVariants(v => v.filter((_, idx) => idx !== i));
  }
  function updateRow(i, field, value) {
    setVariants(v => v.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));
  }

  async function handleRemoveImage(url) {
    if (!product) return;
    if (!confirm('Remove this image?')) return;
    await removeProductImageAction(product.id, url);
    setImages(images.filter(i => i !== url));
  }

  return (
    <form action={action} encType="multipart/form-data" className="bg-surface border border-line rounded-2xl p-7">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-muted block mb-1.5">Product name</label>
          <input name="name" defaultValue={product?.name || ''} required className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-muted block mb-1.5">Brand</label>
          <input name="brand" defaultValue={product?.brand || ''} className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm" />
        </div>
      </div>

      <label className="text-xs font-bold uppercase tracking-wide text-muted block mb-1.5 mt-4">Description</label>
      <textarea name="description" rows={3} defaultValue={product?.description || ''} className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm" />

      <div className="grid md:grid-cols-2 gap-5 mt-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-muted block mb-1.5">Category</label>
          <select name="category_id" defaultValue={product?.category_id || ''} className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm">
            <option value="">— None —</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-muted block mb-1.5">Base price (Rs.)</label>
          <input type="number" step="0.01" name="base_price" defaultValue={product?.base_price || ''} required className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mt-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-muted block mb-1.5">Compare-at price (optional, for sale tag)</label>
          <input type="number" step="0.01" name="compare_at_price" defaultValue={product?.compare_at_price || ''} className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm" />
        </div>
        {product && (
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-muted block mb-1.5">Visible in store</label>
            <select name="is_active" defaultValue={product.is_active ? 'on' : 'off'} className="w-full border border-line rounded-lg px-3.5 py-2.5 text-sm">
              <option value="on">Active</option>
              <option value="off">Hidden</option>
            </select>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="mt-5">
          <label className="text-xs font-bold uppercase tracking-wide text-muted block mb-2">Current images</label>
          <div className="flex flex-wrap gap-2.5">
            {images.map(img => (
              <div key={img} className="relative">
                <img src={img} className="w-16 h-16 object-cover rounded-lg" />
                <button type="button" onClick={() => handleRemoveImage(img)} className="absolute -top-1.5 -right-1.5 bg-crimson text-white rounded-full w-5 h-5 flex items-center justify-center">
                  <X size={11} strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <label className="text-xs font-bold uppercase tracking-wide text-muted block mb-1.5 mt-5">Upload images (up to 6)</label>
      <input type="file" name="images" accept="image/*" multiple className="text-sm" />

      <label className="text-xs font-bold uppercase tracking-wide text-muted block mb-2 mt-6">Sizes &amp; stock</label>
      <div className="space-y-2.5">
        {variants.map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-2.5 items-center">
            <input name="variant_size" placeholder="Size (e.g. UK 9)" value={row.size} onChange={e => updateRow(i, 'size', e.target.value)} className="border border-line rounded-lg px-3 py-2 text-sm" />
            <input name="variant_color" placeholder="Color" value={row.color} onChange={e => updateRow(i, 'color', e.target.value)} className="border border-line rounded-lg px-3 py-2 text-sm" />
            <input type="number" name="variant_stock" placeholder="Stock" value={row.stock} onChange={e => updateRow(i, 'stock', e.target.value)} className="border border-line rounded-lg px-3 py-2 text-sm" />
            <input name="variant_sku" placeholder="SKU (optional)" value={row.sku} onChange={e => updateRow(i, 'sku', e.target.value)} className="border border-line rounded-lg px-3 py-2 text-sm" />
            <input type="number" step="0.01" name="variant_price_override" placeholder="Price override" value={row.price_override} onChange={e => updateRow(i, 'price_override', e.target.value)} className="border border-line rounded-lg px-3 py-2 text-sm" />
            <button type="button" onClick={() => removeRow(i)} className="border-2 border-ink rounded-full w-8 h-8 flex items-center justify-center"><X size={14} strokeWidth={2.5} /></button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addRow} className="border-2 border-ink text-xs font-bold uppercase px-4 py-2 rounded-full mt-3">+ Add size</button>

      <div className="mt-7">
        <button type="submit" className="bg-volt text-voltink font-bold uppercase text-sm tracking-wide px-7 py-3.5 rounded-full shadow-volt">
          {product ? 'Save changes' : 'Create product'}
        </button>
      </div>
    </form>
  );
}
