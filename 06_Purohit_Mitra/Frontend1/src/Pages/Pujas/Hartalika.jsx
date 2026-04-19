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
    q: "What is Hartalika Vrat?", 
    a: "Hartalika Vrat is observed by women to seek blessings of Goddess Parvati for a happy married life."
  },
  { 
    q: "When is Hartalika celebrated?", 
    a: "It is celebrated one day before Ganesh Chaturthi during the month of Bhadrapada."
  },
  { 
    q: "Benefits of Hartalika Puja?", 
    a: "It ensures marital happiness, long life of husband, and divine blessings."
  }
];

  return (
    <>
      <PujaTemplate
        title="हरतालिका"
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