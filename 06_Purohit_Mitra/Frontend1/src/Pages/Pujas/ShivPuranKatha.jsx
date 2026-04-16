import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const ShivPuranKatha = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* -------- YAJMAN SAMAGRI -------- */
  const yajmanSamagri = [
    { item: "Paat", qty: "1" },
    { item: "Taandul", qty: "5 kg" },
    { item: "Phule & Bel Patra", qty: "As Required" },
    { item: "Halad-Kumkum", qty: "As Required" },
    { item: "Supari", qty: "51" },
    { item: "Panchamrut", qty: "1 Set" },
    { item: "Naral", qty: "11" },
    { item: "Tup (Ghee)", qty: "1 kg" }
  ];

  /* -------- PANDIT SAMAGRI -------- */
  const panditSamagri = [
    { item: "Shiv Mahapuran Granth", qty: "1" },
    { item: "Shivling", qty: "1" },
    { item: "Bel Patra", qty: "As Required" },
    { item: "Dudh, Dahi, Madhu", qty: "For Abhishek" },
    { item: "Kapoor & Agarbatti", qty: "As Required" },
    { item: "Kalash", qty: "1" },
    { item: "Havan Samagri", qty: "1 Set" },
    { item: "Samidha", qty: "1 Bundle" },
    { item: "Shankh & Ghanta", qty: "1 Each" },
    { item: "Dakshina", qty: "As Per Shraddha" }
  ];

const faqs = [
  { 
    q: "What is Shiv Mahapuran Path?", 
    a: "Shiv Mahapuran Path is the recitation of the sacred Shiv Mahapuran dedicated to Lord Shiva."
  },
  { 
    q: "When is Shiv Mahapuran performed?", 
    a: "It is commonly performed during Shravan month, Mahashivratri, or for spiritual purification."
  },
  { 
    q: "Benefits of Shiv Mahapuran Path?", 
    a: "It removes negativity, grants peace, strengthens faith, and brings blessings of Lord Shiva."
  }
];
  return (
    <>
      <PujaTemplate
        title="शिवमहापुराण कथा"
        description="Shiv Mahapuran Katha is the sacred narration of Lord Shiva's divine stories."
        information="It is performed for peace, health and spiritual blessings."
        faqs={faqs}
        panditSamagri={<span className="click-link" onClick={() => setShowPanditModal(true)}>Click Here to View Pandit Samagri</span>}
        yajmanSamagri={<span className="click-link" onClick={() => setShowYajmanModal(true)}>Click Here to View Yajman Samagri</span>}
      />

      {showYajmanModal && <ModalTable title="Yajman Samagri" data={yajmanSamagri} close={setShowYajmanModal}/>}
      {showPanditModal && <ModalTable title="Pandit Samagri" data={panditSamagri} close={setShowPanditModal}/>}
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

export default ShivPuranKatha;