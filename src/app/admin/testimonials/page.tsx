"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/admin/PageHeader";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { createClient } from "@/lib/supabase/client";
import type { Testimonial } from "@/types";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  const fetchTestimonials = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order");
    if (error) { toast.error("Failed to load testimonials"); return; }
    setTestimonials(
      (data ?? []).map((t) => ({
        id: t.id, name: t.name, location: t.location,
        rating: t.rating, review: t.review, product: t.product,
        initials: t.initials, mediaUrl: t.media_url, mediaType: t.media_type,
        active: t.active, sortOrder: t.sort_order, createdAt: t.created_at,
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  async function toggleActive(t: Testimonial) {
    const supabase = createClient();
    const { error } = await supabase.from("testimonials").update({ active: !t.active }).eq("id", t.id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success(t.active ? "Hidden from homepage" : "Visible on homepage");
    fetchTestimonials();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) { toast.error("Delete failed"); return; }
    toast.success("Testimonial deleted");
    fetchTestimonials();
  }

  function openEdit(t: Testimonial) { setEditing(t); setFormOpen(true); }
  function openNew() { setEditing(null); setFormOpen(true); }

  return (
    <div className="p-6 md:pt-6 pt-4">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Testimonials"
          breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Testimonials" }]}
          actions={
            <Button variant="primary" size="md" className="gap-2" onClick={openNew}>
              <Plus size={16} /> Add Testimonial
            </Button>
          }
        />

        {loading ? (
          <div className="py-16 text-center text-muted text-sm">Loading testimonials…</div>
        ) : testimonials.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted text-sm mb-3">No testimonials yet.</p>
            <Button variant="primary" size="sm" onClick={openNew} className="gap-2"><Plus size={14} /> Add first testimonial</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {testimonials.map((t) => (
              <div key={t.id} className={`bg-white rounded-2xl border p-5 flex gap-4 ${t.active ? "border-border" : "border-border opacity-60"}`}>
                <div className="text-muted mt-1 cursor-grab hidden sm:block">
                  <GripVertical size={16} />
                </div>

                {t.mediaUrl && (
                  <div className="w-20 h-16 rounded-xl overflow-hidden border border-border shrink-0">
                    {t.mediaType === "video" ? (
                      <video src={t.mediaUrl} className="w-full h-full object-cover" muted />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.mediaUrl} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-sm text-charcoal">{t.name}</span>
                    <span className="text-xs text-muted">{t.location}</span>
                    <Badge variant="forest" size="sm">{t.product}</Badge>
                    {t.mediaType && (
                      <Badge variant="gold" size="sm" className="capitalize">{t.mediaType}</Badge>
                    )}
                    <Badge variant={t.active ? "success" : "default"} size="sm">
                      {t.active ? "Live" : "Hidden"}
                    </Badge>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-xs ${i < t.rating ? "text-saffron" : "text-border"}`}>★</span>
                    ))}
                  </div>
                  <p className="text-sm text-muted line-clamp-2">{t.review}</p>
                  <p className="text-xs text-muted mt-1">{formatDate(t.createdAt)}</p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => openEdit(t)} className="text-muted hover:text-forest transition-colors" title="Edit">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => toggleActive(t)} className="text-muted hover:text-charcoal transition-colors" title={t.active ? "Hide" : "Show"}>
                    {t.active ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="text-muted hover:text-red-500 transition-colors" title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TestimonialForm
        open={formOpen}
        testimonial={editing}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSaved={fetchTestimonials}
      />
    </div>
  );
}
