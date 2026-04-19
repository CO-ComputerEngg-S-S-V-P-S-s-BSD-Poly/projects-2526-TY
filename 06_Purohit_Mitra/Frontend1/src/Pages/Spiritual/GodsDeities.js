import React, { useState } from "react";
import mandala from "../../Assets/mandalaright-removebg-preview.png";
import bramha from "../../Assets/bramha.jpeg"
import shiva from "../../Assets/l-shiva.jpeg"
import masya from "../../Assets/Masya .jpeg"
import vishnu from"../../Assets/vishnu.jpeg"
import kurma from "../../Assets/kurma.jpeg"
import nar from "../../Assets/narshimha.jpeg" 
import varha from "../../Assets/varha.jpeg"
import vaman from "../../Assets/vaman.jpeg"
import pashu from "../../Assets/pashuram.jpeg"
import ram from "../../Assets/l-ram.jpeg"
import krish from "../../Assets/krishna.jpeg"
import buddha from "../../Assets/buddha.jpeg"
import kalki from"../../Assets/kalki.jpeg"
import lakshmi from "../../Assets/lakshmi.jpeg"
import saraswati from "../../Assets/sarswati.jpeg"
import sars2 from "../../Assets/sars2.jpeg"
import ganesh from "../../Assets/ganeshh.jpeg"
import indra from "../../Assets/indra.jpeg"
import hanuman from "../../Assets/hanuman.jpeg"
import agni from "../../Assets/agni.jpeg"
import varuna from "../../Assets/varuna.jpeg"
import yam from "../../Assets/yam.jpeg"
import sun from "../../Assets/sun.jpeg"
import moon from "../../Assets/moon.jpeg"
import kuber from "../../Assets/kuber.jpeg"
import parvati from "../../Assets/parvati.jpeg"
import kali from "../../Assets/kali.jpeg"
import ann from "../../Assets/annapurna .jpeg"
import hayagriva from "../../Assets/hyagriva.jpeg"
import dhan from "../../Assets/dhanvantri.jpeg"
import mohini from "../../Assets/mohini.jpeg"
import kapila from "../../Assets/kapil.jpeg"


const chapters = [
  {
    title: "Lord Brahma – The Creator",
    image: bramha,
    content: `
      Lord Brahma is the creator of the universe according to Hindu mythology.
      <br><br><strong>Significance:</strong> Creation, knowledge, and wisdom.
    `,
  },
  {
    title: "Lord Vishnu – The Preserver",
    image: vishnu,
    content: `
      Lord Vishnu preserves cosmic order and dharma.
      <br><br><strong>Significance:</strong> Protection and balance.
    `,
  },
  {
    title: "Lord Shiva – The Destroyer",
    image: shiva,
    content: `
      Lord Shiva represents destruction and transformation.
      <br><br><strong>Significance:</strong> Spiritual awakening.
    `,
  },
  {
    title: "Matsya Avatar",
    image: masya,
    content: `
      First avatar of Vishnu who saved scriptures from flood.
      <br><br><strong>Significance:</strong> Protection of knowledge.
    `,
  },
  {
    title: "Kurma Avatar",
    image: kurma,
    content: `
      Supported Mount Mandara during Samudra Manthan.
      <br><br><strong>Significance:</strong> Stability and patience.
    `,
  },
  {
    title: "Varaha Avatar",
    image: varha,
    content: `
      Rescued Earth from demon Hiranyaksha.
      <br><br><strong>Significance:</strong> Protection of Earth.
    `,
  },
  {
    title: "Narasimha Avatar",
    image: nar,
    content: `
      Destroyed Hiranyakashipu and protected Prahlada.
      <br><br><strong>Significance:</strong> Divine justice.
    `,
  },
  {
    title: "Vamana Avatar",
    image: vaman,
    content: `
      Humbled King Bali with three steps.
      <br><br><strong>Significance:</strong> Humility and balance.
    `,
  },
  {
    title: "Parashurama Avatar",
    image: pashu,
    content: `
      Destroyed corrupt rulers.
      <br><br><strong>Significance:</strong> Justice and discipline.
    `,
  },
  {
    title: "Lord Rama Avatar",
    image: ram,
    content: `
      Ideal king and embodiment of dharma.
      <br><br><strong>Significance:</strong> Truth and righteousness.
    `,
  },
  {
    title: "Lord Krishna Avatar",
    image: krish,
    content: `
      Gave Bhagavad Gita and divine love.
      <br><br><strong>Significance:</strong> Wisdom and devotion.
    `,
  },
  {
    title: "Buddha Avatar",
    image: buddha,
    content: `
      Taught non-violence and enlightenment.
      <br><br><strong>Significance:</strong> Compassion and peace.
    `,
  },
  {
    title: "Kalki Avatar",
    image: kalki,
    content: `
      Will restore dharma in Kali Yuga.
      <br><br><strong>Significance:</strong> Renewal.
    `,
  },
  {
    title: "Goddess Lakshmi",
    image: saraswati,
    content: `
      Goddess of wealth and prosperity.
      <br><br><strong>Significance:</strong> Abundance.
    `,
  },
  {
    title: "Goddess Saraswati",
    image: sars2  ,
    content: `
      Goddess of knowledge and arts.
      <br><br><strong>Significance:</strong> Learning.
    `,
  },
  {
    title: "Goddess Durga",
    image: lakshmi,
    content: `
      Destroys evil forces.
      <br><br><strong>Significance:</strong> Protection.
    `,
  },
  {
    title: "Lord Ganesha",
    image: ganesh,
    content: `
      Remover of obstacles.
      <br><br><strong>Significance:</strong> Success and wisdom.
    `,
  },
  {
    title: "Lord Hanuman",
    image: hanuman,
    content: `
      Symbol of devotion and strength.
      <br><br><strong>Significance:</strong> Loyalty.
    `,
  },
  {
    title: "Lord Indra",
    image: indra,
    content: `
      King of Devas and god of rain.
      <br><br><strong>Significance:</strong> Leadership.
    `,
  },
  {
    title: "Lord Agni",
    image: agni,
    content: `
      God of fire and messenger of gods.
      <br><br><strong>Significance:</strong> Purity.
    `,
  },
  {
    title: "Lord Varuna",
    image: varuna,
    content: `
      God of cosmic law and oceans.
      <br><br><strong>Significance:</strong> Justice.
    `,
  },
  {
    title: "Lord Yama",
    image: yam,
    content: `
      God of death and karma.
      <br><br><strong>Significance:</strong> Moral law.
    `,
  },
  {
    title: "Lord Surya",
    image: sun,
    content: `
      Sun god and source of life.
      <br><br><strong>Significance:</strong> Energy.
    `,
  },
  {
    title: "Lord Chandra",
    image: moon,
    content: `
      Moon god controlling mind and emotions.
      <br><br><strong>Significance:</strong> Calmness.
    `,
  },
  {
    title: "Lord Kubera",
    image: kuber,
    content: `
      Treasurer of gods.
      <br><br><strong>Significance:</strong> Wealth.
    `,
  },
  {
    title: "Goddess Parvati",
    image: parvati,
    content: `
      Goddess of love and devotion.
      <br><br><strong>Significance:</strong> Shakti.
    `,
  },
  {
    title: "Goddess Kali",
    image: kali,
    content: `
      Destroyer of evil and ego.
      <br><br><strong>Significance:</strong> Liberation.
    `,
  },
  {
    title: "Goddess Annapurna",
    image: ann,
    content: `
      Goddess of food and nourishment.
      <br><br><strong>Significance:</strong> Sustenance.
    `,
  },
  {
    title: "Hayagriva Avatar",
    image: hayagriva,
    content: `
      Restorer of Vedas.
      <br><br><strong>Significance:</strong> Knowledge.
    `,
  },
  {
    title: "Dhanvantari Avatar",
    image: dhan,
    content: `
      God of Ayurveda and healing.
      <br><br><strong>Significance:</strong> Health.
    `,
  },
  {
    title: "Mohini Avatar",
    image: mohini,
    content: `
      Female avatar of Vishnu.
      <br><br><strong>Significance:</strong> Divine illusion.
    `,
  },
  {
    title: "Kapila Avatar",
    image: kapila,
    content: `
      Founder of Sankhya philosophy.
      <br><br><strong>Significance:</strong> Enlightenment.
    `,
  },
];

