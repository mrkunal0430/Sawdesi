import Link from "next/link";
import { ShieldX, Leaf } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-forest-dark flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-9 h-9 bg-saffron rounded-xl flex items-center justify-center">
            <Leaf size={18} className="text-white" />
          </div>
          <span
            className="text-2xl font-bold text-cream"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Sawdesi
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-border p-10 shadow-xl">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <ShieldX size={30} className="text-red-500" />
          </div>

          <h1
            className="text-3xl font-bold text-charcoal mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            403 — Access Denied
          </h1>

          <p className="text-muted text-sm mb-6 leading-relaxed">
            Your account does not have permission to access the admin dashboard.
            If you believe this is an error, please contact the site owner.
          </p>

          <div className="space-y-3">
            <Link
              href="/admin/login"
              className="block w-full h-11 bg-forest text-cream text-sm font-medium rounded-xl flex items-center justify-center hover:bg-forest-dark transition-colors"
            >
              Try a Different Account
            </Link>
            <Link
              href="/"
              className="block text-sm text-forest font-medium hover:text-forest-dark transition-colors"
            >
              ← Back to Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
