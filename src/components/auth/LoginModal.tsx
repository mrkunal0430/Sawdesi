"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, ArrowRight, Leaf, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Step = "phone" | "otp" | "success";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, pendingAction } = useAuth();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isLoginModalOpen) {
      setStep("phone");
      setPhone("");
      setOtp(Array(OTP_LENGTH).fill(""));
      setError(null);
      setIsLoading(false);
      setCooldown(0);
    }
  }, [isLoginModalOpen]);

  // Focus phone input on open
  useEffect(() => {
    if (isLoginModalOpen && step === "phone") {
      setTimeout(() => phoneInputRef.current?.focus(), 200);
    }
  }, [isLoginModalOpen, step]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const formatPhoneForSupabase = (num: string) => {
    const cleaned = num.replace(/\D/g, "");
    // If it starts with 91 and is 12 digits, it already has the code
    if (cleaned.startsWith("91") && cleaned.length === 12) return `+${cleaned}`;
    // Otherwise prepend +91
    return `+91${cleaned}`;
  };

  const handleSendOtp = async () => {
    setError(null);
    const cleaned = phone.replace(/\D/g, "");

    if (cleaned.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();
    const formattedPhone = formatPhoneForSupabase(cleaned);

    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });

    setIsLoading(false);

    if (otpError) {
      setError(otpError.message || "Failed to send OTP. Please try again.");
      return;
    }

    setStep("otp");
    setCooldown(RESEND_COOLDOWN);
    // Focus first OTP input
    setTimeout(() => otpRefs.current[0]?.focus(), 200);
  };

  const handleVerifyOtp = useCallback(async (otpValue: string[]) => {
    const code = otpValue.join("");
    if (code.length !== OTP_LENGTH) return;

    setError(null);
    setIsLoading(true);
    const supabase = createClient();
    const cleaned = phone.replace(/\D/g, "");
    const formattedPhone = formatPhoneForSupabase(cleaned);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: code,
      type: "sms",
    });

    setIsLoading(false);

    if (verifyError) {
      setError("Invalid or expired OTP. Please try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
      return;
    }

    setStep("success");

    // Run pending action if any, then close
    setTimeout(() => {
      if (pendingAction) {
        pendingAction();
      }
      closeLoginModal();
    }, 1500);
  }, [phone, pendingAction, closeLoginModal]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
      digits.forEach((d, i) => {
        if (index + i < OTP_LENGTH) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, OTP_LENGTH - 1);
      otpRefs.current[nextIndex]?.focus();

      if (newOtp.every((d) => d !== "")) {
        handleVerifyOtp(newOtp);
      }
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== "")) {
      handleVerifyOtp(newOtp);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setError(null);
    setOtp(Array(OTP_LENGTH).fill(""));
    setIsLoading(true);
    const supabase = createClient();
    const cleaned = phone.replace(/\D/g, "");
    const formattedPhone = formatPhoneForSupabase(cleaned);

    const { error: resendError } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });

    setIsLoading(false);

    if (resendError) {
      setError("Failed to resend OTP. Please try again.");
      return;
    }

    setCooldown(RESEND_COOLDOWN);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleClose = () => {
    // Store dismissal in localStorage so auto-popup won't show again
    try {
      localStorage.setItem("sawdesi-login-dismissed", "true");
    } catch {
      // ignore
    }
    closeLoginModal();
  };

  if (!isLoginModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-[420px] bg-cream rounded-3xl border border-border shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-cream-dark/60 text-muted hover:text-charcoal hover:bg-cream-dark transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div className="px-8 pt-8 pb-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-9 h-9 bg-forest rounded-xl flex items-center justify-center">
                <Leaf size={18} className="text-cream" />
              </div>
              <span
                className="text-2xl font-bold text-charcoal tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Sawdesi
              </span>
            </div>

            <AnimatePresence mode="wait">
              {step === "phone" && (
                <motion.div
                  key="phone-header"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h2
                    className="text-xl font-bold text-charcoal mb-1"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Welcome to Sawdesi
                  </h2>
                  <p className="text-sm text-muted">
                    Enter your mobile number to continue
                  </p>
                </motion.div>
              )}

              {step === "otp" && (
                <motion.div
                  key="otp-header"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h2
                    className="text-xl font-bold text-charcoal mb-1"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Verify OTP
                  </h2>
                  <p className="text-sm text-muted">
                    Sent to{" "}
                    <span className="font-semibold text-charcoal">
                      +91 {phone}
                    </span>
                  </p>
                </motion.div>
              )}

              {step === "success" && (
                <motion.div
                  key="success-header"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={32} className="text-forest" />
                  </div>
                  <h2
                    className="text-xl font-bold text-charcoal"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Welcome! 🌿
                  </h2>
                  <p className="text-sm text-muted mt-1">
                    You&apos;re all set to explore Sawdesi
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Content */}
          <div className="px-8 pb-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4"
              >
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {/* Step 1: Phone */}
              {step === "phone" && (
                <motion.div
                  key="phone-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative mb-4">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-sm text-muted pointer-events-none">
                      <Phone size={14} />
                      <span className="font-medium text-charcoal">+91</span>
                      <span className="text-border">|</span>
                    </div>
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setPhone(val);
                        setError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendOtp();
                      }}
                      placeholder="Enter 10-digit number"
                      className="w-full h-12 rounded-xl border border-border bg-white pl-[90px] pr-4 text-sm text-charcoal placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest transition-colors"
                      maxLength={10}
                    />
                  </div>

                  <Button
                    onClick={handleSendOtp}
                    size="lg"
                    variant="primary"
                    className="w-full gap-2"
                    loading={isLoading}
                    disabled={phone.replace(/\D/g, "").length !== 10}
                  >
                    Send OTP <ArrowRight size={16} />
                  </Button>

                  <p className="text-xs text-muted text-center mt-4">
                    By continuing, you agree to our{" "}
                    <a
                      href="/terms-of-use"
                      className="text-forest hover:underline"
                    >
                      Terms
                    </a>{" "}
                    &{" "}
                    <a
                      href="/privacy-policy"
                      className="text-forest hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </motion.div>
              )}

              {/* Step 2: OTP */}
              {step === "otp" && (
                <motion.div
                  key="otp-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-center gap-2.5 mb-5">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          otpRefs.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={i === 0 ? OTP_LENGTH : 1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
                          if (pasted) handleOtpChange(i, pasted);
                        }}
                        className={`w-11 h-13 rounded-xl border text-center text-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest ${
                          digit
                            ? "border-forest bg-forest/5 text-charcoal"
                            : "border-border bg-white text-charcoal"
                        }`}
                      />
                    ))}
                  </div>

                  {isLoading && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted mb-4">
                      <Loader2 size={14} className="animate-spin" />
                      Verifying...
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => {
                        setStep("phone");
                        setError(null);
                        setOtp(Array(OTP_LENGTH).fill(""));
                      }}
                      className="text-sm text-forest font-medium hover:text-forest-dark transition-colors"
                    >
                      ← Change number
                    </button>

                    <button
                      onClick={handleResendOtp}
                      disabled={cooldown > 0 || isLoading}
                      className={`text-sm font-medium transition-colors ${
                        cooldown > 0
                          ? "text-muted cursor-not-allowed"
                          : "text-saffron-dark hover:text-saffron cursor-pointer"
                      }`}
                    >
                      {cooldown > 0
                        ? `Resend in ${cooldown}s`
                        : "Resend OTP"}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Success — auto-closes */}
              {step === "success" && (
                <motion.div
                  key="success-step"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-2"
                >
                  <div className="h-1 bg-cream-dark rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5 }}
                      className="h-full bg-forest rounded-full"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
