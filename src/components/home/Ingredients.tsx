"use client";

import { motion } from "framer-motion";

const ingredients = [
  {
    emoji: "🌿",
    name: "Tulsi",
    sanskrit: "Ocimum sanctum",
    benefit: "Adaptogen & Immunity",
    color: "from-forest/20 to-forest/5",
    border: "border-forest/20",
  },
  {
    emoji: "🟡",
    name: "Turmeric",
    sanskrit: "Curcuma longa",
    benefit: "Anti-inflammatory",
    color: "from-saffron/20 to-saffron/5",
    border: "border-saffron/20",
  },
  {
    emoji: "🫚",
    name: "A2 Ghee",
    sanskrit: "Sarpi",
    benefit: "Digestive Health",
    color: "from-gold/20 to-gold/5",
    border: "border-gold/20",
  },
  {
    emoji: "🍃",
    name: "Moringa",
    sanskrit: "Shigru",
    benefit: "92 Nutrients",
    color: "from-forest-light/20 to-forest-light/5",
    border: "border-forest-light/20",
  },
  {
    emoji: "🌰",
    name: "Ashwagandha",
    sanskrit: "Withania somnifera",
    benefit: "Stress & Vitality",
    color: "from-brown/15 to-brown/5",
    border: "border-brown/20",
  },
  {
    emoji: "🍒",
    name: "Amla",
    sanskrit: "Emblica officinalis",
    benefit: "Vitamin C · Immunity",
    color: "from-saffron/15 to-forest/10",
    border: "border-saffron/15",
  },
  {
    emoji: "🌱",
    name: "Giloy",
    sanskrit: "Tinospora cordifolia",
    benefit: "Fever & Detox",
    color: "from-forest-dark/15 to-forest/5",
    border: "border-forest-dark/20",
  },
  {
    emoji: "🌶️",
    name: "Black Pepper",
    sanskrit: "Maricha",
    benefit: "Bioavailability Booster",
    color: "from-charcoal/10 to-charcoal/5",
    border: "border-charcoal/15",
  },
];

export function Ingredients() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-saffron font-semibold text-sm uppercase tracking-widest mb-3">
            Our Pantry
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-charcoal mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Pure Ingredients, No Compromises
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Every ingredient is ethically sourced, identity-preserved, and
            chosen for its proven efficacy in Ayurvedic science.
          </p>
        </motion.div>

        {/* Scrollable ingredient cards */}
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
            {ingredients.map((ing, i) => (
              <motion.div
                key={ing.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`shrink-0 w-52 lg:w-auto snap-start rounded-2xl bg-gradient-to-br ${ing.color} border ${ing.border} p-5 cursor-default`}
              >
                <div className="text-4xl mb-3 select-none">{ing.emoji}</div>
                <h3
                  className="font-bold text-charcoal text-base mb-0.5"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {ing.name}
                </h3>
                <p className="text-xs text-muted italic mb-2">{ing.sanskrit}</p>
                <span className="inline-block text-xs font-semibold text-forest bg-forest/10 px-2 py-0.5 rounded-full">
                  {ing.benefit}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted">
            All ingredients are{" "}
            <span className="font-semibold text-forest">FSSAI certified</span>,{" "}
            <span className="font-semibold text-forest">pesticide screened</span>, and{" "}
            <span className="font-semibold text-forest">heavy-metal tested</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
