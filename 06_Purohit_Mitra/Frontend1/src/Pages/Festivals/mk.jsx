import React from "react";
import mandala from "../../Assets/mandalaright-removebg-preview.png";
import makar from "../../Assets/makar.jpeg";

const MakarSankranti = () => {
  // ✅ Festival content data
  const festivalData = {
    name: "Makar Sankranti",
    importance:
      "Makar Sankranti marks the transition of the Sun into Makara Rashi (Capricorn), symbolizing positivity, growth, prosperity, and new beginnings.",
    rituals:
      "People take holy dips in rivers, donate food and clothes, prepare til-gud sweets, and fly kites. The phrase 'Til-gud ghya ani god god bola' spreads harmony and sweetness.",
    dos: [
      "Offer til-gud and sweets to family and friends",
      "Take holy dips in rivers",
      "Donate food or clothes to the needy",
    ],
    donts: [
      "Avoid consuming non-vegetarian food",
      "Do not waste food",
      "Avoid arguments and negativity",
    ],
    pujaSamagri: ["Til-gud sweets", "Fruits", "Flowers", "Kite", "Diya"],
    shubhMuhurat: "10:30 AM – 12:30 PM (main kite flying & prayers)",
    vratKatha:
      "Makar Sankranti vrat story teaches about the importance of sun worship and generosity. It is said that those who observe the fast with devotion receive blessings of prosperity.",
    spiritualBenefits: [
      "Enhances positivity and joy",
      "Promotes discipline and routine",
      "Strengthens family and social bonds",
    ],
    rashiImpact: [
      { rashi: "Mesha (Aries)", impact: "Energy and enthusiasm increase" },
  { rashi: "Vrishabha (Taurus)", impact: "Financial stability improves" },
  { rashi: "Mithuna (Gemini)", impact: "Communication and learning enhance" },
  { rashi: "Karka (Cancer)", impact: "Emotional balance and peace" },
  { rashi: "Simha (Leo)", impact: "Confidence and leadership grow" },
  { rashi: "Kanya (Virgo)", impact: "Focus on career and health improves" },
  { rashi: "Tula (Libra)", impact: "Harmony in relationships increases" },
  { rashi: "Vrischika (Scorpio)", impact: "Determination and patience strengthen" },
  { rashi: "Dhanu (Sagittarius)", impact: "Optimism and adventure boost" },
  { rashi: "Makara (Capricorn)", impact: "Career stability and growth" },
  { rashi: "Kumbha (Aquarius)", impact: "Innovative ideas and networking improve" },
  { rashi: "Meena (Pisces)", impact: "Spiritual awareness and intuition increase" },

    ],
    colorDress: "Traditional yellow or orange attire symbolizes energy and positivity.",
    homeOfficeTips: [
      "Light a diya in the north-east corner",
      "Keep the puja area clean and clutter-free",
      "Use fresh flowers for decoration",
    ],
    modernMeaning:
      "Makar Sankranti reminds us to celebrate hard work, generosity, and community bonding beyond traditional rituals.",
    videoLink: "https://www.youtube.com/embed/VIDEO_ID", // replace VIDEO_ID
  };

  return (
    <div style={styles.container}>
      {/* Mandala Background */}
      <img src={mandala} alt="mandala" style={styles.mandalaLeft} />
      <img src={mandala} alt="mandala" style={styles.mandalaRight} />

      <div style={styles.card}>
        <img src={makar} alt="Makar Sankranti" style={styles.image} />

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
      </div>
    </div>
  );
};

export default MakarSankranti;

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
