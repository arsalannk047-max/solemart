import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Tag, Package, ExternalLink, LogOut } from 'lucide-react';
import { signOutAction } from '@/actions/auth';

const NAV = [
  { href: '/admin', label: 'Dashboard', key: 'dashboard', Icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', key: 'products', Icon: ShoppingBag },
  { href: '/admin/categories', label: 'Categories', key: 'categories', Icon: Tag },
  { href: '/admin/orders', label: 'Orders', key: 'orders', Icon: Package }
];

export default function AdminShell({ active, children }) {
  return (
    <div className="grid grid-cols-[230px_1fr] min-h-screen">
      <aside className="bg-ink text-white p-6 sticky top-0 h-screen">
        <Link href="/admin" className="font-display text-xl block mb-9">
          SOLE<span className="text-volt">MART</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {NAV.map(item => (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg font-semibold text-sm ${active === item.key ? 'bg-volt text-voltink' : 'text-white/70 hover:bg-white/10'}`}
            >
              <item.Icon size={17} strokeWidth={2.25} />
              {item.label}
            </Link>
          ))}
          <Link href="/" target="_blank" className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg font-semibold text-sm text-white/70 hover:bg-white/10">
            <ExternalLink size={17} strokeWidth={2.25} />
            View store
          </Link>
          <form action={signOutAction} className="mt-5">
            <button className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg font-semibold text-sm text-white/70 hover:bg-white/10 w-full text-left">
              <LogOut size={17} strokeWidth={2.25} />
              Log out
            </button>
          </form>
        </nav>
      </aside>
      <main className="bg-surfacealt p-9">{children}</main>
    </div>
  );
}
