import React from "react";
import mandala from "../../Assets/mandalaright-removebg-preview.png";
import karwaImg from "../../Assets/karva.jpeg";

const Karwachauth = () => {
  const festivalData = {
    name: "Karwa Chauth",

    importance:
      "Karwa Chauth is a sacred Hindu festival observed by married women for the long life, prosperity, and well-being of their husbands. It reflects love, devotion, and marital commitment.",

    rituals:
      "Women observe a day-long fast without food and water, perform evening puja, listen to Karwa Chauth katha, and break the fast after seeing the moon.",

    dos: [
      "Observe fast with devotion",
      "Listen to Karwa Chauth Katha",
      "Pray sincerely for husband's well-being",
    ],

    donts: [
      "Avoid negativity and stress",
      "Do not consume food before moonrise",
      "Avoid arguments",
    ],

    pujaSamagri: [
      "Karwa (earthen pot)",
      "Sieve (chalni)",
      "Diya and incense sticks",
      "Fruits and sweets",
      "Picture of Moon and Goddess Parvati",
    ],

    shubhMuhurat: "Evening puja time before moonrise",

    vratKatha:
      "The Karwa Chauth katha highlights the power of devotion and faith of married women, emphasizing love, sacrifice, and blessings.",

    spiritualBenefits: [
      "Strengthens marital bond",
      "Brings peace and positivity",
      "Enhances faith and devotion",
    ],

    rashiImpact: [
      { rashi: "Mesha (Aries)", impact: "Strengthens relationship bonds" },
      { rashi: "Vrishabha (Taurus)", impact: "Harmony and trust in marriage" },
      { rashi: "Mithuna (Gemini)", impact: "Better understanding with partner" },
      { rashi: "Karka (Cancer)", impact: "Emotional security and love" },
      { rashi: "Simha (Leo)", impact: "Respect and affection increase" },
      { rashi: "Kanya (Virgo)", impact: "Clear communication in marriage" },
      { rashi: "Tula (Libra)", impact: "Balance and peace in relationships" },
      { rashi: "Vrishchika (Scorpio)", impact: "Deep emotional bonding" },
      { rashi: "Dhanu (Sagittarius)", impact: "Positive changes in married life" },
      { rashi: "Makara (Capricorn)", impact: "Stability and commitment" },
      { rashi: "Kumbha (Aquarius)", impact: "Mutual respect and clarity" },
      { rashi: "Meena (Pisces)", impact: "Spiritual and emotional growth" },
    ],

    colorDress:
      "Red, maroon, and pink symbolize love, passion, and marital bliss.",

    homeOfficeTips: [
      "Maintain a calm and positive environment",
      "Light a diya during evening puja",
      "Decorate puja space neatly",
    ],

    modernMeaning:
      "Karwa Chauth represents trust, emotional bonding, and respect in modern married life.",
  };

  return (
    <div style={styles.container}>
      <img src={mandala} alt="mandala" style={styles.mandalaLeft} />
      <img src={mandala} alt="mandala" style={styles.mandalaRight} />

      <div style={styles.card}>
        <img src={karwaImg} alt="Karwa Chauth" style={styles.image} />

        <h1 style={styles.title}>{festivalData.name}</h1>

        {Object.entries({
          Importance: festivalData.importance,
          Rituals: festivalData.rituals,
          "Shubh Muhurat": festivalData.shubhMuhurat,
          "Vrat Katha": festivalData.vratKatha,
          "Color / Dress Suggestion": festivalData.colorDress,
          "Modern Meaning": festivalData.modernMeaning,
        }).map(([heading, content], idx) => (
          <section key={idx} style={styles.section}>
            <h2 style={styles.heading}>{heading}</h2>
            <p style={styles.text}>{content}</p>
          </section>
        ))}

        <section style={styles.section}>
          <h2 style={styles.heading}>Do's & Don'ts</h2>
          <div style={styles.dosDonts}>
            <div>
              <h3 style={styles.subHeading}>Do's</h3>
              <ul>{festivalData.dos.map((d, i) => <li key={i}>{d}</li>)}</ul>
            </div>
            <div>
              <h3 style={styles.subHeading}>Don'ts</h3>
              <ul>{festivalData.donts.map((d, i) => <li key={i}>{d}</li>)}</ul>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Puja Samagri</h2>
          <ul>{festivalData.pujaSamagri.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Spiritual Benefits</h2>
          <ul>{festivalData.spiritualBenefits.map((b, i) => <li key={i}>{b}</li>)}</ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Rashi Wise Impact</h2>
          <ul>
            {festivalData.rashiImpact.map((r, i) => (
              <li key={i}>{r.rashi}: {r.impact}</li>
            ))}
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Home & Office Tips</h2>
          <ul>{festivalData.homeOfficeTips.map((t, i) => <li key={i}>{t}</li>)}</ul>
        </section>
      </div>
    </div>
  );
};

export default Karwachauth;

// 🔸 INTERNAL CSS 🔸
const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #fff6ec, #ffffff)",
    position: "relative",
    overflow: "hidden",
    padding: "80px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  mandalaLeft: {
    position: "absolute",
    top: "-60px",
    left: "-200px",
    width: "750px",
    opacity: 0.15,
    zIndex: 0,
  },

  mandalaRight: {
    position: "absolute",
    bottom: "-60px",
    right: "-200px",
    width: "750px",
    opacity: 0.15,
    zIndex: 0,
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
    maxHeight: "600px",
    objectFit: "cover",
    borderRadius: "22px",
    marginBottom: "30px",
  },

  title: {
    textAlign: "center",
    color: "#e65100",
    fontSize: "38px",
    fontWeight: "700",
    marginBottom: "30px",
  },

  section: {
    marginBottom: "30px",
  },

  heading: {
    color: "#bf360c",
    fontSize: "22px",
    marginBottom: "10px",
    borderLeft: "4px solid #ff9800",
    paddingLeft: "12px",
  },

  subHeading: {
    color: "#e65100",
    fontSize: "18px",
    marginBottom: "8px",
  },

  text: {
    fontSize: "16px",
    color: "#555",
    lineHeight: "1.9",
  },

  dosDonts: {
    display: "flex",
    justifyContent: "space-between",
    gap: "40px",
  },
};