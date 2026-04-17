import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const [clientData, setClientData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const loggedInUser = localStorage.getItem('clientUser');
      if (loggedInUser) {
        setClientData(JSON.parse(loggedInUser));
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  // ✅ Updated logic to send user to '/register' instead of '/contact'
  const handleCardAction = (type, planDetails = null) => {
    if (type === 'payments') {
      alert("Redirecting to our Secure Payment Policy...");
    } else if (type === 'students') {
      navigate('/services'); 
    } else if (type === 'delivery') {
      navigate('/contact');
    } else if (type === 'select_plan') {
      // ✅ Now it navigates to Registration page with the plan data
      navigate('/register', { state: { selectedPlan: planDetails } });
    }
  };

  return (
    <div className="home-page" style={{ fontFamily: "'Poppins', sans-serif", overflowX: 'hidden' }}>
      
      {/* 1. Hero Section */}
      <header className="hero-section text-white d-flex align-items-center" 
        style={{ 
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          minHeight: '70vh',
          padding: '80px 0'
        }}>
        <div className="container text-center">
          <h1 className="display-3 fw-bold mb-3" style={{ textShadow: '2px 4px 10px rgba(0,0,0,0.2)' }}>
            Freelancer <span style={{ color: '#ffc107' }}>Hub Nashik</span>
          </h1>
          <p className="lead fs-4 mb-5 opacity-75 mx-auto" style={{ maxWidth: '800px' }}>
            The ultimate marketplace for skilled students and clients looking for top-tier solutions.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/services" className="btn btn-warning btn-lg px-5 py-3 fw-bold rounded-pill shadow-lg border-0">
              Explore Services
            </Link>
            <Link to="/contact" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill border-2">
              Contact Me
            </Link> 
          </div>
        </div>
      </header>

      {/* 2. Core Values Section */}
      <section className="py-5 bg-white border-top">
        <div className="container py-5 text-center">
          <div className="mb-5">
            <h2 className="fw-bold">Our Core Values</h2>
            <div className="mx-auto mt-2" style={{ width: '50px', height: '4px', background: '#ffc107', borderRadius: '10px' }}></div>
          </div>
          <div className="row g-4">
            <div className="col-md-4" onClick={() => handleCardAction('payments')} style={{ cursor: 'pointer' }}>
              <div className="p-4 rounded-4 feature-box bg-white shadow-sm h-100 border">
                <div className="display-5 mb-3 text-warning">🛡️</div>
                <h5 className="fw-bold">Secure Payments</h5>
                <p className="text-muted small">Safe escrow-based transactions for every project.</p>
              </div>
            </div>
            <div className="col-md-4" onClick={() => handleCardAction('students')} style={{ cursor: 'pointer' }}>
              <div className="p-4 rounded-4 feature-box bg-white shadow-sm h-100 border">
                <div className="display-5 mb-3 text-primary">🎓</div>
                <h5 className="fw-bold">Verified Talent</h5>
                <p className="text-muted small">Work with top-rated talent from verified backgrounds.</p>
              </div>
            </div>
            <div className="col-md-4" onClick={() => handleCardAction('delivery')} style={{ cursor: 'pointer' }}>
              <div className="p-4 rounded-4 feature-box bg-white shadow-sm h-100 border">
                <div className="display-5 mb-3 text-success">⚡</div>
                <h5 className="fw-bold">Fast Delivery</h5>
                <p className="text-muted small">Optimized workflows to ensure projects are on time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pricing Section (Interactive Buttons) */}
      <section className="py-5 bg-light border-top">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold display-6">Service <span className="text-primary">Packages</span></h2>
            <div className="mx-auto mt-2" style={{ width: '60px', height: '4px', background: '#ffc107', borderRadius: '10px' }}></div>
            <p className="text-muted mt-3">Choose a plan that fits your project needs.</p>
          </div>

          <div className="row g-4 justify-content-center">
            {/* Basic Plan */}
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm p-4 rounded-4 pricing-card">
                <div className="text-center mb-4">
                  <span className="badge bg-info bg-opacity-10 text-info mb-2 px-3 py-2 rounded-pill">Light Project</span>
                  <h3 className="fw-bold mb-0">Basic</h3>
                  <div className="display-6 fw-bold my-3 text-dark">₹5,000</div>
                </div>
                <ul className="list-unstyled mb-4 flex-grow-1 text-muted small">
                  <li>✅ Single Page Design</li>
                  <li>✅ Responsive Layout</li>
                  <li>✅ 3 Days Delivery</li>
                </ul>
                <button 
                   onClick={() => handleCardAction('select_plan', 'Basic Plan (₹5,000)')}
                   className="btn btn-outline-primary w-100 rounded-pill fw-bold">Select Basic</button>
              </div>
            </div>

            {/* Standard Plan */}
            <div className="col-md-4">
              <div className="card h-100 border-primary shadow-lg p-4 rounded-4 pricing-card featured-plan" style={{ border: '2px solid #007bff' }}>
                <div className="text-center mb-4">
                  <span className="badge bg-primary text-white mb-2 px-3 py-2 rounded-pill">Most Popular</span>
                  <h3 className="fw-bold mb-0 text-primary">Standard</h3>
                  <div className="display-6 fw-bold my-3 text-dark">₹12,000</div>
                </div>
                <ul className="list-unstyled mb-4 flex-grow-1 text-muted small">
                  <li>✅ Up to 5 Pages</li>
                  <li>✅ SEO Optimization</li>
                  <li>✅ Contact Form</li>
                </ul>
                <button 
                   onClick={() => handleCardAction('select_plan', 'Standard Plan (₹12,000)')}
                   className="btn btn-primary w-100 rounded-pill fw-bold shadow">Select Standard</button>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm p-4 rounded-4 pricing-card">
                <div className="text-center mb-4">
                  <span className="badge bg-warning bg-opacity-10 text-warning mb-2 px-3 py-2 rounded-pill">Advanced</span>
                  <h3 className="fw-bold mb-0">Premium</h3>
                  <div className="display-6 fw-bold my-3 text-dark">₹25,000+</div>
                </div>
                <ul className="list-unstyled mb-4 flex-grow-1 text-muted small">
                  <li>✅ Unlimited Pages</li>
                  <li>✅ Backend Support</li>
                  <li>✅ 24/7 Support</li>
                </ul>
                <button 
                   onClick={() => handleCardAction('select_plan', 'Premium Plan (₹25,000+)')}
                   className="btn btn-outline-dark w-100 rounded-pill fw-bold">Select Premium</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Map Section */}
      <section className="py-5 bg-white">
        <div className="container text-center py-4">
          <h2 className="fw-bold mb-4">📍 Our Hub in <span className="text-primary">Nashik</span></h2>
          <div className="shadow-lg rounded-5 overflow-hidden mx-auto border border-white border-4" style={{ maxWidth: '1000px', height: '350px' }}>
            <iframe
  title="Nashik Map"
  src="https://www.google.com/maps?q=Nashik,Maharashtra&output=embed"
  width="100%"
  height="100%"
  style={{ border: 0 }}
  allowFullScreen=""
  loading="lazy">
</iframe>
          </div>
        </div>
      </section>

      <style>{`
        .feature-box, .pricing-card { transition: all 0.3s ease; }
        .feature-box:hover, .pricing-card:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; }
      `}</style>

    </div>
  );
}

export default Home;
