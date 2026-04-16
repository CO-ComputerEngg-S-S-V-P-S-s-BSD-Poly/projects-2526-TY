import React, { useState } from "react";
import "./YagTemplate.css";
import {FaInfoCircle } from "react-icons/fa";
import { GiFireBowl } from "react-icons/gi";
import { MdTempleHindu } from "react-icons/md";

const YagTemplate = ({
  title,
  description,
  youtubeUrl,
  information,
  panditSamagri,
  yajmanSamagri,
  faqs
}) => {

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="yag-container">

      <h1 className="yag-heading">{title}</h1>

      <p className="yag-description">{description}</p>

      {/* 3 Info Cards */}
      <div className="yag-info-grid">

        <div className="yag-info-card">
          <FaInfoCircle className="info-icon" />
          <h3>Information</h3>
          <p>{information}</p>
        </div>

        <div className="yag-info-card">
          <MdTempleHindu className="info-icon" />
          <h3>Pandit Samagri</h3>
          <p>{panditSamagri}</p>
        </div>

        <div className="yag-info-card">
          <GiFireBowl className="info-icon" />
          <h3>Yajman Samagri</h3>
          <p>{yajmanSamagri}</p>
        </div>

      </div>

      {/* FAQ */}
      <h2 className="faq-title">FAQ's</h2>

      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div
              className="faq-question"
              onClick={() => toggleFAQ(index)}
            >
              {faq.q}
            </div>
            {activeIndex === index && (
              <div className="faq-answer">{faq.a}</div>
            )}
          </div>
        ))}
      </div>

      <button className="book-btn">Book Pandit Ji</button>

    </div>
  );
};

export default YagTemplate;