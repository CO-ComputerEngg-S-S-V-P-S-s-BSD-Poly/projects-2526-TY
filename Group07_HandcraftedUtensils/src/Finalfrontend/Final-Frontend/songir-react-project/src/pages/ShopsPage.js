// import React, { useState } from 'react';
// import { Store, Star, MapPin, Package, Clock, ChevronRight, ArrowLeft, Search, Filter } from 'lucide-react';

// // 🔥 Sabse important - Images ko import karo
// import pujathali from '../Assets/Pujathali.jpeg';
// import lota from '../Assets/lota.jpeg';
// import designerglass from '../Assets/designerglass.jpeg';
// import Cookware from "../Assets/Cookware.jpeg"
// import coppertan from "../Assets/Coppertan.webp.jpeg"
// import batthcontainer from '../Assets/barthcontainer.jpeg';
// import kadhai from '../Assets/Kadhai.jpeg'
// import bowl from '../Assets/bowl.webp.jpeg';
// import bowl1 from '../Assets/bowl1.jpeg'
// import Teapan from "../Assets/Teapan.jpeg"

// // Sample data for shops with IMPORTED images
// const shopsData = [
//   {
//     id: 1,
//     name: "Sharma Brass Works",
//     artisan: "Ramesh Sharma",
//     initials: "RS",
//     rating: 4.9,
//     reviews: 234,
//     description: "Third-generation artisan specializing in intricate brass pooja items and traditional vessels.",
//     years: 35,
//     products: 126,
//     location: "Songir",
//     categories: ["Pooja Items", "Traditional Vessels"],
//     verified: true,
//     products: [
//       { id: 101, name: "Designer TeaPan", price: 899, image: Teapan, category: "Teapan", description: "Handcrafted traditional brass Teapan with intricate engravings. Perfect for daily use and festivals." },
//       { id: 102, name: "Pooja Thali", price: 1499, image: pujathali, category: "Pooja Items", description: "Complete brass pooja thali with bell, diya, and accessories." },
//       { id: 103, name: "Traditional Lota", price: 2499, image: lota, category: "Traditional Vessels", description: "Sacred brass lota for ceremonies and rituals." },
//       { id: 104, name: "Designer Kadhai", price: 399, image: pujathali, category: "Traditional Kadhai", description: "Elegant brass incense holder with ash collector." },
//       { id: 105, name: "Designer Bowl", price: 1899, image: bowl, category: "Designer Bowl", description: "Five-piece brass set for panchamrit preparation." },
//       { id: 106, name: " Designer Cookware", price: 799, image:Cookware, category: "Designer Cookware", description: "Designer Cookware vessel with perfect balance." }
//     ]
//   },
//   {
//     id: 2,
//     name: "Gupta Metal Arts",
//     artisan: "Mohan Gupta",
//     initials: "MG",
//     rating: 4.9,
//     reviews: 312,
//     description: "Master craftsman known for decorative pieces and custom metalwork.",
//     years: 40,
//     products: 201,
//     location: "Songir",
//     categories: ["Decorative Items", "Custom Orders"],
//     verified: true,
//     products: [
//       { id: 201, name: "Designer TeaPan", price: 899, image: Teapan, category: "Teapan", description: "Handcrafted traditional brass Teapan with intricate engravings. Perfect for daily use and festivals." },
//      { id: 202, name: "Pooja Thali", price: 1499, image: pujathali, category: "Pooja Items", description: "Complete brass pooja thali with bell, diya, and accessories." },
//       { id: 203, name: "Traditional Lota", price: 2499, image: lota, category: "Traditional Vessels", description: "Sacred brass lota for ceremonies and rituals." },
//       { id: 204, name: "Designer Kadhai", price: 399, image: pujathali, category: "Traditional Kadhai", description: "Elegant brass incense holder with ash collector." },
//       { id: 205, name: "Designer Bowl", price: 1899, image: bowl, category: "Designer Bowl", description: "Five-piece brass set for panchamrit preparation." },
//       { id: 206, name: " Designer Cookware", price: 799, image:Cookware, category: "Designer Cookware", description: "Designer Cookware vessel with perfect balance." }
//     ]
//   },
//   {
//     id: 3,
//     name: "Patel Copper Crafts",
//     artisan: "Suresh Patel",
//     initials: "SP",
//     rating: 4.8,
//     reviews: 189,
//     description: "Expert in creating durable copper cookware with traditional techniques.",
//     years: 28,
//     products: 98,
//     location: "Songir",
//     categories: ["Kitchen Utensils", "Cookware"],
//     verified: true,
//     products: [
//       { id: 301, name: "Designer TeaPan", price: 899, image: Teapan, category: "Teapan", description: "Handcrafted traditional brass Teapan with intricate engravings. Perfect for daily use and festivals." },
//       { id: 102, name: "Pooja Thali", price: 1499, image: pujathali, category: "Pooja Items", description: "Complete brass pooja thali with bell, diya, and accessories." },
//       { id: 103, name: "Traditional Lota", price: 2499, image: lota, category: "Traditional Vessels", description: "Sacred brass lota for ceremonies and rituals." },
//       { id: 104, name: "Designer Kadhai", price: 399, image: pujathali, category: "Traditional Kadhai", description: "Elegant brass incense holder with ash collector." },
//       { id: 105, name: "Designer Bowl", price: 1899, image: bowl, category: "Designer Bowl", description: "Five-piece brass set for panchamrit preparation." },
//       { id: 106, name: " Designer Cookware", price: 799, image:Cookware, category: "Designer Cookware", description: "Designer Cookware vessel with perfect balance." }
//     ]
//   },
//   {
//     id: 4,
//     name: "Yadav Traditional Crafts",
//     artisan: "Ramchandra Yadav",
//     initials: "RY",
//     rating: 4.8,
//     reviews: 178,
//     description: "Renowned for temple bells, diyas, and ceremonial brass items.",
//     years: 32,
//     products: 121,
//     location: "Songir",
//     categories: ["Temple", "Ceremonial Items"],
//     verified: true,
//     products: [
//       { id: 401, name:  "Designer TeaPan", price: 899, image: Teapan, category: "Teapan", description: "Handcrafted traditional brass Teapan with intricate engravings. Perfect for daily use and festivals." },
//       { id: 402, name: "Ghanti Set", price: 799, image: coppertan, category: "Ceremonial Items", description: "Set of three ceremonial bells in brass." },
//       { id: 403, name: "Aarti Plate Gold", price: 2499, image: pujathali, category: "Temple", description: "Premium brass aarti plate with gold finish." },
//       { id: 404, name: "Shankh Holder", price: 899, image: designerglass, category: "Temple", description: "Decorative brass stand for sacred conch." }
//     ]
//   },
//   {
//     id: 5,
//     name: "Kumar Brass Emporium",
//     artisan: "Vijay Kumar",
//     initials: "VK",
//     rating: 4.7,
//     reviews: 145,
//     description: "Specializes in brass water jugs, glasses, and serving utensils.",
//     years: 22,
//     products: 85,
//     location: "Songir",
//     categories: ["Water Storage", "Serving Items"],
//     verified: true,
//     products: [
//       { id: 501, name: "Designer TeaPan", price: 899, image: Teapan, category: "Teapan", description: "Handcrafted traditional brass Teapan with intricate engravings. Perfect for daily use and festivals." },
//       { id: 502, name: "Glass Set of 6", price: 1499, image: bowl, category: "Serving Items", description: "Traditional brass drinking glasses set." },
//       { id: 503, name: "Serving Tray Large", price: 2199, image: bowl1, category: "Serving Items", description: "Hand-engraved brass serving tray." },
//       { id: 504, name: "Water Dispenser", price: 3999, image: batthcontainer, category: "Water Storage", description: "Antique-style brass water dispenser with tap." }
//     ]
//   },
//   {
//     id: 6,
//     name: "Singh Copper House",
//     artisan: "Harpreet Singh",
//     initials: "HS",
//     rating: 4.6,
//     reviews: 98,
//     description: "Focused on creating copper utensils for Ayurvedic health benefits.",
//     years: 18,
//     products: 64,
//     location: "Songir",
//     categories: ["Ayurvedic", "Health Products"],
//     verified: true,
//     products: [
//       { id: 601, name: "Designer TeaPan", price: 899, image: Teapan, category: "Teapan", description: "Handcrafted traditional brass Teapan with intricate engravings. Perfect for daily use and festivals."},
//       { id: 602, name: "Jal Neti Pot", price: 599, image: lota, category: "Health Products", description: "Copper neti pot for nasal cleansing." },
//       { id: 603, name: "Ayurvedic Water Pot", price: 1899, image: batthcontainer, category: "Ayurvedic", description: "Large copper water storage pot with health benefits." },
//       { id: 604, name: "Massage Bowl Set", price: 1299, image: bowl, category: "Health Products", description: "Set of copper bowls for oil massage preparation." }
//     ]
//   }
// ];

