import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { 
        email, 
        password 
      });

      // --- ZARURI FIX: Poora User Object save karein ---
      // Taaki ArtisanDashboard.js ise "JSON.parse" karke "user.id" nikal sake
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user)); 
      
      // Purane dashboard support ke liye ye bhi rehne dein (Optional)
      localStorage.setItem('userRole', res.data.user.role);
      localStorage.setItem('userName', res.data.user.name);

      alert(`Swagat hai, ${res.data.user.name}!`);

      // Role-based Redirection
      const role = res.data.user.role;
      if (role === 'admin') {
        navigate('/admin'); 
      } else if (role === 'artisan') {
        navigate('/artisan-dashboard');
      } else {
        navigate('/'); 
      }

      // Navbar update ke liye refresh
      window.location.reload();

    } catch (err) {
      alert(err.response?.data?.msg || "Login failed! Email/Password check karein.");
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Swagat Hai!</h2>
          <p className="auth-subtitle">GramKala Artisan/Customer Portal</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-relative">
              <input 
                type="email" 
                required
                className="auth-input"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="input-icon" size={18} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-relative">
              <input 
                type="password" 
                required
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="input-icon" size={18} />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn">
            Login Now <ArrowRight className="btn-arrow" size={18} />
          </button>
        </form>

        <p className="auth-footer-text">
          Account nahi hai? <Link to="/register" className="auth-link">Register Karein</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;