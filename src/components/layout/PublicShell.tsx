"use client";

import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LoginModal } from "@/components/auth/LoginModal";
import { LoginPrompt } from "@/components/auth/LoginPrompt";

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* Auth modals — rendered globally so any component can trigger them */}
      <LoginModal />
      <LoginPrompt />
    </>
  );
}
