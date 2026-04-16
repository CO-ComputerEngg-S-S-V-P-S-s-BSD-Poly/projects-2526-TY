import React, { useState } from "react";
import PujaTemplate from "../Pujas/PujaTemplate";
import "../AllHavan/NavagrahaHavan.css";   // path check kar

const NavchandiY = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* ---------- Yajman Samagri ---------- */
  const yajmanSamagri = [
    { item: "Fruits (5 Types)", qty: "5" },
    { item: "Flowers", qty: "As Required" },
    { item: "Coconut", qty: "5" },
    { item: "Red Cloth", qty: "1" },
    { item: "Kumkum & Haldi", qty: "100 gm Each" },
    { item: "Rice", qty: "1 Kg" },
    { item: "Betel Leaves & Nuts", qty: "As Required" }
  ];

  /* ---------- Pandit Samagri ---------- */
  const panditSamagri = [
    { item: "Havan Kund", qty: "1" },
    { item: "Samidha (Wood)", qty: "As Required" },
    { item: "Cow Ghee", qty: "2 Kg" },
    { item: "Chandi Path Book", qty: "1" },
    { item: "Kalash", qty: "2" },
    { item: "Chaurang", qty: "8" },
    { item: "Steel Plates", qty: "10" },
    { item: "Steel Bowls", qty: "10" }
  ];

  return (
    <>
      <PujaTemplate
        title="नवचंडी यज्ञ"
        description="नवचंडी यज्ञ देवी दुर्गेच्या कृपेसाठी आणि संपूर्ण कुटुंबाच्या कल्याणासाठी केला जातो."
        youtubeUrl="https://www.youtube.com/"
        information="हा यज्ञ चंडीपाठासह केला जातो आणि अडथळे दूर करून शांती, समृद्धी आणि शक्ती प्रदान करतो."

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

        faqs={[
          { q: "What is Navchandi Yag?", a: "It is a powerful ritual dedicated to Goddess Durga with Chandi Path." },
          { q: "When is it performed?", a: "During Navratri or special family occasions." },
          { q: "Benefits?", a: "Removes negativity, brings protection and prosperity." },
          { q: "How long does it take?", a: "It may take a full day depending on the procedure." }
        ]}
      />

      {/* ---------- Yajman Modal ---------- */}
      {showYajmanModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowYajmanModal(false)}>
              ✕
            </button>

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

      {/* ---------- Pandit Modal ---------- */}
      {showPanditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowPanditModal(false)}>
              ✕
            </button>

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

export default NavchandiY;