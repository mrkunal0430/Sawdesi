"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Check,
  CreditCard,
  MapPin,
  ClipboardList,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AddressCard } from "@/components/account/AddressCard";
import { AddressForm, type AddressFormData } from "@/components/account/AddressForm";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Address, OrderAddress } from "@/types";

type Step = "address" | "payment" | "review";

const steps: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: "address", label: "Delivery Address", icon: MapPin },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "review", label: "Review Order", icon: ClipboardList },
];

function mapRow(row: Record<string, unknown>): Address {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    fullName: row.full_name as string,
    phone: row.phone as string,
    houseNumber: row.house_number as string,
    street: row.street as string,
    landmark: (row.landmark as string) ?? undefined,
    city: row.city as string,
    state: row.state as string,
    country: row.country as string,
    pincode: row.pincode as string,
    isDefault: row.is_default as boolean,
    createdAt: row.created_at as string,
  };
}

export default function CheckoutPage() {
  const { items, subtotal, shippingFee, total, discountAmount, cart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>("address");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("UPI");

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  const fetchAddresses = useCallback(async () => {
    if (!user) return;
    setIsLoadingAddresses(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: true });

    if (data) {
      const mapped = data.map(mapRow);
      setAddresses(mapped);
      // Auto-select default or first
      const def = mapped.find((a) => a.isDefault) ?? mapped[0];
      if (def) setSelectedAddress(def);
      // Auto-show form if no addresses
      if (mapped.length === 0) setShowAddForm(true);
    }
    setIsLoadingAddresses(false);
  }, [user]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleAddAddress = async (data: AddressFormData) => {
    if (!user) return;
    setIsSubmittingAddress(true);
    const supabase = createClient();
    const { data: inserted, error } = await supabase
      .from("addresses")
      .insert({
        user_id: user.id,
        full_name: data.fullName,
        phone: data.phone,
        house_number: data.houseNumber,
        street: data.street,
        landmark: data.landmark ?? null,
        city: data.city,
        state: data.state,
        country: data.country,
        pincode: data.pincode,
        is_default: data.isDefault,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to save address.");
    } else if (inserted) {
      const mapped = mapRow(inserted as Record<string, unknown>);
      setSelectedAddress(mapped);
      setShowAddForm(false);
      await fetchAddresses();
    }
    setIsSubmittingAddress(false);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !user) return;
    setIsPlacingOrder(true);

    const supabase = createClient();
    const orderNumber = `SWD-${Date.now().toString().slice(-8)}`;

    const shippingSnapshot: OrderAddress = {
      fullName: selectedAddress.fullName,
      phone: selectedAddress.phone,
      houseNumber: selectedAddress.houseNumber,
      street: selectedAddress.street,
      landmark: selectedAddress.landmark,
      city: selectedAddress.city,
      state: selectedAddress.state,
      country: selectedAddress.country,
      pincode: selectedAddress.pincode,
    };

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        shipping_address: shippingSnapshot,
        subtotal,
        shipping_fee: shippingFee,
        discount: discountAmount,
        total,
        status: "pending",
        coupon_code: cart.couponCode ?? null,
      })
      .select()
      .single();

    if (orderError || !order) {
      toast.error("Failed to place order. Please try again.");
      setIsPlacingOrder(false);
      return;
    }

    // Insert order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      image: item.product.images?.[0] ?? null,
    }));

    await supabase.from("order_items").insert(orderItems);
    await clearCart();

    toast.success(`Order ${orderNumber} placed successfully! 🎉`);
    router.push(`/account/orders`);
    setIsPlacingOrder(false);
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/cart" className="hover:text-charcoal transition-colors">Cart</Link>
          <ChevronRight size={14} />
          <span className="text-charcoal font-medium">Checkout</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1
          className="text-3xl font-bold text-charcoal mb-8"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Checkout
        </h1>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isDone = currentStepIndex > i;
            const isActive = currentStepIndex === i;
            return (
              <div key={s.id} className="flex items-center gap-3 shrink-0">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-saffron text-white"
                      : isDone
                      ? "bg-forest text-white"
                      : "bg-white border border-border text-muted"
                  }`}
                >
                  {isDone ? <Check size={14} /> : <Icon size={14} />}
                  {s.label}
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight size={16} className="text-border shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Address Step */}
              {step === "address" && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-2xl border border-border p-6"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h2
                      className="font-bold text-charcoal text-xl"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      Delivery Address
                    </h2>
                    {!showAddForm && addresses.length > 0 && (
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-1.5 text-sm text-forest font-medium hover:text-forest-dark transition-colors"
                      >
                        <Plus size={14} />
                        Add New
                      </button>
                    )}
                  </div>

                  {isLoadingAddresses ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 size={24} className="animate-spin text-muted" />
                    </div>
                  ) : (
                    <>
                      {/* Existing addresses */}
                      {!showAddForm && addresses.length > 0 && (
                        <div className="space-y-3 mb-5">
                          {addresses.map((address) => (
                            <AddressCard
                              key={address.id}
                              address={address}
                              selectable
                              selected={selectedAddress?.id === address.id}
                              onSelect={setSelectedAddress}
                            />
                          ))}
                        </div>
                      )}

                      {/* Add new address form */}
                      <AnimatePresence>
                        {showAddForm && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-border pt-5 mt-2">
                              <h3 className="font-semibold text-charcoal mb-4">
                                {addresses.length === 0
                                  ? "Add Delivery Address"
                                  : "Add New Address"}
                              </h3>
                              <AddressForm
                                onSubmit={handleAddAddress}
                                onCancel={
                                  addresses.length > 0
                                    ? () => setShowAddForm(false)
                                    : undefined
                                }
                                isLoading={isSubmittingAddress}
                                submitLabel="Save & Continue"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {!showAddForm && selectedAddress && (
                        <Button
                          onClick={() => setStep("payment")}
                          size="lg"
                          variant="primary"
                          className="w-full mt-4"
                        >
                          Continue to Payment
                        </Button>
                      )}
                    </>
                  )}
                </motion.div>
              )}

              {/* Payment Step */}
              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="bg-white rounded-2xl border border-border p-6">
                    <h2
                      className="font-bold text-charcoal text-xl mb-6"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      Payment Method
                    </h2>
                    <div className="space-y-3 mb-6">
                      {[
                        "UPI (PhonePe, GPay, Paytm)",
                        "Credit / Debit Card",
                        "Net Banking",
                        "Cash on Delivery",
                      ].map((method) => (
                        <label
                          key={method}
                          className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                            selectedPayment === method
                              ? "border-saffron bg-saffron/5"
                              : "border-border hover:border-saffron/40"
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            checked={selectedPayment === method}
                            onChange={() => setSelectedPayment(method)}
                            className="accent-saffron"
                          />
                          <span className="text-sm font-medium text-charcoal">
                            {method}
                          </span>
                        </label>
                      ))}
                    </div>
                    <div className="bg-cream rounded-xl p-4 mb-6 text-sm text-muted flex items-start gap-2">
                      <span className="text-lg">🔒</span>
                      <span>
                        Payments are securely processed via{" "}
                        <strong className="text-charcoal">Razorpay</strong>.
                        Your card details are never stored on our servers.
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="ghost"
                        onClick={() => setStep("address")}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => setStep("review")}
                        className="flex-1"
                      >
                        Review Order
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Review Step */}
              {step === "review" && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="bg-white rounded-2xl border border-border p-6">
                    <h2
                      className="font-bold text-charcoal text-xl mb-6"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      Review Your Order
                    </h2>

                    {selectedAddress && (
                      <div className="mb-5 p-4 bg-cream rounded-xl">
                        <p className="text-xs text-muted uppercase font-semibold mb-2">
                          Delivering to
                        </p>
                        <p className="text-sm font-semibold text-charcoal">
                          {selectedAddress.fullName}
                        </p>
                        <p className="text-sm text-muted">
                          {selectedAddress.houseNumber}, {selectedAddress.street}
                          {selectedAddress.landmark
                            ? `, ${selectedAddress.landmark}`
                            : ""}
                        </p>
                        <p className="text-sm text-muted">
                          {selectedAddress.city}, {selectedAddress.state} —{" "}
                          {selectedAddress.pincode}
                        </p>
                        <p className="text-sm text-muted">
                          +91 {selectedAddress.phone}
                        </p>
                      </div>
                    )}

                    <div className="space-y-3 mb-5">
                      {items.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-charcoal font-medium">
                            {item.product.name} × {item.quantity}
                          </span>
                          <span className="text-charcoal">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button
                        variant="ghost"
                        onClick={() => setStep("payment")}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handlePlaceOrder}
                        className="flex-1"
                        size="lg"
                        loading={isPlacingOrder}
                      >
                        Place Order · {formatPrice(total)}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary sidebar */}
          <div className="bg-white rounded-2xl border border-border p-6 h-fit">
            <h3
              className="font-bold text-charcoal mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Order Summary
            </h3>
            <div className="space-y-2 text-sm mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-muted">
                  <span className="line-clamp-1 flex-1 pr-2">
                    {item.product.name} ×{item.quantity}
                  </span>
                  <span className="text-charcoal shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Shipping</span>
                <span className={shippingFee === 0 ? "text-forest" : ""}>
                  {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-forest">
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base text-charcoal border-t border-border pt-2">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
