import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-6 py-28 text-center">
      <h1 className="font-display text-6xl mb-3">404</h1>
      <p className="text-muted mb-6">That page walked off the shelf.</p>
      <Link href="/" className="bg-volt text-voltink font-bold uppercase text-sm tracking-wide px-7 py-3.5 rounded-full shadow-volt">
        Back home
      </Link>
    </div>
  );
}
