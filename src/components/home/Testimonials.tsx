"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Star, Play, Quote, X } from "lucide-react";

/* ─── Types ────────────────────────────────────────────────────────────────── */
type TextTestimonial = {
  kind: "text";
  id: string;
  name: string;
  location: string;
  initials: string;
  rating: number;
  review: string;
  product: string;
};

type VideoTestimonial = {
  kind: "video";
  id: string;
  name: string;
  location: string;
  initials: string;
  rating: number;
  caption: string;
  product: string;
  /** YouTube video ID or null for placeholder */
  videoId: string | null;
  /** aspect: "portrait" (9:16) | "landscape" (16:9) */
  aspect: "portrait" | "landscape";
  thumbGradient: string;
  thumbEmoji: string;
};

type Testimonial = TextTestimonial | VideoTestimonial;

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const TESTIMONIALS: Testimonial[] = [
  {
    kind: "video",
    id: "v1",
    name: "Priya Sharma",
    location: "Bengaluru, Karnataka",
    initials: "PS",
    rating: 5,
    caption:
      "2 weeks of Tan Removal Soap — my skin feels incredibly soft and my natural glow is back. Watch my review.",
    product: "Tan Removal Soap",
    videoId: null,
    aspect: "landscape",
    thumbGradient: "from-[#1B4332] via-[#2D6A4F] to-[#40916C]",
    thumbEmoji: "🧼",
  },
  {
    kind: "text",
    id: "t1",
    name: "Rajesh Nair",
    location: "Mumbai, Maharashtra",
    initials: "RN",
    rating: 5,
    review:
      "I have very sensitive skin and most commercial soaps leave it dry and itchy. Tried Sawdesi's Goat Milk & Shea Butter soap and it's a game changer. Super moisturizing and smells amazing.",
    product: "Goat Milk & Shea Butter",
  },
  {
    kind: "video",
    id: "v2",
    name: "Ananya Bose",
    location: "Kolkata, West Bengal",
    initials: "AB",
    rating: 5,
    caption:
      "The Wild Turmeric & Sandalwood Soap before bed — my daily refresh ritual. Tanning is down, skin feels smooth and nourished.",
    product: "Sandalwood & Turmeric",
    videoId: null,
    aspect: "portrait",
    thumbGradient: "from-[#2D6A4F] via-[#40916C] to-[#FAF7F2]",
    thumbEmoji: "✨",
  },
  {
    kind: "text",
    id: "t2",
    name: "Vikram Reddy",
    location: "Hyderabad, Telangana",
    initials: "VR",
    rating: 5,
    review:
      "After workouts, I need a soap that cleanses deeply without drying. This Multani Mitti & Orange Peel soap is exactly that. It's refreshing, absorbs excess oil, and smells clean.",
    product: "Multani Mitti & Orange Peel",
  },
  {
    kind: "video",
    id: "v3",
    name: "Sunita Krishnan",
    location: "Chennai, Tamil Nadu",
    initials: "SK",
    rating: 5,
    caption:
      "Watch my daily skincare routine with Sawdesi soaps. Kept my skin glowing and hydrated all winter.",
    product: "Goat Milk & Shea Butter",
    videoId: null,
    aspect: "portrait",
    thumbGradient: "from-[#1B4332] via-[#2D6A4F] to-[#FAF7F2]",
    thumbEmoji: "🌿",
  },
  {
    kind: "text",
    id: "t3",
    name: "Meera Iyer",
    location: "Pune, Maharashtra",
    initials: "MI",
    rating: 5,
    review:
      "Ordered on a recommendation and now I'm hooked. The Goat Milk soap is so rich, I don't even need moisturizer in the summer. Quality is unmatched.",
    product: "Goat Milk & Shea Butter",
  },
];

/* ─── Stats ─────────────────────────────────────────────────────────────────── */
const STATS = [
  { value: "50,000+", label: "Happy customers" },
  { value: "4.9★", label: "Average rating" },
  { value: "96%", label: "Repeat buyers" },
  { value: "100%", label: "Natural & Safe" },
];

