import React from "react";
import mandala from "../../Assets/mandalaright-removebg-preview.png";
import teejImg from "../../Assets/teej.jpeg";

const Teej = () => {
  const festivalData = {
    name: "Teej Festival",
    importance:
      "Teej is a traditional Hindu festival celebrated mainly by women to honor Goddess Parvati and Lord Shiva. It symbolizes marital happiness, devotion, love, and prosperity.",

    rituals:
      "Women observe fasting, dress in green attire, apply mehendi, sing folk songs, and pray for the well-being and long life of their husbands.",

    dos: [
      "Observe the vrat with devotion",
      "Wear green clothes and bangles",
      "Pray to Lord Shiva and Goddess Parvati",
    ],

    donts: [
      "Avoid negative thoughts",
      "Do not break fast without rituals",
      "Avoid arguments and anger",
    ],

    pujaSamagri: [
      "Idol or picture of Lord Shiva & Parvati",
      "Green bangles",
      "Flowers",
      "Mehendi",
      "Fruits and sweets",
    ],

    shubhMuhurat: "Early morning or evening puja time",

    vratKatha:
      "The Teej vrat katha narrates Goddess Parvati’s devotion and penance to attain Lord Shiva as her husband, inspiring faith, patience, and devotion.",

    spiritualBenefits: [
      "Strengthens marital bond",
      "Brings peace and happiness",
      "Enhances spiritual strength",
    ],

  rashiImpact: [
  { rashi: "Mesha (Aries)", impact: "Marital happiness and emotional strength" },
  { rashi: "Vrishabha (Taurus)", impact: "Love and relationship stability" },
  { rashi: "Mithuna (Gemini)", impact: "Better understanding and bonding" },
  { rashi: "Karka (Cancer)", impact: "Emotional peace and family harmony" },
  { rashi: "Simha (Leo)", impact: "Respect and support from partner" },
  { rashi: "Kanya (Virgo)", impact: "Improved trust and communication" },
  { rashi: "Tula (Libra)", impact: "Balance and happiness in relationships" },
  { rashi: "Vrishchika (Scorpio)", impact: "Deep emotional connection" },
  { rashi: "Dhanu (Sagittarius)", impact: "Positive changes in married life" },
  { rashi: "Makara (Capricorn)", impact: "Stability and mutual understanding" },
  { rashi: "Kumbha (Aquarius)", impact: "Emotional clarity and harmony" },
  { rashi: "Meena (Pisces)", impact: "Spiritual bonding and love" },
],


    colorDress:
      "Green color symbolizes fertility, growth, happiness, and prosperity.",

    homeOfficeTips: [
      "Decorate home with flowers",
      "Light a diya during puja",
      "Maintain a peaceful environment",
    ],

    modernMeaning:
      "Teej celebrates feminine strength, devotion, love, and emotional bonding in modern life.",
  };

  return (
    <div style={styles.container}>
      <img src={mandala} alt="mandala" style={styles.mandalaLeft} />
      <img src={mandala} alt="mandala" style={styles.mandalaRight} />

      <div style={styles.card}>
        <img src={teejImg} alt="Teej Festival" style={styles.image} />

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

export default Teej;

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