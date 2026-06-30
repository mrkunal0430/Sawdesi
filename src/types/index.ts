// ─── Product ────────────────────────────────────────────────
export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  ingredients: string[];
  howToUse: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  tags: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  stockQuantity: number;
  lowStockThreshold: number;
  featured: boolean;
  weight?: string;
  createdAt: string;
  updatedAt?: string;
}

// ─── Profile (replaces old User) ────────────────────────────
export interface Profile {
  id: string;
  phone: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Admin ──────────────────────────────────────────────────
export interface Admin {
  id: string;
  email: string;
  role: "admin" | "super_admin";
  active: boolean;
  createdAt: string;
}

// ─── Address ────────────────────────────────────────────────
export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  houseNumber: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault: boolean;
  createdAt: string;
}

// ─── Cart ───────────────────────────────────────────────────
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  couponCode?: string;
  discount?: number;
}

/** Server-side cart row */
export interface ServerCart {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/** Server-side cart item row */
export interface ServerCartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  product?: Product;
}

// ─── Orders ─────────────────────────────────────────────────
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  id?: string;
  orderId?: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items?: OrderItem[];
  shippingAddress: OrderAddress;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentId?: string;
  couponCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/** Address snapshot stored in order JSON */
export interface OrderAddress {
  fullName: string;
  phone: string;
  houseNumber: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

// ─── Review ─────────────────────────────────────────────────
export interface Review {
  id: string;
  productId: string;
  userId?: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

// ─── Testimonial ────────────────────────────────────────────
export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  product: string;
  initials: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  active: boolean;
  sortOrder: number;
  createdAt: string;
}

// ─── Blog ───────────────────────────────────────────────────
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  authorAvatar?: string;
  category: string;
  tags: string[];
  coverImage?: string;
  readTime: number;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

// ─── Coupon ─────────────────────────────────────────────────
export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
  expiresAt?: string;
  createdAt: string;
}

// ─── Navigation ─────────────────────────────────────────────
export interface NavLink {
  label: string;
  href: string;
}
