"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  maxFiles?: number;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = "sawdesi/products",
  maxFiles = 5,
  label = "Images",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const remaining = maxFiles - value.length;
    const toUpload = Array.from(files).slice(0, remaining);
    if (toUpload.length === 0) {
      toast.error(`Maximum ${maxFiles} images allowed`);
      return;
    }
    setUploading(true);
    try {
      const urls = await Promise.all(toUpload.map((f) => uploadToCloudinary(f, folder)));
      onChange([...value, ...urls]);
      toast.success(`${urls.length} image${urls.length > 1 ? "s" : ""} uploaded`);
    } catch {
      toast.error("Image upload failed. Check Cloudinary settings.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium text-charcoal">{label}</span>}

      <div className="flex flex-wrap gap-3">
        {value.map((url) => (
          <div key={url} className="relative w-24 h-24 rounded-xl overflow-hidden border border-border group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        ))}

        {value.length < maxFiles && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={cn(
              "w-24 h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 transition-colors",
              uploading ? "opacity-50 cursor-not-allowed" : "hover:border-saffron hover:bg-saffron/5 cursor-pointer"
            )}
          >
            {uploading ? (
              <Loader2 size={20} className="text-muted animate-spin" />
            ) : (
              <>
                <Upload size={18} className="text-muted" />
                <span className="text-xs text-muted">Upload</span>
              </>
            )}
          </button>
        )}

        {value.length === 0 && !uploading && (
          <div className="flex items-center gap-2 text-xs text-muted ml-1 self-center">
            <ImageIcon size={14} />
            No images yet
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
