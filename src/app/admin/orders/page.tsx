import { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin — Orders" };

const orders = [
  { id: "ORD-2025-1247", customer: "Priya Sharma", email: "priya@example.com", items: 2, total: 1598, status: "Processing", date: "2025-06-04", city: "Mumbai" },
  { id: "ORD-2025-1246", customer: "Rahul Nair", email: "rahul@example.com", items: 4, total: 1296, status: "Shipped", date: "2025-06-03", city: "Bengaluru" },
  { id: "ORD-2025-1245", customer: "Ananya Bose", email: "ananya@example.com", items: 3, total: 1047, status: "Delivered", date: "2025-06-03", city: "Kolkata" },
  { id: "ORD-2025-1244", customer: "Vikram Reddy", email: "vikram@example.com", items: 3, total: 1047, status: "Delivered", date: "2025-06-02", city: "Hyderabad" },
  { id: "ORD-2025-1243", customer: "Meera Iyer", email: "meera@example.com", items: 1, total: 799, status: "Processing", date: "2025-06-02", city: "Chennai" },
  { id: "ORD-2025-1242", customer: "Arun Kumar", email: "arun@example.com", items: 2, total: 648, status: "Cancelled", date: "2025-06-01", city: "Delhi" },
];

const statusVariant: Record<string, "success" | "saffron" | "warning" | "danger"> = {
  Delivered: "success", Shipped: "saffron", Processing: "warning", Cancelled: "danger",
};

export default function AdminOrdersPage() {
  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted mb-1">
            <Link href="/admin" className="hover:text-charcoal">Dashboard</Link>
            <span>/</span>
            <span className="text-charcoal font-medium">Orders</span>
          </div>
          <h1 className="text-2xl font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>Orders</h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
            <button key={status} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${status === "All" ? "bg-forest text-white" : "bg-white border border-border text-charcoal hover:border-forest/40"}`}>
              {status}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted uppercase border-b border-border bg-cream/50">
                  <th className="text-left px-6 py-3">Order</th>
                  <th className="text-left px-6 py-3">Customer</th>
                  <th className="text-left px-6 py-3">Items</th>
                  <th className="text-left px-6 py-3">Total</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-left px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-cream/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-charcoal">{order.id}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-charcoal">{order.customer}</p>
                      <p className="text-xs text-muted">{order.city}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">{order.items} items</td>
                    <td className="px-6 py-4 text-sm font-bold text-charcoal">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant[order.status]} size="sm">{order.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted">{formatDate(order.date)}</td>
                    <td className="px-6 py-4">
                      <select className="text-xs border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-saffron bg-white">
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
