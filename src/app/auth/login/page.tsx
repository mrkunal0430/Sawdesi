"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { Leaf, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Login:", data);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
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
            Welcome back
          </h1>
          <p className="text-muted text-sm text-center mb-8">Sign in to your Sawdesi account</p>

          {/* Google OAuth */}
          <button className="w-full h-11 flex items-center justify-center gap-3 border border-border rounded-xl text-sm font-medium text-charcoal hover:bg-cream transition-colors mb-5">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted">or continue with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              label="Password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              error={errors.password?.message}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              {...register("password", { required: "Password is required", minLength: { value: 8, message: "Minimum 8 characters" } })}
            />
            <div className="flex justify-end">
              <Link href="/auth/forgot-password" className="text-xs text-saffron hover:text-saffron-dark font-medium">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" size="lg" variant="primary" className="w-full" loading={isSubmitting}>
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            New to Sawdesi?{" "}
            <Link href="/auth/register" className="text-forest font-semibold hover:text-forest-dark">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
