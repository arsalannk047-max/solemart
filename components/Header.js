'use client';

import Link from 'next/link';
import { User, ShoppingBag, LogOut } from 'lucide-react';
import { useCart } from './CartProvider';
import { signOutAction } from '@/actions/auth';

export default function Header({ user }) {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-ink">
      <div className="bg-volt text-voltink text-center text-[11px] font-mono font-bold tracking-wide py-1.5 px-4">
        FREE SHIPPING OVER RS. 5,000 &nbsp;·&nbsp; CASH ON DELIVERY AVAILABLE
      </div>
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="font-display text-2xl text-white tracking-wide">
          SOLE<span className="text-volt">MART</span>
        </Link>

        <nav className="hidden md:flex gap-8 text-sm font-semibold uppercase tracking-wide text-white">
          <Link href="/" className="hover:text-volt transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-volt transition-colors">Shop</Link>
          {user && <Link href="/orders" className="hover:text-volt transition-colors">Orders</Link>}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs font-mono text-white/70">
                Hi, {user.full_name || user.email.split('@')[0]}
              </span>
              <form action={signOutAction}>
                <button className="text-white/80 hover:text-volt transition-colors" title="Log out"><LogOut size={19} /></button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="text-white/80 hover:text-volt transition-colors" title="Log in"><User size={19} /></Link>
          )}
          <Link href="/cart" className="relative text-white/80 hover:text-volt transition-colors" title="Cart">
            <ShoppingBag size={19} />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-crimson text-white text-[10px] font-mono font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
