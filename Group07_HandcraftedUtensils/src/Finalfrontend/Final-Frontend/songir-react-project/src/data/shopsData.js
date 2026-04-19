export const categories = [
  "All",
  "Pooja Items",
  "Kitchen Utensils",
  "Decorative",
  "Water Storage",
  "Ayurvedic",
  "Temple Items"
];

export const shopsData = [
  {
    id: 1,
    name: "Sharma Brass Works",
    artisan: "Ramesh Sharma",
    initials: "RS",
    rating: 4.9,
    reviews: 234,
    description: "Third-generation artisan specializing in intricate brass pooja items and traditional vessels.",
    years: 35,
    location: "Songir",
    categories: ["Pooja Items", "Traditional Vessels"],
    verified: true,
    featured: true,
    products: [
      { id: 101, name: "Brass Diya Set", price: 899, image: "🪔", category: "Pooja Items", description: "Handcrafted traditional brass diyas with intricate engravings. Perfect for daily prayers and festivals.", inStock: true, discount: 10 },
      { id: 102, name: "Pooja Thali", price: 1499, image: "🕉️", category: "Pooja Items", description: "Complete brass pooja thali with bell, diya, and accessories.", inStock: true },
      { id: 103, name: "Traditional Kalash", price: 2499, image: "⚱️", category: "Traditional Vessels", description: "Sacred brass kalash for ceremonies and rituals.", inStock: true, discount: 15 },
      { id: 104, name: "Agarbatti Stand", price: 399, image: "🪔", category: "Pooja Items", description: "Elegant brass incense holder with ash collector.", inStock: true },
      { id: 105, name: "Panchamrit Set", price: 1899, image: "🕉️", category: "Pooja Items", description: "Five-piece brass set for panchamrit preparation.", inStock: false },
      { id: 106, name: "Brass Lota", price: 799, image: "⚱️", category: "Traditional Vessels", description: "Traditional water vessel with perfect balance.", inStock: true }
    ]
  },
  {
    id: 2,
    name: "Gupta Metal Arts",
    artisan: "Mohan Gupta",
    initials: "MG",
    rating: 4.9,
    reviews: 312,
    description: "Master craftsman known for decorative pieces and custom metalwork.",
    years: 40,
    location: "Songir",
    categories: ["Decorative Items", "Custom Orders"],
    verified: true,
    featured: true,
    products: [
      { id: 201, name: "Wall Hanging Ganesha", price: 3499, image: "🎭", category: "Decorative Items", description: "Exquisite brass wall art featuring Lord Ganesha with detailed craftsmanship.", inStock: true },
      { id: 202, name: "Peacock Showpiece", price: 4999, image: "🦚", category: "Decorative Items", description: "Stunning brass peacock with intricate feather work.", inStock: true, discount: 20 },
      { id: 203, name: "Custom Name Plate", price: 1299, image: "🏷️", category: "Custom Orders", description: "Personalized brass nameplate with traditional designs.", inStock: true },
      { id: 204, name: "Antique Mirror Frame", price: 5499, image: "🖼️", category: "Decorative Items", description: "Hand-carved brass frame with vintage patina.", inStock: true },
      { id: 205, name: "Brass Wind Chimes", price: 899, image: "🔔", category: "Decorative Items", description: "Melodious wind chimes with traditional motifs.", inStock: true }
    ]
  },
  {
    id: 3,
    name: "Patel Copper Crafts",
    artisan: "Suresh Patel",
    initials: "SP",
    rating: 4.8,
    reviews: 189,
    description: "Expert in creating durable copper cookware with traditional techniques.",
    years: 28,
    location: "Songir",
    categories: ["Kitchen Utensils", "Cookware"],
    verified: true,
    products: [
      { id: 301, name: "Copper Water Bottle", price: 699, image: "🧴", category: "Kitchen Utensils", description: "Pure copper water bottle for health benefits and taste.", inStock: true },
      { id: 302, name: "Hammered Cooking Pot", price: 2899, image: "🍲", category: "Cookware", description: "Traditional copper cooking pot with tin lining.", inStock: true },
      { id: 303, name: "Copper Frying Pan", price: 1899, image: "🍳", category: "Cookware", description: "Professional-grade copper pan with brass handle.", inStock: true, discount: 12 },
      { id: 304, name: "Storage Container Set", price: 3499, image: "📦", category: "Kitchen Utensils", description: "Four-piece copper container set with airtight lids.", inStock: true },
      { id: 305, name: "Copper Tumbler Pair", price: 899, image: "🥤", category: "Kitchen Utensils", description: "Handcrafted copper tumblers for water storage.", inStock: true }
    ]
  },
  {
    id: 4,
    name: "Yadav Traditional Crafts",
    artisan: "Ramchandra Yadav",
    initials: "RY",
    rating: 4.8,
    reviews: 178,
    description: "Renowned for temple bells, diyas, and ceremonial brass items.",
    years: 32,
    location: "Songir",
    categories: ["Temple", "Ceremonial Items"],
    verified: true,
    products: [
      { id: 401, name: "Temple Bell Large", price: 1999, image: "🔔", category: "Temple", description: "Large brass temple bell with rich, resonant sound.", inStock: true },
      { id: 402, name: "Ghanti Set", price: 799, image: "🔔", category: "Ceremonial Items", description: "Set of three ceremonial bells in brass.", inStock: true },
      { id: 403, name: "Aarti Plate Gold", price: 2499, image: "✨", category: "Temple", description: "Premium brass aarti plate with gold finish.", inStock: true, discount: 8 },
      { id: 404, name: "Shankh Holder", price: 899, image: "🐚", category: "Temple", description: "Decorative brass stand for sacred conch.", inStock: true }
    ]
  },
  {
    id: 5,
    name: "Kumar Brass Emporium",
    artisan: "Vijay Kumar",
    initials: "VK",
    rating: 4.7,
    reviews: 145,
    description: "Specializes in brass water jugs, glasses, and serving utensils.",
    years: 22,
    location: "Songir",
    categories: ["Water Storage", "Serving Items"],
    verified: true,
    products: [
      { id: 501, name: "Brass Water Jug", price: 1299, image: "🚰", category: "Water Storage", description: "Elegant brass jug with ergonomic handle.", inStock: true },
      { id: 502, name: "Glass Set of 6", price: 1499, image: "🥃", category: "Serving Items", description: "Traditional brass drinking glasses set.", inStock: true },
      { id: 503, name: "Serving Tray Large", price: 2199, image: "🍽️", category: "Serving Items", description: "Hand-engraved brass serving tray.", inStock: true },
      { id: 504, name: "Water Dispenser", price: 3999, image: "⚱️", category: "Water Storage", description: "Antique-style brass water dispenser with tap.", inStock: true }
    ]
  },
  {
    id: 6,
    name: "Singh Copper House",
    artisan: "Harpreet Singh",
    initials: "HS",
    rating: 4.6,
    reviews: 98,
    description: "Focused on creating copper utensils for Ayurvedic health benefits.",
    years: 18,
    location: "Songir",
    categories: ["Ayurvedic", "Health Products"],
    verified: true,
    products: [
      { id: 601, name: "Copper Tongue Cleaner", price: 199, image: "👅", category: "Ayurvedic", description: "Pure copper tongue cleaner for oral health.", inStock: true },
      { id: 602, name: "Jal Neti Pot", price: 599, image: "🫖", category: "Health Products", description: "Copper neti pot for nasal cleansing.", inStock: true },
      { id: 603, name: "Ayurvedic Water Pot", price: 1899, image: "⚱️", category: "Ayurvedic", description: "Large copper water storage pot with health benefits.", inStock: true },
      { id: 604, name: "Massage Bowl Set", price: 1299, image: "🥣", category: "Health Products", description: "Set of copper bowls for oil massage preparation.", inStock: true }
    ]
  }
];