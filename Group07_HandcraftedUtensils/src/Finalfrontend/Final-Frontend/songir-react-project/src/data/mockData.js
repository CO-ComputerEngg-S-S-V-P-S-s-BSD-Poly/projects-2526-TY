// ==========================================
// MOCK DATA FOR SONGIR MARKETPLACE
// ==========================================

export const shops = [
  {
    id: 1,
    name: "Raju Metal Works",
    owner: "Raju Kumar",
    rating: 4.8,
    reviews: 156,
    location: "Songir Village, Uttar Pradesh",
    established: "1985",
    speciality: "Traditional Brass Utensils",
    description: "Family-run business with 35+ years of experience in handcrafted brass utensils. Known for intricate designs and superior quality.",
    image: "placeholder-shop-1",
    products: 45,
    verified: true
  },
  {
    id: 2,
    name: "Sharma Copper Crafts",
    owner: "Vijay Sharma",
    rating: 4.9,
    reviews: 203,
    location: "Songir Village, Uttar Pradesh",
    established: "1972",
    speciality: "Copper Cookware",
    description: "Three generations of expertise in copper craftsmanship. Specializes in health-beneficial copper vessels and cookware.",
    image: "placeholder-shop-2",
    products: 62,
    verified: true
  },
  {
    id: 3,
    name: "Kumar Artisan Studio",
    owner: "Dinesh Kumar",
    rating: 4.7,
    reviews: 98,
    location: "Songir Village, Uttar Pradesh",
    established: "1998",
    speciality: "Decorative Items",
    description: "Modern designs meets traditional craftsmanship. Specializes in decorative brass and copper items for modern homes.",
    image: "placeholder-shop-3",
    products: 38,
    verified: true
  },
  {
    id: 4,
    name: "Gupta Traditional Metals",
    owner: "Ram Gupta",
    rating: 4.6,
    reviews: 142,
    location: "Songir Village, Uttar Pradesh",
    established: "1990",
    speciality: "Puja Items",
    description: "Dedicated to creating traditional puja items with authenticity and devotion. Pure materials guaranteed.",
    image: "placeholder-shop-4",
    products: 55,
    verified: true
  }
];

export const categories = [
  { id: 1, name: "Cookware", icon: "utensils" },
  { id: 2, name: "Water Vessels", icon: "droplet" },
  { id: 3, name: "Puja Items", icon: "flame" },
  { id: 4, name: "Decorative", icon: "sparkles" },
  { id: 5, name: "Dinnerware", icon: "plate" },
  { id: 6, name: "Storage", icon: "box" }
];

