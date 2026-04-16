/**
 * ProtectedRoute.jsx
 * ─────────────────────────────────────────────────────────
 * Wrap any Route that requires login.
 * If user is NOT logged in → redirect to /login
 * If user IS logged in     → render the page normally
 *
 * USAGE in App.jsx / Router:
 *
 *   import ProtectedRoute from './ProtectedRoute';
 *
 *   <Routes>
 *     {/* Public — anyone can see *\/}
 *     <Route path="/"          element={<Home />} />
 *     <Route path="/products"  element={<Products />} />
 *     <Route path="/products/:id" element={<ProductDetail />} />
 *     <Route path="/shops"     element={<Shops />} />
 *     <Route path="/shops/:id" element={<ShopDetail />} />
 *     <Route path="/about"     element={<About />} />
 *     <Route path="/contact"   element={<Contact />} />
 *     <Route path="/faqs"      element={<FAQs />} />
 *     <Route path="/login"     element={<Login />} />
 *     <Route path="/register"  element={<Register />} />
 *
 *     {/* Protected — must be logged in *\/}
 *     <Route path="/profile"        element={<ProtectedRoute><Profile /></ProtectedRoute>} />
 *     <Route path="/orders"         element={<ProtectedRoute><Orders /></ProtectedRoute>} />
 *     <Route path="/orders/track"   element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />
 *     <Route path="/wishlist"       element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
 *     <Route path="/cart"           element={<ProtectedRoute><Cart /></ProtectedRoute>} />
 *     <Route path="/settings"       element={<ProtectedRoute><Settings /></ProtectedRoute>} />
 *     <Route path="/reviews"        element={<ProtectedRoute><MyReviews /></ProtectedRoute>} />
 *     <Route path="/referral"       element={<ProtectedRoute><Referral /></ProtectedRoute>} />
 *     <Route path="/notifications"  element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
 *     <Route path="/feedback"       element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
 *     <Route path="/quote"          element={<ProtectedRoute><GetQuote /></ProtectedRoute>} />
 *   </Routes>
 * ─────────────────────────────────────────────────────────
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    /*
     * Redirect to /login and remember where the user was trying to go.
     * After login, you can redirect back: navigate(location.state?.from || '/')
     */
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}