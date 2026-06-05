"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Star, ShoppingBag, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { MOCK_PRODUCTS, PRODUCT_CATEGORIES } from "@/constants";

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
  { label: "Best Rated", value: "rating" },
  { label: "Most Reviews", value: "reviews" },
];

export default function ProductsPage() {
  const { addItem } = useCart();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let products = [...MOCK_PRODUCTS];
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }
    if (activeCategory !== "all") {
      products = products.filter((p) => p.category === activeCategory);
    }
    if (sort === "price-asc") products.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") products.sort((a, b) => b.price - a.price);
    else if (sort === "rating") products.sort((a, b) => b.rating - a.rating);
    else if (sort === "reviews") products.sort((a, b) => b.reviewCount - a.reviewCount);
    return products;
  }, [search, activeCategory, sort]);

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
          <p className="text-muted">{filtered.length} products — pure, natural, lab-certified</p>
        </div>

        {/* Search + Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full h-11 bg-white border border-border rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-saffron focus:border-saffron"
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
              className="h-11 bg-white border border-border rounded-xl px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-saffron appearance-none cursor-pointer"
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

        {/* Product Grid */}
        {filtered.length === 0 ? (
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
                className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-saffron/25 transition-all duration-300"
              >
                <Link href={`/products/${product.slug}`} className="block">
                  <div className={`relative h-52 ${gradients[i % gradients.length]} overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-7xl select-none group-hover:scale-110 transition-transform duration-500">
                        {emojis[i % emojis.length]}
                      </span>
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
                    <h3 className="font-bold text-charcoal text-lg mb-1 group-hover:text-saffron-dark transition-colors" style={{ fontFamily: "var(--font-playfair)" }}>
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted mb-3 line-clamp-2">{product.shortDescription}</p>
                  <div className="flex items-center gap-1.5 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} size={13} className={idx < Math.floor(product.rating) ? "fill-saffron text-saffron" : "fill-none text-border"} />
                      ))}
                    </div>
                    <span className="text-xs text-muted">{product.rating} ({product.reviewCount})</span>
                  </div>
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
