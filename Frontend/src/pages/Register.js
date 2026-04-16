import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Axios import karna zaroori hai
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend API call
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      alert(response.data.msg); // "User registered successfully"
      navigate('/login'); // Registration ke baad login par bhejein
    } catch (err) {
      // Agar backend se error aaye (jaise email already exists)
      alert(err.response?.data?.msg || "Registration failed. Try again.");
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <input type="text" placeholder="Full Name" required 
          onChange={(e) => setFormData({...formData, name: e.target.value})} />
        <input type="email" placeholder="Email Address" required 
          onChange={(e) => setFormData({...formData, email: e.target.value})} />
        <input type="tel" placeholder="Phone Number" required 
          onChange={(e) => setFormData({...formData, phone: e.target.value})} />
        <input type="password" placeholder="Password" required 
          onChange={(e) => setFormData({...formData, password: e.target.value})} />
        
        <button type="submit" className="btn-primary">Register</button>
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </form>
    </div>
  );
};

export default Register;