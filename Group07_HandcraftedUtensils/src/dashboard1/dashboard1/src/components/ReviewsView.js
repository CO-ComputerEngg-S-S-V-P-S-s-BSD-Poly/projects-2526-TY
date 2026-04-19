import React, { useState, useEffect } from 'react';
import { Search, Star, ThumbsUp, Camera } from 'lucide-react';

const API = "http://localhost:5000/api";

const imgUrl = (p) => {
  if (!p) return null;
  if (p.startsWith("http")) return p;
  return `http://localhost:5000/${p.replace(/\\/g, "/")}`;
};

const StarRow = ({ value, size = 15 }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[1,2,3,4,5].map(s => (
      <Star key={s} size={size}
        fill={s <= value ? "#C9A44C" : "none"}
        color={s <= value ? "#C9A44C" : "#DDD"} />
    ))}
  </div>
);

const ReviewsView = ({ searchTerm: extSearch, setSearchTerm: setExtSearch }) => {
  const [reviews,    setReviews]    = useState([]);
  const [products,   setProducts]   = useState({});
  const [loading,    setLoading]    = useState(true);
  const [localSearch, setLocalSearch] = useState("");
  const [filterShop, setFilterShop] = useState("All");
  const [filterStar, setFilterStar] = useState(0);
  const [viewMode,   setViewMode]   = useState("cards");

  const searchTerm    = extSearch    !== undefined ? extSearch    : localSearch;
  const setSearchTerm = setExtSearch !== undefined ? setExtSearch : setLocalSearch;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res  = await fetch(`${API}/reviews/admin/all`);
        const json = await res.json();
        const revList = json.reviews || [];
        setReviews(revList);

        // Fetch product images
        const uniqueIds = [...new Set(revList.map(r => r.productId).filter(Boolean))];
        const prodMap = {};
        await Promise.all(uniqueIds.map(async (pid) => {
          try {
            const pr   = await fetch(`${API}/products/${pid}`);
            const pj   = await pr.json();
            const prod = pj.product || pj;
            const img  = prod.image || prod.images?.[0] || prod.imageUrl || prod.thumbnail || "";
            prodMap[pid] = imgUrl(img);
          } catch { prodMap[pid] = null; }
        }));
        setProducts(prodMap);
      } catch(e) { console.error("Reviews fetch error:", e); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const shopNames = ["All", ...new Set(reviews.map(r => r.shopName).filter(Boolean))];

  const filtered = reviews.filter(r => {
    const q = (searchTerm || "").toLowerCase();
    const matchSearch = !q ||
      r.customerName?.toLowerCase().includes(q) ||
      r.productName?.toLowerCase().includes(q)  ||
      r.shopName?.toLowerCase().includes(q)     ||
      r.body?.toLowerCase().includes(q);
    const matchShop = filterShop === "All" || r.shopName === filterShop;
    const matchStar = filterStar === 0 || r.rating === filterStar;
    return matchSearch && matchShop && matchStar;
  });

  const total       = reviews.length;
  const avgRating   = total ? (reviews.reduce((s,r) => s + r.rating, 0) / total).toFixed(1) : "0.0";
  const uniqueShops = new Set(reviews.map(r => r.shopName).filter(Boolean)).size;
  const fiveStars   = reviews.filter(r => r.rating === 5).length;

  if (loading) return (
    <div className="view-content">
      <div style={{ textAlign:"center", padding:"3rem", color:"#B87333", fontSize:14 }}>
        Loading reviews...
      </div>
    </div>
  );

  return (
    <div className="view-content">

      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Customer Reviews</h1>
          <p className="page-subtitle">All product reviews from customers — Total: {total}</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={() => setViewMode("cards")}
            style={{ ...S.toggleBtn, ...(viewMode==="cards" ? S.toggleActive : {}) }}>
            🗂️ Cards
          </button>
          <button onClick={() => setViewMode("table")}
            style={{ ...S.toggleBtn, ...(viewMode==="table" ? S.toggleActive : {}) }}>
            📋 Table
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1rem", marginBottom:"1.5rem" }}>
        {[
          { icon:<Star size={20} color="#F59E0B" fill="#F59E0B"/>, label:"Average Rating", val:avgRating,   color:"#1F2937" },
          { icon:<ThumbsUp size={20} color="#10B981"/>,            label:"Total Reviews",  val:total,        color:"#1F2937" },
          { icon:<Star size={20} color="#C17A3F"/>,                label:"Shops Reviewed", val:uniqueShops,  color:"#C17A3F" },
          { icon:<Star size={20} color="#F59E0B" fill="#F59E0B"/>, label:"5-Star Reviews", val:fiveStars,    color:"#F59E0B" },
        ].map((s,i) => (
          <div key={i} style={S.statCard}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"0.5rem" }}>
              {s.icon}
              <span style={{ fontSize:"0.85rem", color:"#6B7280", fontWeight:500 }}>{s.label}</span>
            </div>
            <div style={{ fontSize:"1.75rem", fontWeight:700, color:s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div style={{ display:"flex", gap:10, marginBottom:"1.5rem", flexWrap:"wrap" }}>
        <div className="search-container" style={{ flex:1, minWidth:240, marginBottom:0 }}>
          <Search size={20} />
          <input type="text"
            placeholder="Search by user, product, shop, or comment..."
            className="search-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <select value={filterShop} onChange={e => setFilterShop(e.target.value)} style={S.select}>
          {shopNames.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filterStar} onChange={e => setFilterStar(Number(e.target.value))} style={S.select}>
          <option value={0}>All Stars</option>
          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star</option>)}
        </select>
      </div>

      <div style={{ marginBottom:16, fontSize:13, color:"#9CA3AF" }}>
        Showing {filtered.length} of {total} reviews
      </div>

      {/* ── CARDS VIEW ── */}
      {viewMode === "cards" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {filtered.length === 0 ? (
            <div style={S.emptyBox}>
              <Star size={40} color="#C9A44C" />
              <p style={{ color:"#9CA3AF", marginTop:10 }}>No reviews found.</p>
            </div>
          ) : filtered.map(r => {
            const prodImg  = products[r.productId] || null;
            const custImg  = imgUrl(r.customerImage);
            const revImg   = imgUrl(r.reviewImage);
            const initials = r.customerName?.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2) || "?";
            const date     = new Date(r.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});

            return (
              <div key={r._id} style={S.reviewCard}>

                {/* Product Banner */}
                <div style={S.productBanner}>
                  <div style={{ flexShrink:0 }}>
                    {prodImg
                      ? <img src={prodImg} alt={r.productName} style={S.prodImg} onError={e=>e.target.style.display="none"} />
                      : <div style={S.prodFallback}>🏺</div>
                    }
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={S.prodLabel}>PRODUCT REVIEWED</div>
                    <div style={S.prodName}>{r.productName}</div>
                    <div style={{ fontSize:12, color:"#9E8272", marginTop:2 }}>🏪 {r.shopName || "—"}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:6 }}>
                      <StarRow value={r.rating} size={14} />
                      <span style={{ fontSize:13, fontWeight:700, color:"#B87333" }}>{r.rating}/5</span>
                    </div>
                  </div>
                  {/* View only badge — no delete */}
                  <div style={S.viewBadge}>👁️ View Only</div>
                </div>

                {/* Review Body */}
                <div style={{ padding:"16px 18px", display:"flex", flexDirection:"column", gap:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={S.avatar}>{initials}</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:"#2C1810" }}>{r.customerName}</div>
                      <div style={{ fontSize:11, color:"#C4AE98", fontWeight:600, marginTop:2 }}>📅 {date}</div>
                    </div>
                  </div>

                  {r.title && (
                    <div style={{ fontSize:14, fontStyle:"italic", fontWeight:700, color:"#5D4037" }}>
                      "{r.title}"
                    </div>
                  )}

                  <p style={S.reviewText}>{r.body}</p>

                  {(custImg || revImg) && (
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#B87333", fontWeight:700, marginBottom:8 }}>
                        <Camera size={13} color="#B87333" /> Photos
                      </div>
                      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                        {custImg && (
                          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                            <img src={custImg} alt="Customer" style={S.photo} onError={e=>e.target.style.display="none"} />
                            <span style={S.imgLabel}>Customer</span>
                          </div>
                        )}
                        {revImg && (
                          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                            <img src={revImg} alt="Review" style={S.photo} onError={e=>e.target.style.display="none"} />
                            <span style={S.imgLabel}>Review Photo</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div style={S.cardFooter}>
                  <ThumbsUp size={13} color="#aaa" />
                  <span style={{ fontSize:12, color:"#aaa" }}>{r.helpful || 0} helpful</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TABLE VIEW ── */}
      {viewMode === "table" && (
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
                {filtered.length > 0 ? filtered.map((r, idx) => {
                  const initials = r.customerName?.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) || "?";
                  const date     = new Date(r.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
                  const custImg  = imgUrl(r.customerImage);
                  const revImg   = imgUrl(r.reviewImage);
                  const prodImg  = products[r.productId] || null;

                  return (
                    <tr key={r._id || idx} className="order-row" style={{ cursor:"default" }}>
                      <td>
                        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                          <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#C17A3F,#A85C28)", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:600, fontSize:"0.9rem", flexShrink:0 }}>
                            {initials}
                          </div>
                          <span style={{ fontWeight:500 }}>{r.customerName}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          {prodImg && <img src={prodImg} alt="" style={{ width:36, height:36, objectFit:"cover", borderRadius:6, border:"1px solid #EED9BE" }} onError={e=>e.target.style.display="none"} />}
                          <div>
                            <div style={{ fontWeight:500, color:"#1F2937" }}>{r.productName}</div>
                            <div style={{ fontSize:"0.8rem", color:"#6B7280" }}>🏪 {r.shopName || "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                          <StarRow value={r.rating} size={14} />
                          <span style={{ fontWeight:600, color:"#C17A3F", marginLeft:4 }}>{r.rating}/5</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ maxWidth:260, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", color:"#4B5563" }}>
                          {r.body}
                        </div>
                      </td>
                      <td>
                        <div style={{ display:"flex", gap:6 }}>
                          {custImg && <img src={custImg} alt="customer" style={{ width:40, height:40, objectFit:"cover", borderRadius:6, border:"1px solid #E5E7EB" }} onError={e=>e.target.style.display="none"} />}
                          {revImg  && <img src={revImg}  alt="review"   style={{ width:40, height:40, objectFit:"cover", borderRadius:6, border:"1px solid #E5E7EB" }} onError={e=>e.target.style.display="none"} />}
                          {!custImg && !revImg && <span style={{ fontSize:12, color:"#9CA3AF" }}>—</span>}
                        </div>
                      </td>
                      <td style={{ fontSize:13, color:"#6B7280" }}>📅 {date}</td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign:"center", padding:"1.5rem", color:"#9CA3AF" }}>
                      No reviews found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Styles ── */
const S = {
  statCard: { background:"white", padding:"1.25rem", borderRadius:"12px", border:"2px solid rgba(193,122,63,0.1)", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" },
  select: { padding:"0 14px", border:"1px solid #E5E7EB", borderRadius:8, fontSize:14, background:"white", cursor:"pointer", color:"#374151", outline:"none", minWidth:140, height:44 },
  toggleBtn: { padding:"8px 16px", borderRadius:8, border:"1.5px solid #EED9BE", background:"#fff", color:"#9E8272", fontSize:13, fontWeight:600, cursor:"pointer" },
  toggleActive: { background:"linear-gradient(135deg,#B87333,#C9A44C)", borderColor:"#B87333", color:"#fff" },
  reviewCard: { background:"white", borderRadius:16, overflow:"hidden", boxShadow:"0 4px 20px rgba(62,39,35,0.08)", border:"1px solid rgba(201,164,76,0.15)" },
  productBanner: { display:"flex", alignItems:"center", gap:14, background:"linear-gradient(135deg,#FFF8F0,#FFF0DC)", padding:"14px 18px", borderBottom:"1px solid #EED9BE" },
  prodImg: { width:72, height:72, objectFit:"cover", borderRadius:12, border:"2px solid #EED9BE", boxShadow:"0 2px 8px rgba(184,115,51,0.2)" },
  prodFallback: { width:72, height:72, borderRadius:12, border:"2px solid #EED9BE", background:"linear-gradient(135deg,#F5E6D0,#EDD9B8)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32 },
  prodLabel: { fontSize:9, fontWeight:700, color:"#B87333", letterSpacing:"0.1em", marginBottom:3 },
  prodName: { fontSize:15, fontWeight:700, color:"#3E2723", lineHeight:1.3 },
  viewBadge: { background:"rgba(107,114,128,0.08)", color:"#6B7280", padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:600, border:"1px solid rgba(107,114,128,0.2)", whiteSpace:"nowrap" },
  avatar: { width:42, height:42, borderRadius:"50%", background:"linear-gradient(135deg,#B87333,#C9A44C)", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14, flexShrink:0 },
  reviewText: { fontSize:14, color:"#555", lineHeight:1.75, margin:0, background:"#FDFAF6", borderLeft:"3px solid rgba(184,115,51,0.35)", padding:"10px 14px", borderRadius:"0 10px 10px 0" },
  photo: { width:88, height:88, objectFit:"cover", borderRadius:10, border:"1.5px solid #EED9BE", boxShadow:"0 2px 6px rgba(0,0,0,0.08)" },
  imgLabel: { fontSize:10, color:"#aaa", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" },
  cardFooter: { padding:"10px 18px", borderTop:"1px solid #F5EDE0", background:"#FDFAF6", display:"flex", alignItems:"center", gap:6 },
  emptyBox: { textAlign:"center", padding:"4rem 2rem", background:"white", borderRadius:16, border:"2px dashed rgba(201,164,76,0.25)" },
};

export default ReviewsView;