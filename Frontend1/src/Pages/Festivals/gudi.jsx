import React from "react";
import mandala from "../../Assets/mandalaright-removebg-preview.png";
import gudhi from "../../Assets/gudi.jpeg";

const Gudhipadwa = () => {
  // ✅ Festival content data
  const festivalData = {
    name: "Gudhi Padwa",
    importance:
      "Gudhi Padwa marks the beginning of the Marathi New Year. It symbolizes victory, prosperity, happiness, and a fresh start filled with hope and positivity.",
    rituals:
      "People clean their homes, hoist the Gudhi outside, wear traditional clothes, and prepare festive dishes like puran poli. Families greet each other with joy and positivity.",
    dos: [
      "Hoist Gudhi early in the morning",
      "Wear traditional attire",
      "Prepare and share festive sweets",
    ],
    donts: [
      "Avoid negativity and arguments",
      "Do not delay Gudhi installation",
      "Avoid laziness on this auspicious day",
    ],
    pujaSamagri: [
      "Gudhi (bamboo stick)",
      "Silk cloth",
      "Neem leaves",
      "Sugar crystals",
      "Kalash and flowers",
    ],
    shubhMuhurat: "6:30 AM – 9:30 AM (Gudhi Sthapana time)",
    vratKatha:
      "Gudhi Padwa vrat katha signifies the victory of good over evil and the coronation of Chhatrapati Shivaji Maharaj. It inspires people to begin the new year with courage and optimism.",
    spiritualBenefits: [
      "Brings positivity and prosperity",
      "Removes negative energies",
      "Encourages discipline and fresh beginnings",
    ],
    rashiImpact: [
  { rashi: "Mesha (Aries)", impact: "New beginnings and confidence increase" },
  { rashi: "Vrishabha (Taurus)", impact: "Financial stability and comfort" },
  { rashi: "Mithuna (Gemini)", impact: "Communication and learning improve" },
  { rashi: "Karka (Cancer)", impact: "Emotional balance and family harmony" },
  { rashi: "Simha (Leo)", impact: "Leadership and recognition grow" },
  { rashi: "Kanya (Virgo)", impact: "Planning and productivity improve" },
  { rashi: "Tula (Libra)", impact: "Relationships and peace strengthen" },
  { rashi: "Vrishchika (Scorpio)", impact: "Inner strength and transformation" },
  { rashi: "Dhanu (Sagittarius)", impact: "Positive outlook and opportunities" },
  { rashi: "Makara (Capricorn)", impact: "Career growth and stability" },
  { rashi: "Kumbha (Aquarius)", impact: "Innovative ideas and clarity" },
  { rashi: "Meena (Pisces)", impact: "Spiritual growth and creativity" },
],

    colorDress:
      "Green, yellow, or traditional Maharashtrian attire symbolizes growth, prosperity, and happiness.",
    homeOfficeTips: [
      "Hoist Gudhi at the main entrance",
      "Decorate with rangoli and flowers",
      "Keep home clean and well-lit",
    ],
    modernMeaning:
      "Gudhi Padwa reminds us to welcome change, celebrate achievements, and start the new year with confidence and positivity.",
  };

  return (
    <div style={styles.container}>
      {/* Mandala Background */}
      <img src={mandala} alt="mandala" style={styles.mandalaLeft} />
      <img src={mandala} alt="mandala" style={styles.mandalaRight} />

      <div style={styles.card}>
        <img src={gudhi} alt="Gudhi Padwa" style={styles.image} />

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

        {/* Color / Dress */}
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

export default Gudhipadwa;

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