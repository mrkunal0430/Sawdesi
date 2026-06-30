"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, MapPin, Settings, ChevronRight, ShoppingBag } from "lucide-react";
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

export default function AccountPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

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
    fetchOrders();
  }, []);

  const quickLinks = [
    {
      label: "My Orders",
      desc: "Track, return, or reorder",
      href: "/account/orders",
      icon: Package,
    },
    {
      label: "Addresses",
      desc: "Manage delivery addresses",
      href: "/account/addresses",
      icon: MapPin,
    },
    {
      label: "Profile",
      desc: "Update personal details",
      href: "/account/profile",
      icon: Settings,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2
            className="font-bold text-charcoal"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Recent Orders
          </h2>
          <Link
            href="/account/orders"
            className="text-sm text-forest font-semibold hover:text-forest-dark flex items-center gap-1"
          >
            View all <ChevronRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div className="divide-y divide-border">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="px-6 py-4 flex items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-cream-dark rounded animate-pulse w-32" />
                  <div className="h-3 bg-cream-dark rounded animate-pulse w-48" />
                </div>
                <div className="h-6 bg-cream-dark rounded animate-pulse w-20" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10">
            <ShoppingBag size={36} className="text-muted mx-auto mb-3" />
            <p className="text-sm text-muted">
              No orders yet.{" "}
              <Link
                href="/products"
                className="text-forest font-medium hover:underline"
              >
                Start shopping!
              </Link>
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between px-6 py-4 gap-4 hover:bg-cream transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-charcoal">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-muted">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-charcoal text-sm">
                    {formatPrice(order.total)}
                  </span>
                  <Badge variant={statusVariant[order.status] ?? "default"}>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4">
        {quickLinks.map(({ label, desc, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="group bg-white rounded-2xl border border-border p-5 flex items-center gap-4 hover:border-saffron/40 hover:shadow-sm transition-all"
          >
            <div className="w-11 h-11 bg-cream rounded-xl flex items-center justify-center group-hover:bg-saffron/10 transition-colors">
              <Icon
                size={20}
                className="text-charcoal group-hover:text-saffron-dark transition-colors"
              />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-charcoal">{label}</p>
              <p className="text-xs text-muted">{desc}</p>
            </div>
            <ChevronRight size={16} className="text-muted" />
          </Link>
        ))}
      </div>
    </div>
  );
}
