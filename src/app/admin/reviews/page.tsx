"use client";

import { useEffect, useState, useCallback } from "react";
import { Check, X, Trash2, Star, Plus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/admin/PageHeader";
import { ReviewForm } from "@/components/admin/ReviewForm";
import { formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Review } from "@/types";
import { toast } from "sonner";

const STATUS_FILTERS = ["All", "pending", "approved", "rejected"];

const statusVariant: Record<string, "success" | "warning" | "danger"> = {
  approved: "success", pending: "warning", rejected: "danger",
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*, products(name)")
      .order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load reviews"); return; }
    setReviews(
      (data ?? []).map((r) => ({
        id: r.id,
        productId: r.product_id,
        userId: r.user_id,
        userName: r.user_name,
        rating: r.rating,
        title: r.title,
        body: r.body,
        verified: r.verified,
        helpful: r.helpful,
        status: r.status,
        createdAt: r.created_at,
        productName: (r.products as { name: string } | null)?.name ?? "Unknown",
      } as Review & { productName: string }))
    );
    setLoading(false);
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  async function updateStatus(id: string, status: "approved" | "rejected") {
    setActionId(id);
    const supabase = createClient();
    const { error } = await supabase.from("reviews").update({ status }).eq("id", id);
    setActionId(null);
    if (error) { toast.error("Failed to update"); return; }
    toast.success(`Review ${status}`);
    fetchReviews();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) { toast.error("Delete failed"); return; }
    toast.success("Review deleted");
    fetchReviews();
  }

  const filtered = reviews.filter(
    (r) => filter === "All" || r.status === filter
  );

  return (
    <div className="p-6 md:pt-6 pt-4">
      <div className="max-w-5xl mx-auto">
        <PageHeader
          title="Reviews"
          breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Reviews" }]}
          actions={
            <Button variant="primary" size="md" className="gap-2" onClick={() => setFormOpen(true)}>
              <Plus size={16} /> Add Review
            </Button>
          }
        />

        <div className="flex flex-wrap gap-2 mb-5">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                filter === s ? "bg-forest text-white" : "bg-white border border-border text-charcoal hover:border-forest/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-16 text-center text-muted text-sm">Loading reviews…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-muted text-sm">No reviews found.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((review) => {
              const r = review as Review & { productName?: string };
              return (
                <div key={review.id} className="bg-white rounded-2xl border border-border p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-sm text-charcoal">{review.userName}</span>
                      <Badge variant="forest" size="sm">{r.productName ?? "Product"}</Badge>
                      <Badge variant={statusVariant[review.status]} size="sm" className="capitalize">
                        {review.status}
                      </Badge>
                      {review.verified && <Badge variant="gold" size="sm">Verified</Badge>}
                      <span className="text-xs text-muted">{formatDate(review.createdAt)}</span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {review.status !== "approved" && (
                        <button
                          disabled={actionId === review.id}
                          onClick={() => updateStatus(review.id, "approved")}
                          className="w-8 h-8 rounded-lg bg-forest/10 text-forest flex items-center justify-center hover:bg-forest hover:text-white transition-colors disabled:opacity-50"
                          title="Approve"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      {review.status !== "rejected" && (
                        <button
                          disabled={actionId === review.id}
                          onClick={() => updateStatus(review.id, "rejected")}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                          title="Reject"
                        >
                          <X size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className={i < review.rating ? "fill-saffron text-saffron" : "fill-none text-border"} />
                    ))}
                  </div>
                  {review.title && <p className="text-sm font-semibold text-charcoal mb-1">{review.title}</p>}
                  <p className="text-sm text-muted">{review.body}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ReviewForm open={formOpen} onClose={() => setFormOpen(false)} onSaved={fetchReviews} />
    </div>
  );
}
