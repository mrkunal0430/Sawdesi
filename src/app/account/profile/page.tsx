"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
}

export default function ProfilePage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileForm>({
    defaultValues: { name: "Rahul Sharma", email: "rahul@example.com", phone: "9876543210" },
  });

  const onSubmit = async (data: ProfileForm) => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white border-b border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-muted">
          <Link href="/account" className="hover:text-charcoal">Account</Link>
          <ChevronRight size={14} />
          <span className="text-charcoal font-medium">Profile</span>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold text-charcoal mb-8" style={{ fontFamily: "var(--font-playfair)" }}>My Profile</h1>

        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8 bg-white rounded-2xl border border-border p-6">
          <div className="w-16 h-16 rounded-full bg-saffron flex items-center justify-center text-white text-2xl font-bold">R</div>
          <div>
            <p className="font-semibold text-charcoal">Rahul Sharma</p>
            <p className="text-sm text-muted">Member since May 2024</p>
            <button className="text-xs text-saffron font-medium hover:text-saffron-dark mt-1">Change photo</button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-border p-6 space-y-5">
          <h2 className="font-bold text-charcoal text-lg" style={{ fontFamily: "var(--font-playfair)" }}>Personal Information</h2>
          <Input
            label="Full Name"
            required
            error={errors.name?.message}
            {...register("name", { required: "Name is required" })}
          />
          <Input
            label="Email Address"
            type="email"
            required
            error={errors.email?.message}
            hint="Changing your email will require re-verification"
            {...register("email", { required: "Email is required" })}
          />
          <Input
            label="Phone Number"
            type="tel"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <div className="pt-2">
            <Button type="submit" variant="primary" loading={isSubmitting}>Save Changes</Button>
          </div>
        </form>

        <div className="bg-white rounded-2xl border border-border p-6 mt-5">
          <h2 className="font-bold text-charcoal text-lg mb-4" style={{ fontFamily: "var(--font-playfair)" }}>Security</h2>
          <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div>
              <p className="text-sm font-semibold text-charcoal">Password</p>
              <p className="text-xs text-muted">Last changed 3 months ago</p>
            </div>
            <Button variant="ghost" size="sm">Change Password</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
