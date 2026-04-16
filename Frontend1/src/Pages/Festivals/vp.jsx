import React from "react";
import mandala from "../../Assets/mandalaright-removebg-preview.png";
import panchami from "../../Assets/panchami.jpeg";

// ✅ Vasant Panchami content
const festivalData = {
  name: "Vasant Panchami",
  importance:
    "Vasant Panchami celebrates Goddess Saraswati, the goddess of knowledge, music, and arts. It marks the onset of spring.",
  rituals:
    "Offering prayers to Saraswati, placing books and musical instruments near her idol, wearing yellow clothes, and preparing yellow sweets.",
  dos: [
    "Wear yellow attire",
    "Offer yellow flowers to Goddess Saraswati",
    "Initiate learning activities on this day",
  ],
  donts: ["Avoid negativity", "Do not consume non-vegetarian food"],
  pujaSamagri: ["Yellow flowers", "Books", "Musical instruments", "Sweets"],
  shubhMuhurat: "Morning 8:00 AM – 12:00 PM",
  vratKatha:
    "The story emphasizes devotion to knowledge and learning. Worshipping Saraswati on this day blesses devotees with wisdom and intelligence.",
  spiritualBenefits: [
    "Enhances learning and concentration",
    "Encourages creativity",
    "Brings calm and focus",
  ],
  rashiImpact: [
   { rashi: "Mesha (Aries)", impact: "Learning skills enhanced" },
  { rashi: "Vrishabha (Taurus)", impact: "Focus and patience improve" },
  { rashi: "Mithuna (Gemini)", impact: "Creativity and curiosity increase" },
  { rashi: "Karka (Cancer)", impact: "Calmness and concentration improve" },
  { rashi: "Simha (Leo)", impact: "Confidence in learning grows" },
  { rashi: "Kanya (Virgo)", impact: "Analytical skills and intelligence improve" },
  { rashi: "Tula (Libra)", impact: "Balanced thinking enhances" },
  { rashi: "Vrischika (Scorpio)", impact: "Determination and focus strengthen" },
  { rashi: "Dhanu (Sagittarius)", impact: "Optimism and knowledge-seeking rise" },
  { rashi: "Makara (Capricorn)", impact: "Career learning and discipline enhance" },
  { rashi: "Kumbha (Aquarius)", impact: "Innovative ideas and creativity boost" },
  { rashi: "Meena (Pisces)", impact: "Spiritual learning and intuition increase" },
  ],
  colorDress: "Yellow attire symbolizes knowledge and prosperity",
  homeOfficeTips: ["Place books and study materials neatly", "Keep the work/study area clean"],
  modernMeaning:
    "Vasant Panchami highlights education, arts, and new beginnings in career or studies.",
};

const VasantPanchami = () => {
  return (
    <div style={styles.container}>
      {/* Mandala Background */}
      <img src={mandala} alt="mandala" style={styles.mandalaLeft} />
      <img src={mandala} alt="mandala" style={styles.mandalaRight} />

      <div style={styles.card}>
        <img src={panchami} alt="Vasant Panchami" style={styles.image} />

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

export default VasantPanchami;

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
