import { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { MOCK_PRODUCTS } from "@/constants";

export const metadata: Metadata = { title: "Admin — Products" };

export default function AdminProductsPage() {
  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted mb-1">
              <Link href="/admin" className="hover:text-charcoal">Dashboard</Link>
              <span>/</span>
              <span className="text-charcoal font-medium">Products</span>
            </div>
            <h1 className="text-2xl font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>Products</h1>
          </div>
          <Button variant="primary" size="md" className="gap-2">
            <Plus size={16} /> Add Product
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center gap-3">
            <input placeholder="Search products..." className="flex-1 max-w-xs h-9 px-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted uppercase border-b border-border bg-cream/50">
                  <th className="text-left px-6 py-3">Product</th>
                  <th className="text-left px-6 py-3">Category</th>
                  <th className="text-left px-6 py-3">Price</th>
                  <th className="text-left px-6 py-3">Rating</th>
                  <th className="text-left px-6 py-3">Stock</th>
                  <th className="text-left px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {MOCK_PRODUCTS.map((product) => (
                  <tr key={product.id} className="hover:bg-cream/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl product-gradient-1 flex items-center justify-center text-lg shrink-0">🫙</div>
                        <div>
                          <p className="text-sm font-semibold text-charcoal">{product.name}</p>
                          <p className="text-xs text-muted">{product.weight}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">{product.category}</td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-sm font-bold text-charcoal">{formatPrice(product.price)}</span>
                        {product.originalPrice && <span className="text-xs text-muted line-through ml-1">{formatPrice(product.originalPrice)}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal">⭐ {product.rating} ({product.reviewCount})</td>
                    <td className="px-6 py-4">
                      <Badge variant={product.inStock ? "success" : "danger"} size="sm">
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="text-muted hover:text-forest transition-colors"><Pencil size={15} /></button>
                        <button className="text-muted hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
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
