import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";

// ✅ Fallback shops — agar backend se na aaye tab bhi form kaam kare
// IMPORTANT: Ye _id apne MongoDB ke real shop _id se replace karo
const FALLBACK_SHOPS = [
  { _id: "REPLACE_WITH_REAL_SHOP_ID_1", name: "Sharma Brass Works" },
  { _id: "REPLACE_WITH_REAL_SHOP_ID_2", name: "Patil Copper Crafts" },
  { _id: "REPLACE_WITH_REAL_SHOP_ID_3", name: "Gupta Metal Arts" },
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Lato:wght@400;600;700&display=swap');
* { box-sizing: border-box; }
.hq-page { background: linear-gradient(160deg, #FFF8F0 0%, #FFF0DC 50%, #FAF6F0 100%); min-height: 100vh; padding: 40px 20px 60px; font-family: 'Lato', sans-serif; }
.hq-header { text-align: center; max-width: 680px; margin: 0 auto 36px; }
.hq-badge { display: inline-block; background: linear-gradient(135deg, #ffe0b2, #ffd08a); color: #C45C00; padding: 6px 18px; border-radius: 30px; font-size: 12px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; border: 1px solid rgba(184,115,51,0.3); margin-bottom: 16px; }
.hq-heading { font-family: 'Playfair Display', serif; font-size: 38px; color: #3E2723; margin: 0 0 12px; line-height: 1.2; }
.hq-subheading { color: #9E8272; font-size: 15px; line-height: 1.6; margin: 0; }
.hq-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; max-width: 680px; margin: 0 auto 32px; }
.hq-feature-card { background: #fff; padding: 18px 20px; border-radius: 13px; border: 1px solid #EED9BE; box-shadow: 0 2px 10px rgba(184,115,51,0.07); text-align: center; }
.hq-feature-icon { font-size: 26px; margin-bottom: 8px; }
.hq-feature-card h4 { margin: 0 0 4px; font-family: 'Playfair Display', serif; font-size: 14px; color: #3E2723; font-weight: 700; }
.hq-feature-card p { margin: 0; font-size: 12px; color: #9E8272; }
.hq-form-card { max-width: 680px; margin: 0 auto; background: #fff; border-radius: 18px; overflow: hidden; box-shadow: 0 12px 40px rgba(184,115,51,0.15); border: 1px solid #EED9BE; }
.hq-form-header { background: linear-gradient(90deg, #B87333, #C9A44C); color: #fff; padding: 18px 26px; font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
.hq-form-body { padding: 26px; }
.hq-section-title { font-family: 'Playfair Display', serif; font-size: 15px; color: #3E2723; font-weight: 700; margin: 22px 0 12px; padding-bottom: 8px; border-bottom: 1px solid #F0E6D8; display: flex; align-items: center; gap: 8px; }
.hq-grid2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
.hq-input, .hq-select, .hq-textarea { width: 100%; padding: 11px 14px; border-radius: 9px; border: 1px solid #E0D0BC; font-family: 'Lato', sans-serif; font-size: 13px; color: #3E2723; background: #FDFAF6; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
.hq-input:focus, .hq-select:focus, .hq-textarea:focus { border-color: #B87333; box-shadow: 0 0 0 3px rgba(184,115,51,0.1); background: #fff; }
.hq-textarea { min-height: 90px; resize: vertical; }
.hq-shop-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-top: 4px; }
.hq-shop-card { padding: 12px 14px; border: 2px solid #E0D0BC; border-radius: 10px; cursor: pointer; background: #FDFAF6; font-size: 13px; color: #3E2723; font-weight: 600; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
.hq-shop-card:hover { border-color: #B87333; background: #FFF6E5; }
.hq-shop-card.selected { border-color: #B87333; background: linear-gradient(135deg, #FFF6E5, #FFF0D0); color: #8B4513; }
.hq-shop-check { width: 18px; height: 18px; border-radius: 50%; border: 2px solid #E0D0BC; display: flex; align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0; transition: all 0.2s; }
.hq-shop-card.selected .hq-shop-check { background: #B87333; border-color: #B87333; color: #fff; }
.hq-actions { display: flex; justify-content: space-between; margin-top: 24px; padding-top: 20px; border-top: 1px solid #F0E6D8; gap: 12px; }
.hq-back-btn { padding: 11px 20px; background: #fff; border: 1px solid #E0D0BC; border-radius: 9px; color: #9E8272; font-family: 'Lato', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s; }
.hq-back-btn:hover { border-color: #B87333; color: #B87333; }
.hq-submit-btn { padding: 11px 24px; background: linear-gradient(135deg, #B87333, #C9A44C); color: #fff; border: none; border-radius: 9px; font-family: 'Lato', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(184,115,51,0.3); }
.hq-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.hq-submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(184,115,51,0.4); }
.hq-error-msg { background: #fee2e2; color: #991b1b; padding: 10px 14px; border-radius: 9px; font-size: 13px; margin-bottom: 16px; border: 1px solid #fca5a5; }
.hq-warn-msg { background: #FFF8E1; color: #E65100; padding: 8px 14px; border-radius: 9px; font-size: 12px; margin-bottom: 12px; }
.hq-success-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.hq-success-card { background: #fff; border-radius: 20px; padding: 44px 40px; text-align: center; max-width: 380px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.2); animation: popIn 0.3s ease; }
@keyframes popIn { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.hq-success-icon { font-size: 56px; margin-bottom: 16px; }
.hq-success-title { font-family: 'Playfair Display', serif; font-size: 24px; color: #3E2723; margin: 0 0 10px; }
.hq-success-sub { color: #9E8272; font-size: 14px; line-height: 1.6; margin: 0 0 24px; }
.hq-success-ok { padding: 12px 32px; background: linear-gradient(135deg, #B87333, #C9A44C); color: #fff; border: none; border-radius: 10px; font-family: 'Lato', sans-serif; font-weight: 700; font-size: 14px; cursor: pointer; }
`;

const Home = () => {
  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    productType: "", material: "", quantity: "", urgency: "",
    customization: "", details: "",
    shopId: "",
  });

  const [shops, setShops]           = useState([]);
  const [backendOnline, setBackendOnline] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  // ── Shops backend se fetch karo ──────────────────────────────────────────
  useEffect(() => {
    axios.get(`${API}/shops`, { timeout: 5000 })
      .then(res => {
        const data = res.data.shops || res.data || [];
        if (Array.isArray(data) && data.length > 0) {
          setShops(data);
          setBackendOnline(true);
          console.log("✅ Backend shops loaded:", data);
        } else {
          console.warn("⚠️ Backend returned empty shops array");
          setShops(FALLBACK_SHOPS);
        }
      })
      .catch(err => {
        console.warn("⚠️ Backend offline, using fallback shops:", err.message);
        setShops(FALLBACK_SHOPS);
      });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const selectShop = (sid) => {
    setForm(prev => ({ ...prev, shopId: prev.shopId === sid ? "" : sid }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // ── Validations ──
    if (!form.name.trim())  { setError("Full Name is required."); return; }
    if (!form.phone.trim()) { setError("Phone Number is required."); return; }
    if (!form.email.trim()) { setError("Email is required."); return; }
    if (!form.shopId)       { setError("Please select a shop before submitting."); return; }

    setLoading(true);

    const payload = {
      customerName:  form.name.trim(),
      customerEmail: form.email.trim(),
      customerPhone: form.phone.trim(),
      productName:   `${form.material || "Custom"} ${form.productType || "Product"}`.trim(),
      description:   [
        form.customization,
        form.details,
        form.urgency ? `Urgency: ${form.urgency}` : ""
      ].filter(Boolean).join(" | ") || "No additional details.",
      quantity: parseInt(form.quantity) || 1,
      budget:   "",
      shopId:   form.shopId,
    };

    console.log("📤 Sending quote to backend:", payload);

    try {
      const res = await axios.post(`${API}/quotes`, payload);
      console.log("✅ Quote saved in MongoDB:", res.data);
      setSubmitted(true);
    } catch (err) {
      console.error("❌ Quote submit failed:", err.response?.data || err.message);

      if (err.code === "ERR_NETWORK" || err.message.includes("Network Error")) {
        setError("Backend server se connect nahi ho pa raha. Check karo ki backend port 5000 pe chal raha hai.");
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || "Kuch fields missing hain.");
      } else if (err.response?.status === 500) {
        setError("Server error aaya. Backend console check karo.");
      } else {
        setError(err.response?.data?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name:"", phone:"", email:"", productType:"", material:"", quantity:"", urgency:"", customization:"", details:"", shopId:"" });
    setSubmitted(false);
    setError(null);
  };

  const features = [
    { icon: "💬", title: "Multiple Quotes", desc: "Get offers from top shops" },
    { icon: "🎨", title: "Customization",   desc: "Tailored to your exact needs" },
    { icon: "📦", title: "Bulk Orders",     desc: "Special pricing for bulk buyers" },
  ];

  return (
    <div className="hq-page">
      <style>{css}</style>

      {/* ── Success Modal ── */}
      {submitted && (
        <div className="hq-success-overlay">
          <div className="hq-success-card">
            <div className="hq-success-icon">🎉</div>
            <h2 className="hq-success-title">Quote Submitted!</h2>
            <p className="hq-success-sub">
              Your request has been sent to the shopkeeper. They will review and get back to you shortly.
            </p>
            <button className="hq-success-ok" onClick={resetForm}>Submit Another</button>
          </div>
        </div>
      )}

      <div className="hq-header">
        <div className="hq-badge">🏺 Premium Handcrafted Brass & Copper</div>
        <h1 className="hq-heading">Request Your Custom Quote</h1>
        <p className="hq-subheading">Share your requirements and our expert craftsmen will provide you the perfect solution.</p>
      </div>

      <div className="hq-features">
        {features.map((f, i) => (
          <div key={i} className="hq-feature-card">
            <div className="hq-feature-icon">{f.icon}</div>
            <h4>{f.title}</h4>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="hq-form-card">
        <div className="hq-form-header">
          📋 Quote Request Form
          {backendOnline
            ? <span style={{ marginLeft:"auto", fontSize:11, fontWeight:600, opacity:0.8 }}>🟢 Connected</span>
            : <span style={{ marginLeft:"auto", fontSize:11, fontWeight:600, opacity:0.8 }}>🔴 Backend offline</span>
          }
        </div>

        <form onSubmit={handleSubmit} className="hq-form-body">

          {error && <div className="hq-error-msg">⚠️ {error}</div>}

          {!backendOnline && (
            <div className="hq-warn-msg">
              ⚡ Backend connect nahi hua — demo shops dikh rahe hain. Backend start karo: <code>node server.js</code>
            </div>
          )}

          {/* Your Info */}
          <h3 className="hq-section-title">👤 Your Information</h3>
          <div className="hq-grid2">
            <input name="name"  placeholder="Full Name *"     value={form.name}  onChange={handleChange} className="hq-input" required />
            <input name="phone" placeholder="Phone Number *"  value={form.phone} onChange={handleChange} className="hq-input" required />
            <input name="email" placeholder="Email Address *" value={form.email} onChange={handleChange} className="hq-input" type="email" required />
          </div>

          {/* Product Details */}
          <h3 className="hq-section-title">🏺 Product Details</h3>
          <div className="hq-grid2">
            <select name="productType" value={form.productType} onChange={handleChange} className="hq-select">
              <option value="">Select Product Type</option>
              <option>Utensils</option><option>Decor</option><option>Industrial</option>
              <option>Pooja Items</option><option>Gifting</option>
            </select>
            <select name="material" value={form.material} onChange={handleChange} className="hq-select">
              <option value="">Select Material</option>
              <option>Brass</option><option>Copper</option><option>Mixed</option>
            </select>
            <input name="quantity" placeholder="Quantity (e.g. 10)" value={form.quantity} onChange={handleChange} className="hq-input" type="number" min="1" />
            <select name="urgency" value={form.urgency} onChange={handleChange} className="hq-select">
              <option value="">Select Urgency</option>
              <option>Normal (2–3 weeks)</option>
              <option>Urgent (Within 1 week)</option>
              <option>Very Urgent (2–3 days)</option>
            </select>
          </div>
          <div className="hq-grid2" style={{ marginTop: 12 }}>
            <textarea name="customization" placeholder="Customization requirements (size, finish, design...)" value={form.customization} onChange={handleChange} className="hq-textarea" />
            <textarea name="details"       placeholder="Additional details or special instructions..."         value={form.details}       onChange={handleChange} className="hq-textarea" />
          </div>

          {/* Shop Selection */}
          <h3 className="hq-section-title">🏪 Select Shop *</h3>
          <div className="hq-shop-grid">
            {shops.map((shop) => {
              const sid = shop._id;
              const isSelected = form.shopId === sid;
              return (
                <div key={sid} onClick={() => selectShop(sid)} className={`hq-shop-card ${isSelected ? "selected" : ""}`}>
                  <div className="hq-shop-check">{isSelected ? "✓" : ""}</div>
                  {shop.name || shop.shopName || "Unknown Shop"}
                </div>
              );
            })}
          </div>

          <div className="hq-actions">
            <Link to="/ProductsPage">
            <button type="button" className="hq-back-btn">← Back to Products</button>
            </Link>
            <button type="submit" className="hq-submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit Quote Request ✨"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;