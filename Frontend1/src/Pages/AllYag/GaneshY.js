import React, { useState } from "react";
import PujaTemplate from "../Pujas/PujaTemplate";
import "../AllHavan/NavagrahaHavan.css"; // path check kar

const GaneshY = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* ---------- Yajman Samagri ---------- */
  const yajmanSamagri = [
    { item: "Fruits (5 Types)", qty: "5" },
    { item: "Flowers", qty: "As Required" },
    { item: "Coconut", qty: "2" },
    { item: "Modak", qty: "21" },
    { item: "Durva Grass", qty: "As Required" },
    { item: "Rice", qty: "500 gm" },
    { item: "Turmeric & Kumkum", qty: "100 gm Each" }
  ];

  /* ---------- Pandit Samagri ---------- */
  const panditSamagri = [
    { item: "Havan Kund", qty: "1" },
    { item: "Samidha", qty: "As Required" },
    { item: "Cow Ghee", qty: "1 Kg" },
    { item: "Ganesh Idol/Photo", qty: "1" },
    { item: "Copper Kalash", qty: "1" },
    { item: "Chaurang", qty: "5" },
    { item: "Steel Plates", qty: "5" },
    { item: "Steel Bowls", qty: "6" }
  ];

  return (
    <>
      <PujaTemplate
        title="गणेश यज्ञ"
        description="गणेश यज्ञ विघ्नहर्ता भगवान गणपतींच्या कृपेसाठी केला जातो."
        youtubeUrl="https://www.youtube.com/"
        information="हा यज्ञ अडथळे दूर करण्यासाठी आणि शुभ कार्याच्या प्रारंभी केला जातो."

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
          { q: "What is Ganesh Yag?", a: "It is performed to seek blessings of Lord Ganesha." },
          { q: "When is it performed?", a: "Before starting new work or during Ganesh Chaturthi." },
          { q: "Benefits?", a: "Removes obstacles and brings success and prosperity." }
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

export default GaneshY;