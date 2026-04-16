// // import React, { createContext, useState, useContext } from 'react';

// // const AppContext = createContext();

// // // Sample data for shops
// // export const shopsData = [
// //   {
// //     id: 1,
// //     name: "Sharma Brass Works",
// //     artisan: "Ramesh Sharma",
// //     initials: "RS",
// //     rating: 4.9,
// //     reviews: 234,
// //     description: "Third-generation artisan specializing in intricate brass pooja items and traditional vessels.",
// //     years: 35,
// //     location: "Songir",
// //     categories: ["Pooja Items", "Traditional Vessels"],
// //     verified: true,
// //     featured: true,
// //     products: [
// //       { id: 101, name: "Brass Diya Set", price: 899, image: "", category: "Pooja Items", description: "Handcrafted traditional brass diyas with intricate engravings. Perfect for daily prayers and festivals.", inStock: true, discount: 10 },
// //       { id: 102, name: "Pooja Thali", price: 1499, image: "", category: "Pooja Items", description: "Complete brass pooja thali with bell, diya, and accessories.", inStock: true },
// //       { id: 103, name: "Traditional Kalash", price: 2499, image: "", category: "Traditional Vessels", description: "Sacred brass kalash for ceremonies and rituals.", inStock: true, discount: 15 },
// //       { id: 104, name: "Agarbatti Stand", price: 399, image: "", category: "Pooja Items", description: "Elegant brass incense holder with ash collector.", inStock: true },
// //       { id: 105, name: "Panchamrit Set", price: 1899, image: "", category: "Pooja Items", description: "Five-piece brass set for panchamrit preparation.", inStock: false },
// //       { id: 106, name: "Brass Lota", price: 799, image: "", category: "Traditional Vessels", description: "Traditional water vessel with perfect balance.", inStock: true }
// //     ]
// //   },
// //   {
// //     id: 2,
// //     name: "Gupta Metal Arts",
// //     artisan: "Mohan Gupta",
// //     initials: "MG",
// //     rating: 4.9,
// //     reviews: 312,
// //     description: "Master craftsman known for decorative pieces and custom metalwork.",
// //     years: 40,
// //     location: "Songir",
// //     categories: ["Decorative Items", "Custom Orders"],
// //     verified: true,
// //     featured: true,
// //     products: [
// //       { id: 201, name: "Wall Hanging Ganesha", price: 3499, image: "", category: "Decorative Items", description: "Exquisite brass wall art featuring Lord Ganesha with detailed craftsmanship.", inStock: true },
// //       { id: 202, name: "Peacock Showpiece", price: 4999, image: "", category: "Decorative Items", description: "Stunning brass peacock with intricate feather work.", inStock: true, discount: 20 },
// //       { id: 203, name: "Custom Name Plate", price: 1299, image: "", category: "Custom Orders", description: "Personalized brass nameplate with traditional designs.", inStock: true },
// //       { id: 204, name: "Antique Mirror Frame", price: 5499, image: "", category: "Decorative Items", description: "Hand-carved brass frame with vintage patina.", inStock: true },
// //       { id: 205, name: "Brass Wind Chimes", price: 899, image: "", category: "Decorative Items", description: "Melodious wind chimes with traditional motifs.", inStock: true }
// //     ]
// //   },
// //   {
// //     id: 3,
// //     name: "Patel Copper Crafts",
// //     artisan: "Suresh Patel",
// //     initials: "SP",
// //     rating: 4.8,
// //     reviews: 189,
// //     description: "Expert in creating durable copper cookware with traditional techniques.",
// //     years: 28,
// //     location: "Songir",
// //     categories: ["Kitchen Utensils", "Cookware"],
// //     verified: true,
// //     products: [
// //       { id: 301, name: "Copper Water Bottle", price: 699, image: "", category: "Kitchen Utensils", description: "Pure copper water bottle for health benefits and taste.", inStock: true },
// //       { id: 302, name: "Hammered Cooking Pot", price: 2899, image: "", category: "Cookware", description: "Traditional copper cooking pot with tin lining.", inStock: true },
// //       { id: 303, name: "Copper Frying Pan", price: 1899, image: "", category: "Cookware", description: "Professional-grade copper pan with brass handle.", inStock: true, discount: 12 },
// //       { id: 304, name: "Storage Container Set", price: 3499, image: "", category: "Kitchen Utensils", description: "Four-piece copper container set with airtight lids.", inStock: true },
// //       { id: 305, name: "Copper Tumbler Pair", price: 899, image: "", category: "Kitchen Utensils", description: "Handcrafted copper tumblers for water storage.", inStock: true }
// //     ]
// //   },
// //   {
// //     id: 4,
// //     name: "Yadav Traditional Crafts",
// //     artisan: "Ramchandra Yadav",
// //     initials: "RY",
// //     rating: 4.8,
// //     reviews: 178,
// //     description: "Renowned for temple bells, diyas, and ceremonial brass items.",
// //     years: 32,
// //     location: "Songir",
// //     categories: ["Temple", "Ceremonial Items"],
// //     verified: true,
// //     products: [
// //       { id: 401, name: "Temple Bell Large", price: 1999, image: "", category: "Temple", description: "Large brass temple bell with rich, resonant sound.", inStock: true },
// //       { id: 402, name: "Ghanti Set", price: 799, image: "", category: "Ceremonial Items", description: "Set of three ceremonial bells in brass.", inStock: true },
// //       { id: 403, name: "Aarti Plate Gold", price: 2499, image: "", category: "Temple", description: "Premium brass aarti plate with gold finish.", inStock: true, discount: 8 },
// //       { id: 404, name: "Shankh Holder", price: 899, image: "", category: "Temple", description: "Decorative brass stand for sacred conch.", inStock: true }
// //     ]
// //   },
// //   {
// //     id: 5,
// //     name: "Kumar Brass Emporium",
// //     artisan: "Vijay Kumar",
// //     initials: "VK",
// //     rating: 4.7,
// //     reviews: 145,
// //     description: "Specializes in brass water jugs, glasses, and serving utensils.",
// //     years: 22,
// //     location: "Songir",
// //     categories: ["Water Storage", "Serving Items"],
// //     verified: true,
// //     products: [
// //       { id: 501, name: "Brass Water Jug", price: 1299, image: "", category: "Water Storage", description: "Elegant brass jug with ergonomic handle.", inStock: true },
// //       { id: 502, name: "Glass Set of 6", price: 1499, image: "", category: "Serving Items", description: "Traditional brass drinking glasses set.", inStock: true },
// //       { id: 503, name: "Serving Tray Large", price: 2199, image: "", category: "Serving Items", description: "Hand-engraved brass serving tray.", inStock: true },
// //       { id: 504, name: "Water Dispenser", price: 3999, image: "", category: "Water Storage", description: "Antique-style brass water dispenser with tap.", inStock: true }
// //     ]
// //   },
// //   {
// //     id: 6,
// //     name: "Singh Copper House",
// //     artisan: "Harpreet Singh",
// //     initials: "HS",
// //     rating: 4.6,
// //     reviews: 98,
// //     description: "Focused on creating copper utensils for Ayurvedic health benefits.",
// //     years: 18,
// //     location: "Songir",
// //     categories: ["Ayurvedic", "Health Products"],
// //     verified: true,
// //     products: [
// //       { id: 601, name: "Copper Tongue Cleaner", price: 199, image: "", category: "Ayurvedic", description: "Pure copper tongue cleaner for oral health.", inStock: true },
// //       { id: 602, name: "Jal Neti Pot", price: 599, image: "", category: "Health Products", description: "Copper neti pot for nasal cleansing.", inStock: true },
// //       { id: 603, name: "Ayurvedic Water Pot", price: 1899, image: "", category: "Ayurvedic", description: "Large copper water storage pot with health benefits.", inStock: true },
// //       { id: 604, name: "Massage Bowl Set", price: 1299, image: "", category: "Health Products", description: "Set of copper bowls for oil massage preparation.", inStock: true }
// //     ]
// //   }
// // ];

