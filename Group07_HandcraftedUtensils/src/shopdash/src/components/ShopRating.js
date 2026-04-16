// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import ShopkeeperSidebar from "./ShopkeeperSidebar";

// const API = "http://localhost:5000/api";

// // Helper: convert backend file path → full URL
// const imgUrl = (p) => {
//   if (!p) return null;
//   if (p.startsWith("http")) return p;
//   return `http://localhost:5000/${p.replace(/\\/g, "/")}`;
// };

// const css = `
// @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Lato:wght@400;600;700&display=swap');
// .sr-page{display:flex;min-height:100vh;background:#FAF6F0;font-family:'Lato',sans-serif;}
// .sr-main{margin-left:240px;flex:1;display:flex;flex-direction:column;}
// .sr-topbar{background:#fff;border-bottom:1px solid #EEE5D6;padding:14px 28px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;box-shadow:0 1px 6px rgba(184,115,51,0.05);}
// .sr-topbar-title{font-family:'Playfair Display',serif;font-size:20px;color:#3E2723;font-weight:700;}
// .sr-topbar-sub{color:#9E8272;font-size:13px;margin-top:2px;}
// .sr-back-btn{background:#fff;border:1px solid #E0D0BC;border-radius:9px;padding:8px 16px;color:#B87333;font-weight:700;font-size:13px;cursor:pointer;font-family:'Lato',sans-serif;transition:all 0.2s;}
// .sr-back-btn:hover{background:#FFF6E5;}
// .sr-body{display:flex;flex:1;}
// .sr-left{width:260px;flex-shrink:0;background:linear-gradient(160deg,#FFF8F0 0%,#FFF0DC 100%);border-right:1px solid #EED9BE;padding:28px 22px;display:flex;flex-direction:column;gap:18px;}
// .sr-avatar-wrap{display:flex;flex-direction:column;align-items:center;gap:10px;}
// .sr-avatar{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#B87333,#C9A44C);display:flex;align-items:center;justify-content:center;font-size:32px;border:3px solid rgba(184,115,51,0.25);box-shadow:0 4px 16px rgba(184,115,51,0.2);}
// .sr-left-name{font-family:'Playfair Display',serif;color:#3E2723;font-size:15px;font-weight:700;text-align:center;}
// .sr-left-sub{color:#9E8272;font-size:12px;text-align:center;}
// .sr-rating-big{background:#fff;border:1px solid #EED9BE;border-radius:14px;padding:18px 13px;text-align:center;box-shadow:0 1px 4px rgba(184,115,51,0.06);}
// .sr-rating-num{font-family:'Playfair Display',serif;font-size:44px;font-weight:800;color:#B87333;line-height:1;}
// .sr-stars-big{display:flex;justify-content:center;gap:3px;margin:6px 0 4px;font-size:17px;}
// .sr-rating-count{font-size:11px;color:#9E8272;font-weight:600;}
// .sr-divider{height:1px;background:#EED9BE;}
// .sr-breakdown-title{color:#B87333;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px;}
// .sr-breakdown{display:flex;flex-direction:column;gap:7px;}
// .sr-brow{display:flex;align-items:center;gap:8px;font-size:12px;}
// .sr-bstar{color:#B87333;font-weight:700;min-width:14px;}
// .sr-bbar{flex:1;height:6px;background:#F0E6D8;border-radius:3px;overflow:hidden;}
// .sr-bfill{height:100%;border-radius:3px;background:linear-gradient(90deg,#B87333,#C9A44C);transition:width 0.4s;}
// .sr-bcount{color:#9E8272;font-size:11px;min-width:14px;text-align:right;}
// .sr-stat-cards{display:flex;flex-direction:column;gap:8px;}
// .sr-stat-card{background:#fff;border:1px solid #EED9BE;border-radius:11px;padding:11px 13px;box-shadow:0 1px 4px rgba(184,115,51,0.06);}
// .sr-stat-label{color:#B87333;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px;}
// .sr-stat-val{font-family:'Playfair Display',serif;color:#3E2723;font-size:24px;font-weight:800;}
// .sr-stat-desc{color:#9E8272;font-size:11px;margin-top:1px;}
// .sr-left-deco{margin-top:auto;text-align:center;font-size:22px;letter-spacing:6px;opacity:0.2;}
// .sr-right{flex:1;padding:26px 30px;overflow-y:auto;}
// .sr-section{background:#fff;border-radius:16px;padding:22px 26px;box-shadow:0 2px 10px rgba(184,115,51,0.06);border:1px solid #EEE5D6;}
// .sr-section-head{display:flex;align-items:center;justify-content:space-between;padding-bottom:13px;margin-bottom:16px;border-bottom:1px solid #F0E6D8;}
// .sr-section-title{font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:#3E2723;}
// .sr-count-badge{background:rgba(184,115,51,0.1);color:#B87333;border-radius:20px;padding:3px 12px;font-size:12px;font-weight:700;}
// .sr-filter-tabs{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;}
// .sr-filter-tab{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;border:1.5px solid rgba(184,115,51,0.22);background:#fff;color:#9E8272;transition:all 0.2s;font-family:'Lato',sans-serif;}
// .sr-filter-tab:hover,.sr-filter-tab.active{background:linear-gradient(135deg,#B87333,#C9A44C);border-color:#B87333;color:#fff;}
// .sr-list{display:flex;flex-direction:column;gap:12px;}
// .sr-review-card{background:#FDFAF6;border:1px solid #EED9BE;border-radius:13px;padding:16px 18px;transition:box-shadow 0.2s;}
// .sr-review-card:hover{box-shadow:0 4px 18px rgba(184,115,51,0.11);}
// .sr-review-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:8px;}
// .sr-reviewer{display:flex;align-items:center;gap:12px;}
// .sr-initials{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#B87333,#C9A44C);display:flex;align-items:center;justify-content:center;font-size:14px;color:#fff;font-weight:800;flex-shrink:0;box-shadow:0 2px 8px rgba(184,115,51,0.25);}
// .sr-rev-name{font-size:14px;font-weight:700;color:#3E2723;}
// .sr-rev-stars{display:flex;gap:2px;margin-top:3px;font-size:12px;}
// .sr-top-right{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
// .sr-product-tag{font-size:11px;color:#B87333;font-weight:700;background:rgba(184,115,51,0.08);padding:3px 10px;border-radius:20px;white-space:nowrap;border:1px solid rgba(184,115,51,0.2);flex-shrink:0;}
// .sr-review-text{font-size:13px;color:#6D4C41;line-height:1.65;background:#fff;border-left:3px solid rgba(184,115,51,0.35);padding:9px 13px;border-radius:0 8px 8px 0;margin-bottom:10px;font-style:italic;}
// .sr-review-date{font-size:11px;color:#C4AE98;font-weight:600;}
// .sr-delete-btn{display:flex;align-items:center;gap:4px;background:#fff0f0;color:#e53935;border:1px solid #ffcdd2;border-radius:8px;padding:4px 10px;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.2s;font-family:'Lato',sans-serif;}
// .sr-delete-btn:hover{background:#ffebee;}
// .sr-delete-btn:disabled{opacity:0.5;cursor:not-allowed;}
// .sr-review-footer{display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px solid rgba(238,217,190,0.5);margin-top:4px;}
// .sr-helpful{font-size:11px;color:#C4AE98;}
// .sr-images-row{display:flex;gap:12px;flex-wrap:wrap;margin:10px 0;}
// .sr-img-box{display:flex;flex-direction:column;align-items:center;gap:4px;}
// .sr-review-img{width:88px;height:88px;object-fit:cover;border-radius:10px;border:1.5px solid #EED9BE;}
// .sr-img-label{font-size:10px;color:#B87333;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;}
// @keyframes spin{to{transform:rotate(360deg)}}
// .sr-spinner{width:36px;height:36px;border-radius:50%;border:3px solid #EDE5D8;border-top-color:#B87333;animation:spin 0.85s linear infinite;margin:0 auto;}
// `;

