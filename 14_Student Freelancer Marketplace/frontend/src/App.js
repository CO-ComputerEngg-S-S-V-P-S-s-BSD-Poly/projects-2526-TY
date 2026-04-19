import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Pages Import
import Home from './pages/Home';
import Services from './pages/Services';
import Registration from './pages/Registration';
import Login from './pages/Login'; 
import AdminDashboard from './pages/Admin'; 
import ClientDashboard from './pages/ClientDashboard';
import Contact from './pages/Contact'; 
import FreelancerProfile from './pages/FreelancerProfile'; 

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('clientUser');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('clientUser');
    setUser(null);
    alert("Logged out successfully!");
    window.location.href = "/"; 
  };

  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100 bg-light">
        
        {/* Navbar with Profile in the Corner */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow sticky-top py-2">
          <div className="container">
            <Link className="navbar-brand fw-bold fs-3" to="/">
              Freelancer<span className="text-primary"> Hub</span>
            </Link>
            
            <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            
            <div className="collapse navbar-collapse" id="navbarNav">
              {/* Menu Links */}
              <ul className="navbar-nav mx-auto align-items-center gap-3">
                <li className="nav-item"><Link className="nav-link text-white" to="/">Home</Link></li>
                <li className="nav-item"><Link className="nav-link text-white" to="/services">Services</Link></li>
                <li className="nav-item"><Link className="nav-link text-info fw-semibold" to="/client-dashboard">Dashboard</Link></li>
                <li className="nav-item"><Link className="nav-link text-warning fw-semibold" to="/admin">Admin</Link></li>
              </ul>

              {/* RIGHT CORNER: Freelancer Profile Avatar */}
              <div className="navbar-nav ms-auto align-items-center gap-3">
                {/* Profile Link with Circle Letter (Fixing the Image Error) */}
                <Link to="/profile/1" className="d-flex align-items-center text-decoration-none border border-secondary rounded-pill p-1 pe-3 hover-effect">
                    <div className="position-relative">
                        {/* Letter Avatar Instead of Broken Image */}
                        <div 
                          className="rounded-circle border border-2 border-primary d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            background: '#1e3c72', 
                            fontSize: '1.2rem' 
                          }}
                        >
                          
                        </div>
                        {/* WhatsApp Style Green Online Dot */}
                        <span className="position-absolute bottom-0 end-0 bg-success border border-1 border-white rounded-circle" 
                              style={{ width: '12px', height: '12px' }}></span>
                    </div>
                    <div className="ms-2 d-none d-lg-block text-start">
                        <p className="text-white mb-0 small fw-bold" style={{ lineHeight: '1' }}>Rahul Patil</p>
                        <small className="text-primary" style={{ fontSize: '10px' }}>Available</small>
                    </div>
                </Link>

                {/* Login/Logout Logic */}
                {!user ? (
                  <Link className="btn btn-sm btn-outline-light rounded-pill px-3 ms-2 fw-bold" to="/login">Login</Link>
                ) : (
                  <button onClick={handleLogout} className="btn btn-sm btn-danger rounded-pill px-3 ms-2 fw-bold shadow-sm">Logout</button>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/contact" element={<Contact />} /> 
            <Route path="/profile/:id" element={<FreelancerProfile />} />
          </Routes>
        </main>

        <footer className="bg-dark text-white py-3 text-center mt-auto">
          <small className="opacity-50">© 2026 Freelancer Hub | Nashik</small>
        </footer>

        <style>{`
            .hover-effect:hover { background: rgba(255,255,255,0.1); transition: 0.3s; }
            .nav-link:hover { color: #ffc107 !important; }
        `}</style>
      </div>
    </Router>
  );
}

export default App;
