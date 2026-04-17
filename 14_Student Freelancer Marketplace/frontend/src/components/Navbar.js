import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; 

const Navbar = () => {
  return (
    <div className="sidebar">
      <div className="logo">Freelancer<span>Marketplace</span></div>
      
      <ul className="nav-links">
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/post">Post a Job</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </div>
  );
};

export default Navbar;
