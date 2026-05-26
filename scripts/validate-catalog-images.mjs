import fs from 'node:fs';
import path from 'node:path';

const apiUrl = process.env.VITE_API_URL ?? 'http://127.0.0.1:8000';
const catalogDir = path.resolve('public/static/catalog');
const localFiles = new Set(fs.readdirSync(catalogDir).filter((f) => /\.jpe?g$/i.test(f)));

const toCatalogFilename = (imageUrl) => {
  if (!imageUrl) return null;
  const trimmed = imageUrl.trim();
  const withoutHost = trimmed.replace(/^https?:\/\/[^/]+/i, '');
  const normalized = withoutHost.startsWith('/') ? withoutHost : `/${withoutHost}`;
  const match = normalized.match(/\/static\/catalog\/([^/?#]+)$/i);
  return match?.[1] ?? null;
};

const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/products?lang=en`);
if (!res.ok) {
  console.error(`API error: ${res.status} ${res.statusText}`);
  process.exit(1);
}

const products = await res.json();
const missing = [];
const formats = new Set();

for (const product of products) {
  formats.add(product.image_url ?? '(null)');
  const file = toCatalogFilename(product.image_url);
  if (!file) {
    missing.push({ id: product.id, name: product.name, reason: 'unrecognized path', image_url: product.image_url });
    continue;
  }
  if (!localFiles.has(file)) {
    missing.push({ id: product.id, name: product.name, reason: 'file not in public/static/catalog', file, image_url: product.image_url });
  }
}

console.log(`Products: ${products.length}`);
console.log(`Local catalog files: ${localFiles.size} (ds2: ${[...localFiles].filter((f) => f.startsWith('ds2-')).length})`);
console.log(`Unique image_url values: ${formats.size}`);
console.log(`Sample URLs:\n${[...formats].slice(0, 5).map((u) => `  ${u}`).join('\n')}`);

if (missing.length) {
  console.error(`\nMissing / invalid images: ${missing.length}`);
  for (const row of missing.slice(0, 20)) {
    console.error(`  #${row.id} ${row.name}: ${row.reason}${row.file ? ` (${row.file})` : ''} — ${row.image_url}`);
  }
  process.exit(1);
}

console.log('\nAll product images resolve to files in public/static/catalog.');
