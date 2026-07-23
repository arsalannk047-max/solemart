import Link from 'next/link';
import { adminClient } from '@/lib/supabase/adminClient';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const db = adminClient();
  const [{ data: categories }, { data: products }] = await Promise.all([
    db.from('categories').select('*').order('name'),
    db.from('products').select('*, product_variants(*)').eq('is_active', true).order('created_at', { ascending: false }).limit(8)
  ]);

  return (
    <>
      <section className="relative bg-ink text-white overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/hero-poster-3.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/hero-video-neon2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/65"></div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-28 pb-32 text-center">
          <div className="font-mono text-volt text-xs tracking-widest uppercase mb-4">— Est. Karachi · Real Stock, Real Sizes —</div>
          <h1 className="font-display text-6xl leading-none uppercase mb-6">Step into<br />the new drop.</h1>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Sneakers, sandals and street styles — catalogued properly, counted honestly. Add to cart, pay on delivery.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <Link href="/shop" className="bg-volt text-voltink font-bold uppercase text-sm tracking-wide px-7 py-3.5 rounded-full shadow-volt hover:-translate-y-0.5 transition-transform">
              Shop the rack →
            </Link>
            <Link href="/shop" className="border-2 border-white text-white font-bold uppercase text-sm tracking-wide px-7 py-3.5 rounded-full hover:-translate-y-0.5 transition-transform">
              New arrivals
            </Link>
          </div>
          <div className="inline-block bg-volt text-voltink font-mono font-bold text-sm px-5 py-3 rounded-xl shadow-2xl">
            SIZE RUN: UK 6 — UK 12
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-7">
          <div className="font-mono text-crimson text-xs tracking-widest uppercase font-bold">Browse by</div>
          <h2 className="font-display text-3xl uppercase mt-1 text-white">Category</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <Link href="/shop" className="whitespace-nowrap px-5 py-2.5 rounded-full border-2 border-volt bg-ink text-volt font-bold text-sm uppercase">
            All
          </Link>
          {(categories || []).map(c => (
            <Link
              key={c.id}
              href={`/shop?category=${c.id}`}
              className="whitespace-nowrap px-5 py-2.5 rounded-full border-2 border-line bg-surface font-bold text-sm uppercase hover:bg-ink hover:text-volt hover:border-ink transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex justify-between items-end flex-wrap gap-4 mb-7">
          <div>
            <div className="font-mono text-crimson text-xs tracking-widest uppercase font-bold">On the shelf</div>
            <h2 className="font-display text-3xl uppercase mt-1 text-white">Featured pairs</h2>
          </div>
          <Link href="/shop" className="bg-ink text-volt text-xs font-bold uppercase px-5 py-2.5 rounded-full border border-volt/30">View all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {(!products || products.length === 0) && (
            <div className="col-span-full text-center text-white/50 py-16">No products yet — check back soon.</div>
          )}
          {(products || []).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}