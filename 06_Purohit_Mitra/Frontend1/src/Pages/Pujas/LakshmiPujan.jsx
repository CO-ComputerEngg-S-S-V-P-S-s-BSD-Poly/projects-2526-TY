import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const LakshmiPujan = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* -------- YAJMAN SAMAGRI -------- */
  const yajmanSamagri = [
    { item: "Lakshmi Murti/Photo", qty: "1" },
    { item: "Ganesh Murti/Photo", qty: "1" },
    { item: "Naral", qty: "2" },
    { item: "5 Types Fruits", qty: "5" },
    { item: "Halad-Kumkum", qty: "As Required" },
    { item: "Phule & Haar", qty: "As Required" },
    { item: "Taandul", qty: "2 kg" },
    { item: "Panchamrut", qty: "1 Set" }
  ];

  /* -------- PANDIT SAMAGRI -------- */
const panditSamagri = [
  // --- पूजा साहित्य (Puja Materials) ---
  { item: "Naral (Coconut)", qty: "2" },
  { item: "Khobare Vati (Dry Coconut Halves)", qty: "2" },
  { item: "Supari (Betel Nut)", qty: "11" },
  { item: "Kharik (Dry Dates)", qty: "11" },
  { item: "Badam (Almonds)", qty: "11" },
  { item: "Nagin Paan (Betel Leaves)", qty: "25" },
  { item: "Agarbatti Puda", qty: "1" },
  { item: "Kapoor Dabi", qty: "1" },
  { item: "Halad, Kumkum, Gulal", qty: "As Required" },
  { item: "Ashtagandh", qty: "As Required" },
  { item: "Kamal Kakadi (Lotus Seeds/Stems)", qty: "21" },
  { item: "Kersoni (Broom)", qty: "1" },
  { item: "Lakshmi (Murti/Coin)", qty: "1" },
  { item: "Vahi, Pen (Account Book & Pen)", qty: "1 Set" },
  { item: "Lahya Battase", qty: "As Required" },
  { item: "Blouse Piece", qty: "2" },
  { item: "Phulhaar, Suddi Phule (Garland & Flowers)", qty: "As Required" },
  { item: "Phala (Fruits)", qty: "5 Types" },
  { item: "Gul - Dhane (Jaggery & Coriander Seeds)", qty: "As Required" },
  { item: "Gahu (Wheat)", qty: "1.25 kg" },
  { item: "Taandul (Rice)", qty: "1.25 kg" },
  { item: "Panchamrut, Rangoli", qty: "As Required" },
  { item: "Sutte Paise (Loose Coins)", qty: "21 Rs." },

  // --- घरगुती साहित्य / भांडी (Household / Utensils) ---
  { item: "Chaurang", qty: "1" },
  { item: "Paat", qty: "1" },
  { item: "Dev Tamhan", qty: "2" },
  { item: "Tambe (Copper Pots)", qty: "3" },
  { item: "Pali - Pela", qty: "1 Set" },
  { item: "Niranjani", qty: "1" },
  { item: "Samai", qty: "2" },
  { item: "Phakha (Fan)", qty: "5" },
  { item: "Phulvati - Lambvati (Wicks)", qty: "As Required" },
  { item: "Tel, Tup, Agpetti (Oil, Ghee, Matches)", qty: "As Required" },
  { item: "Shankh, Ghanti, Ganpati", qty: "1 Each" },
  { item: "Kulaswamini Chi Murti Kinva Taak", qty: "1" },
  { item: "Basanyasathi Aasan (Seating Mat)", qty: "As Required" },
  { item: "Lakshmicha Kinva Devicha Photo", qty: "1" },
  { item: "Steel Taat (Steel Plates)", qty: "3" },
  { item: "Steel Vati (Steel Bowls)", qty: "6" },
  { item: "Chamche (Spoons)", qty: "2" }
];
const faqs = [
  { 
    q: "What is Lakshmi Pujan?", 
    a: "Lakshmi Pujan is the worship of Goddess Lakshmi for wealth, prosperity, and success."
  },
  { 
    q: "When is Lakshmi Pujan performed?", 
    a: "It is mainly performed during Diwali on Amavasya night."
  },
  { 
    q: "Benefits of Lakshmi Pujan?", 
    a: "It attracts financial growth, removes obstacles, and brings happiness and abundance."
  }
];

  return (
    <>
      <PujaTemplate
        title="लक्ष्मीपूजन"
        description="Lakshmi Pujan is performed during Diwali for wealth and prosperity."
        information="Goddess Lakshmi and Lord Ganesha are worshipped for success and fortune."
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

export default LakshmiPujan;