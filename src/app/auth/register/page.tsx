"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { Leaf, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  terms: boolean;
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Register:", data);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-forest rounded-xl flex items-center justify-center">
            <Leaf size={20} className="text-cream" />
          </div>
          <span className="text-3xl font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>
            Sawdesi
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-border p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-charcoal mb-1 text-center" style={{ fontFamily: "var(--font-playfair)" }}>
            Join the family
          </h1>
          <p className="text-muted text-sm text-center mb-8">Create your Sawdesi account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              required
              placeholder="Rahul Sharma"
              error={errors.name?.message}
              {...register("name", { required: "Name is required" })}
            />
            <Input
              label="Email"
              type="email"
              required
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
              })}
            />
            <Input
              label="Phone Number"
              type="tel"
              required
              placeholder="98XXXXXXXX"
              error={errors.phone?.message}
              {...register("phone", {
                required: "Phone is required",
                pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid Indian phone number" },
              })}
            />
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Min. 8 characters"
              hint="Use a strong password with letters, numbers & symbols"
              error={errors.password?.message}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Minimum 8 characters" },
              })}
            />

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="mt-0.5 accent-saffron"
                {...register("terms", { required: "Please accept the terms" })}
              />
              <span className="text-sm text-muted">
                I agree to the{" "}
                <Link href="/terms-of-use" className="text-forest font-medium hover:underline">Terms of Use</Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="text-forest font-medium hover:underline">Privacy Policy</Link>
              </span>
            </label>
            {errors.terms && <p className="text-xs text-red-500 -mt-2">{errors.terms.message}</p>}

            <Button type="submit" size="lg" variant="primary" className="w-full" loading={isSubmitting}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-forest font-semibold hover:text-forest-dark">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