// // Categories and App component remains exactly the same as before...
// const categories = [
//   "All",
//   "Pooja Items",
//   "Kitchen Utensils",
//   "Decorative",
//   "Water Storage",
//   "Ayurvedic",
//   "Temple Items"
// ];

// function App() {
//   const [view, setView] = useState('shops'); // 'shops', 'shop-detail', 'product-detail'
//   const [selectedShop, setSelectedShop] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [sortBy, setSortBy] = useState('Highest Rated');

//   // Filter shops
//   const filteredShops = shopsData.filter(shop => {
//     const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          shop.artisan.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory = selectedCategory === 'All' || 
//                            shop.categories.some(cat => cat.includes(selectedCategory));
//     return matchesSearch && matchesCategory;
//   });

//   // Sort shops
//   const sortedShops = [...filteredShops].sort((a, b) => {
//     if (sortBy === 'Highest Rated') return b.rating - a.rating;
//     return 0;
//   });

//   const handleViewShop = (shop) => {
//     setSelectedShop(shop);
//     setView('shop-detail');
//   };

//   const handleViewProduct = (product) => {
//     setSelectedProduct(product);
//     setView('product-detail');
//   };

//   const handleBack = () => {
//     if (view === 'product-detail') {
//       setView('shop-detail');
//       setSelectedProduct(null);
//     } else if (view === 'shop-detail') {
//       setView('shops');
//       setSelectedShop(null);
//     }
//   };

//   // Contact and Quote form handlers
//   const handleContactArtisan = () => {
//     window.location.href = '/ContactPage';
//   };

//   const handleGetQuote = () => {
//     window.location.href = '/quote';
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg, #FFF6E5 0%, #F5E6D3 100%)',
//       fontFamily: "'Crimson Text', serif"
//     }}>
      
//       {/* Main Content */}
//       <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem' }}>
//         {view === 'shops' && (
//           <>
//             {/* Hero Section */}
//             <div style={{
//               textAlign: 'center',
//               marginBottom: '3.5rem',
//               animation: 'fadeIn 0.6s ease-out'
//             }}>
//               <h2 style={{
//                 fontSize: '3.5rem',
//                 fontWeight: 700,
//                 color: '#3E2723',
//                 marginBottom: '1rem',
//                 fontFamily: "'Playfair Display', serif",
//                 letterSpacing: '1px'
//               }}>
//                 Our Artisan Shops
//               </h2>
//               <p style={{
//                 fontSize: '1.25rem',
//                 color: '#5D4037',
//                 maxWidth: '800px',
//                 margin: '0 auto',
//                 lineHeight: 1.7
//               }}>
//                 Connect directly with skilled craftsmen from Songir village. Browse their products, compare prices, and support traditional artisans.
//               </p>
//             </div>

//             {/* Search and Filter Bar */}
//             <div style={{
//               background: 'white',
//               padding: '2rem',
//               borderRadius: '16px',
//               boxShadow: '0 4px 20px rgba(62, 39, 35, 0.1)',
//               marginBottom: '3rem',
//               border: '2px solid rgba(201, 164, 76, 0.2)'
//             }}>
//               <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
//                 {/* Search */}
//                 <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
//                   <Search 
//                     size={20} 
//                     style={{ 
//                       position: 'absolute', 
//                       left: '1rem', 
//                       top: '50%', 
//                       transform: 'translateY(-50%)',
//                       color: '#B87333'
//                     }} 
//                   />
//                   <input
//                     type="text"
//                     placeholder="Search shops, artisans, or specialties..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     style={{
//                       width: '100%',
//                       padding: '0.9rem 1rem 0.9rem 3rem',
//                       border: '2px solid #E0D5C7',
//                       borderRadius: '12px',
//                       fontSize: '1.05rem',
//                       fontFamily: "'Crimson Text', serif",
//                       transition: 'all 0.3s'
//                     }}
//                     onFocus={e => e.target.style.borderColor = '#C9A44C'}
//                     onBlur={e => e.target.style.borderColor = '#E0D5C7'}
//                   />
//                 </div>

