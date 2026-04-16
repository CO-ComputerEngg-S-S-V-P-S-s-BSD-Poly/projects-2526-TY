import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const Bhumipujan = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* -------- YAJMAN SAMAGRI -------- */
  const yajmanSamagri = [
    { item: "Naral", qty: "2" },
    { item: "5 Types Fruits", qty: "5" },
    { item: "Halad-Kumkum", qty: "As Required" },
    { item: "Taandul", qty: "2 kg" },
    { item: "Phule", qty: "As Required" },
    { item: "Brick (Vit)", qty: "5" },
    { item: "Milk", qty: "1 litre" },
    { item: "Panchamrut", qty: "1 Set" }
  ];

  /* -------- PANDIT SAMAGRI -------- */
  const panditSamagri = [
  { item: "Naral", qty: "3" },
  { item: "Khobare Vati", qty: "2" },
  { item: "Supari", qty: "11" },
  { item: "Badam", qty: "11" },
  { item: "Kharik", qty: "11" },
  { item: "Nagvel Paan", qty: "25" },
  { item: "Sutle Phule", qty: "As Required" },
  { item: "Dhane", qty: "50 gm" },
  { item: "Gul", qty: "50 gm" },
  { item: "Kapoor, Agarbatti", qty: "As Required" },
  { item: "Lal Blouse Piece", qty: "2" },
  { item: "Pede / Khadi Sakhar", qty: "As Required" },
  { item: "Halad, Kumkum, Gulal, Ashtagandh", qty: "As Required" },
  { item: "Gahu", qty: "1.25 kg" },
  { item: "Taandul", qty: "250 gm" },
  { item: "Phal", qty: "2" },
  { item: "Kulswamini Devi Tak / Photo", qty: "1" },

  // Gharghuti Sahitya
  { item: "Chaurang", qty: "1" },
  { item: "Paat", qty: "1" },
  { item: "Taambyache Taambe", qty: "2" },
  { item: "Dev Tamhana", qty: "1" },
  { item: "Pali, Pela", qty: "1 Each" },
  { item: "Steel Taat", qty: "3" },
  { item: "Steel Vati", qty: "6" },
  { item: "Samai", qty: "1" },
  { item: "Niranjan", qty: "1" },
  { item: "Fulvati, Lambvati", qty: "As Required" },
  { item: "Tel, Tup", qty: "As Required" },
  { item: "Panchamrut", qty: "1 Set" },
  { item: "Rangoli", qty: "As Required" },
  { item: "Aasan", qty: "1" },
  { item: "Tikham, Pavdi, Kudali", qty: "1 Each" },
  { item: "Ganpati, Shankh, Ghanta", qty: "1 Each" }
];

 const faqs = [
  { 
    q: "What is Bhumipujan?", 
    a: "Bhumipujan is a sacred ritual performed before starting construction to seek blessings from Mother Earth."
  },
  { 
    q: "When should Bhumipujan be performed?", 
    a: "It is performed before laying the foundation stone during an auspicious muhurat."
  },
  { 
    q: "Benefits of Bhumipujan?", 
    a: "It removes vastu dosha, ensures smooth construction, and brings prosperity."
  }
];

  return (
    <>
      <PujaTemplate
        title="भूमिपूजन"
        description="Bhumipujan is performed before starting construction of a new house or building."
        information="It is done to seek blessings of Mother Earth and remove obstacles."
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

export default Bhumipujan;