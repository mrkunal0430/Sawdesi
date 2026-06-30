"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Are Sawdesi skincare products suitable for sensitive skin?",
    a: "Yes, our natural soaps are formulated using pure natural oils, goat milk, and shea butter, making them extremely gentle. They are free from harsh chemical detergents like SLS, SLES, parabens, and synthetic preservatives, which makes them ideal for sensitive, dry, and normal skin types.",
  },
  {
    q: "What does the 'Tan Removal & Skin Brightening' soap contain?",
    a: "It is enriched with wild turmeric (Kasturi Haldi), orange peel (which provides natural Vitamin C), sandalwood powder, licorice (Mulethi), and goat milk. These ingredients work synergistically to reduce sun tan, fade dark spots, and restore your skin's natural radiant glow.",
  },
  {
    q: "Do you use chemical foaming agents (surfactants) in your soaps?",
    a: "No, we do not. Traditional commercial soaps use synthetic surfactants to create foam, which strips skin of its natural moisture. Our soaps lather naturally through saponified organic coconut oil, olive oil, and raw shea butter, keeping your skin soft and hydrated.",
  },
  {
    q: "Are your skincare products tested on animals?",
    a: "No, all Sawdesi skincare products are 100% cruelty-free. We only test our formulations on human volunteers and never on animals.",
  },
  {
    q: "How should I store my natural soap to make it last longer?",
    a: "Since natural soaps contain high glycerin content which attracts moisture, they can get soft if left in standing water. We recommend storing your soap bar on a well-drained soap dish or rack between uses, allowing it to dry completely.",
  },
  {
    q: "Are your ingredients organic?",
    a: "Yes, all botanical extracts, herbs, and carrier oils used in our soaps are sourced from organic and pesticide-free farms. Every batch undergoes strict quality control and safety testing before manufacturing.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-cream" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-forest font-semibold text-sm uppercase tracking-widest mb-3">
            Got Questions?
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-charcoal"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`rounded-2xl border transition-colors duration-200 overflow-hidden ${
                  isOpen
                    ? "border-forest/40 bg-white shadow-sm"
                    : "border-border bg-white"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-semibold text-base transition-colors ${
                      isOpen ? "text-forest-dark" : "text-charcoal"
                    }`}
                  >
                    {faq.q}
                  </span>
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      isOpen
                        ? "bg-forest text-cream"
                        : "bg-cream-dark text-muted"
                    }`}
                  >
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 text-sm text-muted leading-relaxed border-t border-border pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
