import React, { useState } from "react";
import PujaTemplate from "../Pujas/PujaTemplate";
import "../AllHavan/NavagrahaHavan.css";   // path check kar

const MahaYadnya = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* ---------- Yajman Samagri ---------- */
  const yajmanSamagri = [
    { item: "Fruits (5 Types)", qty: "5" },
    { item: "Flowers", qty: "As Required" },
    { item: "Coconut", qty: "5" },
    { item: "Milk", qty: "2 Litre" },
    { item: "Honey", qty: "500 gm" },
    { item: "Rice", qty: "1 Kg" },
    { item: "Dry Fruits", qty: "250 gm" },
    { item: "Turmeric & Kumkum", qty: "100 gm Each" }
  ];

  /* ---------- Pandit Samagri ---------- */
  const panditSamagri = [
    { item: "Havan Kund (Large)", qty: "1" },
    { item: "Samidha (Wood)", qty: "As Required" },
    { item: "Cow Ghee", qty: "2 Kg" },
    { item: "Sacred Kalash", qty: "2" },
    { item: "Chaurang", qty: "8" },
    { item: "Vedic Books", qty: "As Required" },
    { item: "Steel Plates", qty: "10" },
    { item: "Steel Bowls", qty: "10" },
    { item: "Cloth for Mandap", qty: "As Required" }
  ];

  return (
    <>
      <PujaTemplate
        title="महायज्ञ"
        description="महा यज्ञ हा मोठ्या प्रमाणावर केला जाणारा पवित्र वैदिक विधी आहे."
        youtubeUrl="https://www.youtube.com/"
        information="हा यज्ञ समाजकल्याण, शांती, आरोग्य आणि समृद्धीसाठी मोठ्या प्रमाणावर आयोजित केला जातो."

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
          { q: "What is Maha Yadnya?", a: "It is a large-scale Vedic ritual performed for universal peace and prosperity." },
          { q: "When is it performed?", a: "On special religious occasions or community events." },
          { q: "Benefits?", a: "Brings spiritual upliftment, removes negativity and promotes harmony." },
          { q: "How long does it take?", a: "It may take a full day or multiple days depending on scale." }
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

export default MahaYadnya;