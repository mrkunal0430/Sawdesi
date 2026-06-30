"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import type { Coupon } from "@/types";
import { toast } from "sonner";

interface FormValues {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderValue: number | "";
  maxDiscount: number | "";
  usageLimit: number | "";
  active: boolean;
  expiresAt: string;
}

export function CouponForm({ open, coupon, onClose, onSaved }: {
  open: boolean; coupon: Coupon | null; onClose: () => void; onSaved: () => void;
}) {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: { code: "", type: "percentage", value: 10, minOrderValue: "", maxDiscount: "", usageLimit: "", active: true, expiresAt: "" },
  });

  const type = watch("type");

  useEffect(() => {
    if (coupon) {
      reset({
        code: coupon.code, type: coupon.type, value: coupon.value,
        minOrderValue: coupon.minOrderValue ?? "",
        maxDiscount: coupon.maxDiscount ?? "",
        usageLimit: coupon.usageLimit ?? "",
        active: coupon.active,
        expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "",
      });
    } else {
      reset({ code: "", type: "percentage", value: 10, minOrderValue: "", maxDiscount: "", usageLimit: "", active: true, expiresAt: "" });
    }
  }, [coupon, reset, open]);

  async function onSubmit(values: FormValues) {
    const supabase = createClient();
    const payload = {
      code: values.code.toUpperCase().trim(),
      type: values.type,
      value: Number(values.value),
      min_order_value: values.minOrderValue !== "" ? Number(values.minOrderValue) : null,
      max_discount: values.maxDiscount !== "" ? Number(values.maxDiscount) : null,
      usage_limit: values.usageLimit !== "" ? Number(values.usageLimit) : null,
      active: values.active,
      expires_at: values.expiresAt ? new Date(values.expiresAt).toISOString() : null,
    };

    const { error } = coupon
      ? await supabase.from("coupons").update(payload).eq("id", coupon.id)
      : await supabase.from("coupons").insert(payload);

    if (error) { toast.error(error.message); return; }
    toast.success(coupon ? "Coupon updated" : "Coupon created");
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
            {coupon ? "Edit Coupon" : "Create Coupon"}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-charcoal"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <Input
            label="Coupon Code"
            required
            placeholder="e.g. SUMMER20"
            hint="Will be saved in uppercase"
            error={errors.code?.message}
            style={{ textTransform: "uppercase" }}
            {...register("code", { required: "Required" })}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-charcoal">Discount Type</label>
            <div className="grid grid-cols-2 gap-3">
              {(["percentage", "fixed"] as const).map((t) => (
                <label
                  key={t}
                  className={`flex items-center gap-2 border rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                    type === t ? "border-saffron bg-saffron/5" : "border-border hover:border-muted"
                  }`}
                >
                  <input type="radio" value={t} className="accent-saffron" {...register("type")} />
                  <span className="text-sm font-medium text-charcoal capitalize">{t === "percentage" ? "% Off" : "₹ Fixed"}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={type === "percentage" ? "Discount (%)" : "Discount (₹)"}
              type="number"
              required
              error={errors.value?.message}
              {...register("value", { required: "Required", min: { value: 1, message: "Must be > 0" } })}
            />
            {type === "percentage" && (
              <Input label="Max Discount (₹)" type="number" placeholder="Optional cap"
                {...register("maxDiscount")} />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Min Order Value (₹)" type="number" placeholder="No minimum"
              {...register("minOrderValue")} />
            <Input label="Usage Limit" type="number" placeholder="Unlimited"
              {...register("usageLimit")} />
          </div>

          <Input
            label="Expiry Date"
            type="date"
            hint="Leave empty for no expiry"
            {...register("expiresAt")}
          />

          <div className="flex items-center gap-3">
            <input id="coupon-active" type="checkbox" className="w-4 h-4 accent-saffron" {...register("active")} />
            <label htmlFor="coupon-active" className="text-sm font-medium text-charcoal cursor-pointer">Active (usable by customers)</label>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-border flex gap-3 shrink-0">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" variant="primary" loading={isSubmitting} className="flex-1"
            onClick={handleSubmit(onSubmit)}>
            {coupon ? "Save Changes" : "Create Coupon"}
          </Button>
        </div>
      </div>
    </div>
  );
}
