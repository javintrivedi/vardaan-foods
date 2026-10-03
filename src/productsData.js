export const PRODUCTS = [
  {
    id: "mustard-oil-1l",
    name: "Wood Cold Pressed Black Mustard Oil",
    category: "Mustard Oil",
    tag: "Bestseller",
    badge: "Lakdi Kachi Ghani",
    originalPrice: 499,
    price: 299,
    rating: 4.9,
    reviewsCount: 342,
    size: "1000ml",
    availableSizes: [
      { size: "500ml", price: 150, originalPrice: 250 },
      { size: "1000ml", price: 299, originalPrice: 499 },
      { size: "5 Ltr Pack", price: 1499, originalPrice: 2499 }
    ],
    image: "/assets/hero_oil_bottle.webp",
    color: "#D4A373", // Golden Yellow
    accentGlow: "rgba(212, 163, 115, 0.4)",
    description: "Slow-pressed at low RPM & low temperatures in traditional wooden kolhus to preserve natural pungency, authentic aroma, and essential fatty acids.",
    benefits: ["Boosts Heart Health", "Rich in Omega-3 & 6", "Zero Hexane Chemicals", "Natural Pungency & Aroma"],
    labData: {
      acidValue: "0.28 (Standard < 0.50)",
      peroxideValue: "1.4 meq/kg (Fresh < 10.0)",
      fssaiReg: "22226043000697",
      purityScore: "100% Unadulterated"
    }
  },
  {
    id: "groundnut-oil-1l",
    name: "Wood Cold Pressed Groundnut Oil",
    category: "Groundnut Oil",
    tag: "High Smoke Point",
    badge: "Lakdi Kachi Ghani",
    originalPrice: 599,
    price: 379,
    rating: 4.8,
    reviewsCount: 289,
    size: "1000ml",
    availableSizes: [
      { size: "500ml", price: 190, originalPrice: 300 },
      { size: "1000ml", price: 379, originalPrice: 599 },
      { size: "5 Ltr Pack", price: 1899, originalPrice: 2499 }
    ],
    image: "/assets/product_groundnut_oil.webp",
    color: "#D68C70", // Amber Orange
    accentGlow: "rgba(214, 140, 112, 0.4)",
    description: "Extracted from premium hand-picked peanuts without heat. Ideal for daily Indian deep frying and traditional cooking.",
    benefits: ["High Smoke Point (230°C)", "Cardioprotective Resveratrol", "Rich in Vitamin E", "Zero Cholesterol"],
    labData: {
      acidValue: "0.31 (Standard < 0.50)",
      peroxideValue: "1.8 meq/kg",
      fssaiReg: "22226043000697",
      purityScore: "100% Unrefined"
    }
  },
  {
    id: "sesame-oil-1l",
    name: "Wood Pressed Natural Sesame Oil (Til Tel)",
    category: "Sesame Oil",
    tag: "Ayurvedic Elixir",
    badge: "Lakdi Kachi Ghani",
    originalPrice: 699,
    price: 599,
    rating: 4.8,
    reviewsCount: 168,
    size: "1000ml",
    availableSizes: [
      { size: "500ml", price: 300, originalPrice: 350 },
      { size: "1000ml", price: 599, originalPrice: 699 },
      { size: "5 Ltr Pack", price: 2995, originalPrice: 3495 }
    ],
    image: "/assets/product_sesame_oil.webp",
    color: "#C08552", // Rich Bronze
    accentGlow: "rgba(192, 133, 82, 0.4)",
    description: "White Sesame Seeds (Til) Traditionally cold pressed in a wooden kolhu to retain its natural aroma and nutrients. Revered in Ayurveda for Abhyanga (therapeutic oil massage) and cherished for its rich flavour in everyday cooking.",
    benefits: ["Rich in Sesamol Antioxidants", "Supports Joint Mobility", "Traditional Ayurvedic Standard", "Warm Nutty Flavor"],
    labData: {
      acidValue: "0.24",
      peroxideValue: "1.2 meq/kg",
      fssaiReg: "22226043000697",
      purityScore: "100% Raw Sesame"
    }
  },
  {
    id: "coconut-oil-1l",
    name: "Wood Cold Pressed Coconut Oil",
    category: "Coconut Oil",
    tag: "100% Virgin",
    badge: "Lakdi Kachi Ghani",
    originalPrice: 899,
    price: 799,
    rating: 4.9,
    reviewsCount: 194,
    size: "1000ml",
    availableSizes: [
      { size: "200ml", price: 180, originalPrice: 199 },
      { size: "500ml", price: 420, originalPrice: 450 },
      { size: "1000ml", price: 799, originalPrice: 899 },
      { size: "5 Ltr Pack", price: 3895, originalPrice: 4495 }
    ],
    image: "/assets/product_coconut_oil.webp",
    color: "#F0EBD8", // Pure Pearl White Glow
    accentGlow: "rgba(255, 255, 255, 0.4)",
    description: "Freshly pressed from sun-dried coconut certified organic copra. Versatile for healthy cooking, hair nourishment, and body massage. Highly recommended for Baby Massage.",
    benefits: ["High Lauric Acid (50%+)", "MCT Healthy Fats for Energy", "Dual Use: Kitchen & Wellness", "Non-Hydrogenated"],
    labData: {
      acidValue: "0.15",
      peroxideValue: "0.9 meq/kg",
      fssaiReg: "22226043000697",
      purityScore: "100% Virgin Raw"
    }
  },
  {
    id: "yellow-mustard-1l",
    name: "Wood Pressed Yellow Mustard Oil",
    category: "Mustard Oil",
    outOfStock: true,
    tag: "Out of Stock",
    badge: "Lakdi Kachi Ghani",
    originalPrice: 599,
    price: 379,
    rating: 4.9,
    reviewsCount: 145,
    size: "1000ml",
    availableSizes: [
      { size: "500ml", price: 190, originalPrice: 300 },
      { size: "1000ml", price: 379, originalPrice: 599 },
      { size: "5 Ltr Pack", price: 1899, originalPrice: 2499 }
    ],
    image: "/assets/product_yellow_mustard.webp",
    color: "#D4A373", // Bright Gold
    accentGlow: "rgba(212, 163, 115, 0.4)",
    description: "Milder than black mustard oil with a smoother golden hue. Preferred for delicate curries and North Indian cooking.",
    benefits: ["Smooth Mild Flavor", "High Monounsaturated Fats", "Pressed at <35°C", "Pure Wooden Kolhu"],
    labData: {
      acidValue: "0.22",
      peroxideValue: "1.1 meq/kg",
      fssaiReg: "22226043000697",
      purityScore: "100% Natural Yellow Mustard"
    }
  },
  {
    id: "a2-ghee-500ml",
    name: "Cow Vedic Bilona A2 Ghee",
    category: "Pure Ghee",
    tag: "Ayurvedic Superfood",
    badge: "Hand Churned Bilona",
    originalPrice: 1299,
    price: 999,
    rating: 5.0,
    reviewsCount: 512,
    size: "500ml",
    availableSizes: [
      { size: "500ml Glass Jar", price: 999, originalPrice: 1299 },
      { size: "1000ml Glass Jar", price: 1899, originalPrice: 2199 }
    ],
    image: "/assets/product_a2_ghee.webp",
    color: "#E3C49E", // Rich Granular Gold
    accentGlow: "rgba(227, 196, 158, 0.5)",
    description: "Made using the ancient Vedic Bilona method, where A2 curd is hand-churned into white butter (Curd-to-Butter) and gently wood-fired to create rich, aromatic the golden ghee. Highly Recommended for Pregnancy, Post-delivery Care & Baby Massage",
    benefits: ["Granular Texture & Divine Aroma", "Contains Butyric Acid for Digestion", "A2 Beta-Casein Protein", "Boosts Immunity & Brain Health"],
    labData: {
      acidValue: "0.19 (Ultra Pure)",
      peroxideValue: "0.8 meq/kg",
      fssaiReg: "22226043000697",
      purityScore: "100% A2 Pure Gir Cow"
    }
  }
];
