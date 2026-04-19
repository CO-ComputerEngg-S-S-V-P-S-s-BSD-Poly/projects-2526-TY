import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom'; // ✅ useLocation जोड़ा गया

function Register() {
  const location = useLocation(); // ✅ Home.js से डेटा रिसीव करने के लिए

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    serviceType: 'Web Development',
    paymentMethod: 'Online',
    transactionId: '',
    projectDetails: 'Standard Project Request'
  });

  const [price, setPrice] = useState(0);

  // १. Home Page से आए हुए प्लान को ऑटो-सिलेक्ट करने के लिए लॉजिक
  useEffect(() => {
    if (location.state && location.state.selectedPlan) {
      const plan = location.state.selectedPlan;
      
      // प्लान के नाम के आधार पर सही सर्विस टाइप सेट करना
      if (plan.includes("Basic")) {
        setFormData(prev => ({ ...prev, serviceType: 'Web Development' }));
      } else if (plan.includes("Standard")) {
        setFormData(prev => ({ ...prev, serviceType: 'UI/UX Design' })); // या जो भी आपकी कैटेगरी हो
      } else if (plan.includes("Premium")) {
        setFormData(prev => ({ ...prev, serviceType: 'App Development' }));
      }
    }
  }, [location.state]);

  // २. कीमतों को अपडेट करना
  useEffect(() => {
    const prices = {
      'Web Development': 5000,
      'UI/UX Design': 3000,
      'App Development': 8000,
      'Assignment Support': 500,
      'PPT Design': 300,
      'Report Writing': 400
    };
    setPrice(prices[formData.serviceType]);
  }, [formData.serviceType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length !== 8) {
      alert("❌ Password must be exactly 8 characters long!");
      return;
    }

    try {
      // Backend URL चेक करें कि वह सही है या नहीं
      const res = await axios.post('http://localhost:5000/api/hire', formData);
      if (res.status === 201) {
        alert("✅ Registration Successful! Please login.");
        setFormData({ fullName: '', email: '', password: '', serviceType: 'Web Development', paymentMethod: 'Online', transactionId: '', projectDetails: 'Standard Project Request' });
      }
    } catch (err) {
      alert("❌ Error: Registration failed. Make sure server is running.");
    }
  };

  return (
    <div className="registration-wrapper py-5 min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="row g-0">
                
                {/* डावी बाजू: माहिती विभाग */}
                <div className="col-md-5 text-white p-5 d-flex flex-column justify-content-center" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
                  <h2 className="fw-bold mb-4">Freelance Hub</h2>
                  {location.state?.selectedPlan && (
                    <div className="alert alert-light text-primary fw-bold border-0 rounded-3 mb-4">
                      ✨ Selected: {location.state.selectedPlan}
                    </div>
                  )}
                  <p className="opacity-75 mb-4">Register today to start your project with live progress tracking and secure payments.</p>
                  <ul className="list-unstyled">
                    <li className="mb-2"><i className="fas fa-check-circle me-2"></i> Exactly 8-char Security</li>
                    <li className="mb-2"><i className="fas fa-check-circle me-2"></i> Real-time Dashboard</li>
                  </ul>
                </div>

                {/* उजवी बाजू: रजिस्ट्रेशन फॉर्म */}
                <div className="col-md-7 bg-white p-4 p-lg-5">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold text-dark mb-0">Service Registration</h3>
                    <h4 className="text-primary fw-bold mb-0">₹{price}</h4>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Full Name</label>
                      <input type="text" name="fullName" value={formData.fullName} className="form-control" placeholder="Your Name" required onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold">Email Address</label>
                      <input type="email" name="email" value={formData.email} className="form-control" placeholder="name@example.com" required onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold text-primary">Create Password (Exactly 8 chars)</label>
                      <input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        className="form-control border-primary" 
                        placeholder="••••••••" 
                        required 
                        maxLength="8" 
                        onChange={handleChange} 
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-bold">Choose Service</label>
                      <select name="serviceType" className="form-select" value={formData.serviceType} onChange={handleChange}>
                        <option value="Web Development">Web Development - ₹5000</option>
                        <option value="UI/UX Design">UI/UX Design - ₹3000</option>
                        <option value="App Development">App Development - ₹8000</option>
                        <option value="Assignment Support">Assignment Support - ₹500</option>
                        <option value="PPT Design">PPT Design - ₹300</option>
                        <option value="Report Writing">Report Writing - ₹400</option>
                      </select>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 fw-bold py-2 shadow rounded-pill">
                      Register & Create Account
                    </button>
                    
                    <p className="text-center mt-3 small">
                      Already have an account? <Link to="/login" className="fw-bold text-decoration-none">Login Here</Link>
                    </p>
                  </form>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
