import React from "react";
import mandala from "../../Assets/mandalaright-removebg-preview.png";
import shiv from "../../Assets/shiv.jpeg";

// ✅ Mahashivratri content
const festivalData = {
  name: "Mahashivratri",
  importance:
    "Mahashivratri is dedicated to Lord Shiva. It signifies overcoming darkness and ignorance in life and celebrates spiritual growth, meditation, and devotion.",
  rituals:
    "Fasting, night-long vigil, chanting Shiva mantras, performing abhishekam with milk, water, honey, and bilva leaves, visiting Shiva temples.",
  dos: [
    "Observe fast and offer prayers to Shiva",
    "Perform Rudrabhishek with devotion",
    "Chant Om Namah Shivaya",
  ],
  donts: [
    "Avoid eating non-vegetarian food",
    "Do not consume alcohol",
    "Avoid negative thoughts or arguments",
  ],
  pujaSamagri: ["Bilva leaves", "Milk", "Water", "Honey", "Fruits", "Flowers", "Incense"],
  shubhMuhurat: "12:00 AM – 6:00 AM (Main prayers & Abhishekam)",
  vratKatha:
    "The legend of Mahashivratri tells how Lord Shiva performed the Tandava (cosmic dance) and how devotees who fast and worship Shiva with devotion receive blessings.",
  spiritualBenefits: [
    "Spiritual awakening and inner peace",
    "Enhances concentration and meditation",
    "Removes negativity and fear",
  ],
  rashiImpact: [
  { rashi: "Mesha (Aries)", impact: "Energy and courage increase" },
  { rashi: "Vrishabha (Taurus)", impact: "Stability and patience improve" },
  { rashi: "Mithuna (Gemini)", impact: "Focus and learning capacity enhance" },
  { rashi: "Karka (Cancer)", impact: "Emotional balance and calmness" },
  { rashi: "Simha (Leo)", impact: "Confidence and leadership grow" },
  { rashi: "Kanya (Virgo)", impact: "Concentration and clarity improve" },
  { rashi: "Tula (Libra)", impact: "Harmony in relationships increases" },
  { rashi: "Vrischika (Scorpio)", impact: "Spiritual awareness deepens" },
  { rashi: "Dhanu (Sagittarius)", impact: "Optimism and energy rise" },
  { rashi: "Makara (Capricorn)", impact: "Spiritual growth and stability" },
  { rashi: "Kumbha (Aquarius)", impact: "Innovative ideas and learning boost" },
  { rashi: "Meena (Pisces)", impact: "Calmness, meditation, and intuition enhance" },
  ],
  colorDress: "White or light blue attire symbolizes purity and devotion.",
  homeOfficeTips: [
    "Keep a small Shiva idol in puja area",
    "Light a diya facing north-east",
    "Keep surroundings calm and clean for meditation",
  ],
  modernMeaning:
    "Mahashivratri teaches control over desires, importance of devotion, and overcoming negativity in modern life.",
};

const Mahashivratri = () => {
  return (
    <div style={styles.container}>
      {/* Mandala Background */}
      <img src={mandala} alt="mandala" style={styles.mandalaLeft} />
      <img src={mandala} alt="mandala" style={styles.mandalaRight} />

      <div style={styles.card}>
        <img src={shiv} alt="Mahashivratri" style={styles.image} />

        <h1 style={styles.title}>{festivalData.name}</h1>

        {/* Importance */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Importance</h2>
          <p style={styles.text}>{festivalData.importance}</p>
        </section>

        {/* Rituals */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Rituals</h2>
          <p style={styles.text}>{festivalData.rituals}</p>
        </section>

        {/* Do's & Don'ts */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Do's & Don'ts</h2>
          <div style={styles.dosDonts}>
            <div>
              <h3 style={styles.subHeading}>Do's</h3>
              <ul>
                {festivalData.dos.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={styles.subHeading}>Don'ts</h3>
              <ul>
                {festivalData.donts.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Puja Samagri */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Puja Samagri</h2>
          <ul>
            {festivalData.pujaSamagri.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Shubh Muhurat */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Shubh Muhurat</h2>
          <p style={styles.text}>{festivalData.shubhMuhurat}</p>
        </section>

        {/* Vrat Katha */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Vrat Katha (Short)</h2>
          <p style={styles.text}>{festivalData.vratKatha}</p>
        </section>

        {/* Spiritual Benefits */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Spiritual Benefits</h2>
          <ul>
            {festivalData.spiritualBenefits.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Rashi Wise Impact */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Rashi Wise Impact</h2>
          <ul>
            {festivalData.rashiImpact.map((item, idx) => (
              <li key={idx}>
                {item.rashi}: {item.impact}
              </li>
            ))}
          </ul>
        </section>

        {/* Color / Dress Suggestion */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Color / Dress Suggestion</h2>
          <p style={styles.text}>{festivalData.colorDress}</p>
        </section>

        {/* Home & Office Tips */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Home & Office Tips</h2>
          <ul>
            {festivalData.homeOfficeTips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </section>

        {/* Modern Meaning */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Modern Meaning</h2>
          <p style={styles.text}>{festivalData.modernMeaning}</p>
        </section>
      </div>
    </div>
  );
};

export default Mahashivratri;

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
