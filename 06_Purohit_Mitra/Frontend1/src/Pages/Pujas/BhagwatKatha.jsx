import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const BhagwatKatha = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* -------- YAJMAN SAMAGRI -------- */
  const yajmanSamagri = [
    { item: "Paat", qty: "1" },
    { item: "Taandul", qty: "5 kg" },
    { item: "Phule & Haar", qty: "As Required" },
    { item: "Halad-Kumkum", qty: "As Required" },
    { item: "Supari", qty: "51" },
    { item: "Panchamrut", qty: "1 Set" },
    { item: "Naral", qty: "11" },
    { item: "Tup (Ghee)", qty: "1 kg" }
  ];

  /* -------- PANDIT SAMAGRI -------- */
  const panditSamagri = [
    { item: "Shrimad Bhagwat Granth", qty: "1" },
    { item: "Vyas Peeth Setup", qty: "1 Set" },
    { item: "Sound System", qty: "1 Set" },
    { item: "Phule Decoration", qty: "As Required" },
    { item: "Kalash", qty: "1" },
    { item: "Tulsi Patra", qty: "As Required" },
    { item: "Kapoor & Agarbatti", qty: "As Required" },
    { item: "Havan Samagri", qty: "1 Set" },
    { item: "Samidha", qty: "1 Bundle" },
    { item: "Dakshina", qty: "As Per Shraddha" }
  ];

 const faqs = [
  { 
    q: "What is Bhagavat Katha?", 
    a: "Bhagavat Katha is the recitation and explanation of Shrimad Bhagavatam dedicated to Lord Krishna."
  },
  { 
    q: "When is Bhagavat Katha performed?", 
    a: "It is usually organized for 7 days (Saptah) during auspicious occasions or for spiritual upliftment."
  },
  { 
    q: "Benefits of Bhagavat Katha?", 
    a: "It brings peace, devotion, spiritual growth, and divine blessings to the family."
  }
];

  return (
    <>
      <PujaTemplate
        title="संगीतमय भागवत कथा"
        description="Sangitmay Bhagwat Katha is a devotional storytelling of Shrimad Bhagwat with music."
        information="It is usually performed for 7 days (Saptah) for spiritual upliftment."
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

export default BhagwatKatha;