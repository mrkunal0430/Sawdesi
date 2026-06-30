import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Auth callback handler.
 * - For Google OAuth (admin login): exchanges code for session, redirects to /admin
 * - For any other auth callback: exchanges code, redirects to specified `next` param
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Something went wrong — send to home with error
  if (next.startsWith("/admin")) {
    return NextResponse.redirect(`${origin}/admin/login?error=auth_failed`);
  }

  return NextResponse.redirect(`${origin}/?error=auth_failed`);
}
