import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// ── Character-level blockers ─────────────────────────────────────────────────
const CTRL = ["Backspace","Delete","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Tab","Home","End"];

// Name: sirf letters aur spaces
const allowOnlyLettersSpaces = (e) => {
  if (CTRL.includes(e.key)) return;
  if (!/^[a-zA-Z\s]$/.test(e.key)) e.preventDefault();
};

// Email: valid email characters only
const allowEmailChars = (e) => {
  if (CTRL.includes(e.key)) return;
  if (!/^[a-zA-Z0-9@._+\-]$/.test(e.key)) e.preventDefault();
};

// Phone: digits only, first digit 6-9, max 10
const makePhoneKeyDown = (currentValue) => (e) => {
  if (CTRL.includes(e.key)) return;
  if (!/^\d$/.test(e.key))                                    { e.preventDefault(); return; }
  if (currentValue.length >= 10)                              { e.preventDefault(); return; }
  if (currentValue.length === 0 && !/^[6-9]$/.test(e.key))   { e.preventDefault(); return; }
};

// Address / City / State: letters, numbers, spaces, commas, hyphens
const allowAddressChars = (e) => {
  if (CTRL.includes(e.key)) return;
  if (!/^[a-zA-Z0-9\s,.\-\/]$/.test(e.key)) e.preventDefault();
};

// Pincode: digits only, max 6
const makePincodeKeyDown = (currentValue) => (e) => {
  if (CTRL.includes(e.key)) return;
  if (!/^\d$/.test(e.key))          { e.preventDefault(); return; }
  if (currentValue.length >= 6)     { e.preventDefault(); return; }
};
// ────────────────────────────────────────────────────────────────────────────

const FIELDS = [
  { k:'fullName', l:'Full Name',   t:'text',  p:'Your full name',     full:false },
  { k:'phone',    l:'Phone',       t:'tel',   p:'+91 XXXXX XXXXX',    full:false },
  { k:'email',    l:'Email',       t:'email', p:'your@email.com',     full:true  },
  { k:'address',  l:'Address',     t:'text',  p:'Street, area',       full:true  },
  { k:'city',     l:'City',        t:'text',  p:'City name',          full:false },
  { k:'state',    l:'State',       t:'text',  p:'State',              full:false },
  { k:'pincode',  l:'Pincode',     t:'text',  p:'PIN code',           full:false },
];

// Map field key → onKeyDown handler
const getKeyDownHandler = (fieldKey, currentValue) => {
  switch (fieldKey) {
    case 'fullName': return allowOnlyLettersSpaces;
    case 'phone':    return makePhoneKeyDown(currentValue);
    case 'email':    return allowEmailChars;
    case 'address':  return allowAddressChars;
    case 'city':     return allowOnlyLettersSpaces;
    case 'state':    return allowOnlyLettersSpaces;
    case 'pincode':  return makePincodeKeyDown(currentValue);
    default:         return undefined;
  }
};

// Map field key → extra input props
const getExtraProps = (fieldKey) => {
  switch (fieldKey) {
    case 'fullName': return { maxLength: 50 };
    case 'phone':    return { maxLength: 10, inputMode: 'numeric' };
    case 'email':    return { maxLength: 100 };
    case 'address':  return { maxLength: 200 };
    case 'city':     return { maxLength: 50 };
    case 'state':    return { maxLength: 50 };
    case 'pincode':  return { maxLength: 6, inputMode: 'numeric' };
    default:         return {};
  }
};

