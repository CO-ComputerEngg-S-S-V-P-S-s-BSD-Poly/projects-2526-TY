import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, MessageSquare, Clock, ArrowRight, Users, CheckCircle, MapPin } from 'lucide-react';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="badge">Direct Authority Access</span>

          <h1>Government at Your <span>Doorstep</span></h1>

          <p>
            Local Area Complaint Management System helps citizens raise complaints 
            related to electricity, water, roads, and sanitation directly to authorities.
          </p>

          <div className="hero-cta">
            <button onClick={() => navigate('/register')} className="main-btn">
              Get Started for Free <ArrowRight size={20}/>
            </button>

            <button onClick={() => navigate('/login')} className="sub-btn">
              Login to Portal
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <img
            src="https://leadtrekker.com/wp-content/uploads/2022/01/Customer-Complaint-Management-System.png"
            alt="citizen"
            className="hero-image"
          />
        </div>
      </section>


      {/* FEATURES */}
      <div className="features-grid1">

        <div className="info-card">
          <ShieldCheck size={32} color="#2563eb" />
          <h3>Secure Data</h3>
          <p>Your identity and complaints are fully protected.</p>
        </div>

        <div className="info-card">
          <MessageSquare size={32} color="#2563eb" />
          <h3>Direct Communication</h3>
          <p>Communicate directly with local authorities.</p>
        </div>

        <div className="info-card">
          <Clock size={32} color="#2563eb" />
          <h3>Real-Time Updates</h3>
          <p>Get instant status updates for your complaint.</p>
        </div>

      </div>


      {/* STATISTICS SECTION */}
      <section className="stats-section">

        <div className="stat">
          <Users size={30}/>
          <h2>10,000+</h2>
          <p>Citizens Registered</p>
        </div>

        <div className="stat">
          <CheckCircle size={30}/>
          <h2>7,500+</h2>
          <p>Complaints Resolved</p>
        </div>

        <div className="stat">
          <MapPin size={30}/>
          <h2>150+</h2>
          <p>Areas Covered</p>
        </div>

      </section>


      {/* HOW IT WORKS */}
      <section className="how-section">

        <h2>How It Works</h2>

        <div className="how-grid">

          <div className="step">
            <h3>1️⃣ Register</h3>
            <p>Create your account in seconds.</p>
          </div>

          <div className="step">
            <h3>2️⃣ File Complaint</h3>
            <p>Select category and submit your issue.</p>
          </div>

          <div className="step">
            <h3>3️⃣ Track Status</h3>
            <p>Get updates until your issue is resolved.</p>
          </div>

        </div>

      </section>

    </div>
  );
};

export default Home;
