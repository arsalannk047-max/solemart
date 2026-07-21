'use client';
import { useState } from 'react';
import { trackOrderAction } from '@/actions/trackOrder';
import { money } from '@/lib/format';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState({ loading: false, error: null, order: null });

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ loading: true, error: null, order: null });
    const result = await trackOrderAction(orderNumber, phone);
    setStatus({ loading: false, error: result.error, order: result.order });
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <div className="font-mono text-crimson text-xs tracking-widest uppercase font-bold">Where&apos;s my order?</div>
        <h1 className="font-display text-5xl uppercase mt-2">Track Order</h1>
        <p className="text-muted mt-3">Enter your order number and the phone number you used at checkout.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-surface border border-line rounded-2xl p-6 mb-8">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide mb-2">Order number</label>
          <input
            value={orderNumber}
            onChange={e => setOrderNumber(e.target.value)}
            required
            className="w-full border border-line rounded-lg px-4 py-3 bg-white font-mono"
            placeholder="e.g. SM-0001"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide mb-2">Phone number</label>
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            className="w-full border border-line rounded-lg px-4 py-3 bg-white font-mono"
            placeholder="03xxxxxxxxx"
          />
        </div>
        <button
          type="submit"
          disabled={status.loading}
          className="w-full bg-volt text-voltink font-bold uppercase text-sm tracking-wide px-7 py-3.5 rounded-full disabled:opacity-60"
        >
          {status.loading ? 'Looking up...' : 'Track order'}
        </button>
      </form>

      {status.error && (
        <div className="bg-crimson/10 border border-crimson text-crimson font-semibold rounded-xl p-4 mb-6 text-center">
          {status.error}
        </div>
      )}

      {status.order && (
        <div className="bg-surface border border-line rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="font-mono text-xs text-muted uppercase">Order</div>
              <div className="font-display text-2xl">{status.order.order_number}</div>
            </div>
            <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold uppercase bg-ink text-volt">
              {status.order.status}
            </span>
          </div>
          <div className="space-y-2 mb-4">
            {(status.order.order_items || []).map(item => (
              <div key={item.id} className="flex justify-between text-sm border-b border-line pb-2">
                <span>{item.product_name} <span className="text-muted">({item.size}{item.color ? ' / ' + item.color : ''}) × {item.quantity}</span></span>
                <span className="font-mono">{money(item.unit_price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span className="font-mono">{money(status.order.total)}</span>
          </div>
          <div className="text-xs text-muted mt-1">Payment: {status.order.payment_status} · Cash on Delivery</div>
        </div>
      )}
    </div>
  );
}