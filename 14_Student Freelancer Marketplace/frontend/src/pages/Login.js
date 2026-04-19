import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Sending login request to backend
      const res = await axios.post(`http://localhost:5000/api/client-login`, credentials);
      
      if (res.status === 200) {
        // Saving user session
        localStorage.setItem('clientUser', JSON.stringify(res.data));
        alert("✅ Login Successful! Welcome back.");
        
        // Redirecting to Home Page as you requested
        navigate('/'); 
      }
    } catch (err) {
      setError("❌ Invalid Username or Password. Please try again.");
    }
  };

  return (
    <div className="login-page bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card shadow-lg border-0 p-4 rounded-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">Login</h2>
                <p className="text-muted small">Access your FreelanceHub account</p>
              </div>

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label fw-bold small">Username</label>
                  <input 
                    type="text" 
                    name="username"
                    className="form-control py-2 shadow-sm" 
                    placeholder="Enter Username" 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold small">Password</label>
                  <input 
                    type="password" 
                    name="password"
                    className="form-control py-2 shadow-sm" 
                    placeholder="••••••••" 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 fw-bold py-2 shadow mb-3">
                  Sign In
                </button>
              </form>

              {error && <div className="alert alert-danger py-2 small text-center">{error}</div>}

              <div className="text-center mt-3">
                <p className="small text-muted mb-0">Don't have a project yet?</p>
                <Link to="/register" className="small fw-bold text-decoration-none">Register Here</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