// // export const AppProvider = ({ children }) => {
// //   const [wishlist, setWishlist] = useState([]);
// //   const [cart, setCart] = useState([]);

// //   // Get all products from all shops
// //   const allProducts = shopsData.flatMap(shop => 
// //     shop.products.map(product => ({ ...product, shopId: shop.id, shopName: shop.name, artisan: shop.artisan }))
// //   );

// //   const toggleWishlist = (productId) => {
// //     setWishlist(prev => 
// //       prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
// //     );
// //   };

// //   const addToCart = (productId) => {
// //     const existingItem = cart.find(item => item.productId === productId);
// //     if (existingItem) {
// //       setCart(cart.map(item => 
// //         item.productId === productId 
// //           ? { ...item, quantity: item.quantity + 1 }
// //           : item
// //       ));
// //     } else {
// //       setCart([...cart, { productId, quantity: 1 }]);
// //     }
// //   };

// //   const updateCartQuantity = (productId, delta) => {
// //     setCart(cart.map(item => {
// //       if (item.productId === productId) {
// //         const newQuantity = Math.max(0, item.quantity + delta);
// //         return { ...item, quantity: newQuantity };
// //       }
// //       return item;
// //     }).filter(item => item.quantity > 0));
// //   };

// //   const removeFromCart = (productId) => {
// //     setCart(cart.filter(item => item.productId !== productId));
// //   };

// //   const value = {
// //     shopsData,
// //     allProducts,
// //     wishlist,
// //     cart,
// //     toggleWishlist,
// //     addToCart,
// //     updateCartQuantity,
// //     removeFromCart
// //   };

// //   return (
// //     <AppContext.Provider value={value}>
// //       {children}
// //     </AppContext.Provider>
// //   );
// // };

// // export const useApp = () => {
// //   const context = useContext(AppContext);
// //   if (!context) {
// //     throw new Error('useApp must be used within an AppProvider');
// //   }
// //   return context;
// // };


// import React, { createContext, useState, useContext } from 'react';

// const AppContext = createContext();

