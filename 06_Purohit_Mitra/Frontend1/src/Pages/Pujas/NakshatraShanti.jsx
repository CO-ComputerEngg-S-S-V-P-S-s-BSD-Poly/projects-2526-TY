import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const NakshatraShanti = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* ----------- CONSTANT YAJMAN SAMAGRI ----------- */
  const yajmanSamagri = [
    { item: "Paat", qty: "1" },
    { item: "Vit Taandul", qty: "2 kg" },
    { item: "Vit Vati", qty: "6" },
    { item: "Vit Samai", qty: "2" },
    { item: "Lambache Taandul", qty: "2 kg" },
    { item: "Dev Taandul", qty: "2 kg" },
    { item: "Phule", qty: "As Required" },
    { item: "Niranjan (Aarti)", qty: "1" },
    { item: "Halad, Kumkum, Gulal", qty: "As Required" },
    { item: "Gahu, Jowar, Til", qty: "Each Small Quantity" },
    { item: "Panchamrut Sahitya", qty: "1 Set" },
    { item: "Ganpati, Shankh, Ghanti", qty: "1 Each" },
    { item: "Supari", qty: "21" },
    { item: "Kapoor, Agarbatti", qty: "As Required" },
    { item: "Tup (Ghee)", qty: "200 gm" },
    { item: "Naivedya", qty: "2 Types" }
  ];

  /* ----------- Pandit Samagri (Nakshatra Specific) ----------- */
  const panditSamagri = [
    { item: "Havan Kund", qty: "1" },
    { item: "Samidha", qty: "As Required" },
    { item: "Cow Ghee", qty: "1 Kg" },
    { item: "Navagraha Samagri", qty: "1 Set" },
    { item: "Mantra Pustak", qty: "1" }
  ];

const faqs = [
  { 
    q: "What is Nakshatra Shanti?", 
    a: "Nakshatra Shanti is a Vedic ritual performed to reduce negative effects of birth star (nakshatra) and planetary positions."
  },
  { 
    q: "When is it performed?", 
    a: "It is usually performed on birth star day, before important life events, or during dosha in horoscope."
  },
  { 
    q: "Benefits?", 
    a: "It brings peace, removes obstacles, improves health, and balances planetary influences."
  }
];

  return (
    <>
      <PujaTemplate
        title="नक्षत्र शांती"
        description="Nakshatra Shanti is performed to reduce negative planetary effects and bring peace."
        information="This ritual helps balance birth star doshas and ensures prosperity and harmony."
        faqs={faqs}

        panditSamagri={
          <span className="click-link" onClick={() => setShowPanditModal(true)}>
            Click Here to View Pandit Samagri
          </span>
        }

        yajmanSamagri={
          <span className="click-link" onClick={() => setShowYajmanModal(true)}>
            Click Here to View Yajman Samagri
          </span>
        }
      />

      {/* ----------- Yajman Modal ----------- */}
      {showYajmanModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowYajmanModal(false)}>✕</button>
            <h2>Yajman Samagri</h2>

            <table>
              <thead>
                <tr>
                  <th>Samagri</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {yajmanSamagri.map((data, index) => (
                  <tr key={index}>
                    <td>{data.item}</td>
                    <td>{data.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      )}

      {/* ----------- Pandit Modal ----------- */}
      {showPanditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowPanditModal(false)}>✕</button>
            <h2>Pandit Samagri</h2>

            <table>
              <thead>
                <tr>
                  <th>Samagri</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {panditSamagri.map((data, index) => (
                  <tr key={index}>
                    <td>{data.item}</td>
                    <td>{data.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      )}
    </>
  );
};

export default NakshatraShanti;