"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Minus, Plus, Trash2, Tag, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";

const gradients = ["product-gradient-1", "product-gradient-2", "product-gradient-3", "product-gradient-4", "product-gradient-5", "product-gradient-6"];
const emojis = ["🫙", "🌿", "🍃", "🌱", "✨", "☕"];

export default function CartPage() {
  const { items, subtotal, shippingFee, total, discountAmount, updateQuantity, removeItem, applyCoupon, cart } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  const handleCoupon = () => {
    if (couponInput.toUpperCase() === "FIRST10") {
      applyCoupon("FIRST10", 10);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-cream-dark rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-muted" />
          </div>
          <h2 className="text-2xl font-bold text-charcoal mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
            Your cart is empty
          </h2>
          <p className="text-muted mb-8">Add some natural goodness to get started</p>
          <Button size="lg" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-charcoal font-medium">Cart</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-charcoal mb-8" style={{ fontFamily: "var(--font-playfair)" }}>
          Your Cart ({items.length} {items.length === 1 ? "item" : "items"})
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl border border-border p-5 flex gap-4"
                >
                  <Link href={`/products/${item.product.slug}`} className="shrink-0">
                    <div className={`w-20 h-20 rounded-xl ${gradients[i % gradients.length]} flex items-center justify-center`}>
                      <span className="text-3xl">{emojis[i % emojis.length]}</span>
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <Link href={`/products/${item.product.slug}`}>
                        <h3 className="font-bold text-charcoal hover:text-saffron-dark transition-colors" style={{ fontFamily: "var(--font-playfair)" }}>
                          {item.product.name}
                        </h3>
                      </Link>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-muted hover:text-red-500 transition-colors shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {item.product.weight && (
                      <p className="text-xs text-muted mb-3">{item.product.weight}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border rounded-xl overflow-hidden bg-cream">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-cream-dark transition-colors"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-cream-dark transition-colors"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="font-bold text-charcoal">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-forest-dark transition-colors mt-2">
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-bold text-charcoal text-lg mb-5" style={{ fontFamily: "var(--font-playfair)" }}>
                Order Summary
              </h2>

              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span className="text-charcoal font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Shipping</span>
                  <span className={shippingFee === 0 ? "text-forest font-medium" : "text-charcoal font-medium"}>
                    {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-forest">
                    <span>Discount ({cart.couponCode})</span>
                    <span className="font-medium">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                {shippingFee > 0 && (
                  <p className="text-xs text-saffron-dark bg-saffron/8 rounded-lg px-3 py-2">
                    Add {formatPrice(499 - subtotal)} more for free shipping!
                  </p>
                )}
              </div>

              {/* Coupon */}
              {!cart.couponCode && (
                <div className="mb-5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                      <input
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                        placeholder="Coupon code"
                        className="w-full h-10 border border-border rounded-xl pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron"
                      />
                    </div>
                    <Button size="sm" variant="ghost" onClick={handleCoupon}>Apply</Button>
                  </div>
                  {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                </div>
              )}
              {cart.couponCode && (
                <div className="mb-5 flex items-center gap-2 bg-forest/8 text-forest text-sm px-3 py-2 rounded-lg">
                  <Tag size={13} />
                  <span>Code <strong>{cart.couponCode}</strong> applied!</span>
                </div>
              )}

              <div className="border-t border-border pt-4 mb-5">
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-charcoal">Total</span>
                  <span className="text-charcoal">{formatPrice(total)}</span>
                </div>
              </div>

              <Button size="lg" variant="primary" className="w-full gap-2" asChild>
                <Link href="/checkout">
                  Proceed to Checkout <ArrowRight size={18} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
