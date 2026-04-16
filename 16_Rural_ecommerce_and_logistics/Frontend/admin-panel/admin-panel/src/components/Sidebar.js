import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Package, ShoppingCart, Settings, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ setAuth }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");   // remove login flag
    setAuth(false);                       // 🔥 IMPORTANT
    navigate("/login");
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Sellers', icon: <Users size={20} />, path: '/sellers' },
    { name: 'Products', icon: <Package size={20} />, path: '/products' },
    { name: 'Orders', icon: <ShoppingCart size={20} />, path: '/orders' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <div className="admin-sidebar">
      <div className="admin-logo">
        <h2>GramKala</h2>
        <span>ADMIN PANEL</span>
      </div>

      <nav className="admin-menu">
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            to={item.path} 
            className={`admin-menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="admin-logout">
        <button onClick={handleLogout}>
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
