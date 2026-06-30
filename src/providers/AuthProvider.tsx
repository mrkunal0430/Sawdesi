"use client";

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

export interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  /** Callback to run after successful login (e.g. add-to-cart retry) */
  pendingAction: (() => void) | null;
  openLoginModal: (onSuccess?: () => void) => void;
  closeLoginModal: () => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  isLoginModalOpen: false,
  pendingAction: null,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const supabase = createClient();

  const fetchProfile = useCallback(
    async (userId: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (data) {
        setProfile({
          id: data.id,
          phone: data.phone,
          fullName: data.full_name ?? "",
          email: data.email ?? "",
          emailVerified: data.email_verified ?? false,
          avatarUrl: data.avatar_url ?? "",
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
      }
    },
    // supabase client is stable across renders from createBrowserClient
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  // Initialize session & subscribe to changes
  useEffect(() => {
    const initSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      }

      setIsLoading(false);
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (event === "SIGNED_IN" && newSession?.user) {
        await fetchProfile(newSession.user.id);
      } else if (event === "SIGNED_OUT") {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openLoginModal = useCallback((onSuccess?: () => void) => {
    if (onSuccess) {
      setPendingAction(() => onSuccess);
    }
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
    setPendingAction(null);
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: AuthContextValue = {
    user,
    profile,
    session,
    isLoading,
    isAuthenticated: !!user,
    isLoginModalOpen,
    pendingAction,
    openLoginModal,
    closeLoginModal,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
