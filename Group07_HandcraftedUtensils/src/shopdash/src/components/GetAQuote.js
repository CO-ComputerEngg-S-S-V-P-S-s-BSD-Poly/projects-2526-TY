// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import ShopkeeperSidebar from "./ShopkeeperSidebar";

// const STORAGE_KEY = "songir_quotes";

// const getQuotes = () => {
//   try {
//     const saved = localStorage.getItem(STORAGE_KEY);
//     if (saved) return JSON.parse(saved);
//     const demo = [
//       { id:"q1", customerName:"Rajesh Kumar",  phone:"9876543210", product:"Brass Pooja Thali",  quantity:2,  message:"Mujhe 2 thali chahiye, kya bulk discount milega?",         date:"2025-02-20", status:"pending" },
//       { id:"q2", customerName:"Sunita Devi",   phone:"9123456780", product:"Copper Water Pot",   quantity:5,  message:"Wedding gift ke liye 5 pots chahiye, delivery kab hogi?", date:"2025-02-22", status:"replied" },
//       { id:"q3", customerName:"Mahesh Shah",   phone:"9988776655", product:"Brass Diya Set",     quantity:10, message:"Festival order hai, price confirm karo jaldi.",            date:"2025-02-23", status:"pending" },
//       { id:"q4", customerName:"Priya Agarwal", phone:"9977112233", product:"Copper Karahi Set",  quantity:1,  message:"Gift packaging milegi kya? Shaadi ka gift hai.",          date:"2025-02-23", status:"closed"  },
//     ];
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
//     return demo;
//   } catch { return []; }
// };

// const saveQuotes = (q) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(q)); } catch {} };

// const STATUS = {
//   pending: { bg:"#FFF8E1", color:"#E65100", border:"#FFE082", label:"⏳ Pending" },
//   replied: { bg:"#E8F5E9", color:"#2E7D32", border:"#A5D6A7", label:"✅ Replied" },
//   closed:  { bg:"#F3F4F6", color:"#6B7280", border:"#D1D5DB", label:"🔒 Closed"  },
// };

// const css = `
// @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Lato:wght@400;600;700&display=swap');
// .gq-page{display:flex;min-height:100vh;background:#FAF6F0;font-family:'Lato',sans-serif;}
// .gq-main{margin-left:240px;flex:1;display:flex;flex-direction:column;}
// .gq-topbar{background:#fff;border-bottom:1px solid #EEE5D6;padding:14px 28px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;box-shadow:0 1px 6px rgba(184,115,51,0.05);}
// .gq-topbar-title{font-family:'Playfair Display',serif;font-size:20px;color:#3E2723;font-weight:700;}
// .gq-topbar-sub{color:#9E8272;font-size:13px;margin-top:2px;}
// .gq-back-btn{background:#fff;border:1px solid #E0D0BC;border-radius:9px;padding:8px 16px;color:#B87333;font-weight:700;font-size:13px;cursor:pointer;font-family:'Lato',sans-serif;transition:all 0.2s;}
// .gq-back-btn:hover{background:#FFF6E5;}
// .gq-body{display:flex;flex:1;}
// .gq-left{width:260px;flex-shrink:0;background:linear-gradient(160deg,#FFF8F0 0%,#FFF0DC 100%);border-right:1px solid #EED9BE;padding:28px 22px;display:flex;flex-direction:column;gap:18px;}
// .gq-avatar-wrap{display:flex;flex-direction:column;align-items:center;gap:10px;}
// .gq-avatar{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#B87333,#C9A44C);display:flex;align-items:center;justify-content:center;font-size:32px;border:3px solid rgba(184,115,51,0.25);box-shadow:0 4px 16px rgba(184,115,51,0.2);}
// .gq-left-name{font-family:'Playfair Display',serif;color:#3E2723;font-size:15px;font-weight:700;text-align:center;}
// .gq-left-sub{color:#9E8272;font-size:12px;text-align:center;}
// .gq-divider{height:1px;background:#EED9BE;}
// .gq-stat-cards{display:flex;flex-direction:column;gap:8px;}
// .gq-stat-card{background:#fff;border:1px solid #EED9BE;border-radius:11px;padding:11px 13px;box-shadow:0 1px 4px rgba(184,115,51,0.06);}
// .gq-stat-label{color:#B87333;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px;}
// .gq-stat-val{font-family:'Playfair Display',serif;color:#3E2723;font-size:24px;font-weight:800;}
// .gq-stat-desc{color:#9E8272;font-size:11px;margin-top:1px;}
// .gq-filter-label{color:#B87333;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;}
// .gq-filter-list{display:flex;flex-direction:column;gap:6px;}
// .gq-filter-btn{width:100%;padding:9px 12px;background:#fff;border:1px solid #E0D0BC;border-radius:9px;color:#3E2723;font-weight:600;font-size:12px;cursor:pointer;font-family:'Lato',sans-serif;text-align:left;transition:all 0.2s;display:flex;align-items:center;justify-content:space-between;}
// .gq-filter-btn:hover,.gq-filter-btn.active{background:#FFF6E5;border-color:#B87333;color:#B87333;}
// .gq-filter-count{background:rgba(184,115,51,0.12);color:#B87333;border-radius:10px;padding:1px 8px;font-size:11px;font-weight:700;}
// .gq-left-deco{margin-top:auto;text-align:center;font-size:22px;letter-spacing:6px;opacity:0.2;}
// .gq-right{flex:1;padding:26px 30px;overflow-y:auto;}
// .gq-section{background:#fff;border-radius:16px;padding:22px 26px;box-shadow:0 2px 10px rgba(184,115,51,0.06);border:1px solid #EEE5D6;}
// .gq-section-head{display:flex;align-items:center;justify-content:space-between;padding-bottom:13px;margin-bottom:16px;border-bottom:1px solid #F0E6D8;}
// .gq-section-title{font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:#3E2723;}
// .gq-count-badge{background:rgba(184,115,51,0.1);color:#B87333;border-radius:20px;padding:3px 12px;font-size:12px;font-weight:700;}
// .gq-list{display:flex;flex-direction:column;gap:12px;}
// .gq-card{background:#FDFAF6;border:1px solid #EED9BE;border-radius:13px;padding:16px 18px;transition:box-shadow 0.2s;}
// .gq-card:hover{box-shadow:0 4px 18px rgba(184,115,51,0.11);}
// .gq-card-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px;}
// .gq-customer{display:flex;align-items:center;gap:12px;}
// .gq-initials{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#B87333,#C9A44C);display:flex;align-items:center;justify-content:center;font-size:14px;color:#fff;font-weight:800;flex-shrink:0;box-shadow:0 2px 8px rgba(184,115,51,0.25);}
// .gq-cname{font-size:14px;font-weight:700;color:#3E2723;}
// .gq-cphone{font-size:12px;color:#9E8272;margin-top:2px;}
// .gq-pill{padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;border:1px solid;white-space:nowrap;flex-shrink:0;}
// .gq-product-row{display:flex;align-items:center;gap:10px;background:rgba(184,115,51,0.05);border-radius:9px;padding:9px 13px;margin-bottom:10px;}
// .gq-product-label{font-size:10px;color:#B87333;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:2px;}
// .gq-product-name{font-size:13px;color:#3E2723;font-weight:700;}
// .gq-product-qty{margin-left:auto;font-size:12px;color:#9E8272;font-weight:600;background:#fff;padding:3px 10px;border-radius:20px;border:1px solid #EED9BE;}
// .gq-message{font-size:13px;color:#6D4C41;line-height:1.65;background:#fff;border-left:3px solid rgba(184,115,51,0.35);padding:9px 13px;border-radius:0 8px 8px 0;margin-bottom:12px;font-style:italic;}
// .gq-footer{display:flex;align-items:center;justify-content:space-between;}
// .gq-date{font-size:11px;color:#C4AE98;font-weight:600;}
// .gq-actions{display:flex;gap:8px;}
// .gq-btn-reply{padding:7px 16px;background:linear-gradient(135deg,#B87333,#C9A44C);border:none;border-radius:8px;color:#fff;font-weight:700;font-size:12px;cursor:pointer;font-family:'Lato',sans-serif;transition:all 0.2s;}
// .gq-btn-reply:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(184,115,51,0.3);}
// .gq-btn-close{padding:7px 14px;background:#fff;border:1px solid #E0D0BC;border-radius:8px;color:#9E8272;font-weight:700;font-size:12px;cursor:pointer;font-family:'Lato',sans-serif;transition:all 0.2s;}
// .gq-btn-close:hover{border-color:#B87333;color:#B87333;}
// .gq-empty{text-align:center;padding:60px 20px;color:#C4AE98;}
// .gq-empty-icon{font-size:52px;margin-bottom:12px;opacity:0.4;}
// .gq-empty-text{font-size:15px;font-weight:600;}
// `;

