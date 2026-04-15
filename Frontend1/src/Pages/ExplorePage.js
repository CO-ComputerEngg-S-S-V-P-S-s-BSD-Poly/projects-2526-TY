import React from "react";
import { Link } from "react-router-dom";
import "./ExplorePage.css";
import mandala from "../Assets/mandalaright-removebg-preview.png";

const ExplorePage = () => {
  return (
    <div className="explore-container">
      <img src={mandala} alt="mandala" className="home-mandala-left" />
      <img src={mandala} alt="mandala" className="home-mandala" />
      <h1 className="explore-title">Explore Spiritual World</h1>

      <div className="explore-grid">

        <Link to="/spiritual/bhagavadgita" className="explore-card">
         <div className="explore-card-symbol">ॐ</div>
          <h2>Bhagavad Gita</h2>
          <p>Life lessons, karma and devotion explained.</p>
        </Link>

        <Link to="/spiritual/ramayan" className="explore-card">
         <div className="explore-card-symbol">ॐ</div>
          <h2>Ramayan</h2>
          <p>Story of Lord Rama and the path of dharma.</p>
        </Link>

        <Link to="/spiritual/vedicmantras" className="explore-card">
         <div className="explore-card-symbol">ॐ</div>
          <h2>Vedic Mantras</h2>
          <p>Ancient chants for peace and positivity.</p>
        </Link>

        <Link to="/spiritual/prayers" className="explore-card">
         <div className="explore-card-symbol">ॐ</div>
          <h2>Prayers</h2>
          <p>Daily prayers to connect with God.</p>
        </Link>

        <Link to="/spiritual/spiritualquotes" className="explore-card">
         <div className="explore-card-symbol">ॐ</div>
          <h2>Spiritual Quotes</h2>
          <p>Words that calm the mind and soul.</p>
        </Link>

        <Link to="/spiritual/godsdeities" className="explore-card">
         <div className="explore-card-symbol">ॐ</div>
          <h2>Gods & Deities</h2>
          <p>Information about Hindu Gods and avatars.</p>
        </Link>


      </div>
    </div>
  );
};

export default ExplorePage;
