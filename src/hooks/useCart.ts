"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { CartItem, Product } from "@/types";
import { toast } from "sonner";

interface CartState {
  items: CartItem[];
  couponCode?: string;
  discount?: number;
}

const INITIAL_CART: CartState = { items: [] };

export function useCart() {
  const [cart, setCart] = useLocalStorage<CartState>("sawdesi-cart", INITIAL_CART);

  const addItem = useCallback(
    (product: Product, quantity = 1) => {
      setCart((prev) => {
        const existing = prev.items.find((i) => i.product.id === product.id);
        if (existing) {
          return {
            ...prev,
            items: prev.items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          };
        }
        return { ...prev, items: [...prev.items, { product, quantity }] };
      });
      toast.success(`${product.name} added to cart`);
    },
    [setCart]
  );

  const removeItem = useCallback(
    (productId: string) => {
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i.product.id !== productId),
      }));
    },
    [setCart]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        setCart((prev) => ({
          ...prev,
          items: prev.items.filter((i) => i.product.id !== productId),
        }));
        return;
      }
      setCart((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i
        ),
      }));
    },
    [setCart]
  );

  const clearCart = useCallback(() => {
    setCart(INITIAL_CART);
  }, [setCart]);

  const applyCoupon = useCallback(
    (code: string, discount: number) => {
      setCart((prev) => ({ ...prev, couponCode: code, discount }));
    },
    [setCart]
  );

  const removeCoupon = useCallback(() => {
    setCart((prev) => {
      const { couponCode: _, discount: __, ...rest } = prev;
      return rest as CartState;
    });
  }, [setCart]);

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = subtotal >= 499 ? 0 : 49;
  const discountAmount = cart.discount
    ? Math.round((subtotal * cart.discount) / 100)
    : 0;
  const total = subtotal + shippingFee - discountAmount;
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    items: cart.items,
    itemCount,
    subtotal,
    shippingFee,
    discountAmount,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
  };
}
