import Link from 'next/link';
import { adminClient } from '@/lib/supabase/adminClient';
import { WHATSAPP_NUMBER } from '@/lib/constants';

export default async function Footer() {
  const db = adminClient();
  const { data: categories } = await db.from('categories').select('id, name').order('name').limit(5);
  const year = new Date().getFullYear();
  const displayNumber = '0' + WHATSAPP_NUMBER.slice(2, 5) + '-' + WHATSAPP_NUMBER.slice(5);
  return (
    <footer className="bg-ink text-white/70 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="font-display text-xl text-white mb-3">
            SOLE<span className="text-volt">MART</span>
          </div>
          <p className="text-sm leading-relaxed mb-4">
            Sneakers, sandals and street styles — catalogued properly, counted honestly.
          </p>
          
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-volt hover:underline"
          >
            {displayNumber} (WhatsApp)
          </a>
          <p className="text-xs text-white/40 mt-1">Karachi, Pakistan</p>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-white mb-4">Shop</div>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/" className="hover:text-volt transition-colors">Home</Link></li>
            <li><Link href="/shop" className="hover:text-volt transition-colors">All products</Link></li>
            {(categories || []).map(c => (
              <li key={c.id}>
                <Link href={`/shop?category=${c.id}`} className="hover:text-volt transition-colors">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-white mb-4">Account</div>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/login" className="hover:text-volt transition-colors">Log in</Link></li>
            <li><Link href="/signup" className="hover:text-volt transition-colors">Create account</Link></li>
            <li><Link href="/orders" className="hover:text-volt transition-colors">Track my orders</Link></li>
            <li><Link href="/track-order" className="hover:text-volt transition-colors">Track order (no login)</Link></li>
            <li><Link href="/wishlist" className="hover:text-volt transition-colors">Wishlist</Link></li>
            <li><Link href="/cart" className="hover:text-volt transition-colors">My cart</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-white mb-4">Good to know</div>
          <ul className="space-y-2.5 text-sm text-white/60">
            <li><Link href="/about" className="hover:text-volt transition-colors">About us</Link></li>
            <li><Link href="/contact" className="hover:text-volt transition-colors">Contact us</Link></li>
            <li><Link href="/size-guide" className="hover:text-volt transition-colors">Size guide</Link></li>
            <li>Cash on Delivery, nationwide</li>
            <li>Free shipping over Rs. 5,000</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/40">
          <span>© {year} SoleMart Co. All rights reserved.</span>
          <span>Built for shoe lovers in Pakistan.</span>
        </div>
      </div>
    </footer>
  );
}