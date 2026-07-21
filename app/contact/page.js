'use client';
import { useState } from 'react';
import { submitContactAction } from '@/actions/contact';

export default function ContactPage() {
  const [status, setStatus] = useState({ loading: false, error: null, success: null });

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });
    const formData = new FormData(e.target);
    const result = await submitContactAction(null, formData);
    if (result.error) {
      setStatus({ loading: false, error: result.error, success: null });
    } else {
      setStatus({ loading: false, error: null, success: result.success });
      e.target.reset();
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-10 text-center">
        <div className="font-mono text-crimson text-xs tracking-widest uppercase font-bold">Get in touch</div>
        <h1 className="font-display text-4xl uppercase mt-2">Contact Us</h1>
        <p className="text-muted mt-3">Questions about an order, sizing, or anything else — we&apos;d love to hear from you.</p>
      </div>

      {status.success && (
        <div className="bg-volt/10 border border-volt text-ink font-semibold rounded-xl p-4 mb-6 text-center">
          {status.success}
        </div>
      )}
      {status.error && (
        <div className="bg-crimson/10 border border-crimson text-crimson font-semibold rounded-xl p-4 mb-6 text-center">
          {status.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 bg-surface border border-line rounded-2xl p-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide mb-2">Name</label>
          <input name="name" required className="w-full border border-line rounded-lg px-4 py-3 bg-white" placeholder="Your name" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide mb-2">Email</label>
          <input name="email" type="email" required className="w-full border border-line rounded-lg px-4 py-3 bg-white" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide mb-2">Message</label>
          <textarea name="message" required rows={5} className="w-full border border-line rounded-lg px-4 py-3 bg-white" placeholder="How can we help?" />
        </div>
        <button
          type="submit"
          disabled={status.loading}
          className="w-full bg-volt text-voltink font-bold uppercase text-sm tracking-wide px-7 py-3.5 rounded-full disabled:opacity-60"
        >
          {status.loading ? 'Sending...' : 'Send message'}
        </button>
      </form>
    </div>
  );
}