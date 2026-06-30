"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  MapPin,
  ChevronRight,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  XCircle,
  RotateCcw,
  ArrowLeft,
  Phone,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { Order, OrderItem } from "@/types";

interface TrackingStep {
  status: string;
  label: string;
  description: string;
  icon: React.ElementType;
  variant: "success" | "saffron" | "warning" | "default";
}

const TRACKING_STEPS: TrackingStep[] = [
  {
    status: "pending",
    label: "Order Placed",
    description: "Your order has been received and is awaiting confirmation.",
    icon: Clock,
    variant: "warning",
  },
  {
    status: "confirmed",
    label: "Confirmed",
    description: "Your order has been confirmed and is being prepared.",
    icon: CheckCircle2,
    variant: "warning",
  },
  {
    status: "processing",
    label: "Processing",
    description: "Your items are being packed and prepared for shipment.",
    icon: Package,
    variant: "warning",
  },
  {
    status: "shipped",
    label: "Shipped",
    description: "Your order is on its way! Our delivery partner has picked it up.",
    icon: Truck,
    variant: "saffron",
  },
  {
    status: "delivered",
    label: "Delivered",
    description: "Your order has been delivered. Enjoy your Sawdesi products!",
    icon: PackageCheck,
    variant: "success",
  },
];

const STATUS_ORDER = ["pending", "confirmed", "processing", "shipped", "delivered"];

const statusVariant: Record<string, "success" | "saffron" | "warning" | "default"> = {
  delivered: "success",
  shipped: "saffron",
  processing: "warning",
  confirmed: "warning",
  pending: "default",
  cancelled: "default",
  refunded: "default",
};

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      const supabase = createClient();

      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (!orderData) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      const { data: itemsData } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

      setOrder({
        id: orderData.id,
        orderNumber: orderData.order_number,
        userId: orderData.user_id,
        shippingAddress: orderData.shipping_address,
        subtotal: orderData.subtotal,
        shippingFee: orderData.shipping_fee,
        discount: orderData.discount,
        total: orderData.total,
        status: orderData.status,
        paymentId: orderData.payment_id,
        couponCode: orderData.coupon_code,
        notes: orderData.notes,
        createdAt: orderData.created_at,
        updatedAt: orderData.updated_at,
      });

      setOrderItems(
        (itemsData ?? []).map((i) => ({
          id: i.id,
          orderId: i.order_id,
          productId: i.product_id,
          productName: i.product_name,
          quantity: i.quantity,
          price: i.price,
          image: i.image,
        }))
      );

      setIsLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={32} className="animate-spin text-muted" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="bg-white rounded-2xl border border-border p-10 text-center">
        <XCircle size={36} className="text-muted mx-auto mb-3" />
        <p className="font-semibold text-charcoal mb-1">Order not found</p>
        <p className="text-sm text-muted mb-5">
          This order doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <Link
          href="/account/orders"
          className="text-sm font-semibold text-forest hover:text-forest-dark transition-colors"
        >
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const isCancelled = order.status === "cancelled";
  const isRefunded = order.status === "refunded";
  const isTerminated = isCancelled || isRefunded;

  const currentStepIndex = STATUS_ORDER.indexOf(order.status);
  const shippingAddress = order.shippingAddress;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-border p-5">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-charcoal transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Back to Orders
        </button>

        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h2
              className="text-xl font-bold text-charcoal"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {order.orderNumber}
            </h2>
            <p className="text-sm text-muted mt-0.5">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <Badge variant={statusVariant[order.status] ?? "default"}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Tracking Timeline */}
      {!isTerminated ? (
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3
            className="font-bold text-charcoal mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Order Tracking
          </h3>

          <div className="space-y-0">
            {TRACKING_STEPS.map((trackStep, index) => {
              const isDone = currentStepIndex > index;
              const isCurrent = currentStepIndex === index;
              const isUpcoming = currentStepIndex < index;
              const Icon = trackStep.icon;
              const isLast = index === TRACKING_STEPS.length - 1;

              return (
                <div key={trackStep.status} className="flex gap-4">
                  {/* Icon + connector */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isCurrent ? [1, 1.1, 1] : 1,
                      }}
                      transition={{ duration: 0.5, repeat: isCurrent ? Infinity : 0, repeatDelay: 2 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                        isDone
                          ? "bg-forest border-forest text-cream"
                          : isCurrent
                          ? "bg-saffron border-saffron text-white"
                          : "bg-cream-dark border-border text-muted"
                      }`}
                    >
                      <Icon size={16} />
                    </motion.div>
                    {!isLast && (
                      <div
                        className={`w-0.5 flex-1 min-h-[32px] mt-1 mb-1 rounded-full transition-colors ${
                          isDone ? "bg-forest" : "bg-border"
                        }`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`pb-6 min-w-0 ${isLast ? "" : ""}`}>
                    <p
                      className={`font-semibold text-sm ${
                        isDone
                          ? "text-forest"
                          : isCurrent
                          ? "text-saffron-dark"
                          : "text-muted"
                      }`}
                    >
                      {trackStep.label}
                      {isCurrent && (
                        <span className="ml-2 text-xs font-normal bg-saffron/10 text-saffron-dark px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </p>
                    <p
                      className={`text-xs mt-0.5 leading-relaxed ${
                        isUpcoming ? "text-muted/60" : "text-muted"
                      }`}
                    >
                      {trackStep.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3">
            {isCancelled ? (
              <XCircle size={28} className="text-red-500" />
            ) : (
              <RotateCcw size={28} className="text-saffron-dark" />
            )}
            <div>
              <p className="font-semibold text-charcoal">
                Order {isCancelled ? "Cancelled" : "Refunded"}
              </p>
              <p className="text-sm text-muted">
                {isCancelled
                  ? "This order has been cancelled."
                  : "A refund has been initiated for this order."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h3
          className="font-bold text-charcoal mb-4"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Items Ordered
        </h3>
        <div className="divide-y divide-border">
          {orderItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3 gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-cream-dark flex items-center justify-center shrink-0 text-xl">
                  🌿
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm text-charcoal truncate">
                    {item.productName}
                  </p>
                  <p className="text-xs text-muted">
                    Qty: {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
              </div>
              <span className="font-semibold text-charcoal text-sm shrink-0">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Price breakdown */}
        <div className="border-t border-border pt-4 mt-2 space-y-2 text-sm">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Shipping</span>
            <span className={order.shippingFee === 0 ? "text-forest" : ""}>
              {order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-forest">
              <span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base text-charcoal border-t border-border pt-2">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h3
          className="font-bold text-charcoal mb-4 flex items-center gap-2"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          <MapPin size={16} className="text-forest" />
          Delivery Address
        </h3>
        <div className="bg-cream rounded-xl p-4 text-sm">
          <p className="font-semibold text-charcoal mb-1">
            {shippingAddress.fullName}
          </p>
          <p className="text-muted">
            {shippingAddress.houseNumber}, {shippingAddress.street}
            {shippingAddress.landmark ? `, ${shippingAddress.landmark}` : ""}
          </p>
          <p className="text-muted">
            {shippingAddress.city}, {shippingAddress.state} —{" "}
            {shippingAddress.pincode}
          </p>
          <p className="text-muted mt-1 flex items-center gap-1.5">
            <Phone size={12} />
            +91 {shippingAddress.phone}
          </p>
        </div>
      </div>

      {/* Help */}
      <div className="bg-cream-dark rounded-2xl border border-border p-5 text-center">
        <p className="text-sm text-muted">
          Need help with this order?{" "}
          <Link
            href="/contact"
            className="text-forest font-semibold hover:text-forest-dark transition-colors"
          >
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
