import { redirect } from "next/navigation";

/**
 * Old login page — no longer used.
 * Customers use the Phone OTP modal. Admins use /admin/login.
 * Redirect to home.
 */
export default function LoginPage() {
  redirect("/");
}
