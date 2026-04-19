// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';

// const FIELDS_STEP1 = [
//   { k:'fullName', l:'Full Name',        t:'text',     p:'Your full name',    req:true },
//   { k:'email',    l:'Email Address',    t:'email',    p:'your@email.com',    req:true },
//   { k:'password', l:'Password',         t:'password', p:'Min. 6 characters', req:true },
//   { k:'confirm',  l:'Confirm Password', t:'password', p:'Repeat password',   req:true },
// ];

// export default function Register() {
//   // ✅ useApp hataya — register function AppContext me nahi hai ab
//   const navigate = useNavigate();
//   const [step, setStep]       = useState(1);
//   const [form, setForm]       = useState({ fullName:'', email:'', password:'', confirm:'', phone:'', address:'', city:'', state:'', pincode:'' });
//   const [error, setError]     = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);

//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

//   const pwStrength = !form.password ? 0 : form.password.length >= 10 ? 3 : form.password.length >= 6 ? 2 : 1;
//   const pwColor    = ['','#ef4444','#f59e0b','#22c55e'][pwStrength];
//   const pwLabel    = ['','Weak','Good','Strong'][pwStrength];

//   const goStep2 = (e) => {
//     e.preventDefault(); setError('');
//     if (!form.fullName.trim())        return setError('Full name is required!');
//     if (!form.email.trim())           return setError('Email is required!');
//     if (form.password.length < 6)     return setError('Password must be at least 6 characters!');
//     if (form.password !== form.confirm) return setError('Passwords do not match!');
//     setStep(2);
//   };

//   // ✅ Backend API call — register is not a function error khatam
//   const submit = async (e) => {
//     e.preventDefault(); setError('');
//     if (!form.phone.trim()) return setError('Phone number is required!');
//     setLoading(true);
//     try {
//       const res  = await fetch('http://localhost:5000/api/users/register', {
//         method:  'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           fullName: form.fullName,
//           email:    form.email,
//           password: form.password,
//           phone:    form.phone,
//           address:  form.address,
//           city:     form.city,
//           state:    form.state,
//           pincode:  form.pincode,
//         }),
//       });
//       const data = await res.json();
//       if (!data.success) {
//         setError(data.message || 'Registration failed. Please try again.');
//       } else {
//         setSuccess('Account created! Redirecting to login...');
//         setTimeout(() => navigate('/LoginPage'), 1600);
//       }
//     } catch {
//       setError('Cannot connect to server. Please try again.');
//     }
//     setLoading(false);
//   };

//   return (
//     <div style={s.page}>
//       <style>{css}</style>

//       {/* LEFT PANEL */}
//       <div style={s.left}>
//         <div style={s.lInner}>
//           <div style={s.brand}>
//             <div style={s.logoBox}>
//               <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
//                 <path d="M16 4L8 8V16C8 22 16 28 16 28S24 22 24 16V8L16 4Z" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="rgba(255,255,255,0.15)"/>
//                 <path d="M12 16L14.5 18.5L20 13" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
//               </svg>
//             </div>
//             <div>
//               <div style={s.lName}>Songir</div>
//               <div style={s.lSub}>HANDCRAFTED</div>
//             </div>
//           </div>

//           <h2 style={s.lTitle}>Join Our<br/>Artisan<br/>Community ✦</h2>
//           <p style={s.lDesc}>Create your free account and explore 1,200+ authentic brass & copper crafts.</p>

//           <div style={s.benefits}>
//             {['Exclusive member discounts','Track all your orders','Save to wishlist','Early access to new arrivals'].map(b => (
//               <div key={b} style={s.bRow}><span style={s.bDot}>✦</span><span>{b}</span></div>
//             ))}
//           </div>

//           <div style={s.trust}>
//             <span style={{fontSize:'1.6rem'}}>🏺</span>
//             <div>
//               <div style={{color:'#fff',fontSize:'0.82rem',fontWeight:600,lineHeight:1.3}}>Trusted by 10,000+ customers</div>
//               <div style={{color:'#F9A825',fontSize:'0.7rem',marginTop:'0.2rem'}}>★★★★★ <span style={{color:'rgba(255,228,160,0.6)'}}>4.9/5 rating</span></div>
//             </div>
//           </div>
//         </div>
//         <div style={s.c1}/><div style={s.c2}/>
//       </div>