/* ─── Animated counter ──────────────────────────────────────────────────────── */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const numMatch = value.match(/[\d.]+/);
  const num = numMatch ? parseFloat(numMatch[0]) : 0;
  const suffix = value.replace(/[\d.]+/, "");
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = num;
    const duration = 1400;
    const step = (end / duration) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); return; }
      setDisplay(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, num]);

  return (
    <span ref={ref}>
      {num % 1 === 0 ? Math.floor(display) : display.toFixed(1)}
      {suffix}
    </span>
  );
}

/* ─── Star row ───────────────────────────────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          className={i <= rating ? "fill-gold text-gold" : "fill-none text-white/20"}
        />
      ))}
    </div>
  );
}

/* ─── Video Lightbox ─────────────────────────────────────────────────────────── */
function VideoLightbox({
  videoId,
  onClose,
}: {
  videoId: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            allow="autoplay; fullscreen"
            className="w-full h-full"
            title="Customer review video"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Video Card ─────────────────────────────────────────────────────────────── */
function VideoCard({
  item,
  className = "",
  onPlay,
}: {
  item: VideoTestimonial;
  className?: string;
  onPlay: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isPortrait = item.aspect === "portrait";

  return (
    <motion.div
      className={`relative group rounded-2xl overflow-hidden cursor-pointer ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => item.videoId && onPlay(item.videoId)}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.3 }}
    >
      {/* Thumbnail */}
      <div className={`relative w-full bg-gradient-to-br ${item.thumbGradient} flex items-center justify-center overflow-hidden ${isPortrait ? "aspect-[9/16]" : "aspect-video"}`}>
        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

        {/* Emoji focal */}
        <motion.span
          className="text-7xl select-none relative z-10"
          animate={{ scale: hovered ? 1.1 : 1 }}
          transition={{ duration: 0.4 }}
        >
          {item.thumbEmoji}
        </motion.span>

        {/* Dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

        {/* Film strip top decoration */}
        <div className="absolute top-0 left-0 right-0 h-5 flex gap-1 px-1.5 items-center" style={{ background: "rgba(0,0,0,0.5)" }}>
          {[...Array(14)].map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-[2px] bg-white/20 shrink-0" />
          ))}
        </div>

        {/* Play button */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: hovered ? 1 : 0.85 }}
        >
          <motion.div
            className="relative flex items-center justify-center"
            animate={{ scale: hovered ? 1.12 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Pulse ring */}
            <motion.div
              className="absolute rounded-full border-2 border-forest/60"
              animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              style={{ width: 64, height: 64 }}
            />
            {/* Button */}
            <div className="w-14 h-14 rounded-full bg-forest flex items-center justify-center shadow-lg shadow-forest/40">
              <Play size={20} fill="var(--cream)" className="text-cream ml-1" />
            </div>
          </motion.div>
        </motion.div>

        {/* No video placeholder label */}
        {!item.videoId && (
          <div className="absolute bottom-16 left-0 right-0 text-center">
            <span className="text-xs text-white/50 bg-black/40 px-3 py-1 rounded-full">
              Video coming soon
            </span>
          </div>
        )}

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Stars rating={item.rating} />
          <p className="text-white/90 text-sm leading-snug mt-2 font-medium line-clamp-2">
            {item.caption}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-7 h-7 rounded-full bg-forest flex items-center justify-center text-cream text-xs font-bold shrink-0">
              {item.initials}
            </div>
            <div>
              <p className="text-white text-xs font-semibold leading-none">{item.name}</p>
              <p className="text-white/50 text-[10px] mt-0.5">{item.location}</p>
            </div>
            <span className="ml-auto text-[10px] text-forest bg-forest/15 border border-forest/25 rounded-full px-2 py-0.5 font-medium">
              {item.product}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Text Card ──────────────────────────────────────────────────────────────── */
function TextCard({
  item,
  className = "",
  size = "normal",
}: {
  item: TextTestimonial;
  className?: string;
  size?: "normal" | "wide";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55 }}
      className={`relative rounded-2xl p-6 flex flex-col gap-3 border border-white/8 bg-white/[0.04] backdrop-blur-sm hover:bg-white/[0.07] transition-colors overflow-hidden ${className}`}
    >
      {/* Decorative corner arc */}
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full border border-forest/15 pointer-events-none" />
      <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full border border-forest/10 pointer-events-none" />

      <div className="flex items-start justify-between gap-2">
        <Stars rating={item.rating} />
        <Quote size={18} className="text-forest/30 shrink-0 mt-0.5" />
      </div>

      <p className={`text-cream/80 leading-relaxed italic ${size === "wide" ? "text-base" : "text-sm"} flex-1`}>
        &ldquo;{item.review}&rdquo;
      </p>

      <div className="flex items-center gap-3 pt-3 border-t border-white/8">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-forest to-forest-light flex items-center justify-center text-cream text-xs font-bold shrink-0">
          {item.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-cream leading-none">{item.name}</p>
          <p className="text-xs text-cream/40 mt-0.5 truncate">{item.location}</p>
        </div>
        <span className="text-[10px] text-forest bg-forest/10 border border-forest/20 rounded-full px-2 py-0.5 font-medium shrink-0">
          {item.product}
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Scrolling ticker ───────────────────────────────────────────────────────── */
const TICKER_ITEMS = [
  "Tan Removal Soap", "Goat Milk & Shea Butter", "Sandalwood & Turmeric",
  "Multani Mitti & Orange Peel", "100% Natural", "Made with Pure Oils",
  "Chemical Free", "Paraben Free", "Sulfate Free", "Dermatology Tested",
];

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="overflow-hidden py-3 border-y border-white/8 my-12 relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, var(--forest-dark, #1B4332), transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, var(--forest-dark, #1B4332), transparent)" }} />
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-xs font-semibold text-cream/50 uppercase tracking-widest shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-forest inline-block" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────────── */
export function Testimonials() {
  const [lightboxId, setLightboxId] = useState<string | null>(null);

  const [videoLandscape, videoPortrait1, , videoPortrait2] = TESTIMONIALS.filter(
    (t): t is VideoTestimonial => t.kind === "video"
  );
  const textItems = TESTIMONIALS.filter(
    (t): t is TextTestimonial => t.kind === "text"
  );

  return (
    <section className="py-20 bg-forest-dark overflow-hidden relative">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #2D6A4F 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-8 pointer-events-none"
        style={{ background: "radial-gradient(circle, #1B4332 0%, transparent 70%)", filter: "blur(80px)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-forest font-semibold text-sm uppercase tracking-widest mb-3">
            Real Reviews. Real Results.
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-cream"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Loved By Our Community
          </h2>
          <p className="text-cream/50 text-sm mt-3 max-w-md mx-auto">
            Stories of glowing, healthy skin — in their own words.
          </p>

          {/* Legend pills */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-cream/60 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
              <Play size={11} fill="currentColor" className="text-forest" /> Video reviews
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-cream/60 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
              <Quote size={11} className="text-forest" /> Written reviews
            </span>
          </div>
        </motion.div>

        {/* Mosaic Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 auto-rows-auto">

          {/* Featured landscape video */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="sm:col-span-2 lg:col-span-2 lg:row-span-3"
          >
            <VideoCard
              item={videoLandscape}
              className="h-full min-h-[320px] lg:min-h-full"
              onPlay={setLightboxId}
            />
          </motion.div>

          {/* Text reviews */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-4 lg:row-span-3">
            {textItems.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex-1"
              >
                <TextCard item={t} size={i === 0 ? "wide" : "normal"} className="h-full" />
              </motion.div>
            ))}
          </div>

          {/* Two portrait videos */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-4 lg:row-span-3">
            {[videoPortrait1, videoPortrait2].filter(Boolean).map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.15 }}
                className="flex-1"
              >
                <VideoCard item={v} className="h-full min-h-[240px]" onPlay={setLightboxId} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Ticker */}
        <Ticker />

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="text-3xl font-bold text-forest mb-1 animate-pulse"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                <CountUp value={stat.value} />
              </p>
              <p className="text-sm text-cream/50">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      {lightboxId && (
        <VideoLightbox videoId={lightboxId} onClose={() => setLightboxId(null)} />
      )}
    </section>
  );
}
