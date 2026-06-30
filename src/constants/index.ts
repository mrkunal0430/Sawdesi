import type { NavLink } from "@/types";

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const ANNOUNCEMENT_MESSAGES = [
  "🌿 Free shipping on orders above ₹499",
  "✨ 100% Natural & Preservative Free",
  "🇮🇳 Trusted by 50,000+ families across India",
  "🎁 Use code FIRST10 for 10% off your first order",
];

export const PRODUCT_CATEGORIES = [
  { label: "All Products", value: "all" },
  { label: "Handcrafted Soaps", value: "soaps" },
];

export const FREE_SHIPPING_THRESHOLD = 499;
export const RAZORPAY_CURRENCY = "INR";
