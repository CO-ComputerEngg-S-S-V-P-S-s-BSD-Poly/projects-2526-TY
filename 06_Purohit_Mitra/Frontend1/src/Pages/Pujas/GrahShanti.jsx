import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const GrahShanti = () => {

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

  /* ----------- Pandit Samagri (Grah Shanti Specific) ----------- */
  const panditSamagri = [
    { item: "Havan Kund", qty: "1" },
    { item: "Navagraha Yantra", qty: "1 Set" },
    { item: "Samidha", qty: "As Required" },
    { item: "Cow Ghee", qty: "1 Kg" },
    { item: "Navagraha Samagri", qty: "1 Set" },
    { item: "Mantra Pustak", qty: "1" }
  ];

  const faqs = [
  { 
    q: "What is Grah Shanti?", 
    a: "Grah Shanti is a Vedic ritual performed to reduce the negative effects of planets in the horoscope."
  },
  { 
    q: "When is Grah Shanti performed?", 
    a: "It is performed during planetary dosha, before marriage, housewarming, or major life events."
  },
  { 
    q: "Benefits of Grah Shanti?", 
    a: "It brings peace, prosperity, removes obstacles, and strengthens weak planetary positions."
  }
];

  return (
    <>
      <PujaTemplate
        title="ग्रह शांती"
        description="Grah Shanti Puja is performed to reduce planetary doshas and bring peace and prosperity."
        information="This ritual balances planetary energies and removes negative effects from horoscope."
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

export default GrahShanti;