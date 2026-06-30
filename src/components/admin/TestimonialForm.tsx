"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X, Star } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { createClient } from "@/lib/supabase/client";
import type { Testimonial } from "@/types";
import { toast } from "sonner";

interface FormValues {
  name: string;
  location: string;
  rating: number;
  review: string;
  product: string;
  initials: string;
  active: boolean;
  sortOrder: number;
}

interface TestimonialFormProps {
  open: boolean;
  testimonial: Testimonial | null;
  onClose: () => void;
  onSaved: () => void;
}

export function TestimonialForm({ open, testimonial, onClose, onSaved }: TestimonialFormProps) {
  const [media, setMedia] = useState<{ url: string; type: "image" | "video" } | null>(null);
  const [hoverRating, setHoverRating] = useState(0);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: { name: "", location: "", rating: 5, review: "", product: "", initials: "", active: true, sortOrder: 0 },
  });

  const rating = watch("rating");
  const nameVal = watch("name");

  useEffect(() => {
    if (!nameVal) return;
    const parts = nameVal.trim().split(" ");
    const initials = parts.map((p: string) => p[0]?.toUpperCase() ?? "").join("").slice(0, 2);
    setValue("initials", initials);
  }, [nameVal, setValue]);

  useEffect(() => {
    if (testimonial) {
      reset({
        name: testimonial.name, location: testimonial.location,
        rating: testimonial.rating, review: testimonial.review,
        product: testimonial.product, initials: testimonial.initials,
        active: testimonial.active, sortOrder: testimonial.sortOrder,
      });
      setMedia(testimonial.mediaUrl ? { url: testimonial.mediaUrl, type: testimonial.mediaType ?? "image" } : null);
    } else {
      reset({ name: "", location: "", rating: 5, review: "", product: "", initials: "", active: true, sortOrder: 0 });
      setMedia(null);
    }
  }, [testimonial, reset, open]);

  async function onSubmit(values: FormValues) {
    const supabase = createClient();
    const payload = {
      name: values.name, location: values.location,
      rating: values.rating, review: values.review,
      product: values.product, initials: values.initials,
      active: values.active, sort_order: values.sortOrder,
      media_url: media?.url ?? null,
      media_type: media?.type ?? null,
    };

    const { error } = testimonial
      ? await supabase.from("testimonials").update(payload).eq("id", testimonial.id)
      : await supabase.from("testimonials").insert(payload);

    if (error) { toast.error(error.message); return; }
    toast.success(testimonial ? "Testimonial updated" : "Testimonial added");
    onSaved();
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-lg font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>
            {testimonial ? "Edit Testimonial" : "New Testimonial"}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-charcoal"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Customer Name" required error={errors.name?.message}
              {...register("name", { required: "Required" })} />
            <Input label="Initials" placeholder="PS" maxLength={2} {...register("initials")} />
          </div>

          <Input label="Location" placeholder="Mumbai, Maharashtra" {...register("location")} />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-charcoal">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button"
                  onMouseEnter={() => setHoverRating(n)} onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setValue("rating", n)} className="p-0.5">
                  <Star size={22} className={(hoverRating || rating) >= n ? "fill-saffron text-saffron" : "fill-none text-border"} />
                </button>
              ))}
            </div>
          </div>

          <Textarea label="Review" rows={4} required error={errors.review?.message}
            {...register("review", { required: "Required" })} />

          <Input label="Product Name" placeholder="Pure A2 Cow Ghee" {...register("product")} />

          <MediaUpload
            label="Photo / Video (optional)"
            value={media}
            onChange={setMedia}
            folder="sawdesi/testimonials"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Sort Order" type="number" {...register("sortOrder")} />
            <div className="flex flex-col gap-1.5 justify-end">
              <div className="flex items-center gap-2 h-11">
                <input id="active" type="checkbox" className="w-4 h-4 accent-saffron" {...register("active")} />
                <label htmlFor="active" className="text-sm font-medium text-charcoal cursor-pointer">Show on homepage</label>
              </div>
            </div>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-border flex gap-3 shrink-0">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" variant="primary" loading={isSubmitting} className="flex-1"
            onClick={handleSubmit(onSubmit)}>
            {testimonial ? "Save Changes" : "Add Testimonial"}
          </Button>
        </div>
      </div>
    </div>
  );
}
