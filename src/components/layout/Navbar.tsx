"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, User, Menu, X, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/constants";
import { useCart } from "@/hooks/useCart";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount } = useCart();

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
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

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
                        ? "text-saffron-dark bg-saffron/10"
                        : "text-charcoal hover:text-saffron-dark hover:bg-saffron/8"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/account"
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl text-charcoal hover:bg-cream-dark transition-colors"
                aria-label="Account"
              >
                <User size={20} />
              </Link>
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
                    className="absolute -top-0.5 -right-0.5 bg-saffron text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center min-w-[18px] min-h-[18px] px-1"
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </motion.span>
                )}
              </Link>
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
                            ? "text-saffron-dark bg-saffron/10"
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
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-medium text-charcoal hover:bg-cream-dark transition-colors"
                >
                  <User size={16} />
                  Account
                </Link>
                <Link
                  href="/cart"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-saffron text-white text-sm font-medium hover:bg-saffron-dark transition-colors"
                >
                  <ShoppingBag size={16} />
                  Cart {itemCount > 0 && `(${itemCount})`}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
