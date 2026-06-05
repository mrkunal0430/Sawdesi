"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ANNOUNCEMENT_MESSAGES } from "@/constants";

export function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ANNOUNCEMENT_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="relative bg-saffron text-white text-xs sm:text-sm font-medium py-2 px-4 text-center overflow-hidden"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <div className="h-5 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={current}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="block tracking-wide"
          >
            {ANNOUNCEMENT_MESSAGES[current]}
          </motion.span>
        </AnimatePresence>
      </div>
      <button
        onClick={() => setVisible(false)}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
