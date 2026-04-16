import React from "react";
import mandala from "../../Assets/mandalaright-removebg-preview.png";
import gauriGanpatiImg from "../../Assets/gauri.jpeg";

const GauriGanpati = () => {
  const festivalData = {
    name: "Gauri Ganpati",

    importance:
      "Gauri Ganpati festival celebrates the arrival of Goddess Gauri and Lord Ganpati. It symbolizes prosperity, marital happiness, family harmony, and divine blessings.",

    rituals:
      "Devotees welcome Gauri with traditional rituals, perform Ganesh puja, offer flowers and sweets, and seek blessings for happiness and prosperity.",

    dos: [
      "Perform Ganesh and Gauri puja with devotion",
      "Maintain cleanliness and purity",
      "Offer modak and traditional food",
    ],

    donts: [
      "Avoid negative thoughts",
      "Avoid anger and arguments",
      "Do not disrespect traditions",
    ],

    pujaSamagri: [
      "Idol of Lord Ganpati and Goddess Gauri",
      "Flowers and garlands",
      "Modak and sweets",
      "Diya and incense",
      "Durva grass",
    ],

    shubhMuhurat: "Morning hours during Ganesh Chaturthi",

    vratKatha:
      "Gauri Ganpati katha highlights the divine bond of Shiva-Parvati and the blessings of Lord Ganesh for household happiness.",

    spiritualBenefits: [
      "Removes obstacles",
      "Brings peace and harmony",
      "Enhances devotion and positivity",
    ],

    rashiImpact: [
      { rashi: "Mesha (Aries)", impact: "New beginnings and confidence" },
      { rashi: "Vrishabha (Taurus)", impact: "Financial stability" },
      { rashi: "Mithuna (Gemini)", impact: "Clarity and communication" },
      { rashi: "Karka (Cancer)", impact: "Emotional happiness" },
      { rashi: "Simha (Leo)", impact: "Leadership and success" },
      { rashi: "Kanya (Virgo)", impact: "Discipline and focus" },
      { rashi: "Tula (Libra)", impact: "Balance and harmony" },
      { rashi: "Vrishchika (Scorpio)", impact: "Inner strength" },
      { rashi: "Dhanu (Sagittarius)", impact: "Optimism and growth" },
      { rashi: "Makara (Capricorn)", impact: "Career stability" },
      { rashi: "Kumbha (Aquarius)", impact: "Creative energy" },
      { rashi: "Meena (Pisces)", impact: "Spiritual peace" },
    ],

    colorDress:
      "Yellow, green, or red attire is considered auspicious for Gauri Ganpati puja.",

    homeOfficeTips: [
      "Decorate with flowers and rangoli",
      "Light diya in the morning and evening",
      "Chant Ganpati mantra",
    ],

    modernMeaning:
      "Gauri Ganpati teaches the value of family bonding, gratitude, devotion, and positivity in modern life.",
  };

  return (
    <div style={styles.container}>
      <img src={mandala} alt="mandala" style={styles.mandalaLeft} />
      <img src={mandala} alt="mandala" style={styles.mandalaRight} />

      <div style={styles.card}>
        <img
          src={gauriGanpatiImg}
          alt="Gauri Ganpati"
          style={styles.image}
        />

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
          <ul>
            {festivalData.pujaSamagri.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Spiritual Benefits</h2>
          <ul>
            {festivalData.spiritualBenefits.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Rashi Wise Impact</h2>
          <ul>
            {festivalData.rashiImpact.map((r, i) => (
              <li key={i}>
                {r.rashi}: {r.impact}
              </li>
            ))}
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Home & Office Tips</h2>
          <ul>
            {festivalData.homeOfficeTips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default GauriGanpati;

/* 🔸 INTERNAL CSS 🔸 */
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
  },
  mandalaRight: {
    position: "absolute",
    bottom: "-60px",
    right: "-200px",
    width: "750px",
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