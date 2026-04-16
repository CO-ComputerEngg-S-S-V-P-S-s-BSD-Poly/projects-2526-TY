import React, { useState } from "react";
import mandala from "../../Assets/mandalaright-removebg-preview.png";

const mantras = [
  {
    title: "Gayatri Mantra",
    content: `
      ॐ भूर्भुवः स्वः।  
      तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि।  
      धियो यो नः प्रचोदयात्॥
      <br/><br/>
      <strong>Meaning:</strong> Awakens wisdom, intellect, and divine light.
    `,
  },
  {
    title: "Maha Mrityunjaya Mantra",
    content: `
      ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।  
      उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥
      <br/><br/>
      <strong>Meaning:</strong> Protection, healing, and liberation.
    `,
  },
  {
    title: "Om Namah Shivaya",
    content: `
      ॐ नमः शिवाय॥
      <br/><br/>
      <strong>Meaning:</strong> Inner peace and spiritual purification.
    `,
  },
  {
    title: "Ganesh Mantra",
    content: `
      ॐ गं गणपतये नमः॥
      <br/><br/>
      <strong>Meaning:</strong> Removes obstacles and brings success.
    `,
  },
  {
    title: "Lakshmi Mantra",
    content: `
      ॐ श्रीं महालक्ष्म्यै नमः॥
      <br/><br/>
      <strong>Meaning:</strong> Prosperity, wealth, and abundance.
    `,
  },
  {
    title: "Saraswati Mantra",
    content: `
      या कुन्देन्दुतुषारहारधवला  
      या शुभ्रवस्त्रावृता।
      <br/><br/>
      <strong>Meaning:</strong> Knowledge, wisdom, and creativity.
    `,
  },
  {
    title: "Hanuman Mantra",
    content: `
      ॐ नमो भगवते हनुमते नमः॥
      <br/><br/>
      <strong>Meaning:</strong> Strength, courage, and devotion.
    `,
  },
  {
    title: "Shanti Mantra",
    content: `
      ॐ सह नाववतु। सह नौ भुनक्तु।
      <br/><br/>
      <strong>Meaning:</strong> Peace and harmony.
    `,
  },
  {
    title: "Surya Mantra",
    content: `
      ॐ आदित्याय नमः॥
      <br/><br/>
      <strong>Meaning:</strong> Energy, vitality, and health.
    `,
  },
  {
    title: "Durga Mantra",
    content: `
      ॐ दुं दुर्गायै नमः॥
      <br/><br/>
      <strong>Meaning:</strong> Protection and divine strength.
    `,
  },
  {
    title: "Vishnu Mantra",
    content: `
      ॐ नमो नारायणाय॥
      <br/><br/>
      <strong>Meaning:</strong> Preservation, protection, and peace.
    `,
  },
  {
    title: "Krishna Mantra",
    content: `
      ॐ नमो भगवते वासुदेवाय॥
      <br/><br/>
      <strong>Meaning:</strong> Divine love, wisdom, and devotion.
    `,
  },
  {
    title: "Rama Mantra",
    content: `
      ॐ श्री रामाय नमः॥
      <br/><br/>
      <strong>Meaning:</strong> Righteousness, courage, and truth.
    `,
  },
  {
    title: "Navarna Mantra",
    content: `
      ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे॥
      <br/><br/>
      <strong>Meaning:</strong> Ultimate Shakti and protection.
    `,
  },
  {
    title: "Dattatreya Mantra",
    content: `
      ॐ नमो भगवते दत्तात्रेयाय॥
      <br/><br/>
      <strong>Meaning:</strong> Guru wisdom and spiritual enlightenment.
    `,
  },
  {
    title: "Kubera Mantra",
    content: `
      ॐ यक्षाय कुबेराय वैश्रवणाय धनधान्यादिपतये नमः॥
      <br/><br/>
      <strong>Meaning:</strong> Wealth, stability, and prosperity.
    `,
  },
  {
    title: "Kaal Bhairav Mantra",
    content: `
      ॐ ह्रीं बटुकाय आपदुद्धारणाय कुरु कुरु बटुकाय ह्रीं॥
      <br/><br/>
      <strong>Meaning:</strong> Protection from fear and negativity.
    `,
  },
  {
    title: "Chandra Mantra",
    content: `
      ॐ सोम सोमाय नमः॥
      <br/><br/>
      <strong>Meaning:</strong> Mental peace and emotional balance.
    `,
  },
  {
    title: "Budha Mantra",
    content: `
      ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः॥
      <br/><br/>
      <strong>Meaning:</strong> Intelligence, communication, and clarity.
    `,
  },
  {
    title: "Navagraha Shanti Mantra",
    content: `
      ॐ ब्रह्मा मुरारिस्त्रिपुरान्तकारी  
      भानुः शशी भूमिसुतो बुधश्च।
      <br/><br/>
      <strong>Meaning:</strong> Balance of planetary energies.
    `,
  },
  {
  title: "Asato Ma Sadgamaya",
  content: `
    असतो मा सद्गमय।  
    तमसो मा ज्योतिर्गमय।  
    मृत्योर्माऽमृतं गमय॥
    <br/><br/>
    <strong>Meaning:</strong> From ignorance to truth, darkness to light.
  `,
},
{
  title: "Lokah Samastah Sukhino Bhavantu",
  content: `
    लोकाः समस्ताः सुखिनो भवन्तु॥
    <br/><br/>
    <strong>Meaning:</strong> May all beings everywhere be happy and free.
  `,
},
{
  title: "Shiv Panchakshari Stotra",
  content: `
    नागेन्द्रहाराय त्रिलोचनाय  
    भस्माङ्गरागाय महेश्वराय।
    <br/><br/>
    <strong>Meaning:</strong> Praise of Lord Shiva for inner purification.
  `,
},
{
  title: "Vishnu Sahasranama (Opening)",
  content: `
    ॐ शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम्।
    <br/><br/>
    <strong>Meaning:</strong> Invocation to Lord Vishnu for protection.
  `,
},
{
  title: "Sri Sukta (Opening)",
  content: `
    हिरण्यवर्णां हरिणीं सुवर्णरजतस्रजाम्।
    <br/><br/>
    <strong>Meaning:</strong> Goddess Lakshmi invocation for prosperity.
  `,
},
{
  title: "Narayan Kavach Mantra",
  content: `
    ॐ नमो भगवते वासुदेवाय।
    <br/><br/>
    <strong>Meaning:</strong> Divine shield for protection.
  `,
},
{
  title: "Hanuman Chalisa (Opening)",
  content: `
    श्रीगुरु चरन सरोज रज  
    निज मनु मुकुरु सुधारि।
    <br/><br/>
    <strong>Meaning:</strong> Devotion, strength, and fearlessness.
  `,
},
{
  title: "Rudra Gayatri Mantra",
  content: `
    ॐ तत्पुरुषाय विद्महे  
    महादेवाय धीमहि।
    <br/><br/>
    <strong>Meaning:</strong> Awakens Shiva consciousness.
  `,
},
{
  title: "Durga Gayatri Mantra",
  content: `
    ॐ कात्यायनाय विद्महे  
    कन्यकुमारि धीमहि।
    <br/><br/>
    <strong>Meaning:</strong> Divine feminine power and protection.
  `,
},
{
  title: "Ganapati Atharvashirsha (Opening)",
  content: `
    ॐ नमस्ते गणपतये।
    <br/><br/>
    <strong>Meaning:</strong> Supreme remover of obstacles.
  `,
},
{
  title: "Navagraha Gayatri Mantra",
  content: `
    ॐ आदित्याय विद्महे दिवाकराय धीमहि।
    <br/><br/>
    <strong>Meaning:</strong> Harmonizes planetary energies.
  `,
},
{
  title: "Shiva Shadakshari Mantra",
  content: `
    ॐ नमः शिवाय॥
    <br/><br/>
    <strong>Meaning:</strong> Liberation and inner stillness.
  `,
},
{
  title: "Tulsi Mantra",
  content: `
    वृन्दायै तुलसीदेव्यै प्रियायै केशवस्य च।
    <br/><br/>
    <strong>Meaning:</strong> Purity, devotion, and protection.
  `,
},
{
  title: "Annapurna Mantra",
  content: `
    ॐ अन्नपूर्णे सदापूर्णे शंकरप्राणवल्लभे।
    <br/><br/>
    <strong>Meaning:</strong> Nourishment and abundance.
  `,
},
{
  title: "Peace Ending Mantra",
  content: `
    ॐ पूर्णमदः पूर्णमिदं पूर्णात् पूर्णमुदच्यते।
    <br/><br/>
    <strong>Meaning:</strong> Wholeness and universal peace.
  `,
},

];

