import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Sidebar from './components/Sidebar';

// Pages
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/AdminLogin';
import Sellers from './pages/Sellers';
import Products from './pages/Products';
import Orders from './pages/Orders';

// CSS
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in
    const auth = localStorage.getItem('isAdmin');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Loading screen jab tak auth check ho raha ho
  if (loading) return <div className="loading-screen">GramKala Admin Loading...</div>;

  return (
    <Router>
      <div className="admin-layout">
        {/* Sidebar only shows if authenticated */}
       {isAuthenticated && <Sidebar setAuth={setIsAuthenticated} />}

        
        <main className={isAuthenticated ? "admin-main-content" : "admin-full-screen"}>
          <Routes>
            {/* Login Route: Redirects to dashboard if already logged in */}
            <Route 
              path="/login" 
              element={!isAuthenticated ? <AdminLogin setAuth={setIsAuthenticated} /> : <Navigate to="/" />} 
            />

            {/* Main Dashboard Route */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* Artisan Sellers Approval Route */}
            <Route 
              path="/sellers" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Sellers />
                </ProtectedRoute>
              } 
            />

            {/* Future Routes (Placeholder for Products/Orders) */}
            <Route 
            path="/products" 
          element={
         <ProtectedRoute isAuthenticated={isAuthenticated}>
           <Products />
         </ProtectedRoute>
            } 
          />
          
<Route path="/orders" element={<Orders />} />
            {/* Catch-all: Redirect to home or login based on status */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;