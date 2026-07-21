import { NextResponse } from 'next/server';
import { adminClient } from '@/lib/supabase/adminClient';

export async function POST(request) {
  const { ids } = await request.json();
  if (!ids || ids.length === 0) return NextResponse.json({ products: [] });

  const db = adminClient();
  const { data: products } = await db
    .from('products')
    .select('*, product_variants(*)')
    .in('id', ids)
    .eq('is_active', true);

  return NextResponse.json({ products: products || [] });
}