"use client";

import { useEffect, useState, useCallback } from "react";
import { AlertTriangle, TrendingDown, Package, Save } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/admin/PageHeader";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface InventoryRow {
  id: string;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  lowStockThreshold: number;
  weight?: string;
}

function StockStatus({ qty, threshold }: { qty: number; threshold: number }) {
  if (qty === 0) return <Badge variant="danger" size="sm">Out of Stock</Badge>;
  if (qty <= threshold) return <Badge variant="warning" size="sm">Low Stock</Badge>;
  return <Badge variant="success" size="sm">OK</Badge>;
}

export default function AdminInventoryPage() {
  const [rows, setRows] = useState<InventoryRow[]>([]);
  const [edits, setEdits] = useState<Record<string, { stockQuantity: number; lowStockThreshold: number }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("id, name, category, price, stock_quantity, low_stock_threshold, weight")
      .order("name");
    if (error) { toast.error("Failed to load inventory"); return; }
    setRows(
      (data ?? []).map((p) => ({
        id: p.id, name: p.name, category: p.category, price: p.price,
        stockQuantity: p.stock_quantity, lowStockThreshold: p.low_stock_threshold, weight: p.weight,
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => { fetchInventory(); }, [fetchInventory]);

  function setEdit(id: string, field: "stockQuantity" | "lowStockThreshold", value: number) {
    const row = rows.find((r) => r.id === id)!;
    setEdits((prev) => ({
      ...prev,
      [id]: {
        stockQuantity: prev[id]?.stockQuantity ?? row.stockQuantity,
        lowStockThreshold: prev[id]?.lowStockThreshold ?? row.lowStockThreshold,
        [field]: value,
      },
    }));
  }

  async function saveRow(id: string) {
    const edit = edits[id];
    if (!edit) return;
    setSaving(id);
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .update({ stock_quantity: edit.stockQuantity, low_stock_threshold: edit.lowStockThreshold })
      .eq("id", id);
    setSaving(null);
    if (error) { toast.error("Save failed"); return; }
    toast.success("Inventory updated");
    setEdits((prev) => { const n = { ...prev }; delete n[id]; return n; });
    fetchInventory();
  }

  const outOfStock = rows.filter((r) => r.stockQuantity === 0).length;
  const lowStock = rows.filter((r) => r.stockQuantity > 0 && r.stockQuantity <= r.lowStockThreshold).length;

  return (
    <div className="p-6 md:pt-6 pt-4">
      <div className="max-w-5xl mx-auto">
        <PageHeader
          title="Inventory"
          breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Inventory" }]}
        />

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center">
              <Package size={18} className="text-forest" />
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>{rows.length}</p>
              <p className="text-xs text-muted">Total SKUs</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <TrendingDown size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>{lowStock}</p>
              <p className="text-xs text-muted">Low Stock</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle size={18} className="text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>{outOfStock}</p>
              <p className="text-xs text-muted">Out of Stock</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-muted text-sm">Loading inventory…</div>
          ) : rows.length === 0 ? (
            <div className="py-16 text-center text-muted text-sm">No products. Add products first.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-muted uppercase border-b border-border bg-cream/50">
                    <th className="text-left px-6 py-3">Product</th>
                    <th className="text-left px-6 py-3 hidden sm:table-cell">Price</th>
                    <th className="text-left px-6 py-3">Status</th>
                    <th className="text-left px-6 py-3">Stock Qty</th>
                    <th className="text-left px-6 py-3">Low Alert At</th>
                    <th className="text-left px-6 py-3">Save</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((row) => {
                    const edit = edits[row.id];
                    const qty = edit?.stockQuantity ?? row.stockQuantity;
                    const threshold = edit?.lowStockThreshold ?? row.lowStockThreshold;
                    const dirty = !!edit;

                    return (
                      <tr key={row.id} className={dirty ? "bg-saffron/5" : "hover:bg-cream/30 transition-colors"}>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-charcoal">{row.name}</p>
                          <p className="text-xs text-muted capitalize">{row.category.replace(/-/g, " ")} · {row.weight}</p>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-charcoal hidden sm:table-cell">
                          {formatPrice(row.price)}
                        </td>
                        <td className="px-6 py-4">
                          <StockStatus qty={qty} threshold={threshold} />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            min={0}
                            value={qty}
                            onChange={(e) => setEdit(row.id, "stockQuantity", Number(e.target.value))}
                            className="w-20 h-8 border border-border rounded-lg px-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-saffron"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            min={0}
                            value={threshold}
                            onChange={(e) => setEdit(row.id, "lowStockThreshold", Number(e.target.value))}
                            className="w-20 h-8 border border-border rounded-lg px-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-saffron"
                          />
                        </td>
                        <td className="px-6 py-4">
                          {dirty && (
                            <Button
                              size="sm"
                              variant="secondary"
                              loading={saving === row.id}
                              onClick={() => saveRow(row.id)}
                              className="gap-1.5 h-8 px-3"
                            >
                              <Save size={13} /> Save
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
