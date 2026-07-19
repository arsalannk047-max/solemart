'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import { placeOrderAction } from '@/actions/checkout';
import { money } from '@/lib/format';

export default function CheckoutPage() {
  const { cart, subtotal, shipping, total, clearCart } = useCart();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(e.target);
    const shippingInfo = {
      full_name: form.get('full_name'),
      phone: form.get('phone'),
      address: form.get('address'),
      city: form.get('city'),
      postal_code: form.get('postal_code')
    };

    const result = await placeOrderAction(cart, shippingInfo);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    clearCart();
    router.push(`/orders?justPlaced=${result.order.order_number}`);
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center text-muted">
        Your cart is empty. <a href="/shop" className="text-azure underline">Go shop first →</a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <h1 className="font-display text-3xl uppercase mb-8">Checkout</h1>
      <div className="grid md:grid-cols-[1.3fr_1fr] gap-8 items-start">
        <form onSubmit={handleSubmit} className="bg-surface border border-line rounded-2xl p-7">
          {error && <div className="bg-rose-100 text-crimson text-sm font-semibold rounded-lg px-4 py-3 mb-4">{error}</div>}

          <label className="text-xs font-bold uppercase tracking-wide text-muted block mb-1.5">Full name</label>
          <input name="full_name" required className="w-full border border-line rounded-lg px-3.5 py-2.5 mb-4 text-sm" />

          <label className="text-xs font-bold uppercase tracking-wide text-muted block mb-1.5">Phone</label>
          <input name="phone" placeholder="03xx-xxxxxxx" required className="w-full border border-line rounded-lg px-3.5 py-2.5 mb-4 text-sm" />

          <label className="text-xs font-bold uppercase tracking-wide text-muted block mb-1.5">Address line</label>
          <input name="address" placeholder="House, street, area" required className="w-full border border-line rounded-lg px-3.5 py-2.5 mb-4 text-sm" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-muted block mb-1.5">City</label>
              <input name="city" defaultValue="Karachi" required className="w-full border border-line rounded-lg px-3.5 py-2.5 mb-4 text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-muted block mb-1.5">Postal code</label>
              <input name="postal_code" className="w-full border border-line rounded-lg px-3.5 py-2.5 mb-4 text-sm" />
            </div>
          </div>

          <label className="text-xs font-bold uppercase tracking-wide text-muted block mb-1.5">Payment method</label>
          <div className="border border-line rounded-lg px-3.5 py-2.5 mb-4 text-sm text-muted">Cash on Delivery</div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-volt text-voltink font-bold uppercase text-sm tracking-wide px-7 py-3.5 rounded-full shadow-volt disabled:opacity-50"
          >
            {submitting ? 'Placing order…' : 'Place order'}
          </button>
        </form>

        <div className="bg-surface border border-line rounded-2xl p-6">
          {cart.map(item => (
            <div key={item.variant_id} className="flex justify-between text-sm py-1.5">
              <span>{item.name} ({item.size}) × {item.qty}</span>
              <span className="font-mono">{money(item.price * item.qty)}</span>
            </div>
          ))}
          <div className="flex justify-between font-mono py-2 mt-2"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          <div className="flex justify-between font-mono py-2"><span>Shipping</span><span>{shipping === 0 ? 'Free' : money(shipping)}</span></div>
          <div className="flex justify-between font-mono font-bold text-lg border-t-2 border-dashed border-line pt-3"><span>Total</span><span>{money(total)}</span></div>
        </div>
      </div>
    </div>
  );
}
