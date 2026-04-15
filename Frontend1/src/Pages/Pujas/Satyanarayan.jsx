import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const Satyanarayan = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* -------- YAJMAN SAMAGRI -------- */
  const yajmanSamagri = [
    { item: "Paat", qty: "1" },
    { item: "Taandul", qty: "2 kg" },
    { item: "Phule", qty: "As Required" },
    { item: "Halad-Kumkum", qty: "As Required" },
    { item: "Supari", qty: "21" },
    { item: "Panchamrut", qty: "1 Set" }
  ];

  /* -------- PANDIT SAMAGRI -------- */
const panditSamagri = [
  { item: "Halad, Kumkum, Gulal, Ashtagandh, Rangoli", qty: "As Required" },
  { item: "Phule, Tulsi, Phul Haar", qty: "As Required" },
  { item: "Kapoor, Agarbatti", qty: "As Required" },
  { item: "Supari", qty: "15" },
  { item: "Kharik", qty: "11" },
  { item: "Badam", qty: "11" },
  { item: "Halkund", qty: "11" },
  { item: "Khobare Vati", qty: "5" },
  { item: "Naral", qty: "2" },
  { item: "Panchrangi Nadi", qty: "1" },
  { item: "Blouse Piece", qty: "2" },
  { item: "5 Prakarche Phal", qty: "5" },
  { item: "Keli Khamba", qty: "5" },
  { item: "Vidyache Paan", qty: "25" },
  { item: "Gahu", qty: "1 Sher" },
  { item: "Taandul", qty: "1 Sher" },
  { item: "Dakshina", qty: "31 Rs" },
  { item: "Panchamrut", qty: "1 Set" },
  { item: "Satyanarayanacha Photo", qty: "1" },
  { item: "Gopal Krishna Murti", qty: "1" },
  { item: "Aasan", qty: "1" },

  // Prasadache Sahitya
  { item: "Rava", qty: "1.25 kg" },
  { item: "Tup", qty: "1.25 kg" },
  { item: "Sakhar", qty: "1.25 kg" },
  { item: "Dudh", qty: "2.5 Liter" },
  { item: "Kismis, Charoli", qty: "50 gm" },
  { item: "Vilaychi", qty: "50 gm" },
  { item: "Prasadasathi Kagadache Done", qty: "As Required" },

  // Gharche Sahitya
  { item: "Chaurang", qty: "1" },
  { item: "Paat", qty: "2" },
  { item: "Taambya", qty: "3" },
  { item: "Pali, Pela, Tamhana", qty: "1 Each" },
  { item: "Samai", qty: "1" },
  { item: "Niranjan", qty: "1" },
  { item: "Steel Vati", qty: "5" },
  { item: "Shankh, Ghanta, Ganpati", qty: "1 Each" },
  { item: "Tel va Tup (Samai/Niranjan sathi)", qty: "As Required" },
  { item: "Aangethi", qty: "1" },
  { item: "Topi, Uparne", qty: "1 Each" }
];

 const faqs = [
  { 
    q: "What is Satyanarayan Puja?", 
    a: "Satyanarayan Puja is a ritual dedicated to Lord Vishnu performed to seek blessings for prosperity and success."
  },
  { 
    q: "When is Satyanarayan Puja performed?", 
    a: "It is commonly performed on Purnima, during housewarming, marriage, or other auspicious occasions."
  },
  { 
    q: "Benefits of Satyanarayan Puja?", 
    a: "It brings happiness, removes obstacles, and ensures peace and prosperity in the family."
  }
];
  return (
    <>
      <PujaTemplate
        title="सत्यनारायण"
        description="Satyanarayan Puja is performed for prosperity and fulfillment of wishes."
        information="It is commonly performed on Purnima and special occasions."
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

export default Satyanarayan;