export default function ProfilePage() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const key = user?.email || 'guest';

  const [editing, setEditing] = useState(false);
  const [saved,   setSaved]   = useState(false);
  const blank = { fullName:'', email:'', phone:'', address:'', city:'', state:'', pincode:'' };

  const [profile, setProfile] = useState(() => {
    try {
      const s = localStorage.getItem(`profile_${key}`);
      return s ? JSON.parse(s) : { ...blank, fullName: user?.fullName||'', email: user?.email||'' };
    } catch { return { ...blank, fullName: user?.fullName||'', email: user?.email||'' }; }
  });

  useEffect(() => { if (!user) navigate('/LoginPage', { replace: true }); }, [user]);

  const initials = (profile.fullName || 'U').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  const joinDate = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString('en-IN', { month:'long', year:'numeric' })
    : 'Recently';
  const filled = FIELDS.filter(f=>profile[f.k]?.toString().trim()).length;
  const pct    = Math.round((filled/FIELDS.length)*100);

  const save = () => {
    localStorage.setItem(`profile_${key}`, JSON.stringify(profile));
    setEditing(false); setSaved(true);
    setTimeout(()=>setSaved(false), 3000);
  };
  const cancel = () => {
    try { const s=localStorage.getItem(`profile_${key}`); if(s) setProfile(JSON.parse(s)); } catch {}
    setEditing(false);
  };
  const handleLogout = () => { logout(); navigate('/', { replace:true }); };

  return (
    <div style={s.root}>
      <style>{css}</style>
      <div style={s.bgOrb1}/><div style={s.bgOrb2}/><div style={s.bgMesh}/>

      <div style={s.layout}>

        {/* ═══ SIDEBAR ═══ */}
        <aside style={s.sidebar}>
          <div style={s.sideCard} className="pf-card">

            <div style={s.avaWrap}>
              <div style={s.avaOuter}>
                <div style={s.avaInner}>{initials}</div>
              </div>
              <div style={s.onlineDot}/>
            </div>

            <h2 style={s.sName}>{profile.fullName || 'Your Name'}</h2>
            <p style={s.sEmail}>{profile.email || user?.email}</p>

            <div style={s.badge}>
              <span>✦</span>
              <span>Songir Member</span>
            </div>

            <div style={s.sep}/>

            <div style={s.statsRow}>
              {[
                { val: pct+'%',  lbl:'Complete' },
                { val: joinDate.split(' ')[1]||'2025', lbl:'Joined'  },
              ].map(x=>(
                <div key={x.lbl} style={s.statBox}>
                  <span style={s.statVal}>{x.val}</span>
                  <span style={s.statLbl}>{x.lbl}</span>
                </div>
              ))}
            </div>

            <div style={s.sep}/>

            <div style={s.infoList}>
              {[
                { icon:'📅', lbl:'Since',    val: joinDate },
                { icon:'📍', lbl:'Location', val: [profile.city,profile.state].filter(Boolean).join(', ')||'—' },
                { icon:'📱', lbl:'Phone',    val: profile.phone||'—' },
              ].map(row=>(
                <div key={row.lbl} style={s.infoRow}>
                  <span style={s.infoIco}>{row.icon}</span>
                  <div style={s.infoText}>
                    <span style={s.infoLbl}>{row.lbl}</span>
                    <span style={s.infoVal}>{row.val}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={s.sep}/>

            <div style={s.ringRow}>
              <Ring pct={pct}/>
              <div>
                <div style={s.ringPct}>{pct}%</div>
                <div style={s.ringLbl}>Profile complete</div>
              </div>
            </div>

            <div style={s.sep}/>

            <button style={s.sEditBtn} className="pf-editbtn" onClick={()=>setEditing(true)}>
              ✏️ &nbsp;Edit Profile
            </button>
            <button style={s.sLogBtn} className="pf-logout" onClick={handleLogout}>
              ↗ &nbsp;Sign Out
            </button>
          </div>
        </aside>

        {/* ═══ MAIN ═══ */}
        <main style={s.main}>

          <div style={s.pageHead}>
            <div>
              <h1 style={s.pageTitle}>Personal Information</h1>
              <p style={s.pageSub}>Your profile details — stored securely on this device</p>
            </div>
            {!editing ? (
              <button style={s.editBtn} className="pf-editbtn2" onClick={()=>setEditing(true)}>
                ✏️ Edit Profile
              </button>
            ) : (
              <div style={s.btnPair}>
                <button style={s.cancelBtn} onClick={cancel}>Cancel</button>
                <button style={s.saveBtn} className="pf-save" onClick={save}>Save Changes</button>
              </div>
            )}
          </div>

          {saved && <div style={s.toast} className="pf-toast">✓&nbsp; Profile updated successfully!</div>}

          {/* Form card */}
          <div style={s.formCard} className="pf-formcard">
            <div style={s.cardStripe}/>
            <div style={s.formGrid}>
              {FIELDS.map(f=>(
                <div key={f.k} style={{...s.fGrp, gridColumn: f.full?'span 2':'span 1'}}>
                  <label style={s.fLbl}>{f.l}</label>
                  {editing ? (
                    <input
                      className="pf-input"
                      style={s.fInp}
                      type={f.t}
                      placeholder={f.p}
                      value={profile[f.k]||''}
                      onChange={e=>setProfile({...profile,[f.k]:e.target.value})}
                      onKeyDown={getKeyDownHandler(f.k, profile[f.k]||'')}
                      {...getExtraProps(f.k)}
                    />
                  ) : (
                    <div style={s.fVal}>
                      {profile[f.k] || <span style={s.fEmpty}>Not added</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {pct < 100 && (
              <div style={s.hint}>
                <span style={{fontSize:'1rem',flexShrink:0}}>💡</span>
                <p style={{margin:0, fontSize:'0.8rem', color:'#7a4a0a', lineHeight:1.6}}>
                  <strong>Complete your profile</strong> — missing:{' '}
                  <em style={{color:'#9f5e1a'}}>{FIELDS.filter(f=>!profile[f.k]).map(f=>f.l).join(', ')}</em>
                </p>
              </div>
            )}
          </div>

          {/* Danger zone */}
          <div style={s.dangerCard} className="pf-card">
            <div style={s.dangerRow}>
              <div>
                <div style={s.dTitle}>Sign Out of Account</div>
                <div style={s.dSub}>Your data is saved. You can sign back in anytime.</div>
              </div>
              <button style={s.dBtn} className="pf-danger" onClick={handleLogout}>
                Sign Out ↗
              </button>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

function Ring({ pct }) {
  const R    = 30;
  const circ = 2 * Math.PI * R;
  const fill = (pct / 100) * circ;
  const col  = pct===100 ? '#22c55e' : pct>=60 ? '#C9943D' : '#f59e0b';
  return (
    <svg width="72" height="72" style={{flexShrink:0,transform:'rotate(-90deg)'}}>
      <circle cx="36" cy="36" r={R} fill="none" stroke="rgba(201,148,61,0.15)" strokeWidth="5"/>
      <circle cx="36" cy="36" r={R} fill="none" stroke={col} strokeWidth="5"
        strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
        style={{transition:'stroke-dasharray 1.2s ease'}}/>
    </svg>
  );
}

/* ═══════════════ CSS ═══════════════ */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Outfit:wght@300;400;500;600;700&display=swap');

  @keyframes fadeIn  { from{opacity:0}to{opacity:1} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)} }
  @keyframes orbMove { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-30px) scale(1.05)} }
  @keyframes toastIn { from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)} }
  @keyframes shimmer { 0%{background-position:-200% center}100%{background-position:200% center} }

  .pf-card     { animation:fadeUp 0.5s ease both; }
  .pf-formcard { animation:fadeUp 0.5s ease 0.1s both; }
  .pf-toast    { animation:toastIn 0.3s ease both; }

  .pf-editbtn:hover  { background:rgba(201,148,61,0.28)!important; border-color:rgba(201,148,61,0.7)!important; transform:translateY(-2px); }
  .pf-logout:hover   { background:rgba(255,255,255,0.12)!important; border-color:rgba(255,255,255,0.3)!important; }
  .pf-editbtn2:hover { background:rgba(201,148,61,0.14)!important; transform:translateY(-1px); box-shadow:0 6px 18px rgba(201,148,61,0.2)!important; }
  .pf-save:hover     { transform:translateY(-2px)!important; box-shadow:0 10px 28px rgba(201,148,61,0.55)!important; }
  .pf-input:focus    { border-color:#C9943D!important; box-shadow:0 0 0 3.5px rgba(201,148,61,0.14)!important; outline:none; background:#fffdf6!important; }
  .pf-input::placeholder { color:#c4a882; }
  .pf-danger:hover   { background:#fef2f2!important; border-color:#fca5a5!important; color:#b91c1c!important; transform:translateY(-1px); }
`;

/* ═══════════════ STYLES ═══════════════ */
const s = {
  root: {
    minHeight:'100vh', background:'#f6efe2',
    fontFamily:"'Outfit',sans-serif", position:'relative',
    overflow:'hidden', animation:'fadeIn 0.35s ease',
  },

  bgMesh: {
    position:'fixed', inset:0, zIndex:0, pointerEvents:'none',
    background:'radial-gradient(ellipse at 20% 15%, rgba(201,148,61,0.1) 0%, transparent 55%), radial-gradient(ellipse at 80% 85%, rgba(122,74,10,0.08) 0%, transparent 55%), linear-gradient(160deg,#faf4e6 0%,#f0e6d0 100%)',
  },
  bgOrb1: {
    position:'fixed', width:'520px', height:'520px', borderRadius:'50%',
    background:'radial-gradient(circle, rgba(201,148,61,0.1) 0%, transparent 70%)',
    top:'-150px', right:'-100px', zIndex:0, pointerEvents:'none',
    animation:'orbMove 16s ease infinite',
  },
  bgOrb2: {
    position:'fixed', width:'400px', height:'400px', borderRadius:'50%',
    background:'radial-gradient(circle, rgba(122,74,10,0.08) 0%, transparent 70%)',
    bottom:'-100px', left:'-80px', zIndex:0, pointerEvents:'none',
    animation:'orbMove 20s ease infinite 4s',
  },

  layout: {
    maxWidth:'1140px', margin:'0 auto',
    padding:'2.5rem 1.75rem',
    display:'grid', gridTemplateColumns:'290px 1fr',
    gap:'2rem', position:'relative', zIndex:1,
  },

  sidebar: {},
  sideCard: {
    background:'linear-gradient(155deg, #1c0900 0%, #3a1a08 30%, #5c2e0c 62%, #7a4014 88%, #9a5820 100%)',
    borderRadius:'22px', padding:'2rem 1.6rem',
    boxShadow:'0 28px 70px rgba(28,9,0,0.32), 0 6px 24px rgba(201,148,61,0.14), inset 0 1px 0 rgba(255,228,160,0.14)',
    border:'1px solid rgba(201,148,61,0.25)',
    position:'sticky', top:'8.5rem',
  },

  avaWrap:  { position:'relative', display:'flex', justifyContent:'center', marginBottom:'1.25rem' },
  avaOuter: {
    width:'92px', height:'92px', borderRadius:'50%',
    padding:'3px', background:'conic-gradient(from 45deg, #C9943D 0%, #FFE4A0 35%, #9f5e1a 65%, #C9943D 100%)',
    display:'flex', alignItems:'center', justifyContent:'center',
    boxShadow:'0 8px 36px rgba(201,148,61,0.5)',
  },
  avaInner: {
    width:'86px', height:'86px', borderRadius:'50%',
    background:'linear-gradient(135deg,#C9943D 0%,#9f5e1a 55%,#7a3a08 100%)',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontFamily:"'Cormorant Garamond',serif", fontSize:'2.1rem', fontWeight:700,
    color:'#fff', letterSpacing:'-0.5px',
    boxShadow:'inset 0 2px 6px rgba(0,0,0,0.2)',
  },
  onlineDot: {
    position:'absolute', bottom:'2px', right:'calc(50% - 46px)',
    width:'14px', height:'14px', background:'#22c55e',
    borderRadius:'50%', border:'2.5px solid #1c0900',
    boxShadow:'0 2px 8px rgba(34,197,94,0.5)',
  },

  sName:  { fontFamily:"'Cormorant Garamond',serif", color:'#fff', fontSize:'1.5rem', fontWeight:700, textAlign:'center', margin:'0 0 0.22rem', lineHeight:1.25 },
  sEmail: { color:'rgba(255,228,160,0.5)', fontSize:'0.72rem', textAlign:'center', margin:'0 0 0.85rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
  badge:  {
    display:'flex', alignItems:'center', justifyContent:'center', gap:'0.38rem',
    background:'rgba(201,148,61,0.2)', border:'1px solid rgba(201,148,61,0.4)',
    borderRadius:'20px', padding:'0.28rem 0.9rem', margin:'0 auto',
    width:'fit-content', color:'#FFE4A0', fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.5px',
  },
  sep:    { height:'1px', background:'linear-gradient(90deg,transparent,rgba(255,228,160,0.12),transparent)', margin:'1rem 0' },

  statsRow: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' },
  statBox:  {
    background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,228,160,0.1)',
    borderRadius:'10px', padding:'0.65rem', textAlign:'center',
  },
  statVal: { display:'block', fontFamily:"'Cormorant Garamond',serif", color:'#fff', fontSize:'1.2rem', fontWeight:700, lineHeight:1 },
  statLbl: { display:'block', color:'rgba(255,228,160,0.45)', fontSize:'0.6rem', letterSpacing:'1px', textTransform:'uppercase', marginTop:'0.2rem' },

  infoList: { display:'flex', flexDirection:'column', gap:'0.65rem' },
  infoRow:  { display:'flex', alignItems:'center', gap:'0.6rem' },
  infoIco:  { fontSize:'0.95rem', flexShrink:0, width:'22px', textAlign:'center' },
  infoText: { display:'flex', flexDirection:'column', gap:'0.06rem', minWidth:0 },
  infoLbl:  { fontSize:'0.6rem', color:'rgba(255,228,160,0.4)', letterSpacing:'1.2px', textTransform:'uppercase', fontWeight:600 },
  infoVal:  { fontSize:'0.78rem', color:'rgba(255,255,255,0.8)', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },

  ringRow:  { display:'flex', alignItems:'center', gap:'0.85rem' },
  ringPct:  { fontFamily:"'Cormorant Garamond',serif", color:'#fff', fontSize:'1.65rem', fontWeight:700, lineHeight:1 },
  ringLbl:  { fontSize:'0.67rem', color:'rgba(255,228,160,0.45)', marginTop:'0.18rem', letterSpacing:'0.4px' },

  sEditBtn: {
    width:'100%', padding:'0.72rem', cursor:'pointer',
    background:'rgba(201,148,61,0.18)', border:'1.5px solid rgba(201,148,61,0.45)',
    borderRadius:'11px', color:'#FFE4A0', fontSize:'0.82rem', fontWeight:600,
    fontFamily:"'Outfit',sans-serif", transition:'all 0.25s',
    display:'flex', alignItems:'center', justifyContent:'center',
    marginBottom:'0.45rem', letterSpacing:'0.2px',
  },
  sLogBtn: {
    width:'100%', padding:'0.65rem', cursor:'pointer',
    background:'transparent', border:'1px solid rgba(255,255,255,0.13)',
    borderRadius:'11px', color:'rgba(255,255,255,0.5)', fontSize:'0.78rem', fontWeight:500,
    fontFamily:"'Outfit',sans-serif", transition:'all 0.25s',
    display:'flex', alignItems:'center', justifyContent:'center',
  },

  main:     { display:'flex', flexDirection:'column', gap:'1.5rem' },

  pageHead: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'0.75rem' },
  pageTitle:{ fontFamily:"'Cormorant Garamond',serif", color:'#1a0800', fontSize:'2.1rem', margin:'0 0 0.2rem', fontWeight:700, lineHeight:1.1 },
  pageSub:  { color:'#b09878', fontSize:'0.8rem', margin:0 },

  editBtn: {
    background:'rgba(201,148,61,0.1)', border:'1.5px solid rgba(201,148,61,0.3)',
    color:'#9f5e1a', padding:'0.58rem 1.25rem', borderRadius:'10px',
    cursor:'pointer', fontSize:'0.82rem', fontWeight:700,
    fontFamily:"'Outfit',sans-serif", transition:'all 0.25s',
    display:'flex', alignItems:'center', gap:'0.4rem',
  },
  btnPair:   { display:'flex', gap:'0.5rem' },
  cancelBtn: {
    background:'#f5efe3', border:'1px solid #e0cdb0', color:'#9a7b5a',
    padding:'0.58rem 1rem', borderRadius:'10px', cursor:'pointer',
    fontSize:'0.8rem', fontWeight:600, fontFamily:"'Outfit',sans-serif",
  },
  saveBtn: {
    background:'linear-gradient(135deg,#C9943D,#9f5e1a)',
    border:'none', color:'#fff', padding:'0.58rem 1.3rem', borderRadius:'10px',
    cursor:'pointer', fontSize:'0.82rem', fontWeight:700,
    fontFamily:"'Outfit',sans-serif", transition:'all 0.25s',
    boxShadow:'0 4px 16px rgba(201,148,61,0.4)',
  },

  toast: {
    background:'linear-gradient(135deg,#f0fdf4,#d1fae5)',
    border:'1px solid #6ee7b7', color:'#065f46',
    padding:'0.78rem 1.25rem', borderRadius:'12px',
    fontSize:'0.85rem', fontWeight:600,
    display:'flex', alignItems:'center', gap:'0.4rem',
    boxShadow:'0 4px 16px rgba(16,185,129,0.12)',
  },

  formCard: {
    background:'#fff', borderRadius:'20px',
    boxShadow:'0 6px 35px rgba(62,39,19,0.09), 0 1px 5px rgba(201,148,61,0.07)',
    border:'1px solid rgba(201,148,61,0.14)', overflow:'hidden',
    position:'relative',
  },
  cardStripe: {
    height:'4px',
    background:'linear-gradient(90deg,#7a4a0a,#C9943D,#FFE4A0,#C9943D,#7a4a0a)',
    backgroundSize:'300% 100%', animation:'shimmer 4s linear infinite',
  },

  formGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.35rem', padding:'1.75rem 2rem', paddingBottom:'0.5rem' },

  fGrp:   { display:'flex', flexDirection:'column', gap:'0.42rem' },
  fLbl:   { fontSize:'0.68rem', fontWeight:700, letterSpacing:'1.3px', textTransform:'uppercase', color:'#5a3618' },
  fInp:   {
    padding:'0.85rem 1.1rem', border:'1.5px solid #e4d4bc', borderRadius:'10px',
    fontSize:'0.88rem', color:'#1a0800', background:'#fdfaf4',
    fontFamily:"'Outfit',sans-serif", transition:'all 0.25s',
    width:'100%', boxSizing:'border-box',
    boxShadow:'inset 0 1px 3px rgba(62,39,19,0.05)',
  },
  fVal:   {
    padding:'0.85rem 1.1rem',
    background:'linear-gradient(135deg,#fdfaf3,#f8f0e3)',
    borderRadius:'10px', fontSize:'0.88rem', color:'#2a1408',
    minHeight:'46px', display:'flex', alignItems:'center',
    border:'1.5px solid transparent',
    boxShadow:'inset 0 1px 3px rgba(62,39,19,0.04)',
  },
  fEmpty: { color:'#c9a87a', fontStyle:'italic', fontSize:'0.82rem' },

  hint: {
    display:'flex', alignItems:'flex-start', gap:'0.65rem',
    background:'linear-gradient(135deg,rgba(201,148,61,0.06),rgba(184,118,46,0.1))',
    borderTop:'1px solid rgba(201,148,61,0.12)',
    padding:'0.9rem 2rem',
  },

  dangerCard: {
    background:'#fff', borderRadius:'16px', padding:'1.3rem 1.5rem',
    boxShadow:'0 2px 14px rgba(62,39,19,0.07)',
    border:'1px solid rgba(252,165,165,0.35)',
  },
  dangerRow:  { display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.75rem' },
  dTitle:     { color:'#b91c1c', fontSize:'0.9rem', fontWeight:700, marginBottom:'0.18rem' },
  dSub:       { color:'#9a7b5a', fontSize:'0.78rem' },
  dBtn: {
    background:'#fff', border:'1.5px solid rgba(252,165,165,0.55)',
    color:'#dc2626', padding:'0.6rem 1.4rem', borderRadius:'10px',
    cursor:'pointer', fontSize:'0.82rem', fontWeight:600,
    fontFamily:"'Outfit',sans-serif", transition:'all 0.25s', flexShrink:0,
  },
};