// const GetAQuote = () => {
//   const navigate = useNavigate();
//   const [quotes, setQuotes] = useState(() => getQuotes());
//   const [filter, setFilter] = useState("all");

//   const counts = {
//     all:     quotes.length,
//     pending: quotes.filter(q => q.status === "pending").length,
//     replied: quotes.filter(q => q.status === "replied").length,
//     closed:  quotes.filter(q => q.status === "closed").length,
//   };
//   const filtered = filter === "all" ? quotes : quotes.filter(q => q.status === filter);

//   const markStatus = (id, status) => {
//     const updated = quotes.map(q => q.id === id ? {...q, status} : q);
//     setQuotes(updated); saveQuotes(updated);
//   };

//   return (
//     <div className="gq-page">
//       <style>{css}</style>
//       <ShopkeeperSidebar active="get-a-quote" />
//       <div className="gq-main">
//         <div className="gq-topbar">
//           <div>
//             <h1 className="gq-topbar-title">Get a Quote</h1>
//             <p className="gq-topbar-sub">Manage customer quote requests for your products</p>
//           </div>
//           <button className="gq-back-btn" onClick={() => navigate("/shopkeeper/dashboard")}>← Dashboard</button>
//         </div>

//         <div className="gq-body">
//           {/* Left Panel */}
//           <div className="gq-left">
//             <div className="gq-avatar-wrap">
//               <div className="gq-avatar">💬</div>
//               <div className="gq-left-name">Quote Requests</div>
//               <div className="gq-left-sub">Customer enquiries</div>
//             </div>
//             <div className="gq-divider"/>
//             <div className="gq-stat-cards">
//               {[
//                 { label:"📨 Total Requests", val:counts.all,     desc:"all time"     },
//                 { label:"⏳ Pending",        val:counts.pending, desc:"need reply"   },
//                 { label:"✅ Replied",        val:counts.replied, desc:"responded"    },
//               ].map(s => (
//                 <div className="gq-stat-card" key={s.label}>
//                   <div className="gq-stat-label">{s.label}</div>
//                   <div className="gq-stat-val">{s.val}</div>
//                   <div className="gq-stat-desc">{s.desc}</div>
//                 </div>
//               ))}
//             </div>
//             <div className="gq-divider"/>
//             <div>
//               <div className="gq-filter-label">🔍 Filter by Status</div>
//               <div className="gq-filter-list">
//                 {[
//                   { key:"all",     label:"All Requests" },
//                   { key:"pending", label:"Pending"      },
//                   { key:"replied", label:"Replied"      },
//                   { key:"closed",  label:"Closed"       },
//                 ].map(f => (
//                   <button
//                     key={f.key}
//                     className={`gq-filter-btn ${filter === f.key ? "active" : ""}`}
//                     onClick={() => setFilter(f.key)}
//                   >
//                     {f.label}
//                     <span className="gq-filter-count">{counts[f.key]}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div className="gq-left-deco">🏺 🪔 ⚱️ 🔔</div>
//           </div>

//           {/* Right — list */}
//           <div className="gq-right">
//             <div className="gq-section">
//               <div className="gq-section-head">
//                 <div className="gq-section-title">
//                   💬 {filter === "all" ? "All Requests" : filter.charAt(0).toUpperCase() + filter.slice(1)}
//                 </div>
//                 <span className="gq-count-badge">{filtered.length} requests</span>
//               </div>

