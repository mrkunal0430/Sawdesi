"use client";

import { motion } from "framer-motion";
import { Leaf, BookOpen, Award, Sparkles } from "lucide-react";

const benefits = [
  {
    icon: Leaf,
    title: "100% Natural",
    description:
      "Free from synthetic chemicals, sulfates, parabens, and artificial fragrances. Only pure organic botanical extracts.",
    color: "bg-forest/10 text-forest",
  },
  {
    icon: BookOpen,
    title: "Ayurvedic Wisdom",
    description:
      "Time-tested traditional beauty rituals adapted into gentle modern skincare for everyday use.",
    color: "bg-forest/10 text-forest-dark",
  },
  {
    icon: Award,
    title: "Gentle & Tested",
    description:
      "Formulated to be safe and non-irritating. Extremely gentle and suitable for sensitive, dry, and normal skin.",
    color: "bg-gold/15 text-brown",
  },
  {
    icon: Sparkles,
    title: "Enriched with Oils",
    description:
      "Crafted with a moisturizing base of natural cold-pressed oils, goat milk, and raw shea butter that hydrates as it cleanses.",
    color: "bg-saffron/10 text-saffron-dark",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Benefits() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-forest font-semibold text-sm uppercase tracking-widest mb-3">
            Why Sawdesi
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-charcoal"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            The Sawdesi Skincare Difference
          </h2>
          <p className="text-muted mt-4 max-w-xl mx-auto">
            We believe natural skincare should be pure, simple, and rooted in traditional botanical wisdom. No fillers, no toxins — just skin-loving ingredients.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group bg-cream rounded-2xl p-7 border border-border hover:border-forest/30 hover:shadow-lg transition-all duration-300 cursor-default"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${benefit.color} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={22} />
                </div>
                <h3
                  className="text-lg font-bold text-charcoal mb-2"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
