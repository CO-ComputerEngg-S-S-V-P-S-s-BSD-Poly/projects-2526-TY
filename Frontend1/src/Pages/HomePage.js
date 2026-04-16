import React from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import mandala from "../Assets/mandalaright-removebg-preview.png";

const HomePage = () => {
 const navigate = useNavigate();
  return (
    <div className="home-container">

      <img src={mandala} alt="mandala" className="home-mandala-left" />
      <img src={mandala} alt="mandala" className="home-mandala" />


      <div className="mantra-section">
        <p className="home-mantra-text">
          ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं<br />
          भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥
        </p>
      </div>

      <div className="card-section">
        <div className="home-card" onClick={() => navigate("/sanskar")}>
          <h3>Sanskar</h3>
          <p>Traditional Hindu rituals</p>
        </div>
        <div className="home-card" onClick={() => navigate("/yag")}>
          <h3>Yag</h3>
          <p>All types of yag</p>
        </div>

        <div className="home-card" onClick={() => navigate("/havan")}>
          <h3>Havan</h3>
          <p>Vedic havan & homa</p>
        </div>
        
      </div>

    </div>
  );
};

export default HomePage;
