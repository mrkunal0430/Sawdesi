"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Leaf, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";

/* ── Staggered letter animation ─────────────────────────────────────── */
function KineticWord({
  word,
  delay = 0,
  className = "",
}: {
  word: string;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex ${className}`}>
      {word.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 60, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.04,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: char === " " ? "inline" : "inline-block", transformOrigin: "bottom" }}
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ── Radiance ring pulse ─────────────────────────────────────────────── */
function RadianceRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{ borderColor: "rgba(245,166,35,0.25)" }}
          initial={{ width: 160, height: 160, opacity: 0 }}
          animate={{
            width: [160, 360 + i * 60],
            height: [160, 360 + i * 60],
            opacity: [0.7, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/* ── Floating botanical SVGs ─────────────────────────────────────────── */
const botanicals = [
  {
    id: "leaf1",
    x: "8%", y: "18%",
    size: 48,
    delay: 0.3,
    rotate: -25,
    floatY: -14,
    path: "M12 2C8 8 4 14 12 22C20 14 16 8 12 2Z",
    color: "#2D6A4F",
  },
  {
    id: "leaf2",
    x: "82%", y: "12%",
    size: 36,
    delay: 0.7,
    rotate: 30,
    floatY: 10,
    path: "M12 2C8 8 4 14 12 22C20 14 16 8 12 2Z",
    color: "#40916C",
  },
  {
    id: "petal1",
    x: "5%", y: "60%",
    size: 52,
    delay: 1.1,
    rotate: 15,
    floatY: -8,
    path: "M12 3 C 6 7 4 13 8 17 C 12 21 18 19 20 14 C 22 9 18 4 12 3Z",
    color: "#8B5E52",
  },
  {
    id: "petal2",
    x: "88%", y: "55%",
    size: 40,
    delay: 0.5,
    rotate: -40,
    floatY: 12,
    path: "M12 3 C 6 7 4 13 8 17 C 12 21 18 19 20 14 C 22 9 18 4 12 3Z",
    color: "#D4A017",
  },
  {
    id: "spark1",
    x: "75%", y: "80%",
    size: 24,
    delay: 1.4,
    rotate: 0,
    floatY: -10,
    path: "M12 2L13.5 9H20L15 13L17 20L12 16L7 20L9 13L4 9H10.5Z",
    color: "#F5A623",
  },
  {
    id: "spark2",
    x: "18%", y: "78%",
    size: 20,
    delay: 2.0,
    rotate: 20,
    floatY: 8,
    path: "M12 2L13.5 9H20L15 13L17 20L12 16L7 20L9 13L4 9H10.5Z",
    color: "#FAC76B",
  },
];

/* ── Soap bar 3-D visual ─────────────────────────────────────────────── */
function SoapVisual({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const rotateX = useTransform(
    useSpring(useMotionValue(mouseY), { stiffness: 60, damping: 20 }),
    [-0.5, 0.5],
    [8, -8]
  );
  const rotateY = useTransform(
    useSpring(useMotionValue(mouseX), { stiffness: 60, damping: 20 }),
    [-0.5, 0.5],
    [-12, 12]
  );

  const springX = useSpring(useMotionValue(mouseX * 18), { stiffness: 60, damping: 20 });
  const springY = useSpring(useMotionValue(mouseY * 18), { stiffness: 60, damping: 20 });

  useEffect(() => {
    springX.set(mouseX * 18);
    springY.set(mouseY * 18);
  }, [mouseX, mouseY, springX, springY]);

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ perspective: 900, rotateX, rotateY }}
    >
      {/* Radiance rings */}
      <RadianceRings />

      {/* Glow backdrop */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 260,
          height: 260,
          background: "radial-gradient(circle, rgba(245,166,35,0.22) 0%, rgba(212,160,23,0.10) 50%, transparent 80%)",
          x: springX,
          y: springY,
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Soap bar */}
      <motion.div
        className="relative z-10"
        animate={{ y: [0, -12, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ x: springX, y: springY }}
      >
        {/* Main soap shape */}
        <div
          className="relative"
          style={{
            width: 200,
            height: 90,
            borderRadius: "50px / 40px",
            background: "linear-gradient(135deg, #e8dff5 0%, #d4c8ef 35%, #b8a8e0 70%, #9e8dd0 100%)",
            boxShadow: "0 24px 60px rgba(120,90,180,0.35), 0 8px 20px rgba(120,90,180,0.2), inset 0 2px 6px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(80,50,140,0.15)",
          }}
        >
          {/* Shimmer streak */}
          <motion.div
            className="absolute inset-0 rounded-[50px]"
            style={{
              background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)",
              borderRadius: "50px / 40px",
            }}
            animate={{ x: [-220, 220] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
          />

          {/* Embossed brand text */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "rgba(80,50,140,0.45)",
              textShadow: "0 1px 0 rgba(255,255,255,0.5)",
              userSelect: "none",
            }}
          >
            SAWDESI
          </div>
        </div>

        {/* Soap shadow */}
        <div
          className="mx-auto mt-3"
          style={{
            width: 160,
            height: 18,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(120,90,180,0.25) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ── Floating badge pill ─────────────────────────────────────────────── */
function FloatingBadge({
  icon: Icon,
  label,
  sub,
  delay,
  floatDir,
  className = "",
}: {
  icon: React.ElementType;
  label: string;
  sub: string;
  delay: number;
  floatDir: 1 | -1;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute z-20 ${className}`}
    >
      <motion.div
        animate={{ y: [0, floatDir * 8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay }}
        className="flex items-center gap-2.5 bg-white/80 backdrop-blur-md rounded-2xl px-3 py-2.5 shadow-lg border border-white/60"
        style={{ boxShadow: "0 8px 32px rgba(120,90,180,0.12), 0 2px 8px rgba(0,0,0,0.06)" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, rgba(245,166,35,0.15), rgba(212,160,23,0.08))" }}
        >
          <Icon size={16} className="text-saffron-dark" />
        </div>
        <div>
          <p className="text-xs font-semibold text-charcoal leading-tight">{label}</p>
          <p className="text-[10px] text-muted leading-tight mt-0.5">{sub}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Hero ───────────────────────────────────────────────────────── */
export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouse({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #eeeaf8 0%, #f3eff9 30%, #faf7f2 65%, #f5f0e8 100%)",
      }}
    >
      {/* ── Mesh background blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 500,
            height: 500,
            left: "-8%",
            top: "-10%",
            background: "radial-gradient(circle, rgba(190,170,240,0.28) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
          animate={{ scale: [1, 1.12, 1], x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 420,
            height: 420,
            right: "-5%",
            bottom: "5%",
            background: "radial-gradient(circle, rgba(245,166,35,0.16) 0%, transparent 65%)",
            filter: "blur(50px)",
          }}
          animate={{ scale: [1, 1.08, 1], y: [0, -24, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 300,
            height: 300,
            left: "40%",
            top: "60%",
            background: "radial-gradient(circle, rgba(45,106,79,0.10) 0%, transparent 65%)",
            filter: "blur(35px)",
          }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
      </div>

      {/* ── Botanical floaters ── */}
      {botanicals.map((b) => (
        <motion.div
          key={b.id}
          className="absolute pointer-events-none select-none"
          style={{ left: b.x, top: b.y }}
          initial={{ opacity: 0, scale: 0, rotate: b.rotate - 20 }}
          animate={{ opacity: 0.65, scale: 1, rotate: b.rotate }}
          transition={{ duration: 1, delay: b.delay, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            animate={{ y: [0, b.floatY, 0], rotate: [b.rotate, b.rotate + 4, b.rotate] }}
            transition={{ duration: 6 + b.delay, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width={b.size} height={b.size} viewBox="0 0 24 24" fill="none">
              <path d={b.path} fill={b.color} fillOpacity={0.7} />
            </svg>
          </motion.div>
        </motion.div>
      ))}

      {/* ── Large decorative "BEAUTY" watermark ── */}
      <div
        className="absolute right-0 top-0 h-full flex items-center pointer-events-none select-none overflow-hidden"
        style={{ width: "38%" }}
      >
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontSize: "clamp(80px, 12vw, 160px)",
            fontWeight: 900,
            letterSpacing: "0.06em",
            writingMode: "vertical-rl",
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(160,130,210,0.18)",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          BEAUTY
        </motion.div>
      </div>

      {/* ── Main content grid ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="grid lg:grid-cols-[1fr_1px_1fr] gap-8 lg:gap-16 items-center">

          {/* Left column ─ text */}
          <div className="max-w-xl">
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-8"
            >
              <div
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide"
                style={{
                  background: "rgba(120,90,180,0.10)",
                  border: "1px solid rgba(120,90,180,0.20)",
                  color: "#6B3D2E",
                  backdropFilter: "blur(8px)",
                }}
              >
                <motion.span
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#F5A623", display: "inline-block" }}
                />
                Herbal · Tan Removal · Skin Brightening
              </div>
            </motion.div>

            {/* Headline ─ kinetic letters */}
            <h1
              className="mb-6 leading-[1.05] tracking-tight"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(42px, 5.5vw, 76px)",
                fontWeight: 800,
              }}
            >
              <div className="overflow-hidden" style={{ color: "#1C1C1C" }}>
                <KineticWord word="A Simple" delay={0.1} />
              </div>
              <div className="overflow-hidden" style={{ color: "#1C1C1C" }}>
                <KineticWord word="Way to" delay={0.25} />
              </div>
              <div className="overflow-hidden">
                <KineticWord
                  word="Brighten"
                  delay={0.4}
                  className="italic"
                  style={{ color: "transparent", WebkitTextStroke: "2px #2D6A4F" } as React.CSSProperties}
                />
              </div>
              <div className="overflow-hidden">
                <KineticWord
                  word="Your Skin"
                  delay={0.55}
                  style={{ color: "#2D6A4F" } as React.CSSProperties}
                />
              </div>
            </h1>

            {/* Sub-copy */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="text-base leading-relaxed mb-2"
              style={{ color: "#7A7169", maxWidth: "38ch" }}
            >
              Pure herbal soaps crafted with turmeric, saffron & neem — remove
              tan, restore radiance, and reveal your natural glow.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.05 }}
              className="text-sm mb-10"
              style={{ color: "#8B5E52" }}
            >
              Take the quiz to find your perfect Sawdesi soap.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="flex flex-wrap gap-3 mb-12"
            >
              <Link
                href="/products"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-sm text-white transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #2D6A4F 0%, #40916C 100%)",
                  boxShadow: "0 8px 28px rgba(45,106,79,0.35)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px rgba(45,106,79,0.5)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(45,106,79,0.35)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                Get Started
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  border: "1.5px solid rgba(120,90,180,0.20)",
                  color: "#1C1C1C",
                  backdropFilter: "blur(8px)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.92)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.7)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                Our Story
              </Link>
            </motion.div>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="flex flex-wrap items-center gap-5"
            >
              {[
                { icon: Leaf, label: "100% Herbal" },
                { icon: Sparkles, label: "Removes Tan" },
                { icon: Star, label: "4.9 · 12k+ Reviews" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#6B3D2E" }}>
                  <Icon size={14} style={{ color: "#2D6A4F" }} />
                  {label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Divider (desktop) */}
          <div
            className="hidden lg:block self-stretch"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(160,130,210,0.2), transparent)" }}
          />

          {/* Right column ─ soap visual */}
          <div className="relative flex items-center justify-center lg:h-[520px] h-[360px]">
            {/* Flower arch illustration (inline SVG) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute"
              style={{ top: "4%", right: "8%", width: 90, height: 110 }}
            >
              <svg viewBox="0 0 90 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Arch */}
                <path
                  d="M15 105 Q15 40 45 20 Q75 40 75 105"
                  stroke="rgba(120,90,180,0.35)"
                  strokeWidth="1.2"
                  fill="rgba(190,170,240,0.08)"
                />
                {/* Stem */}
                <line x1="45" y1="20" x2="45" y2="8" stroke="rgba(45,106,79,0.5)" strokeWidth="1.2" />
                {/* Flower center */}
                <circle cx="45" cy="6" r="4" fill="rgba(245,166,35,0.5)" />
                {/* Petals */}
                {[0, 60, 120, 180, 240, 300].map((angle) => (
                  <ellipse
                    key={angle}
                    cx={45 + 8 * Math.cos((angle * Math.PI) / 180)}
                    cy={6 + 8 * Math.sin((angle * Math.PI) / 180)}
                    rx="3.5"
                    ry="5"
                    transform={`rotate(${angle} ${45 + 8 * Math.cos((angle * Math.PI) / 180)} ${6 + 8 * Math.sin((angle * Math.PI) / 180)})`}
                    fill="rgba(190,170,240,0.6)"
                  />
                ))}
                {/* Small stars */}
                <text x="8" y="30" fontSize="10" fill="rgba(245,166,35,0.5)">✦</text>
                <text x="70" y="50" fontSize="7" fill="rgba(190,170,240,0.6)">✦</text>
                <text x="20" y="75" fontSize="6" fill="rgba(45,106,79,0.4)">✦</text>
              </svg>
            </motion.div>

            {/* Soap 3D interactive */}
            <SoapVisual mouseX={mouse.x} mouseY={mouse.y} />

            {/* Floating badges */}
            <FloatingBadge
              icon={Leaf}
              label="Turmeric & Neem"
              sub="De-tans in 7 days"
              delay={1.0}
              floatDir={-1}
              className="left-0 top-[28%] -translate-x-1/4"
            />
            <FloatingBadge
              icon={Sparkles}
              label="Saffron Glow"
              sub="Brightens & evens tone"
              delay={1.2}
              floatDir={1}
              className="right-0 top-[18%] translate-x-1/4"
            />
            <FloatingBadge
              icon={Star}
              label="12,000+ Happy Skin"
              sub="Verified reviews"
              delay={1.4}
              floatDir={-1}
              className="right-0 bottom-[22%] translate-x-1/6"
            />

            {/* Bottom glow streak */}
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                width: 200,
                height: 2,
                background: "linear-gradient(90deg, transparent, rgba(245,166,35,0.5), transparent)",
                filter: "blur(3px)",
              }}
              animate={{ scaleX: [0.6, 1.2, 0.6], opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
