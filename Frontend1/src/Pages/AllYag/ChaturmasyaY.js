import React, { useState } from "react";
import PujaTemplate from "../Pujas/PujaTemplate";
import "../AllHavan/NavagrahaHavan.css";   // path check kar

const ChaturmasyaY = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* ---------- Yajman Samagri ---------- */
  const yajmanSamagri = [
    { item: "Fruits (5 Types)", qty: "5" },
    { item: "Flowers", qty: "As Required" },
    { item: "Coconut", qty: "2" },
    { item: "Milk", qty: "1 Litre" },
    { item: "Rice", qty: "500 gm" },
    { item: "Tulsi Leaves", qty: "As Required" }
  ];

  /* ---------- Pandit Samagri ---------- */
  const panditSamagri = [
    { item: "Havan Kund", qty: "1" },
    { item: "Samidha (Wood)", qty: "As Required" },
    { item: "Cow Ghee", qty: "1 Kg" },
    { item: "Kalash", qty: "1" },
    { item: "Chaurang", qty: "4" },
    { item: "Vedic Books", qty: "As Required" }
  ];

  return (
    <>
      <PujaTemplate
        title="चातुर्मास्य यज्ञ"
        description="चातुर्मास्य यज्ञ हा पवित्र चार महिन्यांत धर्मपालनासाठी केला जातो."
        youtubeUrl="https://youtu.be/tNOVUDg2RHg?si=K-USjQ0s2XImG46P"
        information="ही पूजा आध्यात्मिक साधना, संयम आणि भक्ती वाढवण्यासाठी केली जाते."

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
          { q: "What is Chaturmasya Yag?", a: "It is performed during the holy four-month period." },
          { q: "When is it done?", a: "From Ashadhi Ekadashi to Kartik Ekadashi." },
          { q: "Benefits?", a: "Increases spiritual discipline and devotion." },
          { q: "Who can perform it?", a: "Any devotee seeking spiritual growth." }
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

export default ChaturmasyaY;