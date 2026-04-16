import React, { useState } from "react";
import PujaTemplate from "../Pujas/PujaTemplate";
import "./NavagrahaHavan.css";

const VastuShantiHavan = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* ---------- Yajman Samagri (Common) ---------- */
  const yajmanSamagri = [
    { item: "Fruits (5 Types)", qty: "5" },
    { item: "Flowers", qty: "As Required" },
    { item: "Coconut", qty: "2" },
    { item: "Milk", qty: "1 Litre" },
    { item: "Honey", qty: "250 gm" },
    { item: "Rice", qty: "500 gm" },
    { item: "Turmeric & Kumkum", qty: "100 gm Each" }
  ];

  /* ---------- Pandit Samagri (Laghu Rudra Same) ---------- */
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
      q: "What is Vastu Shanti Havan?",
      a: "Vastu Shanti Havan is a sacred ritual performed to remove Vastu dosha and bring positive energy into a home or office."
    },
    {
      q: "When should Vastu Shanti be performed?",
      a: "It is usually performed before entering a new house, after renovation, or when facing continuous problems."
    },
    {
      q: "What are the benefits?",
      a: "It brings peace, prosperity, removes negative energies, and ensures harmony in the family."
    },
    {
      q: "How long does the ritual take?",
      a: "The ritual generally takes 2 to 4 hours depending on the procedure."
    }
  ];

  return (
    <>
      <PujaTemplate
        title="वास्तु शांती हवन"
        description="Vastu Shanti Havan is performed to purify and energize a new home or workspace."
        youtubeUrl="https://www.youtube.com/"
        information="This ritual removes negative energies and ensures peace, prosperity, and positive vibrations in the space."
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

      {/* ---------- Yajman Modal ---------- */}
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

      {/* ---------- Pandit Modal ---------- */}
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

export default VastuShantiHavan;