//       {/* RIGHT PANEL */}
//       <div style={s.right}>
//         <div style={s.card}>

//           {/* Step indicator */}
//           <div style={s.steps}>
//             {[{n:1,l:'Account'},{n:2,l:'Profile'}].map((st,i) => (
//               <React.Fragment key={st.n}>
//                 <div style={s.stepItem}>
//                   <div style={{...s.stepCircle, background: step>=st.n ? 'linear-gradient(135deg,#C9943D,#9f5e1a)' : '#e8d5bc', color: step>=st.n ? '#fff' : '#9a7b5a', boxShadow: step===st.n ? '0 4px 14px rgba(201,148,61,0.4)' : 'none'}}>
//                     {step > st.n ? '✓' : st.n}
//                   </div>
//                   <span style={{fontSize:'0.7rem',fontWeight:600,color: step>=st.n ? '#9f5e1a' : '#bda98a', marginTop:'0.3rem'}}>{st.l}</span>
//                 </div>
//                 {i === 0 && <div style={{flex:1,height:'2px',background: step>=2 ? '#C9943D' : '#e8d5bc',margin:'0 0.5rem',marginBottom:'1rem',transition:'background 0.3s'}}/>}
//               </React.Fragment>
//             ))}
//           </div>

//           <h2 style={s.title}>{step===1 ? 'Create Account' : 'Your Profile'}</h2>
//           <p style={s.sub}>{step===1 ? 'Step 1 of 2 — Account credentials' : 'Step 2 of 2 — Contact & address'}</p>

//           {error   && <div style={s.errBox}>⚠&nbsp; {error}</div>}
//           {success && <div style={s.sucBox}>✓&nbsp; {success}</div>}

//           {/* STEP 1 */}
//           {step === 1 && (
//             <form onSubmit={goStep2} style={s.form}>
//               {FIELDS_STEP1.map(f => (
//                 <div key={f.k} style={s.fGrp}>
//                   <label style={s.fLbl}>{f.l}{f.req && <span style={{color:'#C9943D'}}>*</span>}</label>
//                   <input className="rg-input" style={s.fInp} type={f.t} placeholder={f.p}
//                     value={form[f.k]} onChange={e => set(f.k, e.target.value)}
//                     autoComplete={f.k==='password'?'new-password':f.k==='confirm'?'new-password':'on'}/>
//                 </div>
//               ))}
//               {form.password && (
//                 <div style={{display:'flex',alignItems:'center',gap:'0.6rem',marginTop:'-0.5rem'}}>
//                   <div style={{flex:1,height:'4px',background:'#e8d5bc',borderRadius:'99px',overflow:'hidden'}}>
//                     <div style={{height:'100%',borderRadius:'99px',transition:'all 0.4s',width:['0%','33%','66%','100%'][pwStrength],background:pwColor}}/>
//                   </div>
//                   <span style={{fontSize:'0.7rem',fontWeight:700,color:pwColor,minWidth:'40px'}}>{pwLabel}</span>
//                 </div>
//               )}
//               <button type="submit" className="rg-btn" style={s.btn}>
//                 Continue → Profile
//               </button>
//             </form>
//           )}

//           {/* STEP 2 */}
//           {step === 2 && (
//             <form onSubmit={submit} style={s.form}>
//               <div style={s.fGrp}>
//                 <label style={s.fLbl}>Phone Number<span style={{color:'#C9943D'}}>*</span></label>
//                 <input className="rg-input" style={s.fInp} type="tel" placeholder="+91 XXXXX XXXXX"
//                   value={form.phone} onChange={e => set('phone', e.target.value)}/>
//               </div>
//               <div style={s.fGrp}>
//                 <label style={s.fLbl}>Address <span style={{color:'#bda98a',fontSize:'0.65rem',fontWeight:400,letterSpacing:0,textTransform:'none'}}>(optional)</span></label>
//                 <input className="rg-input" style={s.fInp} type="text" placeholder="Street, area, landmark"
//                   value={form.address} onChange={e => set('address', e.target.value)}/>
//               </div>
//               <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
//                 {[{k:'city',l:'City',p:'City name'},{k:'state',l:'State',p:'State'}].map(f => (
//                   <div key={f.k} style={s.fGrp}>
//                     <label style={s.fLbl}>{f.l}</label>
//                     <input className="rg-input" style={s.fInp} type="text" placeholder={f.p}
//                       value={form[f.k]} onChange={e => set(f.k, e.target.value)}/>
//                   </div>
//                 ))}
//               </div>
//               <div style={s.fGrp}>
//                 <label style={s.fLbl}>Pincode</label>
//                 <input className="rg-input" style={{...s.fInp,maxWidth:'180px'}} type="text" placeholder="PIN code"
//                   value={form.pincode} onChange={e => set('pincode', e.target.value)}/>
//               </div>

