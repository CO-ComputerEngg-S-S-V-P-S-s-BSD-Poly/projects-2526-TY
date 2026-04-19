import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShopkeeperSidebar from "./ShopkeeperSidebar";

const getStrength = (pw) => {
  if (!pw) return { pct: 0, color: "#EEE", label: "" };
  const score = [pw.length>=6, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;
  return ([
    { pct:25,  color:"#EF5350", label:"Weak"   },
    { pct:50,  color:"#FF9800", label:"Fair"   },
    { pct:75,  color:"#FFC107", label:"Good"   },
    { pct:100, color:"#4CAF50", label:"Strong" },
  ][score-1]) || { pct:0, color:"#EEE", label:"" };
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Lato:wght@400;600;700&display=swap');

.ss-page { display:flex; min-height:100vh; background:#FAF6F0; font-family:'Lato',sans-serif; }
.ss-main { margin-left:240px; flex:1; display:flex; flex-direction:column; }
.ss-topbar {
  background:#fff; border-bottom:1px solid #EEE5D6; padding:14px 28px;
  display:flex; align-items:center; justify-content:space-between;
  position:sticky; top:0; z-index:50; box-shadow:0 1px 6px rgba(184,115,51,0.05);
}
.ss-topbar-title { font-family:'Playfair Display',serif; font-size:20px; color:#3E2723; font-weight:700; }
.ss-topbar-sub   { color:#9E8272; font-size:13px; margin-top:2px; }
.ss-back-btn {
  background:#fff; border:1px solid #E0D0BC; border-radius:9px;
  padding:8px 16px; color:#B87333; font-weight:700; font-size:13px;
  cursor:pointer; font-family:'Lato',sans-serif; transition:all 0.2s;
}
.ss-back-btn:hover { background:#FFF6E5; }
.ss-body { display:flex; flex:1; }
.ss-left {
  width:260px; flex-shrink:0;
  background:linear-gradient(160deg,#FFF8F0 0%,#FFF0DC 100%);
  border-right:1px solid #EED9BE;
  padding:28px 22px; display:flex; flex-direction:column; gap:18px;
}
.ss-avatar-wrap { display:flex; flex-direction:column; align-items:center; gap:10px; }
.ss-avatar {
  width:72px; height:72px; border-radius:50%;
  background:linear-gradient(135deg,#B87333,#C9A44C);
  display:flex; align-items:center; justify-content:center; font-size:30px;
  border:3px solid rgba(184,115,51,0.25); box-shadow:0 4px 16px rgba(184,115,51,0.2);
}
.ss-avatar-name  { font-family:'Playfair Display',serif; color:#3E2723; font-size:15px; font-weight:700; text-align:center; }
.ss-avatar-email { color:#9E8272; font-size:11px; text-align:center; word-break:break-all; }
.ss-status-badge {
  display:inline-flex; align-items:center; gap:5px;
  background:rgba(76,175,80,0.1); border:1px solid rgba(76,175,80,0.3);
  border-radius:20px; padding:3px 10px; color:#388E3C; font-size:11px; font-weight:700;
}
.ss-status-dot { width:6px; height:6px; border-radius:50%; background:#66BB6A; flex-shrink:0; }
.ss-divider { height:1px; background:#EED9BE; }
.ss-info-cards { display:flex; flex-direction:column; gap:8px; }
.ss-info-card {
  background:#fff; border:1px solid #EED9BE; border-radius:11px; padding:11px 13px;
  box-shadow:0 1px 4px rgba(184,115,51,0.06);
}
.ss-info-label { color:#B87333; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:3px; }
.ss-info-value { color:#3E2723; font-size:13px; font-weight:600; }
.ss-quick-label { color:#B87333; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:8px; }
.ss-quick-list  { display:flex; flex-direction:column; gap:6px; }
.ss-quick-item {
  background:#fff; border:1px solid #EED9BE; border-radius:9px; padding:9px 12px;
  color:#3E2723; font-size:12px; font-weight:600;
  display:flex; align-items:center; gap:8px;
  box-shadow:0 1px 4px rgba(184,115,51,0.05);
}
.ss-left-deco { margin-top:auto; text-align:center; font-size:22px; letter-spacing:6px; opacity:0.2; }
.ss-right { flex:1; padding:26px 30px; overflow-y:auto; }
.ss-section {
  background:#fff; border-radius:16px; padding:22px 26px; margin-bottom:18px;
  box-shadow:0 2px 10px rgba(184,115,51,0.06); border:1px solid #EEE5D6;
}
.ss-section-title {
  font-family:'Playfair Display',serif; font-size:15px; font-weight:700; color:#3E2723;
  padding-bottom:13px; margin-bottom:18px; border-bottom:1px solid #F0E6D8;
}
.ss-field { margin-bottom:14px; }
.ss-label {
  display:block; font-size:11px; font-weight:700; color:#B87333;
  text-transform:uppercase; letter-spacing:0.9px; margin-bottom:6px;
}
.ss-input-wrap { position:relative; display:flex; align-items:center; }
.ss-icon { position:absolute; left:12px; font-size:14px; pointer-events:none; }
.ss-input {
  width:100%; background:#FDFAF6; border:1.5px solid #E0D0BC;
  border-radius:11px; padding:10px 12px 10px 40px; color:#3E2723;
  font-size:14px; outline:none; font-family:'Lato',sans-serif;
  transition:border-color 0.2s, box-shadow 0.2s, background 0.2s; font-weight:500;
}
.ss-input::placeholder { color:#C4AE98; }
.ss-input:focus { border-color:#B87333; box-shadow:0 0 0 3px rgba(184,115,51,0.1); background:#fff; }
.ss-eye { position:absolute; right:13px; cursor:pointer; font-size:15px; user-select:none; }
.ss-strength-wrap { margin-top:6px; display:flex; align-items:center; gap:8px; }
.ss-strength-bar  { flex:1; height:4px; border-radius:2px; background:#F0E6D8; overflow:hidden; }
.ss-strength-fill { height:100%; border-radius:2px; transition:width 0.4s, background 0.4s; }
.ss-strength-lbl  { font-size:11px; font-weight:700; min-width:40px; }
.ss-error-box {
  background:#FFF0F0; border:1px solid #FFCDD2; border-radius:10px;
  padding:10px 14px; color:#c62828; font-size:13px; font-weight:600; margin-bottom:14px;
}
.ss-toggle-row {
  display:flex; align-items:center; justify-content:space-between;
  padding:13px 0; border-bottom:1px solid #F5EDE0;
}
.ss-toggle-row:last-child { border-bottom:none; padding-bottom:0; }
.ss-toggle-row:first-child { padding-top:0; }
.ss-tgl-label { font-size:14px; font-weight:700; color:#3E2723; }
.ss-tgl-sub   { font-size:12px; color:#9E8272; margin-top:2px; }
.ss-toggle {
  width:44px; height:22px; border-radius:11px; cursor:pointer;
  position:relative; border:none; padding:0; flex-shrink:0; transition:background 0.3s;
}
.ss-toggle.on  { background:linear-gradient(135deg,#B87333,#C9A44C); box-shadow:0 2px 6px rgba(184,115,51,0.35); }
.ss-toggle.off { background:#DDD3C8; }
.ss-toggle-dot {
  position:absolute; top:3px; width:16px; height:16px; background:#fff; border-radius:50%;
  transition:left 0.3s cubic-bezier(0.34,1.56,0.64,1); box-shadow:0 1px 3px rgba(0,0,0,0.18);
}
.ss-toggle.on  .ss-toggle-dot { left:24px; }
.ss-toggle.off .ss-toggle-dot { left:3px; }
.ss-btn-row { display:flex; align-items:center; gap:14px; }
.ss-save-btn {
  padding:12px 28px; background:linear-gradient(135deg,#B87333,#C9A44C);
  border:none; border-radius:11px; color:#fff; font-weight:700; font-size:14px;
  cursor:pointer; font-family:'Lato',sans-serif;
  box-shadow:0 4px 14px rgba(184,115,51,0.28); transition:all 0.3s;
  display:flex; align-items:center; gap:8px;
}
.ss-save-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 22px rgba(184,115,51,0.38); }
.ss-save-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
.ss-success-msg { color:#2e7d32; font-size:13px; font-weight:700; }
.ss-spinner {
  width:14px; height:14px; border:2px solid rgba(255,255,255,0.4);
  border-top-color:#fff; border-radius:50%; animation:ssspin 0.7s linear infinite;
}
@keyframes ssspin { to { transform:rotate(360deg); } }
.ss-danger-btn {
  padding:11px 22px; background:#FFF5F5; border:1.5px solid #FFCDD2;
  border-radius:11px; color:#c62828; font-weight:700; font-size:14px;
  cursor:pointer; font-family:'Lato',sans-serif; transition:all 0.2s;
  display:flex; align-items:center; gap:6px;
}
.ss-danger-btn:hover { background:#FFEBEE; border-color:#ef5350; }
`;

const ShopkeeperSettings = () => {
  const navigate = useNavigate();

  // ── sessionStorage se data lo ──
  const skRaw = sessionStorage.getItem("shopkeeperData");
  const sk = skRaw ? (() => { try { return JSON.parse(skRaw); } catch { return {}; } })() : {};

  const [pw, setPw]           = useState({ current:"", newPw:"", confirm:"" });
  const [showPw, setShowPw]   = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);
  const [pwSaving,setPwSaving]= useState(false);
  const [notifs, setNotifs]   = useState({ emailEnquiry:true, emailApproval:false, smsEnquiry:false, browserPush:true });

  const handlePwChange = (e) => { setPw({...pw,[e.target.name]:e.target.value}); setPwError(""); setPwSaved(false); };

  const handlePwSave = async (e) => {
    e.preventDefault();
    if (!pw.current)            { setPwError("Please enter your current password."); return; }
    if (pw.newPw.length < 4)    { setPwError("New password must be at least 4 characters."); return; }
    if (pw.newPw !== pw.confirm){ setPwError("Passwords do not match."); return; }
    const emailKey = (sk.email||"").trim().toLowerCase();
    const savedPwd = localStorage.getItem(`demoPwd_${emailKey}`);
    if (savedPwd && savedPwd !== pw.current) { setPwError("Current password is incorrect."); return; }
    setPwSaving(true);
    await new Promise(r => setTimeout(r, 800));
    if (emailKey) localStorage.setItem(`demoPwd_${emailKey}`, pw.newPw);
    setPwSaving(false); setPwSaved(true);
    setPw({ current:"", newPw:"", confirm:"" });
    setTimeout(() => setPwSaved(false), 4000);
  };

  const toggleNotif = (k) => setNotifs(n => ({...n,[k]:!n[k]}));

  // ── LOGOUT FIX — sessionStorage clear karo ──
  const handleLogout = () => {
    sessionStorage.clear(); // saara session data ek baar mein clear
    navigate("/shopkeeper/login", { replace: true });
  };

  const strength = getStrength(pw.newPw);
  const notifItems = [
    { k:"emailEnquiry",  label:"Email on new enquiry",      sub:"Get email when a customer asks about your product" },
    { k:"emailApproval", label:"Email on product approval", sub:"Notified when admin approves your listing"         },
    { k:"smsEnquiry",    label:"SMS alerts",                sub:"Receive SMS for new customer enquiries"            },
    { k:"browserPush",   label:"Browser notifications",     sub:"Push notifications in your browser"               },
  ];

  return (
    <div className="ss-page">
      <style>{css}</style>
      <ShopkeeperSidebar active="settings" />
      <div className="ss-main">
        <div className="ss-topbar">
          <div>
            <h1 className="ss-topbar-title">Settings</h1>
            <p className="ss-topbar-sub">Manage your account preferences</p>
          </div>
          <button className="ss-back-btn" onClick={() => navigate("/shopkeeper/dashboard")}>← Dashboard</button>
        </div>

        <div className="ss-body">
          <div className="ss-left">
            <div className="ss-avatar-wrap">
              <div className="ss-avatar">⚙️</div>
              <div style={{textAlign:"center"}}>
                <div className="ss-avatar-name">{sk.ownerName || "Shopkeeper"}</div>
                <div className="ss-avatar-email">{sk.email || "—"}</div>
                <div style={{display:"flex",justifyContent:"center",marginTop:8}}>
                  <span className="ss-status-badge">
                    <span className="ss-status-dot"/>
                    {sk.status==="approved" ? "Approved" : "Active"}
                  </span>
                </div>
              </div>
            </div>
            <div className="ss-divider"/>
            <div className="ss-info-cards">
              {[
                { label:"Shop Name", value:sk.shopName||"—", icon:"🏺" },
                { label:"Phone",     value:sk.phone||"—",    icon:"📞" },
                { label:"Address",   value:sk.address||"—",  icon:"📍" },
              ].map(c => (
                <div className="ss-info-card" key={c.label}>
                  <div className="ss-info-label">{c.icon} {c.label}</div>
                  <div className="ss-info-value">{c.value}</div>
                </div>
              ))}
            </div>
            <div className="ss-divider"/>
            <div>
              <div className="ss-quick-label">⚙️ Settings Sections</div>
              <div className="ss-quick-list">
                {[
                  { icon:"🔐", text:"Change Password" },
                  { icon:"🔔", text:"Notifications"   },
                  { icon:"🚪", text:"Account Actions" },
                ].map(q => (
                  <div className="ss-quick-item" key={q.text}><span>{q.icon}</span>{q.text}</div>
                ))}
              </div>
            </div>
            <div className="ss-left-deco">🏺 🪔 ⚱️ 🔔</div>
          </div>

          <div className="ss-right">
            <div className="ss-section">
              <div className="ss-section-title">🔐 Change Password</div>
              {pwError && <div className="ss-error-box">⚠️ {pwError}</div>}
              <form onSubmit={handlePwSave}>
                {[
                  { name:"current", label:"Current Password", icon:"🔑", placeholder:"Enter current password" },
                  { name:"newPw",   label:"New Password",     icon:"🔒", placeholder:"Minimum 4 characters"   },
                  { name:"confirm", label:"Confirm Password", icon:"✅", placeholder:"Re-enter new password"   },
                ].map(f => (
                  <div className="ss-field" key={f.name}>
                    <label className="ss-label">{f.label}</label>
                    <div className="ss-input-wrap">
                      <span className="ss-icon">{f.icon}</span>
                      <input className="ss-input" type={showPw?"text":"password"}
                        name={f.name} placeholder={f.placeholder}
                        value={pw[f.name]} onChange={handlePwChange} />
                      {f.name==="current" && (
                        <span className="ss-eye" onClick={()=>setShowPw(!showPw)}>{showPw?"🙈":"👁️"}</span>
                      )}
                    </div>
                    {f.name==="newPw" && pw.newPw && (
                      <div className="ss-strength-wrap">
                        <div className="ss-strength-bar">
                          <div className="ss-strength-fill" style={{width:strength.pct+"%",background:strength.color}}/>
                        </div>
                        <span className="ss-strength-lbl" style={{color:strength.color}}>{strength.label}</span>
                      </div>
                    )}
                  </div>
                ))}
                <div className="ss-btn-row">
                  <button className="ss-save-btn" type="submit" disabled={pwSaving}>
                    {pwSaving ? <><span className="ss-spinner"/>Updating…</> : <>🔐 Update Password</>}
                  </button>
                  {pwSaved && <span className="ss-success-msg">✅ Password updated!</span>}
                </div>
              </form>
            </div>

            <div className="ss-section">
              <div className="ss-section-title">🔔 Notification Preferences</div>
              {notifItems.map(item => (
                <div className="ss-toggle-row" key={item.k}>
                  <div>
                    <div className="ss-tgl-label">{item.label}</div>
                    <div className="ss-tgl-sub">{item.sub}</div>
                  </div>
                  <button className={`ss-toggle ${notifs[item.k]?"on":"off"}`} onClick={()=>toggleNotif(item.k)}>
                    <div className="ss-toggle-dot"/>
                  </button>
                </div>
              ))}
            </div>

            <div className="ss-section">
              <div className="ss-section-title">⚠️ Account Actions</div>
              <p style={{fontSize:13,color:"#9E8272",marginBottom:16,lineHeight:1.7}}>
                Logging out will clear your session. Browser band hone pe bhi automatic logout hoga.
              </p>
              <button className="ss-danger-btn" onClick={handleLogout}>
                🚪 Logout from this device
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopkeeperSettings;