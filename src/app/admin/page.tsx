"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, Package, Users, Star, ShoppingCart, AlertTriangle, ArrowUpRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingReviews: number;
  lowStockCount: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }[];
  lowStockProducts: { id: string; name: string; stockQuantity: number; lowStockThreshold: number }[];
}

const statusVariant: Record<string, "success" | "saffron" | "warning" | "danger" | "default" | "forest"> = {
  delivered: "success", shipped: "saffron", processing: "warning",
  pending: "default", confirmed: "forest", cancelled: "danger", refunded: "danger",
};

function StatCard({ label, value, sub, icon: Icon, color, href }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string; href?: string;
}) {
  const content = (
    <div className="bg-white rounded-2xl border border-border p-5 hover:shadow-sm transition-shadow">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon size={18} />
      </div>
      <p className="text-2xl font-bold text-charcoal mb-0.5" style={{ fontFamily: "var(--font-playfair)" }}>{value}</p>
      <p className="text-xs text-muted">{label}</p>
      {sub && <p className="text-xs text-forest mt-1 font-medium">{sub}</p>}
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const [ordersRes, customersRes, productsRes, reviewsRes, recentOrdersRes] = await Promise.all([
        supabase.from("orders").select("total, status"),
        supabase.from("users").select("id", { count: "exact" }).eq("role", "customer"),
        supabase.from("products").select("id, name, stock_quantity, low_stock_threshold"),
        supabase.from("reviews").select("id", { count: "exact" }).eq("status", "pending"),
        supabase.from("orders").select("id, order_number, shipping_address, total, status, created_at")
          .order("created_at", { ascending: false }).limit(6),
      ]);

      const orders = ordersRes.data ?? [];
      const totalRevenue = orders
        .filter((o) => o.status !== "cancelled" && o.status !== "refunded")
        .reduce((sum, o) => sum + Number(o.total), 0);

      const products = productsRes.data ?? [];
      const lowStockProducts = products
        .filter((p) => p.stock_quantity <= p.low_stock_threshold)
        .map((p) => ({ id: p.id, name: p.name, stockQuantity: p.stock_quantity, lowStockThreshold: p.low_stock_threshold }))
        .slice(0, 4);

      const recentOrders = (recentOrdersRes.data ?? []).map((o) => ({
        id: o.id,
        orderNumber: o.order_number,
        customerName: (o.shipping_address as { name?: string })?.name ?? "—",
        total: o.total,
        status: o.status,
        createdAt: o.created_at,
      }));

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalCustomers: customersRes.count ?? 0,
        totalProducts: products.length,
        pendingReviews: reviewsRes.count ?? 0,
        lowStockCount: lowStockProducts.length,
        recentOrders,
        lowStockProducts,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-muted text-sm">Loading dashboard…</div>
      </div>
    );
  }

  const s = stats!;

  return (
    <div className="p-6 md:pt-6 pt-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>Dashboard</h1>
          <span className="text-sm text-muted">{formatDate(new Date().toISOString())}</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Revenue" value={formatPrice(s.totalRevenue)} icon={TrendingUp}
            color="bg-saffron/10 text-saffron-dark" href="/admin/orders" />
          <StatCard label="Orders" value={s.totalOrders} icon={ShoppingCart}
            color="bg-forest/10 text-forest" href="/admin/orders" />
          <StatCard label="Customers" value={s.totalCustomers} icon={Users}
            color="bg-blue-50 text-blue-600" href="/admin/customers" />
          <StatCard label="Products" value={s.totalProducts}
            sub={s.lowStockCount > 0 ? `${s.lowStockCount} low stock` : "All stocked"}
            icon={Package} color="bg-gold/15 text-brown" href="/admin/products" />
        </div>

        {/* Alerts row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {s.pendingReviews > 0 && (
            <Link href="/admin/reviews?filter=pending"
              className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 hover:bg-amber-100 transition-colors">
              <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <Star size={16} className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-900">{s.pendingReviews} reviews pending moderation</p>
                <p className="text-xs text-amber-700">Click to review</p>
              </div>
              <ArrowUpRight size={16} className="text-amber-600 ml-auto" />
            </Link>
          )}
          {s.lowStockCount > 0 && (
            <Link href="/admin/inventory"
              className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 hover:bg-red-100 transition-colors">
              <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle size={16} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-900">{s.lowStockCount} products low on stock</p>
                <p className="text-xs text-red-700">Update inventory</p>
              </div>
              <ArrowUpRight size={16} className="text-red-600 ml-auto" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-border">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>Recent Orders</h2>
              <Link href="/admin/orders" className="text-sm text-forest font-semibold flex items-center gap-1 hover:text-forest-dark">
                View all <ArrowUpRight size={14} />
              </Link>
            </div>
            {s.recentOrders.length === 0 ? (
              <div className="py-12 text-center text-muted text-sm">No orders yet.</div>
            ) : (
              <div className="divide-y divide-border">
                {s.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center gap-3 px-6 py-3">
                    <div className="w-8 h-8 bg-forest/10 rounded-full flex items-center justify-center shrink-0">
                      <ShoppingCart size={14} className="text-forest" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-charcoal">{order.orderNumber}</p>
                      <p className="text-xs text-muted truncate">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-charcoal">{formatPrice(order.total)}</p>
                      <Badge variant={statusVariant[order.status] ?? "default"} size="sm" className="capitalize">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low Stock */}
          <div className="bg-white rounded-2xl border border-border">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>Stock Alerts</h2>
              <Link href="/admin/inventory" className="text-sm text-forest font-semibold flex items-center gap-1 hover:text-forest-dark">
                Manage <ArrowUpRight size={14} />
              </Link>
            </div>
            {s.lowStockProducts.length === 0 ? (
              <div className="py-12 text-center text-muted text-sm">All products well stocked.</div>
            ) : (
              <div className="divide-y divide-border">
                {s.lowStockProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 px-6 py-3">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${p.stockQuantity === 0 ? "bg-red-500" : "bg-amber-400"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal truncate">{p.name}</p>
                      <p className="text-xs text-muted">{p.stockQuantity} remaining</p>
                    </div>
                    <Badge variant={p.stockQuantity === 0 ? "danger" : "warning"} size="sm">
                      {p.stockQuantity === 0 ? "Out" : "Low"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
