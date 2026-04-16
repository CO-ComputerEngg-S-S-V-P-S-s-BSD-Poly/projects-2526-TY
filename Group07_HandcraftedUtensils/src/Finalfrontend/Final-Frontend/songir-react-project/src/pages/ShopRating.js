import React, { useState, useEffect } from "react";
import { Star, Trash2, Image as ImageIcon } from "lucide-react";

const API = "http://localhost:5000/api";

const imgUrl = (p) => {
  if (!p) return null;
  return p.startsWith("http") ? p : `http://localhost:5000/${p}`;
};

const StarRow = ({ value, size = 16 }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[1, 2, 3, 4, 5].map(s => (
      <Star key={s} size={size}
        fill={s <= value ? "#C9A44C" : "none"}
        color={s <= value ? "#C9A44C" : "#DDD"} />
    ))}
  </div>
);

/* ═══════════════════════════════════════════
   SHOPKEEPER SHOP RATING PAGE
   Props: shopId (from logged-in shopkeeper session/localStorage)
═══════════════════════════════════════════ */
const ShopRating = ({ shopId }) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null); // id being deleted

  // Get shopId from localStorage if not passed as prop
  const sid = shopId || (() => {
    try {
      const s = JSON.parse(localStorage.getItem("shopkeeperSession") || "{}");
      return s.shopId || s._id || "";
    } catch { return ""; }
  })();

  const fetchReviews = async () => {
    if (!sid) return;
    try {
      setLoading(true);
      const res  = await fetch(`${API}/reviews/shop/${sid}`);
      const json = await res.json();
      setData(json);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, [sid]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    setDeleting(id);
    try {
      await fetch(`${API}/reviews/${id}`, { method: "DELETE" });
      fetchReviews();
    } finally { setDeleting(null); }
  };

  if (!sid) return (
    <div style={S.center}>
      <p style={{ color: "#c00" }}>Shop ID not found. Please log in again.</p>
    </div>
  );

  if (loading) return (
    <div style={S.center}>
      <div style={S.spinner} />
      <p style={{ color: "#B87333", marginTop: 12 }}>Loading reviews...</p>
    </div>
  );

  const reviews   = data?.reviews   || [];
  const avg       = data?.avg       || 0;
  const total     = data?.total     || 0;
  const breakdown = data?.breakdown || [];
  const happy     = reviews.filter(r => r.rating >= 4).length;

  return (
    <div style={S.page}>
      {/* Page header */}
      <div style={S.pageHeader}>
        <h1 style={S.pageTitle}>Shop Rating</h1>
        <p style={S.pageSub}>Customer reviews and ratings for your shop</p>
      </div>

      <div style={S.layout}>
        {/* ── LEFT sidebar: stats ── */}
        <div style={S.sidebar}>

          {/* Avg rating card */}
          <div style={S.card}>
            <div style={S.bigAvg}>{avg || "—"}</div>
            <StarRow value={Math.round(avg)} size={20} />
            <div style={{ fontSize: 12, color: "#999", marginTop: 6 }}>
              out of 5 · {total} reviews
            </div>
          </div>

          {/* Breakdown */}
          <div style={S.card}>
            <div style={S.cardLabel}>⭐ RATING BREAKDOWN</div>
            {breakdown.map(({ star, count }) => (
              <div key={star} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "#555", width: 10 }}>{star}</span>
                <div style={S.barTrack}>
                  <div style={{ ...S.barFill, width: total ? `${(count / total) * 100}%` : "0%" }} />
                </div>
                <span style={{ fontSize: 12, color: "#888", width: 16 }}>{count}</span>
              </div>
            ))}
          </div>

          {/* Happy customers */}
          <div style={S.card}>
            <div style={S.cardLabel}>😊 HAPPY CUSTOMERS</div>
            <div style={S.statNum}>{happy}</div>
            <div style={{ fontSize: 12, color: "#999" }}>4+ star reviews</div>
          </div>

          {/* Total reviews */}
          <div style={S.card}>
            <div style={S.cardLabel}>📋 TOTAL REVIEWS</div>
            <div style={S.statNum}>{total}</div>
            <div style={{ fontSize: 12, color: "#999" }}>all time</div>
          </div>
        </div>

        {/* ── RIGHT: review list ── */}
        <div style={S.reviewsCol}>
          {reviews.length === 0 ? (
            <div style={S.empty}>
              <Star size={48} color="#C9A44C" />
              <p style={{ color: "#999", marginTop: 12 }}>No reviews yet for your shop.</p>
            </div>
          ) : (
            reviews.map(r => (
              <div key={r._id} style={S.reviewCard}>
                {/* Top row: avatar + name + product tag + delete */}
                <div style={S.reviewTop}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={S.avatar}>
                      {r.customerName.split(" ").map(w => w[0]).join("").toUpperCase().substring(0, 2)}
                    </div>
                    <div>
                      <div style={S.reviewerName}>{r.customerName}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                        <StarRow value={r.rating} size={14} />
                        <span style={{ fontSize: 12, color: "#aaa" }}>
                          {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {/* Product name tag */}
                    <span style={S.productTag}>📦 {r.productName}</span>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(r._id)}
                      disabled={deleting === r._id}
                      style={S.deleteBtn}
                      title="Delete review"
                    >
                      <Trash2 size={15} />
                      {deleting === r._id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>

                {/* Review title */}
                {r.title && (
                  <div style={{ fontStyle: "italic", color: "#5D4037", fontWeight: 600, margin: "8px 0 4px", fontSize: 14 }}>
                    "{r.title}"
                  </div>
                )}

                {/* Body */}
                <p style={S.reviewBody}>{r.body}</p>

                {/* ── IMAGES (customer + review) ── */}
                {(r.customerImage || r.reviewImage) && (
                  <div style={S.imagesRow}>
                    {r.customerImage && (
                      <div style={S.imgBox}>
                        <img src={imgUrl(r.customerImage)} alt="Customer"
                          style={S.reviewImg}
                          onError={e => e.target.style.display = "none"} />
                        <span style={S.imgLabel}>Customer Photo</span>
                      </div>
                    )}
                    {r.reviewImage && (
                      <div style={S.imgBox}>
                        <img src={imgUrl(r.reviewImage)} alt="Product"
                          style={S.reviewImg}
                          onError={e => e.target.style.display = "none"} />
                        <span style={S.imgLabel}>Product Photo</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom: helpful count */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                  <span style={{ fontSize: 12, color: "#aaa" }}>
                    👍 {r.helpful || 0} people found this helpful
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopRating;

/* ══════════ STYLES ══════════ */
const S = {
  page: { padding: "0 0 3rem" },
  pageHeader: { marginBottom: 28 },
  pageTitle: { fontSize: "1.8rem", fontWeight: 700, color: "#2C1810", margin: "0 0 4px" },
  pageSub: { fontSize: 14, color: "#9E8E7E", margin: 0 },

  layout: { display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" },
  sidebar: { width: 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 },
  reviewsCol: { flex: 1, minWidth: 300 },

  card: {
    background: "white", borderRadius: 14, padding: "18px 20px",
    boxShadow: "0 2px 12px rgba(62,39,35,0.06)", border: "1px solid rgba(201,164,76,0.12)",
    textAlign: "center",
  },
  cardLabel: { fontSize: 11, fontWeight: 700, color: "#B87333", letterSpacing: "0.08em", marginBottom: 12, textAlign: "left" },
  bigAvg: { fontSize: "2.8rem", fontWeight: 700, color: "#C9A44C", fontFamily: "Georgia, serif" },
  statNum: { fontSize: "2.2rem", fontWeight: 700, color: "#2C1810", fontFamily: "Georgia, serif" },

  barTrack: { flex: 1, height: 7, background: "#F0EBE3", borderRadius: 4, overflow: "hidden" },
  barFill:  { height: "100%", background: "linear-gradient(90deg,#C9A44C,#B87333)", borderRadius: 4 },

  reviewCard: {
    background: "white", borderRadius: 14, padding: "20px 22px", marginBottom: 18,
    boxShadow: "0 2px 12px rgba(62,39,35,0.07)", border: "1px solid rgba(201,164,76,0.12)",
  },
  reviewTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 10 },
  avatar: {
    width: 40, height: 40, borderRadius: "50%",
    background: "linear-gradient(135deg,#B87333,#C9A44C)",
    color: "white", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 14, flexShrink: 0,
  },
  reviewerName: { fontWeight: 700, fontSize: 14, color: "#2C1810" },
  productTag: {
    background: "rgba(184,115,51,0.08)", color: "#B87333",
    padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
    border: "1px solid rgba(184,115,51,0.2)",
  },
  deleteBtn: {
    display: "flex", alignItems: "center", gap: 5,
    background: "#fff0f0", color: "#e53935",
    border: "1px solid #ffcdd2", borderRadius: 8,
    padding: "5px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer",
    transition: "all 0.2s",
  },
  reviewBody: { fontSize: 14, color: "#555", lineHeight: 1.7, margin: "6px 0 10px" },

  imagesRow: { display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 8 },
  imgBox: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  reviewImg: { width: 90, height: 90, objectFit: "cover", borderRadius: 8, border: "1px solid #E8D5C0" },
  imgLabel: { fontSize: 10, color: "#aaa", fontWeight: 500 },

  empty: { textAlign: "center", padding: "4rem 2rem", background: "white", borderRadius: 14, border: "2px dashed rgba(201,164,76,0.25)" },
  center: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 200 },
  spinner: { width: 40, height: 40, borderRadius: "50%", border: "3px solid #EDE5D8", borderTopColor: "#B87333", animation: "spin 0.85s linear infinite" },
};