//               {filtered.length === 0 ? (
//                 <div className="gq-empty">
//                   <div className="gq-empty-icon">📭</div>
//                   <div className="gq-empty-text">No {filter} requests yet</div>
//                 </div>
//               ) : (
//                 <div className="gq-list">
//                   {filtered.map(q => {
//                     const s       = STATUS[q.status] || STATUS.pending;
//                     const initials = q.customerName.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);
//                     return (
//                       <div className="gq-card" key={q.id}>
//                         <div className="gq-card-top">
//                           <div className="gq-customer">
//                             <div className="gq-initials">{initials}</div>
//                             <div>
//                               <div className="gq-cname">{q.customerName}</div>
//                               <div className="gq-cphone">📞 {q.phone}</div>
//                             </div>
//                           </div>
//                           <span className="gq-pill" style={{background:s.bg,color:s.color,borderColor:s.border}}>
//                             {s.label}
//                           </span>
//                         </div>
//                         <div className="gq-product-row">
//                           <div>
//                             <div className="gq-product-label">Product Requested</div>
//                             <div className="gq-product-name">🏺 {q.product}</div>
//                           </div>
//                           <span className="gq-product-qty">Qty: {q.quantity}</span>
//                         </div>
//                         <div className="gq-message">"{q.message}"</div>
//                         <div className="gq-footer">
//                           <span className="gq-date">📅 {q.date}</span>
//                           <div className="gq-actions">
//                             {q.status === "pending" && (
//                               <button className="gq-btn-reply" onClick={() => markStatus(q.id, "replied")}>✅ Mark Replied</button>
//                             )}
//                             {q.status !== "closed" && (
//                               <button className="gq-btn-close" onClick={() => markStatus(q.id, "closed")}>🔒 Close</button>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GetAQuote;





// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import ShopkeeperSidebar from "./ShopkeeperSidebar";

// const STORAGE_KEY = "songir_quotes";

// const getQuotes = () => {
//   try {
//     const saved = localStorage.getItem(STORAGE_KEY);
//     if (saved) return JSON.parse(saved);
//     // Demo data if nothing saved yet
//     const demo = [
//       { id:"q1", customerName:"Rajesh Kumar",  phone:"9876543210", product:"Brass Pooja Thali",  quantity:2,  message:"Mujhe 2 thali chahiye, kya bulk discount milega?",         date:"2025-02-20", status:"pending" },
//       { id:"q2", customerName:"Sunita Devi",   phone:"9123456780", product:"Copper Water Pot",   quantity:5,  message:"Wedding gift ke liye 5 pots chahiye, delivery kab hogi?", date:"2025-02-22", status:"replied" },
//       { id:"q3", customerName:"Mahesh Shah",   phone:"9988776655", product:"Brass Diya Set",     quantity:10, message:"Festival order hai, price confirm karo jaldi.",            date:"2025-02-23", status:"pending" },
//       { id:"q4", customerName:"Priya Agarwal", phone:"9977112233", product:"Copper Karahi Set",  quantity:1,  message:"Gift packaging milegi kya? Shaadi ka gift hai.",          date:"2025-02-23", status:"closed"  },
//     ];
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
//     return demo;
//   } catch { return []; }
// };

// const saveQuotes = (q) => {
//   try { localStorage.setItem(STORAGE_KEY, JSON.stringify(q)); } catch {}
// };

// const STATUS = {
//   pending: { bg:"#FFF8E1", color:"#E65100", border:"#FFE082", label:"⏳ Pending" },
//   replied: { bg:"#E8F5E9", color:"#2E7D32", border:"#A5D6A7", label:"✅ Replied" },
//   closed:  { bg:"#F3F4F6", color:"#6B7280", border:"#D1D5DB", label:"🔒 Closed"  },
// };

