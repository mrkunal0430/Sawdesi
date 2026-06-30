"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  Tag,
  BookOpen,
  MessageSquare,
  BarChart3,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Inventory", href: "/admin/inventory", icon: BarChart3 },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { label: "Coupons", href: "/admin/coupons", icon: Tag },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
  { label: "Admins", href: "/admin/admins", icon: ShieldCheck },
];

function NavLink({
  item,
  onClick,
}: {
  item: (typeof navItems)[0];
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
        active
          ? "bg-saffron/20 text-saffron-dark"
          : "text-cream/60 hover:text-cream hover:bg-white/10"
      )}
    >
      <item.icon size={16} />
      {item.label}
    </Link>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-4 mb-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xl font-bold text-cream"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Sawdesi
          </span>
          <Badge variant="saffron" size="sm">
            Admin
          </Badge>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-cream/60 hover:text-cream md:hidden"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-2 space-y-0.5">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} onClick={onClose} />
        ))}
      </nav>

      <div className="px-2 pb-4 pt-2 border-t border-white/10 mt-4 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-cream/50 hover:text-cream/80 transition-colors"
        >
          ← View Store
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-cream/50 hover:text-red-300 transition-colors"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-forest-dark min-h-screen shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile: top bar with hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-forest-dark flex items-center justify-between px-4 py-3 h-14">
        <div className="flex items-center gap-2">
          <span
            className="text-lg font-bold text-cream"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Sawdesi
          </span>
          <Badge variant="saffron" size="sm">
            Admin
          </Badge>
        </div>
        <button onClick={() => setMobileOpen(true)} className="text-cream">
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 bg-forest-dark h-full shadow-2xl">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Mobile spacer */}
      <div className="md:hidden h-14 shrink-0 w-full" />
    </>
  );
}
