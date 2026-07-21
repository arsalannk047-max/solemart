export const metadata = {
  title: 'Size Guide — SoleMart',
};

const ROWS = [
  { uk: '5', eu: '38', us: '6', cm: '24' },
  { uk: '6', eu: '39', us: '7', cm: '25' },
  { uk: '7', eu: '40', us: '8', cm: '26' },
  { uk: '8', eu: '41', us: '9', cm: '27' },
  { uk: '9', eu: '42', us: '10', cm: '28' },
  { uk: '10', eu: '43', us: '11', cm: '29' },
  { uk: '11', eu: '44', us: '12', cm: '30' },
  { uk: '12', eu: '45', us: '13', cm: '31' },
];

export default function SizeGuidePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <div className="font-mono text-crimson text-xs tracking-widest uppercase font-bold">Find your fit</div>
        <h1 className="font-display text-5xl uppercase mt-2">Size Guide</h1>
        <p className="text-muted mt-3">Not sure which size to pick? Use the chart below, or measure your foot at home.</p>
      </div>

      <div className="bg-surface border border-line rounded-2xl overflow-hidden mb-10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-ink text-white text-left">
              <th className="px-4 py-3 font-mono uppercase text-xs tracking-wide">UK</th>
              <th className="px-4 py-3 font-mono uppercase text-xs tracking-wide">EU</th>
              <th className="px-4 py-3 font-mono uppercase text-xs tracking-wide">US</th>
              <th className="px-4 py-3 font-mono uppercase text-xs tracking-wide">Foot length (cm)</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.uk} className={i % 2 === 0 ? 'bg-surface' : 'bg-surfacealt'}>
                <td className="px-4 py-3 font-mono font-bold">{r.uk}</td>
                <td className="px-4 py-3 font-mono">{r.eu}</td>
                <td className="px-4 py-3 font-mono">{r.us}</td>
                <td className="px-4 py-3 font-mono">{r.cm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-surface border border-line rounded-2xl p-6">
        <h2 className="font-display text-xl uppercase mb-3">How to measure at home</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted">
          <li>Place a sheet of paper on the floor against a wall.</li>
          <li>Stand on it with your heel touching the wall.</li>
          <li>Mark the tip of your longest toe, then measure the distance in centimeters.</li>
          <li>Match your measurement to the &quot;Foot length&quot; column above for your size.</li>
        </ol>
        <p className="text-xs text-muted mt-4">
          Still unsure? <a href="/contact" className="text-crimson font-semibold hover:underline">Contact us</a> and we&apos;ll help you pick the right fit.
        </p>
      </div>
    </div>
  );
}