// const css = `
// @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Lato:wght@400;600;700&display=swap');
// .gq-page{display:flex;min-height:100vh;background:#FAF6F0;font-family:'Lato',sans-serif;}
// .gq-main{margin-left:240px;flex:1;display:flex;flex-direction:column;}
// .gq-topbar{background:#fff;border-bottom:1px solid #EEE5D6;padding:14px 28px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;box-shadow:0 1px 6px rgba(184,115,51,0.05);}
// .gq-topbar-title{font-family:'Playfair Display',serif;font-size:20px;color:#3E2723;font-weight:700;}
// .gq-topbar-sub{color:#9E8272;font-size:13px;margin-top:2px;}
// .gq-back-btn{background:#fff;border:1px solid #E0D0BC;border-radius:9px;padding:8px 16px;color:#B87333;font-weight:700;font-size:13px;cursor:pointer;font-family:'Lato',sans-serif;transition:all 0.2s;}
// .gq-back-btn:hover{background:#FFF6E5;}
// .gq-body{display:flex;flex:1;}
// .gq-left{width:260px;flex-shrink:0;background:linear-gradient(160deg,#FFF8F0 0%,#FFF0DC 100%);border-right:1px solid #EED9BE;padding:28px 22px;display:flex;flex-direction:column;gap:18px;}
// .gq-avatar-wrap{display:flex;flex-direction:column;align-items:center;gap:10px;}
// .gq-avatar{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#B87333,#C9A44C);display:flex;align-items:center;justify-content:center;font-size:32px;border:3px solid rgba(184,115,51,0.25);box-shadow:0 4px 16px rgba(184,115,51,0.2);}
// .gq-left-name{font-family:'Playfair Display',serif;color:#3E2723;font-size:15px;font-weight:700;text-align:center;}
// .gq-left-sub{color:#9E8272;font-size:12px;text-align:center;}
// .gq-divider{height:1px;background:#EED9BE;}
// .gq-stat-cards{display:flex;flex-direction:column;gap:8px;}
// .gq-stat-card{background:#fff;border:1px solid #EED9BE;border-radius:11px;padding:11px 13px;box-shadow:0 1px 4px rgba(184,115,51,0.06);}
// .gq-stat-label{color:#B87333;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px;}
// .gq-stat-val{font-family:'Playfair Display',serif;color:#3E2723;font-size:24px;font-weight:800;}
// .gq-stat-desc{color:#9E8272;font-size:11px;margin-top:1px;}
// .gq-filter-label{color:#B87333;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;}
// .gq-filter-list{display:flex;flex-direction:column;gap:6px;}
// .gq-filter-btn{width:100%;padding:9px 12px;background:#fff;border:1px solid #E0D0BC;border-radius:9px;color:#3E2723;font-weight:600;font-size:12px;cursor:pointer;font-family:'Lato',sans-serif;text-align:left;transition:all 0.2s;display:flex;align-items:center;justify-content:space-between;}
// .gq-filter-btn:hover,.gq-filter-btn.active{background:#FFF6E5;border-color:#B87333;color:#B87333;}
// .gq-filter-count{background:rgba(184,115,51,0.12);color:#B87333;border-radius:10px;padding:1px 8px;font-size:11px;font-weight:700;}
// .gq-left-deco{margin-top:auto;text-align:center;font-size:22px;letter-spacing:6px;opacity:0.2;}
// .gq-right{flex:1;padding:26px 30px;overflow-y:auto;}
// .gq-section{background:#fff;border-radius:16px;padding:22px 26px;box-shadow:0 2px 10px rgba(184,115,51,0.06);border:1px solid #EEE5D6;}
// .gq-section-head{display:flex;align-items:center;justify-content:space-between;padding-bottom:13px;margin-bottom:16px;border-bottom:1px solid #F0E6D8;}
// .gq-section-title{font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:#3E2723;}
// .gq-count-badge{background:rgba(184,115,51,0.1);color:#B87333;border-radius:20px;padding:3px 12px;font-size:12px;font-weight:700;}
// .gq-list{display:flex;flex-direction:column;gap:12px;}
// .gq-card{background:#FDFAF6;border:1px solid #EED9BE;border-radius:13px;padding:16px 18px;transition:box-shadow 0.2s;}
// .gq-card:hover{box-shadow:0 4px 18px rgba(184,115,51,0.11);}
// .gq-card-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px;}
// .gq-customer{display:flex;align-items:center;gap:12px;}
// .gq-initials{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#B87333,#C9A44C);display:flex;align-items:center;justify-content:center;font-size:14px;color:#fff;font-weight:800;flex-shrink:0;box-shadow:0 2px 8px rgba(184,115,51,0.25);}
// .gq-cname{font-size:14px;font-weight:700;color:#3E2723;}
// .gq-cphone{font-size:12px;color:#9E8272;margin-top:2px;}
// .gq-pill{padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;border:1px solid;white-space:nowrap;flex-shrink:0;}
// .gq-product-row{display:flex;align-items:center;gap:10px;background:rgba(184,115,51,0.05);border-radius:9px;padding:9px 13px;margin-bottom:10px;}
// .gq-product-label{font-size:10px;color:#B87333;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:2px;}
// .gq-product-name{font-size:13px;color:#3E2723;font-weight:700;}
// .gq-product-qty{margin-left:auto;font-size:12px;color:#9E8272;font-weight:600;background:#fff;padding:3px 10px;border-radius:20px;border:1px solid #EED9BE;}
// .gq-message{font-size:13px;color:#6D4C41;line-height:1.65;background:#fff;border-left:3px solid rgba(184,115,51,0.35);padding:9px 13px;border-radius:0 8px 8px 0;margin-bottom:12px;font-style:italic;}
// .gq-footer{display:flex;align-items:center;justify-content:space-between;}
// .gq-date{font-size:11px;color:#C4AE98;font-weight:600;}
// .gq-actions{display:flex;gap:8px;}
// .gq-btn-reply{padding:7px 16px;background:linear-gradient(135deg,#B87333,#C9A44C);border:none;border-radius:8px;color:#fff;font-weight:700;font-size:12px;cursor:pointer;font-family:'Lato',sans-serif;transition:all 0.2s;}
// .gq-btn-reply:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(184,115,51,0.3);}
// .gq-btn-close{padding:7px 14px;background:#fff;border:1px solid #E0D0BC;border-radius:8px;color:#9E8272;font-weight:700;font-size:12px;cursor:pointer;font-family:'Lato',sans-serif;transition:all 0.2s;}
// .gq-btn-close:hover{border-color:#B87333;color:#B87333;}
// .gq-empty{text-align:center;padding:60px 20px;color:#C4AE98;}
// .gq-empty-icon{font-size:52px;margin-bottom:12px;opacity:0.4;}
// .gq-empty-text{font-size:15px;font-weight:600;}

// /* New badge pulse for new quotes */
// .gq-new-badge{display:inline-flex;align-items:center;gap:4px;background:#FFF3E0;color:#E65100;border:1px solid #FFB74D;border-radius:20px;padding:2px 8px;font-size:10px;font-weight:700;margin-left:8px;animation:pulse 2s infinite;}
// @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.6;}}
// `;

// const GetAQuote = () => {
//   const navigate = useNavigate();
//   const [quotes, setQuotes] = useState([]);
//   const [filter, setFilter] = useState("all");

//   // Load from localStorage and listen for storage changes (cross-tab sync)
//   useEffect(() => {
//     setQuotes(getQuotes());

