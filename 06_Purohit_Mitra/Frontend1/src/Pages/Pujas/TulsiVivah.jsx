import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const TulsiVivah = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* -------- YAJMAN SAMAGRI -------- */
  const yajmanSamagri = [
    { item: "Tulsi Vrindavan Decoration", qty: "1" },
    { item: "Shaligram / Krishna Photo", qty: "1" },
    { item: "Naral", qty: "2" },
    { item: "Phule & Haar", qty: "As Required" },
    { item: "Halad-Kumkum", qty: "As Required" },
    { item: "Saree for Tulsi", qty: "1" },
    { item: "5 Types Fruits", qty: "5" },
    { item: "Panchamrut", qty: "1 Set" }
  ];

  /* -------- PANDIT SAMAGRI -------- */
  const panditSamagri = [
    { item: "Kalash", qty: "1" },
    { item: "Red & Yellow Cloth", qty: "1 Each" },
    { item: "Havan Kund", qty: "1" },
    { item: "Havan Samagri", qty: "1 Set" },
    { item: "Samidha", qty: "1 Bundle" },
    { item: "Kapoor & Agarbatti", qty: "As Required" },
    { item: "Mangalashtak Book", qty: "1" },
    { item: "Dakshina", qty: "As Per Shraddha" }
  ];

  const faqs = [
  { 
    q: "What is Tulsi Vivah?", 
    a: "Tulsi Vivah is a sacred ceremony symbolizing the marriage of Tulsi plant with Lord Vishnu (Shaligram)."
  },
  { 
    q: "When is Tulsi Vivah performed?", 
    a: "It is celebrated in the month of Kartik, usually on Prabodhini Ekadashi."
  },
  { 
    q: "Benefits of Tulsi Vivah?", 
    a: "It brings marital happiness, prosperity, and divine blessings to the household."
  }
];
  return (
    <>
      <PujaTemplate
        title="तुळशी विवाह"
        description="Tulsi Vivah marks the ceremonial marriage of Tulsi and Lord Vishnu."
        information="It is celebrated after Diwali and signifies the beginning of wedding season."
        faqs={faqs}
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
      />

      {showYajmanModal && <ModalTable title="Yajman Samagri" data={yajmanSamagri} close={setShowYajmanModal} />}
      {showPanditModal && <ModalTable title="Pandit Samagri" data={panditSamagri} close={setShowPanditModal} />}
    </>
  );
};

const ModalTable = ({ title, data, close }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <button className="close-btn" onClick={() => close(false)}>✕</button>
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>
            <th>Samagri</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.item}</td>
              <td>{item.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TulsiVivah;