const VedicMantras = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div style={styles.container}>
      {/* Mandala Images */}
      <img src={mandala} alt="mandala" style={styles.mandalaLeft} />
      <img src={mandala} alt="mandala" style={styles.mandalaRight} />

      <h1 style={styles.title}>Vedic Mantras</h1>
      <p style={styles.subtitle}>
        Sacred mantras for peace, protection, prosperity & spiritual upliftment
      </p>

      <div style={styles.wrapper}>
        {mantras.map((item, index) => (
          <div
            key={index}
            style={{
              ...styles.card,
              ...(openIndex === index ? styles.activeCard : {}),
            }}
          >
            <div
              style={styles.header}
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            >
              <h3 style={styles.headerText}>{item.title}</h3>
              <span style={styles.icon}>
                {openIndex === index ? "−" : "+"}
              </span>
            </div>

            {openIndex === index && (
              <div
                style={styles.content}
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VedicMantras;

/* 🔮 INLINE CSS */
const styles = {
  container: {
    minHeight: "100vh",
    padding: "90px 20px",
    background: "linear-gradient(to bottom, #fff8ee, #ffffff)",
    position: "relative",
    overflow: "hidden",
    animation: "fadeIn 1s ease",
  },
  mandalaLeft: {
    position: "absolute",
    left: "-60px",
    top: "120px",
    width: "600px",
    opacity: 0.18,
    animation: "rotateSlow 30s linear infinite",
  },
  mandalaRight: {
    position: "absolute",
    right: "-60px",
    bottom: "100px",
    width: "600px",
    opacity: 0.18,
    animation: "rotateSlow 30s linear infinite reverse",
  },
  title: {
    textAlign: "center",
    fontSize: "38px",
    color: "#e65100",
    marginBottom: "10px",
    position: "relative",
    zIndex: 2,
  },
  subtitle: {
    textAlign: "center",
    fontSize: "16px",
    color: "#666",
    marginBottom: "50px",
    position: "relative",
    zIndex: 2,
  },
  wrapper: {
    maxWidth: "900px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "22px",
    position: "relative",
    zIndex: 2,
  },
  card: {
    background: "#ffffff",
    borderRadius: "18px",
    boxShadow: "0 10px 26px rgba(0,0,0,0.1)",
    overflow: "hidden",
    transition: "all 0.35s ease",
  },
  activeCard: {
    transform: "scale(1.01)",
    boxShadow: "0 16px 36px rgba(0,0,0,0.15)",
  },
 header: {
  padding: "20px 24px",
  display: "flex",
  justifyContent: "space-between",
  cursor: "pointer",
  background: "linear-gradient(to right, #ff7a18, #ee6820)",
},
headerText: {
  fontSize: "20px",
  margin: 0,
  color: "#ffffff",
},
icon: {
  fontSize: "26px",
  fontWeight: "bold",
  color: "#ffffff",
},

  content: {
    padding: "22px 26px",
    fontSize: "15px",
    lineHeight: "1.9",
    color: "#444",
    animation: "slideDown 0.4s ease",
  },
};

/* ✨ Animations */
const sheet = document.styleSheets[0];
sheet.insertRule(`
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}`, sheet.cssRules.length);

sheet.insertRule(`
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}`, sheet.cssRules.length);

sheet.insertRule(`
@keyframes rotateSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`, sheet.cssRules.length);