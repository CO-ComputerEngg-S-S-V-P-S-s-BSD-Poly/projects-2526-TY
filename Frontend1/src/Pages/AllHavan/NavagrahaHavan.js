import React, { useState } from "react";
import PujaTemplate from "../Pujas/PujaTemplate";
import "./NavagrahaHavan.css";

const NavagrahaHavan = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* ---------------- Yajman Samagri ---------------- */
  const yajmanSamagri = [
    { item: "Red Cloth", qty: "1" },
    { item: "White Cloth", qty: "2" },
    { item: "Coconut", qty: "2" },
    { item: "Betel Leaves", qty: "9" },
    { item: "Areca Nut", qty: "9" },
    { item: "Rice", qty: "1 Kg" },
    { item: "Fruits", qty: "2 Kg" }
  ];

  /* ---------------- Pandit Samagri (Photo Based) ---------------- */
  const panditSamagri = [
    { item: "Chaurang", qty: "5" },
    { item: "Paath", qty: "6" },
    { item: "Dev Murti", qty: "2" },
    { item: "Copper Plates", qty: "2" },
    { item: "Flowers", qty: "As Required" },
    { item: "Kumkum & Gulal", qty: "Required" },
    { item: "Samai", qty: "2" },
    { item: "Niranjan", qty: "1" },
    { item: "Camphor", qty: "Required" },
    { item: "Tulsi", qty: "Required" },
    { item: "Durva", qty: "Required" },
    { item: "Milk", qty: "As Required" },
    { item: "Honey", qty: "As Required" }
  ];

  return (
    <>
      <PujaTemplate
        title="नवग्रह हवन"
        description="Navagraha Havan is performed to reduce planetary doshas."
        youtubeUrl="https://www.youtube.com/"
        information="This havan balances nine planetary energies."

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
          { q: "What is Navagraha Havan?", a: "It balances planetary energies." },
          { q: "Benefits?", a: "Peace and prosperity." }
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

export default NavagrahaHavan;