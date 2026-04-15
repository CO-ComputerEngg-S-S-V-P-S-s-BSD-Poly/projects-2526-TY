import React, { useState } from "react";
import "./HavanTemplate.css";

const HavanTemplate = ({
  title,
  description,
  youtubeUrl,
  information,
  panditSamagri,
  yajmanSamagri,
  faqs = []   // ✅ default empty array (IMPORTANT FIX)
}) => {

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="havan-detail-page">
      <div className="havan-detail-card">

        <h1 className="havan-detail-title">{title}</h1>

        <p className="havan-description">{description}</p>

        <div className="info-container">
          <div className="info-box">
            <h3>Information</h3>
            <p>{information}</p>
          </div>

          <div className="info-box">
            <h3>Pandit Samagri</h3>
            <p>{panditSamagri}</p>
          </div>

          <div className="info-box">
            <h3>Yajman Samagri</h3>
            <p>{yajmanSamagri}</p>
          </div>
        </div>

        {/* FAQ Section Only If Available */}
        {faqs.length > 0 && (
          <>
            <h2 className="faq-title">FAQ's</h2>

            {faqs.map((item, index) => (
              <div key={index} className="faq-item">
                <div
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  {item.q}
                </div>
                {openIndex === index && (
                  <div className="faq-answer">{item.a}</div>
                )}
              </div>
            ))}
          </>
        )}

        <button className="book-btn">Book Pandit Ji</button>

      </div>
    </div>
  );
};

export default HavanTemplate;