"use client";

import { useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/admin/PageHeader";
import { formatPrice, formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface CustomerRow {
  id: string;
  name: string;
  email: string;
  role: string;
  loyaltyPoints: number;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCustomers = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, role, loyalty_points, created_at")
      .order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load customers"); return; }

    const ids = (data ?? []).map((u) => u.id);
    let orderStats: Record<string, { count: number; total: number }> = {};

    if (ids.length > 0) {
      const { data: orders } = await supabase
        .from("orders")
        .select("user_id, total")
        .in("user_id", ids);
      (orders ?? []).forEach((o) => {
        if (!orderStats[o.user_id]) orderStats[o.user_id] = { count: 0, total: 0 };
        orderStats[o.user_id].count++;
        orderStats[o.user_id].total += Number(o.total);
      });
    }

    setCustomers(
      (data ?? []).map((u) => ({
        id: u.id, name: u.name || "—", email: u.email,
        role: u.role, loyaltyPoints: u.loyalty_points,
        createdAt: u.created_at,
        orderCount: orderStats[u.id]?.count ?? 0,
        totalSpent: orderStats[u.id]?.total ?? 0,
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:pt-6 pt-4">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Customers"
          breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Customers" }]}
        />

        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <div className="relative max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email…"
                className="w-full h-9 pl-9 pr-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-muted text-sm">Loading customers…</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-muted text-sm">No customers found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-muted uppercase border-b border-border bg-cream/50">
                    <th className="text-left px-6 py-3">Customer</th>
                    <th className="text-left px-6 py-3 hidden sm:table-cell">Role</th>
                    <th className="text-left px-6 py-3 hidden md:table-cell">Orders</th>
                    <th className="text-left px-6 py-3">Total Spent</th>
                    <th className="text-left px-6 py-3 hidden lg:table-cell">Points</th>
                    <th className="text-left px-6 py-3 hidden md:table-cell">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-cream/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-saffron/20 flex items-center justify-center text-saffron-dark text-xs font-bold shrink-0">
                            {(c.name[0] ?? c.email[0] ?? "?").toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-charcoal">{c.name}</p>
                            <p className="text-xs text-muted">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <Badge variant={c.role === "admin" ? "saffron" : "forest"} size="sm" className="capitalize">
                          {c.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-charcoal font-medium hidden md:table-cell">{c.orderCount}</td>
                      <td className="px-6 py-4 text-sm font-bold text-charcoal">{formatPrice(c.totalSpent)}</td>
                      <td className="px-6 py-4 text-sm text-muted hidden lg:table-cell">{c.loyaltyPoints} pts</td>
                      <td className="px-6 py-4 text-xs text-muted hidden md:table-cell">{formatDate(c.createdAt)}</td>
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
