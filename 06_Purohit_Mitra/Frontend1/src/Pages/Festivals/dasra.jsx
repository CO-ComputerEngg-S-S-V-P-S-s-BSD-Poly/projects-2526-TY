import React from "react";
import mandala from "../../Assets/mandalaright-removebg-preview.png";
import dasraImg from "../../Assets/ram.jpeg";

const Dasra = () => {
  const festivalData = {
    name: "Vijayadashami (Dasra)",

    importance:
      "Vijayadashami symbolizes the victory of good over evil. It marks Lord Rama’s victory over Ravana and Goddess Durga’s triumph over Mahishasura.",

    rituals:
      "People perform Shami Puja, worship weapons and books (Ayudha Puja), burn Ravana effigies, and seek blessings for success and new beginnings.",

    dos: [
      "Perform Shami and Ayudha Puja",
      "Seek blessings from elders",
      "Start new ventures or learning",
    ],

    donts: [
      "Avoid anger and ego",
      "Do not speak harsh words",
      "Avoid negative thoughts",
    ],

    pujaSamagri: [
      "Shami leaves",
      "Flowers",
      "Diya",
      "Incense sticks",
      "Kumkum & Haldi",
      "Sweets",
    ],

    shubhMuhurat:
      "Vijay Muhurat – Afternoon (varies as per Panchang)",

    vratKatha:
      "Vijayadashami celebrates the end of Navratri and the triumph of righteousness. It inspires people to destroy inner evils like greed, anger, and pride.",

    spiritualBenefits: [
      "Removes obstacles",
      "Brings success and courage",
      "Promotes positive energy",
    ],

    colorDress:
      "Red, Yellow, and Green symbolize power, prosperity, and happiness.",

    rashiImpact: [
      { rashi: "Mesha (Aries)", impact: "Victory in challenges" },
      { rashi: "Vrishabha (Taurus)", impact: "Growth and stability" },
      { rashi: "Mithuna (Gemini)", impact: "New opportunities" },
      { rashi: "Karka (Cancer)", impact: "Emotional strength" },
      { rashi: "Simha (Leo)", impact: "Leadership success" },
      { rashi: "Kanya (Virgo)", impact: "Clarity and discipline" },
      { rashi: "Tula (Libra)", impact: "Balance and harmony" },
      { rashi: "Vrischika (Scorpio)", impact: "Inner transformation" },
      { rashi: "Dhanu (Sagittarius)", impact: "Spiritual upliftment" },
      { rashi: "Makara (Capricorn)", impact: "Career achievements" },
      { rashi: "Kumbha (Aquarius)", impact: "Innovative ideas" },
      { rashi: "Meena (Pisces)", impact: "Peace and devotion" },
    ],
  };

  return (
    <div style={styles.container}>
      <img src={mandala} alt="mandala" style={styles.mandalaLeft} />
      <img src={mandala} alt="mandala" style={styles.mandalaRight} />

      <div style={styles.card}>
        <img src={dasraImg} alt="Dasra" style={styles.image} />

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

export default Dasra;

/* ---------- Helper Components ---------- */

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