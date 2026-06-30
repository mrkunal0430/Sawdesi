"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { mapBlogPost } from "@/lib/mapBlogPost";
import type { BlogPost } from "@/types";

const gradients = ["product-gradient-2", "product-gradient-3", "product-gradient-1"];
const emojis = ["🌱", "☕", "🍃"];

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", params.slug)
      .eq("published", true)
      .single();

    if (error || !data) {
      setPost(null);
      setLoading(false);
      return;
    }

    const mapped = mapBlogPost(data);
    setPost(mapped);

    // Update page title
    document.title = `${mapped.title} — Sawdesi`;

    // Fetch related posts
    const { data: relatedData } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .neq("id", mapped.id)
      .order("published_at", { ascending: false })
      .limit(3);

    setRelated((relatedData ?? []).map(mapBlogPost));
    setLoading(false);
  }, [params.slug]);

  useEffect(() => { fetchPost(); }, [fetchPost]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="bg-white border-b border-border">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-charcoal">Home</Link>
            <ChevronRight size={14} />
            <Link href="/blog" className="hover:text-charcoal">Blog</Link>
            <ChevronRight size={14} />
            <span className="text-charcoal font-medium">Loading…</span>
          </div>
        </div>
        <div className={`h-72 ${gradients[0]} flex items-center justify-center`}>
          <span className="text-9xl select-none">🌿</span>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-pulse space-y-4">
          <div className="h-6 bg-cream-dark rounded w-1/4" />
          <div className="h-10 bg-cream-dark rounded w-3/4" />
          <div className="h-5 bg-cream-dark rounded w-full" />
          <div className="h-5 bg-cream-dark rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-charcoal">Home</Link>
          <ChevronRight size={14} />
          <Link href="/blog" className="hover:text-charcoal">Blog</Link>
          <ChevronRight size={14} />
          <span className="text-charcoal font-medium line-clamp-1">{post.title}</span>
        </div>
      </div>

      {/* Hero */}
      <div className={`h-72 ${post.coverImage ? "bg-cream-dark" : gradients[0]} flex items-center justify-center overflow-hidden`}>
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-9xl select-none">🌿</span>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Back */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-forest-dark mb-8">
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        <Badge variant="saffron" className="mb-4">{post.category}</Badge>
        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
          {post.title}
        </h1>
        <p className="text-lg text-muted mb-6">{post.excerpt}</p>

        {/* Author + meta */}
        <div className="flex items-center gap-4 py-4 border-y border-border mb-8">
          <div className="w-10 h-10 rounded-full bg-saffron/20 flex items-center justify-center text-saffron-dark font-bold text-sm">
            {post.author.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <p className="text-sm font-semibold text-charcoal">{post.author}</p>
            <div className="flex items-center gap-2 text-xs text-muted">
              <span>{post.publishedAt ? formatDate(post.publishedAt) : ""}</span>
              <span>·</span>
              <Clock size={11} />
              <span>{post.readTime} min read</span>
            </div>
          </div>
        </div>

        {/* Article body */}
        <div className="prose prose-sm max-w-none text-charcoal space-y-4">
          {post.body ? (
            post.body.trim().split("\n\n").map((para, i) => {
              if (para.startsWith("## ")) {
                return <h2 key={i} className="text-xl font-bold text-charcoal mt-8 mb-3" style={{ fontFamily: "var(--font-playfair)" }}>{para.replace("## ", "")}</h2>;
              }
              if (para.startsWith("- ")) {
                return (
                  <ul key={i} className="list-disc list-inside space-y-1">
                    {para.split("\n").filter(Boolean).map((item, j) => (
                      <li key={j} className="text-muted text-sm">{item.replace("- ", "")}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={i} className="text-muted leading-relaxed">{para}</p>;
            })
          ) : (
            <p className="text-muted italic">Content coming soon.</p>
          )}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="default" size="sm">#{tag}</Badge>
            ))}
          </div>
        )}

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-charcoal mb-5" style={{ fontFamily: "var(--font-playfair)" }}>
              More from the Journal
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((p, i) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all">
                  <div className={`h-32 ${p.coverImage ? "bg-cream-dark" : gradients[i % gradients.length]} flex items-center justify-center overflow-hidden`}>
                    {p.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <span className="text-4xl">{emojis[i % emojis.length]}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-bold text-charcoal group-hover:text-saffron-dark transition-colors line-clamp-2" style={{ fontFamily: "var(--font-playfair)" }}>
                      {p.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