// export const shopsData = [
//   {
//     id: 1, name: "Sharma Brass Works", artisan: "Ramesh Sharma", initials: "RS",
//     rating: 4.9, reviews: 234, description: "Third-generation artisan specializing in intricate brass pooja items and traditional vessels.",
//     years: 35, location: "Songir", categories: ["Pooja Items", "Traditional Vessels"], verified: true, featured: true,
//     products: [
//       { id: 101, name: "Brass Diya Set", price: 899, image: "", category: "Pooja Items", description: "Handcrafted traditional brass diyas with intricate engravings.", inStock: true, discount: 10 },
//       { id: 102, name: "Pooja Thali", price: 1499, image: "", category: "Pooja Items", description: "Complete brass pooja thali with bell, diya, and accessories.", inStock: true },
//       { id: 103, name: "Traditional Kalash", price: 2499, image: "", category: "Traditional Vessels", description: "Sacred brass kalash for ceremonies and rituals.", inStock: true, discount: 15 },
//       { id: 104, name: "Agarbatti Stand", price: 399, image: "", category: "Pooja Items", description: "Elegant brass incense holder with ash collector.", inStock: true },
//       { id: 105, name: "Panchamrit Set", price: 1899, image: "", category: "Pooja Items", description: "Five-piece brass set for panchamrit preparation.", inStock: false },
//       { id: 106, name: "Brass Lota", price: 799, image: "", category: "Traditional Vessels", description: "Traditional water vessel with perfect balance.", inStock: true }
//     ]
//   },
//   {
//     id: 2, name: "Gupta Metal Arts", artisan: "Mohan Gupta", initials: "MG",
//     rating: 4.9, reviews: 312, description: "Master craftsman known for decorative pieces and custom metalwork.",
//     years: 40, location: "Songir", categories: ["Decorative Items", "Custom Orders"], verified: true, featured: true,
//     products: [
//       { id: 201, name: "Wall Hanging Ganesha", price: 3499, image: "", category: "Decorative Items", description: "Exquisite brass wall art featuring Lord Ganesha.", inStock: true },
//       { id: 202, name: "Peacock Showpiece", price: 4999, image: "", category: "Decorative Items", description: "Stunning brass peacock with intricate feather work.", inStock: true, discount: 20 },
//       { id: 203, name: "Custom Name Plate", price: 1299, image: "", category: "Custom Orders", description: "Personalized brass nameplate with traditional designs.", inStock: true },
//       { id: 204, name: "Antique Mirror Frame", price: 5499, image: "", category: "Decorative Items", description: "Hand-carved brass frame with vintage patina.", inStock: true },
//       { id: 205, name: "Brass Wind Chimes", price: 899, image: "", category: "Decorative Items", description: "Melodious wind chimes with traditional motifs.", inStock: true }
//     ]
//   },
//   {
//     id: 3, name: "Patel Copper Crafts", artisan: "Suresh Patel", initials: "SP",
//     rating: 4.8, reviews: 189, description: "Expert in creating durable copper cookware with traditional techniques.",
//     years: 28, location: "Songir", categories: ["Kitchen Utensils", "Cookware"], verified: true,
//     products: [
//       { id: 301, name: "Copper Water Bottle", price: 699, image: "", category: "Kitchen Utensils", description: "Pure copper water bottle for health benefits.", inStock: true },
//       { id: 302, name: "Hammered Cooking Pot", price: 2899, image: "", category: "Cookware", description: "Traditional copper cooking pot with tin lining.", inStock: true },
//       { id: 303, name: "Copper Frying Pan", price: 1899, image: "", category: "Cookware", description: "Professional-grade copper pan with brass handle.", inStock: true, discount: 12 },
//       { id: 304, name: "Storage Container Set", price: 3499, image: "", category: "Kitchen Utensils", description: "Four-piece copper container set with airtight lids.", inStock: true },
//       { id: 305, name: "Copper Tumbler Pair", price: 899, image: "", category: "Kitchen Utensils", description: "Handcrafted copper tumblers for water storage.", inStock: true }
//     ]
//   },
//   {
//     id: 4, name: "Yadav Traditional Crafts", artisan: "Ramchandra Yadav", initials: "RY",
//     rating: 4.8, reviews: 178, description: "Renowned for temple bells, diyas, and ceremonial brass items.",
//     years: 32, location: "Songir", categories: ["Temple", "Ceremonial Items"], verified: true,
//     products: [
//       { id: 401, name: "Temple Bell Large", price: 1999, image: "", category: "Temple", description: "Large brass temple bell with rich, resonant sound.", inStock: true },
//       { id: 402, name: "Ghanti Set", price: 799, image: "", category: "Ceremonial Items", description: "Set of three ceremonial bells in brass.", inStock: true },
//       { id: 403, name: "Aarti Plate Gold", price: 2499, image: "", category: "Temple", description: "Premium brass aarti plate with gold finish.", inStock: true, discount: 8 },
//       { id: 404, name: "Shankh Holder", price: 899, image: "", category: "Temple", description: "Decorative brass stand for sacred conch.", inStock: true }
//     ]
//   },
//   {
//     id: 5, name: "Kumar Brass Emporium", artisan: "Vijay Kumar", initials: "VK",
//     rating: 4.7, reviews: 145, description: "Specializes in brass water jugs, glasses, and serving utensils.",
//     years: 22, location: "Songir", categories: ["Water Storage", "Serving Items"], verified: true,
//     products: [
//       { id: 501, name: "Brass Water Jug", price: 1299, image: "", category: "Water Storage", description: "Elegant brass jug with ergonomic handle.", inStock: true },
//       { id: 502, name: "Glass Set of 6", price: 1499, image: "", category: "Serving Items", description: "Traditional brass drinking glasses set.", inStock: true },
//       { id: 503, name: "Serving Tray Large", price: 2199, image: "", category: "Serving Items", description: "Hand-engraved brass serving tray.", inStock: true },
//       { id: 504, name: "Water Dispenser", price: 3999, image: "", category: "Water Storage", description: "Antique-style brass water dispenser with tap.", inStock: true }
//     ]
//   },
//   {
//     id: 6, name: "Singh Copper House", artisan: "Harpreet Singh", initials: "HS",
//     rating: 4.6, reviews: 98, description: "Focused on creating copper utensils for Ayurvedic health benefits.",
//     years: 18, location: "Songir", categories: ["Ayurvedic", "Health Products"], verified: true,
//     products: [
//       { id: 601, name: "Copper Tongue Cleaner", price: 199, image: "", category: "Ayurvedic", description: "Pure copper tongue cleaner for oral health.", inStock: true },
//       { id: 602, name: "Jal Neti Pot", price: 599, image: "", category: "Health Products", description: "Copper neti pot for nasal cleansing.", inStock: true },
//       { id: 603, name: "Ayurvedic Water Pot", price: 1899, image: "", category: "Ayurvedic", description: "Large copper water storage pot with health benefits.", inStock: true },
//       { id: 604, name: "Massage Bowl Set", price: 1299, image: "", category: "Health Products", description: "Set of copper bowls for oil massage preparation.", inStock: true }
//     ]
//   }
// ];