//               <div style={{display:'grid',gridTemplateColumns:'1fr 1.6fr',gap:'0.75rem',marginTop:'0.25rem'}}>
//                 <button type="button" style={s.backBtn} onClick={() => { setStep(1); setError(''); }}>← Back</button>
//                 <button type="submit" className="rg-btn" style={s.btn}>
//                   {loading ? <span style={s.spin}/> : 'Create Account ✓'}
//                 </button>
//               </div>
//             </form>
//           )}

//           <div style={s.divider}><span style={s.dLine}/><span style={s.dTxt}>Already have account?</span><span style={s.dLine}/></div>
//           <Link to="/LoginPage" className="rg-outline" style={s.outline}>Login In to Your Account</Link>
//           <p style={s.terms}>By registering you agree to our <span style={s.tl}>Terms</span> & <span style={s.tl}>Privacy Policy</span></p>
//         </div>
//       </div>
//     </div>
//   );
// }

// const css = `
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
//   @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
//   @keyframes spin   { to{transform:rotate(360deg)} }
//   @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
//   .rg-input:focus   { border-color:#C9943D!important; box-shadow:0 0 0 3px rgba(201,148,61,0.14)!important; outline:none; }
//   .rg-btn:hover     { transform:translateY(-2px)!important; box-shadow:0 10px 26px rgba(201,148,61,0.48)!important; }
//   .rg-outline:hover { background:rgba(201,148,61,0.05)!important; }
// `;

