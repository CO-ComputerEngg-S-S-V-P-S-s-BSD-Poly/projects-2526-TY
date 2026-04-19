import React, { useState, useEffect, useRef } from "react";
import { Star, ThumbsUp, X, Upload } from "lucide-react";

const API = "http://localhost:5000/api";

/* ── helpers ── */
const imgUrl = (p) => {
  if (!p) return null;
  return p.startsWith("http") ? p : `http://localhost:5000/${p}`;
};

const StarRow = ({ value, onChange, size = 28 }) => (
  <div style={{ display: "flex", gap: 4 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        fill={s <= value ? "#C9A44C" : "none"}
        color={s <= value ? "#C9A44C" : "#CCC"}
        style={{ cursor: onChange ? "pointer" : "default" }}
        onClick={() => onChange && onChange(s)}
      />
    ))}
  </div>
);

/* ═══════════════════════════════════════════
   WRITE REVIEW MODAL
═══════════════════════════════════════════ */
const WriteReviewModal = ({ productId, onClose, onSubmitted }) => {
  const [form, setForm] = useState({
    customerName: "", customerEmail: "", rating: 0,
    title: "", body: "", recommended: false,
  });
  const [customerImageFile, setCustomerImageFile] = useState(null);
  const [reviewImageFile,   setReviewImageFile]   = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.customerName || !form.customerEmail || !form.rating || !form.body) {
      setError("Please fill all required fields and select a rating.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("productId", productId);
      if (customerImageFile) fd.append("customerImage", customerImageFile);
      if (reviewImageFile)   fd.append("reviewImage",   reviewImageFile);

      const res  = await fetch(`${API}/reviews`, { method: "POST", body: fd });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      onSubmitted();
      onClose();
    } catch (e) {
      setError(e.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={S.overlay}>
      <div style={S.modal}>
        {/* Header */}
        <div style={S.modalHeader}>
          <span style={S.modalTitle}>Write a review</span>
          <button onClick={onClose} style={S.closeBtn}><X size={20} /></button>
        </div>

        <div style={S.modalBody}>
          {error && <div style={S.errorBox}>{error}</div>}

          <Label>Name *</Label>
          <input style={S.input} placeholder="Enter Your Name"
            value={form.customerName} onChange={e => set("customerName", e.target.value)} />

          <Label>Email *</Label>
          <input style={S.input} placeholder="Enter Your Email" type="email"
            value={form.customerEmail} onChange={e => set("customerEmail", e.target.value)} />

          <Label>Rating *</Label>
          <StarRow value={form.rating} onChange={v => set("rating", v)} />

          <Label style={{ marginTop: 14 }}>Review Title</Label>
          <input style={S.input} placeholder="Give your review a title"
            value={form.title} onChange={e => set("title", e.target.value)} />

          <Label>Body of Review *</Label>
          <textarea style={S.textarea} placeholder="Write your comments here"
            value={form.body} onChange={e => set("body", e.target.value)} rows={4} />

          {/* Images */}
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <Label>Customer Image</Label>
              <FileBtn
                file={customerImageFile}
                onChange={f => setCustomerImageFile(f)}
                label="Browse"
              />
            </div>
            <div style={{ flex: 1 }}>
              <Label>Review Image</Label>
              <FileBtn
                file={reviewImageFile}
                onChange={f => setReviewImageFile(f)}
                label="Browse"
              />
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#555", marginBottom: 20 }}>
            <input type="checkbox" checked={form.recommended}
              onChange={e => set("recommended", e.target.checked)} />
            Would you recommend this product?
          </label>

          <button onClick={handleSubmit} disabled={submitting} style={S.submitBtn}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

const FileBtn = ({ file, onChange, label }) => {
  const ref = useRef();
  return (
    <div>
      <button onClick={() => ref.current.click()} style={S.fileBtn}>
        <Upload size={14} /> {file ? file.name.substring(0, 16) + "..." : label}
      </button>
      <input type="file" accept="image/*" ref={ref} style={{ display: "none" }}
        onChange={e => onChange(e.target.files[0])} />
    </div>
  );
};

const Label = ({ children, style }) => (
  <div style={{ fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6, marginTop: 12, ...style }}>
    {children}
  </div>
);

/* ═══════════════════════════════════════════
   SINGLE REVIEW CARD
═══════════════════════════════════════════ */
const ReviewCard = ({ review, onHelpful }) => {
  const initials = review.customerName
    ? review.customerName.split(" ").map(w => w[0]).join("").toUpperCase().substring(0, 2)
    : "?";

  const date = new Date(review.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <div style={S.reviewCard}>
      <div style={S.reviewTop}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={S.avatar}>{initials}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#2C1810" }}>
              {review.customerName}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <StarRow value={review.rating} size={15} />
              <span style={{ fontSize: 12, color: "#999" }}>📍 {review.customerLocation || "India"}</span>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#aaa" }}>{date}</div>
      </div>

      {review.title && (
        <div style={{ fontStyle: "italic", color: "#5D4037", fontWeight: 600, margin: "10px 0 4px" }}>
          "{review.title}"
        </div>
      )}
      <div style={{ fontSize: 14, color: "#555", lineHeight: 1.7, marginBottom: 12 }}>
        {review.body}
      </div>

      {/* Images */}
      {(review.customerImage || review.reviewImage) && (
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          {[review.customerImage, review.reviewImage].map((img, i) =>
            img ? (
              <img key={i} src={imgUrl(img)} alt="review"
                style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 8, border: "1px solid #E8D5C0" }} />
            ) : null
          )}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => onHelpful(review._id)} style={S.helpfulBtn}>
          <ThumbsUp size={14} /> Yes ({review.helpful || 0})
        </button>
        <span style={S.verifiedBadge}>Verified Buyer</span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN EXPORT: ProductReviews
   Usage: <ProductReviews productId={product._id} />
═══════════════════════════════════════════ */
const ProductReviews = ({ productId }) => {
  const [data,       setData]       = useState(null); // { reviews, avg, total, breakdown }
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [showAll,    setShowAll]    = useState(false);

  const fetchReviews = async () => {
    if (!productId) return;
    try {
      setLoading(true);
      const res  = await fetch(`${API}/reviews/product/${productId}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [productId]);

  const handleHelpful = async (id) => {
    await fetch(`${API}/reviews/${id}/helpful`, { method: "PUT" });
    fetchReviews();
  };

  if (loading) return <div style={{ textAlign: "center", padding: 40, color: "#B87333" }}>Loading reviews...</div>;

  const reviews  = data?.reviews || [];
  const avg      = data?.avg     || 0;
  const total    = data?.total   || 0;
  const breakdown= data?.breakdown || [];
  const visible  = showAll ? reviews : reviews.slice(0, 3);

  return (
    <div style={S.wrapper}>
      {/* ── Section title ── */}
      <div style={S.sectionHead}>
        <h2 style={S.sectionTitle}>Customer Reviews</h2>
        <p style={S.sectionSub}>Real stories from real customers — with verified purchases and real photos</p>
        <div style={S.titleLine} />
      </div>

      {/* ── Rating summary card ── */}
      <div style={S.summaryCard}>
        <div style={S.summaryLeft}>
          <div style={S.bigRating}>{avg || "—"}</div>
          <StarRow value={Math.round(avg)} size={22} />
          <div style={{ fontSize: 12, color: "#999", marginTop: 6 }}>Based on {total} reviews</div>
          {total > 0 && (
            <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
              📸 {reviews.filter(r => r.reviewImage || r.customerImage).length} reviews with photos
            </div>
          )}
        </div>

        <div style={S.summaryBars}>
          {breakdown.map(({ star, count }) => (
            <div key={star} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: "#555", width: 8 }}>{star}</span>
              <Star size={13} fill="#C9A44C" color="#C9A44C" />
              <div style={S.barTrack}>
                <div style={{ ...S.barFill, width: total ? `${(count / total) * 100}%` : "0%" }} />
              </div>
              <span style={{ fontSize: 13, color: "#555", width: 16 }}>{count}</span>
            </div>
          ))}
        </div>

        <button onClick={() => setShowModal(true)} style={S.writeBtn}>
          ✍️ Write A Review
        </button>
      </div>

      {/* ── Trust badges ── */}
      <div style={S.badges}>
        {["✅ 100% Authentic", "☑️ Verified Buyers", "🔒 Secure Reviews", "📷 Real Photos"].map(b => (
          <span key={b} style={S.badge}>{b}</span>
        ))}
      </div>

      {/* ── Review list ── */}
      {reviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
          No reviews yet. Be the first to review!
        </div>
      ) : (
        <>
          {visible.map(r => (
            <ReviewCard key={r._id} review={r} onHelpful={handleHelpful} />
          ))}

          {reviews.length > 3 && (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button onClick={() => setShowAll(p => !p)} style={S.viewAllBtn}>
                {showAll ? "▲ Show Less" : `▼ View All ${total} Reviews`}
              </button>
              <div style={{ fontSize: 12, color: "#999", marginTop: 6 }}>
                Showing {visible.length} of {total} reviews
              </div>
            </div>
          )}
        </>
      )}

      {showModal && (
        <WriteReviewModal
          productId={productId}
          onClose={() => setShowModal(false)}
          onSubmitted={fetchReviews}
        />
      )}
    </div>
  );
};

export default ProductReviews;

/* ══════════ STYLES ══════════ */
const S = {
  wrapper: { maxWidth: 800, margin: "0 auto", padding: "2rem 1rem 4rem" },

  sectionHead: { textAlign: "center", marginBottom: 32 },
  sectionTitle: { fontFamily: "Georgia, serif", fontSize: "2rem", fontWeight: 700, color: "#2C1810", margin: "0 0 8px" },
  sectionSub: { fontSize: 14, color: "#888", margin: "0 0 12px" },
  titleLine: { width: 60, height: 3, background: "linear-gradient(90deg,#B87333,#C9A44C)", borderRadius: 2, margin: "0 auto" },

  summaryCard: {
    background: "white", borderRadius: 16, padding: "28px 32px", marginBottom: 20,
    boxShadow: "0 4px 20px rgba(184,115,51,0.1)", border: "1px solid rgba(201,164,76,0.15)",
    display: "flex", alignItems: "flex-start", gap: 40, flexWrap: "wrap",
  },
  summaryLeft: { display: "flex", flexDirection: "column", alignItems: "center", minWidth: 120 },
  bigRating: { fontSize: "3.5rem", fontWeight: 700, color: "#B87333", fontFamily: "Georgia, serif", lineHeight: 1 },
  summaryBars: { flex: 1, minWidth: 200 },
  barTrack: { flex: 1, height: 8, background: "#F0EBE3", borderRadius: 4, overflow: "hidden" },
  barFill: { height: "100%", background: "linear-gradient(90deg,#C9A44C,#B87333)", borderRadius: 4, transition: "width 0.4s" },

  writeBtn: {
    background: "#1a3a5c", color: "white", border: "none",
    padding: "10px 20px", borderRadius: 8, fontWeight: 600, fontSize: 14,
    cursor: "pointer", whiteSpace: "nowrap", alignSelf: "center",
  },

  badges: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 },
  badge: {
    background: "rgba(184,115,51,0.06)", color: "#7D6E63",
    padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500,
    border: "1px solid rgba(184,115,51,0.15)",
  },

  reviewCard: {
    background: "white", borderRadius: 16, padding: "24px 28px", marginBottom: 20,
    boxShadow: "0 4px 16px rgba(62,39,35,0.07)", border: "1px solid rgba(201,164,76,0.1)",
  },
  reviewTop: { display: "flex", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 },
  avatar: {
    width: 44, height: 44, borderRadius: "50%",
    background: "linear-gradient(135deg,#B87333,#C9A44C)",
    color: "white", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 15, flexShrink: 0,
  },
  helpfulBtn: {
    display: "flex", alignItems: "center", gap: 6, background: "rgba(184,115,51,0.07)",
    border: "1px solid rgba(184,115,51,0.2)", color: "#B87333",
    padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer",
  },
  verifiedBadge: {
    background: "rgba(62,39,35,0.05)", color: "#7D6E63",
    padding: "4px 12px", borderRadius: 12, fontSize: 12, border: "1px solid #E8DDD0",
  },

  viewAllBtn: {
    background: "linear-gradient(135deg,#B87333,#C9A44C)", color: "white",
    border: "none", padding: "12px 36px", borderRadius: 30, fontWeight: 600, fontSize: 15,
    cursor: "pointer", boxShadow: "0 4px 16px rgba(184,115,51,0.3)",
  },

  /* Modal */
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16,
  },
  modal: {
    background: "white", borderRadius: 16, width: "100%", maxWidth: 560,
    maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  modalHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "20px 24px", borderBottom: "1px solid #F0EBE3",
  },
  modalTitle: { fontWeight: 700, fontSize: 18, color: "#2C1810" },
  closeBtn: {
    background: "#1a3a5c", color: "white", border: "none",
    width: 32, height: 32, borderRadius: 6, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  modalBody: { padding: "20px 24px 28px" },
  input: {
    width: "100%", padding: "10px 14px", border: "1.5px solid #E8DDD0",
    borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box",
    fontFamily: "inherit", marginBottom: 4,
  },
  textarea: {
    width: "100%", padding: "10px 14px", border: "1.5px solid #E8DDD0",
    borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box",
    fontFamily: "inherit", resize: "vertical", marginBottom: 4,
  },
  fileBtn: {
    display: "flex", alignItems: "center", gap: 6, width: "100%",
    padding: "10px 14px", border: "1.5px solid #E8DDD0", borderRadius: 8,
    background: "white", fontSize: 13, cursor: "pointer", color: "#555",
  },
  submitBtn: {
    background: "#1a3a5c", color: "white", border: "none", width: "100%",
    padding: "12px", borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: "pointer",
  },
  errorBox: {
    background: "#fff0f0", border: "1px solid #ffcccc", borderRadius: 8,
    padding: "10px 14px", color: "#c00", fontSize: 13, marginBottom: 12,
  },
};