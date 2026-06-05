import { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, Package, Users, Star, ShoppingCart, LayoutDashboard, ChevronRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin Dashboard" };

const stats = [
  { label: "Total Revenue", value: "₹4,82,340", change: "+18% this month", icon: TrendingUp, color: "bg-saffron/10 text-saffron-dark" },
  { label: "Orders", value: "1,247", change: "+43 today", icon: ShoppingCart, color: "bg-forest/10 text-forest" },
  { label: "Customers", value: "8,921", change: "+124 this week", icon: Users, color: "bg-blue-50 text-blue-600" },
  { label: "Products", value: "24", change: "6 low stock", icon: Package, color: "bg-gold/15 text-brown" },
];

const recentOrders = [
  { id: "ORD-2025-1247", customer: "Priya Sharma", items: "A2 Ghee × 2", total: 1598, status: "Processing", date: "2025-06-04" },
  { id: "ORD-2025-1246", customer: "Rahul Nair", items: "Chyawanprash × 1, Kadha × 3", total: 1296, status: "Shipped", date: "2025-06-03" },
  { id: "ORD-2025-1245", customer: "Ananya Bose", items: "Moringa × 2, Ashwagandha × 1", total: 1047, status: "Delivered", date: "2025-06-03" },
  { id: "ORD-2025-1244", customer: "Vikram Reddy", items: "Golden Latte Mix × 3", total: 1047, status: "Delivered", date: "2025-06-02" },
  { id: "ORD-2025-1243", customer: "Meera Iyer", items: "A2 Ghee × 1", total: 799, status: "Processing", date: "2025-06-02" },
];

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
];

const statusVariant: Record<string, "success" | "saffron" | "warning"> = {
  Delivered: "success", Shipped: "saffron", Processing: "warning",
};

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-forest-dark text-cream min-h-screen p-4 shrink-0">
        <div className="flex items-center gap-2 px-2 py-3 mb-6">
          <span className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>Sawdesi</span>
          <Badge variant="saffron" size="sm">Admin</Badge>
        </div>
        <nav className="space-y-1 flex-1">
          {adminNav.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-cream/70 hover:text-cream hover:bg-white/10 transition-colors">
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/" className="flex items-center gap-2 px-3 py-2 text-xs text-cream/50 hover:text-cream/70 mt-4">
          ← Back to Store
        </Link>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>Dashboard</h1>
            <span className="text-sm text-muted">{formatDate(new Date())}</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(({ label, value, change, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-border p-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                  <Icon size={18} />
                </div>
                <p className="text-2xl font-bold text-charcoal mb-0.5" style={{ fontFamily: "var(--font-playfair)" }}>{value}</p>
                <p className="text-xs text-muted">{label}</p>
                <p className="text-xs text-forest mt-1 font-medium">{change}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-border">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>Recent Orders</h2>
              <Link href="/admin/orders" className="text-sm text-forest font-semibold flex items-center gap-1">
                View all <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-muted uppercase border-b border-border">
                    <th className="text-left px-6 py-3">Order ID</th>
                    <th className="text-left px-6 py-3">Customer</th>
                    <th className="text-left px-6 py-3 hidden sm:table-cell">Items</th>
                    <th className="text-left px-6 py-3">Total</th>
                    <th className="text-left px-6 py-3">Status</th>
                    <th className="text-left px-6 py-3 hidden md:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-cream/50 transition-colors">
                      <td className="px-6 py-3 text-sm font-semibold text-charcoal">{order.id}</td>
                      <td className="px-6 py-3 text-sm text-charcoal">{order.customer}</td>
                      <td className="px-6 py-3 text-sm text-muted hidden sm:table-cell">{order.items}</td>
                      <td className="px-6 py-3 text-sm font-bold text-charcoal">{formatPrice(order.total)}</td>
                      <td className="px-6 py-3"><Badge variant={statusVariant[order.status]} size="sm">{order.status}</Badge></td>
                      <td className="px-6 py-3 text-xs text-muted hidden md:table-cell">{formatDate(order.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
