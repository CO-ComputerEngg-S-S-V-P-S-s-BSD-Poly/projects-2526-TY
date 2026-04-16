import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, LogIn, UserPlus, LayoutDashboard, LogOut, Grid } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to={token ? "/dashboard" : "/"} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2>LocalSolve</h2>
        </Link>
      </div>
      
      <ul className="nav-links">

        {!token ? (
          <>
            <li><Link to="/"><Home size={18}/> Home</Link></li>
            <li><Link to="/about">About</Link></li>


            {/* Category Option */}

            <li><Link to="/login" className="login-btn"><LogIn size={18}/> Login</Link></li>
            <li><Link to="/register" className="login-btn"><UserPlus size={18}/> Register</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/"><Home size={18}/> Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/dashboard"><LayoutDashboard size={18}/> Dashboard</Link></li>

            {/* Category Option */}
            <li><Link to="/select-category"><Grid size={18}/> Categories</Link></li>

            <li className="logout-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
              <span className="logout-link"><LogOut size={18}/> Logout</span>
            </li>
          </>
        )}

      </ul>
    </nav>
  );
};

export default Navbar;