const GodsDeities = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div style={styles.container}>
      <img src={mandala} alt="" style={styles.mandalaLeft} />
      <img src={mandala} alt="" style={styles.mandalaRight} />

      <h1 style={styles.title}>Hindu Gods, Goddesses & Avatars</h1>

      <div style={styles.wrapper}>
        {chapters.map((c, i) => (
          <div key={i} style={styles.item}>
            <div style={styles.header} onClick={() => setOpenIndex(openIndex === i ? null : i)}>
              <h2 style={styles.headerText}>{c.title}</h2>
              <span style={styles.icon}>{openIndex === i ? "−" : "+"}</span>
            </div>

            {openIndex === i && (
  <div style={styles.body}>
    <img src={c.image} alt={c.title} style={styles.image} />

    <div style={styles.textWrapper}>
      <div
        dangerouslySetInnerHTML={{ __html: c.content }}
        style={styles.content}
      />
    </div>
  </div>
)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GodsDeities;

/* styles */
const styles = {
  container: {
    minHeight: "100vh",
    padding: "80px 20px",
    background: "linear-gradient(to bottom, #f5ece2, #ffffff)",
    position: "relative",
  },
  mandalaLeft: { position: "absolute", left: "-200px", top: 0, width: "600px", opacity: 0.12 },
  mandalaRight: { position: "absolute", right: "-200px", bottom: 0, width: "600px", opacity: 0.12 },
  title: { textAlign: "center", fontSize: "38px", color: "#e65100", marginBottom: "40px" },
  wrapper: { maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "22px" },
  item: { background: "#fff", borderRadius: "18px", boxShadow: "0 12px 30px rgba(0,0,0,0.12)", overflow: "hidden" },
header: { 
  padding: "20px 24px", 
  display: "flex", 
  justifyContent: "space-between", 
  cursor: "pointer", 
  background: "linear-gradient(to right, #ff7a18, #ee6820)" 
},
headerText: { 
  fontSize: "20px", 
  color: "#ffffff", 
  margin: 0 
},
icon: { 
  fontSize: "26px", 
  fontWeight: "bold", 
  color: "#ffffff" 
},

 body: { 
  padding: "22px",
  display: "flex",
  gap: "25px",
  alignItems: "flex-start"
},

image: { 
  width: "320px",
  height: "220px",
  objectFit: "cover",
  borderRadius: "14px"
},

textWrapper:{
  flex:1
},

content: { 
  lineHeight: "1.8",
  color: "#555",
  fontSize: "16px"
},
};