// const SESSION_KEY = 'songir_session';

// export const AppProvider = ({ children }) => {
//   const [wishlist, setWishlist] = useState([]);
//   const [cart, setCart] = useState([]);

//   const [user, setUser] = useState(() => {
//     try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; }
//     catch { return null; }
//   });

//   // ── Login ─────────────────────────────────────────────────────────────────
//   const login = async (email, password) => {
//     try {
//       const res  = await fetch('http://localhost:5000/api/users/login', {
//         method:  'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body:    JSON.stringify({ email, password }),
//       });
//       const data = await res.json();
//       if (!data.success) return { success: false, message: data.message };

//       localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
//       setUser(data.user);
//       return { success: true };
//     } catch {
//       return { success: false, message: 'Cannot connect to server. Please try again.' };
//     }
//   };

//   // ── Logout — email se Inactive karo ──────────────────────────────────────
//   const logout = async () => {
//     try {
//       const currentUser = JSON.parse(localStorage.getItem(SESSION_KEY));
//       const email = currentUser?.email; // ✅ email use karo — 100% reliable

//       console.log('Logging out email:', email);

//       if (email) {
//         const res = await fetch('http://localhost:5000/api/users/logout', {
//           method:  'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body:    JSON.stringify({ email }),
//         });
//         const data = await res.json();
//         console.log('Logout response:', data);
//       }
//     } catch (err) {
//       console.error('Logout error:', err);
//     }
//     localStorage.removeItem(SESSION_KEY);
//     setUser(null);
//   };

//   const allProducts = shopsData.flatMap(shop =>
//     shop.products.map(product => ({
//       ...product, shopId: shop.id, shopName: shop.name, artisan: shop.artisan,
//     }))
//   );

//   const toggleWishlist = (productId) => {
//     setWishlist(prev =>
//       prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
//     );
//   };

//   const addToCart = (productId) => {
//     const existingItem = cart.find(item => item.productId === productId);
//     if (existingItem) {
//       setCart(cart.map(item =>
//         item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
//       ));
//     } else {
//       setCart([...cart, { productId, quantity: 1 }]);
//     }
//   };

//   const updateCartQuantity = (productId, delta) => {
//     setCart(cart.map(item => {
//       if (item.productId === productId) {
//         const newQuantity = Math.max(0, item.quantity + delta);
//         return { ...item, quantity: newQuantity };
//       }
//       return item;
//     }).filter(item => item.quantity > 0));
//   };

//   const removeFromCart = (productId) => {
//     setCart(cart.filter(item => item.productId !== productId));
//   };

//   const value = {
//     user, login, logout,
//     shopsData, allProducts,
//     wishlist, cart,
//     toggleWishlist, addToCart, updateCartQuantity, removeFromCart,
//   };

//   return (
//     <AppContext.Provider value={value}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useApp = () => {
//   const context = useContext(AppContext);
//   if (!context) throw new Error('useApp must be used within an AppProvider');
//   return context;
// };












// import React, { createContext, useState, useContext, useCallback } from 'react';
// import { getWishlist, addToWishlist, removeFromWishlist } from '../utils/wishlistUtils';

// const AppContext = createContext();