//                 {/* Sort */}
//                 <select
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                   style={{
//                     padding: '0.9rem 1.5rem',
//                     border: '2px solid #E0D5C7',
//                     borderRadius: '12px',
//                     fontSize: '1.05rem',
//                     fontFamily: "'Crimson Text', serif",
//                     background: 'white',
//                     cursor: 'pointer',
//                     minWidth: '200px'
//                   }}
//                 >
//                   <option>Highest Rated</option>
//                   <option>Most Products</option>
//                   <option>Most Experienced</option>
//                 </select>
//               </div>

//               {/* Category Filter */}
//               <div style={{ 
//                 display: 'flex', 
//                 gap: '0.8rem', 
//                 marginTop: '1.5rem',
//                 flexWrap: 'wrap'
//               }}>
//                 {categories.map(cat => (
//                   <button
//                     key={cat}
//                     onClick={() => setSelectedCategory(cat)}
//                     style={{
//                       padding: '0.6rem 1.4rem',
//                       border: selectedCategory === cat ? '2px solid #B87333' : '2px solid #E0D5C7',
//                       background: selectedCategory === cat 
//                         ? 'linear-gradient(135deg, #B87333 0%, #C9A44C 100%)'
//                         : 'white',
//                       color: selectedCategory === cat ? '#FFF6E5' : '#5D4037',
//                       borderRadius: '25px',
//                       fontSize: '0.95rem',
//                       fontWeight: selectedCategory === cat ? 600 : 400,
//                       cursor: 'pointer',
//                       transition: 'all 0.3s',
//                       fontFamily: "'Crimson Text', serif"
//                     }}
//                     onMouseEnter={e => {
//                       if (selectedCategory !== cat) {
//                         e.target.style.borderColor = '#B87333';
//                         e.target.style.background = 'rgba(184, 115, 51, 0.05)';
//                       }
//                     }}
//                     onMouseLeave={e => {
//                       if (selectedCategory !== cat) {
//                         e.target.style.borderColor = '#E0D5C7';
//                         e.target.style.background = 'white';
//                       }
//                     }}
//                   >
//                     {cat}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Results Count */}
//             <p style={{
//               fontSize: '1.1rem',
//               color: '#5D4037',
//               marginBottom: '2rem',
//               fontWeight: 500
//             }}>
//               Showing {sortedShops.length} of {shopsData.length} shops
//             </p>

//             {/* Shops Grid */}
//             <div style={{
//               display: 'grid',
//               gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
//               gap: '2rem',
//               animation: 'fadeIn 0.8s ease-out'
//             }}>
//               {sortedShops.map((shop, index) => (
//                 <div
//                   key={shop.id}
//                   style={{
//                     background: 'white',
//                     borderRadius: '20px',
//                     overflow: 'hidden',
//                     boxShadow: '0 8px 30px rgba(62, 39, 35, 0.12)',
//                     transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
//                     border: '2px solid rgba(201, 164, 76, 0.2)',
//                     position: 'relative',
//                     animation: `slideUp 0.6s ease-out ${index * 0.1}s both`
//                   }}
//                   onMouseEnter={e => {
//                     e.currentTarget.style.transform = 'translateY(-8px)';
//                     e.currentTarget.style.boxShadow = '0 12px 40px rgba(62, 39, 35, 0.2)';
//                     e.currentTarget.style.borderColor = '#C9A44C';
//                   }}
//                   onMouseLeave={e => {
//                     e.currentTarget.style.transform = 'translateY(0)';
//                     e.currentTarget.style.boxShadow = '0 8px 30px rgba(62, 39, 35, 0.12)';
//                     e.currentTarget.style.borderColor = 'rgba(201, 164, 76, 0.2)';
//                   }}
//                 >
//                   {/* Verified Badge */}
//                   {shop.verified && (
//                     <div style={{
//                       position: 'absolute',
//                       top: '1rem',
//                       right: '1rem',
//                       background: 'linear-gradient(135deg, #27AE60 0%, #229954 100%)',
//                       color: 'white',
//                       padding: '0.4rem 1rem',
//                       borderRadius: '20px',
//                       fontSize: '0.85rem',
//                       fontWeight: 600,
//                       zIndex: 10,
//                       boxShadow: '0 2px 10px rgba(39, 174, 96, 0.4)'
//                     }}>
//                       Verified
//                     </div>
//                   )}

//                   {/* Shop Header */}
//                   <div style={{
//                     background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.1) 0%, rgba(201, 164, 76, 0.1) 100%)',
//                     padding: '2rem',
//                     position: 'relative'
//                   }}>
//                     <div style={{
//                       width: '80px',
//                       height: '80px',
//                       background: 'linear-gradient(135deg, #B87333 0%, #C9A44C 100%)',
//                       borderRadius: '50%',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       margin: '0 auto 1.5rem',
//                       boxShadow: '0 6px 20px rgba(184, 115, 51, 0.4)',
//                       border: '3px solid white',
//                       fontSize: '1.8rem',
//                       fontWeight: 700,
//                       color: '#FFF6E5',
//                       fontFamily: "'Playfair Display', serif"
//                     }}>
//                       {shop.initials}
//                     </div>

//                     <h3 style={{
//                       fontSize: '1.6rem',
//                       fontWeight: 700,
//                       color: '#3E2723',
//                       marginBottom: '0.5rem',
//                       textAlign: 'center',
//                       fontFamily: "'Playfair Display', serif"
//                     }}>
//                       {shop.name}
//                     </h3>
//                     <p style={{
//                       fontSize: '1.05rem',
//                       color: '#5D4037',
//                       marginBottom: '1rem',
//                       textAlign: 'center'
//                     }}>
//                       {shop.artisan}
//                     </p>

//                     {/* Rating */}
//                     <div style={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       gap: '0.5rem',
//                       marginBottom: '1rem'
//                     }}>
//                       <Star size={18} fill="#C9A44C" color="#C9A44C" />
//                       <span style={{
//                         fontSize: '1.1rem',
//                         fontWeight: 700,
//                         color: '#3E2723'
//                       }}>
//                         {shop.rating}
//                       </span>
//                       <span style={{
//                         fontSize: '0.95rem',
//                         color: '#5D4037'
//                       }}>
//                         ({shop.reviews} reviews)
//                       </span>
//                     </div>
//                   </div>

//                   {/* Shop Details */}
//                   <div style={{ padding: '1.5rem 2rem 2rem' }}>
//                     <p style={{
//                       fontSize: '1.05rem',
//                       color: '#5D4037',
//                       lineHeight: 1.7,
//                       marginBottom: '1.5rem'
//                     }}>
//                       {shop.description}
//                     </p>

//                     {/* Stats */}
//                     <div style={{
//                       display: 'grid',
//                       gridTemplateColumns: 'repeat(3, 1fr)',
//                       gap: '1rem',
//                       marginBottom: '1.5rem'
//                     }}>
//                       <div style={{ textAlign: 'center' }}>
//                         <div style={{
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           gap: '0.4rem',
//                           color: '#B87333',
//                           marginBottom: '0.3rem'
//                         }}>
//                           <Clock size={16} />
//                           <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
//                             {shop.years} years
//                           </span>
//                         </div>
//                       </div>
//                       <div style={{ textAlign: 'center' }}>
//                         <div style={{
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           gap: '0.4rem',
//                           color: '#B87333',
//                           marginBottom: '0.3rem'
//                         }}>
//                           <Package size={16} />
//                           <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
//                             {shop.products.length} products
//                           </span>
//                         </div>
//                       </div>
//                       <div style={{ textAlign: 'center' }}>
//                         <div style={{
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           gap: '0.4rem',
//                           color: '#B87333',
//                           marginBottom: '0.3rem'
//                         }}>
//                           <MapPin size={16} />
//                           <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
//                             {shop.location}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Categories */}
//                     <div style={{
//                       display: 'flex',
//                       gap: '0.5rem',
//                       flexWrap: 'wrap',
//                       marginBottom: '1.5rem'
//                     }}>
//                       {shop.categories.map(cat => (
//                         <span
//                           key={cat}
//                           style={{
//                             background: 'rgba(184, 115, 51, 0.1)',
//                             color: '#B87333',
//                             padding: '0.4rem 1rem',
//                             borderRadius: '15px',
//                             fontSize: '0.85rem',
//                             fontWeight: 500,
//                             border: '1px solid rgba(184, 115, 51, 0.3)'
//                           }}
//                         >
//                           {cat}
//                         </span>
//                       ))}
//                     </div>

//                     {/* Action Buttons */}
//                     <div style={{ display: 'flex', gap: '1rem' }}>
//                       <button
//                         onClick={() => handleViewShop(shop)}
//                         style={{
//                           flex: 1,
//                           background: 'linear-gradient(135deg, #B87333 0%, #C9A44C 100%)',
//                           color: '#FFF6E5',
//                           border: 'none',
//                           padding: '0.9rem 1.5rem',
//                           borderRadius: '12px',
//                           fontSize: '1.05rem',
//                           fontWeight: 600,
//                           cursor: 'pointer',
//                           transition: 'all 0.3s',
//                           boxShadow: '0 4px 15px rgba(184, 115, 51, 0.3)',
//                           fontFamily: "'Crimson Text', serif",
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           gap: '0.5rem'
//                         }}
//                         onMouseEnter={e => {
//                           e.target.style.transform = 'translateY(-2px)';
//                           e.target.style.boxShadow = '0 6px 20px rgba(184, 115, 51, 0.4)';
//                         }}
//                         onMouseLeave={e => {
//                           e.target.style.transform = 'translateY(0)';
//                           e.target.style.boxShadow = '0 4px 15px rgba(184, 115, 51, 0.3)';
//                         }}
//                       >
//                         View Shop
//                         <ChevronRight size={20} />
//                       </button>
//                       <button
//                         onClick={handleGetQuote}
//                         style={{
//                           background: 'white',
//                           color: '#B87333',
//                           border: '2px solid #B87333',
//                           padding: '0.9rem 1.5rem',
//                           borderRadius: '12px',
//                           fontSize: '1.05rem',
//                           fontWeight: 600,
//                           cursor: 'pointer',
//                           transition: 'all 0.3s',
//                           fontFamily: "'Crimson Text', serif"
//                         }}
//                         onMouseEnter={e => {
//                           e.target.style.background = 'rgba(184, 115, 51, 0.05)';
//                           e.target.style.transform = 'translateY(-2px)';
//                         }}
//                         onMouseLeave={e => {
//                           e.target.style.background = 'white';
//                           e.target.style.transform = 'translateY(0)';
//                         }}
//                       >
//                         Get Quote
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}

//         {view === 'shop-detail' && selectedShop && (
//           <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
//             {/* Back Button */}
//             <button
//               onClick={handleBack}
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '0.5rem',
//                 background: 'white',
//                 border: '2px solid #B87333',
//                 color: '#B87333',
//                 padding: '0.8rem 1.5rem',
//                 borderRadius: '12px',
//                 fontSize: '1.05rem',
//                 fontWeight: 600,
//                 cursor: 'pointer',
//                 marginBottom: '2rem',
//                 transition: 'all 0.3s',
//                 fontFamily: "'Crimson Text', serif"
//               }}
//               onMouseEnter={e => {
//                 e.target.style.background = 'rgba(184, 115, 51, 0.05)';
//                 e.target.style.transform = 'translateX(-4px)';
//               }}
//               onMouseLeave={e => {
//                 e.target.style.background = 'white';
//                 e.target.style.transform = 'translateX(0)';
//               }}
//             >
//               <ArrowLeft size={20} />
//               Back to Shops
//             </button>

//             {/* Shop Header */}
//             <div style={{
//               background: 'white',
//               borderRadius: '20px',
//               padding: '3rem',
//               marginBottom: '3rem',
//               boxShadow: '0 8px 30px rgba(62, 39, 35, 0.12)',
//               border: '2px solid rgba(201, 164, 76, 0.2)'
//             }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
//                 <div style={{
//                   width: '120px',
//                   height: '120px',
//                   background: 'linear-gradient(135deg, #B87333 0%, #C9A44C 100%)',
//                   borderRadius: '50%',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   boxShadow: '0 6px 20px rgba(184, 115, 51, 0.4)',
//                   border: '4px solid #FFF6E5',
//                   fontSize: '2.5rem',
//                   fontWeight: 700,
//                   color: '#FFF6E5',
//                   fontFamily: "'Playfair Display', serif"
//                 }}>
//                   {selectedShop.initials}
//                 </div>
                
//                 <div style={{ flex: 1 }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
//                     <h2 style={{
//                       fontSize: '2.5rem',
//                       fontWeight: 700,
//                       color: '#3E2723',
//                       margin: 0,
//                       fontFamily: "'Playfair Display', serif"
//                     }}>
//                       {selectedShop.name}
//                     </h2>
//                     {selectedShop.verified && (
//                       <span style={{
//                         background: 'linear-gradient(135deg, #27AE60 0%, #229954 100%)',
//                         color: 'white',
//                         padding: '0.4rem 1rem',
//                         borderRadius: '20px',
//                         fontSize: '0.9rem',
//                         fontWeight: 600,
//                         boxShadow: '0 2px 10px rgba(39, 174, 96, 0.4)'
//                       }}>
//                         Verified
//                       </span>
//                     )}
//                   </div>
//                   <p style={{
//                     fontSize: '1.3rem',
//                     color: '#5D4037',
//                     marginBottom: '1rem'
//                   }}>
//                     Master Artisan: {selectedShop.artisan}
//                   </p>
                  
//                   <div style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '0.7rem'
//                   }}>
//                     <Star size={22} fill="#C9A44C" color="#C9A44C" />
//                     <span style={{
//                       fontSize: '1.3rem',
//                       fontWeight: 700,
//                       color: '#3E2723'
//                     }}>
//                       {selectedShop.rating}
//                     </span>
//                     <span style={{
//                       fontSize: '1.1rem',
//                       color: '#5D4037'
//                     }}>
//                       ({selectedShop.reviews} reviews)
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <p style={{
//                 fontSize: '1.2rem',
//                 color: '#5D4037',
//                 lineHeight: 1.8,
//                 marginBottom: '2rem'
//               }}>
//                 {selectedShop.description}
//               </p>

//               {/* Shop Stats */}
//               <div style={{
//                 display: 'grid',
//                 gridTemplateColumns: 'repeat(3, 1fr)',
//                 gap: '2rem',
//                 padding: '2rem',
//                 background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.05) 0%, rgba(201, 164, 76, 0.05) 100%)',
//                 borderRadius: '15px'
//               }}>
//                 <div style={{ textAlign: 'center' }}>
//                   <Clock size={32} color="#B87333" style={{ marginBottom: '0.5rem' }} />
//                   <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#3E2723', margin: '0.5rem 0' }}>
//                     {selectedShop.years}+
//                   </p>
//                   <p style={{ fontSize: '1.05rem', color: '#5D4037', margin: 0 }}>Years Experience</p>
//                 </div>
//                 <div style={{ textAlign: 'center' }}>
//                   <Package size={32} color="#B87333" style={{ marginBottom: '0.5rem' }} />
//                   <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#3E2723', margin: '0.5rem 0' }}>
//                     {selectedShop.products.length}
//                   </p>
//                   <p style={{ fontSize: '1.05rem', color: '#5D4037', margin: 0 }}>Products</p>
//                 </div>
//                 <div style={{ textAlign: 'center' }}>
//                   <MapPin size={32} color="#B87333" style={{ marginBottom: '0.5rem' }} />
//                   <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#3E2723', margin: '0.5rem 0' }}>
//                     {selectedShop.location}
//                   </p>
//                   <p style={{ fontSize: '1.05rem', color: '#5D4037', margin: 0 }}>Village</p>
//                 </div>
//               </div>
//             </div>

//             {/* Products Section */}
//             <h3 style={{
//               fontSize: '2.2rem',
//               fontWeight: 700,
//               color: '#3E2723',
//               marginBottom: '2rem',
//               fontFamily: "'Playfair Display', serif"
//             }}>
//               Products from {selectedShop.name}
//             </h3>

//             <div style={{
//               display: 'grid',
//               gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
//               gap: '2rem'
//             }}>
//               {selectedShop.products.map((product, index) => (
//                 <div
//                   key={product.id}
//                   onClick={() => handleViewProduct(product)}
//                   style={{
//                     background: 'white',
//                     borderRadius: '16px',
//                     overflow: 'hidden',
//                     boxShadow: '0 6px 25px rgba(62, 39, 35, 0.1)',
//                     transition: 'all 0.3s',
//                     cursor: 'pointer',
//                     border: '2px solid rgba(201, 164, 76, 0.2)',
//                     animation: `slideUp 0.5s ease-out ${index * 0.05}s both`
//                   }}
//                   onMouseEnter={e => {
//                     e.currentTarget.style.transform = 'translateY(-6px)';
//                     e.currentTarget.style.boxShadow = '0 10px 35px rgba(62, 39, 35, 0.18)';
//                     e.currentTarget.style.borderColor = '#C9A44C';
//                   }}
//                   onMouseLeave={e => {
//                     e.currentTarget.style.transform = 'translateY(0)';
//                     e.currentTarget.style.boxShadow = '0 6px 25px rgba(62, 39, 35, 0.1)';
//                     e.currentTarget.style.borderColor = 'rgba(201, 164, 76, 0.2)';
//                   }}
//                 >
//                   {/* Product Image - REPLACED EMOJI WITH ACTUAL IMAGE */}
//                   <div style={{
//                     height: '200px',
//                     background: '#f5f5f5',
//                     overflow: 'hidden'
//                   }}>
//                     <img 
//                       src={product.image} 
//                       alt={product.name}
//                       style={{
//                         width: '100%',
//                         height: '100%',
//                         objectFit: 'cover'
//                       }}
//                       onError={(e) => {
//                         e.target.style.display = 'none';
//                         e.target.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;color:#B87333;">🪔</div>';
//                       }}
//                     />
//                   </div>

//                   <div style={{ padding: '1.5rem' }}>
//                     <span style={{
//                       background: 'rgba(184, 115, 51, 0.1)',
//                       color: '#B87333',
//                       padding: '0.3rem 0.9rem',
//                       borderRadius: '12px',
//                       fontSize: '0.8rem',
//                       fontWeight: 600,
//                       border: '1px solid rgba(184, 115, 51, 0.3)'
//                     }}>
//                       {product.category}
//                     </span>

//                     <h4 style={{
//                       fontSize: '1.4rem',
//                       fontWeight: 700,
//                       color: '#3E2723',
//                       margin: '1rem 0 0.5rem',
//                       fontFamily: "'Playfair Display', serif"
//                     }}>
//                       {product.name}
//                     </h4>

//                     <p style={{
//                       fontSize: '1.6rem',
//                       fontWeight: 700,
//                       color: '#B87333',
//                       margin: '1rem 0'
//                     }}>
//                       ₹{product.price}
//                     </p>

//                     <button style={{
//                       width: '100%',
//                       background: 'linear-gradient(135deg, #B87333 0%, #C9A44C 100%)',
//                       color: '#FFF6E5',
//                       border: 'none',
//                       padding: '0.8rem',
//                       borderRadius: '10px',
//                       fontSize: '1rem',
//                       fontWeight: 600,
//                       cursor: 'pointer',
//                       transition: 'all 0.3s',
//                       fontFamily: "'Crimson Text', serif"
//                     }}>
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {view === 'product-detail' && selectedProduct && (
//           <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
//             {/* Back Button */}
//             <button
//               onClick={handleBack}
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '0.5rem',
//                 background: 'white',
//                 border: '2px solid #B87333',
//                 color: '#B87333',
//                 padding: '0.8rem 1.5rem',
//                 borderRadius: '12px',
//                 fontSize: '1.05rem',
//                 fontWeight: 600,
//                 cursor: 'pointer',
//                 marginBottom: '2rem',
//                 transition: 'all 0.3s',
//                 fontFamily: "'Crimson Text', serif"
//               }}
//               onMouseEnter={e => {
//                 e.target.style.background = 'rgba(184, 115, 51, 0.05)';
//                 e.target.style.transform = 'translateX(-4px)';
//               }}
//               onMouseLeave={e => {
//                 e.target.style.background = 'white';
//                 e.target.style.transform = 'translateX(0)';
//               }}
//             >
//               <ArrowLeft size={20} />
//               Back to Shop
//             </button>

//             {/* Product Detail */}
//             <div style={{
//               background: 'white',
//               borderRadius: '20px',
//               overflow: 'hidden',
//               boxShadow: '0 8px 30px rgba(62, 39, 35, 0.12)',
//               border: '2px solid rgba(201, 164, 76, 0.2)'
//             }}>
//               <div style={{
//                 display: 'grid',
//                 gridTemplateColumns: '1fr 1fr',
//                 gap: '3rem',
//                 padding: '3rem'
//               }}>
//                 {/* Product Image - REPLACED EMOJI WITH ACTUAL IMAGE */}
//                 <div style={{
//                   background: '#f5f5f5',
//                   borderRadius: '16px',
//                   overflow: 'hidden',
//                   minHeight: '500px',
//                   border: '2px solid rgba(201, 164, 76, 0.2)'
//                 }}>
//                   <img 
//                     src={selectedProduct.image} 
//                     alt={selectedProduct.name}
//                     style={{
//                       width: '100%',
//                       height: '100%',
//                       objectFit: 'cover'
//                     }}
//                     onError={(e) => {
//                       e.target.style.display = 'none';
//                       e.target.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:8rem;color:#B87333;">🪔</div>';
//                     }}
//                   />
//                 </div>

//                 {/* Product Info */}
//                 <div>
//                   <span style={{
//                     background: 'rgba(184, 115, 51, 0.1)',
//                     color: '#B87333',
//                     padding: '0.5rem 1.2rem',
//                     borderRadius: '15px',
//                     fontSize: '0.95rem',
//                     fontWeight: 600,
//                     border: '1px solid rgba(184, 115, 51, 0.3)'
//                   }}>
//                     {selectedProduct.category}
//                   </span>

//                   <h2 style={{
//                     fontSize: '3rem',
//                     fontWeight: 700,
//                     color: '#3E2723',
//                     margin: '1.5rem 0',
//                     fontFamily: "'Playfair Display', serif"
//                   }}>
//                     {selectedProduct.name}
//                   </h2>

//                   <p style={{
//                     fontSize: '2.5rem',
//                     fontWeight: 700,
//                     color: '#B87333',
//                     margin: '1.5rem 0'
//                   }}>
//                     ₹{selectedProduct.price}
//                   </p>

//                   <div style={{
//                     background: 'rgba(184, 115, 51, 0.05)',
//                     padding: '1.5rem',
//                     borderRadius: '12px',
//                     marginBottom: '2rem'
//                   }}>
//                     <p style={{
//                       fontSize: '1.05rem',
//                       color: '#5D4037',
//                       margin: 0,
//                       fontWeight: 500
//                     }}>
//                       <strong style={{ color: '#3E2723' }}>Artisan:</strong> {selectedShop.artisan}
//                     </p>
//                     <p style={{
//                       fontSize: '1.05rem',
//                       color: '#5D4037',
//                       margin: '0.5rem 0 0',
//                       fontWeight: 500
//                     }}>
//                       <strong style={{ color: '#3E2723' }}>Shop:</strong> {selectedShop.name}
//                     </p>
//                   </div>

//                   <h3 style={{
//                     fontSize: '1.6rem',
//                     fontWeight: 700,
//                     color: '#3E2723',
//                     marginBottom: '1rem',
//                     fontFamily: "'Playfair Display', serif"
//                   }}>
//                     Product Description
//                   </h3>
//                   <p style={{
//                     fontSize: '1.15rem',
//                     color: '#5D4037',
//                     lineHeight: 1.8,
//                     marginBottom: '2rem'
//                   }}>
//                     {selectedProduct.description}
//                   </p>

//                   <div style={{ display: 'flex', gap: '1rem' }}>
//                     <button 
//                       onClick={handleGetQuote}
//                       style={{
//                         flex: 1,
//                         background: 'linear-gradient(135deg, #B87333 0%, #C9A44C 100%)',
//                         color: '#FFF6E5',
//                         border: 'none',
//                         padding: '1.2rem 2rem',
//                         borderRadius: '12px',
//                         fontSize: '1.2rem',
//                         fontWeight: 700,
//                         cursor: 'pointer',
//                         transition: 'all 0.3s',
//                         boxShadow: '0 4px 15px rgba(184, 115, 51, 0.3)',
//                         fontFamily: "'Crimson Text', serif"
//                       }}
//                       onMouseEnter={e => {
//                         e.target.style.transform = 'translateY(-2px)';
//                         e.target.style.boxShadow = '0 6px 20px rgba(184, 115, 51, 0.4)';
//                       }}
//                       onMouseLeave={e => {
//                         e.target.style.transform = 'translateY(0)';
//                         e.target.style.boxShadow = '0 4px 15px rgba(184, 115, 51, 0.3)';
//                       }}
//                     >
//                       Get Quote
//                     </button>
//                     <button 
//                       onClick={handleContactArtisan}
//                       style={{
//                         flex: 1,
//                         background: 'white',
//                         color: '#B87333',
//                         border: '2px solid #B87333',
//                         padding: '1.2rem 2rem',
//                         borderRadius: '12px',
//                         fontSize: '1.2rem',
//                         fontWeight: 700,
//                         cursor: 'pointer',
//                         transition: 'all 0.3s',
//                         fontFamily: "'Crimson Text', serif"
//                       }}
//                       onMouseEnter={e => {
//                         e.target.style.background = 'rgba(184, 115, 51, 0.05)';
//                         e.target.style.transform = 'translateY(-2px)';
//                       }}
//                       onMouseLeave={e => {
//                         e.target.style.background = 'white';
//                         e.target.style.transform = 'translateY(0)';
//                       }}
//                     >
//                       Contact Artisan
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>

//       {/* Animations */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Crimson+Text:wght@400;600;700&display=swap');
        
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }

//         @keyframes slideUp {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         * {
//           box-sizing: border-box;
//         }
//       `}</style>
//     </div>
//   );
// }

// export default App;
















import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2, Star, Clock, Package, MapPin, ArrowRight,
  ArrowLeft, Search, Shield
} from "lucide-react";
import "./ShopPage.css";

const API_URL = "http://localhost:5000/api/shops/approved";

const ShopPage = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState('shops');
  const [selectedShop, setSelectedShop] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Highest Rated');

  const navigate = useNavigate();

  const fetchApprovedShops = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch shops");
      const data = await response.json();
      setShops(data);
      setError("");
    } catch (err) {
      setError("Unable to load shops. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApprovedShops(); }, []);

  const enrichShop = (shop) => ({
    ...shop,
    id: shop._id,
    name: shop.shopName || "Unnamed Shop",
    artisan: shop.ownerName || "Unknown Artisan",
    initials: shop.shopName ? shop.shopName.substring(0, 2).toUpperCase() : "SH",
    rating: 4.5,
    reviews: 0,
    description: "Handcrafted items with traditional techniques.",
    years: 10,
    products: shop.products || [],
    categories: ["Handicraft"],
    location: shop.address || "Songir",
    verified: true,
  });

  const enrichedShops = shops.map(enrichShop);
  const filteredShops = enrichedShops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.artisan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' ||
      shop.categories.some(cat => cat.includes(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  const sortedShops = [...filteredShops].sort((a, b) => {
    if (sortBy === 'Highest Rated') return b.rating - a.rating;
    if (sortBy === 'Most Products') return b.products.length - a.products.length;
    if (sortBy === 'Most Experienced') return b.years - a.years;
    return 0;
  });

  const handleViewShop = (shop) => { setSelectedShop(shop); setView('shop-detail'); window.scrollTo(0, 0); };
  const handleViewProduct = (product) => { setSelectedProduct(product); setView('product-detail'); window.scrollTo(0, 0); };
  const handleBack = () => {
    if (view === 'product-detail') { setView('shop-detail'); setSelectedProduct(null); window.scrollTo(0, 0); }
    else if (view === 'shop-detail') { setView('shops'); setSelectedShop(null); window.scrollTo(0, 0); }
  };
  const handleGetQuote = () => navigate('/quote');
  const handleContactArtisan = () => navigate('/ContactPage');

  const getImageSrc = (img) => {
    if (!img) return null;
    return img.startsWith('http') ? img : `http://localhost:5000/${img}`;
  };

  if (loading) return (
    <div style={S.loadingWrap}>
      <div style={S.loadingSpinner} />
      <p style={S.loadingText}>Discovering artisan shops...</p>
    </div>
  );

  if (error) return (
    <div style={S.centerWrap}>
      <span style={{ fontSize: '3rem' }}>⚠️</span>
      <p style={{ color: '#5D4037', fontSize: '1.1rem' }}>{error}</p>
      <button onClick={fetchApprovedShops} style={S.btnPrimary}>Retry</button>
    </div>
  );

  if (shops.length === 0) return (
    <div style={S.centerWrap}>
      <Package size={64} color="#C9A44C" />
      <h2 style={{ color: '#3E2723', fontFamily: "'Cormorant Garamond', serif" }}>No Approved Shops Yet</h2>
      <p style={{ color: '#7D6E63' }}>Shops will appear here once admin approves them.</p>
    </div>
  );

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes floatOrb { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        .sp-shop-card:hover { transform:translateY(-10px)!important; box-shadow:0 28px 60px rgba(62,39,35,0.16)!important; }
        .sp-shop-card:hover .sp-shop-card-bar { background-size:100% auto!important; }
        .sp-prod-card:hover { transform:translateY(-6px)!important; box-shadow:0 20px 45px rgba(62,39,35,0.14)!important; }
        .sp-prod-card:hover .sp-prod-overlay { opacity:1!important; }
        .sp-prod-card:hover .sp-prod-img { transform:scale(1.06)!important; }
        .sp-btn-glow:hover { box-shadow:0 8px 28px rgba(184,115,51,0.45)!important; transform:translateY(-2px)!important; }
        .sp-back-btn:hover { background:rgba(184,115,51,0.06)!important; }
        * { box-sizing:border-box; }
      `}</style>

      {/* ══ HERO ══ */}
      <div style={S.hero}>
        <div style={S.heroOrb1} />
        <div style={S.heroOrb2} />
        <div style={S.heroCenter}>
          <div style={S.heroBadge}>✦ &nbsp;Handcrafted · Verified · Authentic&nbsp; ✦</div>
          <h1 style={S.heroTitle}>Our Verified Shops</h1>
          <p style={S.heroSub}>
            Explore <strong style={{ color: '#C9A44C' }}>{shops.length}</strong> approved artisan shops from the Songir region
          </p>
        </div>
      </div>

      <div style={S.body}>

        {/* ══ SHOPS LIST ══ */}
        {view === 'shops' && (
          <div style={{ animation: 'fadeUp 0.6s ease-out' }}>

            {/* Search + Sort */}
            <div style={S.searchBar}>
              <div style={S.searchInputWrap}>
                <Search size={18} color="#B87333" />
                <input
                  placeholder="Search shops, artisans..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={S.searchInput}
                />
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={S.sortSelect}>
                <option>Highest Rated</option>
                <option>Most Products</option>
                <option>Most Experienced</option>
              </select>
            </div>

            {/* Categories */}
            {/* <div style={S.catRow}>
              {['All','Pooja Items','Kitchen Utensils','Decorative','Water Storage','Ayurvedic','Temple Items'].map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                  ...S.catBtn,
                  background: selectedCategory === cat ? 'linear-gradient(135deg,#B87333,#C9A44C)' : 'white',
                  color: selectedCategory === cat ? '#FFF8EE' : '#7D6E63',
                  border: selectedCategory === cat ? '1.5px solid transparent' : '1.5px solid #E2D8CC',
                  fontWeight: selectedCategory === cat ? 600 : 400,
                }}>
                  {cat}
                </button>
              ))}
            </div> */}

            <p style={S.countText}>Showing <b style={{ color:'#B87333' }}>{sortedShops.length}</b> of {shops.length} shops</p>

            {/* Grid */}
            <div style={S.shopsGrid}>
              {sortedShops.map((shop, i) => (
                <div
                  key={shop._id}
                  className="sp-shop-card"
                  style={{ ...S.shopCard, animationDelay:`${i*0.07}s`, animation:'fadeUp 0.5s ease-out both' }}
                >
                  {/* Verified badge - top right corner */}
                  <div style={S.verifiedCorner}>
                    <CheckCircle2 size={13} fill="#27AE60" color="#27AE60" /> Verified
                  </div>

                  {/* Top section - cream background, centered */}
                  <div style={S.cardTop}>
                    <div style={S.shopAvatarCircle}>{shop.initials}</div>
                    <h3 style={S.shopNameBold}>{shop.name}</h3>
                    <p style={S.shopOwnerSub}>{shop.artisan}</p>
                    <div style={S.starsRow}>
                      <Star size={15} fill="#F59E0B" color="#F59E0B"/>
                      <span style={S.ratingNum}>{shop.rating}</span>
                      <span style={S.ratingCnt}>({shop.reviews} reviews)</span>
                    </div>
                  </div>

                  {/* Bottom section - white background */}
                  <div style={S.cardBottom}>
                    <p style={S.shopDesc}>{shop.description}</p>

                    {/* Info chips - inline row */}
                    <div style={S.infoRow}>
                      <div style={S.infoChip}><Clock size={12} color="#B87333"/><span>{shop.openingTime} - {shop.closingTime}</span></div>
                      <div style={S.infoChip}><Package size={12} color="#B87333"/><span>{shop.products.length} products</span></div>
                      <div style={S.infoChip}><MapPin size={12} color="#B87333"/><span>{shop.address?.substring(0,12)}...</span></div>
                    </div>

                    {/* Category tags */}
                    {shop.workingDays?.length > 0 && (
                      <div style={S.daysRow}>
                        {shop.workingDays.map((d, di) => <span key={di} style={S.dayPill}>{d}</span>)}
                      </div>
                    )}

                    {/* Buttons - wide */}
                    <div style={S.cardBtns}>
                      <button className="sp-btn-glow" onClick={() => handleViewShop(shop)} style={S.btnPrimaryWide}>
                        View Shop <ArrowRight size={15}/>
                      </button>
                      <button onClick={handleGetQuote} style={S.btnGhostWide}>Get Quote</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ SHOP DETAIL ══ */}
        {view === 'shop-detail' && selectedShop && (
          <div style={{ animation: 'fadeUp 0.5s ease-out' }}>
            <button className="sp-back-btn" onClick={handleBack} style={S.backBtn}>
              <ArrowLeft size={17}/> Back to Shops
            </button>

            {/* Header Card */}
            <div style={S.detailCard}>
              <div style={S.detailCardTopBar} />
              <div style={S.detailHeader}>
                <div style={S.detailAvatar}>{selectedShop.initials}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap', marginBottom:'0.4rem' }}>
                    <h2 style={S.detailShopName}>{selectedShop.name}</h2>
                    <span style={S.greenBadge}><CheckCircle2 size={13}/> Verified</span>
                  </div>
                  <p style={S.detailArtisan}>✦ Master Artisan: {selectedShop.artisan}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:'4px', marginTop:'0.7rem' }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#C9A44C" color="#C9A44C"/>)}
                    <span style={{ marginLeft:'0.5rem', color:'#7D6E63', fontSize:'0.9rem' }}>{selectedShop.rating} ({selectedShop.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <p style={S.detailDesc}>{selectedShop.description}</p>

              <div style={S.statsRow}>
                <div style={S.statItem}>
                  <Clock size={26} color="#B87333"/>
                  <span style={S.statNum}>{selectedShop.years}+</span>
                  <span style={S.statLabel}>Years Experience</span>
                </div>
                <div style={{ ...S.statItem, borderLeft:'1px solid rgba(201,164,76,0.2)', borderRight:'1px solid rgba(201,164,76,0.2)' }}>
                  <Package size={26} color="#B87333"/>
                  <span style={S.statNum}>{selectedShop.products.length}</span>
                  <span style={S.statLabel}>Products</span>
                </div>
                <div style={S.statItem}>
                  <MapPin size={26} color="#B87333"/>
                  <span style={S.statNum}>{selectedShop.location}</span>
                  <span style={S.statLabel}>Village</span>
                </div>
              </div>
            </div>

            {/* Products */}
            <div style={S.prodSectionHead}>
              <div style={S.sectionLine}/>
              <h3 style={S.sectionTitle}>Products from {selectedShop.name}</h3>
              <div style={{ ...S.sectionLine, background:'linear-gradient(90deg,rgba(201,164,76,0.4),transparent)' }}/>
            </div>

            {selectedShop.products.length === 0 ? (
              <div style={S.emptyProds}>
                <Package size={52} color="#C9A44C"/>
                <p style={{ color:'#7D6E63', marginTop:'1rem' }}>No products listed yet.</p>
              </div>
            ) : (
              <div style={S.prodsGrid}>
                {selectedShop.products.map((product, idx) => (
                  <div
                    key={product._id || idx}
                    className="sp-prod-card"
                    onClick={() => handleViewProduct(product)}
                    style={{ ...S.prodCard, animationDelay:`${idx*0.06}s`, animation:'fadeUp 0.45s ease-out both' }}
                  >
                    <div style={S.prodImgWrap}>
                      {getImageSrc(product.image) ? (
                        <img
                          className="sp-prod-img"
                          src={getImageSrc(product.image)}
                          alt={product.name}
                          style={S.prodImg}
                          onError={e => { e.target.parentNode.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3.5rem;background:#F5F0EA">🪔</div>'; }}
                        />
                      ) : (
                        <div style={S.prodImgEmpty}>🪔</div>
                      )}
                      <div className="sp-prod-overlay" style={S.prodOverlay}>
                        <span style={S.prodOverlayLabel}>View Details</span>
                      </div>
                    </div>

                    <div style={S.prodInfo}>
                      <span style={S.prodCatTag}>{product.category || 'Handicraft'}</span>
                      <h4 style={S.prodName}>{product.name}</h4>
                      {product.description && <p style={S.prodDescText}>{product.description}</p>}
                      <div style={S.prodPriceRow}>
                        <span style={S.prodPrice}>₹{product.price || '---'}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span style={S.prodOldPrice}>₹{product.originalPrice}</span>
                        )}
                      </div>
                      <button className="sp-btn-glow" style={S.prodBtn}>View Details →</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ PRODUCT DETAIL ══ */}
        {view === 'product-detail' && selectedProduct && selectedShop && (
          <div style={{ animation: 'fadeUp 0.5s ease-out' }}>
            <button className="sp-back-btn" onClick={handleBack} style={S.backBtn}>
              <ArrowLeft size={17}/> Back to {selectedShop.name}
            </button>

            <div style={S.prodDetailWrap}>
              {/* Image */}
              <div style={S.prodDetailImgSide}>
                {getImageSrc(selectedProduct.image) ? (
                  <img
                    src={getImageSrc(selectedProduct.image)}
                    alt={selectedProduct.name}
                    style={S.prodDetailImg}
                    onError={e => e.target.style.display = 'none'}
                  />
                ) : (
                  <div style={S.prodDetailImgEmpty}>🪔</div>
                )}
                <div style={S.prodDetailImgGradient}/>
              </div>

              {/* Info */}
              <div style={S.prodDetailInfoSide}>
                <span style={S.prodDetailCatTag}>{selectedProduct.category || 'Handicraft'}</span>
                <h2 style={S.prodDetailTitle}>{selectedProduct.name}</h2>

                <div style={S.prodDetailPriceRow}>
                  <span style={S.prodDetailPrice}>₹{selectedProduct.price || '---'}</span>
                  {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                    <span style={S.prodDetailOldPrice}>₹{selectedProduct.originalPrice}</span>
                  )}
                </div>

                <div style={S.metaBox}>
                  {[
                    { label: 'Artisan', value: selectedShop.artisan },
                    { label: 'Shop', value: selectedShop.name },
                    ...(selectedProduct.material ? [{ label: 'Material', value: selectedProduct.material }] : []),
                    ...(selectedProduct.weight ? [{ label: 'Weight', value: selectedProduct.weight }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} style={S.metaRow}>
                      <span style={S.metaLabel}>{label}</span>
                      <span style={S.metaValue}>{value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom:'2rem' }}>
                  <h4 style={S.aboutTitle}>About this piece</h4>
                  <p style={S.aboutText}>{selectedProduct.description || 'No description available.'}</p>
                </div>

                <div style={S.detailActionBtns}>
                  <button className="sp-btn-glow" onClick={handleGetQuote} style={{ ...S.btnPrimary, flex:1, justifyContent:'center' }}>
                    Get Quote
                  </button>
                  <button onClick={handleContactArtisan} style={{ ...S.btnGhost, flex:1 }}>
                    Contact Artisan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// ═══════════════════════
//  STYLE OBJECT
// ═══════════════════════
const S = {
  page: { minHeight:'100vh', width:'100%', maxWidth:'100vw', overflowX:'hidden', background:'#FAF7F2', fontFamily:"'Jost', sans-serif" },

  loadingWrap: { minHeight:'70vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1.5rem', background:'#FAF7F2' },
  loadingSpinner: { width:'52px', height:'52px', borderRadius:'50%', border:'3px solid #EDE5D8', borderTopColor:'#B87333', animation:'spin 0.85s linear infinite' },
  loadingText: { color:'#9E8E7E', fontSize:'1rem', letterSpacing:'0.05em' },
  centerWrap: { minHeight:'60vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem' },

  hero: {
    position:'relative', overflow:'hidden', width:'100%',
    background:'linear-gradient(135deg,#2C1810 0%,#3E2723 45%,#5D3218 100%)',
    padding:'5.5rem 2rem 4.5rem', textAlign:'center',
  },
  heroOrb1: { position:'absolute', top:'-80px', left:'-80px', width:'350px', height:'350px', borderRadius:'50%', background:'radial-gradient(circle,rgba(201,164,76,0.13) 0%,transparent 70%)', animation:'floatOrb 7s ease-in-out infinite' },
  heroOrb2: { position:'absolute', bottom:'-100px', right:'-60px', width:'420px', height:'420px', borderRadius:'50%', background:'radial-gradient(circle,rgba(184,115,51,0.1) 0%,transparent 70%)', animation:'floatOrb 9s ease-in-out infinite reverse' },
  heroCenter: { position:'relative', zIndex:1 },
  heroBadge: { display:'inline-flex', alignItems:'center', background:'rgba(201,164,76,0.12)', border:'1px solid rgba(201,164,76,0.25)', color:'#DDB96A', padding:'0.45rem 1.4rem', borderRadius:'30px', fontSize:'0.82rem', letterSpacing:'0.1em', fontWeight:500, marginBottom:'1.5rem' },
  heroTitle: { fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2.6rem,6vw,4.8rem)', fontWeight:700, color:'#F5EDD8', margin:'0 0 1rem', lineHeight:1.1, letterSpacing:'-0.01em' },
  heroSub: { fontSize:'1.05rem', color:'rgba(245,237,216,0.65)', fontWeight:300, letterSpacing:'0.02em' },

  body: { maxWidth:'1380px', margin:'0 auto', padding:'3rem 2rem' },

  searchBar: { display:'flex', gap:'1rem', alignItems:'center', flexWrap:'wrap', background:'white', padding:'1.1rem 1.4rem', borderRadius:'16px', boxShadow:'0 4px 24px rgba(62,39,35,0.07)', marginBottom:'1.4rem', border:'1px solid rgba(201,164,76,0.12)' },
  searchInputWrap: { flex:1, minWidth:'240px', display:'flex', alignItems:'center', gap:'0.7rem', background:'#FAF7F2', borderRadius:'10px', padding:'0.7rem 1rem' },
  searchInput: { flex:1, border:'none', background:'transparent', outline:'none', fontSize:'0.97rem', color:'#3E2723', fontFamily:"'Jost',sans-serif" },
  sortSelect: { padding:'0.7rem 1.1rem', border:'1.5px solid #E2D8CC', borderRadius:'10px', fontSize:'0.92rem', fontFamily:"'Jost',sans-serif", background:'white', cursor:'pointer', color:'#5D4037', outline:'none' },

  catRow: { display:'flex', gap:'0.6rem', flexWrap:'wrap', marginBottom:'1.8rem' },
  catBtn: { padding:'0.45rem 1.1rem', borderRadius:'30px', fontSize:'0.88rem', fontFamily:"'Jost',sans-serif", cursor:'pointer', transition:'all 0.2s', letterSpacing:'0.02em' },
  countText: { fontSize:'0.92rem', color:'#9E8E7E', marginBottom:'1.8rem' },

  shopsGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'1.8rem' },

  // NEW CARD STYLES - matching 2nd image
  shopCard: {
    background:'white', borderRadius:'20px', overflow:'hidden',
    boxShadow:'0 4px 24px rgba(62,39,35,0.08)',
    border:'1px solid rgba(201,164,76,0.18)',
    transition:'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    position:'relative',
  },
  verifiedCorner: {
    position:'absolute', top:'14px', right:'14px', zIndex:2,
    display:'inline-flex', alignItems:'center', gap:'0.3rem',
    background:'linear-gradient(135deg,#27AE60,#1E8449)',
    color:'white', padding:'0.28rem 0.75rem', borderRadius:'20px',
    fontSize:'0.75rem', fontWeight:700,
  },
  cardTop: {
    background:'linear-gradient(160deg,#FAF3E8 0%,#F5EBD8 100%)',
    padding:'2.2rem 2rem 1.5rem',
    display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center',
    borderBottom:'1px solid rgba(201,164,76,0.15)',
  },
  shopAvatarCircle: {
    width:'80px', height:'80px',
    background:'linear-gradient(135deg,#B87333,#C9A44C)',
    borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:'1.8rem', fontWeight:700, color:'#FFF8EE',
    fontFamily:"'Cormorant Garamond',serif",
    boxShadow:'0 6px 20px rgba(184,115,51,0.3)',
    marginBottom:'1rem',
  },
  shopNameBold: {
    fontSize:'1.4rem', fontWeight:700, color:'#2C1810',
    margin:'0 0 0.3rem', fontFamily:"'Cormorant Garamond',serif",
    letterSpacing:'0.01em',
  },
  shopOwnerSub: { fontSize:'0.88rem', color:'#9E8E7E', margin:'0 0 0.7rem' },
  cardBottom: { padding:'1.4rem 1.8rem 1.8rem', background:'white' },
  starsRow: { display:'flex', alignItems:'center', gap:'4px' },
  ratingNum: { marginLeft:'0.35rem', fontSize:'0.9rem', fontWeight:700, color:'#3E2723' },
  ratingCnt: { fontSize:'0.82rem', color:'#B0A090' },
  shopDesc: { fontSize:'0.9rem', color:'#5D4037', lineHeight:1.7, marginBottom:'1rem' },
  divider: { height:'1px', background:'linear-gradient(90deg,transparent,rgba(201,164,76,0.28),transparent)', margin:'0.9rem 0' },
  infoRow: { display:'flex', gap:'1rem', flexWrap:'wrap', marginBottom:'0.9rem' },
  infoCol: { display:'flex', flexDirection:'column', gap:'0.35rem', marginBottom:'0.7rem' },
  infoChip: { display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.82rem', color:'#7D6E63' },
  daysRow: { display:'flex', flexWrap:'wrap', gap:'0.35rem', marginBottom:'1rem' },
  dayPill: { background:'rgba(184,115,51,0.07)', color:'#B87333', padding:'0.2rem 0.6rem', borderRadius:'8px', fontSize:'0.76rem', fontWeight:500, border:'1px solid rgba(184,115,51,0.15)' },
  cardBtns: { display:'flex', gap:'0.7rem', marginTop:'1rem' },

  // Wide buttons matching 2nd image
  btnPrimaryWide: {
    flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem',
    background:'linear-gradient(135deg,#8B5E3C,#B87333)',
    color:'#FFF8EE', border:'none', padding:'0.85rem 1rem',
    borderRadius:'12px', fontSize:'0.92rem', fontWeight:600,
    cursor:'pointer', transition:'all 0.22s', fontFamily:"'Jost',sans-serif",
  },
  btnGhostWide: {
    flex:1, background:'transparent', color:'#8B5E3C',
    border:'1.5px solid rgba(139,94,60,0.4)',
    padding:'0.85rem 1rem', borderRadius:'12px', fontSize:'0.92rem',
    fontWeight:500, cursor:'pointer', transition:'all 0.22s',
    fontFamily:"'Jost',sans-serif", textAlign:'center',
  },

  btnPrimary: { display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'linear-gradient(135deg,#B87333,#C9A44C)', color:'#FFF8EE', border:'none', padding:'0.75rem 1.1rem', borderRadius:'11px', fontSize:'0.88rem', fontWeight:600, cursor:'pointer', transition:'all 0.22s', fontFamily:"'Jost',sans-serif", flex:1, justifyContent:'center' },
  btnGhost: { flex:1, background:'transparent', color:'#B87333', border:'1.5px solid rgba(184,115,51,0.35)', padding:'0.75rem 1rem', borderRadius:'11px', fontSize:'0.88rem', fontWeight:500, cursor:'pointer', transition:'all 0.22s', fontFamily:"'Jost',sans-serif" },

  backBtn: { display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'white', border:'1.5px solid rgba(184,115,51,0.25)', color:'#B87333', padding:'0.65rem 1.3rem', borderRadius:'11px', fontSize:'0.92rem', fontWeight:500, cursor:'pointer', marginBottom:'2rem', transition:'all 0.2s', fontFamily:"'Jost',sans-serif", boxShadow:'0 2px 10px rgba(184,115,51,0.08)' },

  detailCard: { background:'white', borderRadius:'22px', overflow:'hidden', boxShadow:'0 8px 36px rgba(62,39,35,0.09)', border:'1px solid rgba(201,164,76,0.13)', marginBottom:'2.5rem', position:'relative' },
  detailCardTopBar: { position:'absolute', top:0, left:0, right:0, height:'4px', background:'linear-gradient(90deg,#B87333,#C9A44C,#E8C97A,#C9A44C,#B87333)', backgroundSize:'200% auto', animation:'shimmer 3s linear infinite' },
  detailHeader: { display:'flex', alignItems:'flex-start', gap:'1.8rem', padding:'2.8rem 2.8rem 1.2rem', flexWrap:'wrap' },
  detailAvatar: { width:'90px', height:'90px', flexShrink:0, background:'linear-gradient(135deg,#B87333,#C9A44C)', borderRadius:'20px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', fontWeight:700, color:'#FFF8EE', fontFamily:"'Cormorant Garamond',serif", boxShadow:'0 7px 24px rgba(184,115,51,0.32)' },
  detailShopName: { fontFamily:"'Cormorant Garamond',serif", fontSize:'2.2rem', fontWeight:700, color:'#2C1810', margin:0 },
  greenBadge: { display:'inline-flex', alignItems:'center', gap:'0.3rem', background:'linear-gradient(135deg,#27AE60,#1E8449)', color:'white', padding:'0.28rem 0.8rem', borderRadius:'18px', fontSize:'0.8rem', fontWeight:600 },
  detailArtisan: { color:'#B87333', fontSize:'1rem', fontWeight:500, margin:'0.3rem 0 0' },
  detailDesc: { padding:'0 2.8rem 1.2rem', fontSize:'0.97rem', color:'#7D6E63', lineHeight:1.8 },
  statsRow: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', borderTop:'1px solid rgba(201,164,76,0.13)' },
  statItem: { display:'flex', flexDirection:'column', alignItems:'center', padding:'1.8rem 1rem', gap:'0.4rem', background:'linear-gradient(135deg,rgba(184,115,51,0.03),rgba(201,164,76,0.05))' },
  statNum: { fontSize:'1.7rem', fontWeight:700, color:'#2C1810', fontFamily:"'Cormorant Garamond',serif" },
  statLabel: { fontSize:'0.78rem', color:'#9E8E7E', textTransform:'uppercase', letterSpacing:'0.06em' },

  prodSectionHead: { display:'flex', alignItems:'center', gap:'1.5rem', marginBottom:'2.2rem' },
  sectionLine: { flex:1, height:'1px', background:'linear-gradient(90deg,transparent,rgba(201,164,76,0.4))' },
  sectionTitle: { fontFamily:"'Cormorant Garamond',serif", fontSize:'1.7rem', fontWeight:600, color:'#2C1810', whiteSpace:'nowrap', margin:0 },
  emptyProds: { textAlign:'center', padding:'4rem', background:'white', borderRadius:'18px', border:'2px dashed rgba(201,164,76,0.25)' },

  prodsGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))', gap:'1.4rem' },
  prodCard: { background:'white', borderRadius:'16px', overflow:'hidden', boxShadow:'0 4px 18px rgba(62,39,35,0.07)', border:'1px solid rgba(201,164,76,0.1)', transition:'all 0.3s cubic-bezier(0.4,0,0.2,1)', cursor:'pointer' },
  prodImgWrap: { height:'200px', overflow:'hidden', position:'relative', background:'#F5F0EA' },
  prodImg: { width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.4s ease', display:'block' },
  prodImgEmpty: { width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3.5rem' },
  prodOverlay: { position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(44,24,16,0.72),rgba(184,115,51,0.62))', display:'flex', alignItems:'center', justifyContent:'center', opacity:0, transition:'opacity 0.28s' },
  prodOverlayLabel: { color:'#FFF8EE', fontSize:'0.9rem', fontWeight:600, border:'1.5px solid rgba(255,248,238,0.55)', padding:'0.5rem 1.3rem', borderRadius:'28px', letterSpacing:'0.04em' },
  prodInfo: { padding:'1.2rem' },
  prodCatTag: { display:'inline-block', background:'rgba(184,115,51,0.07)', color:'#B87333', padding:'0.22rem 0.7rem', borderRadius:'8px', fontSize:'0.72rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em' },
  prodName: { fontSize:'1.1rem', fontWeight:600, color:'#2C1810', margin:'0.6rem 0 0.3rem', fontFamily:"'Cormorant Garamond',serif", lineHeight:1.3 },
  prodDescText: { fontSize:'0.82rem', color:'#9E8E7E', lineHeight:1.5, marginBottom:'0.7rem', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' },
  prodPriceRow: { display:'flex', alignItems:'baseline', gap:'0.5rem', marginBottom:'0.9rem' },
  prodPrice: { fontSize:'1.4rem', fontWeight:700, color:'#B87333', fontFamily:"'Cormorant Garamond',serif" },
  prodOldPrice: { fontSize:'0.88rem', color:'#C4B5A0', textDecoration:'line-through' },
  prodBtn: { width:'100%', background:'linear-gradient(135deg,#B87333,#C9A44C)', color:'#FFF8EE', border:'none', padding:'0.7rem', borderRadius:'9px', fontSize:'0.88rem', fontWeight:600, cursor:'pointer', transition:'all 0.22s', fontFamily:"'Jost',sans-serif" },

  prodDetailWrap: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0', background:'white', borderRadius:'22px', overflow:'hidden', boxShadow:'0 12px 45px rgba(62,39,35,0.11)', border:'1px solid rgba(201,164,76,0.13)' },
  prodDetailImgSide: { position:'relative', minHeight:'520px', background:'#F0EAE0', overflow:'hidden' },
  prodDetailImg: { width:'100%', height:'100%', objectFit:'cover', display:'block' },
  prodDetailImgEmpty: { width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'8rem' },
  prodDetailImgGradient: { position:'absolute', bottom:0, left:0, right:0, height:'35%', background:'linear-gradient(to top,rgba(44,24,16,0.28),transparent)' },
  prodDetailInfoSide: { padding:'2.8rem', display:'flex', flexDirection:'column', overflowY:'auto' },
  prodDetailCatTag: { display:'inline-block', background:'rgba(184,115,51,0.08)', color:'#B87333', padding:'0.35rem 1rem', borderRadius:'10px', fontSize:'0.77rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'1.1rem' },
  prodDetailTitle: { fontFamily:"'Cormorant Garamond',serif", fontSize:'2.5rem', fontWeight:700, color:'#2C1810', margin:'0 0 1rem', lineHeight:1.15 },
  prodDetailPriceRow: { display:'flex', alignItems:'baseline', gap:'0.9rem', marginBottom:'1.6rem' },
  prodDetailPrice: { fontSize:'2.2rem', fontWeight:700, color:'#B87333', fontFamily:"'Cormorant Garamond',serif" },
  prodDetailOldPrice: { fontSize:'1.15rem', color:'#C4B5A0', textDecoration:'line-through' },
  metaBox: { background:'linear-gradient(135deg,rgba(184,115,51,0.04),rgba(201,164,76,0.06))', borderRadius:'13px', padding:'1.1rem 1.3rem', marginBottom:'1.6rem', border:'1px solid rgba(201,164,76,0.13)' },
  metaRow: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.38rem 0', borderBottom:'1px solid rgba(201,164,76,0.1)' },
  metaLabel: { fontSize:'0.8rem', color:'#9E8E7E', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em' },
  metaValue: { fontSize:'0.92rem', color:'#3E2723', fontWeight:600 },
  aboutTitle: { fontFamily:"'Cormorant Garamond',serif", fontSize:'1.25rem', fontWeight:600, color:'#2C1810', marginBottom:'0.7rem' },
  aboutText: { fontSize:'0.97rem', color:'#7D6E63', lineHeight:1.8, marginBottom:'1.8rem' },
  detailActionBtns: { display:'flex', gap:'0.9rem', marginTop:'auto' },
};

export default ShopPage;