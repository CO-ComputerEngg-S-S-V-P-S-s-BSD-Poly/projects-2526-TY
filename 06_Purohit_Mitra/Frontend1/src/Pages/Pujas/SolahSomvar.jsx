import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const SolahSomvar = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* -------- YAJMAN SAMAGRI -------- */
  const yajmanSamagri = [
    { item: "Shivling / Shiv Photo", qty: "1" },
    { item: "Milk", qty: "1 litre" },
    { item: "Bel Patra", qty: "As Required" },
    { item: "White Flowers", qty: "As Required" },
    { item: "Naral", qty: "1" },
    { item: "Panchamrut", qty: "1 Set" },
    { item: "Halad-Kumkum", qty: "As Required" }
  ];

  /* -------- PANDIT SAMAGRI -------- */
  const panditSamagri = [
    { item: "Solah Somvar Vrat Katha Book", qty: "1" },
    { item: "Kalash", qty: "1" },
    { item: "Kapoor & Agarbatti", qty: "As Required" },
    { item: "Havan Samagri", qty: "1 Set" },
    { item: "Samidha", qty: "1 Bundle" },
    { item: "Bhasma", qty: "As Required" },
    { item: "Dakshina", qty: "As Per Shraddha" }
  ];

const faqs = [
  { 
    q: "What is Solah Somvar Vrat Udyapan?", 
    a: "It is the concluding ritual performed after completing 16 Monday fasts dedicated to Lord Shiva."
  },
  { 
    q: "When is Solah Somvar Udyapan performed?", 
    a: "It is performed after successfully completing the 16 Somvar Vrats."
  },
  { 
    q: "Benefits of Solah Somvar Vrat?", 
    a: "It fulfills wishes related to marriage, health, and prosperity with Lord Shiva's blessings."
  }
];
  return (
    <>
      <PujaTemplate
        title="सोळा सोमवार व्रत उद्यापन"
        description="Solah Somvar Vrat is observed for 16 consecutive Mondays to seek Lord Shiva's blessings."
        information="Devotees perform Shiv Puja and listen to Solah Somvar Vrat Katha."
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

export default SolahSomvar;