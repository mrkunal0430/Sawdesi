"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/admin/PageHeader";
import { BlogForm } from "@/components/admin/BlogForm";
import { formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { mapBlogPost } from "@/lib/mapBlogPost";
import type { BlogPost } from "@/types";
import { toast } from "sonner";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);

  const fetchPosts = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load posts"); return; }
    setPosts((data ?? []).map(mapBlogPost));
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  async function togglePublish(post: BlogPost) {
    const supabase = createClient();
    const { error } = await supabase
      .from("blog_posts")
      .update({ published: !post.published, published_at: !post.published ? new Date().toISOString() : null })
      .eq("id", post.id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success(post.published ? "Post unpublished" : "Post published");
    fetchPosts();
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    const supabase = createClient();
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) { toast.error("Delete failed"); return; }
    toast.success("Post deleted");
    fetchPosts();
  }

  function openEdit(p: BlogPost) { setEditing(p); setFormOpen(true); }
  function openNew() { setEditing(null); setFormOpen(true); }

  return (
    <div className="p-6 md:pt-6 pt-4">
      <div className="max-w-5xl mx-auto">
        <PageHeader
          title="Blog"
          breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Blog" }]}
          actions={
            <Button variant="primary" size="md" className="gap-2" onClick={openNew}>
              <Plus size={16} /> New Post
            </Button>
          }
        />

        {loading ? (
          <div className="py-16 text-center text-muted text-sm">Loading posts…</div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted text-sm mb-3">No blog posts yet.</p>
            <Button variant="primary" size="sm" onClick={openNew} className="gap-2"><Plus size={14} /> Write your first post</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl border border-border p-5 flex gap-4">
                {post.coverImage && (
                  <div className="w-24 h-20 rounded-xl overflow-hidden border border-border shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant={post.published ? "success" : "warning"} size="sm">
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                    <Badge variant="forest" size="sm">{post.category}</Badge>
                    <span className="text-xs text-muted">{post.readTime} min read</span>
                    {post.publishedAt && (
                      <span className="text-xs text-muted">· {formatDate(post.publishedAt)}</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-charcoal mb-1 line-clamp-1">{post.title}</p>
                  <p className="text-xs text-muted line-clamp-2">{post.excerpt}</p>
                  <p className="text-xs text-muted mt-1">By {post.author}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => openEdit(post)} className="text-muted hover:text-forest transition-colors" title="Edit">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => togglePublish(post)} className="text-muted hover:text-charcoal transition-colors"
                    title={post.published ? "Unpublish" : "Publish"}>
                    {post.published ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button onClick={() => handleDelete(post.id, post.title)} className="text-muted hover:text-red-500 transition-colors" title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BlogForm
        open={formOpen}
        post={editing}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSaved={fetchPosts}
      />
    </div>
  );
}
