import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const GurucharitraParayan = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  const yajmanSamagri = [
    { item: "Paat", qty: "1" },
    { item: "Taandul", qty: "2 kg" },
    { item: "Phule", qty: "As Required" },
    { item: "Supari", qty: "21" },
    { item: "Naivedya", qty: "2 Types" }
  ];

  const panditSamagri = [
    { item: "Shri Gurucharitra Granth", qty: "1" },
    { item: "Havan Kund", qty: "1" },
    { item: "Cow Ghee", qty: "1 Kg" }
  ];

const faqs = [
  { 
    q: "What is GuruCharitra Parayan?", 
    a: "GuruCharitra Parayan is the recitation of Shri GuruCharitra, dedicated to Shri Dattatreya and his incarnations."
  },
  { 
    q: "When is GuruCharitra Parayan performed?", 
    a: "It is commonly performed on Thursdays, during Datta Jayanti, or for spiritual growth and problem resolution."
  },
  { 
    q: "Benefits of GuruCharitra Parayan?", 
    a: "It brings peace, removes obstacles, improves spiritual strength, and fulfills wishes."
  }
];

  return (
    <>
      <PujaTemplate
        title="गुरुचरित्र पारायण"
        description="Gurucharitra Parayan is performed for blessings of Lord Dattatreya."
        information="Sacred reading of Gurucharitra for peace and prosperity."
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

export default GurucharitraParayan;