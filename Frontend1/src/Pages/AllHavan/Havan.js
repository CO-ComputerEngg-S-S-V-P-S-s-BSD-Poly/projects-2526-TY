import React from "react";
import mandala from "../../Assets/mandalaright-removebg-preview.png"
import { useNavigate } from "react-router-dom";
import {
  FaSun,
  FaOm,
  FaFireFlameCurved,
  FaHouseChimney,
  FaHandsPraying,
  FaGopuram,
} from "react-icons/fa6";
import { GiFire } from "react-icons/gi";
import "./Havan.css";


const Havan = () => {

  const navigate = useNavigate();

  const havans = [
    { name: "Gayatri Havan", path: "gayatri", icon: <FaSun /> },
    { name: "Navagraha Havan", path: "navagraha", icon: <FaOm /> },
    { name: "Mahamrityunjaya Havan", path: "mahamrityunjaya", icon: <FaHandsPraying /> },
    { name: "Laghu Rudra Havan", path: "laghurudra", icon: <FaFireFlameCurved /> },
    { name: "Maha Rudra Havan", path: "maharudra", icon: <GiFire /> },
    { name: "Shat Chandi Havan", path: "shatchandi", icon: <FaOm /> },
    { name: "Vastu Shanti Havan", path: "vastu", icon: <FaHouseChimney /> },
    { name: "Temple Pratishtha Havan", path: "pratishtha", icon: <FaGopuram /> },
  ];

  return (
    
    <div className="havan-page">
      <img src={mandala} alt="mandala" className="home-mandala-left" />
      <img src={mandala} alt="mandala" className="home-mandala" />
      <h1 className="havan-title">Havan Services</h1>
      
      <div className="havan-container">
        {havans.map((item, index) => (
          <div
            key={index}
            className="havan-card"
            onClick={() => navigate(`/havan/${item.path}`)}
          >
            <div className="havan-icon">
              {item.icon}
            </div>
            <h3>{item.name}</h3>
            <button className="havan-btn">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Havan;