"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { CartItem, Product } from "@/types";
import { toast } from "sonner";

interface LocalCartState {
  items: CartItem[];
  couponCode?: string;
  discount?: number;
}

const LOCAL_CART_KEY = "sawdesi-cart";
const INITIAL_CART: LocalCartState = { items: [] };

function readLocalCart(): LocalCartState {
  try {
    const stored = localStorage.getItem(LOCAL_CART_KEY);
    return stored ? JSON.parse(stored) : INITIAL_CART;
  } catch {
    return INITIAL_CART;
  }
}

function writeLocalCart(cart: LocalCartState) {
  try {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
  } catch {
    // ignore
  }
}

function clearLocalCart() {
  try {
    localStorage.removeItem(LOCAL_CART_KEY);
  } catch {
    // ignore
  }
}

export function useCart() {
  const { user, isAuthenticated, isLoading: authLoading, openLoginModal } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | undefined>();
  const [discount, setDiscount] = useState<number | undefined>();
  const [isCartLoading, setIsCartLoading] = useState(true);
  const hasMergedRef = useRef(false);

  const supabase = createClient();

  // ── Server cart helpers ──────────────────────────────────────
  const getOrCreateCart = useCallback(async (userId: string) => {
    const { data: existing } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (existing) return existing.id as string;

    const { data: created } = await supabase
      .from("carts")
      .insert({ user_id: userId })
      .select("id")
      .single();

    return (created?.id as string) ?? null;
  }, [supabase]);

  const fetchServerCart = useCallback(async (userId: string) => {
    const { data: cartRow } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (!cartRow) return [];

    const { data: cartItems } = await supabase
      .from("cart_items")
      .select("*, product:products(*)")
      .eq("cart_id", cartRow.id);

    if (!cartItems) return [];

    return cartItems
      .filter((ci) => ci.product)
      .map((ci) => ({
        product: {
          id: ci.product.id,
          slug: ci.product.slug,
          name: ci.product.name,
          shortDescription: ci.product.short_description,
          description: ci.product.description,
          ingredients: ci.product.ingredients,
          howToUse: ci.product.how_to_use,
          price: ci.product.price,
          originalPrice: ci.product.original_price,
          discount: ci.product.discount,
          category: ci.product.category,
          tags: ci.product.tags,
          images: ci.product.images,
          rating: ci.product.rating,
          reviewCount: ci.product.review_count,
          stockQuantity: ci.product.stock_quantity,
          lowStockThreshold: ci.product.low_stock_threshold,
          featured: ci.product.featured,
          weight: ci.product.weight,
          createdAt: ci.product.created_at,
          updatedAt: ci.product.updated_at,
        } as Product,
        quantity: ci.quantity as number,
      })) as CartItem[];
  }, [supabase]);

  // ── Merge local cart into server cart on login ───────────────
  const mergeLocalIntoServer = useCallback(
    async (userId: string) => {
      const localCart = readLocalCart();
      if (localCart.items.length === 0) return;

      const cartId = await getOrCreateCart(userId);
      if (!cartId) return;

      for (const item of localCart.items) {
        const { data: existing } = await supabase
          .from("cart_items")
          .select("id, quantity")
          .eq("cart_id", cartId)
          .eq("product_id", item.product.id)
          .single();

        if (existing) {
          await supabase
            .from("cart_items")
            .update({ quantity: existing.quantity + item.quantity })
            .eq("id", existing.id);
        } else {
          await supabase.from("cart_items").insert({
            cart_id: cartId,
            product_id: item.product.id,
            quantity: item.quantity,
          });
        }
      }

      clearLocalCart();
      if (localCart.couponCode) {
        setCouponCode(localCart.couponCode);
        setDiscount(localCart.discount);
      }
    },
    [getOrCreateCart, supabase]
  );

  // ── Initialize cart ──────────────────────────────────────────
  useEffect(() => {
    if (authLoading) return;

    const init = async () => {
      setIsCartLoading(true);

      if (isAuthenticated && user) {
        // Merge local cart once after login
        if (!hasMergedRef.current) {
          hasMergedRef.current = true;
          await mergeLocalIntoServer(user.id);
        }
        const serverItems = await fetchServerCart(user.id);
        setItems(serverItems);
      } else {
        // Guest: use localStorage
        hasMergedRef.current = false;
        const localCart = readLocalCart();
        setItems(localCart.items);
        setCouponCode(localCart.couponCode);
        setDiscount(localCart.discount);
      }

      setIsCartLoading(false);
    };

    init();
  }, [isAuthenticated, user, authLoading, fetchServerCart, mergeLocalIntoServer]);

  // ── Add Item ─────────────────────────────────────────────────
  const addItem = useCallback(
    async (product: Product, quantity = 1) => {
      if (!isAuthenticated) {
        // Gate: require login
        openLoginModal(async () => {
          // After login, addItem will be re-callable
          toast.info("You're logged in! Please add the item again.");
        });
        return;
      }

      if (!user) return;

      // Optimistic update
      setItems((prev) => {
        const existing = prev.find((i) => i.product.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, { product, quantity }];
      });

      toast.success(`${product.name} added to cart`);

      const cartId = await getOrCreateCart(user.id);
      if (!cartId) return;

      const { data: existing } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("cart_id", cartId)
        .eq("product_id", product.id)
        .single();

      if (existing) {
        await supabase
          .from("cart_items")
          .update({ quantity: existing.quantity + quantity })
          .eq("id", existing.id);
      } else {
        await supabase.from("cart_items").insert({
          cart_id: cartId,
          product_id: product.id,
          quantity,
        });
      }
    },
    [isAuthenticated, user, openLoginModal, getOrCreateCart, supabase]
  );

  // ── Remove Item ──────────────────────────────────────────────
  const removeItem = useCallback(
    async (productId: string) => {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));

      if (!isAuthenticated || !user) {
        const local = readLocalCart();
        const updated = {
          ...local,
          items: local.items.filter((i) => i.product.id !== productId),
        };
        writeLocalCart(updated);
        return;
      }

      const { data: cartRow } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (cartRow) {
        await supabase
          .from("cart_items")
          .delete()
          .eq("cart_id", cartRow.id)
          .eq("product_id", productId);
      }
    },
    [isAuthenticated, user, supabase]
  );

  // ── Update Quantity ──────────────────────────────────────────
  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity <= 0) {
        await removeItem(productId);
        return;
      }

      setItems((prev) =>
        prev.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i
        )
      );

      if (!isAuthenticated || !user) {
        const local = readLocalCart();
        const updated = {
          ...local,
          items: local.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        };
        writeLocalCart(updated);
        return;
      }

      const { data: cartRow } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (cartRow) {
        await supabase
          .from("cart_items")
          .update({ quantity })
          .eq("cart_id", cartRow.id)
          .eq("product_id", productId);
      }
    },
    [isAuthenticated, user, removeItem, supabase]
  );

  // ── Clear Cart ───────────────────────────────────────────────
  const clearCart = useCallback(async () => {
    setItems([]);
    setCouponCode(undefined);
    setDiscount(undefined);

    if (!isAuthenticated || !user) {
      clearLocalCart();
      return;
    }

    const { data: cartRow } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (cartRow) {
      await supabase.from("cart_items").delete().eq("cart_id", cartRow.id);
    }
  }, [isAuthenticated, user, supabase]);

  // ── Coupon ───────────────────────────────────────────────────
  const applyCoupon = useCallback((code: string, discountPct: number) => {
    setCouponCode(code);
    setDiscount(discountPct);
    if (!isAuthenticated) {
      const local = readLocalCart();
      writeLocalCart({ ...local, couponCode: code, discount: discountPct });
    }
  }, [isAuthenticated]);

  const removeCoupon = useCallback(() => {
    setCouponCode(undefined);
    setDiscount(undefined);
    if (!isAuthenticated) {
      const local = readLocalCart();
      const { couponCode: _c, discount: _d, ...rest } = local;
      void _c; void _d;
      writeLocalCart(rest as LocalCartState);
    }
  }, [isAuthenticated]);

  // ── Computed values ──────────────────────────────────────────
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = subtotal >= 499 ? 0 : 49;
  const discountAmount = discount
    ? Math.round((subtotal * discount) / 100)
    : 0;
  const total = subtotal + shippingFee - discountAmount;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    itemCount,
    subtotal,
    shippingFee,
    discountAmount,
    total,
    couponCode,
    isCartLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    cart: { items, couponCode, discount },
  };
}
