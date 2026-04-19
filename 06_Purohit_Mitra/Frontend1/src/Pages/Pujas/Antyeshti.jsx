import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const Antyeshti = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditTypeModal, setShowPanditTypeModal] = useState(false);
  const [showPandit11Modal, setShowPandit11Modal] = useState(false);
  const [showPandit12Modal, setShowPandit12Modal] = useState(false);

  /* -------- YAJMAN SAMAGRI -------- */
  const yajmanSamagri = [
    { item: "White Cloth", qty: "2" },
    { item: "Taandul", qty: "2 kg" },
    { item: "Phule", qty: "As Required" },
    { item: "Tulsi", qty: "As Required" },
    { item: "Gangajal", qty: "1 Bottle" },
    { item: "Naral", qty: "2" },
    { item: "Tup (Ghee)", qty: "500 gm" }
  ];

  /* -------- PANDIT SAMAGRI 11VI -------- */
  const pandit11Samagri = [
    { item: "Kusha (Darbha)", qty: "1 Bundle" },
    { item: "Til", qty: "500 gm" },
    { item: "Pind Daan Samagri", qty: "1 Set" },
    { item: "Havan Samagri", qty: "1 Set" },
    { item: "Samidha", qty: "1 Bundle" },
    { item: "Kapoor & Agarbatti", qty: "As Required" },
    { item: "Dakshina", qty: "As Per Shraddha" }
  ];

  /* -------- PANDIT SAMAGRI 12VI -------- */
  const pandit12Samagri = [
    { item: "Kusha (Darbha)", qty: "1 Bundle" },
    { item: "Til", qty: "500 gm" },
    { item: "Brahman Bhojan Samagri", qty: "As Required" },
    { item: "Pind Visarjan Samagri", qty: "1 Set" },
    { item: "Havan Samagri", qty: "1 Set" },
    { item: "Ghee", qty: "500 gm" },
    { item: "Dakshina", qty: "As Per Shraddha" }
  ];

const faqs = [
  { 
    q: "What is Antyeshti?", 
    a: "Antyeshti is the final Hindu ritual performed after a person's death for the peace of the departed soul."
  },
  { 
    q: "When are 11vi and 12vi rituals performed?", 
    a: "11vi and 12vi rituals are performed on the 11th and 12th day after death as part of post-funeral ceremonies."
  },
  { 
    q: "Importance of Antim Sanskar?", 
    a: "It helps the soul attain peace and liberation and provides spiritual closure to the family."
  }
];

  return (
    <>
      <PujaTemplate
        title="अंत्येष्टी"
        description="Antyeshti is the final rite performed for the departed soul."
        information="11vi and 12vi rituals are performed for peace of the soul."
        faqs={faqs}
        panditSamagri={
          <span 
            className="click-link" 
            onClick={() => setShowPanditTypeModal(true)}
          >
            Click Here to View Pandit Samagri
          </span>
        }
        yajmanSamagri={
          <span 
            className="click-link" 
            onClick={() => setShowYajmanModal(true)}
          >
            Click Here to View Yajman Samagri
          </span>
        }
      />

      {/* YAJMAN MODAL */}
      {showYajmanModal &&
        <ModalTable 
          title="Yajman Samagri" 
          data={yajmanSamagri} 
          close={setShowYajmanModal}
        />
      }

      {/* SELECT 11VI / 12VI MODAL */}
      {showPanditTypeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowPanditTypeModal(false)}>✕</button>
            <h2>Select Ceremony</h2>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button 
                style={{ margin: "10px", padding: "10px 20px" }}
                onClick={() => {
                  setShowPanditTypeModal(false);
                  setShowPandit11Modal(true);
                }}
              >
                11vi Samagri
              </button>

              <button 
                style={{ margin: "10px", padding: "10px 20px" }}
                onClick={() => {
                  setShowPanditTypeModal(false);
                  setShowPandit12Modal(true);
                }}
              >
                12vi Samagri
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11VI TABLE */}
      {showPandit11Modal &&
        <ModalTable 
          title="Pandit Samagri - 11vi" 
          data={pandit11Samagri} 
          close={setShowPandit11Modal}
        />
      }

      {/* 12VI TABLE */}
      {showPandit12Modal &&
        <ModalTable 
          title="Pandit Samagri - 12vi" 
          data={pandit12Samagri} 
          close={setShowPandit12Modal}
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

export default Antyeshti;