import React from "react";
import mandala from "../../Assets/mandalaright-removebg-preview.png";
import onamImg from "../../Assets/onam.jpeg";

const Onam = () => {
  const festivalData = {
    name: "Onam Festival",

    importance:
      "Onam is the harvest festival of Kerala, celebrating prosperity, unity, and the legendary return of King Mahabali. It represents happiness, harmony, and cultural pride.",

    rituals:
      "People create beautiful Pookalam (flower rangoli), perform traditional dances, wear new clothes, prepare Onam Sadya, and participate in Vallam Kali (snake boat races).",

    dos: [
      "Decorate home with Pookalam",
      "Participate in cultural activities",
      "Share food and happiness with everyone",
    ],

    donts: [
      "Avoid negativity and conflicts",
      "Do not waste food",
      "Avoid disrespecting traditions",
    ],

    pujaSamagri: [
      "Flowers for Pookalam",
      "Oil lamp (Diya)",
      "Incense sticks",
      "Traditional sweets",
      "Rice and vegetables",
    ],

    shubhMuhurat:
      "Morning hours during Onam celebrations (as per local customs)",

    vratKatha:
      "Onam celebrates the annual visit of King Mahabali, whose reign symbolized equality and prosperity. The festival teaches humility, generosity, and unity.",

    spiritualBenefits: [
      "Brings prosperity and happiness",
      "Promotes unity and equality",
      "Positive energy in family",
    ],

    colorDress:
      "White and Gold symbolize purity, prosperity, and tradition.",

    rashiImpact: [
      { rashi: "Mesha (Aries)", impact: "New energy and enthusiasm" },
      { rashi: "Vrishabha (Taurus)", impact: "Financial growth" },
      { rashi: "Mithuna (Gemini)", impact: "Social bonding" },
      { rashi: "Karka (Cancer)", impact: "Family happiness" },
      { rashi: "Simha (Leo)", impact: "Recognition and pride" },
      { rashi: "Kanya (Virgo)", impact: "Mental peace" },
      { rashi: "Tula (Libra)", impact: "Balanced relationships" },
      { rashi: "Vrischika (Scorpio)", impact: "Inner strength" },
      { rashi: "Dhanu (Sagittarius)", impact: "Joy and optimism" },
      { rashi: "Makara (Capricorn)", impact: "Stability and success" },
      { rashi: "Kumbha (Aquarius)", impact: "Creative ideas" },
      { rashi: "Meena (Pisces)", impact: "Spiritual happiness" },
    ],
  };

  return (
    <div style={styles.container}>
      <img src={mandala} alt="mandala" style={styles.mandalaLeft} />
      <img src={mandala} alt="mandala" style={styles.mandalaRight} />

      <div style={styles.card}>
        <img src={onamImg} alt="Onam" style={styles.image} />

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

export default Onam;

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