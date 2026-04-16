import React from "react";
import mandala from "../../Assets/mandalaright-removebg-preview.png";
import ganpati from "../../Assets/ganpati.jpeg";

// ✅ Ganesh Chaturthi content
const festivalData = {
  name: "Ganesh Chaturthi",
  importance:
    "Ganesh Chaturthi celebrates Lord Ganesha, the remover of obstacles. It marks new beginnings, prosperity, and wisdom.",
  rituals:
    "Install Ganesha idol, perform daily aarti, offer modaks, flowers, and chant Ganapati mantras, and immerse idol at festival end.",
  dos: [
    "Offer modaks and fruits",
    "Perform Ganesh Aarti daily",
    "Keep surroundings clean and pure",
  ],
  donts: [
    "Do not consume alcohol",
    "Avoid negative thoughts",
    "Do not harm the environment during immersion",
  ],
  pujaSamagri: ["Modaks", "Flowers", "Incense sticks", "Fruits", "Water for immersion"],
  shubhMuhurat: "Morning 6:00 AM – 10:00 AM (Ganesh Aarti & Prayers)",
  vratKatha:
    "The story narrates how Ganesha was created by Parvati and became the remover of obstacles for his devotees.",
  spiritualBenefits: [
    "Removes obstacles in life",
    "Promotes wisdom and patience",
    "Strengthens family and community bonds",
  ],
  rashiImpact: [
    { rashi: "Mesha (Aries)", impact: "Leadership and confidence increase" },
  { rashi: "Vrishabha (Taurus)", impact: "Financial planning improves" },
  { rashi: "Mithuna (Gemini)", impact: "Focus and learning capacity enhance" },
  { rashi: "Karka (Cancer)", impact: "Family harmony improves" },
  { rashi: "Simha (Leo)", impact: "Creativity and boldness grow" },
  { rashi: "Kanya (Virgo)", impact: "Discipline and analytical skills enhance" },
  { rashi: "Tula (Libra)", impact: "Relationship balance improves" },
  { rashi: "Vrischika (Scorpio)", impact: "Determination and problem-solving increase" },
  { rashi: "Dhanu (Sagittarius)", impact: "Optimism and energy rise" },
  { rashi: "Makara (Capricorn)", impact: "Career stability strengthens" },
  { rashi: "Kumbha (Aquarius)", impact: "Innovative thinking and learning boost" },
  { rashi: "Meena (Pisces)", impact: "Spiritual growth and emotional intelligence enhance" },
  ],
  colorDress: "Red or orange attire symbolizes energy and devotion",
  homeOfficeTips: [
    "Place Ganesha idol in North-East corner",
    "Keep puja area clean",
    "Light diya during prayers",
  ],
  modernMeaning:
    "Ganesh Chaturthi teaches overcoming obstacles, patience, and wisdom in everyday life.",
};

const GaneshChaturthi = () => {
  return (
    <div style={styles.container}>
      {/* Mandala Background */}
      <img src={mandala} alt="mandala" style={styles.mandalaLeft} />
      <img src={mandala} alt="mandala" style={styles.mandalaRight} />

      <div style={styles.card}>
        <img src={ganpati} alt="Ganesh Chaturthi" style={styles.image} />

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

export default GaneshChaturthi;

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
