"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import type { BlogPost } from "@/types";
import { toast } from "sonner";

const BLOG_CATEGORIES = [
  "Nutrition Science", "Ayurveda", "Culture & Heritage",
  "Superfoods", "Wellness", "Recipes", "Research",
];

interface FormValues {
  title: string;
  excerpt: string;
  body: string;
  author: string;
  category: string;
  tags: string;
  coverImage: string[];
  readTime: number;
  published: boolean;
}

export function BlogForm({ open, post, onClose, onSaved }: {
  open: boolean; post: BlogPost | null; onClose: () => void; onSaved: () => void;
}) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      title: "", excerpt: "", body: "", author: "", category: "Ayurveda",
      tags: "", coverImage: [], readTime: 5, published: false,
    },
  });

  const coverImage = watch("coverImage");

  useEffect(() => {
    if (post) {
      reset({
        title: post.title, excerpt: post.excerpt, body: post.body,
        author: post.author, category: post.category,
        tags: post.tags.join(", "),
        coverImage: post.coverImage ? [post.coverImage] : [],
        readTime: post.readTime, published: post.published,
      });
    } else {
      reset({ title: "", excerpt: "", body: "", author: "", category: "Ayurveda", tags: "", coverImage: [], readTime: 5, published: false });
    }
  }, [post, reset, open]);

  async function onSubmit(values: FormValues) {
    const supabase = createClient();
    const slug = post?.slug ?? slugify(values.title);

    const payload = {
      slug,
      title: values.title,
      excerpt: values.excerpt,
      body: values.body,
      author: values.author,
      category: values.category,
      tags: values.tags.split(",").map((s) => s.trim()).filter(Boolean),
      cover_image: values.coverImage[0] ?? null,
      read_time: Number(values.readTime),
      published: values.published,
      published_at: values.published ? new Date().toISOString() : null,
    };

    const { error } = post
      ? await supabase.from("blog_posts").update(payload).eq("id", post.id)
      : await supabase.from("blog_posts").insert(payload);

    if (error) { toast.error(error.message); return; }
    toast.success(post ? "Post updated" : "Post created");
    onSaved();
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-lg font-bold text-charcoal" style={{ fontFamily: "var(--font-playfair)" }}>
            {post ? "Edit Post" : "New Blog Post"}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-charcoal"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <Input
            label="Title"
            required
            error={errors.title?.message}
            {...register("title", { required: "Required" })}
          />

          <Textarea
            label="Excerpt"
            rows={2}
            required
            hint="Short summary shown in blog listing"
            error={errors.excerpt?.message}
            {...register("excerpt", { required: "Required" })}
          />

          <Textarea
            label="Body"
            rows={10}
            required
            hint="Supports markdown-style formatting"
            error={errors.body?.message}
            {...register("body", { required: "Required" })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Author" required error={errors.author?.message}
              {...register("author", { required: "Required" })} />
            <Input label="Read Time (minutes)" type="number" {...register("readTime")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-charcoal">Category</label>
            <select
              className="h-11 rounded-xl border border-border bg-white px-4 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-saffron"
              {...register("category")}
            >
              {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <Input label="Tags (comma separated)" placeholder="ayurveda, health, ghee" {...register("tags")} />

          <ImageUpload
            label="Cover Image"
            value={coverImage}
            onChange={(urls) => setValue("coverImage", urls.slice(0, 1))}
            folder="sawdesi/blog"
            maxFiles={1}
          />

          <div className="flex items-center gap-3">
            <input id="published" type="checkbox" className="w-4 h-4 accent-saffron" {...register("published")} />
            <label htmlFor="published" className="text-sm font-medium text-charcoal cursor-pointer">
              Publish immediately (visible to readers)
            </label>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-border flex gap-3 shrink-0">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" variant="primary" loading={isSubmitting} className="flex-1"
            onClick={handleSubmit(onSubmit)}>
            {post ? "Save Changes" : "Create Post"}
          </Button>
        </div>
      </div>
    </div>
  );
}
