"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X, Star } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface FormValues {
  productId: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  status: "pending" | "approved" | "rejected";
}

interface ProductOption { id: string; name: string }

export function ReviewForm({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [hoverRating, setHoverRating] = useState(0);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: { productId: "", userName: "", rating: 5, title: "", body: "", verified: false, status: "approved" },
  });

  const rating = watch("rating");

  useEffect(() => {
    if (!open) return;
    reset({ productId: "", userName: "", rating: 5, title: "", body: "", verified: false, status: "approved" });
    const supabase = createClient();
    supabase.from("products").select("id, name").order("name").then(({ data }) => {
      setProducts((data ?? []).map((p) => ({ id: p.id, name: p.name })));
    });
  }, [open, reset]);

  async function onSubmit(values: FormValues) {
    const supabase = createClient();
    const { error } = await supabase.from("reviews").insert({
      product_id: values.productId,
      user_name: values.userName,
      rating: values.rating,
      title: values.title,
      body: values.body,
      verified: values.verified,
      status: values.status,
      helpful: 0,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Review added");
    onSaved();
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-lg font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>Add Review</h2>
          <button onClick={onClose} className="text-muted hover:text-charcoal"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-charcoal">Product <span className="text-red-500">*</span></label>
            <select
              className="h-11 rounded-xl border border-border bg-white px-4 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-saffron"
              {...register("productId", { required: "Select a product" })}
            >
              <option value="">Select product…</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {errors.productId && <p className="text-xs text-red-500">{errors.productId.message}</p>}
          </div>

          <Input label="Customer Name" required error={errors.userName?.message}
            {...register("userName", { required: "Required" })} />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-charcoal">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setValue("rating", n)}
                  className="p-0.5"
                >
                  <Star size={22} className={(hoverRating || rating) >= n ? "fill-saffron text-saffron" : "fill-none text-border"} />
                </button>
              ))}
            </div>
          </div>

          <Input label="Review Title" placeholder="e.g. Best product ever!" {...register("title")} />

          <Textarea label="Review Body" rows={4} required error={errors.body?.message}
            {...register("body", { required: "Required" })} />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-charcoal">Status</label>
            <select
              className="h-11 rounded-xl border border-border bg-white px-4 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-saffron"
              {...register("status")}
            >
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input id="verified" type="checkbox" className="w-4 h-4 accent-saffron" {...register("verified")} />
            <label htmlFor="verified" className="text-sm font-medium text-charcoal cursor-pointer">Verified purchase</label>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-border flex gap-3 shrink-0">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" variant="primary" loading={isSubmitting} className="flex-1"
            onClick={handleSubmit(onSubmit)}>Add Review</Button>
        </div>
      </div>
    </div>
  );
}
