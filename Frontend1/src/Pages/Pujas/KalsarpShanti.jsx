import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const KalsarpShanti = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  const yajmanSamagri = [
    { item: "Paat", qty: "1" },
    { item: "Taandul", qty: "2 kg" },
    { item: "Phule", qty: "As Required" },
    { item: "Halad-Kumkum", qty: "As Required" },
    { item: "Supari", qty: "21" }
  ];

  const panditSamagri = [
    { item: "Kalsarp Shanti Samagri", qty: "1 Set" },
    { item: "Havan Kund", qty: "1" },
    { item: "Cow Ghee", qty: "1 Kg" },
    { item: "Naag-Nagin Murti", qty: "1 Pair" }
  ];

 const faqs = [
  { 
    q: "What is Kalsarp Shanti?", 
    a: "Kalsarp Shanti is a ritual performed to reduce the negative effects of Kalsarp Dosha in a horoscope."
  },
  { 
    q: "When is Kalsarp Shanti performed?", 
    a: "It is performed when a person has Kalsarp Dosha in their birth chart or faces continuous obstacles in life."
  },
  { 
    q: "Benefits of Kalsarp Shanti?", 
    a: "It removes obstacles, improves career and marriage prospects, and brings stability and peace."
  }
];

  return (
    <>
      <PujaTemplate
        title="कालसर्प शांती"
        description="Kalsarp Shanti is performed to reduce effects of Kalsarp Dosha."
        information="This ritual removes planetary imbalance caused by Rahu-Ketu alignment."
        faqs={faqs}
        panditSamagri={<span className="click-link" onClick={() => setShowPanditModal(true)}>Click Here to View Pandit Samagri</span>}
        yajmanSamagri={<span className="click-link" onClick={() => setShowYajmanModal(true)}>Click Here to View Yajman Samagri</span>}
      />

      {showYajmanModal && <ModalTable title="Yajman Samagri" data={yajmanSamagri} close={setShowYajmanModal}/>}
      {showPanditModal && <ModalTable title="Pandit Samagri" data={panditSamagri} close={setShowPanditModal}/>}
    </>
  );
};

/* 🔥 ADD THIS BELOW */
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

export default KalsarpShanti;