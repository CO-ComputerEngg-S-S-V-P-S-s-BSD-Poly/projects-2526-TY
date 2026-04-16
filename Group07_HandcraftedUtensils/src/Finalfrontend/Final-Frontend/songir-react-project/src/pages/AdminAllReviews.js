// import React, { useState, useEffect } from "react";
// import { Star, Search } from "lucide-react";

// const API = "http://localhost:5000/api";

// const imgUrl = (p) => {
//   if (!p) return null;
//   return p.startsWith("http") ? p : `http://localhost:5000/${p}`;
// };

// const StarRow = ({ value, size = 14 }) => (
//   <div style={{ display: "flex", gap: 2 }}>
//     {[1,2,3,4,5].map(s => (
//       <Star key={s} size={size}
//         fill={s <= value ? "#C9A44C" : "none"}
//         color={s <= value ? "#C9A44C" : "#DDD"} />
//     ))}
//   </div>
// );

// /* ═══════════════════════════════════════════
//    ADMIN ALL REVIEWS PAGE
//    No actions — just view all reviews from all shops
// ═══════════════════════════════════════════ */
// const AdminAllReviews = () => {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search,  setSearch]  = useState("");
//   const [filterShop, setFilterShop] = useState("All");

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const res  = await fetch(`${API}/reviews/admin/all`);
//         const json = await res.json();
//         setReviews(json.reviews || []);
//       } catch (e) { console.error(e); }
//       finally { setLoading(false); }
//     };
//     fetchAll();
//   }, []);

//   // Unique shop names for filter
//   const shopNames = ["All", ...new Set(reviews.map(r => r.shopName).filter(Boolean))];

//   const filtered = reviews.filter(r => {
//     const matchShop   = filterShop === "All" || r.shopName === filterShop;
//     const matchSearch = !search ||
//       r.customerName?.toLowerCase().includes(search.toLowerCase()) ||
//       r.productName?.toLowerCase().includes(search.toLowerCase()) ||
//       r.shopName?.toLowerCase().includes(search.toLowerCase()) ||
//       r.body?.toLowerCase().includes(search.toLowerCase());
//     return matchShop && matchSearch;
//   });

//   // Stats
//   const totalReviews = reviews.length;
//   const avgRating    = reviews.length
//     ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
//     : "—";
//   const uniqueShops  = new Set(reviews.map(r => r.shopName)).size;

//   if (loading) return (
//     <div style={{ textAlign: "center", padding: 60, color: "#B87333" }}>
//       Loading all reviews...
//     </div>
//   );

//   return (
//     <div style={S.page}>
//       <div style={S.header}>
//         <h1 style={S.title}>All Reviews</h1>
//         <p style={S.sub}>Reviews from all shops across the platform</p>
//       </div>

//       {/* ── Quick stats ── */}
//       <div style={S.statsRow}>
//         {[
//           { label: "Total Reviews", value: totalReviews, icon: "📋" },
//           { label: "Avg Rating",    value: avgRating,    icon: "⭐" },
//           { label: "Shops Reviewed",value: uniqueShops,  icon: "🏪" },
//         ].map(({ label, value, icon }) => (
//           <div key={label} style={S.statCard}>
//             <div style={S.statIcon}>{icon}</div>
//             <div style={S.statVal}>{value}</div>
//             <div style={S.statLabel}>{label}</div>
//           </div>
//         ))}
//       </div>

//       {/* ── Filters ── */}
//       <div style={S.filterBar}>
//         {/* Search */}
//         <div style={S.searchWrap}>
//           <Search size={16} color="#B87333" />
//           <input
//             placeholder="Search by customer, product, shop..."
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             style={S.searchInput}
//           />
//         </div>

//         {/* Shop filter */}
//         <select value={filterShop} onChange={e => setFilterShop(e.target.value)} style={S.select}>
//           {shopNames.map(s => <option key={s}>{s}</option>)}
//         </select>
//       </div>

//       <div style={{ fontSize: 13, color: "#999", marginBottom: 20 }}>
//         Showing <b style={{ color: "#B87333" }}>{filtered.length}</b> of {totalReviews} reviews
//       </div>

