import type { Product } from "@/types";

/**
 * Maps a Supabase `products` row (snake_case) to a Product object (camelCase).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapProduct(p: any): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDescription: p.short_description,
    description: p.description,
    ingredients: p.ingredients ?? [],
    howToUse: p.how_to_use,
    price: p.price,
    originalPrice: p.original_price,
    discount: p.discount,
    category:
      p.category === "immunity" ||
      p.category === "superfoods" ||
      p.category === "ghee-oils" ||
      p.category === "herbal-powders" ||
      p.category === "wellness-drinks" ||
      p.category === "ayurvedic-classics"
        ? "soaps"
        : p.category,
    tags: p.tags ?? [],
    images: p.images ?? [],
    rating: p.rating,
    reviewCount: p.review_count,
    stockQuantity: p.stock_quantity,
    lowStockThreshold: p.low_stock_threshold,
    featured: p.featured,
    weight: p.weight,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}
