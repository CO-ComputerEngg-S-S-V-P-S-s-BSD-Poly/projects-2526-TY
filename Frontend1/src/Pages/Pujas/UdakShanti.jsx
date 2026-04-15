import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const UdakShanti = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* ----------- CONSTANT YAJMAN SAMAGRI ----------- */
  const yajmanSamagri = [
    { item: "Paat", qty: "1" },
    { item: "Taandul", qty: "2 kg" },
    { item: "Phule", qty: "As Required" },
    { item: "Halad-Kumkum", qty: "As Required" },
    { item: "Supari", qty: "21" },
    { item: "Tup (Ghee)", qty: "200 gm" }
  ];

  /* ----------- Pandit Samagri (From Image) ----------- */
  const panditSamagri = [
    { item: "Chaurang", qty: "1" },
    { item: "Paat", qty: "1" },
    { item: "Dev Taakhan", qty: "1" },
    { item: "Taambyache Taambe", qty: "1" },
    { item: "Pali & Pela", qty: "1 Each" },
    { item: "Halad, Kumkum, Gulal", qty: "As Required" },
    { item: "Akshata", qty: "As Required" },
    { item: "Samai & Niranjan", qty: "1 Each" },
    { item: "Steel Taat", qty: "4" },
    { item: "Steel Vaati", qty: "6" },
    { item: "Steel Patale", qty: "1" },
    { item: "Kapoor & Agarbatti", qty: "As Required" },
    { item: "Phule & Tulsi", qty: "As Required" },
    { item: "Bel & Durva", qty: "As Required" },
    { item: "5 Types Fruits", qty: "5" },
    { item: "Sakhar", qty: "1 kg" },
    { item: "Tur Dal, Harbhara Dal, Moong Dal, Til", qty: "Each 1 kg" },
    { item: "Bhagar, Sabudana, White Udid", qty: "Each 1 kg" },
    { item: "Panchamrut", qty: "1 Set" },
    { item: "Rangoli", qty: "As Required" },
    { item: "Samai Oil & Ghee", qty: "As Required" },
    { item: "Dakshina", qty: "51 Rs" },
    { item: "Shankh, Ghanta, Ganpati", qty: "1 Each" },
    { item: "Shen, Gomutra, Gavi", qty: "10 Each" },
    { item: "Kaali Mati", qty: "1 Plate" },
    { item: "Gai Che Tup", qty: "250 gm" },
    { item: "Gahu", qty: "1 Sher" },
    { item: "Taandul", qty: "1 Sher" },
    { item: "Nagvel Paan", qty: "50" }
  ];

const faqs = [
  { 
    q: "What is Udak Shanti?", 
    a: "Udak Shanti is a purification ritual performed using sacred water to bring peace and remove negative energies."
  },
  { 
    q: "When is Udak Shanti performed?", 
    a: "It is commonly performed before Grah Pravesh, marriage, or after major family events."
  },
  { 
    q: "Benefits of Udak Shanti?", 
    a: "It purifies the environment, removes negativity, and brings harmony and positive vibrations."
  }
];

  return (
    <>
      <PujaTemplate
        title="उदक शांती"
        description="Udak Shanti is performed for purification and removal of negative energies."
        information="This ritual is done for peace, prosperity and spiritual cleansing."
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

      {/* Yajman Modal */}
      {showYajmanModal && (
        <ModalTable title="Yajman Samagri" data={yajmanSamagri} close={setShowYajmanModal}/>
      )}

      {/* Pandit Modal */}
      {showPanditModal && (
        <ModalTable title="Pandit Samagri" data={panditSamagri} close={setShowPanditModal}/>
      )}
    </>
  );
};

/* Reusable Modal */
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

export default UdakShanti;