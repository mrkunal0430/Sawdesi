"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Check, CreditCard, MapPin, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import type { Address } from "@/types";

type Step = "address" | "payment" | "review";

const steps: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: "address", label: "Delivery Address", icon: MapPin },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "review", label: "Review Order", icon: ClipboardList },
];

export default function CheckoutPage() {
  const { items, subtotal, shippingFee, total, discountAmount, cart } = useCart();
  const [step, setStep] = useState<Step>("address");
  const [savedAddress, setSavedAddress] = useState<Address | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Address>();

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  const onAddressSubmit = (data: Address) => {
    setSavedAddress(data);
    setStep("payment");
  };

  const handlePlaceOrder = () => {
    alert("Order placed! In a real app, Razorpay would open here.");
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
        <h1 className="text-3xl font-bold text-charcoal mb-8" style={{ fontFamily: "var(--font-playfair)" }}>
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
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive ? "bg-saffron text-white" : isDone ? "bg-forest text-white" : "bg-white border border-border text-muted"
                }`}>
                  {isDone ? <Check size={14} /> : <Icon size={14} />}
                  {s.label}
                </div>
                {i < steps.length - 1 && <ChevronRight size={16} className="text-border shrink-0" />}
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === "address" && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleSubmit(onAddressSubmit)} className="bg-white rounded-2xl border border-border p-6 space-y-4">
                    <h2 className="font-bold text-charcoal text-xl mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                      Delivery Address
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        required
                        placeholder="Rahul Sharma"
                        error={errors.name?.message}
                        {...register("name", { required: "Name is required" })}
                      />
                      <Input
                        label="Phone Number"
                        required
                        placeholder="98XXXXXXXX"
                        error={errors.phone?.message}
                        {...register("phone", { required: "Phone is required", minLength: { value: 10, message: "Enter valid phone number" } })}
                      />
                    </div>
                    <Input
                      label="Address Line 1"
                      required
                      placeholder="Flat/House no., Building, Street"
                      error={errors.line1?.message}
                      {...register("line1", { required: "Address is required" })}
                    />
                    <Input
                      label="Address Line 2"
                      placeholder="Area, Locality (optional)"
                      {...register("line2")}
                    />
                    <div className="grid sm:grid-cols-3 gap-4">
                      <Input
                        label="City"
                        required
                        placeholder="Mumbai"
                        error={errors.city?.message}
                        {...register("city", { required: "City is required" })}
                      />
                      <Input
                        label="State"
                        required
                        placeholder="Maharashtra"
                        error={errors.state?.message}
                        {...register("state", { required: "State is required" })}
                      />
                      <Input
                        label="PIN Code"
                        required
                        placeholder="400001"
                        error={errors.pincode?.message}
                        {...register("pincode", { required: "PIN code is required", pattern: { value: /^[1-9][0-9]{5}$/, message: "Invalid PIN code" } })}
                      />
                    </div>
                    <Button type="submit" size="lg" variant="primary" className="w-full mt-2">
                      Continue to Payment
                    </Button>
                  </form>
                </motion.div>
              )}

              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white rounded-2xl border border-border p-6">
                    <h2 className="font-bold text-charcoal text-xl mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                      Payment Method
                    </h2>
                    <div className="space-y-3 mb-6">
                      {["UPI (PhonePe, GPay, Paytm)", "Credit / Debit Card", "Net Banking", "Cash on Delivery"].map((method, i) => (
                        <label key={method} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${i === 0 ? "border-saffron bg-saffron/5" : "border-border hover:border-saffron/40"}`}>
                          <input type="radio" name="payment" defaultChecked={i === 0} className="accent-saffron" />
                          <span className="text-sm font-medium text-charcoal">{method}</span>
                        </label>
                      ))}
                    </div>
                    <div className="bg-cream rounded-xl p-4 mb-6 text-sm text-muted flex items-start gap-2">
                      <span className="text-lg">🔒</span>
                      <span>Payments are securely processed via <strong className="text-charcoal">Razorpay</strong>. Your card details are never stored on our servers.</span>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="ghost" onClick={() => setStep("address")} className="flex-1">Back</Button>
                      <Button variant="primary" onClick={() => setStep("review")} className="flex-1">Review Order</Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === "review" && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white rounded-2xl border border-border p-6">
                    <h2 className="font-bold text-charcoal text-xl mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                      Review Your Order
                    </h2>
                    {savedAddress && (
                      <div className="mb-5 p-4 bg-cream rounded-xl">
                        <p className="text-xs text-muted uppercase font-semibold mb-1">Delivering to</p>
                        <p className="text-sm font-semibold text-charcoal">{savedAddress.name}</p>
                        <p className="text-sm text-muted">{savedAddress.line1}{savedAddress.line2 ? `, ${savedAddress.line2}` : ""}</p>
                        <p className="text-sm text-muted">{savedAddress.city}, {savedAddress.state} — {savedAddress.pincode}</p>
                        <p className="text-sm text-muted">{savedAddress.phone}</p>
                      </div>
                    )}
                    <div className="space-y-3 mb-5">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex justify-between text-sm">
                          <span className="text-charcoal font-medium">{item.product.name} × {item.quantity}</span>
                          <span className="text-charcoal">{formatPrice(item.product.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-6">
                      <Button variant="ghost" onClick={() => setStep("payment")} className="flex-1">Back</Button>
                      <Button variant="primary" onClick={handlePlaceOrder} className="flex-1" size="lg">
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
            <h3 className="font-bold text-charcoal mb-4" style={{ fontFamily: "var(--font-playfair)" }}>Order Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-muted">
                  <span className="line-clamp-1 flex-1 pr-2">{item.product.name} ×{item.quantity}</span>
                  <span className="text-charcoal shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Shipping</span><span className={shippingFee === 0 ? "text-forest" : ""}>{shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-forest">
                  <span>Discount</span><span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base text-charcoal border-t border-border pt-2">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
