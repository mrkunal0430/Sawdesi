"use client";

import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Address } from "@/types";

export type AddressFormData = Omit<Address, "id" | "userId" | "createdAt">;

interface AddressFormProps {
  defaultValues?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function AddressForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel = "Save Address",
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    defaultValues: {
      country: "India",
      isDefault: false,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          required
          placeholder="Rahul Sharma"
          error={errors.fullName?.message}
          {...register("fullName", { required: "Full name is required" })}
        />
        <Input
          label="Phone Number"
          required
          placeholder="9876543210"
          error={errors.phone?.message}
          {...register("phone", {
            required: "Phone is required",
            pattern: {
              value: /^\d{10}$/,
              message: "Enter a valid 10-digit number",
            },
          })}
        />
      </div>

      <Input
        label="House / Flat No."
        required
        placeholder="A-103, Green Residency"
        error={errors.houseNumber?.message}
        {...register("houseNumber", { required: "House number is required" })}
      />

      <Input
        label="Street / Area"
        required
        placeholder="MG Road, Bandra"
        error={errors.street?.message}
        {...register("street", { required: "Street is required" })}
      />

      <Input
        label="Landmark"
        placeholder="Near City Mall (optional)"
        {...register("landmark")}
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <Input
          label="City"
          required
          placeholder="Mumbai"
          error={errors.city?.message}
          {...register("city", { required: "City is required" })}
        />
        <Input
          label="State"
          required
          placeholder="Maharashtra"
          error={errors.state?.message}
          {...register("state", { required: "State is required" })}
        />
        <Input
          label="PIN Code"
          required
          placeholder="400001"
          error={errors.pincode?.message}
          {...register("pincode", {
            required: "PIN code is required",
            pattern: { value: /^[1-9][0-9]{5}$/, message: "Invalid PIN code" },
          })}
        />
      </div>

      <Input
        label="Country"
        required
        error={errors.country?.message}
        {...register("country", { required: "Country is required" })}
      />

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="accent-forest w-4 h-4"
          {...register("isDefault")}
        />
        <span className="text-sm text-charcoal">
          Set as default address
        </span>
      </label>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading && <Loader2 size={14} className="animate-spin" />}
          {submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
