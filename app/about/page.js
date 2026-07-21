export const metadata = {
  title: 'About Us — SoleMart',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-14">
        <div className="font-mono text-crimson text-xs tracking-widest uppercase font-bold">Our story</div>
        <h1 className="font-display text-5xl uppercase mt-2">About SoleMart</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
        <div className="space-y-4 text-muted text-[15px] leading-relaxed">
          <p>
            SoleMart started in Karachi with a simple idea: buying shoes online shouldn&apos;t feel like a gamble.
            No fake stock counts, no bait-and-switch sizes — just real pairs, counted honestly, ready to ship.
          </p>
          <p>
            We hand-pick every sneaker, sandal, and street style in our catalogue, and we photograph what we
            actually have in the warehouse — not stock photos from somewhere else.
          </p>
          <p>
            Every order ships Cash on Delivery, nationwide, so you can check your pair before you pay a rupee.
          </p>
        </div>
        <div className="bg-ink rounded-2xl aspect-square flex items-center justify-center">
          <div className="font-display text-4xl text-white text-center px-6">
            SOLE<span className="text-volt">MART</span>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 text-center">
        <div className="bg-surface border border-line rounded-2xl p-6">
          <div className="font-display text-3xl text-volt mb-1">100%</div>
          <div className="text-sm text-muted">Real stock, no ghost listings</div>
        </div>
        <div className="bg-surface border border-line rounded-2xl p-6">
          <div className="font-display text-3xl text-volt mb-1">COD</div>
          <div className="text-sm text-muted">Pay when it arrives, nationwide</div>
        </div>
        <div className="bg-surface border border-line rounded-2xl p-6">
          <div className="font-display text-3xl text-volt mb-1">Karachi</div>
          <div className="text-sm text-muted">Based and shipping since day one</div>
        </div>
      </div>
    </div>
  );
}