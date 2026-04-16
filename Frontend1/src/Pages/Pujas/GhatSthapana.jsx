import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const Ghatsthapana = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* -------- YAJMAN SAMAGRI -------- */
  const yajmanSamagri = [
    { item: "Kalash (Copper/Steel)", qty: "1" },
    { item: "Naral", qty: "1" },
    { item: "Mango Leaves", qty: "5" },
    { item: "Taandul", qty: "2 kg" },
    { item: "Halad-Kumkum", qty: "As Required" },
    { item: "Phule", qty: "As Required" },
    { item: "Durva", qty: "As Required" }
  ];

  /* -------- PANDIT SAMAGRI -------- */
  const panditSamagri = [
    { item: "Mitti (Soil) for Jaware", qty: "1 Plate" },
    { item: "Jaware (Wheat/Barley)", qty: "500 gm" },
    { item: "Kalash Setup", qty: "1 Set" },
    { item: "Red Cloth", qty: "1" },
    { item: "Kapoor & Agarbatti", qty: "As Required" },
    { item: "Panchamrut", qty: "1 Set" },
    { item: "Durga Photo/Murti", qty: "1" },
    { item: "Dakshina", qty: "As Per Shraddha" }
  ];
const faqs = [
  {
    q: "What is Ghatsthapana?",
    a: "Ghatsthapana is the ritual of installing the sacred Kalash at the beginning of Navratri. It symbolizes the invocation of Goddess Durga and marks the start of the nine-day festival."
  },
  {
    q: "When is Ghatsthapana done?",
    a: "Ghatsthapana is performed on the first day of Navratri during the auspicious muhurat in the morning after sunrise."
  },
  {
    q: "Importance of Navratri Kalash Sthapana?",
    a: "Kalash Sthapana represents prosperity, power, and divine energy. It is believed that Goddess Durga resides in the Kalash during Navratri."
  }
];

  return (
    <>
      <PujaTemplate
        title="घटस्थापना"
        description="Ghatsthapana marks the beginning of Navratri festival."
        information="Kalash is established to invoke Goddess Durga during Navratri."
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

export default Ghatsthapana;