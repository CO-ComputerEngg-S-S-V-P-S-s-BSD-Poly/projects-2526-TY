import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShopkeeperSidebar from "./ShopkeeperSidebar";

const DAYS = [
  { key: "monday",    label: "Monday",    short: "MON", emoji: "🌅" },
  { key: "tuesday",   label: "Tuesday",   short: "TUE", emoji: "✨" },
  { key: "wednesday", label: "Wednesday", short: "WED", emoji: "⚡" },
  { key: "thursday",  label: "Thursday",  short: "THU", emoji: "🔥" },
  { key: "friday",    label: "Friday",    short: "FRI", emoji: "🎉" },
  { key: "saturday",  label: "Saturday",  short: "SAT", emoji: "🌟" },
  { key: "sunday",    label: "Sunday",    short: "SUN", emoji: "😴" },
];

const getInitialHours = () => {
  try {
    const saved = localStorage.getItem("shopWorkHours");
    if (saved) { const p = JSON.parse(saved); if (p && typeof p === "object") return p; }
  } catch (_) {}
  const d = {};
  DAYS.forEach(day => { d[day.key] = { open: day.key !== "sunday", from: "09:00", to: "18:00" }; });
  return d;
};

const getDuration = (from, to) => {
  try {
    if (!from || !to) return "";
    const [fh, fm] = from.split(":").map(Number);
    const [th, tm] = to.split(":").map(Number);
    const diff = (th * 60 + tm) - (fh * 60 + fm);
    if (isNaN(diff) || diff <= 0) return "";
    const h = Math.floor(diff / 60), m = diff % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  } catch { return ""; }
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Lato:wght@400;600;700&display=swap');

.wh-page { display:flex; min-height:100vh; background:#FAF6F0; font-family:'Lato',sans-serif; }
.wh-main { margin-left:240px; flex:1; display:flex; flex-direction:column; }

/* Topbar — same as profile */
.wh-topbar {
  background:#fff; border-bottom:1px solid #EEE5D6; padding:14px 28px;
  display:flex; align-items:center; justify-content:space-between;
  position:sticky; top:0; z-index:50; box-shadow:0 1px 6px rgba(184,115,51,0.05);
}
.wh-topbar-title { font-family:'Playfair Display',serif; font-size:20px; color:#3E2723; font-weight:700; }
.wh-topbar-sub   { color:#9E8272; font-size:13px; margin-top:2px; }
.wh-back-btn {
  background:#fff; border:1px solid #E0D0BC; border-radius:9px;
  padding:8px 16px; color:#B87333; font-weight:700; font-size:13px;
  cursor:pointer; font-family:'Lato',sans-serif; transition:all 0.2s;
}
.wh-back-btn:hover { background:#FFF6E5; }

/* Body — left + right same as profile */
.wh-body { display:flex; flex:1; }

/* Left panel — same warm white as profile */
.wh-left {
  width:260px; flex-shrink:0;
  background:linear-gradient(160deg,#FFF8F0 0%,#FFF0DC 100%);
  border-right:1px solid #EED9BE;
  padding:28px 22px; display:flex; flex-direction:column; gap:18px;
}

.wh-left-icon-wrap { display:flex; flex-direction:column; align-items:center; gap:10px; }
.wh-left-icon {
  width:72px; height:72px; border-radius:50%;
  background:linear-gradient(135deg,#B87333,#C9A44C);
  display:flex; align-items:center; justify-content:center; font-size:30px;
  border:3px solid rgba(184,115,51,0.25);
  box-shadow:0 4px 16px rgba(184,115,51,0.2);
}
.wh-left-title { font-family:'Playfair Display',serif; color:#3E2723; font-size:15px; font-weight:700; text-align:center; }
.wh-left-sub   { color:#9E8272; font-size:12px; text-align:center; }

.wh-divider { height:1px; background:#EED9BE; }

/* Stat cards in left panel */
.wh-stat-cards { display:flex; flex-direction:column; gap:8px; }
.wh-stat-card {
  background:#fff; border:1px solid #EED9BE; border-radius:11px; padding:11px 13px;
  box-shadow:0 1px 4px rgba(184,115,51,0.06);
}
.wh-stat-label { color:#B87333; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:3px; }
.wh-stat-val   { color:#3E2723; font-size:20px; font-weight:800; font-family:'Playfair Display',serif; }
.wh-stat-desc  { color:#9E8272; font-size:11px; margin-top:1px; }

/* Preset buttons in left panel */
.wh-presets-label { color:#B87333; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:8px; }
.wh-presets-list  { display:flex; flex-direction:column; gap:6px; }
.wh-preset-btn {
  width:100%; padding:8px 12px; background:#fff;
  border:1px solid #E0D0BC; border-radius:9px;
  color:#3E2723; font-weight:600; font-size:12px;
  cursor:pointer; font-family:'Lato',sans-serif;
  text-align:left; transition:all 0.2s;
}
.wh-preset-btn:hover { background:#FFF6E5; border-color:#B87333; color:#B87333; }

.wh-left-deco { margin-top:auto; text-align:center; font-size:22px; letter-spacing:6px; opacity:0.2; }

/* Right — schedule */
.wh-right { flex:1; padding:26px 30px; overflow-y:auto; }

.wh-section {
  background:#fff; border-radius:16px; padding:22px 26px; margin-bottom:18px;
  box-shadow:0 2px 10px rgba(184,115,51,0.06); border:1px solid #EEE5D6;
}
.wh-section-title {
  font-family:'Playfair Display',serif; font-size:15px; font-weight:700; color:#3E2723;
  padding-bottom:13px; margin-bottom:4px; border-bottom:1px solid #F0E6D8;
}

/* Day rows */
.wh-day-row {
  display:flex; align-items:center; gap:14px;
  padding:13px 0; border-bottom:1px solid #F5EDE0;
  transition:background 0.15s;
}
.wh-day-row:last-child { border-bottom:none; padding-bottom:0; }
.wh-day-row:first-child { padding-top:10px; }

.wh-day-emoji { font-size:18px; width:26px; text-align:center; flex-shrink:0; }
.wh-day-name  { width:100px; font-size:14px; font-weight:700; color:#3E2723; flex-shrink:0; }
.wh-weekend-tag {
  display:inline-block; font-size:9px; font-weight:700;
  color:#B87333; background:#FFF0DC; border-radius:4px;
  padding:1px 5px; margin-left:4px; letter-spacing:0.4px;
}

/* Toggle */
.wh-toggle {
  width:44px; height:23px; border-radius:12px;
  cursor:pointer; position:relative; border:none; padding:0;
  transition:background 0.3s; flex-shrink:0;
}
.wh-toggle.on  { background:linear-gradient(135deg,#B87333,#C9A44C); box-shadow:0 2px 7px rgba(184,115,51,0.35); }
.wh-toggle.off { background:#DDD3C8; }
.wh-toggle-dot {
  position:absolute; top:2.5px; width:18px; height:18px;
  background:#fff; border-radius:50%;
  transition:left 0.3s cubic-bezier(0.34,1.56,0.64,1);
  box-shadow:0 1px 4px rgba(0,0,0,0.18);
}
.wh-toggle.on  .wh-toggle-dot { left:22px; }
.wh-toggle.off .wh-toggle-dot { left:3px;  }

.wh-status-pill {
  width:54px; font-size:10.5px; font-weight:700;
  padding:3px 0; border-radius:20px; text-align:center; flex-shrink:0;
}
.wh-status-pill.open   { background:#E8F5E9; color:#2E7D32; }
.wh-status-pill.closed { background:#F5F5F5; color:#BDBDBD; }

/* Time inputs */
.wh-time-area { display:flex; align-items:center; gap:8px; flex:1; }
.wh-time-grp  { display:flex; flex-direction:column; gap:2px; }
.wh-time-lbl  { font-size:9px; font-weight:700; color:#C9A44C; text-transform:uppercase; letter-spacing:0.4px; }
.wh-time-input {
  border:1.5px solid #E0D0BC; border-radius:9px;
  padding:7px 10px; font-size:13px; color:#3E2723;
  background:#FDFAF6; outline:none;
  font-family:'Lato',sans-serif; font-weight:600;
  cursor:pointer; transition:all 0.2s; width:100px;
}
.wh-time-input:focus { border-color:#B87333; background:#fff; box-shadow:0 0 0 3px rgba(184,115,51,0.1); }
.wh-time-sep { color:#C9A44C; font-weight:700; font-size:14px; margin-top:14px; }
.wh-dur      { color:#B87333; font-size:11px; font-weight:700; background:#FFF6E5; padding:3px 8px; border-radius:6px; margin-top:14px; white-space:nowrap; }
.wh-closed-txt { color:#D0C0B0; font-size:13px; font-style:italic; }

/* Save row */
.wh-save-row { display:flex; align-items:center; gap:14px; }
.wh-save-btn {
  padding:12px 30px; background:linear-gradient(135deg,#B87333,#C9A44C);
  border:none; border-radius:11px; color:#fff; font-weight:700; font-size:15px;
  cursor:pointer; font-family:'Lato',sans-serif;
  box-shadow:0 4px 14px rgba(184,115,51,0.28); transition:all 0.3s;
  display:flex; align-items:center; gap:8px;
}
.wh-save-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 22px rgba(184,115,51,0.38); }
.wh-save-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
.wh-spinner {
  width:15px; height:15px; border:2px solid rgba(255,255,255,0.4);
  border-top-color:#fff; border-radius:50%; animation:whspin 0.7s linear infinite;
}
@keyframes whspin { to { transform:rotate(360deg); } }
.wh-saved-msg { color:#2e7d32; font-size:13px; font-weight:700; }
`;

const WorkHours = () => {
  const navigate = useNavigate();
  const [hours,  setHours]  = useState(() => getInitialHours());
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const toggle  = (key) => { setHours(p => ({ ...p, [key]: { ...p[key], open: !p[key].open } })); setSaved(false); };
  const setTime = (key, field, val) => { setHours(p => ({ ...p, [key]: { ...p[key], [field]: val } })); setSaved(false); };

  const applyPreset = (keys) => {
    setHours(p => { const n={...p}; DAYS.forEach(d=>{n[d.key]={...n[d.key],open:keys.includes(d.key)};}); return n; });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    try { localStorage.setItem("shopWorkHours", JSON.stringify(hours)); } catch (_) {}
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  const openCount  = DAYS.filter(d => hours[d.key]?.open).length;
  const totalHrs   = DAYS.reduce((acc, d) => {
    const h = hours[d.key];
    if (!h?.open) return acc;
    try {
      const [fh,fm] = (h.from||"09:00").split(":").map(Number);
      const [th,tm] = (h.to||"18:00").split(":").map(Number);
      const diff = (th*60+tm)-(fh*60+fm);
      return acc + (diff > 0 ? diff/60 : 0);
    } catch { return acc; }
  }, 0);

  const presets = [
    { label:"⚡ Mon – Fri (5 days)",  keys:["monday","tuesday","wednesday","thursday","friday"] },
    { label:"🔥 Mon – Sat (6 days)",  keys:["monday","tuesday","wednesday","thursday","friday","saturday"] },
    { label:"🌟 All 7 Days",          keys: DAYS.map(d=>d.key) },
    { label:"😴 All Closed",          keys:[] },
  ];

  return (
    <div className="wh-page">
      <style>{css}</style>
      <ShopkeeperSidebar active="work-hours" />

      <div className="wh-main">

        {/* Topbar */}
        <div className="wh-topbar">
          <div>
            <h1 className="wh-topbar-title">Work Hours</h1>
            <p className="wh-topbar-sub">Set your shop's opening & closing schedule</p>
          </div>
          <button className="wh-back-btn" onClick={() => navigate("/shopkeeper/dashboard")}>← Dashboard</button>
        </div>

        <div className="wh-body">

          {/* Left panel */}
          <div className="wh-left">
            <div className="wh-left-icon-wrap">
              <div className="wh-left-icon">📅</div>
              <div className="wh-left-title">Shop Schedule</div>
              <div className="wh-left-sub">Manage your opening times</div>
            </div>

            <div className="wh-divider" />

            {/* Stats */}
            <div className="wh-stat-cards">
              <div className="wh-stat-card">
                <div className="wh-stat-label">📗 Days Open</div>
                <div className="wh-stat-val">{openCount}</div>
                <div className="wh-stat-desc">days per week</div>
              </div>
              <div className="wh-stat-card">
                <div className="wh-stat-label">⏱ Hours / Week</div>
                <div className="wh-stat-val">{Math.round(totalHrs)}</div>
                <div className="wh-stat-desc">total open hours</div>
              </div>
              <div className="wh-stat-card">
                <div className="wh-stat-label">🔒 Days Closed</div>
                <div className="wh-stat-val">{7 - openCount}</div>
                <div className="wh-stat-desc">days per week</div>
              </div>
            </div>

            <div className="wh-divider" />

            {/* Presets */}
            <div>
              <div className="wh-presets-label">⚡ Quick Presets</div>
              <div className="wh-presets-list">
                {presets.map(p => (
                  <button key={p.label} className="wh-preset-btn" onClick={() => applyPreset(p.keys)}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="wh-left-deco">🏺 🪔 ⚱️ 🔔</div>
          </div>

          {/* Right — schedule */}
          <div className="wh-right">
            <div className="wh-section">
              <div className="wh-section-title">🗓️ Weekly Schedule</div>

              {DAYS.map(d => {
                const h = hours[d.key] ?? { open:false, from:"09:00", to:"18:00" };
                const isWknd = d.key==="saturday"||d.key==="sunday";
                return (
                  <div key={d.key} className="wh-day-row">
                    <span className="wh-day-emoji">{d.emoji}</span>
                    <span className="wh-day-name">
                      {d.label}
                      {isWknd && <span className="wh-weekend-tag">WKD</span>}
                    </span>

                    <button className={`wh-toggle ${h.open?"on":"off"}`} onClick={() => toggle(d.key)}>
                      <div className="wh-toggle-dot" />
                    </button>

                    <span className={`wh-status-pill ${h.open?"open":"closed"}`}>
                      {h.open ? "Open" : "Closed"}
                    </span>

                    {h.open ? (
                      <div className="wh-time-area">
                        <div className="wh-time-grp">
                          <span className="wh-time-lbl">Opens</span>
                          <input className="wh-time-input" type="time"
                            value={h.from||"09:00"} onChange={e => setTime(d.key,"from",e.target.value)} />
                        </div>
                        <span className="wh-time-sep">→</span>
                        <div className="wh-time-grp">
                          <span className="wh-time-lbl">Closes</span>
                          <input className="wh-time-input" type="time"
                            value={h.to||"18:00"} onChange={e => setTime(d.key,"to",e.target.value)} />
                        </div>
                        {getDuration(h.from,h.to) && (
                          <span className="wh-dur">⏱ {getDuration(h.from,h.to)}</span>
                        )}
                      </div>
                    ) : (
                      <span className="wh-closed-txt">🔒 Closed for the day</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Save */}
            <div className="wh-save-row">
              <button className="wh-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? <><span className="wh-spinner"/>Saving…</> : <>💾 Save Work Hours</>}
              </button>
              {saved && <span className="wh-saved-msg">✅ Saved successfully!</span>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WorkHours;