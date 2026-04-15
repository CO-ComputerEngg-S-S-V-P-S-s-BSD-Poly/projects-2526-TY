import React from "react";
import mandala from "../../Assets/mandalaright-removebg-preview.png";
import rakshaImg from "../../Assets/bandhan.jpeg";

const Raksha = () => {
  const festivalData = {
    name: "Raksha Bandhan – Festival of Sacred Bond",

    importance:
      "Raksha Bandhan celebrates the pure and sacred bond between brother and sister. It symbolizes love, protection, trust, and lifelong responsibility.",

    rituals:
      "Sisters tie rakhi on their brother’s wrist, apply tilak, perform aarti, and pray for their brother’s long life. Brothers promise protection and offer gifts.",

    dos: [
      "Tie rakhi with love and devotion",
      "Respect family traditions",
      "Strengthen sibling bond",
    ],

    donts: [
      "Avoid ego and conflicts",
      "Avoid negative thoughts",
      "Do not disrespect relationships",
    ],

    pujaSamagri: [
      "Rakhi",
      "Roli & Rice",
      "Diya",
      "Sweets",
      "Coconut",
      "Gifts",
    ],

    shubhMuhurat:
      "Raksha Bandhan Muhurat during Aparahna time",

    vratKatha:
      "Raksha Bandhan katha highlights stories of Draupadi–Krishna, Yamuna–Yama, and Queen Karnavati, symbolizing protection, love, and duty.",

    spiritualBenefits: [
      "Strengthens emotional bonds",
      "Brings family harmony",
      "Promotes love and trust",
    ],

    colorDress:
      "Yellow, Red, Pink, and White symbolize love, purity, joy, and positivity.",

    rashiImpact: [
      { rashi: "Mesha (Aries)", impact: "Improves sibling harmony" },
      { rashi: "Vrishabha (Taurus)", impact: "Emotional security" },
      { rashi: "Mithuna (Gemini)", impact: "Better communication" },
      { rashi: "Karka (Cancer)", impact: "Family bonding" },
      { rashi: "Simha (Leo)", impact: "Respect and affection" },
      { rashi: "Kanya (Virgo)", impact: "Trust and responsibility" },
      { rashi: "Tula (Libra)", impact: "Balanced relationships" },
      { rashi: "Vrischika (Scorpio)", impact: "Deep emotional bond" },
      { rashi: "Dhanu (Sagittarius)", impact: "Positive outlook" },
      { rashi: "Makara (Capricorn)", impact: "Strengthened commitments" },
      { rashi: "Kumbha (Aquarius)", impact: "Mutual understanding" },
      { rashi: "Meena (Pisces)", impact: "Emotional healing" },
    ],
  };

  return (
    <div style={styles.container}>
      <img src={mandala} alt="mandala" style={styles.mandalaLeft} />
      <img src={mandala} alt="mandala" style={styles.mandalaRight} />

      <div style={styles.card}>
        <img src={rakshaImg} alt="Raksha Bandhan" style={styles.image} />

        <h1 style={styles.title}>{festivalData.name}</h1>

        <section style={styles.section}>
          <h2 style={styles.heading}>Importance</h2>
          <p>{festivalData.importance}</p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Rituals</h2>
          <p>{festivalData.rituals}</p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Do's & Don'ts</h2>
          <div style={{ display: "flex", gap: "40px" }}>
            <ul>
              {festivalData.dos.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <ul>
              {festivalData.donts.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Puja Samagri</h2>
          <ul>
            {festivalData.pujaSamagri.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Shubh Muhurat</h2>
          <p>{festivalData.shubhMuhurat}</p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Vrat Katha</h2>
          <p>{festivalData.vratKatha}</p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Spiritual Benefits</h2>
          <ul>
            {festivalData.spiritualBenefits.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Rashi Wise Impact</h2>
          <ul>
            {festivalData.rashiImpact.map((item, i) => (
              <li key={i}>
                <strong>{item.rashi}:</strong> {item.impact}
              </li>
            ))}
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Color / Dress</h2>
          <p>{festivalData.colorDress}</p>
        </section>
      </div>
    </div>
  );
};

export default Raksha;

/* styles SAME */
const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #fff6ec, #ffffff)",
    position: "relative",
    padding: "80px 20px",
    display: "flex",
    justifyContent: "center",
  },
  mandalaLeft: {
    position: "absolute",
    top: "-60px",
    left: "-200px",
    width: "700px",
    opacity: 0.15,
  },
  mandalaRight: {
    position: "absolute",
    bottom: "-60px",
    right: "-200px",
    width: "700px",
    opacity: 0.15,
  },
  card: {
    background: "#fff",
    borderRadius: "25px",
    padding: "40px",
    maxWidth: "900px",
    boxShadow: "0 20px 45px rgba(255,122,24,0.25)",
    zIndex: 2,
  },
  image: {
    width: "100%",
    maxHeight: "500px",
    objectFit: "cover",
    borderRadius: "20px",
    marginBottom: "25px",
  },
  title: {
    textAlign: "center",
    color: "#e65100",
    fontSize: "36px",
    marginBottom: "30px",
  },
  section: {
    marginBottom: "25px",
  },
  heading: {
    color: "#bf360c",
    fontSize: "22px",
    borderLeft: "4px solid #ff9800",
    paddingLeft: "12px",
    marginBottom: "10px",
  },
};