import React, { useState } from "react";
import PujaTemplate from "../Pujas/PujaTemplate";
import "./NavagrahaHavan.css";   // Same common modal CSS

const MahamritunjayHavan = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* ---------------- Yajman Samagri ---------------- */
  const yajmanSamagri = [
    { item: "Fruits", qty: "2 Kg" },
    { item: "Flowers", qty: "As Required" },
    { item: "Coconut", qty: "2" },
    { item: "Bel Patra", qty: "21 Leaves" },
    { item: "Milk", qty: "1 Litre" },
    { item: "Honey", qty: "250 gm" },
    { item: "Rice", qty: "500 gm" },
    { item: "Kumkum & Turmeric", qty: "100 gm Each" }
  ];

  /* ---------------- Pandit Samagri ---------------- */
  const panditSamagri = [
    { item: "Havan Kund", qty: "1" },
    { item: "Samidha", qty: "Required" },
    { item: "Ghee", qty: "1 Kg" },
    { item: "Mahamritunjay Mantra Book", qty: "1" },
    { item: "Camphor", qty: "Required" },
    { item: "Incense Sticks", qty: "1 Packet" },
    { item: "Cotton Wicks", qty: "10" },
    { item: "Rudraksha Mala", qty: "1" }
  ];

  return (
    <>
      <PujaTemplate
        title="महा मृत्युंजय हवन"
        description="Mahamritunjay Havan is performed for health, protection and long life."
        youtubeUrl="https://www.youtube.com/"
        information="This havan is dedicated to Lord Shiva and removes negative energies."

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
          { q: "What is Mahamritunjay Havan?", a: "It is a sacred fire ritual dedicated to Lord Shiva." },
          { q: "Benefits?", a: "Improves health, removes fear and provides protection." }
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

export default MahamritunjayHavan;