// export const shopsData = [
//   {
//     id: 1, name: "Sharma Brass Works", artisan: "Ramesh Sharma", initials: "RS",
//     rating: 4.9, reviews: 234, description: "Third-generation artisan specializing in intricate brass pooja items and traditional vessels.",
//     years: 35, location: "Songir", categories: ["Pooja Items", "Traditional Vessels"], verified: true, featured: true,
//     products: [
//       { id: 101, name: "Brass Diya Set", price: 899, image: "", category: "Pooja Items", description: "Handcrafted traditional brass diyas with intricate engravings.", inStock: true, discount: 10 },
//       { id: 102, name: "Pooja Thali", price: 1499, image: "", category: "Pooja Items", description: "Complete brass pooja thali with bell, diya, and accessories.", inStock: true },
//       { id: 103, name: "Traditional Kalash", price: 2499, image: "", category: "Traditional Vessels", description: "Sacred brass kalash for ceremonies and rituals.", inStock: true, discount: 15 },
//       { id: 104, name: "Agarbatti Stand", price: 399, image: "", category: "Pooja Items", description: "Elegant brass incense holder with ash collector.", inStock: true },
//       { id: 105, name: "Panchamrit Set", price: 1899, image: "", category: "Pooja Items", description: "Five-piece brass set for panchamrit preparation.", inStock: false },
//       { id: 106, name: "Brass Lota", price: 799, image: "", category: "Traditional Vessels", description: "Traditional water vessel with perfect balance.", inStock: true }
//     ]
//   },
//   {
//     id: 2, name: "Gupta Metal Arts", artisan: "Mohan Gupta", initials: "MG",
//     rating: 4.9, reviews: 312, description: "Master craftsman known for decorative pieces and custom metalwork.",
//     years: 40, location: "Songir", categories: ["Decorative Items", "Custom Orders"], verified: true, featured: true,
//     products: [
//       { id: 201, name: "Wall Hanging Ganesha", price: 3499, image: "", category: "Decorative Items", description: "Exquisite brass wall art featuring Lord Ganesha.", inStock: true },
//       { id: 202, name: "Peacock Showpiece", price: 4999, image: "", category: "Decorative Items", description: "Stunning brass peacock with intricate feather work.", inStock: true, discount: 20 },
//       { id: 203, name: "Custom Name Plate", price: 1299, image: "", category: "Custom Orders", description: "Personalized brass nameplate with traditional designs.", inStock: true },
//       { id: 204, name: "Antique Mirror Frame", price: 5499, image: "", category: "Decorative Items", description: "Hand-carved brass frame with vintage patina.", inStock: true },
//       { id: 205, name: "Brass Wind Chimes", price: 899, image: "", category: "Decorative Items", description: "Melodious wind chimes with traditional motifs.", inStock: true }
//     ]
//   },
//   {
//     id: 3, name: "Patel Copper Crafts", artisan: "Suresh Patel", initials: "SP",
//     rating: 4.8, reviews: 189, description: "Expert in creating durable copper cookware with traditional techniques.",
//     years: 28, location: "Songir", categories: ["Kitchen Utensils", "Cookware"], verified: true,
//     products: [
//       { id: 301, name: "Copper Water Bottle", price: 699, image: "", category: "Kitchen Utensils", description: "Pure copper water bottle for health benefits.", inStock: true },
//       { id: 302, name: "Hammered Cooking Pot", price: 2899, image: "", category: "Cookware", description: "Traditional copper cooking pot with tin lining.", inStock: true },
//       { id: 303, name: "Copper Frying Pan", price: 1899, image: "", category: "Cookware", description: "Professional-grade copper pan with brass handle.", inStock: true, discount: 12 },
//       { id: 304, name: "Storage Container Set", price: 3499, image: "", category: "Kitchen Utensils", description: "Four-piece copper container set with airtight lids.", inStock: true },
//       { id: 305, name: "Copper Tumbler Pair", price: 899, image: "", category: "Kitchen Utensils", description: "Handcrafted copper tumblers for water storage.", inStock: true }
//     ]
//   },
//   {
//     id: 4, name: "Yadav Traditional Crafts", artisan: "Ramchandra Yadav", initials: "RY",
//     rating: 4.8, reviews: 178, description: "Renowned for temple bells, diyas, and ceremonial brass items.",
//     years: 32, location: "Songir", categories: ["Temple", "Ceremonial Items"], verified: true,
//     products: [
//       { id: 401, name: "Temple Bell Large", price: 1999, image: "", category: "Temple", description: "Large brass temple bell with rich, resonant sound.", inStock: true },
//       { id: 402, name: "Ghanti Set", price: 799, image: "", category: "Ceremonial Items", description: "Set of three ceremonial bells in brass.", inStock: true },
//       { id: 403, name: "Aarti Plate Gold", price: 2499, image: "", category: "Temple", description: "Premium brass aarti plate with gold finish.", inStock: true, discount: 8 },
//       { id: 404, name: "Shankh Holder", price: 899, image: "", category: "Temple", description: "Decorative brass stand for sacred conch.", inStock: true }
//     ]
//   },
//   {
//     id: 5, name: "Kumar Brass Emporium", artisan: "Vijay Kumar", initials: "VK",
//     rating: 4.7, reviews: 145, description: "Specializes in brass water jugs, glasses, and serving utensils.",
//     years: 22, location: "Songir", categories: ["Water Storage", "Serving Items"], verified: true,
//     products: [
//       { id: 501, name: "Brass Water Jug", price: 1299, image: "", category: "Water Storage", description: "Elegant brass jug with ergonomic handle.", inStock: true },
//       { id: 502, name: "Glass Set of 6", price: 1499, image: "", category: "Serving Items", description: "Traditional brass drinking glasses set.", inStock: true },
//       { id: 503, name: "Serving Tray Large", price: 2199, image: "", category: "Serving Items", description: "Hand-engraved brass serving tray.", inStock: true },
//       { id: 504, name: "Water Dispenser", price: 3999, image: "", category: "Water Storage", description: "Antique-style brass water dispenser with tap.", inStock: true }
//     ]
//   },
//   {
//     id: 6, name: "Singh Copper House", artisan: "Harpreet Singh", initials: "HS",
//     rating: 4.6, reviews: 98, description: "Focused on creating copper utensils for Ayurvedic health benefits.",
//     years: 18, location: "Songir", categories: ["Ayurvedic", "Health Products"], verified: true,
//     products: [
//       { id: 601, name: "Copper Tongue Cleaner", price: 199, image: "", category: "Ayurvedic", description: "Pure copper tongue cleaner for oral health.", inStock: true },
//       { id: 602, name: "Jal Neti Pot", price: 599, image: "", category: "Health Products", description: "Copper neti pot for nasal cleansing.", inStock: true },
//       { id: 603, name: "Ayurvedic Water Pot", price: 1899, image: "", category: "Ayurvedic", description: "Large copper water storage pot with health benefits.", inStock: true },
//       { id: 604, name: "Massage Bowl Set", price: 1299, image: "", category: "Health Products", description: "Set of copper bowls for oil massage preparation.", inStock: true }
//     ]
//   }
// ];