export const products = [
  {
    id: 1,
    name: "Traditional Brass Lota",
    category: "Water Vessels",
    material: "Pure Brass",
    shopId: 1,
    shopName: "Raju Metal Works",
    price: 450,
    originalPrice: 600,
    rating: 4.8,
    reviews: 45,
    inStock: true,
    weight: "500g",
    height: "15cm",
    diameter: "10cm",
    description: "Handcrafted brass lota for water storage. Known for health benefits and traditional design.",
    features: ["100% Pure Brass", "Handmade", "Traditional Design", "Health Benefits"],
    image: "placeholder-product-1",
    images: ["placeholder-1", "placeholder-2", "placeholder-3"],
    isFeatured: true,
    isNewArrival: false
  },
  {
    id: 2,
    name: "Copper Water Jug (1L)",
    category: "Water Vessels",
    material: "Pure Copper",
    shopId: 2,
    shopName: "Sharma Copper Crafts",
    price: 850,
    originalPrice: 1100,
    rating: 4.9,
    reviews: 78,
    inStock: true,
    weight: "800g",
    capacity: "1 Liter",
    height: "22cm",
    description: "Premium copper water jug for Ayurvedic health benefits. Keeps water fresh and cool.",
    features: ["99.7% Pure Copper", "Leak-proof Lid", "Easy Pour Spout", "Ayurvedic Benefits"],
    image: "placeholder-product-2",
    images: ["placeholder-1", "placeholder-2", "placeholder-3"],
    isFeatured: true,
    isNewArrival: true
  },
  {
    id: 3,
    name: "Brass Diya Set (Pack of 5)",
    category: "Puja Items",
    material: "Pure Brass",
    shopId: 4,
    shopName: "Gupta Traditional Metals",
    price: 350,
    originalPrice: 500,
    rating: 4.7,
    reviews: 92,
    inStock: true,
    weight: "250g",
    quantity: "5 pieces",
    height: "5cm each",
    description: "Traditional brass diya set perfect for daily puja and festivals. Handcrafted with intricate designs.",
    features: ["Set of 5", "Traditional Design", "Festival Ready", "Long-lasting"],
    image: "placeholder-product-3",
    images: ["placeholder-1", "placeholder-2", "placeholder-3"],
    isFeatured: true,
    isNewArrival: false
  },
  {
    id: 4,
    name: "Copper Thali Set",
    category: "Dinnerware",
    material: "Pure Copper",
    shopId: 2,
    shopName: "Sharma Copper Crafts",
    price: 1250,
    originalPrice: 1600,
    rating: 4.8,
    reviews: 56,
    inStock: true,
    weight: "1.2kg",
    pieces: "7 pieces",
    diameter: "28cm",
    description: "Complete copper dinner set including thali, bowls, and glasses. Elegant and health-beneficial.",
    features: ["7-Piece Set", "Pure Copper", "Traditional Dining", "Premium Quality"],
    image: "placeholder-product-4",
    images: ["placeholder-1", "placeholder-2", "placeholder-3"],
    isFeatured: false,
    isNewArrival: true
  },
  {
    id: 5,
    name: "Brass Pooja Bell (Ghanti)",
    category: "Puja Items",
    material: "Pure Brass",
    shopId: 4,
    shopName: "Gupta Traditional Metals",
    price: 280,
    originalPrice: 400,
    rating: 4.9,
    reviews: 124,
    inStock: true,
    weight: "300g",
    height: "12cm",
    description: "Traditional brass pooja bell with clear, melodious sound. Essential for every Hindu household.",
    features: ["Clear Sound", "Carved Handle", "Traditional Design", "Durable"],
    image: "placeholder-product-5",
    images: ["placeholder-1", "placeholder-2", "placeholder-3"],
    isFeatured: true,
    isNewArrival: false
  },
  {
    id: 6,
    name: "Decorative Brass Bowl",
    category: "Decorative",
    material: "Brass with Engravings",
    shopId: 3,
    shopName: "Kumar Artisan Studio",
    price: 650,
    originalPrice: 850,
    rating: 4.6,
    reviews: 34,
    inStock: true,
    weight: "600g",
    diameter: "18cm",
    description: "Beautifully engraved brass bowl perfect for home decoration or serving dry fruits.",
    features: ["Intricate Engravings", "Dual Purpose", "Modern Design", "Gift-worthy"],
    image: "placeholder-product-6",
    images: ["placeholder-1", "placeholder-2", "placeholder-3"],
    isFeatured: false,
    isNewArrival: true
  },
  {
    id: 7,
    name: "Copper Cooking Pot (Handi)",
    category: "Cookware",
    material: "Pure Copper",
    shopId: 2,
    shopName: "Sharma Copper Crafts",
    price: 1450,
    originalPrice: 1800,
    rating: 4.8,
    reviews: 67,
    inStock: true,
    weight: "1.5kg",
    capacity: "2 Liters",
    height: "15cm",
    description: "Traditional copper handi for authentic cooking. Distributes heat evenly for perfect taste.",
    features: ["Even Heat Distribution", "Pure Copper", "Traditional Shape", "With Lid"],
    image: "placeholder-product-7",
    images: ["placeholder-1", "placeholder-2", "placeholder-3"],
    isFeatured: true,
    isNewArrival: false
  },
  {
    id: 8,
    name: "Brass Incense Holder (Agarbatti Stand)",
    category: "Puja Items",
    material: "Pure Brass",
    shopId: 1,
    shopName: "Raju Metal Works",
    price: 180,
    originalPrice: 250,
    rating: 4.7,
    reviews: 89,
    inStock: true,
    weight: "150g",
    length: "25cm",
    description: "Elegant brass incense holder with ash catcher. Perfect for daily puja and meditation.",
    features: ["Ash Catcher", "Stable Base", "Multiple Holes", "Easy to Clean"],
    image: "placeholder-product-8",
    images: ["placeholder-1", "placeholder-2", "placeholder-3"],
    isFeatured: false,
    isNewArrival: true
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai, Maharashtra",
    rating: 5,
    comment: "Absolutely love the quality! The copper water jug is exactly as described. Great service from Sharma Copper Crafts.",
    product: "Copper Water Jug",
    date: "2024-01-15"
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Delhi, NCR",
    rating: 5,
    comment: "Authentic Songir quality. The brass lota brings back childhood memories. Highly recommend!",
    product: "Traditional Brass Lota",
    date: "2024-01-10"
  },
  {
    id: 3,
    name: "Anjali Patel",
    location: "Ahmedabad, Gujarat",
    rating: 4,
    comment: "Beautiful craftsmanship. The diya set is perfect for our daily puja. Will order more.",
    product: "Brass Diya Set",
    date: "2024-01-08"
  }
];

export const faqs = [
  {
    id: 1,
    question: "Are these products made from pure brass/copper?",
    answer: "Yes, all our products are made from 100% pure brass or copper. Each artisan guarantees the purity of materials used."
  },
  {
    id: 2,
    question: "How do I maintain brass and copper utensils?",
    answer: "Clean with tamarind or lemon juice mixed with salt. Rinse thoroughly and dry immediately. Avoid harsh chemicals."
  },
  {
    id: 3,
    question: "Do you ship all over India?",
    answer: "Yes, we ship to all locations across India. Shipping charges vary based on location and will be shown at checkout."
  },
  {
    id: 4,
    question: "Can I request custom sizes or designs?",
    answer: "Absolutely! Use our 'Get a Quote' feature to request custom orders. Artisans will respond with pricing and timeline."
  },
  {
    id: 5,
    question: "What is the return policy?",
    answer: "We offer 7-day returns for damaged or defective products. Custom orders are non-returnable unless defective."
  }
];
