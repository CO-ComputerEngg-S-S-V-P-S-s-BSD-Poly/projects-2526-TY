import React, { useState, useEffect, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { AppProvider, useApp } from "./context/AppContext";
import { WishlistProvider } from "./context/WishlistContext";

import Navbar      from "./components/Navbar";
import Footer      from "./components/Footer";
import CartSidebar from "./components/Cartsidebar";

import Home              from "./pages/home";
import AboutPage         from "./pages/AboutPage";
import ContactPage       from "./pages/ContactPage";
import ShopsPage         from "./pages/ShopsPage";
import ShopDetailPage    from "./pages/ShopDetailPage";
import AddShop           from "./pages/AddShop";
import ProductsPage      from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoryPage      from "./pages/CategoryPage";
import Cart              from "./pages/Cart";
import WishlistPage      from "./pages/WishlistPage";
import OrdersPage        from "./pages/OrdersPage";
import ComparePage       from "./pages/ComparePage";
import QuotePage         from "./pages/QuotePage";
import ProfilePage       from "./pages/ProfilePage";
import SettingsPage      from "./pages/SettingsPage";
import LoginPage         from "./pages/LoginPage";
import Registration      from "./pages/Registration";
import Logout            from "./pages/Logout";
import Feedback          from "./pages/Feedback";
import FAQPage           from "./pages/FAQPage";   // ← NEW

import "./App.css";


const theme = {
  colors: {
    copper: "#B87333", brass: "#C9A44C", cream: "#FFF6E5",
    darkBrown: "#3E2723", primary: "#B87333", secondary: "#C9A44C",
    background: "#FFF6E5", surface: "#FFFFFF", text: "#3E2723",
    border: "#E8DECD", white: "#FFFFFF", black: "#1A0F08",
  },
  typography: { fonts: { heading: "'Playfair Display', serif", body: "'DM Sans', sans-serif" } },
  breakpoints: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px" },
};

/* ── Route Guards ── */
function ProtectedRoute({ children }) {
  const { user } = useApp();
  return user ? children : <Navigate to="/LoginPage" replace />;
}
function GuestRoute({ children }) {
  const { user } = useApp();
  return user ? <Navigate to="/" replace /> : children;
}

function Loader() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", flexDirection: "column", gap: "1rem" }}>
      <div style={{ width: 44, height: 44, border: "3px solid #E8DECD", borderTop: "3px solid #C9943D", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <span style={{ color: "#8D6E63", fontSize: "0.85rem" }}>Loading…</span>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "1.25rem", textAlign: "center", padding: "2rem" }}>
      <div style={{ fontSize: "4rem" }}>🏺</div>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "2rem", color: "#3E2723", margin: 0 }}>Page Not Found</h2>
      <p style={{ color: "#8D6E63", maxWidth: 320, lineHeight: 1.7, margin: 0 }}>This page doesn't exist or has been moved.</p>
      <a href="/" style={{ background: "linear-gradient(135deg,#C9943D,#B8762E)", color: "white", padding: "0.75rem 2rem", borderRadius: "50px", textDecoration: "none", fontWeight: 700, fontSize: "0.9rem" }}>← Back to Home</a>
    </div>
  );
}

function AuthLayout({ children }) {
  return <div style={{ minHeight: "100vh", width: "100%" }}>{children}</div>;
}

/* ── About page pe paddingTop:0, baaki sab pe 6.5rem ── */
function MainLayout({ children, cartCount, onCartOpen }) {
  const location = useLocation();
  const isAbout = location.pathname === '/about' || location.pathname === '/AboutPage';

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: theme.colors.background, color: theme.colors.text, fontFamily: theme.typography.fonts.body }}>
      <Navbar cartCount={cartCount} onCartOpen={onCartOpen} />
      <main style={{ flex: "1 0 auto", width: "100%", paddingTop: isAbout ? "0" : "6.5rem" }}>
        <Suspense fallback={<Loader />}>{children}</Suspense>
      </main>
      <Footer />
    </div>
  );
}

