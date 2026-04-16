import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const Rudrabhishek = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* -------- YAJMAN SAMAGRI -------- */
  const yajmanSamagri = [
    { item: "Shivling / Shiv Photo", qty: "1" },
    { item: "Milk", qty: "1 litre" },
    { item: "Dahi", qty: "500 gm" },
    { item: "Honey", qty: "250 gm" },
    { item: "Ghee", qty: "250 gm" },
    { item: "Sugar", qty: "250 gm" },
    { item: "Bel Patra", qty: "As Required" },
    { item: "Phule", qty: "As Required" },
    { item: "Naral", qty: "2" }
  ];

  /* -------- PANDIT SAMAGRI -------- */
  const panditSamagri = [
    { item: "Rudra Path Book", qty: "1" },
    { item: "Kalash", qty: "1" },
    { item: "Panchamrut Setup", qty: "1 Set" },
    { item: "Havan Samagri", qty: "1 Set" },
    { item: "Samidha", qty: "1 Bundle" },
    { item: "Kapoor & Agarbatti", qty: "As Required" },
    { item: "Bhasma", qty: "As Required" },
    { item: "Dakshina", qty: "As Per Shraddha" }
  ];

const faqs = [
  { 
    q: "What is Rudrabhishek?", 
    a: "Rudrabhishek is a powerful ritual dedicated to Lord Shiva involving sacred Abhishek with milk, water, and mantras."
  },
  { 
    q: "When is Rudrabhishek performed?", 
    a: "It is commonly performed during Shravan month, Mondays, or Mahashivratri."
  },
  { 
    q: "Benefits of Rudrabhishek?", 
    a: "It removes negativity, brings peace, improves health, and fulfills wishes."
  }
];

  return (
    <>
      <PujaTemplate
        title="रुद्राभिषेक"
        description="Rudrabhishek is a powerful ritual dedicated to Lord Shiva."
        information="It involves Abhishek of Shivling with milk, water and Panchamrut while chanting Rudra mantras."
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

export default Rudrabhishek;