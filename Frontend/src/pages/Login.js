import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
      
      // 1. Token aur User detail ko save karein
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // 2. User ka naam alag se save karein taki Home page pe "Namaste, Name" dikh sake
      localStorage.setItem('userName', response.data.user.name);

      alert("Login Successful!");
      
      // 3. Navigate karein '/home' par jahan humne cards banaye hain
      navigate('/dashboard'); 
      
    } catch (err) {
      alert(err.response?.data?.msg || "Invalid credentials");
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Citizen Login</h2>
        <input type="email" placeholder="Email Address" required 
          onChange={(e) => setCredentials({...credentials, email: e.target.value})} />
        <input type="password" placeholder="Password" required 
          onChange={(e) => setCredentials({...credentials, password: e.target.value})} />
        
        <button type="submit" className="btn-primary">Login</button>
        <p>New User? <Link to="/register">Register Now</Link></p>
      </form>
    </div>
  );
};

export default Login;