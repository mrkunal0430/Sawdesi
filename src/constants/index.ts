import type { NavLink, Product, BlogPost } from "@/types";

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
  { label: "Immunity Boosters", value: "immunity" },
  { label: "Superfoods", value: "superfoods" },
  { label: "Herbal Powders", value: "herbal-powders" },
  { label: "Ghee & Oils", value: "ghee-oils" },
  { label: "Wellness Drinks", value: "wellness-drinks" },
  { label: "Ayurvedic Classics", value: "ayurvedic-classics" },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "pure-a2-ghee",
    name: "Pure A2 Cow Ghee",
    shortDescription: "Traditionally churned from A2 Gir cow milk",
    description:
      "Our A2 Ghee is made using the traditional Bilona method — slow churning of hand-set curd from pure Gir cow milk. Rich in CLA, butyric acid, and fat-soluble vitamins, it supports digestion, immunity, and joint health. The golden hue and grainy texture are hallmarks of authentic desi ghee.",
    ingredients: ["100% A2 Gir Cow Milk"],
    howToUse:
      "Add 1–2 teaspoons to hot rice, dal, or roti. Use for cooking at high temperatures. Take 1 teaspoon on an empty stomach for best results.",
    price: 799,
    originalPrice: 999,
    discount: 20,
    category: "ghee-oils",
    tags: ["bestseller", "a2", "ghee", "immunity"],
    images: [],
    rating: 4.8,
    reviewCount: 342,
    inStock: true,
    featured: true,
    weight: "500ml",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    slug: "chyawanprash-classic",
    name: "Classic Chyawanprash",
    shortDescription: "Ancient Ayurvedic immunity formula with 40+ herbs",
    description:
      "Our Chyawanprash is crafted from an authentic 5,000-year-old recipe using 40+ Himalayan herbs, Amla, Ashwagandha, and pure A2 ghee. It strengthens immunity, improves stamina, and nourishes the body from within. No artificial colors, no preservatives — just pure Ayurveda.",
    ingredients: ["Amla", "Ashwagandha", "Brahmi", "Giloy", "A2 Ghee", "Honey", "40+ Himalayan herbs"],
    howToUse:
      "Take 1–2 teaspoons with warm milk twice daily. Children: 1 teaspoon. Adults: 2 teaspoons. Best taken in the morning.",
    price: 549,
    originalPrice: 699,
    discount: 21,
    category: "ayurvedic-classics",
    tags: ["bestseller", "immunity", "chyawanprash"],
    images: [],
    rating: 4.9,
    reviewCount: 518,
    inStock: true,
    featured: true,
    weight: "500g",
    createdAt: "2024-01-05",
  },
  {
    id: "3",
    slug: "moringa-powder",
    name: "Moringa Leaf Powder",
    shortDescription: "Nutrient-dense 'drumstick tree' superfood powder",
    description:
      "Sourced from organic moringa farms in Andhra Pradesh, our Moringa powder is shade-dried and stone-ground to preserve its exceptional nutrient profile. With 92 nutrients, 46 antioxidants, and all 9 essential amino acids, moringa is nature's most potent multivitamin.",
    ingredients: ["100% Organic Moringa Leaves"],
    howToUse:
      "Add 1 teaspoon to smoothies, juices, warm water, or sprinkle on food. Start with ½ teaspoon if new to moringa.",
    price: 299,
    originalPrice: 399,
    discount: 25,
    category: "herbal-powders",
    tags: ["superfood", "moringa", "vegan"],
    images: [],
    rating: 4.7,
    reviewCount: 203,
    inStock: true,
    featured: true,
    weight: "200g",
    createdAt: "2024-01-10",
  },
  {
    id: "4",
    slug: "ashwagandha-root-powder",
    name: "Ashwagandha Root Powder",
    shortDescription: "KSM-66 certified adaptogen for stress & vitality",
    description:
      "Our Ashwagandha is sourced from Rajasthan's sun-baked plains where it grows wild and potent. KSM-66 certified full-spectrum root extract — the world's most researched ashwagandha. Clinically proven to reduce cortisol, improve energy, strength, and sexual vitality.",
    ingredients: ["100% KSM-66 Ashwagandha Root Extract"],
    howToUse:
      "Mix ½ teaspoon in warm milk with a pinch of black pepper before bed. Or take 1 capsule equivalent (300mg) twice daily.",
    price: 449,
    originalPrice: 549,
    discount: 18,
    category: "herbal-powders",
    tags: ["adaptogen", "stress-relief", "ashwagandha"],
    images: [],
    rating: 4.8,
    reviewCount: 289,
    inStock: true,
    featured: true,
    weight: "150g",
    createdAt: "2024-01-15",
  },
  {
    id: "5",
    slug: "golden-turmeric-latte-mix",
    name: "Golden Turmeric Latte Mix",
    shortDescription: "Haldi doodh reimagined with 7 warming spices",
    description:
      "Our Golden Latte Mix is a carefully balanced blend of high-curcumin Lakadong turmeric, black pepper (for 2000% better absorption), cinnamon, cardamom, ginger, and ashwagandha. A warm, comforting bedtime ritual that fights inflammation, aids sleep, and nourishes from within.",
    ingredients: ["Lakadong Turmeric", "Black Pepper", "Cinnamon", "Cardamom", "Ginger", "Ashwagandha", "Coconut Milk Powder"],
    howToUse:
      "Whisk 1 teaspoon in 200ml warm milk (dairy or plant-based). Sweeten with honey if desired. Best consumed 30 minutes before bed.",
    price: 349,
    originalPrice: 449,
    discount: 22,
    category: "wellness-drinks",
    tags: ["turmeric", "sleep", "anti-inflammatory", "haldi"],
    images: [],
    rating: 4.9,
    reviewCount: 431,
    inStock: true,
    featured: true,
    weight: "200g",
    createdAt: "2024-02-01",
  },
  {
    id: "6",
    slug: "immunity-kadha-mix",
    name: "Immunity Kadha Mix",
    shortDescription: "Traditional dadi-ma recipe with tulsi, ginger & clove",
    description:
      "Inspired by grandmothers' kitchens across India, our Kadha Mix combines 11 time-tested herbs and spices: Tulsi, Ginger, Black Pepper, Clove, Cinnamon, Mulethi, Giloy, Amla, Turmeric, Cardamom, and Ashwagandha. Brew a cup at the first sign of a sniffle — or daily to stay protected.",
    ingredients: ["Tulsi", "Ginger", "Black Pepper", "Clove", "Cinnamon", "Mulethi", "Giloy", "Amla", "Turmeric", "Cardamom", "Ashwagandha"],
    howToUse:
      "Boil 1 teaspoon in 300ml water for 5–7 minutes. Strain, add honey and a squeeze of lemon. Drink warm. Can be had 1–2 times daily.",
    price: 249,
    originalPrice: 299,
    discount: 17,
    category: "immunity",
    tags: ["kadha", "immunity", "tulsi", "bestseller"],
    images: [],
    rating: 4.7,
    reviewCount: 367,
    inStock: true,
    featured: true,
    weight: "100g",
    createdAt: "2024-02-10",
  },
];

