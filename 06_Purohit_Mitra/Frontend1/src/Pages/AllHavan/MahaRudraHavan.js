import React, { useState } from "react";
import PujaTemplate from "../Pujas/PujaTemplate";
import "./NavagrahaHavan.css";

const MahaRudraHavan = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* ---------- Yajman Samagri ---------- */
  const yajmanSamagri = [
    { item: "Fruits (5 Types)", qty: "5" },
    { item: "Flowers", qty: "As Required" },
    { item: "Coconut", qty: "2" },
    { item: "Milk", qty: "1 Litre" },
    { item: "Honey", qty: "250 gm" },
    { item: "Rice", qty: "500 gm" },
    { item: "Turmeric & Kumkum", qty: "100 gm Each" }
  ];

  /* ---------- Pandit Samagri ---------- */
  const panditSamagri = [
    { item: "Chaurang", qty: "5" },
    { item: "Paath", qty: "6" },
    { item: "Dev Murti", qty: "2" },
    { item: "Copper Plates", qty: "2" },
    { item: "Samai", qty: "2" },
    { item: "Niranjan", qty: "1" },
    { item: "Steel Plates", qty: "5" },
    { item: "Steel Bowls", qty: "6" },
    { item: "Cow Ghee", qty: "1 Kg" },
    { item: "Nagvel Leaves", qty: "50" }
  ];

  /* ---------- FAQ ---------- */
  const faqs = [
    {
      q: "What is Maha Rudra Havan?",
      a: "Maha Rudra Havan is an advanced Shiva ritual performed with powerful Rudra chanting for spiritual upliftment."
    },
    {
      q: "What are the benefits of Maha Rudra Havan?",
      a: "It removes negativity, improves health, brings prosperity, and provides divine protection."
    },
    {
      q: "How long does the ritual take?",
      a: "Usually it takes several hours depending on the number of priests and chanting rounds."
    },
    {
      q: "When should Maha Rudra Havan be performed?",
      a: "It is ideal during Shravan month, Mahashivratri, or for special spiritual purposes."
    }
  ];

  return (
    <>
      <PujaTemplate
        title="महा रुद्र हवन"
        description="Maha Rudra Havan is a powerful ritual dedicated to Lord Shiva for divine blessings."
        youtubeUrl="https://www.youtube.com/"
        information="This havan involves extensive Rudra chanting for peace and prosperity."
        faqs={faqs}

        panditSamagri={
          <span
            className="click-link"
            onClick={() => setShowPanditModal(true)}
          >
            Click Here to View Pandit Samagri
          </span>
        }

        yajmanSamagri={
          <span
            className="click-link"
            onClick={() => setShowYajmanModal(true)}
          >
            Click Here to View Yajman Samagri
          </span>
        }
      />

      {/* ---------------- Yajman Modal ---------------- */}
      {showYajmanModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={() => setShowYajmanModal(false)}
            >
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

      {/* ---------------- Pandit Modal ---------------- */}
      {showPanditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={() => setShowPanditModal(false)}
            >
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

export default MahaRudraHavan;