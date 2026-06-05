"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Are Sawdesi products truly preservative-free?",
    a: "Yes, absolutely. None of our products contain artificial preservatives, colors, or flavors. We use only natural preservation methods — low moisture content, vacuum sealing, and traditional recipes that are inherently shelf-stable. Every batch is third-party tested to confirm this.",
  },
  {
    q: "What makes A2 ghee different from regular ghee?",
    a: "A2 ghee comes from indigenous Gir cow breeds that produce milk containing only the A2 beta-casein protein. Regular commercial ghee often comes from Holstein cows that produce A1 beta-casein, which some research links to digestive discomfort. A2 ghee is closer to what humans have consumed for thousands of years and is generally better tolerated.",
  },
  {
    q: "Are your products safe for children?",
    a: "Most of our products are suitable for children above 2 years, with adjusted dosages. Our Chyawanprash is specifically beneficial for growing children. We recommend consulting your pediatrician for infants. All age recommendations are clearly stated on our product pages.",
  },
  {
    q: "How long does shipping take?",
    a: "Metro cities (Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Kolkata): 1–2 business days. Tier 2 cities: 2–4 business days. Remote areas: 4–7 business days. We ship pan-India and offer free shipping on all orders above ₹499.",
  },
  {
    q: "Can I return or exchange products?",
    a: "We have a 15-day return policy for sealed, unopened products. If you receive a damaged or incorrect item, we'll replace it immediately at no cost. For quality concerns with opened products, please reach out — we stand behind everything we sell.",
  },
  {
    q: "Are your products certified organic?",
    a: "Most of our raw ingredients are sourced from certified organic or naturally-grown farms. While not all products carry an official organic certification (a lengthy and expensive process), every ingredient is tested for pesticide residue and heavy metals before use.",
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
          <p className="text-saffron font-semibold text-sm uppercase tracking-widest mb-3">
            Got Questions?
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-charcoal"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Frequently Asked
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
                    ? "border-saffron/40 bg-white shadow-sm"
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
                      isOpen ? "text-saffron-dark" : "text-charcoal"
                    }`}
                  >
                    {faq.q}
                  </span>
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      isOpen
                        ? "bg-saffron text-white"
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
