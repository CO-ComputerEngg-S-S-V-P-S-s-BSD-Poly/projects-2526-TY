import React, { useState } from "react";
import "./VedicPage.css";
import mandala from "../Assets/mandalaright-removebg-preview.png";
import rig from "../Assets/rigved.jpeg";
import yajur from "../Assets/yajurved1.jpeg";
import sama from "../Assets/samved.jpeg";
import atharva from "../Assets/atharvved.jpeg";

const vedicData = [
  {
    title: "Rigveda",
    desc: "Rigveda is the oldest Veda, containing hymns dedicated to deities like Agni, Indra and Varuna.",
    img: rig,
    more: `Rigveda (Sanskrit: ऋग्वेद, IAST: Ṛgveda, derived from ṛc meaning “praise” and veda meaning “knowledge”) is an ancient collection of Vedic Sanskrit hymns (sūktas). It is one of the four sacred canonical Hindu texts (śruti) known as the Vedas.

Among the many ancient branches (śākhās) of the Rigveda, only one has survived fully into modern times — the Śākalya Śākhā. Much of the content from the other branches has been lost or is no longer available.

The Rigveda is the oldest known Vedic Sanskrit text. Its earliest layers are among the oldest surviving texts in any Indo-European language. Scholars believe that its hymns were preserved through a highly precise oral tradition using advanced memorization techniques from around the 2nd millennium BCE.

The Rigveda is a layered text consisting of:
• Samhita
• Brahmanas
• Aranyakas
• Upanishads

The Rigveda Samhita is the core part of the text. It contains 10 books (maṇḍalas), with 1,028 hymns (sūktas) and about 10,600 verses (ṛcs).`
  },
  {
    title: "Yajurveda",
    desc: "Yajurveda focuses on rituals and yajnas, guiding the correct performance of sacrifices.",
    img: yajur,
    more: `Yajurveda (Sanskrit: यजुर्वेद, IAST: Yajurveda, derived from yajus meaning “worship” and veda meaning “knowledge”) 
is the Veda mainly associated with prose mantras used in worship rituals.

It is an ancient Vedic Sanskrit text that contains ritual-offering formulas recited by priests while performing sacred actions, 
especially during yajña (fire sacrifices). The Yajurveda is one of the four Vedas and is considered an important scripture of Hinduism.

The exact period of its composition is not clearly known. However, scholars such as Michael Witzel estimate it to have been composed 
between 1200 BCE and 800 BCE.

The Yajurveda is broadly divided into two main traditions:
Krishna (Black) Yajurveda
Shukla (White) Yajurveda.`
  },
  {
    title: "Samaveda",
    desc: "Samaveda is the Veda of music and melodies, mainly sung during Vedic rituals.",
    img: sama,
    more: `Samaveda (Sanskrit: सामवेद, IAST: Sāmaveda, derived from sāman meaning “song” and veda meaning “knowledge”) is known as the Veda of melodies and chants.

It consists of 1,875 verses, most of which are taken from the Rigveda.

Two important Upanishads are embedded within the Samaveda:
• Chandogya Upanishad
• Kena Upanishad

The Samaveda laid the foundation for Indian classical music traditions.

In the Bhagavad Gita (Chapter 10, Verse 22), Lord Krishna states:
“Among the Vedas, I am the Samaveda.”`
  },
  {
    title: "Atharvaveda",
    desc: "Atharvaveda deals with daily life, health, peace, and spiritual practices.",
    img: atharva,
    more: `Atharvaveda (Sanskrit: अथर्ववेद, IAST: Atharvaveda) is often described as the “storehouse of knowledge for everyday life.”

It contains about 730 hymns and nearly 6,000 mantras, divided into 20 books.

Two main recensions have survived:
• Paippalāda
• Śaunakīya

It includes hymns related to healing, protection, marriage, funerals and royal rituals.

Important Upanishads:
• Mundaka Upanishad
• Mandukya Upanishad
• Prashna Upanishad`
  }
];

const VedicPage = () => {
  const [selectedVeda, setSelectedVeda] = useState(null);

  return (
<>
    <div className="vedic-container">
      <img src={mandala} alt="mandala" className="home-mandala-left" />
      <img src={mandala} alt="mandala" className="home-mandala" />

      <h1 className="vedic-title">Vedic Knowledge</h1>
      <p className="vedic-subtitle">
        Explore the divine wisdom of the four sacred Vedas.
      </p>

      <div className="vedic-grid">
        {vedicData.map((item, index) => (
          <div key={index} className="vedic-card">
            <div className="vedic-img-box">
              <img src={item.img} alt={item.title} />
            </div>
            <h2>{item.title}</h2>
            <p>{item.desc}</p>
            <button className="vedic-btn" onClick={() => setSelectedVeda(item)}>
              View More
            </button>
          </div>
        ))}
      </div>

      {selectedVeda && (
        <div className="vedic-modal-overlay">
          <div className="vedic-modal">
            <span className="vedic-close" onClick={() => setSelectedVeda(null)}>
              ✖
            </span>
            <img src={selectedVeda.img} alt={selectedVeda.title} />
            <h2>{selectedVeda.title}</h2>
            <p style={{ whiteSpace: "pre-line" }}>{selectedVeda.more}</p>
          </div>
        </div>
      )}
    </div>
</>
  );
};

export default VedicPage;