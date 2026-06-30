"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Order } from "@/types";

const statusVariant: Record<
  string,
  "success" | "saffron" | "warning" | "default"
> = {
  delivered: "success",
  shipped: "saffron",
  processing: "warning",
  confirmed: "warning",
  pending: "default",
  cancelled: "default",
  refunded: "default",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setOrders(
          data.map((o) => ({
            id: o.id,
            orderNumber: o.order_number,
            userId: o.user_id,
            shippingAddress: o.shipping_address,
            subtotal: o.subtotal,
            shippingFee: o.shipping_fee,
            discount: o.discount,
            total: o.total,
            status: o.status,
            paymentId: o.payment_id,
            couponCode: o.coupon_code,
            notes: o.notes,
            createdAt: o.created_at,
            updatedAt: o.updated_at,
          }))
        );
      }
      setIsLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
        <Package size={18} className="text-forest" />
        <h2
          className="font-bold text-charcoal"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          My Orders
        </h2>
      </div>

      {isLoading ? (
        <div className="divide-y divide-border">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="px-6 py-5 flex items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-cream-dark rounded animate-pulse w-36" />
                <div className="h-3 bg-cream-dark rounded animate-pulse w-52" />
                <div className="h-3 bg-cream-dark rounded animate-pulse w-24" />
              </div>
              <div className="h-6 bg-cream-dark rounded animate-pulse w-24" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag size={40} className="text-muted mx-auto mb-4" />
          <p className="font-semibold text-charcoal mb-1">No orders yet</p>
          <p className="text-sm text-muted mb-5">
            Start shopping to place your first order.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-forest-dark transition-colors"
          >
            Browse Products <ChevronRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block px-6 py-5 hover:bg-cream transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="font-semibold text-sm text-charcoal">
                      {order.orderNumber}
                    </span>
                    <Badge
                      variant={statusVariant[order.status] ?? "default"}
                      size="sm"
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted mb-2">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                  <p className="text-sm text-muted">
                    Delivering to{" "}
                    <span className="font-medium text-charcoal">
                      {(order.shippingAddress as { fullName?: string })?.fullName ??
                        "—"}
                    </span>
                    ,{" "}
                    {(order.shippingAddress as { city?: string })?.city ?? ""}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-charcoal">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
