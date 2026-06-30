"use client";

import { MapPin, Phone, Star, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Address } from "@/types";

interface AddressCardProps {
  address: Address;
  selected?: boolean;
  selectable?: boolean;
  onSelect?: (address: Address) => void;
  onEdit?: (address: Address) => void;
  onDelete?: (address: Address) => void;
  onSetDefault?: (address: Address) => void;
}

export function AddressCard({
  address,
  selected,
  selectable,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  const fullAddressLine = [
    address.houseNumber,
    address.street,
    address.landmark,
    address.city,
    address.state,
    address.country,
    address.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 transition-all duration-200",
        selectable && "cursor-pointer",
        selected
          ? "border-forest bg-forest/5 shadow-sm"
          : "border-border bg-white hover:border-saffron/40"
      )}
      onClick={() => {
        if (selectable && onSelect) onSelect(address);
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {selectable && (
            <div
              className={cn(
                "w-4.5 h-4.5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center transition-colors",
                selected ? "border-forest" : "border-border"
              )}
            >
              {selected && (
                <div className="w-2 h-2 rounded-full bg-forest" />
              )}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-semibold text-charcoal text-sm">
                {address.fullName}
              </span>
              {address.isDefault && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-saffron/15 text-saffron-dark">
                  <Star size={9} />
                  Default
                </span>
              )}
            </div>

            <p className="text-sm text-muted leading-relaxed">
              <MapPin
                size={12}
                className="inline mr-1 -mt-0.5 text-muted/70"
              />
              {fullAddressLine}
            </p>

            <p className="text-sm text-muted mt-1">
              <Phone size={12} className="inline mr-1 -mt-0.5 text-muted/70" />
              +91 {address.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(address);
              }}
              className="p-1.5 rounded-lg text-muted hover:text-charcoal hover:bg-cream-dark transition-colors"
              aria-label="Edit address"
            >
              <Pencil size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(address);
              }}
              className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
              aria-label="Delete address"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {onSetDefault && !address.isDefault && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSetDefault(address);
          }}
          className="mt-3 text-xs text-forest font-medium hover:text-forest-dark transition-colors"
        >
          Set as default
        </button>
      )}
    </div>
  );
}