//     const handleStorageChange = (e) => {
//       if (e.key === STORAGE_KEY) {
//         setQuotes(getQuotes());
//       }
//     };
//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   // Poll every 3 seconds to catch same-tab updates
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setQuotes(getQuotes());
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   const counts = {
//     all:     quotes.length,
//     pending: quotes.filter(q => q.status === "pending").length,
//     replied: quotes.filter(q => q.status === "replied").length,
//     closed:  quotes.filter(q => q.status === "closed").length,
//   };

//   const filtered = filter === "all" ? quotes : quotes.filter(q => q.status === filter);

//   const markStatus = (id, status) => {
//     const updated = quotes.map(q => q.id === id ? {...q, status} : q);
//     setQuotes(updated);
//     saveQuotes(updated);
//   };

//   return (
//     <div className="gq-page">
//       <style>{css}</style>
//       <ShopkeeperSidebar active="get-a-quote" />
//       <div className="gq-main">
//         <div className="gq-topbar">
//           <div>
//             <h1 className="gq-topbar-title">Get a Quote</h1>
//             <p className="gq-topbar-sub">Manage customer quote requests for your products</p>
//           </div>
//           <button className="gq-back-btn" onClick={() => navigate("/shopkeeper/dashboard")}>← Dashboard</button>
//         </div>

//         <div className="gq-body">
//           {/* Left Panel */}
//           <div className="gq-left">
//             <div className="gq-avatar-wrap">
//               <div className="gq-avatar">💬</div>
//               <div className="gq-left-name">Quote Requests</div>
//               <div className="gq-left-sub">Customer enquiries</div>
//             </div>
//             <div className="gq-divider"/>
//             <div className="gq-stat-cards">
//               {[
//                 { label:"📨 Total Requests", val: counts.all,     desc:"all time"   },
//                 { label:"⏳ Pending",        val: counts.pending, desc:"need reply"  },
//                 { label:"✅ Replied",        val: counts.replied, desc:"responded"   },
//               ].map(s => (
//                 <div className="gq-stat-card" key={s.label}>
//                   <div className="gq-stat-label">{s.label}</div>
//                   <div className="gq-stat-val">{s.val}</div>
//                   <div className="gq-stat-desc">{s.desc}</div>
//                 </div>
//               ))}
//             </div>
//             <div className="gq-divider"/>
//             <div>
//               <div className="gq-filter-label">🔍 Filter by Status</div>
//               <div className="gq-filter-list">
//                 {[
//                   { key:"all",     label:"All Requests" },
//                   { key:"pending", label:"Pending"      },
//                   { key:"replied", label:"Replied"      },
//                   { key:"closed",  label:"Closed"       },
//                 ].map(f => (
//                   <button
//                     key={f.key}
//                     className={`gq-filter-btn ${filter === f.key ? "active" : ""}`}
//                     onClick={() => setFilter(f.key)}
//                   >
//                     {f.label}
//                     <span className="gq-filter-count">{counts[f.key]}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div className="gq-left-deco">🏺 🪔 ⚱️ 🔔</div>
//           </div>

//           {/* Right — list */}
//           <div className="gq-right">
//             <div className="gq-section">
//               <div className="gq-section-head">
//                 <div className="gq-section-title">
//                   💬 {filter === "all" ? "All Requests" : filter.charAt(0).toUpperCase() + filter.slice(1)}
//                   {counts.pending > 0 && filter !== "closed" && (
//                     <span className="gq-new-badge">🔴 {counts.pending} new</span>
//                   )}
//                 </div>
//                 <span className="gq-count-badge">{filtered.length} requests</span>
//               </div>

//               {filtered.length === 0 ? (
//                 <div className="gq-empty">
//                   <div className="gq-empty-icon">📭</div>
//                   <div className="gq-empty-text">No {filter} requests yet</div>
//                 </div>
//               ) : (
//                 <div className="gq-list">
//                   {filtered.map(q => {
//                     const s = STATUS[q.status] || STATUS.pending;
//                     const initials = q.customerName
//                       .split(" ")
//                       .map(n => n[0])
//                       .join("")
//                       .toUpperCase()
//                       .slice(0, 2);
//                     return (
//                       <div className="gq-card" key={q.id}>
//                         <div className="gq-card-top">
//                           <div className="gq-customer">
//                             <div className="gq-initials">{initials}</div>
//                             <div>
//                               <div className="gq-cname">{q.customerName}</div>
//                               <div className="gq-cphone">📞 {q.phone}</div>
//                               {q.email && <div className="gq-cphone">✉️ {q.email}</div>}
//                             </div>
//                           </div>
//                           <span
//                             className="gq-pill"
//                             style={{ background: s.bg, color: s.color, borderColor: s.border }}
//                           >
//                             {s.label}
//                           </span>
//                         </div>

//                         <div className="gq-product-row">
//                           <div>
//                             <div className="gq-product-label">Product Requested</div>
//                             <div className="gq-product-name">🏺 {q.product}</div>
//                           </div>
//                           <span className="gq-product-qty">Qty: {q.quantity}</span>
//                         </div>

//                         <div className="gq-message">"{q.message}"</div>

//                         {q.urgency && (
//                           <div style={{ fontSize: 11, color: "#B87333", marginBottom: 10, fontWeight: 600 }}>
//                             ⚡ Urgency: {q.urgency}
//                           </div>
//                         )}

//                         <div className="gq-footer">
//                           <span className="gq-date">📅 {q.date}</span>
//                           <div className="gq-actions">
//                             {q.status === "pending" && (
//                               <button
//                                 className="gq-btn-reply"
//                                 onClick={() => markStatus(q.id, "replied")}
//                               >
//                                 ✅ Mark Replied
//                               </button>
//                             )}
//                             {q.status !== "closed" && (
//                               <button
//                                 className="gq-btn-close"
//                                 onClick={() => markStatus(q.id, "closed")}
//                               >
//                                 🔒 Close
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GetAQuote;

//////////////////////////////////////////////////////////////////



import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ShopkeeperSidebar from "./ShopkeeperSidebar";

const API = "http://localhost:5000/api";

// ✅ FIX: shopId localStorage + sessionStorage dono se check karo
const getShopId = () => {
  // Pehle localStorage check karo
  const fromLocal = localStorage.getItem("shopId");
  if (fromLocal) return fromLocal;

  // Nahi mila toh sessionStorage se nikalo
  try {
    const skData = sessionStorage.getItem("shopkeeperData");
    if (skData) {
      const parsed = JSON.parse(skData);
      const shopId = parsed?.shopId || parsed?._id;
      if (shopId) {
        localStorage.setItem("shopId", shopId); // aage ke liye save karo
        return shopId;
      }
    }
  } catch (_) {}

  return "";
};

const STATUS = {
  pending:  { bg: "#FFF8E1", color: "#E65100", border: "#FFE082", label: "⏳ Pending"  },
  approved: { bg: "#E8F5E9", color: "#2E7D32", border: "#A5D6A7", label: "✅ Approved" },
  quoted:   { bg: "#E3F2FD", color: "#1565C0", border: "#90CAF9", label: "💰 Quoted"   },
  rejected: { bg: "#FCE4EC", color: "#880E4F", border: "#F48FB1", label: "❌ Rejected" },
  replied:  { bg: "#E8F5E9", color: "#2E7D32", border: "#A5D6A7", label: "✅ Replied"  },
  closed:   { bg: "#F3F4F6", color: "#6B7280", border: "#D1D5DB", label: "🔒 Closed"   },
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Lato:wght@400;600;700&display=swap');
.gq-page{display:flex;min-height:100vh;background:#FAF6F0;font-family:'Lato',sans-serif;}
.gq-main{margin-left:240px;flex:1;display:flex;flex-direction:column;}
.gq-topbar{background:#fff;border-bottom:1px solid #EEE5D6;padding:14px 28px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;box-shadow:0 1px 6px rgba(184,115,51,0.05);}
.gq-topbar-title{font-family:'Playfair Display',serif;font-size:20px;color:#3E2723;font-weight:700;}
.gq-topbar-sub{color:#9E8272;font-size:13px;margin-top:2px;}
.gq-back-btn{background:#fff;border:1px solid #E0D0BC;border-radius:9px;padding:8px 16px;color:#B87333;font-weight:700;font-size:13px;cursor:pointer;font-family:'Lato',sans-serif;transition:all 0.2s;}
.gq-back-btn:hover{background:#FFF6E5;}
.gq-body{display:flex;flex:1;}
.gq-left{width:260px;flex-shrink:0;background:linear-gradient(160deg,#FFF8F0 0%,#FFF0DC 100%);border-right:1px solid #EED9BE;padding:28px 22px;display:flex;flex-direction:column;gap:18px;}
.gq-avatar-wrap{display:flex;flex-direction:column;align-items:center;gap:10px;}
.gq-avatar{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#B87333,#C9A44C);display:flex;align-items:center;justify-content:center;font-size:32px;border:3px solid rgba(184,115,51,0.25);box-shadow:0 4px 16px rgba(184,115,51,0.2);}
.gq-left-name{font-family:'Playfair Display',serif;color:#3E2723;font-size:15px;font-weight:700;text-align:center;}
.gq-left-sub{color:#9E8272;font-size:12px;text-align:center;}
.gq-divider{height:1px;background:#EED9BE;}
.gq-stat-cards{display:flex;flex-direction:column;gap:8px;}
.gq-stat-card{background:#fff;border:1px solid #EED9BE;border-radius:11px;padding:11px 13px;box-shadow:0 1px 4px rgba(184,115,51,0.06);}
.gq-stat-label{color:#B87333;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px;}
.gq-stat-val{font-family:'Playfair Display',serif;color:#3E2723;font-size:24px;font-weight:800;}
.gq-stat-desc{color:#9E8272;font-size:11px;margin-top:1px;}
.gq-filter-label{color:#B87333;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;}
.gq-filter-list{display:flex;flex-direction:column;gap:6px;}
.gq-filter-btn{width:100%;padding:9px 12px;background:#fff;border:1px solid #E0D0BC;border-radius:9px;color:#3E2723;font-weight:600;font-size:12px;cursor:pointer;font-family:'Lato',sans-serif;text-align:left;transition:all 0.2s;display:flex;align-items:center;justify-content:space-between;}
.gq-filter-btn:hover,.gq-filter-btn.active{background:#FFF6E5;border-color:#B87333;color:#B87333;}
.gq-filter-count{background:rgba(184,115,51,0.12);color:#B87333;border-radius:10px;padding:1px 8px;font-size:11px;font-weight:700;}
.gq-left-deco{margin-top:auto;text-align:center;font-size:22px;letter-spacing:6px;opacity:0.2;}
.gq-right{flex:1;padding:26px 30px;overflow-y:auto;}
.gq-section{background:#fff;border-radius:16px;padding:22px 26px;box-shadow:0 2px 10px rgba(184,115,51,0.06);border:1px solid #EEE5D6;}
.gq-section-head{display:flex;align-items:center;justify-content:space-between;padding-bottom:13px;margin-bottom:16px;border-bottom:1px solid #F0E6D8;}
.gq-section-title{font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:#3E2723;}
.gq-count-badge{background:rgba(184,115,51,0.1);color:#B87333;border-radius:20px;padding:3px 12px;font-size:12px;font-weight:700;}
.gq-list{display:flex;flex-direction:column;gap:12px;}
.gq-card{background:#FDFAF6;border:1px solid #EED9BE;border-radius:13px;padding:16px 18px;transition:box-shadow 0.2s;}
.gq-card:hover{box-shadow:0 4px 18px rgba(184,115,51,0.11);}
.gq-card-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px;}
.gq-customer{display:flex;align-items:center;gap:12px;}
.gq-initials{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#B87333,#C9A44C);display:flex;align-items:center;justify-content:center;font-size:14px;color:#fff;font-weight:800;flex-shrink:0;box-shadow:0 2px 8px rgba(184,115,51,0.25);}
.gq-cname{font-size:14px;font-weight:700;color:#3E2723;}
.gq-cphone{font-size:12px;color:#9E8272;margin-top:2px;}
.gq-pill{padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;border:1px solid;white-space:nowrap;flex-shrink:0;}
.gq-product-row{display:flex;align-items:center;gap:10px;background:rgba(184,115,51,0.05);border-radius:9px;padding:9px 13px;margin-bottom:10px;}
.gq-product-label{font-size:10px;color:#B87333;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:2px;}
.gq-product-name{font-size:13px;color:#3E2723;font-weight:700;}
.gq-product-qty{margin-left:auto;font-size:12px;color:#9E8272;font-weight:600;background:#fff;padding:3px 10px;border-radius:20px;border:1px solid #EED9BE;}
.gq-message{font-size:13px;color:#6D4C41;line-height:1.65;background:#fff;border-left:3px solid rgba(184,115,51,0.35);padding:9px 13px;border-radius:0 8px 8px 0;margin-bottom:12px;font-style:italic;}
.gq-footer{display:flex;align-items:center;justify-content:space-between;}
.gq-date{font-size:11px;color:#C4AE98;font-weight:600;}
.gq-actions{display:flex;gap:8px;}
.gq-btn-reply{padding:7px 16px;background:linear-gradient(135deg,#B87333,#C9A44C);border:none;border-radius:8px;color:#fff;font-weight:700;font-size:12px;cursor:pointer;font-family:'Lato',sans-serif;transition:all 0.2s;}
.gq-btn-reply:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(184,115,51,0.3);}
.gq-btn-close{padding:7px 14px;background:#fff;border:1px solid #E0D0BC;border-radius:8px;color:#9E8272;font-weight:700;font-size:12px;cursor:pointer;font-family:'Lato',sans-serif;transition:all 0.2s;}
.gq-btn-close:hover{border-color:#B87333;color:#B87333;}
.gq-empty{text-align:center;padding:60px 20px;color:#C4AE98;}
.gq-empty-icon{font-size:52px;margin-bottom:12px;opacity:0.4;}
.gq-empty-text{font-size:15px;font-weight:600;}
.gq-new-badge{display:inline-flex;align-items:center;gap:4px;background:#FFF3E0;color:#E65100;border:1px solid #FFB74D;border-radius:20px;padding:2px 8px;font-size:10px;font-weight:700;margin-left:8px;animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.6;}}
.gq-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;}
.gq-modal{background:#fff;border-radius:16px;padding:28px;width:440px;max-width:95vw;box-shadow:0 20px 60px rgba(0,0,0,0.2);}
.gq-modal h3{font-family:'Playfair Display',serif;color:#3E2723;margin-top:0;}
.gq-modal-label{display:block;font-size:13px;font-weight:700;color:#374151;margin:14px 0 6px;}
.gq-modal-input,.gq-modal-select,.gq-modal-textarea{width:100%;padding:10px 14px;border:1px solid #E0D0BC;border-radius:9px;font-size:13px;font-family:'Lato',sans-serif;color:#3E2723;background:#FDFAF6;outline:none;box-sizing:border-box;}
.gq-modal-input:focus,.gq-modal-select:focus,.gq-modal-textarea:focus{border-color:#B87333;box-shadow:0 0 0 3px rgba(184,115,51,0.1);}
.gq-modal-textarea{min-height:70px;resize:vertical;}
.gq-modal-actions{display:flex;gap:10px;margin-top:20px;}
.gq-modal-save{flex:1;padding:12px;background:linear-gradient(135deg,#B87333,#C9A44C);color:#fff;border:none;border-radius:9px;font-weight:700;font-size:13px;cursor:pointer;font-family:'Lato',sans-serif;}
.gq-modal-cancel{flex:1;padding:12px;background:#fff;border:1px solid #E0D0BC;border-radius:9px;color:#9E8272;font-weight:700;font-size:13px;cursor:pointer;font-family:'Lato',sans-serif;}
.gq-modal-success{background:#d1fae5;color:#065f46;padding:10px 14px;border-radius:9px;font-size:13px;margin-bottom:12px;}
.gq-loading{text-align:center;padding:60px;color:#9E8272;font-size:15px;}
.gq-no-shopid{text-align:center;padding:60px 20px;color:#E65100;}
`;

const GetAQuote = () => {
  const navigate  = useNavigate();
  const shopId    = getShopId();

  const [quotes,    setQuotes]    = useState([]);
  const [filter,    setFilter]    = useState("all");
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState(null);
  const [response,  setResponse]  = useState({ status: "approved", shopkeeperNote: "", quotedPrice: "" });
  const [saving,    setSaving]    = useState(false);
  const [modalMsg,  setModalMsg]  = useState("");

  // ── Fetch quotes ──────────────────────────────────────────────────────────
  const fetchQuotes = useCallback(async () => {
    if (!shopId) {
      setLoading(false);
      return;
    }
    try {
      const url = filter === "all"
        ? `${API}/quotes/shop/${shopId}`
        : `${API}/quotes/shop/${shopId}?status=${filter}`;
      const res = await axios.get(url);
      setQuotes(res.data.quotes || []);
    } catch (err) {
      console.error("fetchQuotes error:", err);
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  }, [shopId, filter]);

  useEffect(() => {
    setLoading(true);
    fetchQuotes();
  }, [fetchQuotes]);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(fetchQuotes, 15000);
    return () => clearInterval(interval);
  }, [fetchQuotes]);

  // ── All quotes for sidebar counts ────────────────────────────────────────
  const [allQuotes, setAllQuotes] = useState([]);
  useEffect(() => {
    if (!shopId) return;
    axios.get(`${API}/quotes/shop/${shopId}`)
      .then(res => setAllQuotes(res.data.quotes || []))
      .catch(() => {});
  }, [shopId, quotes]);

  const counts = {
    all:      allQuotes.length,
    pending:  allQuotes.filter(q => q.status === "pending").length,
    approved: allQuotes.filter(q => q.status === "approved").length,
    quoted:   allQuotes.filter(q => q.status === "quoted").length,
    rejected: allQuotes.filter(q => q.status === "rejected").length,
  };

  // ── Open modal ────────────────────────────────────────────────────────────
  const openModal = (quote) => {
    setSelected(quote);
    setModalMsg("");
    setResponse({
      status:         quote.status === "pending" ? "approved" : quote.status,
      shopkeeperNote: quote.shopkeeperNote || "",
      quotedPrice:    quote.quotedPrice    || "",
    });
  };

  // ── Save response ─────────────────────────────────────────────────────────
  const handleRespond = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/quotes/${selected._id}/respond`, response);
      setModalMsg("✅ Response saved! Customer has been notified.");
      fetchQuotes();
      setTimeout(() => setSelected(null), 1400);
    } catch (err) {
      setModalMsg("❌ " + (err.response?.data?.message || "Error saving response"));
    } finally {
      setSaving(false);
    }
  };

  // ── Delete quote ──────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this quote request?")) return;
    try {
      await axios.delete(`${API}/quotes/${id}`);
      fetchQuotes();
    } catch {
      alert("Delete failed");
    }
  };

  // ── ShopId nahi mila ──────────────────────────────────────────────────────
  if (!shopId) {
    return (
      <div className="gq-page">
        <style>{css}</style>
        <ShopkeeperSidebar active="get-a-quote" />
        <div className="gq-main">
          <div className="gq-topbar">
            <div>
              <h1 className="gq-topbar-title">Get a Quote</h1>
              <p className="gq-topbar-sub">Manage customer quote requests</p>
            </div>
            <button className="gq-back-btn" onClick={() => navigate("/shopkeeper/dashboard")}>← Dashboard</button>
          </div>
          <div className="gq-no-shopid">
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Session expired. Please login again.</div>
            <button
              onClick={() => navigate("/shopkeeper/login")}
              style={{ marginTop: 16, padding: "10px 24px", background: "#B87333", color: "#fff", border: "none", borderRadius: 9, fontWeight: 700, cursor: "pointer" }}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gq-page">
      <style>{css}</style>
      <ShopkeeperSidebar active="get-a-quote" />

      <div className="gq-main">
        {/* Topbar */}
        <div className="gq-topbar">
          <div>
            <h1 className="gq-topbar-title">Get a Quote</h1>
            <p className="gq-topbar-sub">Manage customer quote requests for your products</p>
          </div>
          <button className="gq-back-btn" onClick={() => navigate("/shopkeeper/dashboard")}>← Dashboard</button>
        </div>

        <div className="gq-body">
          {/* Left Panel */}
          <div className="gq-left">
            <div className="gq-avatar-wrap">
              <div className="gq-avatar">💬</div>
              <div className="gq-left-name">Quote Requests</div>
              <div className="gq-left-sub">Customer enquiries</div>
            </div>
            <div className="gq-divider" />

            {/* Stats */}
            <div className="gq-stat-cards">
              {[
                { label: "📨 Total Requests", val: counts.all,      desc: "all time"    },
                { label: "⏳ Pending",         val: counts.pending,  desc: "need reply"  },
                { label: "✅ Approved",        val: counts.approved, desc: "responded"   },
                { label: "💰 Quoted",          val: counts.quoted,   desc: "with price"  },
              ].map(s => (
                <div className="gq-stat-card" key={s.label}>
                  <div className="gq-stat-label">{s.label}</div>
                  <div className="gq-stat-val">{s.val}</div>
                  <div className="gq-stat-desc">{s.desc}</div>
                </div>
              ))}
            </div>
            <div className="gq-divider" />

            {/* Filters */}
            <div>
              <div className="gq-filter-label">🔍 Filter by Status</div>
              <div className="gq-filter-list">
                {[
                  { key: "all",      label: "All Requests" },
                  { key: "pending",  label: "Pending"      },
                  { key: "approved", label: "Approved"     },
                  { key: "quoted",   label: "Quoted"       },
                  { key: "rejected", label: "Rejected"     },
                ].map(f => (
                  <button
                    key={f.key}
                    className={`gq-filter-btn ${filter === f.key ? "active" : ""}`}
                    onClick={() => setFilter(f.key)}
                  >
                    {f.label}
                    <span className="gq-filter-count">{counts[f.key] ?? "—"}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="gq-left-deco">🏺 🪔 ⚱️ 🔔</div>
          </div>

          {/* Right — Quote List */}
          <div className="gq-right">
            <div className="gq-section">
              <div className="gq-section-head">
                <div className="gq-section-title">
                  💬 {filter === "all" ? "All Requests" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  {counts.pending > 0 && (
                    <span className="gq-new-badge">🔴 {counts.pending} new</span>
                  )}
                </div>
                <span className="gq-count-badge">{quotes.length} requests</span>
              </div>

              {loading ? (
                <div className="gq-loading">Loading quotes...</div>
              ) : quotes.length === 0 ? (
                <div className="gq-empty">
                  <div className="gq-empty-icon">📭</div>
                  <div className="gq-empty-text">No {filter} requests yet</div>
                </div>
              ) : (
                <div className="gq-list">
                  {quotes.map(q => {
                    const s = STATUS[q.status] || STATUS.pending;
                    const initials = q.customerName
                      .split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
                    const dateStr = new Date(q.createdAt).toLocaleDateString("en-IN");

                    return (
                      <div className="gq-card" key={q._id}>
                        <div className="gq-card-top">
                          <div className="gq-customer">
                            <div className="gq-initials">{initials}</div>
                            <div>
                              <div className="gq-cname">{q.customerName}</div>
                              <div className="gq-cphone">📞 {q.customerPhone}</div>
                              {q.customerEmail && (
                                <div className="gq-cphone">✉️ {q.customerEmail}</div>
                              )}
                            </div>
                          </div>
                          <span
                            className="gq-pill"
                            style={{ background: s.bg, color: s.color, borderColor: s.border }}
                          >
                            {s.label}
                          </span>
                        </div>

                        <div className="gq-product-row">
                          <div>
                            <div className="gq-product-label">Product Requested</div>
                            <div className="gq-product-name">🏺 {q.productName}</div>
                          </div>
                          <span className="gq-product-qty">Qty: {q.quantity}</span>
                        </div>

                        {q.description && (
                          <div className="gq-message">"{q.description}"</div>
                        )}

                        {q.shopkeeperNote && (
                          <div style={{ fontSize: 12, color: "#2E7D32", marginBottom: 8, background: "#E8F5E9", padding: "6px 10px", borderRadius: 7 }}>
                            💬 Your note: {q.shopkeeperNote}
                          </div>
                        )}

                        {q.quotedPrice && (
                          <div style={{ fontSize: 12, color: "#1565C0", marginBottom: 8, fontWeight: 700 }}>
                            💰 Quoted Price: ₹{q.quotedPrice}
                          </div>
                        )}

                        <div className="gq-footer">
                          <span className="gq-date">📅 {dateStr}</span>
                          <div className="gq-actions">
                            <button className="gq-btn-reply" onClick={() => openModal(q)}>
                              ✏️ Respond
                            </button>
                            <button className="gq-btn-close" onClick={() => handleDelete(q._id)}>
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Respond Modal ── */}
      {selected && (
        <div className="gq-modal-overlay" onClick={() => setSelected(null)}>
          <div className="gq-modal" onClick={e => e.stopPropagation()}>
            <h3>Respond to: {selected.productName}</h3>
            <p style={{ color: "#9E8272", fontSize: 13, marginTop: -8 }}>
              From: {selected.customerName} • {selected.customerEmail}
            </p>

            {modalMsg && (
              <div className="gq-modal-success">{modalMsg}</div>
            )}

            <label className="gq-modal-label">Status</label>
            <select
              className="gq-modal-select"
              value={response.status}
              onChange={e => setResponse({ ...response, status: e.target.value })}
            >
              <option value="approved">✅ Approved</option>
              <option value="rejected">❌ Rejected</option>
              <option value="quoted">💰 Quoted (with price)</option>
            </select>

            <label className="gq-modal-label">Note for Customer</label>
            <textarea
              className="gq-modal-textarea"
              placeholder="e.g. We can deliver within 3 days at ₹500 each..."
              value={response.shopkeeperNote}
              onChange={e => setResponse({ ...response, shopkeeperNote: e.target.value })}
            />

            {response.status === "quoted" && (
              <>
                <label className="gq-modal-label">Quoted Price (₹)</label>
                <input
                  className="gq-modal-input"
                  type="number"
                  placeholder="Enter price"
                  value={response.quotedPrice}
                  onChange={e => setResponse({ ...response, quotedPrice: e.target.value })}
                />
              </>
            )}

            <div className="gq-modal-actions">
              <button className="gq-modal-save" onClick={handleRespond} disabled={saving}>
                {saving ? "Saving..." : "Save Response"}
              </button>
              <button className="gq-modal-cancel" onClick={() => setSelected(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAQuote;