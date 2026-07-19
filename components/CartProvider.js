'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'solemart_cart';

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart, loaded]);

  function addItem(item) {
    setCart(prev => {
      const existing = prev.find(i => i.variant_id === item.variant_id);
      if (existing) {
        return prev.map(i =>
          i.variant_id === item.variant_id
            ? { ...i, qty: Math.min(i.qty + item.qty, i.stock) }
            : i
        );
      }
      return [...prev, item];
    });
  }

  function updateQty(variantId, qty) {
    setCart(prev => {
      if (qty <= 0) return prev.filter(i => i.variant_id !== variantId);
      return prev.map(i => (i.variant_id === variantId ? { ...i, qty: Math.min(qty, i.stock) } : i));
    });
  }

  function removeItem(variantId) {
    setCart(prev => prev.filter(i => i.variant_id !== variantId));
  }

  function clearCart() {
    setCart([]);
  }

  const count = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = cart.length === 0 || subtotal > 5000 ? 0 : 250;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{ cart, addItem, updateQty, removeItem, clearCart, count, subtotal, shipping, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
