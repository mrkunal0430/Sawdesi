import { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin — Customers" };

const customers = [
  { id: "USR-001", name: "Priya Sharma", email: "priya@example.com", city: "Mumbai", orders: 8, totalSpent: 12400, joined: "2024-02-10", status: "Active" },
  { id: "USR-002", name: "Rahul Nair", email: "rahul@example.com", city: "Bengaluru", orders: 5, totalSpent: 7800, joined: "2024-03-22", status: "Active" },
  { id: "USR-003", name: "Ananya Bose", email: "ananya@example.com", city: "Kolkata", orders: 12, totalSpent: 18900, joined: "2023-11-15", status: "Active" },
  { id: "USR-004", name: "Vikram Reddy", email: "vikram@example.com", city: "Hyderabad", orders: 3, totalSpent: 3200, joined: "2024-05-01", status: "Active" },
  { id: "USR-005", name: "Meera Iyer", email: "meera@example.com", city: "Chennai", orders: 1, totalSpent: 799, joined: "2025-06-01", status: "New" },
];

export default function AdminCustomersPage() {
  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted mb-1">
            <Link href="/admin" className="hover:text-charcoal">Dashboard</Link>
            <span>/</span>
            <span className="text-charcoal font-medium">Customers</span>
          </div>
          <h1 className="text-2xl font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>Customers</h1>
        </div>

        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <input placeholder="Search by name or email..." className="h-9 w-full max-w-xs px-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted uppercase border-b border-border bg-cream/50">
                  <th className="text-left px-6 py-3">Customer</th>
                  <th className="text-left px-6 py-3">Location</th>
                  <th className="text-left px-6 py-3">Orders</th>
                  <th className="text-left px-6 py-3">Total Spent</th>
                  <th className="text-left px-6 py-3">Joined</th>
                  <th className="text-left px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-cream/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-saffron/20 flex items-center justify-center text-saffron-dark text-xs font-bold">
                          {c.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-charcoal">{c.name}</p>
                          <p className="text-xs text-muted">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">{c.city}</td>
                    <td className="px-6 py-4 text-sm text-charcoal font-medium">{c.orders}</td>
                    <td className="px-6 py-4 text-sm font-bold text-charcoal">{formatPrice(c.totalSpent)}</td>
                    <td className="px-6 py-4 text-xs text-muted">{formatDate(c.joined)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={c.status === "Active" ? "forest" : "saffron"} size="sm">{c.status}</Badge>
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