// const SESSION_KEY = 'songir_session';

// // ─── Helper: WishlistContext ka listener trigger karta hai ────────────────────
// // Yeh ek custom browser event fire karta hai jise WishlistContext sun raha hai.
// // Is wajah se Navbar ka wishlist count automatically update hota hai.
// function fireWishlistEvent() {
//   window.dispatchEvent(new Event('wishlistUpdated'));
// }

// export const AppProvider = ({ children }) => {

//   // ── Wishlist: localStorage se initialize karo ─────────────────────────────
//   const [wishlist, setWishlist] = useState(() => {
//     try { return getWishlist(); } catch { return []; }
//   });

//   // ── Cart: { productId, quantity }[] ───────────────────────────────────────
//   const [cart, setCart] = useState([]);

//   // ── User ──────────────────────────────────────────────────────────────────
//   const [user, setUser] = useState(() => {
//     try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; }
//     catch { return null; }
//   });

//   // ── Login ─────────────────────────────────────────────────────────────────
//   const login = async (email, password) => {
//     try {
//       const res  = await fetch('http://localhost:5000/api/users/login', {
//         method:  'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body:    JSON.stringify({ email, password }),
//       });
//       const data = await res.json();
//       if (!data.success) return { success: false, message: data.message };
//       localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
//       setUser(data.user);
//       return { success: true };
//     } catch {
//       return { success: false, message: 'Cannot connect to server. Please try again.' };
//     }
//   };

//   // ── Logout ────────────────────────────────────────────────────────────────
//   const logout = async () => {
//     try {
//       const currentUser = JSON.parse(localStorage.getItem(SESSION_KEY));
//       const email = currentUser?.email;
//       if (email) {
//         await fetch('http://localhost:5000/api/users/logout', {
//           method:  'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body:    JSON.stringify({ email }),
//         });
//       }
//     } catch (err) {
//       console.error('Logout error:', err);
//     }
//     localStorage.removeItem(SESSION_KEY);
//     setUser(null);
//   };

//   // ── All products flat list ────────────────────────────────────────────────
//   const allProducts = shopsData.flatMap(shop =>
//     shop.products.map(product => ({
//       ...product, shopId: shop.id, shopName: shop.name, artisan: shop.artisan,
//     }))
//   );

//   // ─────────────────────────────────────────────────────────────────────────
//   // ✅ WISHLIST TOGGLE — Teen kaam ek saath:
//   //   1. AppContext React state update  → Products / ProductDetailPage re-render
//   //   2. wishlistUtils call             → localStorage mein save
//   //   3. fireWishlistEvent()            → WishlistContext ka listener trigger
//   //      → Navbar count automatically update ✓
//   // ─────────────────────────────────────────────────────────────────────────
//   const toggleWishlist = useCallback((productId) => {
//     const id = String(productId);

//     setWishlist(prev => {
//       const alreadyIn = prev.map(String).includes(id);

//       if (alreadyIn) {
//         removeFromWishlist(productId);  // localStorage se hata do
//       } else {
//         addToWishlist(productId);       // localStorage mein daalo
//       }

//       fireWishlistEvent();              // Navbar ko batao

//       return alreadyIn
//         ? prev.filter(p => String(p) !== id)
//         : [...prev, productId];
//     });
//   }, []);

//   // ── Cart operations ───────────────────────────────────────────────────────
//   const addToCart = useCallback((productId) => {
//     const id = String(productId);
//     setCart(prev => {
//       const existing = prev.find(item => String(item.productId) === id);
//       if (existing) {
//         return prev.map(item =>
//           String(item.productId) === id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       }
//       return [...prev, { productId, quantity: 1 }];
//     });
//   }, []);

//   const updateCartQuantity = useCallback((productId, delta) => {
//     const id = String(productId);
//     setCart(prev =>
//       prev.map(item => {
//         if (String(item.productId) === id) {
//           const newQty = Math.max(0, item.quantity + delta);
//           return { ...item, quantity: newQty };
//         }
//         return item;
//       }).filter(item => item.quantity > 0)
//     );
//   }, []);

