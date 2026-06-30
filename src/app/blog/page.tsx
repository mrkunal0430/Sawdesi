"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { mapBlogPost } from "@/lib/mapBlogPost";
import type { BlogPost } from "@/types";

const gradients = ["product-gradient-2", "product-gradient-3", "product-gradient-1", "product-gradient-4"];
const emojis = ["🫙", "🌿", "☕", "🍃"];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    setPosts((data ?? []).map(mapBlogPost));
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="bg-white border-b border-border py-10 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-saffron font-semibold text-sm uppercase tracking-widest mb-3">The Sawdesi Journal</p>
            <h1 className="text-4xl font-bold text-charcoal mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
              Ancient Wisdom, Modern Insights
            </h1>
            <p className="text-muted max-w-xl mx-auto">
              Recipes, Ayurvedic science, ingredient deep-dives, and wellness tips from our experts.
            </p>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-border overflow-hidden animate-pulse">
                <div className={`h-44 ${gradients[i % gradients.length]}`} />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-cream-dark rounded w-1/4" />
                  <div className="h-5 bg-cream-dark rounded w-3/4" />
                  <div className="h-4 bg-cream-dark rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white border-b border-border py-10 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-saffron font-semibold text-sm uppercase tracking-widest mb-3">The Sawdesi Journal</p>
          <h1 className="text-4xl font-bold text-charcoal mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
            Ancient Wisdom, Modern Insights
          </h1>
          <p className="text-muted max-w-xl mx-auto">
            Recipes, Ayurvedic science, ingredient deep-dives, and wellness tips from our experts.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">📝</p>
            <h3 className="text-xl font-semibold text-charcoal mb-2">No blog posts yet</h3>
            <p className="text-muted">Check back soon for articles on Ayurveda, nutrition, and wellness.</p>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <Link href={`/blog/${featured.slug}`} className="group block mb-12">
                <div className="grid md:grid-cols-2 gap-6 bg-white rounded-3xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className={`h-64 md:h-auto ${gradients[0]} flex items-center justify-center overflow-hidden`}>
                    {featured.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={featured.coverImage} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <span className="text-8xl select-none group-hover:scale-105 transition-transform duration-500">{emojis[0]}</span>
                    )}
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <Badge variant="saffron" className="mb-4 self-start">{featured.category}</Badge>
                    <h2 className="text-2xl font-bold text-charcoal mb-3 group-hover:text-saffron-dark transition-colors" style={{ fontFamily: "var(--font-playfair)" }}>
                      {featured.title}
                    </h2>
                    <p className="text-muted text-sm leading-relaxed mb-4">{featured.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span className="font-semibold text-charcoal">{featured.author}</span>
                      <span>·</span>
                      <span>{featured.publishedAt ? formatDate(featured.publishedAt) : ""}</span>
                      <span>·</span>
                      <Clock size={12} />
                      <span>{featured.readTime} min read</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Rest of posts */}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((post, i) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className={`h-44 ${gradients[(i + 1) % gradients.length]} flex items-center justify-center overflow-hidden`}>
                      {post.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <span className="text-6xl select-none group-hover:scale-105 transition-transform duration-500">{emojis[(i + 1) % emojis.length]}</span>
                      )}
                    </div>
                    <div className="p-5">
                      <Badge variant="forest" size="sm" className="mb-3">{post.category}</Badge>
                      <h3 className="font-bold text-charcoal mb-2 leading-snug group-hover:text-saffron-dark transition-colors line-clamp-2" style={{ fontFamily: "var(--font-playfair)" }}>
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted line-clamp-2 mb-4">{post.excerpt}</p>
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <Clock size={11} />
                        <span>{post.readTime} min read</span>
                        <span>·</span>
                        <span>{post.publishedAt ? formatDate(post.publishedAt) : ""}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
