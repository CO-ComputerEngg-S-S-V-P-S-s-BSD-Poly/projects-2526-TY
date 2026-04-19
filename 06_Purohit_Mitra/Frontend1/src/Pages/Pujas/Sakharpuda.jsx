import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const Sakharpuda = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* -------- YAJMAN SAMAGRI -------- */
  const yajmanSamagri = [
    { item: "Engagement Rings", qty: "2" },
    { item: "Naral", qty: "5" },
    { item: "Phule & Haar", qty: "As Required" },
    { item: "Halad-Kumkum", qty: "As Required" },
    { item: "Sakhar / Sweets", qty: "1 Box" },
    { item: "5 Types Fruits", qty: "5" },
    { item: "Panchamrut", qty: "1 Set" },
    { item: "Clothes for Bride & Groom", qty: "1 Each" }
  ];

  /* -------- PANDIT SAMAGRI -------- */
const panditSamagri = [
  // Puja Sahitya
  { item: "Halkund", qty: "11" },
  { item: "Supari", qty: "25" },
  { item: "Kharik", qty: "11" },
  { item: "Badam", qty: "11" },
  { item: "Khobare Vati", qty: "5" },
  { item: "Naral", qty: "3" },
  { item: "Nagvel Paan", qty: "30" },
  { item: "Gahu", qty: "1 kg" },
  { item: "Taandul", qty: "1 kg" },
  { item: "Gul", qty: "100 gm" },
  { item: "Dhane", qty: "50 gm" },
  { item: "Halad, Kumkum, Gulal, Bukka", qty: "As Required" },
  { item: "Ashtagandh, Shendur, Rangoli", qty: "As Required" },
  { item: "Agarbatti, Kapoor", qty: "As Required" },
  { item: "Sutali, Phule, Har", qty: "As Required" },
  { item: "Durva, Tulsi, Bel", qty: "As Required" },
  { item: "Panchamrut", qty: "1 Set" },
  { item: "Pede / Sakhar", qty: "As Required" },
  { item: "Vaticha Set (5 Vati)", qty: "1" },
  { item: "Blouse Piece (Lal/Kesari)", qty: "2" },

  // Gharghuti Sahitya
  { item: "Chaurang / Paat", qty: "1" },
  { item: "Taambyache Taambe", qty: "2" },
  { item: "Tamhana", qty: "2" },
  { item: "Pali, Pela", qty: "2 Sets" },
  { item: "Steel Taat", qty: "2" },
  { item: "Steel Vati", qty: "5" },
  { item: "Samai, Niranjan", qty: "1 Each" },
  { item: "Tel, Tup, Vat", qty: "As Required" },
  { item: "Aasan", qty: "2" },
  { item: "Hand Wash / Napkin", qty: "As Required" }
];

const faqs = [
  { 
    q: "What is Sakharpuda?", 
    a: "Sakharpuda is a traditional Maharashtrian engagement ceremony marking the formal commitment between bride and groom."
  },
  { 
    q: "When is Sakharpuda performed?", 
    a: "It is performed before marriage on an auspicious date decided by the families."
  },
  { 
    q: "Importance of Sakharpuda?", 
    a: "It officially announces the wedding alliance and strengthens family bonds."
  }
];

  return (
    <>
      <PujaTemplate
        title="साखरपुडा"
        description="Sakharpuda is the traditional Maharashtrian engagement ceremony."
        information="It marks the formal agreement and blessings before marriage."
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

      {showYajmanModal && 
        <ModalTable 
          title="Yajman Samagri" 
          data={yajmanSamagri} 
          close={setShowYajmanModal} 
        />
      }

      {showPanditModal && 
        <ModalTable 
          title="Pandit Samagri" 
          data={panditSamagri} 
          close={setShowPanditModal} 
        />
      }
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

export default Sakharpuda;