"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, ShoppingBag, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { mapProduct } from "@/lib/mapProduct";
import { PRODUCT_CATEGORIES } from "@/constants";
import type { Product } from "@/types";

const gradients = [
  "product-gradient-1",
  "product-gradient-2",
  "product-gradient-3",
  "product-gradient-4",
  "product-gradient-5",
  "product-gradient-6",
];
const emojis = ["🫙", "🌿", "🍃", "🌱", "✨", "☕"];

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

export default function ProductsPage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts((data ?? []).map(mapProduct));
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    return result;
  }, [products, search, activeCategory, sort]);

  return (
    <div className="min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-charcoal font-medium">Products</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-charcoal mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
            All Products
          </h1>
          <p className="text-muted">{loading ? "Loading…" : `${filtered.length} products — pure, natural, lab-certified`}</p>
        </div>

        {/* Search + Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full h-11 bg-white border border-border rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal">
                <X size={15} />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-11 bg-white border border-border rounded-xl px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-forest appearance-none cursor-pointer"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <Button
              variant="ghost"
              size="md"
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden"
            >
              <SlidersHorizontal size={16} />
              Filters
            </Button>
          </div>
        </div>

        {/* Category filters */}
        {PRODUCT_CATEGORIES.length > 2 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.value
                    ? "bg-forest text-white"
                    : "bg-white border border-border text-charcoal hover:border-forest/40 hover:text-forest"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-border overflow-hidden animate-pulse">
                <div className={`h-52 ${gradients[i % gradients.length]}`} />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-cream-dark rounded w-3/4" />
                  <div className="h-4 bg-cream-dark rounded w-full" />
                  <div className="h-4 bg-cream-dark rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🌿</p>
            <h3 className="text-xl font-semibold text-charcoal mb-2">No products found</h3>
            <p className="text-muted mb-6">Try adjusting your search or filter</p>
            <Button onClick={() => { setSearch(""); setActiveCategory("all"); }} variant="ghost">
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-forest/25 transition-all duration-300"
              >
                <Link href={`/products/${product.slug}`} className="block">
                  <div className={`relative h-52 ${gradients[i % gradients.length]} overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {product.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <span className="text-7xl select-none group-hover:scale-110 transition-transform duration-500">
                          {emojis[i % emojis.length]}
                        </span>
                      )}
                    </div>
                    {product.discount && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="saffron" size="sm">{product.discount}% OFF</Badge>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-5">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-bold text-charcoal text-lg mb-1 group-hover:text-forest transition-colors" style={{ fontFamily: "var(--font-serif)" }}>
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted mb-3 line-clamp-2">{product.shortDescription}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-bold text-charcoal">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted line-through">{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>
                    <Button size="sm" variant="primary" onClick={() => addItem(product)} className="gap-1.5">
                      <ShoppingBag size={14} /> Add
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
