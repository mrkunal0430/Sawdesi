"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { MOCK_TESTIMONIALS } from "@/constants";

export function Testimonials() {
  return (
    <section className="py-20 bg-forest-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-saffron font-semibold text-sm uppercase tracking-widest mb-3">
            Real Families. Real Results.
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-cream"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            What Our Families Say
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {MOCK_TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/8 transition-colors"
            >
              {/* Quote icon */}
              <Quote size={20} className="text-saffron opacity-60" />

              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(t.rating)].map((_, idx) => (
                  <Star key={idx} size={14} className="fill-saffron text-saffron" />
                ))}
              </div>

              {/* Review text */}
              <p className="text-cream/80 text-sm leading-relaxed flex-1 italic">
                &ldquo;{t.review}&rdquo;
              </p>

              {/* Reviewer */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <div className="w-9 h-9 rounded-full bg-saffron flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-cream">{t.name}</p>
                  <p className="text-xs text-cream/50">{t.location}</p>
                </div>
              </div>

              {/* Product tag */}
              <span className="text-xs text-saffron/80 font-medium bg-saffron/10 border border-saffron/20 rounded-full px-2.5 py-0.5 self-start">
                {t.product}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/10 pt-12"
        >
          {[
            { value: "50,000+", label: "Happy families" },
            { value: "4.8★", label: "Average rating" },
            { value: "98%", label: "Repeat buyers" },
            { value: "12+", label: "Years of R&D" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="text-3xl font-bold text-saffron mb-1"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {stat.value}
              </p>
              <p className="text-sm text-cream/60">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
