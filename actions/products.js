'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { adminClient } from '@/lib/supabase/adminClient';
import { requireAdmin } from '@/lib/requireAdmin';
import { slugify } from '@/lib/format';

const BUCKET = 'product-images';

async function uploadImages(db, files) {
  const urls = [];
  for (const file of files) {
    if (!file || typeof file === 'string' || file.size === 0) continue;
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `products/${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await db.storage.from(BUCKET).upload(path, buffer, { contentType: file.type, upsert: false });
    if (error) throw error;
    const { data } = db.storage.from(BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

function buildVariants(formData, productId) {
  const sizes = formData.getAll('variant_size');
  const colors = formData.getAll('variant_color');
  const stocks = formData.getAll('variant_stock');
  const skus = formData.getAll('variant_sku');
  const overrides = formData.getAll('variant_price_override');

  return sizes
    .map((size, i) => ({
      product_id: productId,
      size,
      color: colors[i] || null,
      sku: skus[i] || null,
      stock: parseInt(stocks[i], 10) || 0,
      price_override: overrides[i] ? parseFloat(overrides[i]) : null
    }))
    .filter(v => v.size && v.size.trim());
}

export async function createProductAction(formData) {
  await requireAdmin();
  const db = adminClient();

  const imageUrls = await uploadImages(db, formData.getAll('images'));

  const { data: product, error } = await db
    .from('products')
    .insert({
      name: formData.get('name'),
      slug: slugify(formData.get('name')),
      brand: formData.get('brand') || null,
      description: formData.get('description') || null,
      category_id: formData.get('category_id') || null,
      base_price: parseFloat(formData.get('base_price')),
      compare_at_price: formData.get('compare_at_price') ? parseFloat(formData.get('compare_at_price')) : null,
      images: imageUrls,
      is_active: true
    })
    .select()
    .single();
  if (error) throw error;

  const variants = buildVariants(formData, product.id);
  if (variants.length) {
    const { error: vErr } = await db.from('product_variants').insert(variants);
    if (vErr) throw vErr;
  }

  revalidatePath('/admin/products');
  revalidatePath('/shop');
  redirect('/admin/products');
}

export async function updateProductAction(productId, formData) {
  await requireAdmin();
  const db = adminClient();

  const { data: existing } = await db.from('products').select('images').eq('id', productId).single();
  let imageUrls = existing ? existing.images || [] : [];
  const newFiles = formData.getAll('images').filter(f => f && typeof f !== 'string' && f.size > 0);
  if (newFiles.length) {
    const newUrls = await uploadImages(db, newFiles);
    imageUrls = imageUrls.concat(newUrls);
  }

  const { error } = await db
    .from('products')
    .update({
      name: formData.get('name'),
      brand: formData.get('brand') || null,
      description: formData.get('description') || null,
      category_id: formData.get('category_id') || null,
      base_price: parseFloat(formData.get('base_price')),
      compare_at_price: formData.get('compare_at_price') ? parseFloat(formData.get('compare_at_price')) : null,
      images: imageUrls,
      is_active: formData.get('is_active') === 'on',
      updated_at: new Date().toISOString()
    })
    .eq('id', productId);
  if (error) throw error;

  await db.from('product_variants').delete().eq('product_id', productId);
  const variants = buildVariants(formData, productId);
  if (variants.length) {
    const { error: vErr } = await db.from('product_variants').insert(variants);
    if (vErr) throw vErr;
  }

  revalidatePath('/admin/products');
  revalidatePath('/shop');
  redirect('/admin/products');
}

export async function deleteProductAction(productId) {
  await requireAdmin();
  const db = adminClient();
  await db.from('product_variants').delete().eq('product_id', productId);
  await db.from('products').delete().eq('id', productId);
  revalidatePath('/admin/products');
  revalidatePath('/shop');
}

export async function removeProductImageAction(productId, imageUrl) {
  await requireAdmin();
  const db = adminClient();
  const { data: product } = await db.from('products').select('images').eq('id', productId).single();
  const updated = (product.images || []).filter(img => img !== imageUrl);
  await db.from('products').update({ images: updated }).eq('id', productId);
  revalidatePath(`/admin/products/${productId}/edit`);
}
