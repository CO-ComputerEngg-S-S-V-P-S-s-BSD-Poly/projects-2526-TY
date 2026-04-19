import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ShopkeeperLogin.css";

const ShopkeeperLogin = () => {
  const [form, setForm]         = useState({ email: "", password: "" });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const emailKey = form.email.trim().toLowerCase();

    // 1. Try real backend
    try {
      const res = await fetch("http://localhost:5000/api/auth/shopkeeper/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem("shopkeeperToken", data.token);
        sessionStorage.setItem("shopkeeperData", JSON.stringify(data.shopkeeper));

        // ✅ FIX: shopId localStorage mein save karo
        const shopId = data.shopkeeper?.shopId
          || data.shopkeeper?._id
          || data.shop?._id
          || data.shopId;
        if (shopId) localStorage.setItem("shopId", shopId);

        navigate("/shopkeeper/dashboard");
        return;
      }
    } catch (_) {}

    // 2. DEMO MODE — localStorage se registered check karo
    let list = [];
    try {
      const stored = localStorage.getItem("demoRegistered");
      list = stored ? JSON.parse(stored) : [];
    } catch (_) {}

    if (!Array.isArray(list) || !list.includes(emailKey)) {
      setError("No account found. Please register first before logging in.");
      setLoading(false);
      return;
    }

    // 3. Password check
    const savedPwd = localStorage.getItem(`demoPwd_${emailKey}`);
    if (!savedPwd) {
      setError("Account data missing. Please register again.");
      setLoading(false);
      return;
    }
    if (savedPwd !== form.password) {
      setError("Incorrect password. Please try again.");
      setLoading(false);
      return;
    }

    // 4. Shop data load karo
    const skData = localStorage.getItem(`demoSK_${emailKey}`);
    if (!skData) {
      setError("Account data missing. Please register again.");
      setLoading(false);
      return;
    }

    // ✅ FIX: Demo mode mein bhi shopId save karo
    try {
      const parsed = JSON.parse(skData);
      const shopId = parsed?.shopId || parsed?._id;
      if (shopId) localStorage.setItem("shopId", shopId);
    } catch (_) {}

    sessionStorage.setItem("shopkeeperToken", "demo-token-" + Date.now());
    sessionStorage.setItem("shopkeeperData", skData);

    navigate("/shopkeeper/dashboard");
  };

  return (
    <div className="sk-login-page">
      <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
      <div className="sk-login-wrapper">

        <div className="sk-left-panel">
          <div className="sk-brand">
            <div className="sk-brand-icon">🏺</div>
            <h1 className="sk-brand-name">Songir Brass</h1>
            <p className="sk-brand-tagline">Shopkeeper Portal</p>
          </div>
          <div className="sk-left-content">
            <h2 className="sk-left-heading">Manage Your<br /><span>Brass & Copper</span><br />Shop</h2>
            <p className="sk-left-sub">Add products, track views, and grow your shop — all from one place.</p>
            <div className="sk-features">
              {[
                { icon: "📦", text: "Add & manage products easily"      },
                { icon: "📊", text: "Track shop views & enquiries"       },
                { icon: "🌐", text: "Products live on website instantly" },
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

        <div className="sk-right-panel">
          <div className="sk-card">
            <div className="sk-card-top-bar" />
            <div className="sk-card-header">
              <div className="sk-lock-icon">🔐</div>
              <h2 className="sk-card-title">Shopkeeper Login</h2>
              <p className="sk-card-sub">Enter your registered email & password</p>
            </div>

            <form className="sk-form" onSubmit={handleSubmit}>
              {error && <div className="sk-error-box">⚠️ {error}</div>}

              <div className="sk-field">
                <label className="sk-label">Email Address</label>
                <div className="sk-input-wrap">
                  <span className="sk-input-icon">✉️</span>
                  <input className="sk-input" type="email" name="email"
                    placeholder="yourshop@email.com" value={form.email}
                    onChange={handleChange} required />
                </div>
              </div>

              <div className="sk-field">
                <label className="sk-label">Password</label>
                <div className="sk-input-wrap">
                  <span className="sk-input-icon">🔑</span>
                  <input className="sk-input" type={showPass ? "text" : "password"} name="password"
                    placeholder="Enter your password" value={form.password}
                    onChange={handleChange} required />
                  <span className="sk-eye" onClick={() => setShowPass(!showPass)}>
                    {showPass ? "🙈" : "👁️"}
                  </span>
                </div>
              </div>

              <div className="sk-forgot">
                <a href="/shopkeeper/forgot-password">Forgot password?</a>
              </div>

              <button className="sk-submit-btn" type="submit" disabled={loading}>
                {loading
                  ? <span className="sk-loading"><span className="sk-spinner" /> Logging in...</span>
                  : "Login to Dashboard →"
                }
              </button>
            </form>

            <div className="sk-divider"><span>New shopkeeper?</span></div>
            <button className="sk-register-btn" onClick={() => navigate("/shopkeeper/register")}>
              Register Your Shop
            </button>
            <div className="sk-back-link" onClick={() => navigate("/")}>← Back to main website</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ShopkeeperLogin;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./ShopkeeperLogin.css";

// const ShopkeeperLogin = () => {
//   const [form, setForm]         = useState({ email: "", password: "" });
//   const [loading, setLoading]   = useState(false);
//   const [error, setError]       = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     const emailKey = form.email.trim().toLowerCase();

//     // 1. Try real backend
//     try {
//       const res = await fetch("http://localhost:5000/api/auth/shopkeeper/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });
//       if (res.ok) {
//         const data = await res.json();
//         sessionStorage.setItem("shopkeeperToken", data.token);
//         sessionStorage.setItem("shopkeeperData", JSON.stringify(data.shopkeeper));

//         // ✅ shopId set karo — backend se aaye to wahi, warna shopkeeper._id
//         const shopId = data.shopId || data.shopkeeper?.shopId || data.shopkeeper?._id || "";
//         if (shopId) localStorage.setItem("shopId", shopId);

//         navigate("/shopkeeper/dashboard");
//         return;
//       }
//     } catch (_) {}

//     // 2. DEMO MODE — localStorage se registered check karo
//     let list = [];
//     try {
//       const stored = localStorage.getItem("demoRegistered");
//       list = stored ? JSON.parse(stored) : [];
//     } catch (_) {}

//     if (!Array.isArray(list) || !list.includes(emailKey)) {
//       setError("No account found. Please register first before logging in.");
//       setLoading(false);
//       return;
//     }

//     // 3. Password check
//     const savedPwd = localStorage.getItem(`demoPwd_${emailKey}`);
//     if (!savedPwd) {
//       setError("Account data missing. Please register again.");
//       setLoading(false);
//       return;
//     }
//     if (savedPwd !== form.password) {
//       setError("Incorrect password. Please try again.");
//       setLoading(false);
//       return;
//     }

//     // 4. Shop data load karo
//     const skData = localStorage.getItem(`demoSK_${emailKey}`);
//     if (!skData) {
//       setError("Account data missing. Please register again.");
//       setLoading(false);
//       return;
//     }

//     // ✅ shopId set karo demo mode mein bhi
//     try {
//       const parsed = JSON.parse(skData);
//       const shopId = parsed.shopId || parsed._id || "";
//       if (shopId) localStorage.setItem("shopId", shopId);
//     } catch (_) {}

//     sessionStorage.setItem("shopkeeperToken", "demo-token-" + Date.now());
//     sessionStorage.setItem("shopkeeperData", skData);

//     navigate("/shopkeeper/dashboard");
//     setLoading(false);
//   };

//   return (
//     <div className="sk-login-page">
//       <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
//       <div className="sk-login-wrapper">

//         <div className="sk-left-panel">
//           <div className="sk-brand">
//             <div className="sk-brand-icon">🏺</div>
//             <h1 className="sk-brand-name">Songir Brass</h1>
//             <p className="sk-brand-tagline">Shopkeeper Portal</p>
//           </div>
//           <div className="sk-left-content">
//             <h2 className="sk-left-heading">Manage Your<br /><span>Brass & Copper</span><br />Shop</h2>
//             <p className="sk-left-sub">Add products, track views, and grow your shop — all from one place.</p>
//             <div className="sk-features">
//               {[
//                 { icon: "📦", text: "Add & manage products easily"      },
//                 { icon: "📊", text: "Track shop views & enquiries"       },
//                 { icon: "🌐", text: "Products live on website instantly" },
//               ].map((f, i) => (
//                 <div className="sk-feature-item" key={i}>
//                   <div className="sk-feature-icon">{f.icon}</div>
//                   <span>{f.text}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="sk-left-footer"><div className="sk-decoration">🏺 🪔 ⚱️ 🔔</div></div>
//         </div>

//         <div className="sk-right-panel">
//           <div className="sk-card">
//             <div className="sk-card-top-bar" />
//             <div className="sk-card-header">
//               <div className="sk-lock-icon">🔐</div>
//               <h2 className="sk-card-title">Shopkeeper Login</h2>
//               <p className="sk-card-sub">Enter your registered email & password</p>
//             </div>

//             <form className="sk-form" onSubmit={handleSubmit}>
//               {error && <div className="sk-error-box">⚠️ {error}</div>}

//               <div className="sk-field">
//                 <label className="sk-label">Email Address</label>
//                 <div className="sk-input-wrap">
//                   <span className="sk-input-icon">✉️</span>
//                   <input className="sk-input" type="email" name="email"
//                     placeholder="yourshop@email.com" value={form.email}
//                     onChange={handleChange} required />
//                 </div>
//               </div>

//               <div className="sk-field">
//                 <label className="sk-label">Password</label>
//                 <div className="sk-input-wrap">
//                   <span className="sk-input-icon">🔑</span>
//                   <input className="sk-input" type={showPass ? "text" : "password"} name="password"
//                     placeholder="Enter your password" value={form.password}
//                     onChange={handleChange} required />
//                   <span className="sk-eye" onClick={() => setShowPass(!showPass)}>
//                     {showPass ? "🙈" : "👁️"}
//                   </span>
//                 </div>
//               </div>

//               <div className="sk-forgot">
//                 <a href="/shopkeeper/forgot-password">Forgot password?</a>
//               </div>

//               <button className="sk-submit-btn" type="submit" disabled={loading}>
//                 {loading
//                   ? <span className="sk-loading"><span className="sk-spinner" /> Logging in...</span>
//                   : "Login to Dashboard →"
//                 }
//               </button>
//             </form>

//             <div className="sk-divider"><span>New shopkeeper?</span></div>
//             <button className="sk-register-btn" onClick={() => navigate("/shopkeeper/register")}>
//               Register Your Shop
//             </button>
//             <div className="sk-back-link" onClick={() => navigate("/")}>← Back to main website</div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ShopkeeperLogin;