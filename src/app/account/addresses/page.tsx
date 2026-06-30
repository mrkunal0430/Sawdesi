"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AddressForm, type AddressFormData } from "@/components/account/AddressForm";
import { AddressCard } from "@/components/account/AddressCard";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Address } from "@/types";

function mapRow(row: Record<string, unknown>): Address {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    fullName: row.full_name as string,
    phone: row.phone as string,
    houseNumber: row.house_number as string,
    street: row.street as string,
    landmark: (row.landmark as string) ?? undefined,
    city: row.city as string,
    state: row.state as string,
    country: row.country as string,
    pincode: row.pincode as string,
    isDefault: row.is_default as boolean,
    createdAt: row.created_at as string,
  };
}

type ModalState =
  | { mode: "closed" }
  | { mode: "add" }
  | { mode: "edit"; address: Address };

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });

  const fetchAddresses = useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: true });

    if (data) setAddresses(data.map(mapRow));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleAdd = async (data: AddressFormData) => {
    setIsSubmitting(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please log in to save addresses.");
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from("addresses").insert({
      user_id: user.id,
      full_name: data.fullName,
      phone: data.phone,
      house_number: data.houseNumber,
      street: data.street,
      landmark: data.landmark ?? null,
      city: data.city,
      state: data.state,
      country: data.country,
      pincode: data.pincode,
      is_default: data.isDefault,
    });

    if (error) {
      toast.error("Failed to save address. Please try again.");
    } else {
      toast.success("Address saved!");
      setModal({ mode: "closed" });
      await fetchAddresses();
    }
    setIsSubmitting(false);
  };

  const handleEdit = async (data: AddressFormData) => {
    if (modal.mode !== "edit") return;
    setIsSubmitting(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("addresses")
      .update({
        full_name: data.fullName,
        phone: data.phone,
        house_number: data.houseNumber,
        street: data.street,
        landmark: data.landmark ?? null,
        city: data.city,
        state: data.state,
        country: data.country,
        pincode: data.pincode,
        is_default: data.isDefault,
      })
      .eq("id", modal.address.id);

    if (error) {
      toast.error("Failed to update address.");
    } else {
      toast.success("Address updated!");
      setModal({ mode: "closed" });
      await fetchAddresses();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (address: Address) => {
    if (!confirm("Delete this address?")) return;
    const supabase = createClient();
    await supabase.from("addresses").delete().eq("id", address.id);
    toast.success("Address deleted.");
    await fetchAddresses();
  };

  const handleSetDefault = async (address: Address) => {
    const supabase = createClient();
    // Unset all defaults first
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .neq("id", address.id);
    // Set this one as default
    await supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", address.id);
    toast.success("Default address updated.");
    await fetchAddresses();
  };

  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MapPin size={20} className="text-forest" />
          <h2
            className="text-xl font-bold text-charcoal"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Saved Addresses
          </h2>
        </div>
        <Button
          onClick={() => setModal({ mode: "add" })}
          variant="primary"
          size="sm"
          className="gap-2"
        >
          <Plus size={14} />
          Add New
        </Button>
      </div>

      {/* Add / Edit Form */}
      <AnimatePresence>
        {modal.mode !== "closed" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl border border-border p-6 mb-6 overflow-hidden"
          >
            <h3 className="font-semibold text-charcoal mb-4">
              {modal.mode === "add" ? "Add New Address" : "Edit Address"}
            </h3>
            <AddressForm
              defaultValues={
                modal.mode === "edit"
                  ? {
                      fullName: modal.address.fullName,
                      phone: modal.address.phone,
                      houseNumber: modal.address.houseNumber,
                      street: modal.address.street,
                      landmark: modal.address.landmark,
                      city: modal.address.city,
                      state: modal.address.state,
                      country: modal.address.country,
                      pincode: modal.address.pincode,
                      isDefault: modal.address.isDefault,
                    }
                  : undefined
              }
              onSubmit={modal.mode === "add" ? handleAdd : handleEdit}
              onCancel={() => setModal({ mode: "closed" })}
              isLoading={isSubmitting}
              submitLabel={
                modal.mode === "add" ? "Save Address" : "Update Address"
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Addresses List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="animate-spin text-muted" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-10 text-center">
          <div className="w-14 h-14 bg-cream-dark rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin size={24} className="text-muted" />
          </div>
          <p className="font-semibold text-charcoal mb-1">No addresses saved</p>
          <p className="text-sm text-muted mb-5">
            Add your first delivery address to make checkout faster.
          </p>
          <Button
            onClick={() => setModal({ mode: "add" })}
            variant="primary"
            size="sm"
            className="gap-2"
          >
            <Plus size={14} />
            Add Address
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {addresses.map((address) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
              >
                <AddressCard
                  address={address}
                  onEdit={(a) => setModal({ mode: "edit", address: a })}
                  onDelete={handleDelete}
                  onSetDefault={handleSetDefault}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
