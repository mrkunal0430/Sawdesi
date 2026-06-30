"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, Film, Image as ImageIcon } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MediaUploadProps {
  value: { url: string; type: "image" | "video" } | null;
  onChange: (val: { url: string; type: "image" | "video" } | null) => void;
  folder?: string;
  label?: string;
}

export function MediaUpload({
  value,
  onChange,
  folder = "sawdesi/testimonials",
  label = "Media",
}: MediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    const isVideo = file.type.startsWith("video/");
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, folder);
      onChange({ url, type: isVideo ? "video" : "image" });
      toast.success("Media uploaded");
    } catch {
      toast.error("Upload failed. Check Cloudinary settings.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium text-charcoal">{label}</span>}

      {value ? (
        <div className="relative w-40 rounded-xl overflow-hidden border border-border group">
          {value.type === "video" ? (
            <video src={value.url} className="w-full h-28 object-cover" muted />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.url} alt="" className="w-full h-28 object-cover" />
          )}
          <div className="absolute top-1.5 left-1.5">
            <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
              {value.type === "video" ? <Film size={10} /> : <ImageIcon size={10} />}
              {value.type}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "w-40 h-28 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 transition-colors text-muted",
            uploading ? "opacity-50 cursor-not-allowed" : "hover:border-saffron hover:bg-saffron/5 cursor-pointer"
          )}
        >
          {uploading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              <Upload size={18} />
              <span className="text-xs">Image or Video</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files)}
      />
    </div>
  );
}
