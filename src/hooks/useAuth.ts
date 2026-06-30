"use client";

import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "@/providers/AuthProvider";

/**
 * Access auth state and actions.
 * Must be used inside <AuthProvider>.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * Helper: run an action that requires authentication.
 * If the user is not logged in, opens the login modal and queues the action.
 * If logged in, runs the action immediately.
 */
export function useRequireAuth() {
  const { isAuthenticated, openLoginModal } = useAuth();

  return (action: () => void) => {
    if (isAuthenticated) {
      action();
    } else {
      openLoginModal(action);
    }
  };
}