export const MOCK_TESTIMONIALS = [
  {
    id: "1",
    name: "Priya Sharma",
    location: "Bengaluru, Karnataka",
    rating: 5,
    review:
      "The A2 Ghee changed my digestion completely. I've been using it for 3 months now and my skin has this glow that people keep commenting on. This is exactly what desi ghee should taste and smell like.",
    product: "Pure A2 Cow Ghee",
    initials: "PS",
  },
  {
    id: "2",
    name: "Rajesh Nair",
    location: "Mumbai, Maharashtra",
    rating: 5,
    review:
      "My kids were falling sick every other week. Started them on Chyawanprash and the Kadha Mix. Two months in, not a single sick day. My mother used to make this at home — Sawdesi's version is the closest I've found.",
    product: "Classic Chyawanprash",
    initials: "RN",
  },
  {
    id: "3",
    name: "Ananya Bose",
    location: "Kolkata, West Bengal",
    rating: 5,
    review:
      "The Golden Turmeric Latte has become my evening ritual. Sleep quality has improved dramatically and the inflammation in my knee has reduced so much. Highly recommend to anyone with joint issues.",
    product: "Golden Turmeric Latte Mix",
    initials: "AB",
  },
  {
    id: "4",
    name: "Vikram Reddy",
    location: "Hyderabad, Telangana",
    rating: 5,
    review:
      "As someone who works out regularly, the Ashwagandha has been a game changer. Better recovery, more energy, and my stress levels are noticeably lower. Will never go back to synthetic supplements.",
    product: "Ashwagandha Root Powder",
    initials: "VR",
  },
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "science-behind-a2-ghee",
    title: "The Science Behind A2 Ghee: Why Not All Ghee Is Equal",
    excerpt:
      "Modern research is catching up with what Ayurveda knew for millennia. Here's why the A2 beta-casein protein in desi cow milk makes all the difference.",
    body: "",
    author: "Dr. Meera Iyer",
    category: "Nutrition Science",
    tags: ["ghee", "a2", "nutrition"],
    readTime: 6,
    publishedAt: "2024-03-01",
  },
  {
    id: "2",
    slug: "ashwagandha-adaptogen-guide",
    title: "Ashwagandha: India's Ancient Answer to Modern Stress",
    excerpt:
      "From Charaka Samhita to clinical trials — the complete guide to understanding how this Ayurvedic adaptogen works and how to use it correctly.",
    body: "",
    author: "Arjun Menon",
    category: "Ayurveda",
    tags: ["ashwagandha", "stress", "adaptogen"],
    readTime: 8,
    publishedAt: "2024-03-15",
  },
  {
    id: "3",
    slug: "kadha-recipe-history",
    title: "Kadha: The Story of India's Original Immunity Drink",
    excerpt:
      "Long before 'wellness shots' were a trend, Indian households had kadha. We trace the history and science of this humble but powerful brew.",
    body: "",
    author: "Sunita Krishnan",
    category: "Culture & Heritage",
    tags: ["kadha", "immunity", "history"],
    readTime: 5,
    publishedAt: "2024-04-01",
  },
  {
    id: "4",
    slug: "moringa-nutrition-facts",
    title: "92 Nutrients in One Leaf: The Moringa Deep Dive",
    excerpt:
      "Moringa is called the 'miracle tree' for good reason. We break down its extraordinary nutritional profile and explain why it deserves a place in every Indian kitchen.",
    body: "",
    author: "Dr. Meera Iyer",
    category: "Superfoods",
    tags: ["moringa", "nutrition", "superfood"],
    readTime: 7,
    publishedAt: "2024-04-20",
  },
];

export const FREE_SHIPPING_THRESHOLD = 499;
export const RAZORPAY_CURRENCY = "INR";
