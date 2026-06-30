"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import type { Product } from "@/types";
import { toast } from "sonner";
import { PRODUCT_CATEGORIES } from "@/constants";

interface FormValues {
  name: string;
  shortDescription: string;
  description: string;
  ingredients: string;
  howToUse: string;
  price: number;
  originalPrice: number | "";
  discount: number | "";
  category: string;
  tags: string;
  images: string[];
  stockQuantity: number;
  lowStockThreshold: number;
  featured: boolean;
  weight: string;
}

interface ProductFormProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

export function ProductForm({ open, product, onClose, onSaved }: ProductFormProps) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      name: "", shortDescription: "", description: "",
      ingredients: "", howToUse: "", price: 0, originalPrice: "",
      discount: "", category: "immunity", tags: "", images: [],
      stockQuantity: 0, lowStockThreshold: 10, featured: false, weight: "",
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        ingredients: product.ingredients.join(", "),
        howToUse: product.howToUse,
        price: product.price,
        originalPrice: product.originalPrice ?? "",
        discount: product.discount ?? "",
        category: product.category,
        tags: product.tags.join(", "),
        images: product.images,
        stockQuantity: product.stockQuantity,
        lowStockThreshold: product.lowStockThreshold,
        featured: product.featured,
        weight: product.weight ?? "",
      });
    } else {
      reset({
        name: "", shortDescription: "", description: "",
        ingredients: "", howToUse: "", price: 0, originalPrice: "",
        discount: "", category: "immunity", tags: "", images: [],
        stockQuantity: 0, lowStockThreshold: 10, featured: false, weight: "",
      });
    }
  }, [product, reset, open]);

  const images = watch("images");

  async function onSubmit(values: FormValues) {
    const supabase = createClient();
    const slug = product?.slug ?? slugify(values.name);

    const payload = {
      slug,
      name: values.name,
      short_description: values.shortDescription,
      description: values.description,
      ingredients: values.ingredients.split(",").map((s) => s.trim()).filter(Boolean),
      how_to_use: values.howToUse,
      price: Number(values.price),
      original_price: values.originalPrice !== "" ? Number(values.originalPrice) : null,
      discount: values.discount !== "" ? Number(values.discount) : null,
      category: values.category,
      tags: values.tags.split(",").map((s) => s.trim()).filter(Boolean),
      images: values.images,
      stock_quantity: Number(values.stockQuantity),
      low_stock_threshold: Number(values.lowStockThreshold),
      featured: values.featured,
      weight: values.weight || null,
    };

    const { error } = product
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert(payload);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(product ? "Product updated" : "Product created");
    onSaved();
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-xl bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-lg font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>
            {product ? "Edit Product" : "New Product"}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-charcoal transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <Input
            label="Product Name"
            required
            error={errors.name?.message}
            {...register("name", { required: "Name is required" })}
          />

          <Input
            label="Short Description"
            required
            error={errors.shortDescription?.message}
            {...register("shortDescription", { required: "Required" })}
          />

          <Textarea
            label="Description"
            rows={4}
            required
            error={errors.description?.message}
            {...register("description", { required: "Required" })}
          />

          <Textarea
            label="Ingredients (comma separated)"
            rows={2}
            placeholder="Amla, Ashwagandha, Honey"
            {...register("ingredients")}
          />

          <Textarea
            label="How to Use"
            rows={3}
            {...register("howToUse")}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (₹)"
              type="number"
              required
              error={errors.price?.message}
              {...register("price", { required: "Required", min: { value: 1, message: "Must be > 0" } })}
            />
            <Input
              label="Original Price (₹)"
              type="number"
              placeholder="Optional"
              {...register("originalPrice")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Discount (%)"
              type="number"
              placeholder="Optional"
              {...register("discount")}
            />
            <Input
              label="Weight / Volume"
              placeholder="e.g. 500ml, 200g"
              {...register("weight")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-charcoal">Category</label>
            <select
              className="h-11 rounded-xl border border-border bg-white px-4 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest"
              {...register("category")}
            >
              {PRODUCT_CATEGORIES.filter((c) => c.value !== "all").map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <Input
            label="Tags (comma separated)"
            placeholder="bestseller, immunity, vegan"
            {...register("tags")}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Stock Quantity"
              type="number"
              required
              {...register("stockQuantity", { required: "Required", min: 0 })}
            />
            <Input
              label="Low Stock Alert At"
              type="number"
              required
              {...register("lowStockThreshold", { required: "Required", min: 0 })}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="featured"
              type="checkbox"
              className="w-4 h-4 accent-saffron rounded"
              {...register("featured")}
            />
            <label htmlFor="featured" className="text-sm font-medium text-charcoal cursor-pointer">
              Featured product (shown on homepage)
            </label>
          </div>

          <ImageUpload
            label="Product Images"
            value={images}
            onChange={(urls) => setValue("images", urls)}
            folder="sawdesi/products"
            maxFiles={6}
          />
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex gap-3 shrink-0">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" variant="primary" loading={isSubmitting} className="flex-1"
            onClick={handleSubmit(onSubmit)}>
            {product ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </div>
    </div>
  );
}
