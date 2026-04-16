import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// ✅ Basic email format check
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export default function Login() {
  const { login } = useApp();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ email:'', password:'' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) return setError('Please fill in all fields!');
    if (!isValidEmail(form.email))     return setError('Please enter a valid email address!');
    setLoading(true);

    const result = await login(form.email, form.password);
    setLoading(false);

    if (!result.success) return setError(result.message);
    navigate('/', { replace: true });
  };

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* LEFT */}
      <div style={s.left}>
        <div style={s.leftContent}>
          <div style={s.brand}>
            <div style={s.logoBox}>
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                <path d="M16 4L8 8V16C8 22 16 28 16 28S24 22 24 16V8L16 4Z"
                  stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="rgba(255,255,255,0.15)"/>
                <path d="M12 16L14.5 18.5L20 13" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div style={s.logoName}>Songir</div>
              <div style={s.logoSub}>HANDCRAFTED</div>
            </div>
          </div>

          <h2 style={s.leftTitle}>Welcome Back<br/>to Our Craft<br/>World ✦</h2>
          <p style={s.leftDesc}>Sign in and explore 1,200+ authentic brass & copper treasures from master artisans.</p>

          <div style={s.features}>
            {['320+ Verified Artisans','Free Shipping on ₹999+','100% Authentic Craft','7-Day Easy Returns'].map(f => (
              <div key={f} style={s.fItem}><span style={s.fDot}>✦</span><span>{f}</span></div>
            ))}
          </div>

          <div style={s.testimonial}>
            <div style={s.tStars}>★★★★★</div>
            <p style={s.tText}>"Best place for authentic handcrafted items. Quality is unmatched!"</p>
            <div style={s.tAuthor}>— Priya S., Mumbai</div>
          </div>
        </div>
        <div style={s.c1}/><div style={s.c2}/><div style={s.c3}/>
      </div>

      {/* RIGHT */}
      <div style={s.right}>
        <div style={s.card}>
          <h2 style={s.title}>Login</h2>
          <p style={s.subtitle}>Access your account & orders</p>

          {error && <div style={s.err}>⚠&nbsp; {error}</div>}

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.grp}>
              <label style={s.lbl}>Email Address</label>
              <input className="sng-input" style={s.inp} type="email" name="email"
                placeholder="your@email.com" value={form.email} onChange={handleChange}/>
            </div>
            <div style={s.grp}>
              <label style={s.lbl}>Password</label>
              <input className="sng-input" style={s.inp} type="password" name="password"
                placeholder="Enter your password" value={form.password} onChange={handleChange}/>
            </div>

            <button type="submit" className="sng-btn" style={s.btn}>
              {loading
                ? <span style={s.spin}/>
                : <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem'}}>Login <span>→</span></span>
              }
            </button>
          </form>

          <div style={s.divider}>
            <span style={s.dLine}/><span style={s.dTxt}>New to Songir?</span><span style={s.dLine}/>
          </div>

          <Link to="/Registration" className="sng-outline" style={s.outline}>
            Create Free Account
          </Link>

          <p style={s.terms}>By signing in you agree to our <span style={s.tl}>Terms</span> & <span style={s.tl}>Privacy Policy</span></p>
        </div>
      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin   { to{transform:rotate(360deg)} }
  @keyframes float1 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(3deg)} }
  @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  .sng-input:focus  { border-color:#C9943D!important; box-shadow:0 0 0 3px rgba(201,148,61,0.15)!important; outline:none; }
  .sng-btn:hover    { transform:translateY(-2px)!important; box-shadow:0 10px 28px rgba(201,148,61,0.5)!important; }
  .sng-btn:active   { transform:translateY(0)!important; }
  .sng-outline:hover{ background:rgba(201,148,61,0.06)!important; border-color:#9f5e1a!important; }
`;

const s = {
  page:    { minHeight:'100vh', display:'flex', fontFamily:"'DM Sans',sans-serif" },
  left:    { flex:'1.1', background:'linear-gradient(150deg,#0f0500 0%,#2a1008 30%,#5a3008 65%,#9f5e1a 100%)', position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', padding:'3rem 2.5rem' },
  leftContent: { position:'relative', zIndex:3, maxWidth:'400px', animation:'fadeUp 0.65s ease both' },
  brand:   { display:'flex', alignItems:'center', gap:'0.85rem', marginBottom:'2.75rem' },
  logoBox: { width:'52px', height:'52px', background:'linear-gradient(135deg,#C9943D,#7a4a0a)', borderRadius:'15px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 28px rgba(201,148,61,0.4)', flexShrink:0 },
  logoName:{ fontFamily:"'Playfair Display',serif", color:'#fff', fontSize:'1.55rem', fontWeight:700, lineHeight:1 },
  logoSub: { color:'rgba(255,228,160,0.5)', fontSize:'0.55rem', letterSpacing:'4px', marginTop:'3px' },
  leftTitle:{ fontFamily:"'Playfair Display',serif", color:'#fff', fontSize:'2.4rem', lineHeight:1.3, margin:'0 0 1rem', fontWeight:700 },
  leftDesc: { color:'rgba(255,255,255,0.58)', fontSize:'0.88rem', lineHeight:1.8, margin:'0 0 2rem' },
  features: { display:'flex', flexDirection:'column', gap:'0.65rem', marginBottom:'2rem' },
  fItem:    { display:'flex', alignItems:'center', gap:'0.7rem', color:'rgba(255,255,255,0.8)', fontSize:'0.85rem', fontWeight:500 },
  fDot:     { color:'#C9943D', fontSize:'0.6rem', flexShrink:0 },
  testimonial:{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px', padding:'1rem 1.1rem' },
  tStars:   { color:'#F9A825', fontSize:'0.8rem', marginBottom:'0.4rem' },
  tText:    { color:'rgba(255,255,255,0.75)', fontSize:'0.82rem', lineHeight:1.6, margin:'0 0 0.4rem', fontStyle:'italic' },
  tAuthor:  { color:'rgba(255,228,160,0.6)', fontSize:'0.72rem', fontWeight:600 },
  c1: { position:'absolute', width:'380px', height:'380px', borderRadius:'50%', border:'1px solid rgba(201,148,61,0.1)', bottom:'-120px', right:'-80px', animation:'float1 10s ease infinite', zIndex:1 },
  c2: { position:'absolute', width:'240px', height:'240px', borderRadius:'50%', border:'1px solid rgba(201,148,61,0.07)', top:'-60px', left:'-60px', animation:'float2 7s ease infinite 1s', zIndex:1 },
  c3: { position:'absolute', width:'140px', height:'140px', borderRadius:'50%', background:'radial-gradient(circle,rgba(201,148,61,0.08),transparent)', top:'40%', right:'5%', animation:'float2 8s ease infinite 2s', zIndex:1 },
  right:   { flex:'1', display:'flex', alignItems:'center', justifyContent:'center', background:'#fdfaf5', padding:'2rem' },
  card:    { width:'100%', maxWidth:'420px', animation:'fadeUp 0.55s ease 0.1s both' },
  title:   { fontFamily:"'Playfair Display',serif", fontSize:'2.1rem', color:'#1a0800', margin:'0 0 0.35rem', fontWeight:700 },
  subtitle:{ color:'#9a7b5a', fontSize:'0.88rem', margin:'0 0 2rem', fontWeight:400 },
  err:     { background:'#fff0f0', border:'1px solid #fca5a5', color:'#b91c1c', padding:'0.75rem 1rem', borderRadius:'10px', fontSize:'0.83rem', marginBottom:'1.25rem', fontWeight:500 },
  form:    { display:'flex', flexDirection:'column', gap:'1.2rem' },
  grp:     { display:'flex', flexDirection:'column', gap:'0.45rem' },
  lbl:     { fontSize:'0.71rem', fontWeight:700, letterSpacing:'1.3px', textTransform:'uppercase', color:'#4a2e1a' },
  inp:     { padding:'0.88rem 1rem', border:'1.5px solid #e8d5bc', borderRadius:'10px', fontSize:'0.9rem', color:'#1a0800', background:'#fff', fontFamily:"'DM Sans',sans-serif", transition:'all 0.22s', boxShadow:'0 1px 3px rgba(62,39,19,0.05)' },
  btn:     { marginTop:'0.5rem', padding:'0.95rem', cursor:'pointer', border:'none', background:'linear-gradient(135deg,#C9943D 0%,#9f5e1a 60%,#7a4a0a 100%)', color:'#fff', borderRadius:'10px', fontSize:'0.95rem', fontWeight:700, fontFamily:"'DM Sans',sans-serif", boxShadow:'0 4px 18px rgba(201,148,61,0.4)', transition:'all 0.25s', letterSpacing:'0.3px' },
  spin:    { width:'18px', height:'18px', border:'2.5px solid rgba(255,255,255,0.3)', borderTop:'2.5px solid #fff', borderRadius:'50%', animation:'spin 0.75s linear infinite', display:'inline-block' },
  divider: { display:'flex', alignItems:'center', gap:'0.75rem', margin:'1.6rem 0' },
  dLine:   { flex:1, height:'1px', background:'#ead9c4' },
  dTxt:    { color:'#bda98a', fontSize:'0.75rem', whiteSpace:'nowrap', fontWeight:500 },
  outline: { display:'block', textAlign:'center', padding:'0.9rem', border:'1.5px solid #C9943D', borderRadius:'10px', color:'#9f5e1a', textDecoration:'none', fontWeight:700, fontSize:'0.9rem', transition:'all 0.22s', fontFamily:"'DM Sans',sans-serif" },
  terms:   { textAlign:'center', marginTop:'1.2rem', fontSize:'0.7rem', color:'#bda98a', lineHeight:1.6 },
  tl:      { color:'#9f5e1a', cursor:'pointer', fontWeight:600 },
};