// const s = {
//   page:    { minHeight:'100vh', display:'flex', fontFamily:"'DM Sans',sans-serif" },
//   left:    { flex:'1.1', background:'linear-gradient(150deg,#0a0200,#1f0c03 25%,#4a2408 60%,#9f5e1a)', position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', padding:'3rem 2.5rem' },
//   lInner:  { position:'relative', zIndex:3, maxWidth:'380px', animation:'fadeUp 0.6s ease both' },
//   brand:   { display:'flex', alignItems:'center', gap:'0.8rem', marginBottom:'2.25rem' },
//   logoBox: { width:'48px', height:'48px', background:'linear-gradient(135deg,#C9943D,#7a4a0a)', borderRadius:'13px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 6px 22px rgba(201,148,61,0.4)', flexShrink:0 },
//   lName:   { fontFamily:"'Playfair Display',serif", color:'#fff', fontSize:'1.45rem', fontWeight:700, lineHeight:1 },
//   lSub:    { color:'rgba(255,228,160,0.48)', fontSize:'0.52rem', letterSpacing:'4px', marginTop:'3px' },
//   lTitle:  { fontFamily:"'Playfair Display',serif", color:'#fff', fontSize:'2.2rem', lineHeight:1.3, margin:'0 0 0.85rem', fontWeight:700 },
//   lDesc:   { color:'rgba(255,255,255,0.55)', fontSize:'0.85rem', lineHeight:1.8, margin:'0 0 1.75rem' },
//   benefits:{ display:'flex', flexDirection:'column', gap:'0.6rem', marginBottom:'1.75rem' },
//   bRow:    { display:'flex', alignItems:'center', gap:'0.65rem', color:'rgba(255,255,255,0.78)', fontSize:'0.83rem', fontWeight:500 },
//   bDot:    { color:'#C9943D', fontSize:'0.58rem', flexShrink:0 },
//   trust:   { display:'flex', alignItems:'center', gap:'0.8rem', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'11px', padding:'0.8rem 1rem' },
//   c1:      { position:'absolute', width:'320px', height:'320px', borderRadius:'50%', border:'1px solid rgba(201,148,61,0.1)', bottom:'-90px', right:'-80px', animation:'float 9s ease infinite', zIndex:1 },
//   c2:      { position:'absolute', width:'200px', height:'200px', borderRadius:'50%', border:'1px solid rgba(201,148,61,0.07)', top:'-50px', left:'-50px', animation:'float 7s ease infinite 1.5s', zIndex:1 },
//   right:   { flex:'1', display:'flex', alignItems:'center', justifyContent:'center', background:'#fdfaf5', padding:'2rem', overflowY:'auto' },
//   card:    { width:'100%', maxWidth:'440px', animation:'fadeUp 0.5s ease 0.08s both' },
//   steps:   { display:'flex', alignItems:'flex-start', marginBottom:'1.75rem' },
//   stepItem:{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.28rem' },
//   stepCircle:{ width:'30px', height:'30px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:700, transition:'all 0.3s' },
//   title:   { fontFamily:"'Playfair Display',serif", fontSize:'1.9rem', color:'#1a0800', margin:'0 0 0.3rem', fontWeight:700 },
//   sub:     { color:'#9a7b5a', fontSize:'0.83rem', margin:'0 0 1.4rem' },
//   errBox:  { background:'#fff0f0', border:'1px solid #fca5a5', color:'#b91c1c', padding:'0.7rem 1rem', borderRadius:'9px', fontSize:'0.82rem', marginBottom:'1.1rem', fontWeight:500 },
//   sucBox:  { background:'#f0fdf4', border:'1px solid #86efac', color:'#166534', padding:'0.7rem 1rem', borderRadius:'9px', fontSize:'0.82rem', marginBottom:'1.1rem', fontWeight:500 },
//   form:    { display:'flex', flexDirection:'column', gap:'1rem' },
//   fGrp:    { display:'flex', flexDirection:'column', gap:'0.4rem' },
//   fLbl:    { fontSize:'0.7rem', fontWeight:700, letterSpacing:'1.1px', textTransform:'uppercase', color:'#4a2e1a' },
//   fInp:    { padding:'0.82rem 1rem', border:'1.5px solid #e8d5bc', borderRadius:'9px', fontSize:'0.88rem', color:'#1a0800', background:'#fff', fontFamily:"'DM Sans',sans-serif", transition:'all 0.22s', width:'100%', boxSizing:'border-box' },
//   btn:     { padding:'0.9rem', cursor:'pointer', border:'none', background:'linear-gradient(135deg,#C9943D,#9f5e1a,#7a4a0a)', color:'#fff', borderRadius:'9px', fontSize:'0.9rem', fontWeight:700, fontFamily:"'DM Sans',sans-serif", boxShadow:'0 4px 16px rgba(201,148,61,0.38)', transition:'all 0.25s' },
//   backBtn: { padding:'0.9rem', cursor:'pointer', border:'1.5px solid #e8d5bc', background:'#fff', color:'#9a7b5a', borderRadius:'9px', fontSize:'0.85rem', fontWeight:600, fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s' },
//   spin:    { width:'17px', height:'17px', border:'2.5px solid rgba(255,255,255,0.3)', borderTop:'2.5px solid #fff', borderRadius:'50%', animation:'spin 0.7s linear infinite', display:'inline-block' },
//   divider: { display:'flex', alignItems:'center', gap:'0.7rem', margin:'1.4rem 0' },
//   dLine:   { flex:1, height:'1px', background:'#e8d5bc' },
//   dTxt:    { color:'#bda98a', fontSize:'0.73rem', whiteSpace:'nowrap' },
//   outline: { display:'block', textAlign:'center', padding:'0.85rem', border:'1.5px solid #C9943D', borderRadius:'9px', color:'#9f5e1a', textDecoration:'none', fontWeight:700, fontSize:'0.85rem', transition:'all 0.22s', fontFamily:"'DM Sans',sans-serif" },
//   terms:   { textAlign:'center', marginTop:'0.9rem', fontSize:'0.68rem', color:'#bda98a' },
//   tl:      { color:'#9f5e1a', cursor:'pointer', fontWeight:600 },
// };


//////////////////////////////////////////


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const FIELDS_STEP1 = [
  { k:'fullName', l:'Full Name',        t:'text',     p:'Your full name',    req:true },
  { k:'email',    l:'Email Address',    t:'email',    p:'your@email.com',    req:true },
  { k:'password', l:'Password',         t:'password', p:'Min. 6 characters', req:true },
  { k:'confirm',  l:'Confirm Password', t:'password', p:'Repeat password',   req:true },
];

// ✅ Only letters and spaces allowed in name
const isValidName = (name) => /^[a-zA-Z\s]+$/.test(name.trim());

// ✅ Basic email format check
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

// ✅ Only digits, optional leading +91
const isValidPhone = (phone) => /^(\+91[\s-]?)?[6-9]\d{9}$/.test(phone.trim());

// ✅ Only 6 digits
const isValidPincode = (pin) => /^\d{6}$/.test(pin.trim());

// ✅ Only letters and spaces for city/state
const isValidCityState = (val) => /^[a-zA-Z\s]+$/.test(val.trim());

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep]       = useState(1);
  const [form, setForm]       = useState({ fullName:'', email:'', password:'', confirm:'', phone:'', address:'', city:'', state:'', pincode:'' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // ✅ Prevent numbers in name field while typing
  const handleNameChange = (v) => {
    if (/^[a-zA-Z\s]*$/.test(v)) set('fullName', v);
  };

  // ✅ Prevent non-digits in phone field while typing
  const handlePhoneChange = (v) => {
    // Allow + only at start, then only digits
    if (/^[+]?\d*$/.test(v)) set('phone', v);
  };

  // ✅ Prevent non-digits in pincode while typing
  const handlePincodeChange = (v) => {
    if (/^\d*$/.test(v) && v.length <= 6) set('pincode', v);
  };

  // ✅ Prevent digits in city/state while typing
  const handleCityStateChange = (k, v) => {
    if (/^[a-zA-Z\s]*$/.test(v)) set(k, v);
  };

  const pwStrength = !form.password ? 0 : form.password.length >= 10 ? 3 : form.password.length >= 6 ? 2 : 1;
  const pwColor    = ['','#ef4444','#f59e0b','#22c55e'][pwStrength];
  const pwLabel    = ['','Weak','Good','Strong'][pwStrength];

  const goStep2 = (e) => {
    e.preventDefault(); setError('');
    if (!form.fullName.trim())          return setError('Full name is required!');
    if (!isValidName(form.fullName))    return setError('Full name can only contain letters and spaces!');
    if (!form.email.trim())             return setError('Email is required!');
    if (!isValidEmail(form.email))      return setError('Please enter a valid email address!');
    if (form.password.length < 6)       return setError('Password must be at least 6 characters!');
    if (form.password !== form.confirm) return setError('Passwords do not match!');
    setStep(2);
  };

  // ✅ Backend API call — bilkul same, koi change nahi
  const submit = async (e) => {
    e.preventDefault(); setError('');
    if (!form.phone.trim())           return setError('Phone number is required!');
    if (!isValidPhone(form.phone))    return setError('Enter a valid 10-digit Indian mobile number!');
    if (form.pincode && !isValidPincode(form.pincode)) return setError('Pincode must be exactly 6 digits!');
    if (form.city && !isValidCityState(form.city))     return setError('City name can only contain letters!');
    if (form.state && !isValidCityState(form.state))   return setError('State name can only contain letters!');

    setLoading(true);
    try {
      const res  = await fetch('http://localhost:5000/api/users/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email:    form.email,
          password: form.password,
          phone:    form.phone,
          address:  form.address,
          city:     form.city,
          state:    form.state,
          pincode:  form.pincode,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'Registration failed. Please try again.');
      } else {
        setSuccess('Account created! Redirecting to login...');
        setTimeout(() => navigate('/LoginPage'), 1600);
      }
    } catch {
      setError('Cannot connect to server. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* LEFT PANEL */}
      <div style={s.left}>
        <div style={s.lInner}>
          <div style={s.brand}>
            <div style={s.logoBox}>
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <path d="M16 4L8 8V16C8 22 16 28 16 28S24 22 24 16V8L16 4Z" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="rgba(255,255,255,0.15)"/>
                <path d="M12 16L14.5 18.5L20 13" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div style={s.lName}>Songir</div>
              <div style={s.lSub}>HANDCRAFTED</div>
            </div>
          </div>

          <h2 style={s.lTitle}>Join Our<br/>Artisan<br/>Community ✦</h2>
          <p style={s.lDesc}>Create your free account and explore 1,200+ authentic brass & copper crafts.</p>

          <div style={s.benefits}>
            {['Exclusive member discounts','Track all your orders','Save to wishlist','Early access to new arrivals'].map(b => (
              <div key={b} style={s.bRow}><span style={s.bDot}>✦</span><span>{b}</span></div>
            ))}
          </div>

          <div style={s.trust}>
            <span style={{fontSize:'1.6rem'}}>🏺</span>
            <div>
              <div style={{color:'#fff',fontSize:'0.82rem',fontWeight:600,lineHeight:1.3}}>Trusted by 10,000+ customers</div>
              <div style={{color:'#F9A825',fontSize:'0.7rem',marginTop:'0.2rem'}}>★★★★★ <span style={{color:'rgba(255,228,160,0.6)'}}>4.9/5 rating</span></div>
            </div>
          </div>
        </div>
        <div style={s.c1}/><div style={s.c2}/>
      </div>

      {/* RIGHT PANEL */}
      <div style={s.right}>
        <div style={s.card}>

          {/* Step indicator */}
          <div style={s.steps}>
            {[{n:1,l:'Account'},{n:2,l:'Profile'}].map((st,i) => (
              <React.Fragment key={st.n}>
                <div style={s.stepItem}>
                  <div style={{...s.stepCircle, background: step>=st.n ? 'linear-gradient(135deg,#C9943D,#9f5e1a)' : '#e8d5bc', color: step>=st.n ? '#fff' : '#9a7b5a', boxShadow: step===st.n ? '0 4px 14px rgba(201,148,61,0.4)' : 'none'}}>
                    {step > st.n ? '✓' : st.n}
                  </div>
                  <span style={{fontSize:'0.7rem',fontWeight:600,color: step>=st.n ? '#9f5e1a' : '#bda98a', marginTop:'0.3rem'}}>{st.l}</span>
                </div>
                {i === 0 && <div style={{flex:1,height:'2px',background: step>=2 ? '#C9943D' : '#e8d5bc',margin:'0 0.5rem',marginBottom:'1rem',transition:'background 0.3s'}}/>}
              </React.Fragment>
            ))}
          </div>

          <h2 style={s.title}>{step===1 ? 'Create Account' : 'Your Profile'}</h2>
          <p style={s.sub}>{step===1 ? 'Step 1 of 2 — Account credentials' : 'Step 2 of 2 — Contact & address'}</p>

          {error   && <div style={s.errBox}>⚠&nbsp; {error}</div>}
          {success && <div style={s.sucBox}>✓&nbsp; {success}</div>}

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={goStep2} style={s.form}>
              {FIELDS_STEP1.map(f => (
                <div key={f.k} style={s.fGrp}>
                  <label style={s.fLbl}>{f.l}{f.req && <span style={{color:'#C9943D'}}>*</span>}</label>
                  <input
                    className="rg-input"
                    style={s.fInp}
                    type={f.t}
                    placeholder={f.p}
                    value={form[f.k]}
                    onChange={e =>
                      f.k === 'fullName'
                        ? handleNameChange(e.target.value)
                        : set(f.k, e.target.value)
                    }
                    autoComplete={f.k==='password'?'new-password':f.k==='confirm'?'new-password':'on'}
                  />
                </div>
              ))}
              {form.password && (
                <div style={{display:'flex',alignItems:'center',gap:'0.6rem',marginTop:'-0.5rem'}}>
                  <div style={{flex:1,height:'4px',background:'#e8d5bc',borderRadius:'99px',overflow:'hidden'}}>
                    <div style={{height:'100%',borderRadius:'99px',transition:'all 0.4s',width:['0%','33%','66%','100%'][pwStrength],background:pwColor}}/>
                  </div>
                  <span style={{fontSize:'0.7rem',fontWeight:700,color:pwColor,minWidth:'40px'}}>{pwLabel}</span>
                </div>
              )}
              <button type="submit" className="rg-btn" style={s.btn}>
                Continue → Profile
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={submit} style={s.form}>
              <div style={s.fGrp}>
                <label style={s.fLbl}>Phone Number<span style={{color:'#C9943D'}}>*</span></label>
                <input
                  className="rg-input"
                  style={s.fInp}
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.phone}
                  onChange={e => handlePhoneChange(e.target.value)}
                  maxLength={13}
                />
              </div>
              <div style={s.fGrp}>
                <label style={s.fLbl}>Address <span style={{color:'#bda98a',fontSize:'0.65rem',fontWeight:400,letterSpacing:0,textTransform:'none'}}>(optional)</span></label>
                <input className="rg-input" style={s.fInp} type="text" placeholder="Street, area, landmark"
                  value={form.address} onChange={e => set('address', e.target.value)}/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
                {[{k:'city',l:'City',p:'City name'},{k:'state',l:'State',p:'State'}].map(f => (
                  <div key={f.k} style={s.fGrp}>
                    <label style={s.fLbl}>{f.l}</label>
                    <input
                      className="rg-input"
                      style={s.fInp}
                      type="text"
                      placeholder={f.p}
                      value={form[f.k]}
                      onChange={e => handleCityStateChange(f.k, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <div style={s.fGrp}>
                <label style={s.fLbl}>Pincode</label>
                <input
                  className="rg-input"
                  style={{...s.fInp,maxWidth:'180px'}}
                  type="text"
                  placeholder="PIN code"
                  value={form.pincode}
                  onChange={e => handlePincodeChange(e.target.value)}
                  maxLength={6}
                  inputMode="numeric"
                />
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1.6fr',gap:'0.75rem',marginTop:'0.25rem'}}>
                <button type="button" style={s.backBtn} onClick={() => { setStep(1); setError(''); }}>← Back</button>
                <button type="submit" className="rg-btn" style={s.btn}>
                  {loading ? <span style={s.spin}/> : 'Create Account ✓'}
                </button>
              </div>
            </form>
          )}

          <div style={s.divider}><span style={s.dLine}/><span style={s.dTxt}>Already have account?</span><span style={s.dLine}/></div>
          <Link to="/LoginPage" className="rg-outline" style={s.outline}>Login In to Your Account</Link>
          <p style={s.terms}>By registering you agree to our <span style={s.tl}>Terms</span> & <span style={s.tl}>Privacy Policy</span></p>
        </div>
      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin   { to{transform:rotate(360deg)} }
  @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  .rg-input:focus   { border-color:#C9943D!important; box-shadow:0 0 0 3px rgba(201,148,61,0.14)!important; outline:none; }
  .rg-btn:hover     { transform:translateY(-2px)!important; box-shadow:0 10px 26px rgba(201,148,61,0.48)!important; }
  .rg-outline:hover { background:rgba(201,148,61,0.05)!important; }
`;

const s = {
  page:    { minHeight:'100vh', display:'flex', fontFamily:"'DM Sans',sans-serif" },
  left:    { flex:'1.1', background:'linear-gradient(150deg,#0a0200,#1f0c03 25%,#4a2408 60%,#9f5e1a)', position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', padding:'3rem 2.5rem' },
  lInner:  { position:'relative', zIndex:3, maxWidth:'380px', animation:'fadeUp 0.6s ease both' },
  brand:   { display:'flex', alignItems:'center', gap:'0.8rem', marginBottom:'2.25rem' },
  logoBox: { width:'48px', height:'48px', background:'linear-gradient(135deg,#C9943D,#7a4a0a)', borderRadius:'13px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 6px 22px rgba(201,148,61,0.4)', flexShrink:0 },
  lName:   { fontFamily:"'Playfair Display',serif", color:'#fff', fontSize:'1.45rem', fontWeight:700, lineHeight:1 },
  lSub:    { color:'rgba(255,228,160,0.48)', fontSize:'0.52rem', letterSpacing:'4px', marginTop:'3px' },
  lTitle:  { fontFamily:"'Playfair Display',serif", color:'#fff', fontSize:'2.2rem', lineHeight:1.3, margin:'0 0 0.85rem', fontWeight:700 },
  lDesc:   { color:'rgba(255,255,255,0.55)', fontSize:'0.85rem', lineHeight:1.8, margin:'0 0 1.75rem' },
  benefits:{ display:'flex', flexDirection:'column', gap:'0.6rem', marginBottom:'1.75rem' },
  bRow:    { display:'flex', alignItems:'center', gap:'0.65rem', color:'rgba(255,255,255,0.78)', fontSize:'0.83rem', fontWeight:500 },
  bDot:    { color:'#C9943D', fontSize:'0.58rem', flexShrink:0 },
  trust:   { display:'flex', alignItems:'center', gap:'0.8rem', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'11px', padding:'0.8rem 1rem' },
  c1:      { position:'absolute', width:'320px', height:'320px', borderRadius:'50%', border:'1px solid rgba(201,148,61,0.1)', bottom:'-90px', right:'-80px', animation:'float 9s ease infinite', zIndex:1 },
  c2:      { position:'absolute', width:'200px', height:'200px', borderRadius:'50%', border:'1px solid rgba(201,148,61,0.07)', top:'-50px', left:'-50px', animation:'float 7s ease infinite 1.5s', zIndex:1 },
  right:   { flex:'1', display:'flex', alignItems:'center', justifyContent:'center', background:'#fdfaf5', padding:'2rem', overflowY:'auto' },
  card:    { width:'100%', maxWidth:'440px', animation:'fadeUp 0.5s ease 0.08s both' },
  steps:   { display:'flex', alignItems:'flex-start', marginBottom:'1.75rem' },
  stepItem:{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.28rem' },
  stepCircle:{ width:'30px', height:'30px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:700, transition:'all 0.3s' },
  title:   { fontFamily:"'Playfair Display',serif", fontSize:'1.9rem', color:'#1a0800', margin:'0 0 0.3rem', fontWeight:700 },
  sub:     { color:'#9a7b5a', fontSize:'0.83rem', margin:'0 0 1.4rem' },
  errBox:  { background:'#fff0f0', border:'1px solid #fca5a5', color:'#b91c1c', padding:'0.7rem 1rem', borderRadius:'9px', fontSize:'0.82rem', marginBottom:'1.1rem', fontWeight:500 },
  sucBox:  { background:'#f0fdf4', border:'1px solid #86efac', color:'#166534', padding:'0.7rem 1rem', borderRadius:'9px', fontSize:'0.82rem', marginBottom:'1.1rem', fontWeight:500 },
  form:    { display:'flex', flexDirection:'column', gap:'1rem' },
  fGrp:    { display:'flex', flexDirection:'column', gap:'0.4rem' },
  fLbl:    { fontSize:'0.7rem', fontWeight:700, letterSpacing:'1.1px', textTransform:'uppercase', color:'#4a2e1a' },
  fInp:    { padding:'0.82rem 1rem', border:'1.5px solid #e8d5bc', borderRadius:'9px', fontSize:'0.88rem', color:'#1a0800', background:'#fff', fontFamily:"'DM Sans',sans-serif", transition:'all 0.22s', width:'100%', boxSizing:'border-box' },
  btn:     { padding:'0.9rem', cursor:'pointer', border:'none', background:'linear-gradient(135deg,#C9943D,#9f5e1a,#7a4a0a)', color:'#fff', borderRadius:'9px', fontSize:'0.9rem', fontWeight:700, fontFamily:"'DM Sans',sans-serif", boxShadow:'0 4px 16px rgba(201,148,61,0.38)', transition:'all 0.25s' },
  backBtn: { padding:'0.9rem', cursor:'pointer', border:'1.5px solid #e8d5bc', background:'#fff', color:'#9a7b5a', borderRadius:'9px', fontSize:'0.85rem', fontWeight:600, fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s' },
  spin:    { width:'17px', height:'17px', border:'2.5px solid rgba(255,255,255,0.3)', borderTop:'2.5px solid #fff', borderRadius:'50%', animation:'spin 0.7s linear infinite', display:'inline-block' },
  divider: { display:'flex', alignItems:'center', gap:'0.7rem', margin:'1.4rem 0' },
  dLine:   { flex:1, height:'1px', background:'#e8d5bc' },
  dTxt:    { color:'#bda98a', fontSize:'0.73rem', whiteSpace:'nowrap' },
  outline: { display:'block', textAlign:'center', padding:'0.85rem', border:'1.5px solid #C9943D', borderRadius:'9px', color:'#9f5e1a', textDecoration:'none', fontWeight:700, fontSize:'0.85rem', transition:'all 0.22s', fontFamily:"'DM Sans',sans-serif" },
  terms:   { textAlign:'center', marginTop:'0.9rem', fontSize:'0.68rem', color:'#bda98a' },
  tl:      { color:'#9f5e1a', cursor:'pointer', fontWeight:600 },
};