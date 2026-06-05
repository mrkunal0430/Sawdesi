import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "My Orders" };

const orders = [
  { id: "ORD-2025-001", date: "2025-05-28", items: [{ name: "A2 Ghee", qty: 2, price: 799 }, { name: "Chyawanprash", qty: 1, price: 549 }], total: 2147, status: "Delivered" },
  { id: "ORD-2025-002", date: "2025-06-01", items: [{ name: "Moringa Powder", qty: 1, price: 299 }, { name: "Kadha Mix", qty: 2, price: 249 }], total: 797, status: "Shipped" },
  { id: "ORD-2025-003", date: "2025-06-03", items: [{ name: "Golden Latte Mix", qty: 1, price: 349 }], total: 349, status: "Processing" },
  { id: "ORD-2025-004", date: "2025-04-15", items: [{ name: "Ashwagandha", qty: 2, price: 449 }], total: 898, status: "Delivered" },
];

const statusVariant: Record<string, "success" | "saffron" | "warning" | "danger"> = {
  Delivered: "success",
  Shipped: "saffron",
  Processing: "warning",
  Cancelled: "danger",
};

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-muted">
          <Link href="/account" className="hover:text-charcoal">Account</Link>
          <ChevronRight size={14} />
          <span className="text-charcoal font-medium">My Orders</span>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold text-charcoal mb-8" style={{ fontFamily: "var(--font-playfair)" }}>My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-charcoal mb-2">No orders yet</h3>
            <p className="text-muted mb-6">Start shopping to see your orders here</p>
            <Link href="/products" className="inline-flex items-center gap-2 bg-saffron text-white px-6 py-3 rounded-xl font-medium hover:bg-saffron-dark transition-colors">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 bg-cream border-b border-border">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="font-semibold text-sm text-charcoal">{order.id}</span>
                    <span className="text-xs text-muted">{formatDate(order.date)}</span>
                    <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                  </div>
                  <span className="font-bold text-charcoal">{formatPrice(order.total)}</span>
                </div>
                <div className="px-6 py-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-1">
                      <span className="text-muted">{item.name} × {item.qty}</span>
                      <span className="text-charcoal">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-3 border-t border-border flex gap-3">
                  {order.status === "Delivered" && (
                    <button className="text-xs font-medium text-forest hover:underline">Reorder</button>
                  )}
                  {order.status === "Shipped" && (
                    <button className="text-xs font-medium text-saffron-dark hover:underline">Track Package</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