// const ShopRating = () => {
//   const navigate = useNavigate();

//   const [reviews,   setReviews]   = useState([]);
//   const [avg,       setAvg]       = useState(0);
//   const [total,     setTotal]     = useState(0);
//   const [breakdown, setBreakdown] = useState([]);
//   const [loading,   setLoading]   = useState(true);
//   const [deleting,  setDeleting]  = useState(null);
//   const [filter,    setFilter]    = useState(0);

//   // ── Get shopId + shopName from localStorage ──
//   // FIX: "shopId" key directly localStorage me stored hai (e.g. demo_1772633014304)
//   // Usse match karke correct demoSK_ entry se shopName nikalo
//   const shopInfo = (() => {
//     try {
//       // Step 1: Direct "shopId" key lo — ye logged in shopkeeper ka sahi ID hai
//       const directId = localStorage.getItem("shopId");

//       // Step 2: Sab demoSK_ keys me se match karo — sahi shopName nikalo
//       const skKeys = Object.keys(localStorage).filter(k => k.startsWith("demoSK_"));
//       for (const key of skKeys) {
//         const s = JSON.parse(localStorage.getItem(key) || "{}");
//         if (directId && (s._id === directId || s.shopId === directId)) {
//           return { id: directId, name: s.shopName || "" };
//         }
//       }

