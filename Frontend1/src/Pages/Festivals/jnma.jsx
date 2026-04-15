import React from "react";
import mandala from "../../Assets/mandalaright-removebg-preview.png";
import krishn from "../../Assets/krishna.jpeg";

const Jnma = () => {
  const festivalData = {
    name: "Shri Krishna Janmashtami",

    importance:
      "Krishna Janmashtami marks the divine birth of Lord Krishna, symbolizing love, wisdom, dharma, and the victory of good over evil.",

    rituals:
      "Devotees observe fasting, sing bhajans, perform Abhishek, decorate cradles, and celebrate Krishna Janma at midnight with devotion.",

    dos: [
      "Observe fast with devotion",
      "Chant Hare Krishna mantra",
      "Offer butter, milk, and sweets",
    ],

    donts: [
      "Avoid anger and negativity",
      "Avoid non-vegetarian food",
      "Do not disrespect elders",
    ],

    pujaSamagri: [
      "Makhan (Butter)",
      "Milk & Curd",
      "Tulsi leaves",
      "Flowers",
      "Diya",
      "Panchamrit",
    ],

    shubhMuhurat: "12:00 AM (Midnight – Krishna Janma Kaal)",

    vratKatha:
      "Lord Krishna was born to destroy evil and protect dharma. His teachings in the Bhagavad Gita guide humanity towards righteous living.",

    spiritualBenefits: [
      "Inner peace and devotion",
      "Removes fear and negativity",
      "Strengthens faith and love",
    ],

    colorDress:
      "Yellow, Peacock Blue, and White symbolize joy, purity, and divinity.",

    rashiImpact: [
      { rashi: "Mesha (Aries)", impact: "Boosts confidence and leadership" },
      { rashi: "Vrishabha (Taurus)", impact: "Financial stability and comfort" },
      { rashi: "Mithuna (Gemini)", impact: "Improves communication skills" },
      { rashi: "Karka (Cancer)", impact: "Emotional balance and peace" },
      { rashi: "Simha (Leo)", impact: "Enhances creativity and fame" },
      { rashi: "Kanya (Virgo)", impact: "Sharpens focus and discipline" },
      { rashi: "Tula (Libra)", impact: "Harmony in relationships" },
      { rashi: "Vrischika (Scorpio)", impact: "Inner strength and courage" },
      { rashi: "Dhanu (Sagittarius)", impact: "Spiritual growth and wisdom" },
      { rashi: "Makara (Capricorn)", impact: "Career stability and success" },
      { rashi: "Kumbha (Aquarius)", impact: "Innovative thinking and clarity" },
      { rashi: "Meena (Pisces)", impact: "Deep devotion and emotional healing" },
    ],
  };

  return (
    <div style={styles.container}>
      <img src={mandala} alt="mandala" style={styles.mandalaLeft} />
      <img src={mandala} alt="mandala" style={styles.mandalaRight} />

      <div style={styles.card}>
        <img src={krishn} alt="Shri Krishna" style={styles.image} />

        <h1 style={styles.title}>{festivalData.name}</h1>

        <Section title="Importance" text={festivalData.importance} />
        <Section title="Rituals" text={festivalData.rituals} />

        <section style={styles.section}>
          <h2 style={styles.heading}>Do's & Don'ts</h2>
          <div style={styles.dosDonts}>
            <ul>
              {festivalData.dos.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
            <ul>
              {festivalData.donts.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        </section>

        <ListSection title="Puja Samagri" list={festivalData.pujaSamagri} />
        <Section title="Shubh Muhurat" text={festivalData.shubhMuhurat} />
        <Section title="Vrat Katha" text={festivalData.vratKatha} />
        <ListSection
          title="Spiritual Benefits"
          list={festivalData.spiritualBenefits}
        />

        <section style={styles.section}>
          <h2 style={styles.heading}>Rashi Wise Impact</h2>
          <ul>
            {festivalData.rashiImpact.map((r, i) => (
              <li key={i}>
                <strong>{r.rashi}:</strong> {r.impact}
              </li>
            ))}
          </ul>
        </section>

        <Section title="Color / Dress" text={festivalData.colorDress} />
      </div>
    </div>
  );
};

export default Jnma;

/* ---------- Reusable Components ---------- */

const Section = ({ title, text }) => (
  <section style={styles.section}>
    <h2 style={styles.heading}>{title}</h2>
    <p style={styles.text}>{text}</p>
  </section>
);

const ListSection = ({ title, list }) => (
  <section style={styles.section}>
    <h2 style={styles.heading}>{title}</h2>
    <ul>
      {list.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  </section>
);

/* ---------- Styles ---------- */

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #fff6ec, #ffffff)",
    padding: "80px 20px",
    display: "flex",
    justifyContent: "center",
    position: "relative",
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
  text: {
    color: "#555",
    lineHeight: "1.8",
  },
  dosDonts: {
    display: "flex",
    gap: "40px",
  },
};