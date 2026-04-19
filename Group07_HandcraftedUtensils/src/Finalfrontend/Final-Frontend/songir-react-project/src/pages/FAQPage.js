import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ══════════════════════════════════════════════════════
   FAQ DATA
══════════════════════════════════════════════════════ */
const FAQ_CATEGORIES = [
  {
    id: "materials",
    label: "Materials & Authenticity",
    icon: "🏺",
    faqs: [
      {
        q: "What materials are used in your handicrafts?",
        a: "We use only premium-grade pure copper (99.9% purity) and high-quality brass (70% copper, 30% zinc) alloy. All our god statues use traditional Panchadhatu (five sacred metals). No plating or coating — solid metal all the way through.",
      },
      {
        q: "Are your handicrafts authentic and certified?",
        a: "Yes, absolutely. Every product is handcrafted by certified master artisans from Songir, Moradabad, Mathura, and Jaipur. Each item comes with a certificate of authenticity. We directly source from artisan families with 3–5 generations of craft heritage.",
      },
      {
        q: "Do handmade products have slight variations?",
        a: "Yes, and that's what makes them truly special! Slight variations in weight (±5%), dimensions, and color tone are hallmarks of genuine artisan craftsmanship. No two pieces are exactly alike — each carries the unique touch of the artisan who made it.",
      },
      {
        q: "Will the color of brass/copper change over time?",
        a: "Yes, brass and copper naturally develop a patina with age. This adds charm, depth, and antique value to the piece. Regular gentle cleaning and polishing will maintain the original golden/copper glow. The patina can also be preserved for an antique aesthetic.",
      },
    ],
  },
  {
    id: "craftsmanship",
    label: "Craftsmanship & Making",
    icon: "🔨",
    faqs: [
      {
        q: "How are your products made?",
        a: "Using centuries-old traditional techniques like sand casting, lost-wax casting (Dhokra), hand-hammering, and intricate engraving. Every piece is shaped, polished, and finished entirely by hand. No machine mass-production — each item is a work of living heritage.",
      },
      {
        q: "Where are your products crafted?",
        a: "All products originate from Songir, a heritage village in Maharashtra known for its master metalwork artisans. We also source select items from Moradabad (Brass City of India) and Mathura for divine idols. Every origin is transparently disclosed on the product page.",
      },
      {
        q: "Who are your artisans?",
        a: "Our artisans are certified master craftspeople — many from families with 4–6 generations of metalwork heritage. They include National Award winners and artisans recognized by the Handicrafts Development Corporation. By purchasing from us, you directly support their livelihoods.",
      },
    ],
  },
  {
    id: "care",
    label: "Care & Maintenance",
    icon: "✨",
    faqs: [
      {
        q: "How do I care for my brass and copper handicrafts?",
        a: "Clean regularly with mild soap and warm water using a soft cloth. For deep cleaning, apply Pitambari powder or a lemon-salt paste, scrub gently in circular motions, rinse well, and air dry completely. Polish every 2–3 months to maintain shine. Never use harsh abrasives or steel wool.",
      },
      {
        q: "Can copper and brass utensils be used for daily cooking?",
        a: "Brass is excellent for storage and serving. Copper is traditionally used for water storage (overnight) and serving. For cooking, tin-lined (kalai) copper vessels are recommended. Our product pages clearly mention the intended use for each item.",
      },
      {
        q: "How do I store my brass/copper items to prevent tarnishing?",
        a: "After cleaning and drying completely, wrap items in soft, dry cloth or tissue paper. Store in a cool, dry place away from humidity. You can also apply a thin coat of coconut or mustard oil before storing for long periods. Avoid plastic bags as they trap moisture.",
      },
    ],
  },
  {
    id: "orders",
    label: "Orders & Delivery",
    icon: "📦",
    faqs: [
      {
        q: "Do you offer customization?",
        a: "Yes! We offer custom engravings (names, messages, dates), special sizes, personalized designs, and premium corporate gifting packages for bulk orders of 10+ pieces. For custom orders, delivery time is 7–14 working days. Contact us: +91 96362 88882.",
      },
      {
        q: "What is your return and exchange policy?",
        a: "We offer a 7-day hassle-free return policy. Items must be unused and in original packaging. Damaged or defective items are replaced free of charge — just send us a photo within 48 hours of delivery. Custom-engraved items are non-returnable unless defective.",
      },
      {
        q: "How is my order packed and shipped?",
        a: "Every item is individually wrapped in soft cloth, placed in protective foam, and packed in a premium box. Fragile items get double-boxing. We ship via trusted courier partners with full tracking. Delivery typically takes 3–7 business days across India.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to 40+ countries. International shipping typically takes 10–21 business days depending on destination. Customs duties and import taxes are the responsibility of the buyer. Contact us for a shipping quote: +91 96362 88882.",
      },
    ],
  },
  {
    id: "health",
    label: "Health & Benefits",
    icon: "💛",
    faqs: [
      {
        q: "What are the health benefits of drinking water stored in copper vessels?",
        a: "According to Ayurveda and modern science, water stored in copper vessels overnight (8+ hours) acquires antimicrobial properties, aids digestion, boosts immunity, and provides trace copper minerals beneficial for joint health and skin. This is called 'Tamra Jal' in Ayurveda.",
      },
      {
        q: "Is brass safe for cooking and eating?",
        a: "Yes, brass has been used for cooking and eating for thousands of years across India. It has natural antimicrobial properties and is 100% free of synthetic coatings. For acidic foods, using tin-lined (kalai) brass vessels is recommended. Our product pages specify food-safe usage.",
      },
      {
        q: "Are your products chemical-free?",
        a: "All our products are made from pure metals with no synthetic coatings, paints, or chemical treatments. The natural golden and copper finish is achieved through traditional polishing with natural materials. Safe for the whole family, including children and elders.",
      },
    ],
  },
];

