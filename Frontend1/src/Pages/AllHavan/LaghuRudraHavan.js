import React, { useState } from "react";
import PujaTemplate from "../Pujas/PujaTemplate";
import "./NavagrahaHavan.css";

const LaghuRudraHavan = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* ---------------- Yajman Samagri ---------------- */
  const yajmanSamagri = [
    { item: "Fruits (5 Types)", qty: "5" },
    { item: "Flowers", qty: "As Required" },
    { item: "Coconut", qty: "2" },
    { item: "Bel Patra", qty: "21 Leaves" },
    { item: "Milk", qty: "1 Litre" },
    { item: "Honey", qty: "250 gm" },
    { item: "Rice", qty: "500 gm" },
    { item: "Turmeric & Kumkum", qty: "100 gm Each" }
  ];

  /* ---------------- Pandit Samagri (Photo Based) ---------------- */
  const panditSamagri = [
    { item: "Chaurang", qty: "5" },
    { item: "Paath", qty: "6" },
    { item: "Dev Murti", qty: "2" },
    { item: "Copper Plates", qty: "2" },
    { item: "Samai", qty: "2" },
    { item: "Niranjan", qty: "1" },
    { item: "Steel Plates", qty: "5" },
    { item: "Steel Bowls", qty: "6" },
    { item: "Steel Patela", qty: "3" },
    { item: "Camphor", qty: "Required" },
    { item: "Agarbatti", qty: "Required" },
    { item: "Tulsi", qty: "Required" },
    { item: "Bel & Durva", qty: "Required" },
    { item: "Cow Ghee", qty: "1 Kg" },
    { item: "Nagvel Leaves", qty: "50" },
    { item: "Rice", qty: "3 Sher" },
    { item: "Wheat", qty: "3 Sher" },
    { item: "Sugar", qty: "Half Kg" },
    { item: "Tur Dal / Moong Dal", qty: "Half Kg Each" }
  ];

  return (
    <>
      <PujaTemplate
        title="लघु रुद्र हवन"
        description="Laghu Rudra Havan is performed to seek blessings of Lord Shiva and remove negative energies."
        youtubeUrl="https://www.youtube.com/"
        information="This havan includes chanting of Rudra mantras for peace and prosperity."

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

        faqs={[
          { q: "What is Laghu Rudra Havan?", a: "It is a sacred Shiva ritual with Rudra chanting." },
          { q: "Benefits?", a: "Removes obstacles and brings peace and prosperity." }
        ]}
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

export default LaghuRudraHavan;