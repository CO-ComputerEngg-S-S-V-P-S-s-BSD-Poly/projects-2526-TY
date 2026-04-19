// import React from "react";
// import PujaDesktop from "./PujaTemplate";

// const GrahYagya = () => {
//   return (
//     <PujaDesktop
//       title="सप्तशती चे पाठ"   // 👈 EXACT SAME AS DATABASE
//       description="ग्रह यज्ञ हा ग्रहदोष शांतीसाठी केला जाणारा वैदिक विधी आहे."
//       youtubeUrl="https://www.youtube.com/watch?v=XXXXXX"
//       samagri="हवन कुंड, समिधा, तूप, अक्षता, पुष्प."
//       information="ही पूजा ग्रहदोष कमी करण्यासाठी केली जाते."
//       shubhDin="सोमवार, गुरुवार किंवा अमावस्या."
//       faqs={[
//         {
//           q: "What is Grah Yagya?",
//           a: "Grah Yagya is performed to reduce planetary doshas."
//         }
//       ]}
//     />
//   );
// };

// export default GrahYagya;


import React, { useState } from "react";
import PujaTemplate from "./PujaTemplate";

const SaptashatiPath = () => {

  const [activeModal, setActiveModal] = useState(null); 
  // "yajman" | "pandit" | null

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
    { item: "Durga Saptashati Book", qty: "1" },
    { item: "Havan Kund", qty: "1" },
    { item: "Cow Ghee", qty: "1 Kg" }
  ];

  const faqs = [
    { q: "What is Saptashati Path?", a: "It is recitation of Devi Mahatmyam." },
    { q: "When is it performed?", a: "Navratri or special occasions." },
    { q: "Benefits?", a: "Peace, prosperity and divine blessings." }
  ];

  return (
    <>
      <PujaTemplate
        title="सप्तशती चे पाठ"
        description="Durga Saptashati Path Devi Durga chi krupa milavnyasathi kela jato."
        information="Saptashati Path ha Devi Mahatmyam cha paath aahe jo shanti ani samruddhi sathi kela jato."
        faqs={faqs}
        panditSamagri={
          <span 
            className="click-link" 
            onClick={() => setActiveModal("pandit")}
          >
            Click Here to View Pandit Samagri
          </span>
        }
        yajmanSamagri={
          <span 
            className="click-link" 
            onClick={() => setActiveModal("yajman")}
          >
            Click Here to View Yajman Samagri
          </span>
        }
      />

      {/* SINGLE MODAL */}
      {activeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-btn" 
              onClick={() => setActiveModal(null)}
            >
              ✕
            </button>

            <h2>
              {activeModal === "yajman" ? "Yajman Samagri" : "Pandit Samagri"}
            </h2>

            <table>
              <thead>
                <tr>
                  <th>Samagri</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {(activeModal === "yajman" ? yajmanSamagri : panditSamagri)
                  .map((data, index) => (
                    <tr key={index}>
                      <td>{data.item}</td>
                      <td>{data.qty}</td>
                    </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      )}
    </>
  );
};

export default SaptashatiPath;