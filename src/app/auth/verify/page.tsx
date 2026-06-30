import { redirect } from "next/navigation";

/**
 * Old email verify page — no longer used.
 * OTP verification happens in-modal. Redirect to home.
 */
export default function VerifyPage() {
  redirect("/");
}
