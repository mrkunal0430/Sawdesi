"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Camera, Mail, Phone, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface ProfileForm {
  fullName: string;
  email: string;
}

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    values: {
      fullName: profile?.fullName ?? "",
      email: profile?.email ?? "",
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    setIsSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Session expired. Please log in again.");
      setIsSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: data.fullName,
        email: data.email,
        // If email changed, mark as unverified
        ...(data.email !== profile?.email ? { email_verified: false } : {}),
      })
      .eq("id", user.id);

    if (error) {
      toast.error("Failed to update profile. Please try again.");
    } else {
      toast.success("Profile updated!");
      await refreshProfile();
    }
    setIsSaving(false);
  };

  const handleSendVerification = async () => {
    if (!profile?.email) {
      toast.error("Please add an email address first.");
      return;
    }
    setIsSendingVerification(true);
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      email: profile.email,
    });

    if (error) {
      toast.error("Failed to send verification email.");
    } else {
      toast.success("Verification email sent! Check your inbox.");
    }
    setIsSendingVerification(false);
  };

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB.");
      return;
    }

    setAvatarUploading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setAvatarUploading(false);
      return;
    }

    // Upload to Supabase Storage 'avatars' bucket
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      toast.error("Failed to upload image. Please try again.");
      setAvatarUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const avatarUrl = publicUrlData.publicUrl;

    await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", user.id);

    toast.success("Profile picture updated!");
    await refreshProfile();
    setAvatarUploading(false);
  };

  const initials = profile?.fullName
    ? profile.fullName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <h2
        className="text-xl font-bold text-charcoal mb-6"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        My Profile
      </h2>

      {/* Avatar */}
      <div className="flex items-center gap-5 mb-8 pb-6 border-b border-border">
        <div className="relative">
          {profile?.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-saffron flex items-center justify-center text-white text-2xl font-bold">
              {initials}
            </div>
          )}
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 w-7 h-7 bg-forest rounded-full flex items-center justify-center cursor-pointer hover:bg-forest-dark transition-colors border-2 border-white"
            title="Change photo"
          >
            {avatarUploading ? (
              <Loader2 size={12} className="text-cream animate-spin" />
            ) : (
              <Camera size={12} className="text-cream" />
            )}
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleAvatarChange}
          />
        </div>
        <div>
          <p className="font-semibold text-charcoal">
            {profile?.fullName || "Set your name"}
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-muted">
            <Phone size={13} />
            <span>+91 {profile?.phone ?? ""}</span>
            <span className="text-xs bg-forest/10 text-forest px-1.5 py-0.5 rounded-full font-medium ml-1">
              Verified
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Full Name"
          placeholder="Rahul Sharma"
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        {/* Email with verification badge */}
        <div>
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            hint="Used for order notifications and updates"
            error={errors.email?.message}
            leftIcon={<Mail size={14} />}
            {...register("email", {
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
          />

          {profile?.email && (
            <div className="mt-2 flex items-center gap-2">
              {profile.emailVerified ? (
                <span className="inline-flex items-center gap-1 text-xs text-forest font-medium">
                  <CheckCircle2 size={12} />
                  Email verified
                </span>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1 text-xs text-saffron-dark font-medium">
                    <AlertCircle size={12} />
                    Unverified
                  </span>
                  <button
                    type="button"
                    onClick={handleSendVerification}
                    disabled={isSendingVerification}
                    className="text-xs text-forest underline hover:text-forest-dark transition-colors disabled:opacity-50"
                  >
                    {isSendingVerification
                      ? "Sending..."
                      : "Send verification email"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Phone — read-only */}
        <div>
          <label className="text-sm font-medium text-charcoal block mb-1.5">
            Mobile Number
          </label>
          <div className="h-11 rounded-xl border border-border bg-cream-dark px-4 flex items-center gap-2 text-sm text-muted">
            <Phone size={14} />
            +91 {profile?.phone ?? ""}
            <span className="ml-auto text-xs text-forest font-medium">
              Verified
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Phone number cannot be changed here.
          </p>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isSaving}
            disabled={!isDirty}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
