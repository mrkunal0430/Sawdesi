import { Metadata } from "next";
import Link from "next/link";
import { Package, Heart, Star, Settings, ChevronRight, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "My Account" };

const recentOrders = [
  { id: "ORD-2025-001", date: "2025-05-28", items: "A2 Ghee × 2, Chyawanprash × 1", total: 2147, status: "Delivered" },
  { id: "ORD-2025-002", date: "2025-06-01", items: "Moringa Powder × 1, Kadha × 2", total: 797, status: "Shipped" },
  { id: "ORD-2025-003", date: "2025-06-03", items: "Golden Latte Mix × 1", total: 349, status: "Processing" },
];

const statusVariant: Record<string, "success" | "saffron" | "warning"> = {
  Delivered: "success",
  Shipped: "saffron",
  Processing: "warning",
};

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white border-b border-border py-8 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-saffron flex items-center justify-center text-white text-xl font-bold">
              R
            </div>
            <div>
              <h1 className="text-2xl font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>
                Welcome back, Rahul!
              </h1>
              <p className="text-sm text-muted">rahul@example.com</p>
            </div>
          </div>
          <Link href="/account/profile" className="text-sm text-forest font-semibold hover:text-forest-dark flex items-center gap-1">
            <Settings size={15} /> Edit Profile
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Package, label: "Total Orders", value: "12", color: "bg-saffron/10 text-saffron-dark" },
            { icon: Heart, label: "Wishlist", value: "5", color: "bg-red-50 text-red-500" },
            { icon: Star, label: "Loyalty Points", value: "840", color: "bg-gold/15 text-brown" },
            { icon: TrendingUp, label: "Total Savings", value: "₹1,240", color: "bg-forest/10 text-forest" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-border p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>{value}</p>
              <p className="text-xs text-muted">{label}</p>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-2xl border border-border mb-8">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>Recent Orders</h2>
            <Link href="/account/orders" className="text-sm text-forest font-semibold hover:text-forest-dark flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-6 py-4 gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-charcoal">{order.id}</p>
                  <p className="text-xs text-muted line-clamp-1">{order.items}</p>
                  <p className="text-xs text-muted">{formatDate(order.date)}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-charcoal text-sm">{formatPrice(order.total)}</span>
                  <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "My Orders", desc: "Track, return, or reorder", href: "/account/orders", icon: Package },
            { label: "My Profile", desc: "Update personal details", href: "/account/profile", icon: Settings },
          ].map(({ label, desc, href, icon: Icon }) => (
            <Link key={label} href={href} className="group bg-white rounded-2xl border border-border p-5 flex items-center gap-4 hover:border-saffron/40 hover:shadow-sm transition-all">
              <div className="w-11 h-11 bg-cream rounded-xl flex items-center justify-center group-hover:bg-saffron/10 transition-colors">
                <Icon size={20} className="text-charcoal group-hover:text-saffron-dark transition-colors" />
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
    </div>
  );
}
