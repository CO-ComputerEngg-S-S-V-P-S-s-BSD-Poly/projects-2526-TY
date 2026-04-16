import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import ArtisanDashboard from './pages/ArtisanDashboard';
import MyOrders from './pages/MyOrders';
import Payment from './pages/Payment'; // Payment page import kiya

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navbar hamesha top par rahega */}
        <Navbar />

        <main className="flex-grow">
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<CategoryPage />} />
           <Route path="/product/:id" element={<ProductDetails />} />
            
            {/* --- Authentication --- */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* --- Customer Routes --- */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<Payment />} /> {/* Payment Route add kiya */}
            
            {/* --- Artisan/Seller Routes --- */}
            <Route path="/artisan-dashboard" element={<ArtisanDashboard />} />
            <Route path="/my-orders" element={<MyOrders />} />

            
            {/* --- Admin Routes --- */}
            {/* <Route path="/admin" element={<AdminDashboard />} /> */}
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-orange-900 text-white py-8 mt-12 text-center">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-xl font-serif font-bold">GramKala</p>
            <p className="text-orange-200 text-sm mt-2 italic text-balance">
              Supporting Rural Artisans: Pottery, Woodwork, Iron & Handicrafts.
            </p>
            <div className="mt-4 border-t border-orange-800 pt-4 text-xs text-orange-400">
              © 2026 GramKala Rural Marketplace. Made with ❤️ for Artisans.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;