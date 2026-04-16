import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, User, Lock } from 'lucide-react';
import './AdminLogin.css';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Backend API Call
      const res = await axios.post('http://localhost:5000/api/auth/login', credentials);
      
      // Check karein ki user admin hai ya nahi
      if (res.data.user.role !== 'admin') {
        alert("Access Denied: Aap Admin nahi hain!");
        return;
      }

      // Token aur Auth status save karein
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('isAdminAuthenticated', 'true');
      
      alert("Welcome Admin!");
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || "Login Failed");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-box">
        <div className="login-header">
          <ShieldCheck size={48} color="#2563eb" />
          <h2>Admin Portal</h2>
        </div>
        <form onSubmit={handleLogin}>
          <div className="input-field">
            <User size={18} />
            <input type="email" placeholder="Admin Email" required 
              onChange={(e) => setCredentials({...credentials, email: e.target.value})} />
          </div>
          <div className="input-field">
            <Lock size={18} />
            <input type="password" placeholder="Password" required 
              onChange={(e) => setCredentials({...credentials, password: e.target.value})} />
          </div>
          <button type="submit" className="admin-btn">Login to Control Center</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;