//       {/* ── Review list ── */}
//       {filtered.length === 0 ? (
//         <div style={S.empty}>No reviews found.</div>
//       ) : (
//         filtered.map(r => (
//           <div key={r._id} style={S.reviewCard}>
//             {/* Header: avatar + name + shop tag */}
//             <div style={S.cardTop}>
//               <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                 <div style={S.avatar}>
//                   {r.customerName?.split(" ").map(w=>w[0]).join("").toUpperCase().substring(0,2) || "?"}
//                 </div>
//                 <div>
//                   <div style={S.reviewerName}>{r.customerName}</div>
//                   <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3, flexWrap: "wrap" }}>
//                     <StarRow value={r.rating} />
//                     <span style={{ fontSize: 12, color: "#aaa" }}>
//                       {new Date(r.createdAt).toLocaleDateString("en-IN", {
//                         day: "2-digit", month: "short", year: "numeric"
//                       })}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Tags: shop name + product name */}
//               <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//                 <span style={S.shopTag}>🏪 {r.shopName}</span>
//                 <span style={S.productTag}>📦 {r.productName}</span>
//               </div>
//             </div>

//             {/* Review content */}
//             {r.title && (
//               <div style={{ fontStyle: "italic", color: "#5D4037", fontWeight: 600, fontSize: 14, margin: "8px 0 4px" }}>
//                 "{r.title}"
//               </div>
//             )}
//             <p style={S.reviewBody}>{r.body}</p>

//             {/* Images if any */}
//             {(r.customerImage || r.reviewImage) && (
//               <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
//                 {[r.customerImage, r.reviewImage].map((img, i) =>
//                   img ? (
//                     <img key={i} src={imgUrl(img)} alt="review"
//                       style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #E8D5C0" }}
//                       onError={e => e.target.style.display = "none"} />
//                   ) : null
//                 )}
//               </div>
//             )}

//             {/* Footer */}
//             <div style={S.cardFooter}>
//               <span style={{ fontSize: 12, color: "#aaa" }}>👍 {r.helpful || 0} helpful</span>
//               <span style={S.verifiedBadge}>Verified Buyer</span>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default AdminAllReviews;

// /* ══════════ STYLES ══════════ */
// const S = {
//   page: { padding: "0 0 3rem", maxWidth: 960 },
//   header: { marginBottom: 28 },
//   title: { fontSize: "1.8rem", fontWeight: 700, color: "#2C1810", margin: "0 0 4px" },
//   sub: { fontSize: 14, color: "#9E8E7E", margin: 0 },

//   statsRow: { display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" },
//   statCard: {
//     background: "white", borderRadius: 14, padding: "18px 24px",
//     boxShadow: "0 2px 12px rgba(62,39,35,0.06)", border: "1px solid rgba(201,164,76,0.12)",
//     display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 130, flex: 1,
//   },
//   statIcon: { fontSize: 22 },
//   statVal: { fontSize: "2rem", fontWeight: 700, color: "#B87333", fontFamily: "Georgia, serif" },
//   statLabel: { fontSize: 11, color: "#9E8E7E", textTransform: "uppercase", letterSpacing: "0.06em" },

//   filterBar: {
//     display: "flex", gap: 14, alignItems: "center", background: "white",
//     padding: "14px 18px", borderRadius: 14, marginBottom: 16,
//     boxShadow: "0 2px 12px rgba(62,39,35,0.06)", border: "1px solid rgba(201,164,76,0.1)",
//     flexWrap: "wrap",
//   },
//   searchWrap: {
//     flex: 1, minWidth: 220, display: "flex", alignItems: "center", gap: 8,
//     background: "#FAF7F2", borderRadius: 10, padding: "8px 12px",
//   },
//   searchInput: { flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 14, color: "#3E2723" },
//   select: {
//     padding: "8px 14px", border: "1.5px solid #E2D8CC", borderRadius: 10,
//     fontSize: 13, background: "white", cursor: "pointer", color: "#5D4037", outline: "none",
//   },

//   reviewCard: {
//     background: "white", borderRadius: 14, padding: "20px 22px", marginBottom: 16,
//     boxShadow: "0 2px 12px rgba(62,39,35,0.07)", border: "1px solid rgba(201,164,76,0.12)",
//   },
//   cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 10 },
//   avatar: {
//     width: 40, height: 40, borderRadius: "50%",
//     background: "linear-gradient(135deg,#B87333,#C9A44C)",
//     color: "white", display: "flex", alignItems: "center", justifyContent: "center",
//     fontWeight: 700, fontSize: 14, flexShrink: 0,
//   },
//   reviewerName: { fontWeight: 700, fontSize: 14, color: "#2C1810" },
//   shopTag: {
//     background: "rgba(62,39,35,0.06)", color: "#5D4037",
//     padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
//     border: "1px solid rgba(62,39,35,0.12)",
//   },
//   productTag: {
//     background: "rgba(184,115,51,0.08)", color: "#B87333",
//     padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
//     border: "1px solid rgba(184,115,51,0.2)",
//   },
//   reviewBody: { fontSize: 14, color: "#555", lineHeight: 1.7, margin: "6px 0 8px" },
//   cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
//   verifiedBadge: {
//     background: "rgba(62,39,35,0.05)", color: "#7D6E63",
//     padding: "3px 10px", borderRadius: 12, fontSize: 11, border: "1px solid #E8DDD0",
//   },
//   empty: { textAlign: "center", padding: "4rem", background: "white", borderRadius: 14, color: "#999", border: "2px dashed rgba(201,164,76,0.25)" },
// };








