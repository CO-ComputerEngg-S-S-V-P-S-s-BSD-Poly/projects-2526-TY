import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const GaneshSthapana = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* -------- YAJMAN SAMAGRI -------- */
  const yajmanSamagri = [
    { item: "Ganesh Murti", qty: "1" },
    { item: "Durva", qty: "21" },
    { item: "Modak", qty: "21" },
    { item: "Naral", qty: "2" },
    { item: "Halad-Kumkum", qty: "As Required" },
    { item: "Phule & Haar", qty: "As Required" },
    { item: "Panchamrut", qty: "1 Set" },
    { item: "5 Types Fruits", qty: "5" }
  ];

  /* -------- PANDIT SAMAGRI -------- */
  const panditSamagri = [
    { item: "Ganapati Atharvashirsha Book", qty: "1" },
    { item: "Kalash", qty: "1" },
    { item: "Red Cloth", qty: "1" },
    { item: "Havan Kund", qty: "1" },
    { item: "Havan Samagri", qty: "1 Set" },
    { item: "Samidha", qty: "1 Bundle" },
    { item: "Kapoor & Agarbatti", qty: "As Required" },
    { item: "Dakshina", qty: "As Per Shraddha" }
  ];

const faqs = [
  { 
    q: "What is Ganesh Sthapana?", 
    a: "Ganesh Sthapana is the ritual of installing Lord Ganesha idol at home or mandal during Ganesh Chaturthi."
  },
  { 
    q: "When is Ganesh Sthapana performed?", 
    a: "It is performed on Ganesh Chaturthi during the auspicious muhurat."
  },
  { 
    q: "Benefits of Ganesh Sthapana?", 
    a: "It removes obstacles, brings success, and fills the home with positivity."
  }
];

  return (
    <>
      <PujaTemplate
        title="गणेश स्थापना"
        description="Ganesh Sthapana marks the installation of Lord Ganesha idol."
        information="It is performed during Ganesh Chaturthi to invoke blessings of Lord Ganesha."
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

export default GaneshSthapana;