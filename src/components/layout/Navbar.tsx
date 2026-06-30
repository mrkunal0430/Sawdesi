"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, User, Menu, X, Leaf, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/constants";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { Suspense } from "react";

function NavbarInner() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { itemCount } = useCart();
  const { isAuthenticated, profile, openLoginModal, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Handle ?login=true from middleware redirect
  useEffect(() => {
    if (searchParams.get("login") === "true") {
      const redirect = searchParams.get("redirect") ?? undefined;
      openLoginModal(
        redirect ? () => router.push(redirect) : undefined
      );
    }
  }, [searchParams, openLoginModal, router]);

  const initials = profile?.fullName
    ? profile.fullName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : null;

  const handleAccountClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openLoginModal(() => router.push("/account"));
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          scrolled
            ? "bg-cream/95 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-cream border-b border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-forest rounded-lg flex items-center justify-center group-hover:bg-forest-dark transition-colors">
                <Leaf size={16} className="text-cream" />
              </div>
              <span
                className="text-2xl font-bold text-charcoal tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Sawdesi
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "text-forest-dark bg-forest/10"
                        : "text-charcoal hover:text-forest hover:bg-forest/8"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Account button */}
              <Link
                href="/account"
                onClick={handleAccountClick}
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl text-charcoal hover:bg-cream-dark transition-colors"
                aria-label="Account"
              >
                {isAuthenticated && initials ? (
                  <div className="w-7 h-7 rounded-full bg-saffron flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                ) : (
                  <User size={20} />
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center w-10 h-10 rounded-xl text-charcoal hover:bg-cream-dark transition-colors"
                aria-label={`Cart (${itemCount} items)`}
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-forest text-cream text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center min-w-[18px] min-h-[18px] px-1"
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </motion.span>
                )}
              </Link>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-charcoal hover:bg-cream-dark transition-colors"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-50 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-72 bg-cream z-50 flex flex-col shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-forest rounded-lg flex items-center justify-center">
                    <Leaf size={14} className="text-cream" />
                  </div>
                  <span
                    className="text-xl font-bold text-charcoal"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Sawdesi
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-cream-dark transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex flex-col p-4 gap-1 flex-1">
                {NAV_LINKS.map((link, i) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "block px-4 py-3 rounded-xl text-base font-medium transition-colors",
                          isActive
                            ? "text-forest-dark bg-forest/10"
                            : "text-charcoal hover:bg-cream-dark"
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-border flex gap-3">
                <Link
                  href="/account"
                  onClick={handleAccountClick}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-medium text-charcoal hover:bg-cream-dark transition-colors"
                >
                  {isAuthenticated && initials ? (
                    <div className="w-5 h-5 rounded-full bg-saffron flex items-center justify-center text-white text-[10px] font-bold">
                      {initials}
                    </div>
                  ) : (
                    <User size={16} />
                  )}
                  {isAuthenticated ? "Account" : "Sign In"}
                </Link>
                {isAuthenticated ? (
                  <button
                    onClick={handleSignOut}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/cart"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-forest text-cream text-sm font-medium hover:bg-forest-dark transition-colors"
                  >
                    <ShoppingBag size={16} />
                    Cart {itemCount > 0 && `(${itemCount})`}
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={<div className="h-16 bg-cream border-b border-transparent" />}>
      <NavbarInner />
    </Suspense>
  );
}
