import { Metadata } from "next";
import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { MOCK_BLOG_POSTS } from "@/constants";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Blog" };

const gradients = ["product-gradient-2", "product-gradient-3", "product-gradient-1", "product-gradient-4"];

export default function BlogPage() {
  const [featured, ...rest] = MOCK_BLOG_POSTS;

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
        {/* Featured post */}
        <Link href={`/blog/${featured.slug}`} className="group block mb-12">
          <div className="grid md:grid-cols-2 gap-6 bg-white rounded-3xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className={`h-64 md:h-auto ${gradients[0]} flex items-center justify-center text-8xl select-none group-hover:scale-105 transition-transform duration-500`}>
              🫙
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
                <span>{formatDate(featured.publishedAt)}</span>
                <span>·</span>
                <Clock size={12} />
                <span>{featured.readTime} min read</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["All", "Nutrition Science", "Ayurveda", "Superfoods", "Culture & Heritage", "Recipes"].map((cat) => (
            <button key={cat} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${cat === "All" ? "bg-forest text-white" : "bg-white border border-border text-charcoal hover:border-forest/40"}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Rest of posts */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post, i) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className={`h-44 ${gradients[(i + 1) % gradients.length]} flex items-center justify-center text-6xl select-none group-hover:scale-105 transition-transform duration-500`}>
                {["🌿", "☕", "🍃"][i % 3]}
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
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
