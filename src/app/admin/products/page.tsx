"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Search, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { mapProduct } from "@/lib/mapProduct";
import type { Product } from "@/types";
import { toast } from "sonner";

function stockBadge(qty: number, threshold: number) {
  if (qty === 0) return <Badge variant="danger" size="sm">Out of Stock</Badge>;
  if (qty <= threshold) return <Badge variant="warning" size="sm">Low Stock ({qty})</Badge>;
  return <Badge variant="success" size="sm">In Stock ({qty})</Badge>;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load products"); return; }
    setProducts((data ?? []).map(mapProduct));
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  async function handleDelete(product: Product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", product.id);
    if (error) { toast.error("Delete failed"); return; }
    toast.success("Product deleted");
    fetchProducts();
  }

  function openNew() { setEditing(null); setFormOpen(true); }
  function openEdit(p: Product) { setEditing(p); setFormOpen(true); }
  function closeForm() { setFormOpen(false); setEditing(null); }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:pt-6 pt-4">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Products"
          breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Products" }]}
          actions={
            <Button variant="primary" size="md" className="gap-2" onClick={openNew}>
              <Plus size={16} /> Add Product
            </Button>
          }
        />

        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <div className="relative max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full h-9 pl-9 pr-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-muted text-sm">Loading products…</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted text-sm mb-3">{search ? "No products match your search." : "No products yet."}</p>
              {!search && <Button variant="primary" size="sm" onClick={openNew} className="gap-2"><Plus size={14} /> Add your first product</Button>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-muted uppercase border-b border-border bg-cream/50">
                    <th className="text-left px-6 py-3">Product</th>
                    <th className="text-left px-6 py-3 hidden sm:table-cell">Category</th>
                    <th className="text-left px-6 py-3">Price</th>
                    <th className="text-left px-6 py-3 hidden md:table-cell">Rating</th>
                    <th className="text-left px-6 py-3">Stock</th>
                    <th className="text-left px-6 py-3 hidden lg:table-cell">Featured</th>
                    <th className="text-left px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((product) => (
                    <tr key={product.id} className="hover:bg-cream/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-cream-dark border border-border flex items-center justify-center shrink-0 overflow-hidden">
                            {product.images[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-lg">🫙</span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-charcoal">{product.name}</p>
                            <p className="text-xs text-muted">{product.weight}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted hidden sm:table-cell capitalize">
                        {product.category.replace(/-/g, " ")}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="text-sm font-bold text-charcoal">{formatPrice(product.price)}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-muted line-through ml-1">{formatPrice(product.originalPrice)}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-charcoal hidden md:table-cell">
                        <span className="flex items-center gap-1">
                          <Star size={12} className="fill-saffron text-saffron" />
                          {product.rating} <span className="text-muted">({product.reviewCount})</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {stockBadge(product.stockQuantity, product.lowStockThreshold)}
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <Badge variant={product.featured ? "saffron" : "default"} size="sm">
                          {product.featured ? "Featured" : "—"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(product)} className="text-muted hover:text-forest transition-colors" title="Edit">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => handleDelete(product)} className="text-muted hover:text-red-500 transition-colors" title="Delete">
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

      <ProductForm
        open={formOpen}
        product={editing}
        onClose={closeForm}
        onSaved={fetchProducts}
      />
    </div>
  );
}
