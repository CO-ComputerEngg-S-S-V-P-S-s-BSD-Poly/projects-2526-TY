import React from "react";
import { useNavigate } from "react-router-dom";
import "./Yag.css";
import mandala from "../../Assets/mandalaright-removebg-preview.png"
import { GiFire, GiLotusFlower, GiPrayerBeads } from "react-icons/gi";
import { FaOm } from "react-icons/fa";
import { MdTempleHindu } from "react-icons/md";
import { TbFlame } from "react-icons/tb";

const YagPage = () => {

  const navigate = useNavigate();

  const yags = [
    { name: "Ganesh Yag", path: "ganesh", icon: <MdTempleHindu /> },
    { name: "Datta Yag", path: "datta", icon: <GiPrayerBeads /> },
    { name: "Vishnu Yag", path: "vishnu", icon: <FaOm /> },
    { name: "Chaturmasya Yag", path: "chaturmasya", icon: <GiLotusFlower /> },
    { name: "Maha Yadnya", path: "mahayadnya", icon: <GiFire /> },
    { name: "Navchandi Yag", path: "navchandi", icon: <TbFlame /> },
  ];

  return (
    <div className="yag-page">
<img src={mandala} alt="mandala" className="home-mandala-left" />
      <img src={mandala} alt="mandala" className="home-mandala" />
      <h1 className="yag-title">Sacred Yag Services</h1>
      <p className="yag-subtitle">
        Choose the Yag you want to perform with proper Vedic rituals
      </p>

      <div className="yag-card-container">
        {yags.map((item, index) => (
          <div
            className="yag-card"
            key={index}
            onClick={() => navigate(`/yag/${item.path}`)}
          >
            <div className="yag-icon">
              {item.icon}
            </div>
            <h3>{item.name}</h3>
            <button className="yag-btn">View Details</button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default YagPage;