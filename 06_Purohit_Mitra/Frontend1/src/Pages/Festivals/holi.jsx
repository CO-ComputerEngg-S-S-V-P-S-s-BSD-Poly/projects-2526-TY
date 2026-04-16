import React from "react";
import mandala from "../../Assets/mandalaright-removebg-preview.png";
import holiimg from "../../Assets/holi.jpeg";

// ✅ Holi content
const festivalData = {
  name: "Holi",
  importance:
    "Holi marks the victory of good over evil and the arrival of spring. It celebrates colors, unity, and joy among friends and family.",
  rituals:
    "Playing with colors, lighting Holika bonfire, singing and dancing, exchanging sweets and greetings.",
  dos: [
    "Use natural colors",
    "Play with friends and family safely",
    "Forgive and forget past grudges",
  ],
  donts: [
    "Avoid harmful chemical colors",
    "Do not force anyone to play",
    "Avoid wasting water unnecessarily",
  ],
  pujaSamagri: ["Dry colors", "Water balloons", "Sweets", "Fruits"],
  shubhMuhurat: "Morning 9:00 AM – 12:00 PM (Color play)",
  vratKatha:
    "Holi story revolves around Prahlad and Holika, teaching devotion, faith, and triumph of good over evil.",
  spiritualBenefits: [
    "Encourages forgiveness and joy",
    "Strengthens social bonds",
    "Removes negative energy",
  ],
  rashiImpact: [
    { rashi: "Mesha (Aries)", impact: "Boosts energy and fun" },
  { rashi: "Vrishabha (Taurus)", impact: "Financial optimism increases" },
  { rashi: "Mithuna (Gemini)", impact: "Social interactions and joy improve" },
  { rashi: "Karka (Cancer)", impact: "Emotional happiness and bonding" },
  { rashi: "Simha (Leo)", impact: "Confidence and adventurous spirit rise" },
  { rashi: "Kanya (Virgo)", impact: "Focus on creativity and organization" },
  { rashi: "Tula (Libra)", impact: "Harmony in friendships and relationships" },
  { rashi: "Vrischika (Scorpio)", impact: "Passion and emotional intensity balance" },
  { rashi: "Dhanu (Sagittarius)", impact: "Optimism, joy, and travel enthusiasm" },
  { rashi: "Makara (Capricorn)", impact: "Career creativity and energy increase" },
  { rashi: "Kumbha (Aquarius)", impact: "Innovative ideas and social fun" },
  { rashi: "Meena (Pisces)", impact: "Spiritual joy and intuition boost" },
  ],
  colorDress: "White clothes to show vibrant colors effectively",
  homeOfficeTips: ["Keep surroundings safe from color stains", "Protect valuables from colors"],
  modernMeaning:
    "Holi encourages letting go of grudges, celebrating life, and bonding beyond differences.",
};

const Holi = () => {
  return (
    <div style={styles.container}>
      {/* Mandala Background */}
      <img src={mandala} alt="mandala" style={styles.mandalaLeft} />
      <img src={mandala} alt="mandala" style={styles.mandalaRight} />

      <div style={styles.card}>
        <img src={holiimg} alt="Holi" style={styles.image} />

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

export default Holi;

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
