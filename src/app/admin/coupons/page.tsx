"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

const initialCoupons = [
  { id: "1", code: "FIRST10", type: "percentage", value: 10, minOrder: 0, used: 234, limit: 500, active: true, expires: "2025-12-31" },
  { id: "2", code: "WELCOME50", type: "fixed", value: 50, minOrder: 499, used: 89, limit: 200, active: true, expires: "2025-09-30" },
  { id: "3", code: "SUMMER20", type: "percentage", value: 20, minOrder: 999, used: 145, limit: 300, active: false, expires: "2025-08-31" },
  { id: "4", code: "BULK15", type: "percentage", value: 15, minOrder: 1499, used: 56, limit: null, active: true, expires: null },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState(initialCoupons);

  const toggle = (id: string) => {
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c));
  };

  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted mb-1">
              <Link href="/admin" className="hover:text-charcoal">Dashboard</Link>
              <span>/</span>
              <span className="text-charcoal font-medium">Coupons</span>
            </div>
            <h1 className="text-2xl font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>Coupons</h1>
          </div>
          <Button variant="primary" size="md" className="gap-2">
            <Plus size={16} /> Create Coupon
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted uppercase border-b border-border bg-cream/50">
                  <th className="text-left px-6 py-3">Code</th>
                  <th className="text-left px-6 py-3">Discount</th>
                  <th className="text-left px-6 py-3">Min Order</th>
                  <th className="text-left px-6 py-3">Usage</th>
                  <th className="text-left px-6 py-3">Expires</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-left px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-cream/30 transition-colors">
                    <td className="px-6 py-4">
                      <code className="text-sm font-bold text-charcoal bg-cream-dark px-2 py-1 rounded-lg">{coupon.code}</code>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-charcoal">
                      {coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`} off
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">
                      {coupon.minOrder > 0 ? `₹${coupon.minOrder}` : "No minimum"}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">
                      {coupon.used} / {coupon.limit ?? "∞"}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted">
                      {coupon.expires ? formatDate(coupon.expires) : "Never"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={coupon.active ? "success" : "default"} size="sm">
                        {coupon.active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggle(coupon.id)}
                          className={`transition-colors ${coupon.active ? "text-forest hover:text-forest-dark" : "text-muted hover:text-charcoal"}`}
                          title={coupon.active ? "Deactivate" : "Activate"}
                        >
                          {coupon.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        </button>
                        <button className="text-muted hover:text-red-500 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
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
