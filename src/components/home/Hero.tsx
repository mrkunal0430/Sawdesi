"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, FlaskConical, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";

const trustBadges = [
  { icon: ShieldCheck, label: "Chemical & Paraben Free" },
  { icon: FlaskConical, label: "Dermatologically Tested" },
  { icon: MapPin, label: "Handcrafted in India" },
];

const floatingOrbs = [
  { size: 280, x: "10%", y: "20%", color: "rgba(45,106,79,0.08)", delay: 0 },
  { size: 200, x: "75%", y: "60%", color: "rgba(64,145,108,0.06)", delay: 1.5 },
  { size: 150, x: "60%", y: "15%", color: "rgba(212,160,23,0.05)", delay: 3 },
];

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-cream">
      {/* Floating background orbs */}
      {floatingOrbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          }}
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 7 + i * 2,
            repeat: Infinity,
            delay: orb.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-forest/10 border border-forest/25 text-forest-dark text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
            >
              <span className="w-1.5 h-1.5 bg-forest rounded-full animate-pulse" />
              100% Natural Skincare
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal leading-[1.1] tracking-tight mb-6"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Nature's Touch for <span className="text-forest">Radiant, Healthy</span> Skin
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted text-lg leading-relaxed mb-8 max-w-lg"
            >
              Handcrafted natural soaps enriched with wild turmeric, orange peel, sandalwood, and nourishing goat milk. Formulated to gently cleanse, reduce tanning, and bring out your skin's natural glow.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <Button size="lg" variant="primary" asChild>
                <Link href="/products" className="group flex items-center gap-2">
                  Shop Our Collection
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <Link href="/about">Our Story</Link>
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap gap-4"
            >
              {trustBadges.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 text-sm text-brown font-medium"
                >
                  <Icon size={15} className="text-forest" />
                  {label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Visual showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:h-[540px] h-[360px] w-full"
          >
            {/* Main product visual */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border border-border bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/hero-soap-render.jpg" 
                alt="Sawdesi Natural Skincare Soap" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              {/* Subtle natural vignetting overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating product chips */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-6 top-1/4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-3.5 flex items-center gap-3 border border-border z-10"
            >
              <div className="w-11 h-11 rounded-xl bg-forest/10 flex items-center justify-center text-xl shrink-0">
                🥛
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal">Goat Milk</p>
                <p className="text-[10px] text-muted">Deep Nourishment</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -right-4 top-1/3 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-3.5 flex items-center gap-3 border border-border z-10"
            >
              <div className="w-11 h-11 rounded-xl bg-saffron/15 flex items-center justify-center text-xl shrink-0">
                🍊
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal">Orange Peel</p>
                <p className="text-[10px] text-muted">Natural Vitamin C</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute -right-4 bottom-1/4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-3.5 flex items-center gap-3 border border-border z-10"
            >
              <div className="w-11 h-11 rounded-xl bg-gold/15 flex items-center justify-center text-xl shrink-0">
                ✨
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal">Wild Turmeric</p>
                <p className="text-[10px] text-muted">Tan Removal & Glow</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
