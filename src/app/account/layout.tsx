"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Settings, MapPin, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const accountNav = [
  { label: "My Account", href: "/account", icon: Settings, exact: true },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Profile", href: "/account/profile", icon: Settings },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const initials = profile?.fullName
    ? profile.fullName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : profile?.phone?.slice(-2) ?? "?";

  return (
    <div className="min-h-screen bg-cream">
      {/* Profile header */}
      <div className="bg-white border-b border-border py-6 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName || "Profile"}
                className="w-12 h-12 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-saffron flex items-center justify-center text-white text-lg font-bold">
                {initials}
              </div>
            )}
            <div>
              <h1
                className="text-xl font-bold text-charcoal"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {profile?.fullName
                  ? `Welcome, ${profile.fullName.split(" ")[0]}!`
                  : "My Account"}
              </h1>
              <p className="text-sm text-muted">
                +91 {profile?.phone ?? ""}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="hidden sm:flex items-center gap-1.5 text-sm text-muted hover:text-red-500 transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid md:grid-cols-[220px_1fr] gap-8">
        {/* Sidebar nav */}
        <aside>
          <nav className="bg-white rounded-2xl border border-border overflow-hidden">
            {accountNav.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-3.5 text-sm font-medium border-b border-border last:border-0 transition-colors",
                    isActive
                      ? "bg-forest/8 text-forest-dark"
                      : "text-charcoal hover:bg-cream-dark"
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <item.icon size={16} />
                    {item.label}
                  </span>
                  {isActive && <ChevronRight size={14} className="text-forest" />}
                </Link>
              );
            })}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-4 py-3.5 text-sm font-medium text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
