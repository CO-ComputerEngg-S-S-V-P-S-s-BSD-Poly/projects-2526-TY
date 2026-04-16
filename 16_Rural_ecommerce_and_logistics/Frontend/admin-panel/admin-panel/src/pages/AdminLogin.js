import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck } from 'lucide-react'; // Mail icon use karenge email ke liye
import axios from 'axios';
import './AdminLogin.css';

const AdminLogin = ({ setAuth }) => {
  // Credentials mein 'username' ki jagah 'email' use karenge
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // 1. Backend Login API call
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: credentials.email,
        password: credentials.password
      });

      // 2. Check kijiye ki kya login karne wala user 'admin' hai
      if (res.data.user.role === 'admin') {
        // Token aur status save karein
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        setAuth(true);
        alert("Welcome Super Admin!");
        navigate('/'); // Dashboard par le jayein
      } else {
        alert("Access Denied! Yeh portal sirf admins ke liye hai.");
      }

    } catch (err) {
      // 3. Error handle karein (Ghalat password ya user na milne par)
      console.error(err);
      alert(err.response?.data?.msg || "Login failed! Please check your admin credentials.");
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="login-icon-box">
          <ShieldCheck size={40} color="#fb923c" />
        </div>
        <h2>Admin Portal</h2>
        <p>Enter your database admin credentials</p>

        <form onSubmit={handleLogin}>
          <div className="admin-input-group">
            <Mail size={18} className="input-icon" />
            <input 
              type="email" 
              placeholder="Admin Email" 
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              required 
            />
          </div>
          <div className="admin-input-group">
            <Lock size={18} className="input-icon" />
            <input 
              type="password" 
              placeholder="Secret Password" 
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required 
            />
          </div>
          <button type="submit" className="admin-login-btn">Authorize Access</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;