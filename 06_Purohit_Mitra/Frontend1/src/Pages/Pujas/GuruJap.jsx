import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const GuruJap = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* -------- YAJMAN SAMAGRI -------- */
  const yajmanSamagri = [
    { item: "Guru Photo / Murti", qty: "1" },
    { item: "Yellow Cloth", qty: "1" },
    { item: "Halad-Kumkum", qty: "As Required" },
    { item: "Phule (Yellow Preferred)", qty: "As Required" },
    { item: "Naral", qty: "1" },
    { item: "Bananas", qty: "12" },
    { item: "Panchamrut", qty: "1 Set" }
  ];

  /* -------- PANDIT SAMAGRI -------- */
  const panditSamagri = [
    { item: "Guru Mantra Jap Book", qty: "1" },
    { item: "Kalash", qty: "1" },
    { item: "Jap Mala", qty: "1" },
    { item: "Havan Samagri", qty: "1 Set" },
    { item: "Samidha", qty: "1 Bundle" },
    { item: "Kapoor & Agarbatti", qty: "As Required" },
    { item: "Chana Dal & Haldi", qty: "As Required" },
    { item: "Dakshina", qty: "As Per Shraddha" }
  ];

const faqs = [
  { 
    q: "What is Guru Jap?", 
    a: "Guru Jap is the chanting of sacred Guru mantras for spiritual growth and divine guidance."
  },
  { 
    q: "When should Guru Jap be performed?", 
    a: "It can be performed on Thursdays or during Guru Purnima for maximum benefits."
  },
  { 
    q: "Benefits of Guru Jap?", 
    a: "It strengthens wisdom, removes obstacles, and brings positivity and success."
  }
];

  return (
    <>
      <PujaTemplate
        title="गुरुजप"
        description="Guru Jap is performed to strengthen Jupiter (Guru) in horoscope."
        information="It helps in gaining wisdom, success, and removing obstacles."
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

export default GuruJap;