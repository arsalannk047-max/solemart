'use client';

import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { money } from '@/lib/format';

export default function CartPage() {
  const { cart, updateQty, removeItem, subtotal, shipping, total } = useCart();

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <h1 className="font-display text-3xl uppercase mb-8">Your cart</h1>

      {cart.length === 0 ? (
        <div className="text-center text-muted py-16">
          Cart's empty. <Link href="/shop" className="text-azure font-semibold underline">Go find a pair →</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-[1.6fr_1fr] gap-8 items-start">
          <div>
            {cart.map(item => (
              <div key={item.variant_id} className="flex gap-4 py-5 border-b border-line items-center">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-surfacealt" />
                <div className="flex-1">
                  <div className="font-bold">{item.name}</div>
                  <div className="font-mono text-xs text-muted">
                    Size {item.size} {item.color ? `· ${item.color}` : ''}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.variant_id, item.qty - 1)}
                      className="w-7 h-7 border border-ink rounded-full text-sm"
                    >
                      −
                    </button>
                    <span className="font-mono w-6 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.variant_id, item.qty + 1)}
                      disabled={item.qty >= item.stock}
                      className="w-7 h-7 border border-ink rounded-full text-sm disabled:opacity-30"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.variant_id)}
                      className="text-xs text-crimson font-semibold ml-3"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="font-mono font-bold">{money(item.price * item.qty)}</div>
              </div>
            ))}
          </div>

          <div className="bg-surface border border-line rounded-2xl p-6">
            <div className="flex justify-between font-mono py-2"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="flex justify-between font-mono py-2"><span>Shipping</span><span>{shipping === 0 ? 'Free' : money(shipping)}</span></div>
            <div className="flex justify-between font-mono font-bold text-lg border-t-2 border-dashed border-line pt-3 mt-1"><span>Total</span><span>{money(total)}</span></div>
            <Link
              href="/checkout"
              className="block text-center bg-volt text-voltink font-bold uppercase text-sm tracking-wide px-7 py-3.5 rounded-full shadow-volt mt-4"
            >
              Checkout →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
