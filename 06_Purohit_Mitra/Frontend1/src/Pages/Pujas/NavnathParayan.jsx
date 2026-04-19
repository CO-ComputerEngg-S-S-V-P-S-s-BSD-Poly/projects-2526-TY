import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const NavnathParayan = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  const yajmanSamagri = [
    { item: "Paat", qty: "1" },
    { item: "Vit Taandul", qty: "2 kg" },
    { item: "Vit Vati", qty: "6" },
    { item: "Vit Samai", qty: "2" },
    { item: "Lambache Taandul", qty: "2 kg" },
    { item: "Dev Taandul", qty: "2 kg" },
    { item: "Phule", qty: "As Required" },
    { item: "Niranjan (Aarti)", qty: "1" },
    { item: "Halad, Kumkum, Gulal", qty: "As Required" },
    { item: "Gahu, Jowar, Til", qty: "Each Small Quantity" },
    { item: "Panchamrut Sahitya", qty: "1 Set" },
    { item: "Ganpati, Shankh, Ghanti", qty: "1 Each" },
    { item: "Supari", qty: "21" },
    { item: "Kapoor, Agarbatti", qty: "As Required" },
    { item: "Tup (Ghee)", qty: "200 gm" },
    { item: "Naivedya", qty: "2 Types" }
  ];

  const panditSamagri = [
    { item: "Navnath Granth", qty: "1" },
    { item: "Havan Kund", qty: "1" },
    { item: "Samidha", qty: "As Required" },
    { item: "Cow Ghee", qty: "1 Kg" }
  ];

 const faqs = [
  { 
    q: "What is Navnath Parayan?", 
    a: "Navnath Parayan is the recitation of Navnath Bhaktisar dedicated to the nine Nath saints."
  },
  { 
    q: "When is Navnath Parayan performed?", 
    a: "It is usually performed for spiritual growth, during difficult times, or for fulfillment of wishes."
  },
  { 
    q: "Benefits of Navnath Parayan?", 
    a: "It removes obstacles, gives mental peace, spiritual strength, and divine blessings."
  }
];
  return (
    <>
      <PujaTemplate
        title="नवनाथ पारायण"
        description="Navnath Parayan is performed for spiritual growth and divine blessings."
        information="Sacred recitation of Navnath Granth for protection and prosperity."
        faqs={faqs}
        panditSamagri={
          <span className="click-link" onClick={() => setShowPanditModal(true)}>Click Here to View Pandit Samagri</span>
        }
        yajmanSamagri={
          <span className="click-link" onClick={() => setShowYajmanModal(true)}>Click Here to View Yajman Samagri</span>
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

const ModalTable = ({ title, data, close }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <button className="close-btn" onClick={() => close(false)}>✕</button>
      <h2>{title}</h2>
      <table>
        <thead>
          <tr><th>Samagri</th><th>Quantity</th></tr>
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

export default NavnathParayan;