import React from "react";
import mandala from "../../Assets/mandalaright-removebg-preview.png";
import diwaliImg from "../../Assets/diwali.jpeg";

const Diwali = () => {
  const festivalData = {
    name: "Diwali – Festival of Lights",

    importance:
      "Diwali represents the victory of light over darkness, good over evil, and knowledge over ignorance. It is a festival of prosperity, happiness, and spiritual awakening.",

    rituals:
      "Homes are cleaned and decorated, rangoli is drawn, diyas are lit, Lakshmi-Ganesh puja is performed, sweets are shared, and families celebrate together.",

    diwaliDays: [
      {
        day: "Dhantrayodashi (Dhanteras)",
        info:
          "Worship of Lord Dhanvantari and Goddess Lakshmi is performed. Purchasing gold, silver, or utensils is considered highly auspicious.",
      },
      {
        day: "Narak Chaturdashi",
        info:
          "Also called Choti Diwali. It symbolizes Lord Krishna’s victory over Narakasura. Oil bath and early morning rituals are performed.",
      },
      {
        day: "Lakshmi Poojan",
        info:
          "The main Diwali night where Goddess Lakshmi and Lord Ganesha are worshipped for wealth, prosperity, and success.",
      },
      {
        day: "Diwali Padwa",
        info:
          "Celebrated as Bali Pratipada. It honors the bond between husband and wife and marks King Bali’s return to earth.",
      },
      {
        day: "Bhaubeej",
        info:
          "Celebrates the sacred bond between brother and sister. Sisters pray for their brother’s long life and happiness.",
      },
    ],

    dos: [
      "Light diyas and lamps",
      "Keep surroundings clean",
      "Offer prayers with devotion",
    ],

    donts: [
      "Avoid negativity and anger",
      "Avoid unnecessary noise pollution",
      
    ],

    pujaSamagri: [
      "Diya and Oil",
      "Incense sticks",
      "Flowers",
      "Sweets",
      "Coins",
      "Kalash",
    ],

    shubhMuhurat:
      "Lakshmi Puja Muhurat during Pradosh Kaal (Evening time)",

    vratKatha:
      "Diwali vrat katha narrates the story of Goddess Lakshmi visiting clean and well-lit homes, blessing devotees with prosperity and happiness.",

    spiritualBenefits: [
      "Brings peace and positivity",
      "Attracts prosperity and success",
      "Removes negativity from life",
    ],

    colorDress:
      "Red, Yellow, Gold, and White symbolize prosperity, joy, purity, and positivity.",

    rashiImpact: [
      { rashi: "Mesha (Aries)", impact: "Confidence and success" },
      { rashi: "Vrishabha (Taurus)", impact: "Financial growth" },
      { rashi: "Mithuna (Gemini)", impact: "Mental clarity" },
      { rashi: "Karka (Cancer)", impact: "Emotional peace" },
      { rashi: "Simha (Leo)", impact: "Leadership and fame" },
      { rashi: "Kanya (Virgo)", impact: "Stability and focus" },
      { rashi: "Tula (Libra)", impact: "Harmony in relationships" },
      { rashi: "Vrischika (Scorpio)", impact: "Inner strength" },
      { rashi: "Dhanu (Sagittarius)", impact: "Spiritual growth" },
      { rashi: "Makara (Capricorn)", impact: "Career progress" },
      { rashi: "Kumbha (Aquarius)", impact: "Innovative thinking" },
      { rashi: "Meena (Pisces)", impact: "Emotional healing" },
    ],
  };

  return (
    <div style={styles.container}>
      <img src={mandala} alt="mandala" style={styles.mandalaLeft} />
      <img src={mandala} alt="mandala" style={styles.mandalaRight} />

      <div style={styles.card}>
        <img src={diwaliImg} alt="Diwali" style={styles.image} />

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
          <h2 style={styles.heading}>Diwali – 5 Days</h2>
          <ul>
            {festivalData.diwaliDays.map((item, i) => (
              <li key={i}>
                <strong>{item.day}:</strong> {item.info}
              </li>
            ))}
          </ul>
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

export default Diwali;

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