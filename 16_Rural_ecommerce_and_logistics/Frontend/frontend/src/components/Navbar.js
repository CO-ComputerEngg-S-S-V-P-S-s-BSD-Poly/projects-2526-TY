import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, UserPlus, Menu, LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;

  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="nav-logo">
          <h1>GramKala</h1>
        </Link>

        {/* Search */}
        <div className="nav-search-section">
          <div className="search-input-group">
            <input
              type="text"
              className="search-input"
              placeholder="Mitti, Loha, Lakdi search karein..."
            />
            <Search className="search-icon-inside" size={18} />
          </div>
        </div>

        <div className="nav-links">

          {/* Shop */}
          {role === "customer" && (
          <Link to="/shop" className="nav-link-item text-link">
            Shop
          </Link>
          )}

          {/* Login / Register */}
          {!token ? (
            <>
              <Link to="/login" className="nav-link-item icon-link">
                <User size={20} />
                <span>Login</span>
              </Link>

              <Link to="/register" className="nav-link-item icon-link register-btn">
                <UserPlus size={20} />
                <span>Register</span>
              </Link>
            </>
          ) : (
            <>
              {/* CUSTOMER */}
              {role === "customer" && (
                <Link to="/my-orders" className="nav-link-item icon-link">
                  <User size={20} />
                  <span>Status</span>
                </Link>
              )}

              {/* ARTISAN DASHBOARD */}
              {role === "artisan" && (
                <Link to="/artisan-dashboard" className="nav-link-item icon-link">
                  <User size={20} />
                  <span>Dashboard</span>
                </Link>
              )}

              {/* Logout */}
              <button onClick={handleLogout} className="nav-link-item icon-link logout-btn-nav">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          )}

          {/* Cart only for Customer */}
          {token && role === "customer" && !isHomePage && (
            <Link to="/cart" className="nav-link-item icon-link cart-link">
              <ShoppingCart size={20} />
              <span className="cart-count">0</span>
              <span>Cart</span>
            </Link>
          )}

          {/* Mobile menu */}
          <div className="mobile-menu-btn">
            <Menu size={24} />
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
