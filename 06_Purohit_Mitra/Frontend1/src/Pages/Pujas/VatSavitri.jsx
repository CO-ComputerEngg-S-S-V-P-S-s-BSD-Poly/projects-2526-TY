import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const Hartalika = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* -------- YAJMAN SAMAGRI -------- */
  const yajmanSamagri = [
    { item: "Paat", qty: "1" },
    { item: "Phule", qty: "As Required" },
    { item: "Halad-Kumkum", qty: "As Required" },
    { item: "Naral", qty: "2" },
    { item: "5 Types Fruits", qty: "5" },
    { item: "Panchamrut", qty: "1 Set" }
  ];

  /* -------- PANDIT SAMAGRI -------- */
  const panditSamagri = [
    { item: "Shiv-Parvati Murti", qty: "1 Set" },
    { item: "Bel Patra", qty: "As Required" },
    { item: "Phule & Haar", qty: "As Required" },
    { item: "Kapoor & Agarbatti", qty: "As Required" },
    { item: "Halad, Kumkum", qty: "As Required" },
    { item: "Kalash", qty: "1" },
    { item: "Dudh, Dahi, Madhu", qty: "For Abhishek" },
    { item: "Dakshina", qty: "As Per Shraddha" }
  ];
const faqs = [
  { 
    q: "What is Vat Savitri Vrat?", 
    a: "Vat Savitri Vrat is observed by married women for the long life and well-being of their husbands."
  },
  { 
    q: "When is Vat Savitri observed?", 
    a: "It is observed during the month of Jyeshtha by worshipping the Banyan (Vat) tree."
  },
  { 
    q: "Benefits of Vat Savitri Puja?", 
    a: "It brings marital happiness, prosperity, and blessings from Goddess Savitri."
  }
];

  return (
    <>
      <PujaTemplate
        title="वटसावित्री"
        description="Hartalika Puja is observed by women for marital happiness."
        information="It is dedicated to Goddess Parvati and Lord Shiva."
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

export default Hartalika;