//       // Step 3: ID hai but match nahi mila — sirf id bhejo, backend shopName se dhundega
//       if (directId) {
//         return { id: directId, name: "" };
//       }

//       return { id: "", name: "" };
//     } catch { return { id: "", name: "" }; }
//   })();

//   const shopId   = shopInfo.id;
//   const shopName = shopInfo.name;

//   const fetchReviews = async () => {
//     if (!shopId && !shopName) { setLoading(false); return; }
//     try {
//       setLoading(true);
//       // shopName bhi query me bhejo — demo_ ID ke liye backend shopName se dhundta hai
//       const url = `${API}/reviews/shop/${encodeURIComponent(shopId)}?shopName=${encodeURIComponent(shopName)}`;
//       const res  = await fetch(url);
//       const json = await res.json();
//       setReviews(json.reviews    || []);
//       setAvg(json.avg            || 0);
//       setTotal(json.total        || 0);
//       setBreakdown(json.breakdown|| []);
//     } catch(e) { console.error("fetchReviews error:", e); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { fetchReviews(); }, [shopId, shopName]);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this review permanently?")) return;
//     setDeleting(id);
//     try {
//       await fetch(`${API}/reviews/${id}`, { method: "DELETE" });
//       fetchReviews();
//     } finally { setDeleting(null); }
//   };

//   const filtered = filter === 0 ? reviews : reviews.filter(r => r.rating === filter);
//   const happy    = reviews.filter(r => r.rating >= 4).length;

//   const Stars = ({ n, size = 12 }) => (
//     <div style={{ display:"flex", gap:2, fontSize:size }}>
//       {[1,2,3,4,5].map(i => <span key={i}>{i <= n ? "⭐" : "☆"}</span>)}
//     </div>
//   );

//   return (
//     <div className="sr-page">
//       <style>{css}</style>
//       <ShopkeeperSidebar active="shop-rating" />

//       <div className="sr-main">
//         {/* Topbar */}
//         <div className="sr-topbar">
//           <div>
//             <h1 className="sr-topbar-title">Shop Rating</h1>
//             <p className="sr-topbar-sub">Customer reviews and ratings for your shop</p>
//           </div>
//           <button className="sr-back-btn" onClick={() => navigate("/shopkeeper/dashboard")}>
//             ← Dashboard
//           </button>
//         </div>

//         <div className="sr-body">
//           {/* ── LEFT PANEL ── */}
//           <div className="sr-left">
//             <div className="sr-avatar-wrap">
//               <div className="sr-avatar">⭐</div>
//               <div className="sr-left-name">Shop Rating</div>
//               <div className="sr-left-sub">Customer feedback</div>
//             </div>

//             {/* Big rating number */}
//             <div className="sr-rating-big">
//               <div className="sr-rating-num">{loading ? "—" : (avg || "0")}</div>
//               <div className="sr-stars-big">
//                 {[1,2,3,4,5].map(i => (
//                   <span key={i}>{i <= Math.round(avg) ? "⭐" : "☆"}</span>
//                 ))}
//               </div>
//               <div className="sr-rating-count">out of 5 · {total} reviews</div>
//             </div>

//             <div className="sr-divider" />

//             {/* Star breakdown */}
//             <div>
//               <div className="sr-breakdown-title">⭐ Rating Breakdown</div>
//               <div className="sr-breakdown">
//                 {breakdown.map(b => (
//                   <div className="sr-brow" key={b.star}>
//                     <span className="sr-bstar">{b.star}</span>
//                     <div className="sr-bbar">
//                       <div className="sr-bfill"
//                         style={{ width: total ? `${(b.count / total) * 100}%` : "0%" }} />
//                     </div>
//                     <span className="sr-bcount">{b.count}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="sr-divider" />

