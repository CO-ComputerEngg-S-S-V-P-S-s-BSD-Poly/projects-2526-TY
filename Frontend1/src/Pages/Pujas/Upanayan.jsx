import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const Upanayan = () => {

  const [showYajmanModal, setShowYajmanModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);

  /* -------- YAJMAN SAMAGRI -------- */
  const yajmanSamagri = [
    { item: "Paat", qty: "2" },
    { item: "Taandul", qty: "2 kg" },
    { item: "Phule", qty: "As Required" },
    { item: "Halad-Kumkum", qty: "As Required" },
    { item: "Supari", qty: "21" },
    { item: "Tup (Ghee)", qty: "500 gm" }
  ];

  /* -------- PANDIT SAMAGRI -------- */
  const panditSamagri = [
  { item: "Ganpati, Shankh, Pati", qty: "1 Each" },
  { item: "Gai Che Tup", qty: "500 gm" },
  { item: "Panchamrut Sahitya", qty: "1 Set" },
  { item: "Kapoor, Agarbatti", qty: "As Required" },
  { item: "Janev Jod", qty: "10" },
  { item: "Dakshina", qty: "71 Rs" },
  { item: "Fadke", qty: "20" },
  { item: "Dron", qty: "50" },
  { item: "Gomutra, Shen", qty: "As Required" },
  { item: "Kapus", qty: "As Required" },
  { item: "Halad, Kumkum, Gulal, Abir", qty: "As Required" },
  { item: "Naral", qty: "4" },
  { item: "Khobare Vati", qty: "6" },
  { item: "Supari", qty: "250 gm" },
  { item: "Badam", qty: "250 gm" },
  { item: "Kharik", qty: "250 gm" },
  { item: "Pandhra Kapda", qty: "1.5 Meter" },
  { item: "Lal Blouse Piece", qty: "4" },
  { item: "Naveen Sohale", qty: "9" },
  { item: "Chandi Chi Gayatri Murti", qty: "1" },
  { item: "Sonecha Tar", qty: "As Required" },
  { item: "Kansachi Thali", qty: "1" },
  { item: "Taambe", qty: "8" },
  { item: "Dev Tamhana", qty: "8" },
  { item: "Vastr (Langot, Uparne, Topi)", qty: "1 Set" },
  { item: "Bhikshaval Sahitya", qty: "1 Set" },
  { item: "Chaurang", qty: "3" },
  { item: "Paat", qty: "2" },
  { item: "Pali", qty: "1" },
  { item: "Dev Taat", qty: "1" },
  { item: "Niranjan", qty: "1" },
  { item: "Samai", qty: "2" },
  { item: "Steel Taat", qty: "4" },
  { item: "Steel Vati", qty: "7" },
  { item: "Steel Chamche", qty: "2" },
  { item: "Havan Kund", qty: "1" },
  { item: "Aasan", qty: "1" },
  { item: "Nagvel Paan", qty: "30" },
  { item: "Suhe Phule", qty: "As Required" },
  { item: "Phul Haar", qty: "2" },
  { item: "Guccha", qty: "2" },
  { item: "Tel", qty: "250 gm" },
  { item: "Fulvati, Lambvati", qty: "As Required" },
  { item: "Rangoli (Pandhari & Color)", qty: "As Required" },
  { item: "Gahu", qty: "3 kg" },
  { item: "Taandul", qty: "3 kg" },
  { item: "Belache Shen", qty: "As Required" },
  { item: "Gavri", qty: "5" },
  { item: "Samidha", qty: "As Required" },
  { item: "Loni", qty: "50 gm" },
  { item: "Hom Pude", qty: "2" },
  { item: "Vetachi 1 Nali", qty: "1" },
  { item: "Naveen Shawl", qty: "1" },
  { item: "Uparne", qty: "1" },
  { item: "Sut Gundi", qty: "1" },
  { item: "Lal Lockar Bundle", qty: "1" },
  { item: "Panchrangi Nadi Bundle", qty: "1" },
  { item: "Palkhacha Dand", qty: "1" },
  { item: "Mundaval", qty: "1 Set" }
];

const faqs = [
  { 
    q: "What is Upanayan Sanskar?", 
    a: "Upanayan is a sacred thread ceremony marking the spiritual initiation of a child into Vedic learning."
  },
  { 
    q: "When is Upanayan performed?", 
    a: "It is usually performed during childhood on an auspicious muhurat selected as per horoscope."
  },
  { 
    q: "Importance of Upanayan?", 
    a: "It symbolizes the beginning of education, discipline, and spiritual responsibilities."
  }
];
  return (
    <>
      <PujaTemplate
        title="उपनयन"
        description="Upanayan is a sacred thread ceremony marking the spiritual initiation."
        information="It is an important samskara performed with Vedic rituals."
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

export default Upanayan;