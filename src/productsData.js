export const PRODUCTS = [
  {
    id: "mustard-oil-1l",
    name: "Wood Cold Pressed Black Mustard Oil",
    category: "Mustard Oil",
    tag: "Bestseller",
    badge: "Kachi Ghani",
    originalPrice: 499,
    price: 320,
    rating: 4.9,
    reviewsCount: 342,
    size: "1000ml",
    availableSizes: [
      { size: "500ml", price: 175, originalPrice: 260 },
      { size: "1000ml", price: 320, originalPrice: 499 },
      { size: "5 Litre Can", price: 1499, originalPrice: 2299 }
    ],
    image: "/assets/hero_oil_bottle.webp",
    color: "#D4A373", // Golden Yellow
    accentGlow: "rgba(212, 163, 115, 0.4)",
    description: "Pressed at ultra-low speeds in traditional Wooden Kolhu. Retains natural pungent allyl isothiocyanate, omega-3 fatty acids, and rich aroma.",
    benefits: ["Boosts Heart Health", "Rich in Omega-3 & 6", "Zero Hexane Chemicals", "Natural Pungency & Aroma"],
    labData: {
      acidValue: "0.28 (Standard < 0.50)",
      peroxideValue: "1.4 meq/kg (Fresh < 10.0)",
      fssaiReg: "10824999000124",
      purityScore: "100% Unadulterated"
    }
  },
  {
    id: "groundnut-oil-1l",
    name: "Wood Cold Pressed Groundnut Oil",
    category: "Groundnut Oil",
    tag: "High Smoke Point",
    badge: "Lakdi Ghani",
    originalPrice: 599,
    price: 350,
    rating: 4.8,
    reviewsCount: 289,
    size: "1000ml",
    availableSizes: [
      { size: "500ml", price: 190, originalPrice: 320 },
      { size: "1000ml", price: 350, originalPrice: 599 },
      { size: "5 Litre Can", price: 1650, originalPrice: 2699 }
    ],
    image: "/assets/product_groundnut_oil.webp",
    color: "#D68C70", // Amber Orange
    accentGlow: "rgba(214, 140, 112, 0.4)",
    description: "Extracted from premium hand-picked peanuts without heat. Ideal for daily Indian deep frying and traditional cooking.",
    benefits: ["High Smoke Point (230°C)", "Cardioprotective Resveratrol", "Rich in Vitamin E", "Zero Cholesterol"],
    labData: {
      acidValue: "0.31 (Standard < 0.50)",
      peroxideValue: "1.8 meq/kg",
      fssaiReg: "10824999000124",
      purityScore: "100% Unrefined"
    }
  },
  {
    id: "a2-ghee-500ml",
    name: "A2 Gir Cow Vedic Bilona Ghee",
    category: "Pure Ghee",
    tag: "Ayurvedic Superfood",
    badge: "Hand Churned Bilona",
    originalPrice: 1299,
    price: 890,
    rating: 5.0,
    reviewsCount: 512,
    size: "500ml",
    availableSizes: [
      { size: "500ml Glass Jar", price: 890, originalPrice: 1299 },
      { size: "1000ml Glass Jar", price: 1690, originalPrice: 2499 }
    ],
    image: "/assets/product_a2_ghee.webp",
    color: "#E3C49E", // Rich Granular Gold
    accentGlow: "rgba(227, 196, 158, 0.5)",
    description: "Crafted using the ancient 2-step Vedic Bilona method: whole A2 Gir Cow milk turned into curd, then hand-churned bidirectionally.",
    benefits: ["Granular Texture & Divine Aroma", "Contains Butyric Acid for Digestion", "A2 Beta-Casein Protein", "Boosts Immunity & Brain Health"],
    labData: {
      acidValue: "0.19 (Ultra Pure)",
      peroxideValue: "0.8 meq/kg",
      fssaiReg: "10824999000124",
      purityScore: "100% A2 Pure Gir Cow"
    }
  },
  {
    id: "coconut-oil-1l",
    name: "Extra Virgin Cold Pressed Coconut Oil",
    category: "Coconut Oil",
    tag: "100% Virgin",
    badge: "Cold Extracted",
    originalPrice: 699,
    price: 666,
    rating: 4.9,
    reviewsCount: 194,
    size: "1000ml",
    availableSizes: [
      { size: "500ml", price: 349, originalPrice: 420 },
      { size: "1000ml", price: 666, originalPrice: 699 }
    ],
    image: "/assets/product_coconut_oil.webp",
    color: "#F0EBD8", // Pure Pearl White Glow
    accentGlow: "rgba(255, 255, 255, 0.4)",
    description: "Freshly pressed from sun-dried coconut copra. Versatile for healthy cooking, hair nourishment, and body massage.",
    benefits: ["High Lauric Acid (50%+)", "MCT Healthy Fats for Energy", "Dual Use: Kitchen & Wellness", "Non-Hydrogenated"],
    labData: {
      acidValue: "0.15",
      peroxideValue: "0.9 meq/kg",
      fssaiReg: "10824999000124",
      purityScore: "100% Virgin Raw"
    }
  },
  {
    id: "sesame-oil-1l",
    name: "Wood Pressed Natural Sesame Oil (Til Tel)",
    category: "Sesame Oil",
    tag: "Ayurvedic Elixir",
    badge: "Chekku Press",
    originalPrice: 650,
    price: 420,
    rating: 4.8,
    reviewsCount: 168,
    size: "1000ml",
    availableSizes: [
      { size: "500ml", price: 220, originalPrice: 340 },
      { size: "1000ml", price: 420, originalPrice: 650 }
    ],
    image: "/assets/product_sesame_oil.webp",
    color: "#C08552", // Rich Bronze
    accentGlow: "rgba(192, 133, 82, 0.4)",
    description: "Traditional Til oil cold pressed in wooden kolhu. Renowned in Ayurveda for Abhyanga oil massage and flavorful cooking.",
    benefits: ["Rich in Sesamol Antioxidants", "Supports Joint Mobility", "Traditional Ayurvedic Standard", "Warm Nutty Flavor"],
    labData: {
      acidValue: "0.24",
      peroxideValue: "1.2 meq/kg",
      fssaiReg: "10824999000124",
      purityScore: "100% Raw Sesame"
    }
  },
  {
    id: "yellow-mustard-1l",
    name: "Wood Pressed Yellow Mustard Oil",
    category: "Mustard Oil",
    tag: "Mild Pungency",
    badge: "Gentle Flavour",
    originalPrice: 520,
    price: 340,
    rating: 4.9,
    reviewsCount: 145,
    size: "1000ml",
    availableSizes: [
      { size: "500ml", price: 180, originalPrice: 280 },
      { size: "1000ml", price: 340, originalPrice: 520 }
    ],
    image: "/assets/product_yellow_mustard.webp",
    color: "#D4A373", // Bright Gold
    accentGlow: "rgba(212, 163, 115, 0.4)",
    description: "Milder than black mustard oil with a smoother golden hue. Preferred for delicate curries and North Indian cooking.",
    benefits: ["Smooth Mild Flavor", "High Monounsaturated Fats", "Pressed at <35°C", "Pure Wooden Kolhu"],
    labData: {
      acidValue: "0.22",
      peroxideValue: "1.1 meq/kg",
      fssaiReg: "10824999000124",
      purityScore: "100% Natural Yellow Mustard"
    }
  }
];