/* ════════════════════════════════════════════
   APP INNER
════════════════════════════════════════════ */
function AppInner() {
  const { user, logout } = useApp();

  const [cartItems, setCartItems] = useState(() => {
    try { const s = localStorage.getItem('songirCart'); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductForQuote, setSelectedProductForQuote] = useState(null);

  useEffect(() => { localStorage.setItem('songirCart', JSON.stringify(cartItems)); }, [cartItems]);

  const cartCount = cartItems.reduce((a, i) => a + i.quantity, 0);

  const addToCart = (product) => {
    setCartItems(curr => {
      const ex = curr.find(i => i.id === product.id);
      if (ex) return curr.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...curr, { ...product, quantity: 1, originalPrice: product.originalPrice ?? product.price + 300 }];
    });
    setIsCartOpen(true);
  };
  const updateQuantity = (id, qty) => {
    if (qty < 1) { removeItem(id); return; }
    setCartItems(curr => curr.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };
  const removeItem = (id) => setCartItems(curr => curr.filter(i => i.id !== id));

  return (
    <>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} updateQuantity={updateQuantity} removeItem={removeItem} />

      <Routes>

        {/* ══ AUTH PAGES (no Navbar/Footer) ══ */}
        <Route path="/LoginPage"    element={<AuthLayout><GuestRoute><LoginPage /></GuestRoute></AuthLayout>} />
        <Route path="/Registration" element={<AuthLayout><GuestRoute><Registration /></GuestRoute></AuthLayout>} />
        <Route path="/Logout"       element={<AuthLayout><Logout user={user} onLogout={() => logout?.()} /></AuthLayout>} />

        {/* ══ ALL MAIN ROUTES (with Navbar + Footer) ══ */}
        <Route path="/*" element={
          <MainLayout cartCount={cartCount} onCartOpen={() => setIsCartOpen(true)}>
            <Routes>

              {/* Home */}
              <Route path="/"     element={<Home addToCart={addToCart} />} />
              <Route path="/home" element={<Navigate to="/" replace />} />

              {/* Static Pages */}
              <Route path="/AboutPage"   element={<AboutPage />} />
              <Route path="/about"       element={<AboutPage />} />
              <Route path="/ContactPage" element={<ContactPage />} />
              <Route path="/contact"     element={<ContactPage />} />

              {/* PRODUCTS */}
              <Route path="/ProductsPage" element={<ProductsPage addToCart={addToCart} setSelectedProductForQuote={setSelectedProductForQuote} />} />
              <Route path="/products"     element={<ProductsPage addToCart={addToCart} setSelectedProductForQuote={setSelectedProductForQuote} />} />

              {/* Product Detail */}
              <Route path="/ProductDetail" element={
                <ProductDetailPage
                  Cart={cartItems}
                  addToCart={addToCart}
                  setSelectedProductForQuote={setSelectedProductForQuote}
                />
              } />
              <Route path="/ProductDetailPage/:id" element={<ProductDetailPage addToCart={addToCart} Cart={cartItems} setSelectedProductForQuote={setSelectedProductForQuote} />} />
              <Route path="/products/:id"          element={<ProductDetailPage addToCart={addToCart} Cart={cartItems} setSelectedProductForQuote={setSelectedProductForQuote} />} />

              {/* Category sub-routes */}
              <Route path="/products/brass"       element={<ProductsPage addToCart={addToCart} />} />
              <Route path="/products/copper"      element={<ProductsPage addToCart={addToCart} />} />
              <Route path="/products/religious"   element={<ProductsPage addToCart={addToCart} />} />
              <Route path="/products/decor"       element={<CategoryPage addToCart={addToCart} />} />
              <Route path="/products/bestsellers" element={<ProductsPage addToCart={addToCart} />} />
              <Route path="/products/new"         element={<ProductsPage addToCart={addToCart} />} />
              <Route path="/products/deals"       element={<ProductsPage addToCart={addToCart} />} />
              <Route path="/products/gifts"       element={<CategoryPage addToCart={addToCart} />} />

              {/* SHOPS */}
              <Route path="/ShopsPage"           element={<ShopsPage />} />
              <Route path="/shops"               element={<ShopsPage />} />
              <Route path="/shops/verified"      element={<ShopsPage />} />
              <Route path="/shops/trending"      element={<ShopsPage />} />
              <Route path="/shops/local"         element={<ShopsPage />} />
              <Route path="/shops/:shopName"     element={<ShopDetailPage />} />
              <Route path="/ShopsPage/:shopName" element={<ShopDetailPage />} />

              {/* CART */}
              <Route path="/Cart" element={<Cart cartItems={cartItems} updateQuantity={updateQuantity} removeItem={removeItem} />} />
              <Route path="/cart" element={<Cart cartItems={cartItems} updateQuantity={updateQuantity} removeItem={removeItem} />} />

              {/* WISHLIST */}
              <Route path="/WishlistPage" element={<WishlistPage addToCart={addToCart} />} />

              {/* COMPARE */}
              <Route path="/ComparePage" element={<ComparePage setSelectedProductForQuote={setSelectedProductForQuote} />} />
              <Route path="/compare"     element={<ComparePage setSelectedProductForQuote={setSelectedProductForQuote} />} />

              {/* QUOTE */}
              <Route path="/QuotePage" element={<QuotePage selectedProduct={selectedProductForQuote} />} />
              <Route path="/quote"     element={<QuotePage selectedProduct={selectedProductForQuote} />} />

              {/* SUPPORT */}
              <Route path="/Feedback" element={<Feedback />} />

              {/* ✅ FAQ PAGE — NEW */}
              <Route path="/FAQPage" element={<FAQPage />} />
              <Route path="/faq"     element={<FAQPage />} />

              {/* PROTECTED ROUTES */}
              <Route path="/ProfilePage"  element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/profile"      element={<Navigate to="/ProfilePage" replace />} />

              <Route path="/OrdersPage"   element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              <Route path="/orders"       element={<Navigate to="/OrdersPage" replace />} />

              <Route path="/SettingsPage" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/settings"     element={<Navigate to="/SettingsPage" replace />} />

              {/* ADD SHOP */}
              <Route path="/AddShop" element={<AddShop />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </MainLayout>
        } />

      </Routes>
    </>
  );
}

/* ════════════════════════════════════════════
   MAIN APP
════════════════════════════════════════════ */
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <WishlistProvider>
          <AppInner />
        </WishlistProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// import React, { useState, useEffect, useCallback, Suspense } from "react";
// import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
// import { ThemeProvider } from "styled-components";
// import { AppProvider, useApp } from "./context/AppContext";
// import { WishlistProvider } from "./context/WishlistContext";

// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import CartSidebar from "./components/Cartsidebar";

// import Home from "./pages/home";
// import AboutPage from "./pages/AboutPage";
// import ContactPage from "./pages/ContactPage";
// import ShopsPage from "./pages/ShopsPage";
// import ShopDetailPage from "./pages/ShopDetailPage";
// import AddShop from "./pages/AddShop";
// import ProductsPage from "./pages/ProductsPage";
// import ProductDetailPage from "./pages/ProductDetailPage";
// import CategoryPage from "./pages/CategoryPage";
// import Cart from "./pages/Cart";
// import WishlistPage from "./pages/WishlistPage";
// import OrdersPage from "./pages/OrdersPage";
// import ComparePage from "./pages/ComparePage";
// import QuotePage from "./pages/QuotePage";
// import ProfilePage from "./pages/ProfilePage";
// import SettingsPage from "./pages/SettingsPage";
// import LoginPage from "./pages/LoginPage";
// import Registration from "./pages/Registration";
// import Logout from "./pages/Logout";
// import Feedback from "./pages/Feedback";
// import FAQPage from "./pages/FAQPage";

// import "./App.css";

// const theme = {
//   colors: {
//     copper: "#B87333", brass: "#C9A44C", cream: "#FFF6E5",
//     darkBrown: "#3E2723", primary: "#B87333", secondary: "#C9A44C",
//     background: "#FFF6E5", surface: "#FFFFFF", text: "#3E2723",
//     border: "#E8DECD", white: "#FFFFFF", black: "#1A0F08",
//   },
//   typography: { fonts: { heading: "'Playfair Display', serif", body: "'DM Sans', sans-serif" } },
//   breakpoints: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px" },
// };

// function ProtectedRoute({ children }) {
//   const { user } = useApp();
//   return user ? children : <Navigate to="/LoginPage" replace />;
// }

// function GuestRoute({ children }) {
//   const { user } = useApp();
//   return user ? <Navigate to="/" replace /> : children;
// }

// function Loader() {
//   return (
//     <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh", flexDirection:"column", gap:"1rem" }}>
//       <div style={{ width:44, height:44, border:"3px solid #E8DECD", borderTop:"3px solid #C9943D", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       <span style={{ color:"#8D6E63", fontSize:"0.85rem" }}>Loading…</span>
//     </div>
//   );
// }

// function NotFound() {
//   return (
//     <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh", gap:"1.25rem", textAlign:"center", padding:"2rem" }}>
//       <div style={{ fontSize:"4rem" }}>🏺</div>
//       <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"2rem", color:"#3E2723", margin:0 }}>Page Not Found</h2>
//       <p style={{ color:"#8D6E63", maxWidth:320, lineHeight:1.7, margin:0 }}>This page doesn't exist or has been moved.</p>
//       <a href="/" style={{ background:"linear-gradient(135deg,#C9943D,#B8762E)", color:"white", padding:"0.75rem 2rem", borderRadius:"50px", textDecoration:"none", fontWeight:700, fontSize:"0.9rem" }}>← Back to Home</a>
//     </div>
//   );
// }

// function AuthLayout({ children }) {
//   return <div style={{ minHeight:"100vh", width:"100%" }}>{children}</div>;
// }

// function MainLayout({ children, cartCount, onCartOpen, addToCart, onQuoteRequest }) {
//   const location = useLocation();
//   const isAbout = location.pathname === '/about' || location.pathname === '/AboutPage';
//   return (
//     <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh", backgroundColor:theme.colors.background, color:theme.colors.text, fontFamily:theme.typography.fonts.body }}>
//       <Navbar 
//         cartCount={cartCount} 
//         onCartOpen={onCartOpen} 
//         addToCart={addToCart}
//         onQuoteRequest={onQuoteRequest}
//       />
//       <main style={{ flex:"1 0 auto", width:"100%", paddingTop: isAbout ? "0" : "6.5rem" }}>
//         <Suspense fallback={<Loader />}>{children}</Suspense>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// function AppInner() {
//   const { user } = useApp();
//   const navigate = useNavigate();

//   const [cartItems, setCartItems] = useState(() => {
//     try { const s = localStorage.getItem('songirCart'); return s ? JSON.parse(s) : []; }
//     catch { return []; }
//   });
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [selectedProductForQuote, setSelectedProductForQuote] = useState(null);

//   useEffect(() => { localStorage.setItem('songirCart', JSON.stringify(cartItems)); }, [cartItems]);
//   const cartCount = cartItems.reduce((a, i) => a + i.quantity, 0);

//   const addToCart = (product) => {
//     setCartItems(curr => {
//       const ex = curr.find(i => i.id === product.id);
//       if (ex) return curr.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
//       return [...curr, { ...product, quantity: 1, originalPrice: product.originalPrice ?? product.price + 300 }];
//     });
//     setIsCartOpen(true);
//   };

//   const updateQuantity = (id, qty) => {
//     if (qty < 1) { removeItem(id); return; }
//     setCartItems(curr => curr.map(i => i.id === id ? { ...i, quantity: qty } : i));
//   };

//   const removeItem = (id) => setCartItems(curr => curr.filter(i => i.id !== id));

//   // PERFECT QUOTE HANDLER
//   const handleQuoteNavigation = useCallback((product = null) => {
//     if (user) {
//       // Logged in user goes directly to quote
//       navigate('/quote', { state: { selectedProduct: product, fromLogin: true } });
//     } else {
//       // Guest goes to registration with quote intent
//       navigate('/Registration', { 
//         state: { 
//           from: '/quote',
//           intent: 'quote',
//           product: product 
//         } 
//       });
//     }
//   }, [user, navigate]);

//   return (
//     <>
//       <CartSidebar
//         isOpen={isCartOpen}
//         onClose={() => setIsCartOpen(false)}
//         cartItems={cartItems}
//         updateQuantity={updateQuantity}
//         removeItem={removeItem}
//       />

//       <Routes>
//         {/* AUTH PAGES */}
//         <Route path="/LoginPage" element={<AuthLayout><GuestRoute><LoginPage /></GuestRoute></AuthLayout>} />
//         <Route path="/login" element={<AuthLayout><GuestRoute><LoginPage /></GuestRoute></AuthLayout>} />
//         <Route path="/Registration" element={<AuthLayout><GuestRoute><Registration /></GuestRoute></AuthLayout>} />
//         <Route path="/register" element={<AuthLayout><GuestRoute><Registration /></GuestRoute></AuthLayout>} />
//         <Route path="/Logout" element={<AuthLayout><Logout user={user} /></AuthLayout>} />

//         {/* MAIN ROUTES */}
//         <Route path="/*" element={
//           <MainLayout 
//             cartCount={cartCount} 
//             onCartOpen={() => setIsCartOpen(true)} 
//             addToCart={addToCart}
//             onQuoteRequest={handleQuoteNavigation}
//           >
//             <Routes>
//               <Route path="/" element={<Home addToCart={addToCart} />} />
//               <Route path="/home" element={<Navigate to="/" replace />} />

//               <Route path="/AboutPage" element={<AboutPage />} />
//               <Route path="/about" element={<AboutPage />} />
//               <Route path="/ContactPage" element={<ContactPage />} />
//               <Route path="/contact" element={<ContactPage />} />

//               <Route path="/ProductsPage" element={<ProductsPage addToCart={addToCart} setSelectedProductForQuote={setSelectedProductForQuote} />} />
//               <Route path="/products" element={<ProductsPage addToCart={addToCart} setSelectedProductForQuote={setSelectedProductForQuote} />} />
//               <Route path="/ProductDetail" element={<ProductDetailPage Cart={cartItems} addToCart={addToCart} setSelectedProductForQuote={setSelectedProductForQuote} />} />
//               <Route path="/ProductDetailPage/:id" element={<ProductDetailPage addToCart={addToCart} Cart={cartItems} setSelectedProductForQuote={setSelectedProductForQuote} />} />
//               <Route path="/products/:id" element={<ProductDetailPage addToCart={addToCart} Cart={cartItems} setSelectedProductForQuote={setSelectedProductForQuote} />} />

//               <Route path="/products/brass" element={<ProductsPage addToCart={addToCart} />} />
//               <Route path="/products/copper" element={<ProductsPage addToCart={addToCart} />} />
//               <Route path="/products/religious" element={<ProductsPage addToCart={addToCart} />} />
//               <Route path="/products/statues" element={<ProductsPage addToCart={addToCart} />} />
//               <Route path="/products/decor" element={<CategoryPage addToCart={addToCart} />} />
//               <Route path="/products/bestsellers" element={<ProductsPage addToCart={addToCart} />} />
//               <Route path="/products/new" element={<ProductsPage addToCart={addToCart} />} />
//               <Route path="/products/deals" element={<ProductsPage addToCart={addToCart} />} />
//               <Route path="/products/gifts" element={<CategoryPage addToCart={addToCart} />} />

//               <Route path="/ShopsPage" element={<ShopsPage />} />
//               <Route path="/shops" element={<ShopsPage />} />
//               <Route path="/shops/verified" element={<ShopsPage filter="verified" />} />
//               <Route path="/shops/trending" element={<ShopsPage filter="trending" />} />
//               <Route path="/shops/local" element={<ShopsPage filter="local" />} />
//               <Route path="/shops/:shopName" element={<ShopDetailPage />} />
//               <Route path="/ShopsPage/:shopName" element={<ShopDetailPage />} />

//               <Route path="/Cart" element={<Cart cartItems={cartItems} updateQuantity={updateQuantity} removeItem={removeItem} />} />
//               <Route path="/cart" element={<Cart cartItems={cartItems} updateQuantity={updateQuantity} removeItem={removeItem} />} />

//               <Route path="/WishlistPage" element={<WishlistPage addToCart={addToCart} />} />
//               <Route path="/wishlist" element={<Navigate to="/WishlistPage" replace />} />

//               <Route path="/ComparePage" element={<ComparePage setSelectedProductForQuote={setSelectedProductForQuote} />} />
//               <Route path="/compare" element={<ComparePage setSelectedProductForQuote={setSelectedProductForQuote} />} />

//               {/* QUOTE PAGE - PUBLIC */}
//               <Route path="/QuotePage" element={<QuotePage selectedProduct={selectedProductForQuote} />} />
//               <Route path="/quote" element={<QuotePage selectedProduct={selectedProductForQuote} />} />

//               <Route path="/Feedback" element={<Feedback />} />
//               <Route path="/FAQPage" element={<FAQPage />} />
//               <Route path="/faq" element={<FAQPage />} />

//               <Route path="/ProfilePage" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
//               <Route path="/profile" element={<Navigate to="/ProfilePage" replace />} />
//               <Route path="/OrdersPage" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
//               <Route path="/orders" element={<Navigate to="/OrdersPage" replace />} />
//               <Route path="/SettingsPage" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
//               <Route path="/settings" element={<Navigate to="/SettingsPage" replace />} />

//               <Route path="/AddShop" element={<AddShop />} />

//               <Route path="*" element={<NotFound />} />
//             </Routes>
//           </MainLayout>
//         } />
//       </Routes>
//     </>
//   );
// }

// export default function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <AppProvider>
//         <WishlistProvider>
//           <AppInner />
//         </WishlistProvider>
//       </AppProvider>
//     </ThemeProvider>
//   );
// }