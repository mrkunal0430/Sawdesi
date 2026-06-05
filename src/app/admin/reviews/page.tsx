import { Metadata } from "next";
import Link from "next/link";
import { Star, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin — Reviews" };

const reviews = [
  { id: "1", product: "A2 Ghee", user: "Priya S.", rating: 5, title: "Best ghee I've ever had!", body: "Absolutely authentic taste. Reminds me of my grandmother's ghee. Will definitely reorder.", status: "approved", date: "2025-06-02" },
  { id: "2", product: "Chyawanprash", user: "Rahul M.", rating: 5, title: "Kids love it", body: "My children actually enjoy taking it. Better immunity this winter. Highly recommend.", status: "pending", date: "2025-06-03" },
  { id: "3", product: "Moringa Powder", user: "Ananya K.", rating: 4, title: "Good quality, slightly earthy", body: "The quality is great but the taste is very earthy. Mix it with banana shake to mask it.", status: "approved", date: "2025-06-01" },
  { id: "4", product: "Ashwagandha", user: "Vikram R.", rating: 5, title: "Noticeable difference", body: "Sleep quality improved within a week. Stress levels are down noticeably.", status: "pending", date: "2025-06-04" },
  { id: "5", product: "Kadha Mix", user: "Sunita P.", rating: 3, title: "Too strong for daily use", body: "Very potent, which is good, but might be overwhelming for some. Good quality ingredients.", status: "rejected", date: "2025-05-30" },
];

const statusVariant: Record<string, "success" | "warning" | "danger"> = {
  approved: "success", pending: "warning", rejected: "danger",
};

export default function AdminReviewsPage() {
  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted mb-1">
            <Link href="/admin" className="hover:text-charcoal">Dashboard</Link>
            <span>/</span>
            <span className="text-charcoal font-medium">Reviews</span>
          </div>
          <h1 className="text-2xl font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>Reviews</h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {["All", "Pending", "Approved", "Rejected"].map((s) => (
            <button key={s} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${s === "All" ? "bg-forest text-white" : "bg-white border border-border text-charcoal hover:border-forest/40"}`}>{s}</button>
          ))}
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl border border-border p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-semibold text-sm text-charcoal">{review.user}</span>
                  <Badge variant="forest" size="sm">{review.product}</Badge>
                  <Badge variant={statusVariant[review.status]} size="sm">{review.status}</Badge>
                  <span className="text-xs text-muted">{formatDate(review.date)}</span>
                </div>
                {review.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <button className="w-8 h-8 rounded-lg bg-forest/10 text-forest flex items-center justify-center hover:bg-forest hover:text-white transition-colors">
                      <Check size={14} />
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className={i < review.rating ? "fill-saffron text-saffron" : "fill-none text-border"} />
                ))}
              </div>
              <p className="text-sm font-semibold text-charcoal mb-1">{review.title}</p>
              <p className="text-sm text-muted">{review.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
