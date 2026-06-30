import { redirect } from "next/navigation";

/**
 * Old register page — no longer used.
 * Phone OTP auto-creates accounts. Redirect to home.
 */
export default function RegisterPage() {
  redirect("/");
}
