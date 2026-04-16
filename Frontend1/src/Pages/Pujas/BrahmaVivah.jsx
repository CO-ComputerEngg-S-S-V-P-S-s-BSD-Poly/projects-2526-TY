import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const BrahmVivaah = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* ----------- YAJMAN SAMAGRI ----------- */
  const yajmanSamagri = [
    { item: "Paat", qty: "2" },
    { item: "Taandul", qty: "2 kg" },
    { item: "Phule", qty: "As Required" },
    { item: "Halad-Kumkum", qty: "As Required" },
    { item: "Supari", qty: "21" },
    { item: "Tup (Ghee)", qty: "500 gm" }
  ];

  /* ----------- PANDIT SAMAGRI (From Image) ----------- */
  const panditSamagri = [
    { item: "Halad, Kumkum, Gulal", qty: "As Required" },
    { item: "Rangoli", qty: "As Required" },
    { item: "Kapoor Vati", qty: "1" },
    { item: "Agarbatti Puda", qty: "1" },
    { item: "Vidya Paan", qty: "50" },
    { item: "Supari", qty: "250 gm" },
    { item: "Kharik", qty: "25" },
    { item: "Badam", qty: "25" },
    { item: "Halkund", qty: "25" },
    { item: "Khobare Vati", qty: "7" },
    { item: "Naral", qty: "5" },
    { item: "Phule, Tulsi, Durva", qty: "As Required" },
    { item: "Sutra Gundi", qty: "2" },
    { item: "Janev Jod", qty: "5" },
    { item: "Phul Haar", qty: "5" },
    { item: "Guccha", qty: "5" },
    { item: "Gahu", qty: "2 Sher" },
    { item: "Taandul", qty: "2 Sher" },
    { item: "Madh Batli", qty: "1" },
    { item: "Anarasa", qty: "1" },
    { item: "Daal, Gohir, Panchamrut", qty: "1 Set" },
    { item: "Kapus, Phulvati", qty: "As Required" },
    { item: "Shankh, Ghanta, Ganpati", qty: "1 Each" },
    { item: "Salichya Laha", qty: "200 gm" },
    { item: "Chaurang", qty: "1" },
    { item: "Paat", qty: "2" },
    { item: "Pali, Pela, Tamhana, Taambe", qty: "2 Each" },
    { item: "Niranjan", qty: "1" },
    { item: "Mundavalya", qty: "1 Set" },
    { item: "Shawl, Uparne, Topi, Saale", qty: "1 Each" },
    { item: "Dakshina", qty: "100 Rs" },
    { item: "Navradev Pay Dhunyasathi Gangajal", qty: "1" },
    { item: "Astar Watali", qty: "1" },
    { item: "Oti Sahitya (Halad, Kunku, Kinkya)", qty: "1 Set" },
    { item: "Dahi & Bhaat (Owalnyasathi)", qty: "1" },
    { item: "Gai Che Tup", qty: "500 gm" },
    { item: "Gavri", qty: "10" },
    { item: "Samidha Pude", qty: "3" },
    { item: "Hom Pude", qty: "2" }
  ];

  const faqs = [
  { 
    q: "What is Bramh Vivah?", 
    a: "Bramh Vivah is a sacred Vedic marriage ceremony performed according to traditional Hindu rituals."
  },
  { 
    q: "When is Bramh Vivah performed?", 
    a: "It is performed on an auspicious muhurat chosen based on horoscope matching."
  },
  { 
    q: "Importance of Bramh Vivah?", 
    a: "It unites two families spiritually and socially and seeks divine blessings for a happy married life."
  }
];

  return (
    <>
      <PujaTemplate
        title="ब्राह्म विवाह"
        description="Brahm Vivaah is a sacred Vedic marriage ritual performed with full traditional procedures."
        information="It is conducted with Vedic mantras and homa for divine blessings."
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

      {showYajmanModal && (
        <ModalTable title="Yajman Samagri" data={yajmanSamagri} close={setShowYajmanModal}/>
      )}

      {showPanditModal && (
        <ModalTable title="Pandit Samagri" data={panditSamagri} close={setShowPanditModal}/>
      )}
    </>
  );
};

/* Modal Component */
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

export default BrahmVivaah;