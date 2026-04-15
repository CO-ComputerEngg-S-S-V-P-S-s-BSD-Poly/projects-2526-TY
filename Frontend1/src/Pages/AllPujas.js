import React from "react";
import { useNavigate } from "react-router-dom";
import "./AllPujas.css";
import mandala from "../Assets/mandalaright-removebg-preview.png";

const pujas = [
  { name: "सप्तशती चे पाठ", path: "/puja/saptashati" },
  { name: "नक्षत्र शांती", path: "/puja/nakshatra-shanti" },
  { name: "ग्रह शांती", path: "/puja/grah-shanti" },
  { name: "नवनाथ पारायण", path: "/puja/navnath-parayan" },
  { name: "गुरुचरित्र पारायण", path: "/puja/gurucharitra-parayan" },
  { name: "कालसर्प शांती", path: "/puja/kalsarp-shanti" },
  { name: "उदक शांती", path: "/puja/udak-shanti" },
  { name: "ब्राह्म विवाह", path: "/puja/brahma-vivah" },
  { name: "उपननय", path: "/puja/upanayan" },
  { name: "सत्यनारायन", path: "/puja/satyanarayan" },
  { name: "संगीतमय भागवत कथा", path: "/puja/bhagwat-katha" },
  { name: "शिवमहापूरान कथा", path: "/puja/shivpuran-katha" },
  { name: "अंतेष्टी", path: "/puja/antyeshti" },
  { name: "हरतालिका", path: "/puja/hartalika" },
  { name: "वटसावित्री", path: "/puja/vat-savitri" },
  { name: "घटस्थापना", path: "/puja/ghat-sthapana" },
  { name: "लक्ष्मीपूजन", path: "/puja/lakshmi-pujan" },
  { name: "पितृपूजा", path: "/puja/pitra-puja" },
  { name: "भूमिपूजन", path: "/puja/bhumi-pujan" },
  { name: "विवाह", path: "/puja/vivah" },
  { name: "रुद्राभिषेक", path: "/puja/rudrabhishek" },
  { name: "सोळा सोमवार व्रत उद्यापन", path: "/puja/solah-somvar" },
  { name: "चतुर्थी उद्यापन", path: "/puja/chaturthi-udyapan" },
  { name: "गुरुजप", path: "/puja/guru-jap" },
  { name: "तुळशी विवाह", path: "/puja/tulsi-vivah" },
  { name: "गणेश स्थापना", path: "/puja/ganesh-sthapana" },
  { name: "साखरपुडा", path: "/puja/sakharpuda" }
];

const AllPujas = () => {
  const navigate = useNavigate();

  return (
    <div className="allpujas-container">
      <img src={mandala} alt="mandala" className="home-mandala-left" />
      <img src={mandala} alt="mandala" className="home-mandala" />

      <h1 className="allpujas-title">All Pujas</h1>

      <div className="allpujas-grid">
        {pujas.map((puja, index) => (
          <div
            key={index}
            className="allpuja-card"
            onClick={() => navigate(puja.path)}
          >
            <div className="allpuja-symbol">ॐ</div>
            <h2>{puja.name}</h2>
            <p>Click to view details</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllPujas;
