import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShopkeeperSidebar from "./ShopkeeperSidebar";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Lato:wght@400;600;700&display=swap');

.sp-page { display:flex; min-height:100vh; background:#FAF6F0; font-family:'Lato',sans-serif; }
.sp-main { margin-left:240px; flex:1; display:flex; flex-direction:column; }

.sp-topbar {
  background:#fff; border-bottom:1px solid #EEE5D6; padding:14px 28px;
  display:flex; align-items:center; justify-content:space-between;
  position:sticky; top:0; z-index:50; box-shadow:0 1px 6px rgba(184,115,51,0.05);
}
.sp-topbar-title { font-family:'Playfair Display',serif; font-size:20px; color:#3E2723; font-weight:700; }
.sp-topbar-sub   { color:#9E8272; font-size:13px; margin-top:2px; }
.sp-back-btn {
  background:#fff; border:1px solid #E0D0BC; border-radius:9px;
  padding:8px 16px; color:#B87333; font-weight:700; font-size:13px;
  cursor:pointer; font-family:'Lato',sans-serif; transition:all 0.2s;
}
.sp-back-btn:hover { background:#FFF6E5; }

.sp-body { display:flex; flex:1; }

.sp-left {
  width:260px; flex-shrink:0;
  background:linear-gradient(160deg,#FFF8F0 0%,#FFF0DC 100%);
  border-right:1px solid #EED9BE;
  padding:28px 22px; display:flex; flex-direction:column; gap:22px;
}
.sp-avatar-wrap { display:flex; flex-direction:column; align-items:center; gap:10px; }
.sp-avatar {
  width:82px; height:82px; border-radius:50%;
  background:linear-gradient(135deg,#B87333,#C9A44C);
  display:flex; align-items:center; justify-content:center; font-size:36px;
  border:3px solid rgba(184,115,51,0.25);
  box-shadow:0 4px 16px rgba(184,115,51,0.2);
}
.sp-avatar-name { font-family:'Playfair Display',serif; color:#3E2723; font-size:16px; font-weight:700; text-align:center; }
.sp-avatar-shop { color:#9E8272; font-size:12px; text-align:center; margin-top:1px; }
.sp-status-badge {
  display:inline-flex; align-items:center; gap:5px;
  background:rgba(76,175,80,0.1); border:1px solid rgba(76,175,80,0.3);
  border-radius:20px; padding:3px 10px; color:#388E3C; font-size:11px; font-weight:700;
}
.sp-status-dot { width:6px; height:6px; border-radius:50%; background:#66BB6A; flex-shrink:0; }
.sp-divider { height:1px; background:#EED9BE; }
.sp-info-cards { display:flex; flex-direction:column; gap:8px; }
.sp-info-card {
  background:#fff; border:1px solid #EED9BE; border-radius:11px; padding:11px 13px;
  box-shadow:0 1px 4px rgba(184,115,51,0.06);
}
.sp-info-label { color:#B87333; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:3px; }
.sp-info-value { color:#3E2723; font-size:13px; font-weight:600; word-break:break-all; }
.sp-left-deco { margin-top:auto; text-align:center; font-size:22px; letter-spacing:6px; opacity:0.2; }

.sp-right { flex:1; padding:26px 30px; overflow-y:auto; }
.sp-section {
  background:#fff; border-radius:16px; padding:22px 26px; margin-bottom:18px;
  box-shadow:0 2px 10px rgba(184,115,51,0.06); border:1px solid #EEE5D6;
}
.sp-section-title {
  font-family:'Playfair Display',serif; font-size:15px; font-weight:700; color:#3E2723;
  padding-bottom:13px; margin-bottom:18px; border-bottom:1px solid #F0E6D8;
}
.sp-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px 18px; }
.sp-field  { display:flex; flex-direction:column; gap:6px; }
.sp-field.full { grid-column:1/-1; }
.sp-label {
  font-size:11px; font-weight:700; color:#B87333;
  text-transform:uppercase; letter-spacing:0.9px;
}
.sp-input-wrap { position:relative; display:flex; align-items:center; }
.sp-input-wrap.top { align-items:flex-start; }
.sp-icon     { position:absolute; left:12px; font-size:14px; pointer-events:none; }
.sp-icon.top { top:12px; }
.sp-input {
  width:100%; background:#FDFAF6; border:1.5px solid #E0D0BC;
  border-radius:11px; padding:10px 12px 10px 40px; color:#3E2723;
  font-size:14px; outline:none; font-family:'Lato',sans-serif;
  transition:border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.sp-input::placeholder { color:#C4AE98; }
.sp-input:focus { border-color:#B87333; box-shadow:0 0 0 3px rgba(184,115,51,0.1); background:#fff; }
.sp-textarea {
  width:100%; background:#FDFAF6; border:1.5px solid #E0D0BC;
  border-radius:11px; padding:10px 12px 10px 40px; color:#3E2723;
  font-size:14px; outline:none; font-family:'Lato',sans-serif;
  resize:vertical; min-height:76px;
  transition:border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.sp-textarea:focus { border-color:#B87333; box-shadow:0 0 0 3px rgba(184,115,51,0.1); background:#fff; }
.sp-save-row { display:flex; align-items:center; gap:14px; }
.sp-save-btn {
  padding:12px 30px; background:linear-gradient(135deg,#B87333,#C9A44C);
  border:none; border-radius:11px; color:#fff; font-weight:700; font-size:15px;
  cursor:pointer; font-family:'Lato',sans-serif;
  box-shadow:0 4px 14px rgba(184,115,51,0.28); transition:all 0.3s;
}
.sp-save-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 22px rgba(184,115,51,0.38); }
.sp-save-btn:disabled { opacity:0.6; cursor:not-allowed; }
.sp-saved-msg { color:#2e7d32; font-size:13px; font-weight:700; }
.sp-spinner {
  width:15px; height:15px; border:2px solid rgba(255,255,255,0.4);
  border-top-color:#fff; border-radius:50%; animation:spspin 0.7s linear infinite; display:inline-block;
}
@keyframes spspin { to { transform:rotate(360deg); } }
`;

const ShopkeeperProfile = () => {
  const navigate = useNavigate();

  // ── sessionStorage se data lo (login ke baad yahi hota hai) ──
  const raw      = sessionStorage.getItem("shopkeeperData");
  const existing = raw ? (() => { try { return JSON.parse(raw); } catch { return {}; } })() : {};

  const [form, setForm] = useState({
    ownerName: existing.ownerName || "",
    shopName:  existing.shopName  || "",
    email:     existing.email     || "",
    phone:     existing.phone     || "",
    address:   existing.address   || "",
    city:      existing.city      || "",
    bio:       existing.bio       || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const handleChange = (e) => { setForm({...form,[e.target.name]:e.target.value}); setSaved(false); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));

    const updated = { ...existing, ...form };

    // ── sessionStorage update — current session ke liye ──
    sessionStorage.setItem("shopkeeperData", JSON.stringify(updated));

    // ── localStorage update — demo login data bhi sync karo ──
    if (updated.email) {
      const emailKey = updated.email.trim().toLowerCase();
      localStorage.setItem(`demoSK_${emailKey}`, JSON.stringify(updated));
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const Field = ({ name, label, icon, placeholder, half=false, textarea=false }) => (
    <div className={`sp-field${!half?" full":""}`}>
      <label className="sp-label">{label}</label>
      <div className={`sp-input-wrap${textarea?" top":""}`}>
        <span className={`sp-icon${textarea?" top":""}`}>{icon}</span>
        {textarea
          ? <textarea className="sp-textarea" name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} />
          : <input    className="sp-input"    name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} />
        }
      </div>
    </div>
  );

  return (
    <div className="sp-page">
      <style>{css}</style>
      <ShopkeeperSidebar active="shop-profile" />

      <div className="sp-main">
        <div className="sp-topbar">
          <div>
            <h1 className="sp-topbar-title">Shop Profile</h1>
            <p className="sp-topbar-sub">Manage your shop information & details</p>
          </div>
          <button className="sp-back-btn" onClick={() => navigate("/shopkeeper/dashboard")}>← Dashboard</button>
        </div>

        <div className="sp-body">
          {/* Left panel — live preview */}
          <div className="sp-left">
            <div className="sp-avatar-wrap">
              <div className="sp-avatar">🏺</div>
              <div style={{textAlign:"center"}}>
                <div className="sp-avatar-name">{form.shopName  || "Shop Name"}</div>
                <div className="sp-avatar-shop">by {form.ownerName || "Owner"}</div>
                <div style={{display:"flex",justifyContent:"center",marginTop:8}}>
                  <span className="sp-status-badge">
                    <span className="sp-status-dot"/>Active
                  </span>
                </div>
              </div>
            </div>

            <div className="sp-divider"/>

            <div className="sp-info-cards">
              {[
                { label:"Email",   value:form.email   ||"—", icon:"✉️"  },
                { label:"Phone",   value:form.phone   ||"—", icon:"📞" },
                { label:"Address", value:form.address ||"—", icon:"📍" },
                { label:"City",    value:form.city    ||"—", icon:"🏙️" },
              ].map(c => (
                <div className="sp-info-card" key={c.label}>
                  <div className="sp-info-label">{c.icon} {c.label}</div>
                  <div className="sp-info-value">{c.value}</div>
                </div>
              ))}
            </div>

            <div className="sp-left-deco">🏺 🪔 ⚱️ 🔔</div>
          </div>

          {/* Right form */}
          <div className="sp-right">
            <form onSubmit={handleSave}>
              <div className="sp-section">
                <div className="sp-section-title">👤 Personal Information</div>
                <div className="sp-grid-2">
                  <Field name="ownerName" label="Owner Full Name" icon="👤" placeholder="e.g. Ramesh Patel"     half />
                  <Field name="phone"     label="Phone Number"   icon="📞" placeholder="e.g. +91 98765 43210" half />
                  <Field name="email"     label="Email Address"  icon="✉️" placeholder="e.g. shop@gmail.com"   half />
                  <Field name="city"      label="City"           icon="🏙️" placeholder="e.g. Songir"           half />
                </div>
              </div>

              <div className="sp-section">
                <div className="sp-section-title">🏺 Shop Information</div>
                <div className="sp-grid-2">
                  <Field name="shopName" label="Shop Name"        icon="🏺" placeholder="e.g. Songir Brass House"                       half />
                  <Field name="address"  label="Shop Address"     icon="📍" placeholder="e.g. Main Bazaar, Songir"                       half />
                  <Field name="bio"      label="Shop Description" icon="📝" placeholder="Tell customers what makes your shop special..." textarea />
                </div>
              </div>

              <div className="sp-save-row">
                <button className="sp-save-btn" type="submit" disabled={saving}>
                  {saving
                    ? <span style={{display:"flex",alignItems:"center",gap:8}}><span className="sp-spinner"/>Saving…</span>
                    : "Save Profile ✓"
                  }
                </button>
                {saved && <span className="sp-saved-msg">✅ Saved successfully!</span>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopkeeperProfile;