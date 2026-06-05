"use client";

import Link from "next/link";
import { Leaf, Share2, Rss, Globe, AtSign, Mail } from "lucide-react";

const footerLinks = {
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Our Story", href: "/about#story" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
  ],
  Shop: [
    { label: "All Products", href: "/products" },
    { label: "Bestsellers", href: "/products?filter=bestseller" },
    { label: "New Arrivals", href: "/products?filter=new" },
    { label: "Gift Sets", href: "/products?category=gifts" },
  ],
  Support: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/#faq" },
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Returns & Refunds", href: "/returns" },
  ],
};

const socials = [
  { icon: AtSign, label: "Instagram", href: "#" },
  { icon: Globe, label: "Facebook", href: "#" },
  { icon: Rss, label: "YouTube", href: "#" },
  { icon: Share2, label: "Twitter / X", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-forest-dark text-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-saffron rounded-xl flex items-center justify-center">
                <Leaf size={18} className="text-white" />
              </div>
              <span
                className="text-2xl font-bold text-cream"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Sawdesi
              </span>
            </div>
            <p className="text-cream/70 text-sm leading-relaxed mb-6 max-w-xs">
              From India&apos;s soil to your table. Bringing the wisdom of
              Ayurveda into modern homes through pure, potent, and
              preservative-free superfoods.
            </p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-cream/70 hover:bg-saffron hover:text-white transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-cream mb-4 uppercase tracking-wider">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/65 hover:text-cream transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-white/10 pt-10 mb-10">
          <div className="max-w-md">
            <h4 className="font-serif text-lg font-semibold text-cream mb-1">
              Join the Sawdesi family
            </h4>
            <p className="text-sm text-cream/65 mb-4">
              Recipes, Ayurvedic tips, and exclusive offers — straight to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2"
            >
              <div className="flex-1 relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40"
                />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full h-11 bg-white/10 border border-white/20 rounded-xl pl-9 pr-4 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="h-11 px-5 bg-saffron text-white text-sm font-medium rounded-xl hover:bg-saffron-dark transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Payment Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="text-xs text-cream/50 mr-1">Secure payments via:</span>
          {["Visa", "Mastercard", "UPI", "Razorpay", "Net Banking"].map((p) => (
            <span
              key={p}
              className="text-xs bg-white/10 text-cream/70 px-2.5 py-1 rounded-md border border-white/10"
            >
              {p}
            </span>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/50">
          <p>© 2025 Sawdesi. All rights reserved. Made with ♥ in India.</p>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms of Use", "Shipping Policy"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                className="hover:text-cream/80 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
