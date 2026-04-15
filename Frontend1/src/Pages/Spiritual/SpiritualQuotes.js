import React, { useState } from "react";
import "./SpiritualQuotes.css";
import mandala from "../../Assets/mandalaright-removebg-preview.png";

import vedic from "../../Assets/vedic.png";
import upanishad from "../../Assets/upanidhd.png";
import niti from "../../Assets/niti.png";
import yoga from "../../Assets/yoga.png";
import sp from "../../Assets/sp.jpeg";
import bhakti from "../../Assets/bhakti.jpeg"

const cards = [
  {
    title: "Vedic Wisdom",
    image: vedic,
    quotes: [
      { sa: "सत्यमेव जयते", en: "Truth alone triumphs." },
      { sa: "विद्या मुक्तये", en: "Knowledge leads to liberation." },
      { sa: "तपः शुद्धये", en: "Discipline purifies the soul." }
    ]
  },
  {
    title: "Upanishad",
    image: upanishad,
    quotes: [
      { sa: "यथा कामो भवति तथा भवति", en: "You are what your desire is." },
      { sa: "आत्मा नित्यः", en: "The soul is eternal." },
      { sa: "तमसो मा ज्योतिर्गमय", en: "From darkness, lead me to light." }
    ]
  },
  {
    title: "Niti",
    image: niti,
    quotes: [
      { sa: "सदाचारः श्रेष्ठः", en: "Right conduct brings peace." },
      { sa: "शीलं धनम्", en: "Character is true wealth." },
      { sa: "बुद्ध्या वशं कुरु", en: "Wisdom controls desire." }
    ]
  },
  {
    title: "Yoga",
    image: yoga,
    quotes: [
      { sa: "योगः चित्तवृत्ति निरोधः", en: "Yoga unites body and mind." },
      { sa: "प्राणो जीवनम्", en: "Breath is life." },
      { sa: "स्थैर्यम् सत्यं", en: "Stillness is truth." }
    ]
  },
  {
    title: "Spiritual",
    image: sp,
    quotes: [
      { sa: "शान्तिः अन्तः", en: "Peace begins within." },
      { sa: "त्यागेन मुक्तिः", en: "Detach and be free." },
      { sa: "सर्वे देवमयाः", en: "Divine lives in all." }
    ]
  },
  {
    title: "Bhakti",
    image: bhakti,
    quotes: [
      { sa: "भक्तिः प्रेम", en: "Devotion is pure love." },
      { sa: "शरणं निर्भयम्", en: "Surrender removes fear." },
      { sa: "कीर्तनं शुद्धिः", en: "Chanting cleanses heart." }
    ]
  }
];

const SpiritualCards = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const openSlider = (index) => {
    setActive(index);
    setQuoteIndex(0);
    setOpen(true);
  };

  const nextQuote = () => {
    setQuoteIndex((prev) =>
      prev === cards[active].quotes.length - 1 ? 0 : prev + 1
    );
  };

  const prevQuote = () => {
    setQuoteIndex((prev) =>
      prev === 0 ? cards[active].quotes.length - 1 : prev - 1
    );
  };

  return (
    <div className="spiritual-page">
      <img src={mandala} alt="mandala" className="mandala left" />
      <img src={mandala} alt="mandala" className="mandala right" />

      <div className="cards-grid">
        {cards.map((item, index) => (
          <div
            key={index}
            className="spiritual-card"
            onClick={() => openSlider(index)}
          >
            <img src={item.image} alt={item.title} />
            <div className="card-title">{item.title}</div>
          </div>
        ))}
      </div>

      {open && (
        <div className="slider-overlay">
          <div className="slider-box">
            <h2>{cards[active].title}</h2>

            <p className="sanskrit">
              {cards[active].quotes[quoteIndex].sa}
            </p>
            <p className="english">
              {cards[active].quotes[quoteIndex].en}
            </p>

            <div className="slider-buttons">
              <button onClick={prevQuote}>◀</button>
              <button onClick={nextQuote}>▶</button>
            </div>

            <button className="close-btn" onClick={() => setOpen(false)}>
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpiritualCards;
