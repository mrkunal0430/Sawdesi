"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { MOCK_PRODUCTS } from "@/constants";

const gradients = [
  "product-gradient-1",
  "product-gradient-2",
  "product-gradient-3",
  "product-gradient-4",
  "product-gradient-5",
  "product-gradient-6",
];

const emojis = ["🫙", "🌿", "🍃", "🌱", "✨", "☕"];

export function FeaturedProducts() {
  const { addItem } = useCart();
  const featured = MOCK_PRODUCTS.filter((p) => p.featured);

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <div>
            <p className="text-saffron font-semibold text-sm uppercase tracking-widest mb-3">
              Most Loved
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-charcoal"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Our Bestsellers
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-forest-dark transition-colors group"
          >
            View all products
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-saffron/25 transition-all duration-300"
            >
              {/* Product Image */}
              <Link href={`/products/${product.slug}`} className="block">
                <div
                  className={`relative h-52 ${gradients[i % gradients.length]} overflow-hidden`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-7xl select-none group-hover:scale-110 transition-transform duration-500">
                      {emojis[i % emojis.length]}
                    </span>
                  </div>
                  {product.discount && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="saffron" size="sm">
                        {product.discount}% OFF
                      </Badge>
                    </div>
                  )}
                  {product.tags.includes("bestseller") && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="forest" size="sm">
                        Bestseller
                      </Badge>
                    </div>
                  )}
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-5">
                <Link href={`/products/${product.slug}`}>
                  <h3
                    className="font-bold text-charcoal text-lg mb-1 group-hover:text-saffron-dark transition-colors leading-tight"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted mb-3 leading-snug line-clamp-2">
                  {product.shortDescription}
                </p>

                <div className="flex items-center gap-1.5 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={13}
                        className={
                          idx < Math.floor(product.rating)
                            ? "fill-saffron text-saffron"
                            : "fill-none text-border"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted">
                    {product.rating} ({product.reviewCount})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-charcoal">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => addItem(product)}
                    className="gap-1.5"
                  >
                    <ShoppingBag size={14} />
                    Add
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