export default function FAQPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("materials");
  const [openIdx, setOpenIdx] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const currentCat = FAQ_CATEGORIES.find(c => c.id === activeCategory);

  const filteredFAQs = searchTerm.trim()
    ? FAQ_CATEGORIES.flatMap(cat => cat.faqs).filter(
        f =>
          f.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.a.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : currentCat?.faqs || [];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#fdfaf5", minHeight: "100vh", paddingBottom: 80 }}>
      {/* HEADER */}
      <div
        style={{
          background: "linear-gradient(160deg,#1a0800 0%,#3d1f0a 60%,#1a0800 100%)",
          padding: "72px 48px 80px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative radial */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 60%,rgba(184,115,51,.12) 0%,transparent 55%),radial-gradient(ellipse at 80% 20%,rgba(212,160,23,.07) 0%,transparent 40%)", pointerEvents: "none" }} />
        <p style={{ color: "#d4a017", fontSize: 11, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 14, position: "relative" }}>
          Help Centre
        </p>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(36px,5vw,58px)",
            fontWeight: 700,
            color: "#fff8ee",
            margin: "0 0 18px",
            position: "relative",
            lineHeight: 1.15,
          }}
        >
          Frequently Asked Questions
        </h1>
        <p style={{ color: "rgba(255,255,255,.6)", fontSize: 16, maxWidth: 580, margin: "0 auto 36px", lineHeight: 1.8, position: "relative" }}>
          Everything you need to know about our traditional metalware, craftsmanship, care instructions, and orders
        </p>

        {/* Search bar */}
        <div style={{ maxWidth: 540, margin: "0 auto", position: "relative" }}>
          <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,.4)", fontSize: 18 }}>🔍</span>
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setOpenIdx(null); }}
            style={{
              width: "100%",
              padding: "15px 20px 15px 50px",
              borderRadius: 50,
              border: "1.5px solid rgba(212,160,23,.3)",
              background: "rgba(255,255,255,.08)",
              backdropFilter: "blur(8px)",
              color: "#fff",
              fontSize: 15,
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              style={{ position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,.5)", cursor: "pointer", fontSize: 18 }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{ position: "absolute", top: 24, left: 40, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", color: "#fff", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", backdropFilter: "blur(6px)" }}
        >
          ← Back
        </button>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "60px 40px" }}>
        {!searchTerm && (
          <>
            {/* Category tabs */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 48, justifyContent: "center" }}>
              {FAQ_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setOpenIdx(null); }}
                  style={{
                    padding: "10px 22px",
                    borderRadius: 50,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    transition: "all .25s",
                    background: activeCategory === cat.id ? "linear-gradient(135deg,#b87333,#d4a017)" : "#fff",
                    color: activeCategory === cat.id ? "#fff" : "#7a5c3a",
                    boxShadow: activeCategory === cat.id ? "0 6px 20px rgba(184,115,51,.3)" : "0 2px 8px rgba(0,0,0,.06)",
                    border: activeCategory === cat.id ? "none" : "1.5px solid #f0e8dc",
                  }}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* Category heading */}
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <span style={{ fontSize: 48 }}>{currentCat?.icon}</span>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: "#1a0800", margin: "10px 0 6px" }}>
                {currentCat?.label}
              </h2>
              <div style={{ width: 48, height: 3, background: "linear-gradient(90deg,#b87333,#d4a017)", borderRadius: 2, margin: "0 auto" }} />
            </div>
          </>
        )}

        {/* Search heading */}
        {searchTerm && (
          <div style={{ marginBottom: 32 }}>
            <p style={{ color: "#7a5c3a", fontSize: 15 }}>
              Showing <strong>{filteredFAQs.length}</strong> result{filteredFAQs.length !== 1 ? "s" : ""} for <strong>"{searchTerm}"</strong>
            </p>
          </div>
        )}

        {/* FAQ Accordion */}
        {filteredFAQs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🔎</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, color: "#1a0800", margin: "0 0 10px" }}>No questions found</h3>
            <p style={{ color: "#9a8070", fontSize: 14 }}>Try a different search term or browse by category</p>
            <button onClick={() => setSearchTerm("")} style={{ marginTop: 20, padding: "10px 28px", background: "linear-gradient(135deg,#b87333,#d4a017)", color: "#fff", border: "none", borderRadius: 50, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
              Clear Search
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filteredFAQs.map((faq, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1.5px solid",
                  borderColor: openIdx === i ? "#d4a017" : "#f0e8dc",
                  boxShadow: openIdx === i ? "0 8px 32px rgba(184,115,51,.14)" : "0 2px 12px rgba(0,0,0,.04)",
                  transition: "all .3s cubic-bezier(.22,1,.36,1)",
                }}
              >
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px 24px",
                    background: openIdx === i ? "linear-gradient(135deg,#4a1010,#7a1e1e)" : "#fff",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                    fontWeight: 700,
                    fontSize: 15,
                    color: openIdx === i ? "#fff" : "#2c1810",
                    textAlign: "left",
                    gap: 16,
                    transition: "all .25s",
                  }}
                >
                  <span style={{ flex: 1, lineHeight: 1.5 }}>{faq.q}</span>
                  <span
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: openIdx === i ? "rgba(212,160,23,.3)" : "rgba(184,115,51,.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      fontWeight: 300,
                      color: openIdx === i ? "#d4a017" : "#b87333",
                      transform: openIdx === i ? "rotate(45deg)" : "none",
                      transition: "transform .3s cubic-bezier(.34,1.56,.64,1)",
                      flexShrink: 0,
                    }}
                  >
                    +
                  </span>
                </button>
                {openIdx === i && (
                  <div
                    style={{
                      padding: "20px 24px 24px",
                      background: "#fff8f2",
                      borderTop: "1px solid #f0e0c4",
                      fontSize: 14.5,
                      color: "#5a4030",
                      lineHeight: 1.8,
                      animation: "faqIn .22s ease",
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA section */}
        <div
          style={{
            marginTop: 64,
            background: "linear-gradient(160deg,#1a0800,#3d1f0a)",
            borderRadius: 24,
            padding: "52px 48px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 80%,rgba(184,115,51,.1) 0%,transparent 60%)", pointerEvents: "none" }} />
          <p style={{ color: "#d4a017", fontSize: 11, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 12 }}>
            Still Have Questions?
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, color: "#fff8ee", margin: "0 0 14px", fontWeight: 700 }}>
            We're Here to Help
          </h2>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: 15, maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.8 }}>
            Can't find your answer? Our team of artisan experts is just a call away
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="tel:+919636288882"
              style={{
                padding: "14px 32px",
                background: "linear-gradient(135deg,#b87333,#d4a017)",
                color: "#fff",
                borderRadius: 50,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 6px 24px rgba(184,115,51,.4)",
              }}
            >
              📞 +91 96362 88882
            </a>
            <button
              onClick={() => navigate("/ContactPage")}
              style={{
                padding: "14px 32px",
                background: "rgba(255,255,255,.08)",
                color: "#fff",
                borderRadius: 50,
                fontWeight: 700,
                fontSize: 14,
                border: "1.5px solid rgba(255,255,255,.2)",
                cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
                backdropFilter: "blur(6px)",
              }}
            >
              ✉️ Contact Us
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes faqIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:none; } }
        input::placeholder { color: rgba(255,255,255,.35); }
      `}</style>
    </div>
  );
}