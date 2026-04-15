import React, { useState } from "react";
import PujaTemplate from "../Pujas/PujaTemplate";
import "./NavagrahaHavan.css";

const ShatChandiHavan = () => {

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
      q: "What is Shat Chandi Havan?",
      a: "Shat Chandi Havan is a powerful ritual dedicated to Goddess Durga for protection and prosperity."
    },
    {
      q: "What are the benefits?",
      a: "It removes obstacles, protects from negativity and brings divine blessings."
    },
    {
      q: "When should it be performed?",
      a: "It is ideal during Navratri or for major life events and spiritual upliftment."
    },
    {
      q: "How long does the ritual take?",
      a: "Depending on the procedure, it may take several hours or a full day."
    }
  ];

  return (
    <>
      <PujaTemplate
        title="शतचंडी हवन"
        description="Shat Chandi Havan is performed to invoke Goddess Durga for divine protection and success."
        youtubeUrl="https://www.youtube.com/"
        information="This ritual includes sacred chanting and offerings to seek blessings of Goddess Chandi."
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

export default ShatChandiHavan;