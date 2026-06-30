"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Zap, ChevronRight, Minus, Plus, Shield, Truck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { mapProduct } from "@/lib/mapProduct";
import type { Product } from "@/types";

const gradients = ["product-gradient-1", "product-gradient-2", "product-gradient-3", "product-gradient-4", "product-gradient-5", "product-gradient-6"];
const emojis = ["🫙", "🌿", "🍃", "🌱", "✨", "☕"];
const tabs = ["Description", "Ingredients", "How to Use"] as const;
type Tab = typeof tabs[number];

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>("Description");

  const fetchProduct = useCallback(async () => {
    const supabase = createClient();

    // Fetch the product by slug
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", params.slug)
      .single();

    if (error || !data) {
      setProduct(null);
      setLoading(false);
      return;
    }

    const mapped = mapProduct(data);
    setProduct(mapped);

    // Fetch related products (same category, exclude current)
    const { data: relatedData } = await supabase
      .from("products")
      .select("*")
      .neq("id", mapped.id)
      .limit(3);

    setRelated((relatedData ?? []).map(mapProduct));
    setLoading(false);
  }, [params.slug]);

  useEffect(() => { fetchProduct(); }, [fetchProduct]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="bg-white border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/products" className="hover:text-charcoal transition-colors">Products</Link>
            <ChevronRight size={14} />
            <span className="text-charcoal font-medium">Loading…</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid lg:grid-cols-2 gap-12 mb-16 animate-pulse">
            <div className="rounded-3xl h-96 bg-cream-dark" />
            <div className="space-y-4">
              <div className="h-6 bg-cream-dark rounded w-1/3" />
              <div className="h-10 bg-cream-dark rounded w-3/4" />
              <div className="h-5 bg-cream-dark rounded w-1/2" />
              <div className="h-12 bg-cream-dark rounded w-1/3" />
              <div className="h-12 bg-cream-dark rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) notFound();

  return (
    <div className="min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-muted flex-wrap">
          <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:text-charcoal transition-colors">Products</Link>
          <ChevronRight size={14} />
          <span className="text-charcoal font-medium">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className={`rounded-3xl h-96 ${product.images[0] ? "bg-cream-dark" : gradients[0]} flex items-center justify-center relative overflow-hidden`}>
              {product.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-9xl select-none">{emojis[0]}</span>
              )}
              {product.discount && (
                <div className="absolute top-4 left-4">
                  <Badge variant="saffron">{product.discount}% OFF</Badge>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(0, 4).map((img, i) => (
                  <div key={i} className={`rounded-xl h-20 bg-cream-dark flex items-center justify-center cursor-pointer border-2 ${i === 0 ? "border-forest" : "border-transparent"} transition-all overflow-hidden`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
            {product.images.length <= 1 && (
              <div className="grid grid-cols-4 gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`rounded-xl h-20 ${gradients[i % gradients.length]} opacity-${i === 0 ? "100" : "60"} flex items-center justify-center cursor-pointer border-2 ${i === 0 ? "border-forest" : "border-transparent"} transition-all`}>
                    <span className="text-2xl">{emojis[i % emojis.length]}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="forest" size="sm">{product.category}</Badge>
              {product.stockQuantity > 0 ? (
                <Badge variant="success" size="sm">In Stock</Badge>
              ) : (
                <Badge variant="danger" size="sm">Out of Stock</Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-charcoal mb-2" style={{ fontFamily: "var(--font-serif)" }}>
              {product.name}
            </h1>
            <p className="text-muted mb-4">{product.shortDescription}</p>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-charcoal">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted line-through">{formatPrice(product.originalPrice)}</span>
                  <Badge variant="saffron">{product.discount}% OFF</Badge>
                </>
              )}
            </div>

            {product.weight && (
              <p className="text-sm text-muted mb-6">Net Weight: <span className="font-semibold text-charcoal">{product.weight}</span></p>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-charcoal">Quantity</span>
              <div className="flex items-center border border-border rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-cream-dark transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-semibold text-charcoal">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-cream-dark transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3 mb-8">
              <Button
                size="lg"
                variant="primary"
                onClick={() => addItem(product, quantity)}
                className="flex-1 gap-2"
              >
                <ShoppingBag size={18} /> Add to Cart
              </Button>
              <Button size="lg" variant="secondary" className="flex-1 gap-2">
                <Zap size={18} /> Buy Now
              </Button>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Shield, text: "Chemical Free" },
                { icon: Truck, text: "Free shipping ₹499+" },
                { icon: RotateCcw, text: "15-day returns" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1.5 bg-cream rounded-xl p-3 text-center">
                  <Icon size={18} className="text-forest" />
                  <span className="text-xs font-medium text-charcoal">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-border mb-12">
          <div className="flex border-b border-border overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "text-forest border-forest"
                    : "text-muted border-transparent hover:text-charcoal"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === "Description" && (
              <p className="text-muted leading-relaxed">{product.description}</p>
            )}
            {activeTab === "Ingredients" && (
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing) => (
                  <span key={ing} className="bg-forest/10 text-forest text-sm px-3 py-1.5 rounded-full font-medium">
                    {ing}
                  </span>
                ))}
              </div>
            )}
            {activeTab === "How to Use" && (
              <p className="text-muted leading-relaxed">{product.howToUse}</p>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-charcoal mb-6" style={{ fontFamily: "var(--font-serif)" }}>
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <Link key={p.id} href={`/products/${p.slug}`} className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className={`h-40 ${p.images[0] ? "bg-cream-dark" : gradients[i % gradients.length]} flex items-center justify-center overflow-hidden`}>
                    {p.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{emojis[i % emojis.length]}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-charcoal mb-1 group-hover:text-forest transition-colors" style={{ fontFamily: "var(--font-serif)" }}>{p.name}</h3>
                    <p className="text-lg font-bold text-charcoal">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