//             {/* Stats */}
//             <div className="sr-stat-cards">
//               <div className="sr-stat-card">
//                 <div className="sr-stat-label">🏆 Happy Customers</div>
//                 <div className="sr-stat-val">{happy}</div>
//                 <div className="sr-stat-desc">4+ star reviews</div>
//               </div>
//               <div className="sr-stat-card">
//                 <div className="sr-stat-label">📝 Total Reviews</div>
//                 <div className="sr-stat-val">{total}</div>
//                 <div className="sr-stat-desc">all time</div>
//               </div>
//             </div>

//             <div className="sr-left-deco">🏺 🪔 ⚱️ 🔔</div>
//           </div>

//           {/* ── RIGHT — reviews list ── */}
//           <div className="sr-right">
//             {loading ? (
//               <div style={{ textAlign:"center", padding:60 }}>
//                 <div className="sr-spinner" />
//                 <p style={{ color:"#B87333", marginTop:14, fontSize:14 }}>Loading reviews...</p>
//               </div>
//             ) : (!shopId && !shopName) ? (
//               <div style={{ textAlign:"center", padding:60, color:"#c00", fontSize:14 }}>
//                 Shop ID not found. Please log in again.
//               </div>
//             ) : (
//               <div className="sr-section">
//                 <div className="sr-section-head">
//                   <div className="sr-section-title">💬 Customer Reviews</div>
//                   <span className="sr-count-badge">{filtered.length} reviews</span>
//                 </div>

//                 {/* Star filter tabs */}
//                 <div className="sr-filter-tabs">
//                   <button
//                     className={`sr-filter-tab ${filter === 0 ? "active" : ""}`}
//                     onClick={() => setFilter(0)}
//                   >
//                     All Reviews
//                   </button>
//                   {[5,4,3,2,1].map(n => (
//                     <button
//                       key={n}
//                       className={`sr-filter-tab ${filter === n ? "active" : ""}`}
//                       onClick={() => setFilter(n)}
//                     >
//                       {"⭐".repeat(n)} ({reviews.filter(r => r.rating === n).length})
//                     </button>
//                   ))}
//                 </div>

//                 {filtered.length === 0 ? (
//                   <div style={{ textAlign:"center", padding:"2rem", color:"#9E8272" }}>
//                     {total === 0 ? "No reviews yet for your shop." : "No reviews for this filter."}
//                   </div>
//                 ) : (
//                   <div className="sr-list">
//                     {filtered.map(r => {
//                       const initials = r.customerName
//                         ?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";
//                       const date = new Date(r.createdAt).toLocaleDateString("en-IN", {
//                         day:"2-digit", month:"short", year:"numeric",
//                       });
//                       const custImg = imgUrl(r.customerImage);
//                       const revImg  = imgUrl(r.reviewImage);

//                       return (
//                         <div className="sr-review-card" key={r._id}>
//                           {/* Top row */}
//                           <div className="sr-review-top">
//                             <div className="sr-reviewer">
//                               <div className="sr-initials">{initials}</div>
//                               <div>
//                                 <div className="sr-rev-name">{r.customerName}</div>
//                                 <div className="sr-rev-stars">
//                                   <Stars n={r.rating} />
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="sr-top-right">
//                               <span className="sr-product-tag">🏺 {r.productName}</span>
//                               <button
//                                 className="sr-delete-btn"
//                                 onClick={() => handleDelete(r._id)}
//                                 disabled={deleting === r._id}
//                               >
//                                 🗑️ {deleting === r._id ? "Deleting..." : "Delete"}
//                               </button>
//                             </div>
//                           </div>

//                           {/* Review body */}
//                           <div className="sr-review-text">"{r.body}"</div>

//                           {/* Images */}
//                           {(custImg || revImg) && (
//                             <div className="sr-images-row">
//                               {custImg && (
//                                 <div className="sr-img-box">
//                                   <img src={custImg} alt="customer" className="sr-review-img"
//                                     onError={e => e.target.style.display = "none"} />
//                                   <span className="sr-img-label">Customer Photo</span>
//                                 </div>
//                               )}
//                               {revImg && (
//                                 <div className="sr-img-box">
//                                   <img src={revImg} alt="product" className="sr-review-img"
//                                     onError={e => e.target.style.display = "none"} />
//                                   <span className="sr-img-label">Product Photo</span>
//                                 </div>
//                               )}
//                             </div>
//                           )}

//                           {/* Footer */}
//                           <div className="sr-review-footer">
//                             <span className="sr-review-date">📅 {date}</span>
//                             <span className="sr-helpful">👍 {r.helpful || 0} helpful</span>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShopRating;




import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShopkeeperSidebar from "./ShopkeeperSidebar";