//   const removeFromCart = useCallback((productId) => {
//     const id = String(productId);
//     setCart(prev => prev.filter(item => String(item.productId) !== id));
//   }, []);

//   // ── Derived counts ────────────────────────────────────────────────────────
//   const cartCount     = cart.reduce((sum, item) => sum + item.quantity, 0);
//   const wishlistCount = wishlist.length;

//   const value = {
//     user, login, logout,
//     shopsData, allProducts,
//     wishlist, wishlistCount,
//     cart, cartCount,
//     toggleWishlist, addToCart, updateCartQuantity, removeFromCart,
//   };

//   return (
//     <AppContext.Provider value={value}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useApp = () => {
//   const context = useContext(AppContext);
//   if (!context) throw new Error('useApp must be used within an AppProvider');
//   return context;
// };





























import React, { createContext, useState, useContext, useCallback } from 'react';
import { getWishlist, addToWishlist, removeFromWishlist } from '../utils/wishlistUtils';

const AppContext = createContext();

export const shopsData = [
  {
    id: 1, name: "Sharma Brass Works", artisan: "Ramesh Sharma", initials: "RS",
    rating: 4.9, reviews: 234, description: "Third-generation artisan specializing in intricate brass pooja items and traditional vessels.",
    years: 35, location: "Songir", categories: ["Pooja Items", "Traditional Vessels"], verified: true, featured: true,
    products: [
      { id: 101, name: "Brass Diya Set", price: 899, image: "", category: "Pooja Items", description: "Handcrafted traditional brass diyas with intricate engravings.", inStock: true, discount: 10 },
      { id: 102, name: "Pooja Thali", price: 1499, image: "", category: "Pooja Items", description: "Complete brass pooja thali with bell, diya, and accessories.", inStock: true },
      { id: 103, name: "Traditional Kalash", price: 2499, image: "", category: "Traditional Vessels", description: "Sacred brass kalash for ceremonies and rituals.", inStock: true, discount: 15 },
      { id: 104, name: "Agarbatti Stand", price: 399, image: "", category: "Pooja Items", description: "Elegant brass incense holder with ash collector.", inStock: true },
      { id: 105, name: "Panchamrit Set", price: 1899, image: "", category: "Pooja Items", description: "Five-piece brass set for panchamrit preparation.", inStock: false },
      { id: 106, name: "Brass Lota", price: 799, image: "", category: "Traditional Vessels", description: "Traditional water vessel with perfect balance.", inStock: true }
    ]
  },
  {
    id: 2, name: "Gupta Metal Arts", artisan: "Mohan Gupta", initials: "MG",
    rating: 4.9, reviews: 312, description: "Master craftsman known for decorative pieces and custom metalwork.",
    years: 40, location: "Songir", categories: ["Decorative Items", "Custom Orders"], verified: true, featured: true,
    products: [
      { id: 201, name: "Wall Hanging Ganesha", price: 3499, image: "", category: "Decorative Items", description: "Exquisite brass wall art featuring Lord Ganesha.", inStock: true },
      { id: 202, name: "Peacock Showpiece", price: 4999, image: "", category: "Decorative Items", description: "Stunning brass peacock with intricate feather work.", inStock: true, discount: 20 },
      { id: 203, name: "Custom Name Plate", price: 1299, image: "", category: "Custom Orders", description: "Personalized brass nameplate with traditional designs.", inStock: true },
      { id: 204, name: "Antique Mirror Frame", price: 5499, image: "", category: "Decorative Items", description: "Hand-carved brass frame with vintage patina.", inStock: true },
      { id: 205, name: "Brass Wind Chimes", price: 899, image: "", category: "Decorative Items", description: "Melodious wind chimes with traditional motifs.", inStock: true }
    ]
  },
  {
    id: 3, name: "Patel Copper Crafts", artisan: "Suresh Patel", initials: "SP",
    rating: 4.8, reviews: 189, description: "Expert in creating durable copper cookware with traditional techniques.",
    years: 28, location: "Songir", categories: ["Kitchen Utensils", "Cookware"], verified: true,
    products: [
      { id: 301, name: "Copper Water Bottle", price: 699, image: "", category: "Kitchen Utensils", description: "Pure copper water bottle for health benefits.", inStock: true },
      { id: 302, name: "Hammered Cooking Pot", price: 2899, image: "", category: "Cookware", description: "Traditional copper cooking pot with tin lining.", inStock: true },
      { id: 303, name: "Copper Frying Pan", price: 1899, image: "", category: "Cookware", description: "Professional-grade copper pan with brass handle.", inStock: true, discount: 12 },
      { id: 304, name: "Storage Container Set", price: 3499, image: "", category: "Kitchen Utensils", description: "Four-piece copper container set with airtight lids.", inStock: true },
      { id: 305, name: "Copper Tumbler Pair", price: 899, image: "", category: "Kitchen Utensils", description: "Handcrafted copper tumblers for water storage.", inStock: true }
    ]
  },
  {
    id: 4, name: "Yadav Traditional Crafts", artisan: "Ramchandra Yadav", initials: "RY",
    rating: 4.8, reviews: 178, description: "Renowned for temple bells, diyas, and ceremonial brass items.",
    years: 32, location: "Songir", categories: ["Temple", "Ceremonial Items"], verified: true,
    products: [
      { id: 401, name: "Temple Bell Large", price: 1999, image: "", category: "Temple", description: "Large brass temple bell with rich, resonant sound.", inStock: true },
      { id: 402, name: "Ghanti Set", price: 799, image: "", category: "Ceremonial Items", description: "Set of three ceremonial bells in brass.", inStock: true },
      { id: 403, name: "Aarti Plate Gold", price: 2499, image: "", category: "Temple", description: "Premium brass aarti plate with gold finish.", inStock: true, discount: 8 },
      { id: 404, name: "Shankh Holder", price: 899, image: "", category: "Temple", description: "Decorative brass stand for sacred conch.", inStock: true }
    ]
  },
  {
    id: 5, name: "Kumar Brass Emporium", artisan: "Vijay Kumar", initials: "VK",
    rating: 4.7, reviews: 145, description: "Specializes in brass water jugs, glasses, and serving utensils.",
    years: 22, location: "Songir", categories: ["Water Storage", "Serving Items"], verified: true,
    products: [
      { id: 501, name: "Brass Water Jug", price: 1299, image: "", category: "Water Storage", description: "Elegant brass jug with ergonomic handle.", inStock: true },
      { id: 502, name: "Glass Set of 6", price: 1499, image: "", category: "Serving Items", description: "Traditional brass drinking glasses set.", inStock: true },
      { id: 503, name: "Serving Tray Large", price: 2199, image: "", category: "Serving Items", description: "Hand-engraved brass serving tray.", inStock: true },
      { id: 504, name: "Water Dispenser", price: 3999, image: "", category: "Water Storage", description: "Antique-style brass water dispenser with tap.", inStock: true }
    ]
  },
  {
    id: 6, name: "Singh Copper House", artisan: "Harpreet Singh", initials: "HS",
    rating: 4.6, reviews: 98, description: "Focused on creating copper utensils for Ayurvedic health benefits.",
    years: 18, location: "Songir", categories: ["Ayurvedic", "Health Products"], verified: true,
    products: [
      { id: 601, name: "Copper Tongue Cleaner", price: 199, image: "", category: "Ayurvedic", description: "Pure copper tongue cleaner for oral health.", inStock: true },
      { id: 602, name: "Jal Neti Pot", price: 599, image: "", category: "Health Products", description: "Copper neti pot for nasal cleansing.", inStock: true },
      { id: 603, name: "Ayurvedic Water Pot", price: 1899, image: "", category: "Ayurvedic", description: "Large copper water storage pot with health benefits.", inStock: true },
      { id: 604, name: "Massage Bowl Set", price: 1299, image: "", category: "Health Products", description: "Set of copper bowls for oil massage preparation.", inStock: true }
    ]
  }
];

const SESSION_KEY = 'songir_session';

function fireWishlistEvent() {
  window.dispatchEvent(new Event('wishlistUpdated'));
}

export const AppProvider = ({ children }) => {

  // ── Wishlist: localStorage se initialize karo (full objects) ──────────────
  const [wishlist, setWishlist] = useState(() => {
    try { return getWishlist(); } catch { return []; }
  });

  const [cart, setCart] = useState([]);

  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; }
    catch { return null; }
  });

  const login = async (email, password) => {
    try {
      const res  = await fetch('http://localhost:5000/api/users/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };
      localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch {
      return { success: false, message: 'Cannot connect to server. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem(SESSION_KEY));
      const email = currentUser?.email;
      if (email) {
        await fetch('http://localhost:5000/api/users/logout', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ email }),
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const allProducts = shopsData.flatMap(shop =>
    shop.products.map(product => ({
      ...product, shopId: shop.id, shopName: shop.name, artisan: shop.artisan,
    }))
  );

  // ─────────────────────────────────────────────────────────────────────────
  // ✅ FIXED WISHLIST TOGGLE
  // product = full product object (from ProductsPage / ProductDetailPage)
  // Stores full object so WishlistPage can display image, name, price etc.
  // ─────────────────────────────────────────────────────────────────────────
  const toggleWishlist = useCallback((product) => {
    // Support both object and raw ID
    const productId = typeof product === 'object'
      ? String(product._id || product.id)
      : String(product);

    setWishlist(prev => {
      const alreadyIn = prev.find(p => String(p._id || p.id || p) === productId);

      if (alreadyIn) {
        removeFromWishlist(productId);
      } else {
        addToWishlist(product); // pass full object
      }

      fireWishlistEvent();

      return alreadyIn
        ? prev.filter(p => String(p._id || p.id || p) !== productId)
        : [...prev, typeof product === 'object' ? product : { id: product }];
    });
  }, []);

  const addToCart = useCallback((productId) => {
    const id = String(productId);
    setCart(prev => {
      const existing = prev.find(item => String(item.productId) === id);
      if (existing) {
        return prev.map(item =>
          String(item.productId) === id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  }, []);

  const updateCartQuantity = useCallback((productId, delta) => {
    const id = String(productId);
    setCart(prev =>
      prev.map(item => {
        if (String(item.productId) === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    const id = String(productId);
    setCart(prev => prev.filter(item => String(item.productId) !== id));
  }, []);

  const cartCount     = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const value = {
    user, login, logout,
    shopsData, allProducts,
    wishlist, wishlistCount,
    cart, cartCount,
    toggleWishlist, addToCart, updateCartQuantity, removeFromCart,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};