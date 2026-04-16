import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Redirect ke liye
import { User, MapPin, Briefcase, Lock, Mail } from 'lucide-react';
import axios from 'axios'; // Backend connection ke liye
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('customer');
  
  // State for Form Data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    village: '',
    craftType: ''
  });

  const { firstName, lastName, email, password, village, craftType } = formData;

  // Input change handler
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle Form Submission
  const handleRegister = async (e) => {
    e.preventDefault();
    
    const userData = {
      firstName,
      lastName,
      email,
      password,
      role: userType,
      village,
      craftType: userType === 'artisan' ? craftType : ''
    };

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', userData);
      alert(res.data.msg); // "Registration successful!"
      navigate('/login'); // Login page par bhejein
    } catch (err) {
      // Backend se aane wala error message dikhayein
      alert(err.response?.data?.msg || "Registration failed. Server check karein.");
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h2 className="auth-title">Join GramKala</h2>
          <p className="auth-subtitle">Create an account to start shopping or selling</p>
        </div>

        {/* User Type Toggle */}
        <div className="auth-toggle-container">
          <button 
            type="button"
            onClick={() => setUserType('customer')}
            className={`toggle-btn ${userType === 'customer' ? 'is-active' : ''}`}
          >
            <User size={18} className="toggle-icon" /> Customer
          </button>
          <button 
            type="button"
            onClick={() => setUserType('artisan')}
            className={`toggle-btn ${userType === 'artisan' ? 'is-active' : ''}`}
          >
            <Briefcase size={18} className="toggle-icon" /> Artisan
          </button>
        </div>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-row-grid">
            <input name="firstName" type="text" placeholder="First Name" required className="auth-input1" onChange={onChange} />
            <input name="lastName" type="text" placeholder="Last Name" required className="auth-input1" onChange={onChange} />
          </div>
          
          <div className="input-relative">
            <input name="email" type="email" placeholder="Email Address" required className="auth-input-with-icon" onChange={onChange} />
            <Mail className="input-icon" size={18} />
          </div>
          
          <div className="input-relative">
            <input name="village" type="text" placeholder="Location (Village/City)" required className="auth-input-with-icon" onChange={onChange} />
            <MapPin className="input-icon" size={18} />
          </div>

          {userType === 'artisan' && (
            <div className="artisan-special-section">
              <p className="special-label">Artisan Special:</p>
              <select name="craftType" className="auth-select" onChange={onChange} required>
                <option value="">Select Your Craft</option>
                <option value="Pottery">Pottery (Mitti)</option>
                <option value="Woodwork">Woodwork (Lakdi)</option>
                <option value="Ironwork">Ironwork (Loha)</option>
                <option value="Handicrafts">Handicrafts</option>
              </select>
            </div>
          )}

          <div className="input-relative">
            <input name="password" type="password" placeholder="Create Password" required className="auth-input-with-icon" onChange={onChange} />
            <Lock className="input-icon" size={18} />
          </div>

          <button type="submit" className="auth-submit-btn">
            {userType === 'artisan' ? 'Register as Seller' : 'Register Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;