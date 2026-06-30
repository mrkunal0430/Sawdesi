"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, ToggleRight, ToggleLeft, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/admin/PageHeader";
import { CouponForm } from "@/components/admin/CouponForm";
import { formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Coupon } from "@/types";
import { toast } from "sonner";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);

  const fetchCoupons = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load coupons"); return; }
    setCoupons(
      (data ?? []).map((c) => ({
        id: c.id, code: c.code, type: c.type, value: c.value,
        minOrderValue: c.min_order_value, maxDiscount: c.max_discount,
        usageLimit: c.usage_limit, usedCount: c.used_count,
        active: c.active, expiresAt: c.expires_at, createdAt: c.created_at,
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  async function toggleActive(coupon: Coupon) {
    const supabase = createClient();
    const { error } = await supabase.from("coupons").update({ active: !coupon.active }).eq("id", coupon.id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success(coupon.active ? "Coupon deactivated" : "Coupon activated");
    fetchCoupons();
  }

  async function handleDelete(id: string, code: string) {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    const supabase = createClient();
    const { error } = await supabase.from("coupons").delete().eq("id", id);
    if (error) { toast.error("Delete failed"); return; }
    toast.success("Coupon deleted");
    fetchCoupons();
  }

  function openEdit(c: Coupon) { setEditing(c); setFormOpen(true); }
  function openNew() { setEditing(null); setFormOpen(true); }

  return (
    <div className="p-6 md:pt-6 pt-4">
      <div className="max-w-5xl mx-auto">
        <PageHeader
          title="Coupons"
          breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Coupons" }]}
          actions={
            <Button variant="primary" size="md" className="gap-2" onClick={openNew}>
              <Plus size={16} /> Create Coupon
            </Button>
          }
        />

        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-muted text-sm">Loading coupons…</div>
          ) : coupons.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted text-sm mb-3">No coupons yet.</p>
              <Button variant="primary" size="sm" onClick={openNew} className="gap-2"><Plus size={14} /> Create coupon</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-muted uppercase border-b border-border bg-cream/50">
                    <th className="text-left px-6 py-3">Code</th>
                    <th className="text-left px-6 py-3">Discount</th>
                    <th className="text-left px-6 py-3 hidden sm:table-cell">Min Order</th>
                    <th className="text-left px-6 py-3">Usage</th>
                    <th className="text-left px-6 py-3 hidden md:table-cell">Expires</th>
                    <th className="text-left px-6 py-3">Status</th>
                    <th className="text-left px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-cream/30 transition-colors">
                      <td className="px-6 py-4">
                        <code className="text-sm font-bold text-charcoal bg-cream-dark px-2 py-1 rounded-lg">
                          {coupon.code}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-charcoal">
                        {coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`} off
                      </td>
                      <td className="px-6 py-4 text-sm text-muted hidden sm:table-cell">
                        {coupon.minOrderValue ? `₹${coupon.minOrderValue}` : "No minimum"}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted">
                        {coupon.usedCount} / {coupon.usageLimit ?? "∞"}
                      </td>
                      <td className="px-6 py-4 text-xs text-muted hidden md:table-cell">
                        {coupon.expiresAt ? formatDate(coupon.expiresAt) : "Never"}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={coupon.active ? "success" : "default"} size="sm">
                          {coupon.active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(coupon)} className="text-muted hover:text-forest transition-colors" title="Edit">
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => toggleActive(coupon)}
                            className={`transition-colors ${coupon.active ? "text-forest hover:text-forest-dark" : "text-muted hover:text-charcoal"}`}
                            title={coupon.active ? "Deactivate" : "Activate"}
                          >
                            {coupon.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                          </button>
                          <button onClick={() => handleDelete(coupon.id, coupon.code)} className="text-muted hover:text-red-500 transition-colors" title="Delete">
                            <Trash2 size={15} />
                          </button>
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

      <CouponForm
        open={formOpen}
        coupon={editing}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSaved={fetchCoupons}
      />
    </div>
  );
}
