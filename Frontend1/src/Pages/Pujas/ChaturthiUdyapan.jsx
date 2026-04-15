import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const ChaturthiUdyapan = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* -------- YAJMAN SAMAGRI -------- */
  const yajmanSamagri = [
    { item: "Ganesh Murti/Photo", qty: "1" },
    { item: "Durva", qty: "As Required" },
    { item: "Modak / Naivedya", qty: "21" },
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
    { item: "Havan Kund", qty: "1" },
    { item: "Havan Samagri", qty: "1 Set" },
    { item: "Samidha", qty: "1 Bundle" },
    { item: "Kapoor & Agarbatti", qty: "As Required" },
    { item: "Red & Yellow Cloth", qty: "1 Each" },
    { item: "Dakshina", qty: "As Per Shraddha" }
  ];
const faqs = [
  { 
    q: "What is Chaturthi Udyapan?", 
    a: "Chaturthi Udyapan is the final ritual performed after completing a series of Sankashti or Ganesh Chaturthi fasts."
  },
  { 
    q: "When is Chaturthi Udyapan done?", 
    a: "It is performed after finishing the vowed number of Chaturthi fasts."
  },
  { 
    q: "Benefits of Chaturthi Vrat?", 
    a: "It removes obstacles, grants success, and brings blessings of Lord Ganesha."
  }
];
  return (
    <>
      <PujaTemplate
        title="चतुर्थी उद्यापन"
        description="Chaturthi Udyapan is performed after completion of Sankashti or Ganesh Vrat."
        information="Lord Ganesha is worshipped with special rituals and havan."
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

export default ChaturthiUdyapan;