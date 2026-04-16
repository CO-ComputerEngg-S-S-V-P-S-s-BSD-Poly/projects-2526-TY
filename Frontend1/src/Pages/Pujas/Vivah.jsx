import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const Vivah = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* -------- YAJMAN SAMAGRI -------- */
  const yajmanSamagri = [
    { item: "Mangalashtak Book", qty: "1" },
    { item: "Garlands (Varmala)", qty: "2" },
    { item: "Halad-Kumkum", qty: "As Required" },
    { item: "Akshata (Taandul)", qty: "2 kg" },
    { item: "Naral", qty: "5" },
    { item: "5 Types Fruits", qty: "5" },
    { item: "Panchamrut", qty: "1 Set" },
    { item: "Saree & Dhoti", qty: "1 Each" }
  ];

  /* -------- PANDIT SAMAGRI -------- */
const panditSamagri = [
  // --- पूजा आणि विधी साहित्य (Puja & Ritual Materials) ---
  { item: "Halad, Kumkum, Gulal", qty: "As Required" },
  { item: "Ashtagandh", qty: "As Required" },
  { item: "Phule, Kapur, Agarbatti", qty: "As Required" },
  { item: "Supari (Betel Nut)", qty: "21" },
  { item: "Kharik (Dry Dates)", qty: "21" },
  { item: "Khobare Vati (Dry Coconut Halves)", qty: "4" },
  { item: "Naral (Coconut)", qty: "2" },
  { item: "Vidyache Paan (Betel Leaves)", qty: "25" },
  { item: "Gahu (Wheat)", qty: "1 Sher" },
  { item: "Taandul (Rice)", qty: "1 Sher" },
  { item: "Sutgundi", qty: "1 Nag" },
  { item: "Sutte Paise (Loose Cash)", qty: "51 Rs." },
  { item: "Blouse Piece", qty: "4 Nag" },
  { item: "Shankh, Ghanta, Ganpati", qty: "1 Each" },
  { item: "Shaal (Shawl)", qty: "1 Nag" },
  { item: "Havankund", qty: "1 Nag" },
  { item: "Mothe Phulhaar (Large Garlands)", qty: "2" },
  { item: "Chota Phulhaar (Small Garland)", qty: "1" },
  { item: "Phul Guchha (Bouquets)", qty: "3" },
  { item: "Sutte Phule (Loose Flowers)", qty: "As Required" },

  // --- होम आणि हवन साहित्य (Homa & Havan Materials) ---
  { item: "Gavari (Cow Dung Cakes)", qty: "10 Nag" },
  { item: "Homasathi Gaiche Tup (Cow Ghee for Homa)", qty: "0.5 kg" },
  { item: "Kapus, Phulvati (Cotton Wicks)", qty: "As Required" },
  { item: "Samidha Pude", qty: "2" },
  { item: "Hompude", qty: "2 Nag" },
  { item: "Niranjanisaathi Tup (Ghee for Lamp)", qty: "As Required" },
  { item: "Agpetti (Matchbox)", qty: "1" },
  { item: "Kali Mati (Black Soil)", qty: "1 Patibhar" },

  // --- भांडी आणि बैठक (Utensils & Seating) ---
  { item: "Paat", qty: "2 Nag" },
  { item: "Chaurang", qty: "1 Nag" },
  { item: "Tambyache Tambe (Copper Pots)", qty: "2" },
  { item: "Pali, Pela, Tamhan", qty: "As Required" },
  { item: "Niranjani", qty: "As Required" },
  { item: "Steel Taat (Steel Plates)", qty: "3" },
  { item: "Steel Vati (Steel Bowls)", qty: "5" },

  // --- कापड आणि इतर (Clothing & Misc) ---
  { item: "Topi, Uparne (Cap & Shoulder Cloth)", qty: "As Required" },
  { item: "Pede (Sweets)", qty: "0.25 kg" },
  { item: "Antarpata saathi Uparne", qty: "As Required" },
  { item: "Navin Bedsheet (New Bedsheet)", qty: "1" }
];

const faqs = [
  { 
    q: "What is Vivah Sanskar?", 
    a: "Vivah Sanskar is the sacred Hindu marriage ceremony that unites two individuals in a lifelong bond."
  },
  { 
    q: "How long does the Vivah ceremony take?", 
    a: "It usually takes 2 to 4 hours depending on traditions and rituals."
  },
  { 
    q: "Importance of Vivah Sanskar?", 
    a: "It establishes a spiritual and social bond between bride and groom with divine blessings."
  }
];

  return (
    <>
      <PujaTemplate
        title="विवाह"
        description="Vivah is a sacred Hindu marriage ceremony joining two souls together."
        information="It includes rituals like Kanyadaan, Mangalashtak, and Saptapadi."
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

export default Vivah;