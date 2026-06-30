import type { BlogPost } from "@/types";

/**
 * Maps a Supabase `blog_posts` row (snake_case) to a BlogPost object (camelCase).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapBlogPost(p: any): BlogPost {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    body: p.body,
    author: p.author,
    authorAvatar: p.author_avatar,
    category: p.category,
    tags: p.tags ?? [],
    coverImage: p.cover_image,
    readTime: p.read_time,
    published: p.published,
    publishedAt: p.published_at,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}
