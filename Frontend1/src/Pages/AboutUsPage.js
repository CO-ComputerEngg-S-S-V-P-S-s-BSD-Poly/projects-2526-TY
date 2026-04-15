import React, { useState } from "react";
import "./AboutUsPage.css";
import mandala from "../Assets/mandalaright-removebg-preview.png";

const AboutUsPage = () => {
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (name) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  return (
    <div className="about-container">
      {/* MANDALAS */}
      <img src={mandala} alt="mandala" className="home-mandala-left" />
      <img src={mandala} alt="mandala" className="home-mandala" />

      {/* ABOUT CONTENT */}
      <div className="about-content">
        <h1 className="about-title">About PurohitMitra</h1>

        <p className="about-text">
          PurohitMitra is a spiritual platform connecting devotees with authentic Hindu rituals, pujas, sanskars, and sacred traditions. Our goal is to make spiritual services easily accessible with trust, purity, and devotion.
        </p>

        <p className="about-text">
          We preserve Sanatan Dharma and provide professional priests for all rituals and important festivals.
        </p>

        {/* CARDS / ACCORDIONS */}
        <div className="about-cards">

          {/* Our Vision */}
          <div className="about-card" onClick={() => toggleAccordion("vision")}>
            <h3>Our Vision</h3>
            {openAccordion === "vision" && (
              <ul>
                <li>To become India’s most trusted spiritual service platform.</li>
                <li>To spread awareness about Vedic rituals and Hindu traditions globally.</li>
              </ul>
            )}
          </div>

          {/* Our Mission */}
          <div className="about-card" onClick={() => toggleAccordion("mission")}>
            <h3>Our Mission</h3>
            {openAccordion === "mission" && (
              <div>
                <ul>
                  <li>Bringing Vedic rituals and traditions to every household.</li>
                  <li>Providing professional priests for all types of pujas and festivals.</li>
                </ul>

                <p><strong>Services Offered:</strong></p>
                <ol>
                  <li>All types of Shantis</li>
                  <li>All types of Yags</li>
                  <li>All types of Havan</li>
                  <li>All important festivals and rituals</li>
                  <li>Vastu/Navchandi</li>
                  <li>16 Sanskars Pujas </li>
                </ol>
              </div>
            )}
          </div>

          {/* Our Values */}
          <div className="about-card" onClick={() => toggleAccordion("values")}>
            <h3>Our Values</h3>
            {openAccordion === "values" && (
              <ul>
                <li>Faith, purity, authenticity, and devotion.</li>
                <li>Commitment to providing spiritual guidance with honesty and respect for traditions.</li>
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
