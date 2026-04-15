import React from "react";
import mandala from "../../Assets/mandalaright-removebg-preview.png";
import ashadiImg from "../../Assets/ekadashi.jpeg";

const AshadiEkadashi = () => {
  const festivalData = {
    name: "Ashadi Ekadashi",

    importance:
      "Ashadi Ekadashi is one of the most sacred festivals dedicated to Lord Vitthal (Vithoba). It signifies devotion, faith, and the spiritual journey of devotees toward righteousness.",

    rituals:
      "Devotees observe fasting, chant Vitthal naam, participate in Wari pilgrimage, and offer prayers with deep devotion.",

    dos: [
      "Observe Ekadashi vrat sincerely",
      "Chant Vitthal–Vitthal naam",
      "Maintain purity in thoughts and actions",
    ],

    donts: [
      "Avoid consumption of grains",
      "Avoid anger and negative thoughts",
      "Do not indulge in luxury",
    ],

    pujaSamagri: [
      "Idol or picture of Lord Vitthal",
      "Tulsi leaves",
      "Diya and incense",
      "Flowers",
      "Naivedya (fruits or sabudana)",
    ],

    shubhMuhurat: "Early morning Brahma Muhurat",

    vratKatha:
      "Ashadi Ekadashi katha narrates the devotion of saints like Dnyaneshwar and Tukaram, inspiring surrender and unwavering faith in Lord Vitthal.",

    spiritualBenefits: [
      "Purifies mind and soul",
      "Increases devotion and discipline",
      "Removes negative karmas",
    ],

    rashiImpact: [
      { rashi: "Mesha (Aries)", impact: "Spiritual growth and peace" },
      { rashi: "Vrishabha (Taurus)", impact: "Mental stability and devotion" },
      { rashi: "Mithuna (Gemini)", impact: "Clarity in thoughts" },
      { rashi: "Karka (Cancer)", impact: "Emotional balance" },
      { rashi: "Simha (Leo)", impact: "Humility and patience" },
      { rashi: "Kanya (Virgo)", impact: "Inner discipline" },
      { rashi: "Tula (Libra)", impact: "Harmony and calmness" },
      { rashi: "Vrishchika (Scorpio)", impact: "Spiritual awakening" },
      { rashi: "Dhanu (Sagittarius)", impact: "Positive mindset" },
      { rashi: "Makara (Capricorn)", impact: "Relief from stress" },
      { rashi: "Kumbha (Aquarius)", impact: "Devotional inclination" },
      { rashi: "Meena (Pisces)", impact: "Deep spiritual connection" },
    ],

    colorDress:
      "White or saffron symbolizes purity, devotion, and spiritual discipline.",

    homeOfficeTips: [
      "Keep home clean and peaceful",
      "Light a diya near Tulsi plant",
      "Play Vitthal bhajans",
    ],

    modernMeaning:
      "Ashadi Ekadashi teaches simplicity, devotion, equality, and spiritual discipline in modern life.",
  };

  return (
    <div style={styles.container}>
      <img src={mandala} alt="mandala" style={styles.mandalaLeft} />
      <img src={mandala} alt="mandala" style={styles.mandalaRight} />

      <div style={styles.card}>
        <img src={ashadiImg} alt="Ashadi Ekadashi" style={styles.image} />

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
          <ul>{festivalData.pujaSamagri.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Spiritual Benefits</h2>
          <ul>{festivalData.spiritualBenefits.map((b, i) => <li key={i}>{b}</li>)}</ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Rashi Wise Impact</h2>
          <ul>
            {festivalData.rashiImpact.map((r, i) => (
              <li key={i}>{r.rashi}: {r.impact}</li>
            ))}
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>Home & Office Tips</h2>
          <ul>{festivalData.homeOfficeTips.map((t, i) => <li key={i}>{t}</li>)}</ul>
        </section>
      </div>
    </div>
  );
};

export default AshadiEkadashi;

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