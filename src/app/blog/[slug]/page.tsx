import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { MOCK_BLOG_POSTS } from "@/constants";
import { formatDate } from "@/lib/utils";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = MOCK_BLOG_POSTS.find((p) => p.slug === params.slug);
  return { title: post?.title ?? "Blog Post" };
}

const sampleBody = `
Ayurveda, India's ancient system of medicine, has known for over 5,000 years what modern science is now confirming:
the food we eat is medicine. At Sawdesi, every product we create is rooted in this understanding.

## The Science Behind the Tradition

When we look at ingredients like Ashwagandha, Amla, or Lakadong Turmeric, we find extraordinary chemistry.
Ashwagandha contains withanolides — compounds that modulate the HPA axis, directly reducing cortisol levels.
Amla has one of the highest natural concentrations of Vitamin C, far exceeding oranges on a gram-for-gram basis.

## How to Incorporate These Into Your Daily Life

The best way to benefit from Ayurvedic superfoods is consistent, daily use. Small doses over time create
cumulative effects that no pharmaceutical can replicate. Start with one addition to your morning routine —
a teaspoon of moringa in your smoothie, a half-teaspoon of ashwagandha in warm milk before bed.

## What to Look For When Buying

Not all products are created equal. Look for:
- Full ingredient transparency
- Third-party lab certifications
- Clear sourcing information
- No artificial additives or fillers

At Sawdesi, all our lab reports are available on request. We believe you have the right to know exactly what you're consuming.
`;

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = MOCK_BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const related = MOCK_BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 3);
  const gradients = ["product-gradient-2", "product-gradient-3", "product-gradient-1"];

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
      <div className={`h-72 ${gradients[0]} flex items-center justify-center text-9xl select-none`}>
        🌿
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
              <span>{formatDate(post.publishedAt)}</span>
              <span>·</span>
              <Clock size={11} />
              <span>{post.readTime} min read</span>
            </div>
          </div>
        </div>

        {/* Article body */}
        <div className="prose prose-sm max-w-none text-charcoal space-y-4">
          {sampleBody.trim().split("\n\n").map((para, i) => {
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
          })}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="default" size="sm">#{tag}</Badge>
          ))}
        </div>

        {/* Related posts */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-charcoal mb-5" style={{ fontFamily: "var(--font-playfair)" }}>
            More from the Journal
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((p, i) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all">
                <div className={`h-32 ${gradients[i % gradients.length]} flex items-center justify-center text-4xl`}>
                  {["🌱", "☕", "🍃"][i]}
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
      </div>
    </div>
  );
}