import React, { useState, useEffect } from 'react';
import { Search, Star, ThumbsUp } from 'lucide-react';

const API = "http://localhost:5000/api";

const imgUrl = (p) => {
  if (!p) return null;
  if (p.startsWith("http")) return p;
  return `http://localhost:5000/${p.replace(/\\/g, "/")}`;
};

/* ═══════════════════════════════════════════════════
   ReviewsView — drop-in replacement for your existing
   AdminAllReviews / ReviewsView component.
   ✅ No props needed — fetches real data from API
   ✅ Removes all hardcoded dummy data
   ✅ Keeps exact same UI as Image 1
═══════════════════════════════════════════════════ */
const ReviewsView = ({ searchTerm: externalSearch, setSearchTerm: setExternalSearch }) => {
  const [reviews,    setReviews]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [localSearch, setLocalSearch] = useState("");
  const [filterShop, setFilterShop] = useState("All");

  // Use external searchTerm if passed as prop (for compatibility), else local
  const searchTerm    = externalSearch    !== undefined ? externalSearch    : localSearch;
  const setSearchTerm = setExternalSearch !== undefined ? setExternalSearch : setLocalSearch;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res  = await fetch(`${API}/reviews/admin/all`);
        const json = await res.json();
        setReviews(json.reviews || []);
      } catch(e) { console.error("Admin reviews fetch error:", e); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  // ── Shop filter options ──
  const shopNames = ["All", ...new Set(reviews.map(r => r.shopName).filter(Boolean))];

  // ── Filter by search + shop ──
  const filteredReviews = reviews.filter(review => {
    const q = (searchTerm || "").toLowerCase();
    const matchSearch = !q ||
      review.customerName?.toLowerCase().includes(q) ||
      review.productName?.toLowerCase().includes(q)  ||
      review.shopName?.toLowerCase().includes(q)     ||
      review.body?.toLowerCase().includes(q);
    const matchShop = filterShop === "All" || review.shopName === filterShop;
    return matchSearch && matchShop;
  });

  // ── Stats ──
  const totalReviews = reviews.length;
  const avgRating    = totalReviews
    ? (reviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";
  const uniqueShops  = new Set(reviews.map(r => r.shopName).filter(Boolean)).size;

  if (loading) return (
    <div className="view-content">
      <div style={{ textAlign:"center", padding:"3rem", color:"#B87333", fontSize:14 }}>
        Loading reviews...
      </div>
    </div>
  );

  return (
    <div className="view-content">
      {/* ── Page header ── */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Customer Reviews</h1>
          <p className="page-subtitle">
            All product reviews from customers - Total: {totalReviews}
          </p>
        </div>
      </div>

      {/* ── Stats Cards (same 4-col layout as Image 1) ── */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(4, 1fr)",
        gap:"1rem",
        marginBottom:"1.5rem",
      }}>
        {/* Average Rating */}
        <div style={statCardStyle}>
          <div style={statIconRow}>
            <Star size={20} color="#F59E0B" fill="#F59E0B" />
            <span style={statLabel}>Average Rating</span>
          </div>
          <div style={statValue}>{avgRating}</div>
        </div>

        {/* Total Reviews */}
        <div style={statCardStyle}>
          <div style={statIconRow}>
            <ThumbsUp size={20} color="#10B981" />
            <span style={statLabel}>Total Reviews</span>
          </div>
          <div style={statValue}>{totalReviews}</div>
        </div>

        {/* Shops Reviewed */}
        <div style={statCardStyle}>
          <div style={statIconRow}>
            <Star size={20} color="#C17A3F" />
            <span style={statLabel}>Shops Reviewed</span>
          </div>
          <div style={statValue}>{uniqueShops}</div>
        </div>

        {/* 5-Star Reviews */}
        <div style={statCardStyle}>
          <div style={statIconRow}>
            <Star size={20} color="#F59E0B" fill="#F59E0B" />
            <span style={statLabel}>5-Star Reviews</span>
          </div>
          <div style={{ ...statValue, color:"#F59E0B" }}>
            {reviews.filter(r => r.rating === 5).length}
          </div>
        </div>
      </div>

      {/* ── Search + Shop filter ── */}
      <div style={{ display:"flex", gap:12, marginBottom:"1.5rem", flexWrap:"wrap" }}>
        <div className="search-container" style={{ flex:1, minWidth:240, marginBottom:0 }}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by user, product, shop, or comment..."
            className="search-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={filterShop}
          onChange={e => setFilterShop(e.target.value)}
          style={{
            padding:"0 14px",
            border:"1px solid #E5E7EB",
            borderRadius:8,
            fontSize:14,
            background:"white",
            cursor:"pointer",
            color:"#374151",
            outline:"none",
            minWidth:160,
          }}
        >
          {shopNames.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* ── Table ── */}
      <div className="orders-card">
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Product & Shop</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Photos</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review, idx) => {
                  const initials = review.customerName
                    ?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";
                  const date = new Date(review.createdAt).toLocaleDateString("en-IN", {
                    day:"2-digit", month:"short", year:"numeric",
                  });
                  const custImg = imgUrl(review.customerImage);
                  const revImg  = imgUrl(review.reviewImage);

                  return (
                    <tr key={review._id || idx} className="order-row" style={{ cursor:"default" }}>
                      {/* User */}
                      <td>
                        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                          <div style={{
                            width:40, height:40, borderRadius:"50%",
                            background:"linear-gradient(135deg,#C17A3F 0%,#A85C28 100%)",
                            color:"white", display:"flex", alignItems:"center",
                            justifyContent:"center", fontWeight:"600", fontSize:"0.9rem",
                            flexShrink:0,
                          }}>
                            {initials}
                          </div>
                          <span style={{ fontWeight:"500" }}>{review.customerName}</span>
                        </div>
                      </td>

                      {/* Product & Shop */}
                      <td>
                        <div style={{ fontWeight:"500", color:"#1F2937" }}>{review.productName}</div>
                        <div style={{ fontSize:"0.8rem", color:"#6B7280", marginTop:2 }}>
                          🏪 {review.shopName || "—"}
                        </div>
                      </td>

                      {/* Rating */}
                      <td>
                        <div style={{ display:"flex", alignItems:"center", gap:"0.25rem" }}>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16}
                              fill={i < review.rating ? "#F59E0B" : "none"}
                              color={i < review.rating ? "#F59E0B" : "#D1D5DB"} />
                          ))}
                          <span style={{ marginLeft:"0.5rem", fontWeight:"600", color:"#C17A3F" }}>
                            {review.rating}/5
                          </span>
                        </div>
                      </td>

                      {/* Comment */}
                      <td>
                        <div style={{
                          maxWidth:300, whiteSpace:"nowrap",
                          overflow:"hidden", textOverflow:"ellipsis", color:"#4B5563",
                        }}>
                          {review.body}
                        </div>
                      </td>

                      {/* Photos */}
                      <td>
                        <div style={{ display:"flex", gap:6 }}>
                          {custImg && (
                            <img
                              src={custImg}
                              alt="customer"
                              style={{ width:42, height:42, objectFit:"cover", borderRadius:7, border:"1px solid #E5E7EB" }}
                              onError={e => e.target.style.display = "none"}
                            />
                          )}
                          {revImg && (
                            <img
                              src={revImg}
                              alt="product"
                              style={{ width:42, height:42, objectFit:"cover", borderRadius:7, border:"1px solid #E5E7EB" }}
                              onError={e => e.target.style.display = "none"}
                            />
                          )}
                          {!custImg && !revImg && (
                            <span style={{ fontSize:12, color:"#9CA3AF" }}>—</span>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td style={{ fontSize:13, color:"#6B7280" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"0.4rem" }}>
                          📅 {date}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign:"center", padding:"1.5rem", color:"#9CA3AF" }}>
                    {totalReviews === 0 ? "No reviews yet." : "No reviews found for this search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ── Shared inline styles ──
const statCardStyle = {
  background:"white", padding:"1.25rem", borderRadius:"12px",
  border:"2px solid rgba(193,122,63,0.1)", boxShadow:"0 2px 8px rgba(0,0,0,0.05)",
};
const statIconRow = {
  display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"0.5rem",
};
const statLabel = { fontSize:"0.85rem", color:"#6B7280", fontWeight:"500" };
const statValue = { fontSize:"1.75rem", fontWeight:"700", color:"#1F2937" };

export default ReviewsView;