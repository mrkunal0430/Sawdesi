"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

const PROMPT_DELAY_MS = 15_000; // 15 seconds
const STORAGE_KEY = "sawdesi-login-dismissed";

/**
 * Auto-popup component that triggers the login modal after a delay.
 * - Only shows if user is NOT authenticated
 * - Only shows ONCE per browser/device (stored in localStorage)
 * - Dismissing it stores the preference permanently
 */
export function LoginPrompt() {
  const { isAuthenticated, isLoading, openLoginModal } = useAuth();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Don't show if loading or already authenticated
    if (isLoading || isAuthenticated) return;

    // Don't show if already dismissed
    try {
      if (localStorage.getItem(STORAGE_KEY) === "true") return;
    } catch {
      // localStorage not available, skip
      return;
    }

    timerRef.current = setTimeout(() => {
      // Double-check before opening
      try {
        if (localStorage.getItem(STORAGE_KEY) === "true") return;
      } catch {
        return;
      }
      openLoginModal();
    }, PROMPT_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isLoading, isAuthenticated, openLoginModal]);

  return null;
}
