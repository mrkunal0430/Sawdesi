"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/admin/PageHeader";
import { formatPrice, formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { OrderStatus } from "@/types";
import { toast } from "sonner";

interface OrderRow {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  city: string;
  itemCount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

const STATUS_OPTIONS: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];
const STATUS_FILTERS = ["All", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];

const statusVariant: Record<string, "success" | "saffron" | "warning" | "danger" | "default" | "forest"> = {
  delivered: "success", shipped: "saffron", processing: "warning",
  pending: "default", confirmed: "forest",
  cancelled: "danger", refunded: "danger",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("id, order_number, shipping_address, items, total, status, created_at")
      .order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load orders"); return; }
    setOrders(
      (data ?? []).map((o) => ({
        id: o.id,
        orderNumber: o.order_number,
        customerName: o.shipping_address?.name ?? "—",
        customerEmail: "",
        city: o.shipping_address?.city ?? "—",
        itemCount: (o.items as unknown[])?.length ?? 0,
        total: o.total,
        status: o.status,
        createdAt: o.created_at,
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  async function updateStatus(id: string, status: OrderStatus) {
    setUpdating(id);
    const supabase = createClient();
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    setUpdating(null);
    if (error) { toast.error("Failed to update status"); return; }
    toast.success("Order status updated");
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  }

  const filtered = orders.filter((o) => {
    const matchFilter = filter === "All" || o.status === filter;
    const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-6 md:pt-6 pt-4">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Orders"
          breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Orders" }]}
        />

        <div className="flex flex-wrap gap-2 mb-5">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                filter === s ? "bg-forest text-white" : "bg-white border border-border text-charcoal hover:border-forest/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <div className="relative max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search order or customer…"
                className="w-full h-9 pl-9 pr-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-muted text-sm">Loading orders…</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-muted text-sm">No orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-muted uppercase border-b border-border bg-cream/50">
                    <th className="text-left px-6 py-3">Order</th>
                    <th className="text-left px-6 py-3">Customer</th>
                    <th className="text-left px-6 py-3 hidden sm:table-cell">Items</th>
                    <th className="text-left px-6 py-3">Total</th>
                    <th className="text-left px-6 py-3">Status</th>
                    <th className="text-left px-6 py-3 hidden md:table-cell">Date</th>
                    <th className="text-left px-6 py-3">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((order) => (
                    <tr key={order.id} className="hover:bg-cream/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-charcoal">{order.orderNumber}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-charcoal">{order.customerName}</p>
                        <p className="text-xs text-muted">{order.city}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted hidden sm:table-cell">{order.itemCount} items</td>
                      <td className="px-6 py-4 text-sm font-bold text-charcoal">{formatPrice(order.total)}</td>
                      <td className="px-6 py-4">
                        <Badge variant={statusVariant[order.status] ?? "default"} size="sm" className="capitalize">
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted hidden md:table-cell">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block">
                          <select
                            value={order.status}
                            onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                            disabled={updating === order.id}
                            className="appearance-none h-8 pl-2 pr-7 border border-border rounded-lg text-xs text-charcoal bg-white focus:outline-none focus:ring-1 focus:ring-saffron capitalize disabled:opacity-50 cursor-pointer"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s} className="capitalize">{s}</option>
                            ))}
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
