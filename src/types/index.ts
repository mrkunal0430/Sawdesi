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
  inStock: boolean;
  featured: boolean;
  weight?: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  couponCode?: string;
  discount?: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Address {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentId?: string;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  role: "customer" | "admin";
  createdAt: string;
  addresses?: Address[];
  loyaltyPoints?: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

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
  publishedAt: string;
}

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

export interface NavLink {
  label: string;
  href: string;
}