const API = "http://localhost:5000/api";

const imgUrl = (p) => {
  if (!p) return null;
  if (p.startsWith("http")) return p;
  return `http://localhost:5000/${p.replace(/\\/g, "/")}`;
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Lato:wght@400;600;700&display=swap');
.sr-page{display:flex;min-height:100vh;background:#FAF6F0;font-family:'Lato',sans-serif;}
.sr-main{margin-left:240px;flex:1;display:flex;flex-direction:column;}
.sr-topbar{background:#fff;border-bottom:1px solid #EEE5D6;padding:14px 28px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;box-shadow:0 1px 6px rgba(184,115,51,0.05);}
.sr-topbar-title{font-family:'Playfair Display',serif;font-size:20px;color:#3E2723;font-weight:700;}
.sr-topbar-sub{color:#9E8272;font-size:13px;margin-top:2px;}
.sr-back-btn{background:#fff;border:1px solid #E0D0BC;border-radius:9px;padding:8px 16px;color:#B87333;font-weight:700;font-size:13px;cursor:pointer;font-family:'Lato',sans-serif;transition:all 0.2s;}
.sr-back-btn:hover{background:#FFF6E5;}
.sr-body{display:flex;flex:1;}
.sr-left{width:260px;flex-shrink:0;background:linear-gradient(160deg,#FFF8F0 0%,#FFF0DC 100%);border-right:1px solid #EED9BE;padding:28px 22px;display:flex;flex-direction:column;gap:18px;}
.sr-avatar-wrap{display:flex;flex-direction:column;align-items:center;gap:10px;}
.sr-avatar{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#B87333,#C9A44C);display:flex;align-items:center;justify-content:center;font-size:32px;border:3px solid rgba(184,115,51,0.25);box-shadow:0 4px 16px rgba(184,115,51,0.2);}
.sr-left-name{font-family:'Playfair Display',serif;color:#3E2723;font-size:15px;font-weight:700;text-align:center;}
.sr-left-sub{color:#9E8272;font-size:12px;text-align:center;}
.sr-rating-big{background:#fff;border:1px solid #EED9BE;border-radius:14px;padding:18px 13px;text-align:center;box-shadow:0 1px 4px rgba(184,115,51,0.06);}
.sr-rating-num{font-family:'Playfair Display',serif;font-size:44px;font-weight:800;color:#B87333;line-height:1;}
.sr-stars-big{display:flex;justify-content:center;gap:3px;margin:6px 0 4px;font-size:17px;}
.sr-rating-count{font-size:11px;color:#9E8272;font-weight:600;}
.sr-divider{height:1px;background:#EED9BE;}
.sr-breakdown-title{color:#B87333;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px;}
.sr-breakdown{display:flex;flex-direction:column;gap:7px;}
.sr-brow{display:flex;align-items:center;gap:8px;font-size:12px;}
.sr-bstar{color:#B87333;font-weight:700;min-width:14px;}
.sr-bbar{flex:1;height:6px;background:#F0E6D8;border-radius:3px;overflow:hidden;}
.sr-bfill{height:100%;border-radius:3px;background:linear-gradient(90deg,#B87333,#C9A44C);transition:width 0.4s;}
.sr-bcount{color:#9E8272;font-size:11px;min-width:14px;text-align:right;}
.sr-stat-cards{display:flex;flex-direction:column;gap:8px;}
.sr-stat-card{background:#fff;border:1px solid #EED9BE;border-radius:11px;padding:11px 13px;box-shadow:0 1px 4px rgba(184,115,51,0.06);}
.sr-stat-label{color:#B87333;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px;}
.sr-stat-val{font-family:'Playfair Display',serif;color:#3E2723;font-size:24px;font-weight:800;}
.sr-stat-desc{color:#9E8272;font-size:11px;margin-top:1px;}
.sr-left-deco{margin-top:auto;text-align:center;font-size:22px;letter-spacing:6px;opacity:0.2;}
.sr-right{flex:1;padding:26px 30px;overflow-y:auto;}
.sr-section{background:#fff;border-radius:16px;padding:22px 26px;box-shadow:0 2px 10px rgba(184,115,51,0.06);border:1px solid #EEE5D6;}
.sr-section-head{display:flex;align-items:center;justify-content:space-between;padding-bottom:13px;margin-bottom:16px;border-bottom:1px solid #F0E6D8;}
.sr-section-title{font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:#3E2723;}
.sr-count-badge{background:rgba(184,115,51,0.1);color:#B87333;border-radius:20px;padding:3px 12px;font-size:12px;font-weight:700;}
.sr-filter-tabs{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;}
.sr-filter-tab{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;border:1.5px solid rgba(184,115,51,0.22);background:#fff;color:#9E8272;transition:all 0.2s;font-family:'Lato',sans-serif;}
.sr-filter-tab:hover,.sr-filter-tab.active{background:linear-gradient(135deg,#B87333,#C9A44C);border-color:#B87333;color:#fff;}
.sr-list{display:flex;flex-direction:column;gap:16px;}

/* ── New Review Card ── */
.sr-review-card{background:#FDFAF6;border:1px solid #EED9BE;border-radius:16px;overflow:hidden;transition:box-shadow 0.2s;display:flex;}
.sr-review-card:hover{box-shadow:0 6px 24px rgba(184,115,51,0.13);}

/* Left: product image */
.sr-card-img-col{width:130px;flex-shrink:0;background:#FFF3E0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:14px 10px;border-right:1px solid #EED9BE;gap:8px;}
.sr-card-prod-img{width:100px;height:100px;object-fit:cover;border-radius:12px;border:2px solid #EED9BE;box-shadow:0 2px 8px rgba(184,115,51,0.15);}
.sr-card-prod-placeholder{width:100px;height:100px;border-radius:12px;background:linear-gradient(135deg,#F5E6D0,#EDD9B8);display:flex;align-items:center;justify-content:center;font-size:36px;border:2px solid #EED9BE;}
.sr-card-prod-name{font-size:11px;color:#B87333;font-weight:700;text-align:center;line-height:1.3;word-break:break-word;}

/* Right: review content */
.sr-card-content{flex:1;padding:16px 18px;display:flex;flex-direction:column;gap:10px;}
.sr-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;flex-wrap:wrap;}
.sr-reviewer{display:flex;align-items:center;gap:10px;}
.sr-initials{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#B87333,#C9A44C);display:flex;align-items:center;justify-content:center;font-size:15px;color:#fff;font-weight:800;flex-shrink:0;box-shadow:0 2px 8px rgba(184,115,51,0.25);}
.sr-rev-name{font-size:14px;font-weight:700;color:#3E2723;}
.sr-rev-stars{display:flex;gap:2px;margin-top:3px;font-size:13px;}
.sr-delete-btn{display:flex;align-items:center;gap:4px;background:#fff0f0;color:#e53935;border:1px solid #ffcdd2;border-radius:8px;padding:5px 12px;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.2s;font-family:'Lato',sans-serif;white-space:nowrap;}
.sr-delete-btn:hover{background:#ffebee;}
.sr-delete-btn:disabled{opacity:0.5;cursor:not-allowed;}
.sr-review-text{font-size:13px;color:#6D4C41;line-height:1.7;background:#fff;border-left:3px solid rgba(184,115,51,0.4);padding:10px 14px;border-radius:0 10px 10px 0;font-style:italic;}

/* Customer photo row */
.sr-cust-img-row{display:flex;align-items:center;gap:10px;}
.sr-cust-img{width:48px;height:48px;object-fit:cover;border-radius:8px;border:1.5px solid #EED9BE;}
.sr-cust-img-label{font-size:11px;color:#9E8272;font-weight:600;}

/* Review photo */
.sr-rev-img-box{display:flex;flex-direction:column;gap:4px;}
.sr-rev-img{width:72px;height:72px;object-fit:cover;border-radius:10px;border:1.5px solid #EED9BE;}
.sr-img-label{font-size:10px;color:#B87333;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;}

.sr-card-footer{display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px solid rgba(238,217,190,0.6);}
.sr-review-date{font-size:11px;color:#C4AE98;font-weight:600;}
.sr-helpful{font-size:11px;color:#C4AE98;}

@keyframes spin{to{transform:rotate(360deg)}}
.sr-spinner{width:36px;height:36px;border-radius:50%;border:3px solid #EDE5D8;border-top-color:#B87333;animation:spin 0.85s linear infinite;margin:0 auto;}
`;

const ShopRating = () => {
  const navigate = useNavigate();

  const [reviews,    setReviews]    = useState([]);
  const [products,   setProducts]   = useState({}); // productId → image map
  const [avg,        setAvg]        = useState(0);
  const [total,      setTotal]      = useState(0);
  const [breakdown,  setBreakdown]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [deleting,   setDeleting]   = useState(null);
  const [filter,     setFilter]     = useState(0);

  // ── shopId + shopName from localStorage ──
  const shopInfo = (() => {
    try {
      const directId = localStorage.getItem("shopId");
      const skKeys   = Object.keys(localStorage).filter(k => k.startsWith("demoSK_"));
      for (const key of skKeys) {
        const s = JSON.parse(localStorage.getItem(key) || "{}");
        if (directId && (s._id === directId || s.shopId === directId)) {
          return { id: directId, name: s.shopName || "" };
        }
      }
      if (directId) return { id: directId, name: "" };
      return { id: "", name: "" };
    } catch { return { id: "", name: "" }; }
  })();

  const shopId   = shopInfo.id;
  const shopName = shopInfo.name;

  // ── Fetch reviews ──
  const fetchReviews = async () => {
    if (!shopId && !shopName) { setLoading(false); return; }
    try {
      setLoading(true);
      const url  = `${API}/reviews/shop/${encodeURIComponent(shopId)}?shopName=${encodeURIComponent(shopName)}`;
      const res  = await fetch(url);
      const json = await res.json();
      const revList = json.reviews || [];
      setReviews(revList);
      setAvg(json.avg       || 0);
      setTotal(json.total   || 0);
      setBreakdown(json.breakdown || []);

      // ── Fetch product images for each unique productId ──
      const uniqueIds = [...new Set(revList.map(r => r.productId).filter(Boolean))];
      const prodMap   = {};
      await Promise.all(uniqueIds.map(async (pid) => {
        try {
          const pr   = await fetch(`${API}/products/${pid}`);
          const pj   = await pr.json();
          const prod = pj.product || pj;
          // image field — adjust if your API returns differently
          const img  = prod.image || prod.images?.[0] || prod.imageUrl || "";
          prodMap[pid] = imgUrl(img);
        } catch { prodMap[pid] = null; }
      }));
      setProducts(prodMap);
    } catch(e) { console.error("fetchReviews error:", e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, [shopId, shopName]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review permanently?")) return;
    setDeleting(id);
    try {
      await fetch(`${API}/reviews/${id}`, { method: "DELETE" });
      fetchReviews();
    } finally { setDeleting(null); }
  };

  const filtered = filter === 0 ? reviews : reviews.filter(r => r.rating === filter);
  const happy    = reviews.filter(r => r.rating >= 4).length;

  const Stars = ({ n, size = 13 }) => (
    <div style={{ display:"flex", gap:2, fontSize:size }}>
      {[1,2,3,4,5].map(i => <span key={i}>{i <= n ? "⭐" : "☆"}</span>)}
    </div>
  );

  return (
    <div className="sr-page">
      <style>{css}</style>
      <ShopkeeperSidebar active="shop-rating" />

      <div className="sr-main">
        {/* Topbar */}
        <div className="sr-topbar">
          <div>
            <h1 className="sr-topbar-title">Shop Rating</h1>
            <p className="sr-topbar-sub">Customer reviews and ratings for your shop</p>
          </div>
          <button className="sr-back-btn" onClick={() => navigate("/shopkeeper/dashboard")}>
            ← Dashboard
          </button>
        </div>

        <div className="sr-body">
          {/* ── LEFT PANEL ── */}
          <div className="sr-left">
            <div className="sr-avatar-wrap">
              <div className="sr-avatar">⭐</div>
              <div className="sr-left-name">Shop Rating</div>
              <div className="sr-left-sub">Customer feedback</div>
            </div>

            <div className="sr-rating-big">
              <div className="sr-rating-num">{loading ? "—" : (avg || "0")}</div>
              <div className="sr-stars-big">
                {[1,2,3,4,5].map(i => (
                  <span key={i}>{i <= Math.round(avg) ? "⭐" : "☆"}</span>
                ))}
              </div>
              <div className="sr-rating-count">out of 5 · {total} reviews</div>
            </div>

            <div className="sr-divider" />

            <div>
              <div className="sr-breakdown-title">⭐ Rating Breakdown</div>
              <div className="sr-breakdown">
                {breakdown.map(b => (
                  <div className="sr-brow" key={b.star}>
                    <span className="sr-bstar">{b.star}</span>
                    <div className="sr-bbar">
                      <div className="sr-bfill"
                        style={{ width: total ? `${(b.count / total) * 100}%` : "0%" }} />
                    </div>
                    <span className="sr-bcount">{b.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sr-divider" />

            <div className="sr-stat-cards">
              <div className="sr-stat-card">
                <div className="sr-stat-label">🏆 Happy Customers</div>
                <div className="sr-stat-val">{happy}</div>
                <div className="sr-stat-desc">4+ star reviews</div>
              </div>
              <div className="sr-stat-card">
                <div className="sr-stat-label">📝 Total Reviews</div>
                <div className="sr-stat-val">{total}</div>
                <div className="sr-stat-desc">all time</div>
              </div>
            </div>

            <div className="sr-left-deco">🏺 🪔 ⚱️ 🔔</div>
          </div>

          {/* ── RIGHT — reviews list ── */}
          <div className="sr-right">
            {loading ? (
              <div style={{ textAlign:"center", padding:60 }}>
                <div className="sr-spinner" />
                <p style={{ color:"#B87333", marginTop:14, fontSize:14 }}>Loading reviews...</p>
              </div>
            ) : (!shopId && !shopName) ? (
              <div style={{ textAlign:"center", padding:60, color:"#c00", fontSize:14 }}>
                Shop ID not found. Please log in again.
              </div>
            ) : (
              <div className="sr-section">
                <div className="sr-section-head">
                  <div className="sr-section-title">💬 Customer Reviews</div>
                  <span className="sr-count-badge">{filtered.length} reviews</span>
                </div>

                {/* Filter tabs */}
                <div className="sr-filter-tabs">
                  <button className={`sr-filter-tab ${filter===0?"active":""}`} onClick={()=>setFilter(0)}>
                    All Reviews
                  </button>
                  {[5,4,3,2,1].map(n => (
                    <button key={n} className={`sr-filter-tab ${filter===n?"active":""}`} onClick={()=>setFilter(n)}>
                      {"⭐".repeat(n)} ({reviews.filter(r=>r.rating===n).length})
                    </button>
                  ))}
                </div>

                {filtered.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"2rem", color:"#9E8272" }}>
                    {total === 0 ? "No reviews yet for your shop." : "No reviews for this filter."}
                  </div>
                ) : (
                  <div className="sr-list">
                    {filtered.map(r => {
                      const initials  = r.customerName?.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) || "?";
                      const date      = new Date(r.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
                      const custImg   = imgUrl(r.customerImage);
                      const revImg    = imgUrl(r.reviewImage);
                      const prodImg   = products[r.productId] || null;

                      return (
                        <div className="sr-review-card" key={r._id}>

                          {/* ── LEFT: Product image col ── */}
                          <div className="sr-card-img-col">
                            {prodImg ? (
                              <img src={prodImg} alt="product"
                                className="sr-card-prod-img"
                                onError={e => { e.target.style.display="none"; }}
                              />
                            ) : (
                              <div className="sr-card-prod-placeholder">🏺</div>
                            )}
                            <div className="sr-card-prod-name">{r.productName}</div>
                          </div>

                          {/* ── RIGHT: Review content ── */}
                          <div className="sr-card-content">
                            {/* Top row — reviewer + delete */}
                            <div className="sr-card-top">
                              <div className="sr-reviewer">
                                <div className="sr-initials">{initials}</div>
                                <div>
                                  <div className="sr-rev-name">{r.customerName}</div>
                                  <div className="sr-rev-stars"><Stars n={r.rating} /></div>
                                </div>
                              </div>
                              <button className="sr-delete-btn"
                                onClick={() => handleDelete(r._id)}
                                disabled={deleting === r._id}
                              >
                                🗑️ {deleting === r._id ? "Deleting..." : "Delete"}
                              </button>
                            </div>

                            {/* Review text */}
                            <div className="sr-review-text">"{r.body}"</div>

                            {/* Customer photo + review photo */}
                            {(custImg || revImg) && (
                              <div style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"flex-end" }}>
                                {custImg && (
                                  <div className="sr-rev-img-box">
                                    <img src={custImg} alt="customer" className="sr-cust-img"
                                      onError={e=>e.target.style.display="none"} />
                                    <span className="sr-img-label">Customer</span>
                                  </div>
                                )}
                                {revImg && (
                                  <div className="sr-rev-img-box">
                                    <img src={revImg} alt="review" className="sr-rev-img"
                                      onError={e=>e.target.style.display="none"} />
                                    <span className="sr-img-label">Review Photo</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Footer */}
                            <div className="sr-card-footer">
                              <span className="sr-review-date">📅 {date}</span>
                              <span className="sr-helpful">👍 {r.helpful || 0} helpful</span>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopRating;