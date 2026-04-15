import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const PitraPuja = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* -------- YAJMAN SAMAGRI -------- */
  const yajmanSamagri = [
    { item: "White Cloth", qty: "1" },
    { item: "Taandul", qty: "2 kg" },
    { item: "Til (Black Sesame)", qty: "500 gm" },
    { item: "Naral", qty: "1" },
    { item: "Phule", qty: "As Required" },
    { item: "Tulsi Patra", qty: "As Required" },
    { item: "Gangajal", qty: "1 Bottle" }
  ];

  /* -------- PANDIT SAMAGRI -------- */
 const panditSamagri = [
  { item: "Halad, Kumkum, Gulal, Ashtagandh", qty: "As Required" },
  { item: "Supari", qty: "50" },
  { item: "Badam", qty: "11" },
  { item: "Khobare Vati", qty: "2" },
  { item: "Naral", qty: "1" },
  { item: "Jav", qty: "100 gm" },
  { item: "Kaltil", qty: "100 gm" },
  { item: "Janev", qty: "50" },
  { item: "Chandan Goli", qty: "1" },
  { item: "Panchamrut Vati Bhar", qty: "1" },
  { item: "Gavri", qty: "5" },
  { item: "Kapoor, Agarbatti", qty: "As Required" },
  { item: "Phul Haar (Sutle Phule)", qty: "1" },
  { item: "Nagvel Paan", qty: "30" },
  { item: "Blouse Piece", qty: "2" },

  { item: "Gahu", qty: "1 Sher" },
  { item: "Taandul", qty: "2 Sher" },
  { item: "Taambyache Taambe", qty: "2" },
  { item: "Dev Tamhana", qty: "1" },
  { item: "Pali, Pela", qty: "1 Each" },
  { item: "Samai, Niranjan", qty: "1 Each" },
  { item: "Dakshina", qty: "51 Rs" },
  { item: "Steel Taat", qty: "3" },
  { item: "Fulvati, Lambvati", qty: "As Required" },
  { item: "Tel, Tup", qty: "As Required" },
  { item: "Fadke", qty: "10" },
  { item: "Dron", qty: "30" },
  { item: "Chaurang", qty: "1" },
  { item: "Paat", qty: "2" },
  { item: "Ganpati, Shankh, Ghanta, Gopal Krishna", qty: "1 Each" },
  { item: "Aasan", qty: "1" },

  // Pad Daan
  { item: "Kumbh Daan", qty: "1" },
  { item: "Taambyachi Nali Kalashi", qty: "1" },
  { item: "Deep Daan (Pital Samai)", qty: "1" },
  { item: "Chandi Chi Gay", qty: "1" },
  { item: "Vishnu Murti (Swarup Pratima)", qty: "1" },
  { item: "Chatra, Chappal, Kathi", qty: "1 Each" },
  { item: "Aasan (Daan Sathi)", qty: "1" },

  // Vastr Daan
  { item: "Sadi + Blouse Piece (Stri Sathi)", qty: "1 Set" },
  { item: "Towel, Topi, Uparne, Dhoti (Purush Sathi)", qty: "1 Set" },

  // Dhut Daan
  { item: "Gai Che Tup", qty: "500 gm" },

  // Samdhan Dhanya
  { item: "Tur Dal, Mug Dal, Harbhara Dal", qty: "1.25 kg Each" },
  { item: "Til, Udid Dal, Bhagar", qty: "1.25 kg Each" },
  { item: "Sabudana, Shengdane", qty: "1.25 kg Each" }
];

 const faqs = [
  { 
    q: "What is Pitrupujan?", 
    a: "Pitrupujan is a ritual performed to honor and seek blessings from ancestors."
  },
  { 
    q: "When is Pitrupujan performed?", 
    a: "It is usually performed during Pitru Paksha or on Amavasya."
  },
  { 
    q: "Benefits of Pitrupujan?", 
    a: "It removes ancestral dosha, brings peace to departed souls, and ensures family prosperity."
  }
];

  return (
    <>
      <PujaTemplate
        title="पितृपूजा"
        description="Pitru Puja is performed to honor and seek blessings of ancestors."
        information="It is usually done during Pitru Paksha for peace of departed souls."
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

export default PitraPuja;