export function money(n) {
  return 'Rs. ' + Number(n || 0).toLocaleString('en-PK', { maximumFractionDigits: 0 });
}

export function priceFrom(product) {
  const overrides = (product.product_variants || [])
    .map(v => v.price_override)
    .filter(x => x != null);
  return overrides.length ? Math.min(...overrides) : product.base_price;
}

export function totalStock(product) {
  return (product.product_variants || []).reduce((s, v) => s + v.stock, 0);
}

export function slugify(str) {
  return (
    str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') +
    '-' +
    Math.random().toString(36).slice(2, 6)
  );
}
