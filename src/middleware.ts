import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/middleware";
import { createAdminClient } from "@/lib/supabase/admin";

export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse } = createClient(request);
  const { pathname } = request.nextUrl;

  // ── 1. Auth callback — always pass through ───────────────────
  if (pathname.startsWith("/auth/callback")) {
    return supabaseResponse;
  }

  // ── 2. Admin login & forbidden — always pass through ────────
  if (
    pathname === "/admin/login" ||
    pathname === "/admin/forbidden"
  ) {
    return supabaseResponse;
  }

  // ── 3. Admin routes — full server-side verification ─────────
  if (pathname.startsWith("/admin")) {
    // Step A: must be authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Step B: must exist in admins table and be active
    // Use service-role client to bypass RLS — this is safe: server-only
    try {
      const adminClient = createAdminClient();
      const { data: adminRow } = await adminClient
        .from("admins")
        .select("email, role, active")
        .eq("email", user.email ?? "")
        .single();

      if (!adminRow || !adminRow.active) {
        return NextResponse.redirect(new URL("/admin/forbidden", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/forbidden", request.url));
    }

    return supabaseResponse;
  }

  // ── 4. Customer protected routes ────────────────────────────
  // /account and /checkout require authentication.
  // Instead of a hard redirect, we send to / with ?login=true
  // so the LoginModal can be triggered client-side.
  if (
    pathname.startsWith("/account") ||
    pathname.startsWith("/checkout")
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const homeUrl = new URL("/", request.url);
      homeUrl.searchParams.set("login", "true");
      homeUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(homeUrl);
    }
  }

  // ── 5. All other routes — just refresh session ───────────────
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
