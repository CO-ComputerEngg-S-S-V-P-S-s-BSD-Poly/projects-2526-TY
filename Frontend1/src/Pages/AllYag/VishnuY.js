import React, { useState } from "react";
import PujaTemplate from "../Pujas/PujaTemplate";
import "../AllHavan/NavagrahaHavan.css";   // path check kar

const VishnuY = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* ---------- Yajman Samagri ---------- */
  const yajmanSamagri = [
    { item: "Fruits (5 Types)", qty: "5" },
    { item: "Flowers", qty: "As Required" },
    { item: "Coconut", qty: "2" },
    { item: "Tulsi Leaves", qty: "As Required" },
    { item: "Milk", qty: "1 Litre" },
    { item: "Rice", qty: "500 gm" },
    { item: "Turmeric & Kumkum", qty: "100 gm Each" }
  ];

  /* ---------- Pandit Samagri ---------- */
  const panditSamagri = [
    { item: "Havan Kund", qty: "1" },
    { item: "Samidha", qty: "As Required" },
    { item: "Cow Ghee", qty: "1 Kg" },
    { item: "Vishnu Idol/Photo", qty: "1" },
    { item: "Copper Kalash", qty: "1" },
    { item: "Chaurang", qty: "5" },
    { item: "Steel Plates", qty: "5" },
    { item: "Steel Bowls", qty: "6" }
  ];

  return (
    <>
      <PujaTemplate
        title="विष्णु यज्ञ"
        description="विष्णु यज्ञ भगवान विष्णूंच्या कृपेसाठी आणि कुटुंबातील शांतीसाठी केला जातो."
        youtubeUrl="https://www.youtube.com/"
        information="हा यज्ञ घरातील सुख-समृद्धी, आरोग्य आणि आध्यात्मिक उन्नतीसाठी केला जातो."

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
          { q: "What is Vishnu Yag?", a: "It is a sacred ritual dedicated to Lord Vishnu." },
          { q: "When is it performed?", a: "On Ekadashi or special family occasions." },
          { q: "Benefits?", a: "Brings peace, prosperity and divine blessings." },
          { q: "How long does it take?", a: "Usually 2 to 4 hours depending on rituals." }
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

export default VishnuY;