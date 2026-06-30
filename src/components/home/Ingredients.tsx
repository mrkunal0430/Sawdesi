"use client";

import { motion } from "framer-motion";

const ingredients = [
  {
    emoji: "🥛",
    name: "Goat Milk",
    sanskrit: "Aja Ksheera",
    benefit: "Skin Nourishing",
    color: "from-[#40916c]/10 to-[#FAF7F2]/30",
    border: "border-forest/15",
  },
  {
    emoji: "🧈",
    name: "Shea Butter",
    sanskrit: "Shea Ghruta",
    benefit: "Deep Moisturizing",
    color: "from-saffron/10 to-[#FAF7F2]/30",
    border: "border-saffron/20",
  },
  {
    emoji: "🍊",
    name: "Orange Peel",
    sanskrit: "Naranga",
    benefit: "Brightens Skin (Vit C)",
    color: "from-orange-500/10 to-[#FAF7F2]/30",
    border: "border-orange-500/20",
  },
  {
    emoji: "🪵",
    name: "Sandalwood",
    sanskrit: "Chandana",
    benefit: "Calms & Soothes",
    color: "from-amber-600/10 to-[#FAF7F2]/30",
    border: "border-amber-600/20",
  },
  {
    emoji: "💛",
    name: "Kasturi Haldi",
    sanskrit: "Haridra",
    benefit: "Anti-bacterial & Glow",
    color: "from-gold/15 to-[#FAF7F2]/30",
    border: "border-gold/20",
  },
  {
    emoji: "🌿",
    name: "Mulethi (Licorice)",
    sanskrit: "Yashtimadhu",
    benefit: "Fades Tan & Dark Spots",
    color: "from-forest-light/10 to-[#FAF7F2]/30",
    border: "border-forest-light/20",
  },
  {
    emoji: "🧱",
    name: "Multani Mitti",
    sanskrit: "Mudd",
    benefit: "Deep Cleansing",
    color: "from-brown/10 to-[#FAF7F2]/30",
    border: "border-brown/20",
  },
  {
    emoji: "✨",
    name: "Kesar Saffron",
    sanskrit: "Kumkuma",
    benefit: "Radiant Complexion",
    color: "from-red-500/10 to-[#FAF7F2]/30",
    border: "border-red-500/20",
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
          <p className="text-forest font-semibold text-sm uppercase tracking-widest mb-3">
            Our Ingredients
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-charcoal mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Pure Botanical Actives
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Every ingredient in our soaps is ethically sourced, identity-preserved, and chosen for its proven efficacy in skincare.
          </p>
        </motion.div>

        {/* Scrollable ingredient cards */}
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0">
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
                  style={{ fontFamily: "var(--font-serif)" }}
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
            <span className="font-semibold text-forest">100% natural</span>,{" "}
            <span className="font-semibold text-forest">pesticide screened</span>, and{" "}
            <span className="font-semibold text-forest">dermatologically safe</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
