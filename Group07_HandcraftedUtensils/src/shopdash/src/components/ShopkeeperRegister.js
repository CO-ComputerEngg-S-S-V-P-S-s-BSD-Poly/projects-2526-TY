import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ShopkeeperLogin.css";

const ShopkeeperRegister = () => {
  const navigate = useNavigate();
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    ownerName: "", shopName: "", email: "", phone: "", address: "", password: "", confirmPassword: "",
  });

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.ownerName || !form.shopName || !form.email || !form.phone) {
      setError("Please fill all fields to continue."); return;
    }
    setError(""); setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (form.password.length < 4) { setError("Password must be at least 4 characters."); return; }
    setLoading(true);

    // Try real backend
    try {
      const res = await fetch("http://localhost:5000/api/auth/shopkeeper/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert("Registration successful! Please login.");
        navigate("/shopkeeper/login");
        return;
      }
      if (res.status === 409) {
        setError("Account with this email already exists. Please login.");
        setLoading(false); return;
      }
    } catch (_) {}

    // ── DEMO MODE ──
    const emailKey = form.email.trim().toLowerCase();

    // Already registered check — localStorage (permanent data)
    const stored = localStorage.getItem("demoRegistered");
    const list   = stored ? JSON.parse(stored) : [];
    if (list.includes(emailKey)) {
      setError("Account with this email already exists. Please login.");
      setLoading(false); return;
    }

    // Demo data localStorage mein save karo (permanent — login ke liye chahiye)
    list.push(emailKey);
    localStorage.setItem("demoRegistered", JSON.stringify(list));
    localStorage.setItem(`demoPwd_${emailKey}`, form.password);
    localStorage.setItem(`demoSK_${emailKey}`, JSON.stringify({
      _id:          "demo_" + Date.now(),
      ownerName:    form.ownerName,
      shopName:     form.shopName,
      email:        form.email,
      phone:        form.phone,
      address:      form.address,
      status:       "approved",
      profileImage: null,
    }));

    setLoading(false);
    alert(`Registration successful! Welcome ${form.ownerName}. Please login now.`);
    navigate("/shopkeeper/login");
  };

  const Step1Fields = [
    { name:"ownerName", label:"Owner Full Name", icon:"👤", type:"text",  placeholder:"e.g. Ramesh Patel"                    },
    { name:"shopName",  label:"Shop Name",       icon:"🏺", type:"text",  placeholder:"e.g. Songir Brass House"              },
    { name:"email",     label:"Email Address",   icon:"✉️", type:"email", placeholder:"e.g. yourshop@gmail.com"              },
    { name:"phone",     label:"Phone Number",    icon:"📞", type:"tel",   placeholder:"e.g. +91 98765 43210"                 },
    { name:"address",   label:"Shop Address",    icon:"📍", type:"text",  placeholder:"e.g. Main Bazaar, Songir, Maharashtra" },
  ];

  return (
    <div className="sk-login-page">
      <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
      <div className="sk-login-wrapper" style={{ maxWidth:960 }}>

        <div className="sk-left-panel">
          <div className="sk-brand">
            <div className="sk-brand-icon">🏺</div>
            <h1 className="sk-brand-name">Songir Brass</h1>
            <p className="sk-brand-tagline">Shopkeeper Portal</p>
          </div>
          <div className="sk-left-content">
            <h2 className="sk-left-heading">Join Our<br /><span>Brass & Copper</span><br />Marketplace</h2>
            <p className="sk-left-sub">Register your shop and start reaching thousands of customers.</p>
            <div className="sk-features">
              {[
                { icon:"🌐", text:"Products live on website instantly" },
                { icon:"📊", text:"Track views, enquiries & growth"     },
                { icon:"🔒", text:"Secure & easy account management"    },
                { icon:"⚡", text:"Quick approval within 24 hours"      },
              ].map((f, i) => (
                <div className="sk-feature-item" key={i}>
                  <div className="sk-feature-icon">{f.icon}</div>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="sk-left-footer"><div className="sk-decoration">🏺 🪔 ⚱️ 🔔</div></div>
        </div>

        <div className="sk-right-panel" style={{ width:440 }}>
          <div className="sk-card">
            <div className="sk-card-top-bar" />

            {/* Step dots */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:20 }}>
              {[1,2].map(s => (
                <React.Fragment key={s}>
                  <div style={{
                    width:28, height:28, borderRadius:"50%", display:"flex",
                    alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700,
                    background: step >= s ? "linear-gradient(135deg,#B87333,#C9A44C)" : "rgba(184,115,51,0.1)",
                    color: step >= s ? "white" : "#B87333",
                    border: step >= s ? "none" : "1.5px solid rgba(184,115,51,0.3)",
                    fontFamily:"'Lato',sans-serif",
                  }}>{step > s ? "✓" : s}</div>
                  {s < 2 && <div style={{ flex:1, height:2, maxWidth:60, borderRadius:2,
                    background: step > 1 ? "linear-gradient(90deg,#B87333,#C9A44C)" : "rgba(184,115,51,0.15)" }} />}
                </React.Fragment>
              ))}
            </div>

            <div className="sk-card-header">
              <div className="sk-lock-icon">{step === 1 ? "🏪" : "🔐"}</div>
              <h2 className="sk-card-title">{step === 1 ? "Shop Details" : "Create Password"}</h2>
              <p className="sk-card-sub">{step === 1 ? "Step 1 of 2 — Tell us about your shop" : "Step 2 of 2 — Set your account password"}</p>
            </div>

            {error && <div className="sk-error-box">⚠️ {error}</div>}

            {step === 1 ? (
              <form className="sk-form" onSubmit={handleNext}>
                {Step1Fields.map(f => (
                  <div className="sk-field" key={f.name}>
                    <label className="sk-label">{f.label}</label>
                    <div className="sk-input-wrap">
                      <span className="sk-input-icon">{f.icon}</span>
                      <input className="sk-input" type={f.type} name={f.name}
                        placeholder={f.placeholder} value={form[f.name]}
                        onChange={handleChange} required />
                    </div>
                  </div>
                ))}
                <button className="sk-submit-btn" type="submit" style={{ marginTop:8 }}>
                  Continue →
                </button>
              </form>
            ) : (
              <form className="sk-form" onSubmit={handleSubmit}>
                <div className="sk-field">
                  <label className="sk-label">Password</label>
                  <div className="sk-input-wrap">
                    <span className="sk-input-icon">🔑</span>
                    <input className="sk-input" type={showPass ? "text" : "password"} name="password"
                      placeholder="Minimum 4 characters" value={form.password} onChange={handleChange} required />
                    <span className="sk-eye" onClick={() => setShowPass(!showPass)}>{showPass ? "🙈" : "👁️"}</span>
                  </div>
                </div>
                <div className="sk-field">
                  <label className="sk-label">Confirm Password</label>
                  <div className="sk-input-wrap">
                    <span className="sk-input-icon">🔒</span>
                    <input className="sk-input" type={showPass ? "text" : "password"} name="confirmPassword"
                      placeholder="Re-enter your password" value={form.confirmPassword} onChange={handleChange} required />
                  </div>
                </div>

                {/* Summary */}
                <div style={{ background:"rgba(184,115,51,0.06)", border:"1px solid rgba(184,115,51,0.2)",
                  borderRadius:12, padding:"12px 14px", marginBottom:16 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:"#B87333", textTransform:"uppercase",
                    letterSpacing:"0.8px", marginBottom:8 }}>Registration Summary</p>
                  <p style={{ fontSize:13, color:"#3E2723", fontWeight:600 }}>👤 {form.ownerName}</p>
                  <p style={{ fontSize:13, color:"#6D4C41" }}>🏺 {form.shopName}</p>
                  <p style={{ fontSize:12, color:"#6D4C41" }}>✉️ {form.email}</p>
                </div>

                <div style={{ display:"flex", gap:10 }}>
                  <button type="button" onClick={() => setStep(1)}
                    style={{ padding:"13px 18px", background:"rgba(184,115,51,0.08)",
                      border:"1.5px solid rgba(184,115,51,0.3)", borderRadius:12, color:"#B87333",
                      fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"'Lato',sans-serif" }}>
                    ← Back
                  </button>
                  <button className="sk-submit-btn" type="submit" disabled={loading}
                    style={{ flex:1, marginBottom:0 }}>
                    {loading ? <span className="sk-loading"><span className="sk-spinner"/>Registering…</span> : "Register Shop →"}
                  </button>
                </div>
              </form>
            )}

            <div className="sk-divider"><span>Already have an account?</span></div>
            <div className="sk-back-link" onClick={() => navigate("/shopkeeper/login")}>← Login to your dashboard</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopkeeperRegister;