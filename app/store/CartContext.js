"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "nk-store-cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const stored = raw ? JSON.parse(raw) : [];
      if (Array.isArray(stored)) setItems(stored);
    } catch {
      // A corrupt or blocked local store should never stop someone from shopping.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Keep the in-memory cart usable when storage is unavailable.
    }
  }, [items, hydrated]);

  function addItem({ id, name, price, currency, size, qty = 1 }) {
    setItems((prev) => {
      const key = `${id}::${size || "onesize"}`;
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) => item.key === key ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, { key, id, name, price, currency, size, qty }];
    });
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((item) => item.key !== key));
  }

  function updateQty(key, qty) {
    setItems((prev) => prev.map((item) => (
      item.key === key ? { ...item, qty: Math.max(1, Number(qty) || 1) } : item
    )));
  }

  function clear() {
    setItems([]);
  }

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQty, clear }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
