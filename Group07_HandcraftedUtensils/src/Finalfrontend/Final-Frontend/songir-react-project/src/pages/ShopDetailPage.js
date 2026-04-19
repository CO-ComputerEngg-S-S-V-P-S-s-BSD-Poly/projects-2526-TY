import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Star, ShoppingCart, Heart,
  MapPin, Clock, Phone, Package, CheckCircle,
  ShieldCheck, User
} from "lucide-react";

const BASE_URL = "http://localhost:5000";

/* ── image helper ── */
const getImg = (img) => {
  if (!img) return null;
  return img.startsWith("http") ? img : `${BASE_URL}/${img}`;
};

/* ── wishlist helpers ── */
const WISH_KEY = "songir_wishlist";
const getWishIds = () => {
  try {
    return JSON.parse(localStorage.getItem(WISH_KEY) || "[]")
      .filter((i) => i && typeof i === "object")
      .map((i) => String(i.id || i._id || ""));
  } catch { return []; }
};
const saveWish = (items) => {
  localStorage.setItem(WISH_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("wishlistUpdated"));
};

const GRADS = [
  "linear-gradient(135deg,#C9943D,#9f5e1a)",
  "linear-gradient(135deg,#6b3d12,#3E2713)",
  "linear-gradient(135deg,#b87c30,#7a5018)",
  "linear-gradient(135deg,#8B5E3C,#5a2e10)",
  "linear-gradient(135deg,#a06520,#6b3d12)",
];

/* ════════════════════════════════════════════
   ShopDetailPage
   ─ gets shop data from:
     1. location.state.shop  (from Navbar dropdown / ShopsPage click)
     2. API fetch by :shopName param  (direct URL / page refresh)
════════════════════════════════════════════ */
export default function ShopDetailPage({ addToCart, onAddToCart }) {
  const { shopName: shopParam } = useParams();
  const location = useLocation();
  const navigate  = useNavigate();

  /* ── state ── */
  const [shop,    setShop]    = useState(location.state?.shop || null);
  const [loading, setLoading] = useState(!location.state?.shop);
  const [error,   setError]   = useState("");

  const [wishIds,  setWishIds]  = useState(() => getWishIds());
  const [addedId,  setAddedId]  = useState(null);
  const [selProd,  setSelProd]  = useState(null);

  /* ── fetch shop if no state (direct URL / refresh) ── */
  useEffect(() => {
    if (shop) return; // already have data

    const param = decodeURIComponent(shopParam || "");
    if (!param) { setError("Shop not found."); setLoading(false); return; }

    setLoading(true);
    fetch(`${BASE_URL}/api/shops/approved`)
      .then((r) => {
        if (!r.ok) throw new Error("Could not load shops");
        return r.json();
      })
      .then((data) => {
        const list   = Array.isArray(data) ? data : [];
        const found  = list.find(
          (s) =>
            (s.shopName || "").toLowerCase() === param.toLowerCase() ||
            (s._id      || "").toLowerCase() === param.toLowerCase()
        );
        if (found) setShop(found);
        else       setError(`Shop "${param}" not found.`);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopParam]);

  /* ── wishlist sync across tabs ── */
  useEffect(() => {
    const sync = () => setWishIds(getWishIds());
    window.addEventListener("wishlistUpdated", sync);
    return () => window.removeEventListener("wishlistUpdated", sync);
  }, []);

  /* ── add to cart ── */
  const handleAddToCart = (product) => {
    const cartFn = addToCart || onAddToCart;
    if (typeof cartFn === "function") {
      cartFn({
        ...product,
        id:            product._id || product.id,
        originalPrice: product.originalPrice ?? product.price + 300,
        shop:          shop?.shopName || "",
        shopName:      shop?.shopName || "",
      });
    }
    const pid = String(product._id || product.id);
    setAddedId(pid);
    setTimeout(() => setAddedId(null), 1500);
  };

  /* ── wishlist toggle ── */
  const handleWish = (product) => {
    const pid  = String(product._id || product.id);
    const raw  = JSON.parse(localStorage.getItem(WISH_KEY) || "[]");
    const exists = raw.some((i) => String(i.id || i._id) === pid);
    if (exists) {
      saveWish(raw.filter((i) => String(i.id || i._id) !== pid));
    } else {
      saveWish([...raw, {
        id: pid, _id: pid,
        name:          product.name,
        price:         product.price,
        oldPrice:      product.price + 300,
        image:         product.image,
        category:      product.category,
        shopName:      shop?.shopName || "",
        inStock:       product.inStock ?? true,
      }]);
    }
    setWishIds(getWishIds());
  };

  /* ════ LOADING ════ */
  if (loading) return (
    <div style={S.center}>
      <div style={S.spinner} />
      <p style={S.loadTxt}>Loading shop…</p>
    </div>
  );

  /* ════ ERROR ════ */
  if (error || !shop) return (
    <div style={S.center}>
      <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🏪</div>
      <h2 style={S.errH}>{error || "Shop not found"}</h2>
      <p  style={S.errP}>The shop may be unavailable or the link is incorrect.</p>
      <button style={S.backBtn} onClick={() => navigate("/shops")}>← Back to Shops</button>
    </div>
  );

  const products = shop.products || [];
  const ini      = (shop.shopName || "SH").substring(0, 2).toUpperCase();

  /* ════ PRODUCT DETAIL VIEW ════ */
  if (selProd) {
    const pid    = String(selProd._id || selProd.id);
    const isWish = wishIds.includes(pid);
    const img    = getImg(selProd.image);

    return (
      <div style={S.page}>
        <style>{CSS}</style>
        <div style={S.body}>
          <button style={S.backBtn} onClick={() => setSelProd(null)}>
            <ArrowLeft size={16} /> Back to {shop.shopName}
          </button>

          <div style={S.pdWrap}>
            {/* Image */}
            <div style={S.pdImgSide}>
              {img
                ? <img src={img} alt={selProd.name} style={S.pdImg}
                    onError={(e) => { e.target.style.display = "none"; }} />
                : <div style={S.pdImgFB}>🪔</div>
              }
              <div style={S.pdImgOverlay} />
            </div>

            {/* Info */}
            <div style={S.pdInfo}>
              <span style={S.catTag}>{selProd.category || "Handicraft"}</span>
              <h2 style={S.pdTitle}>{selProd.name}</h2>

              <div style={S.pdPriceRow}>
                <span style={S.pdPrice}>₹{(selProd.price || 0).toLocaleString()}</span>
                <span style={S.pdOld}>₹{((selProd.originalPrice || selProd.price + 300)).toLocaleString()}</span>
                <span style={S.saveBadge}>Save ₹{(selProd.originalPrice || selProd.price + 300) - selProd.price}</span>
              </div>

              <div style={S.pdMeta}>
                {[
                  { l: "Shop",    v: shop.shopName    || "—" },
                  { l: "Artisan", v: shop.ownerName   || "—" },
                  ...(selProd.material ? [{ l: "Material", v: selProd.material }] : []),
                  ...(selProd.weight   ? [{ l: "Weight",   v: selProd.weight   }] : []),
                ].map(({ l, v }) => (
                  <div key={l} style={S.metaRow}>
                    <span style={S.metaL}>{l}</span>
                    <span style={S.metaV}>{v}</span>
                  </div>
                ))}
              </div>

              {selProd.description && (
                <p style={S.pdDesc}>{selProd.description}</p>
              )}

              <div style={S.pdBtns}>
                <button
                  className="sdp-primary-btn"
                  style={S.btnPrimary}
                  onClick={() => handleAddToCart(selProd)}
                >
                  {addedId === String(selProd._id || selProd.id)
                    ? "✓ Added to Cart!"
                    : <><ShoppingCart size={16} /> Add to Cart</>}
                </button>

                <button
                  style={{ ...S.iconBtn, color: isWish ? "#E05A1A" : "#9E8E7E", borderColor: isWish ? "rgba(224,90,26,0.4)" : "#E2D8CC" }}
                  onClick={() => handleWish(selProd)}
                  title={isWish ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart size={18} fill={isWish ? "#E05A1A" : "none"} />
                </button>

                <button style={S.btnGhost} onClick={() => navigate("/quote")}>
                  Get Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ════ SHOP MAIN PAGE ════ */
  return (
    <div style={S.page}>
      <style>{CSS}</style>

      {/* ── Hero ── */}
      <div style={S.hero}>
        <div style={S.orb1} />
        <div style={S.orb2} />
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Avatar */}
          <div style={{ ...S.heroAva, background: GRADS[0] }}>
            {ini}
            <div style={S.heroVerified}><CheckCircle size={12} /></div>
          </div>
          <h1 style={S.heroName}>{shop.shopName || "Artisan Shop"}</h1>
          <p  style={S.heroOwner}>by {shop.ownerName || "Master Artisan"}</p>
          <div style={S.heroBadge}>✦ &nbsp;Verified · Authentic · Handcrafted&nbsp; ✦</div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={S.body}>

        {/* Back */}
        <button style={S.backBtn} onClick={() => navigate("/shops")}>
          <ArrowLeft size={16} /> All Shops
        </button>

        {/* Info strip */}
        <div style={S.infoCard}>
          <div style={S.infoBar} />
          <div style={S.infoGrid}>
            {[
              { Icon: User,    label: "Owner",    value: shop.ownerName || "—"         },
              { Icon: Phone,   label: "Phone",    value: shop.phone || shop.contact || "—" },
              { Icon: MapPin,  label: "Address",  value: shop.address || "—"          },
              { Icon: Clock,   label: "Timings",  value:
                  shop.openingTime && shop.closingTime
                    ? `${shop.openingTime} – ${shop.closingTime}`
                    : "—"
              },
              { Icon: Package, label: "Products", value: `${products.length} items`   },
            ].map(({ Icon, label, value }) => (
              <div key={label} style={S.infoCell}>
                <div style={S.infoIcon}><Icon size={14} /></div>
                <div>
                  <span style={S.infoL}>{label}</span>
                  <span style={S.infoV}>{value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Working days */}
          {(shop.workingDays || []).length > 0 && (
            <div style={{ padding: "0 1.4rem 1.2rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {shop.workingDays.map((d, i) => (
                <span key={i} style={S.dayPill}>{d}</span>
              ))}
            </div>
          )}
        </div>

        {/* Products heading */}
        <div style={S.secHead}>
          <div style={S.secLine} />
          <h2 style={S.secTitle}>Products from {shop.shopName}</h2>
          <div style={{ ...S.secLine, background: "linear-gradient(90deg,rgba(201,164,76,0.4),transparent)" }} />
        </div>

        {/* Products grid */}
        {products.length === 0 ? (
          <div style={S.empty}>
            <div style={{ fontSize: "3.5rem" }}>📦</div>
            <p style={{ color: "#9E8E7E", marginTop: "0.75rem" }}>No products listed yet.</p>
          </div>
        ) : (
          <div style={S.grid}>
            {products.map((p, idx) => {
              const pid    = String(p._id || p.id || idx);
              const img    = getImg(p.image);
              const isWish = wishIds.includes(pid);
              const added  = addedId === pid;

              return (
                <div key={pid} className="sdp-card" style={S.card}>
                  {/* Image */}
                  <div style={S.cardImgWrap}>
                    {img
                      ? <img src={img} alt={p.name} style={S.cardImg}
                          onError={(e) => {
                            e.target.parentNode.innerHTML =
                              '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;background:#F5F0EA">🪔</div>';
                          }} />
                      : <div style={S.cardImgFB}>🪔</div>
                    }
                    {/* Hover overlay */}
                    <div className="sdp-overlay" style={S.overlay} onClick={() => setSelProd(p)}>
                      <span style={S.overlayLabel}>View Details</span>
                    </div>
                    {/* Wishlist heart */}
                    <button
                      style={{ ...S.wishBtn, color: isWish ? "#E05A1A" : "#bda98a" }}
                      onClick={() => handleWish(p)}
                      title={isWish ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <Heart size={13} fill={isWish ? "#E05A1A" : "none"} />
                    </button>
                  </div>

                  {/* Info */}
                  <div style={S.cardInfo}>
                    <span style={S.catTag}>{p.category || "Handicraft"}</span>
                    <h4 style={S.cardName} onClick={() => setSelProd(p)}>{p.name}</h4>
                    {p.description && <p style={S.cardDesc}>{p.description}</p>}
                    <div style={S.priceRow}>
                      <span style={S.price}>₹{(p.price || 0).toLocaleString()}</span>
                      <span style={S.oldPrice}>₹{((p.originalPrice || p.price + 300)).toLocaleString()}</span>
                    </div>

                    {/* Buttons */}
                    <div style={S.cardBtns}>
                      <button
                        style={S.viewBtn}
                        onClick={() => setSelProd(p)}
                      >
                        View
                      </button>

                      {added ? (
                        <div style={S.addedBtn}>✓ Added!</div>
                      ) : (
                        <button
                          className="sdp-primary-btn"
                          style={S.cartBtn}
                          onClick={() => handleAddToCart(p)}
                        >
                          <ShoppingCart size={13} /> Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   STYLES
════════════════════════════════════════════ */
const S = {
  page:    { minHeight: "100vh", background: "#FAF7F2", fontFamily: "'DM Sans', sans-serif" },
  body:    { maxWidth: "1220px", margin: "0 auto", padding: "2rem 1.5rem 4rem" },

  /* loading / error */
  center:  { minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem" },
  spinner: { width: 48, height: 48, border: "3px solid #E8DECD", borderTop: "3px solid #C9943D", borderRadius: "50%", animation: "sdp-spin 0.85s linear infinite" },
  loadTxt: { color: "#9E8E7E", marginTop: "1rem" },
  errH:    { fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", color: "#3E2723", margin: "0 0 0.5rem" },
  errP:    { color: "#9E8E7E", fontSize: "0.95rem", marginBottom: "1.5rem" },

  /* back button */
  backBtn: { display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#fff", border: "1.5px solid rgba(184,115,51,0.25)", color: "#B87333", padding: "0.6rem 1.2rem", borderRadius: "10px", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", marginBottom: "1.8rem", fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s", boxShadow: "0 2px 8px rgba(184,115,51,0.08)" },

  /* hero */
  hero:        { position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#2C1810 0%,#3E2723 50%,#5D3218 100%)", padding: "4.5rem 2rem 3.5rem", textAlign: "center" },
  orb1:        { position: "absolute", top: "-80px", left: "-80px", width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle,rgba(201,164,76,0.13) 0%,transparent 70%)" },
  orb2:        { position: "absolute", bottom: "-80px", right: "-60px", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle,rgba(184,115,51,0.1) 0%,transparent 70%)" },
  heroAva:     { width: 80, height: 80, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", fontWeight: 700, color: "#FFF8EE", fontFamily: "'Georgia',serif", boxShadow: "0 6px 22px rgba(184,115,51,0.35)", margin: "0 auto 1rem", position: "relative" },
  heroVerified:{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, background: "#27AE60", borderRadius: "50%", border: "2.5px solid #2C1810", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" },
  heroName:    { fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,5vw,3rem)", fontWeight: 700, color: "#F5EDD8", margin: "0 0 0.4rem", lineHeight: 1.15 },
  heroOwner:   { color: "rgba(245,237,216,0.6)", fontSize: "1rem", margin: "0 0 1.2rem", fontWeight: 400 },
  heroBadge:   { display: "inline-flex", alignItems: "center", background: "rgba(201,164,76,0.12)", border: "1px solid rgba(201,164,76,0.25)", color: "#DDB96A", padding: "0.38rem 1.2rem", borderRadius: "30px", fontSize: "0.78rem", letterSpacing: "0.08em", fontWeight: 500 },

  /* info card */
  infoCard:  { background: "#fff", borderRadius: "18px", overflow: "hidden", boxShadow: "0 6px 30px rgba(62,39,35,0.08)", border: "1px solid rgba(201,164,76,0.14)", marginBottom: "2.5rem" },
  infoBar:   { height: 4, background: "linear-gradient(90deg,#B87333,#C9A44C,#E8C97A,#C9A44C,#B87333)", backgroundSize: "200% auto", animation: "sdp-shimmer 3s linear infinite" },
  infoGrid:  { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", padding: "1.2rem 1rem 0.8rem", gap: "0.5rem 0" },
  infoCell:  { display: "flex", alignItems: "flex-start", gap: "0.55rem", padding: "0.5rem 0.75rem" },
  infoIcon:  { width: 28, height: 28, borderRadius: 8, background: "rgba(184,115,51,0.08)", color: "#B87333", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 },
  infoL:     { display: "block", fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", color: "#B87333", marginBottom: "0.22rem" },
  infoV:     { display: "block", fontSize: "0.86rem", fontWeight: 600, color: "#3E2723" },
  dayPill:   { background: "rgba(184,115,51,0.07)", color: "#B87333", padding: "0.2rem 0.65rem", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 600, border: "1px solid rgba(184,115,51,0.15)" },

  /* section heading */
  secHead:  { display: "flex", alignItems: "center", gap: "1.2rem", marginBottom: "1.8rem" },
  secLine:  { flex: 1, height: "1px", background: "linear-gradient(90deg,transparent,rgba(201,164,76,0.4))" },
  secTitle: { fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 700, color: "#2C1810", whiteSpace: "nowrap", margin: 0 },

  empty: { textAlign: "center", padding: "3.5rem", background: "#fff", borderRadius: "16px", border: "2px dashed rgba(201,164,76,0.22)" },

  /* products grid */
  grid:         { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: "1.4rem" },
  card:         { background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 18px rgba(62,39,35,0.07)", border: "1px solid rgba(201,164,76,0.1)", transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)", display: "flex", flexDirection: "column" },
  cardImgWrap:  { height: "200px", overflow: "hidden", position: "relative", background: "#F5F0EA", cursor: "pointer" },
  cardImg:      { width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" },
  cardImgFB:    { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3.5rem" },
  overlay:      { position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(44,24,16,0.72),rgba(184,115,51,0.62))", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.28s", cursor: "pointer" },
  overlayLabel: { color: "#FFF8EE", fontSize: "0.86rem", fontWeight: 600, border: "1.5px solid rgba(255,248,238,0.55)", padding: "0.42rem 1.1rem", borderRadius: "22px" },
  wishBtn:      { position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: "50%", background: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.18)", zIndex: 2, transition: "all 0.18s" },

  cardInfo:  { padding: "1rem 1rem 1.1rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.28rem" },
  catTag:    { display: "inline-block", background: "rgba(184,115,51,0.07)", color: "#B87333", padding: "0.18rem 0.6rem", borderRadius: "6px", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", width: "fit-content" },
  cardName:  { fontSize: "0.98rem", fontWeight: 700, color: "#2C1810", margin: "0.2rem 0 0", fontFamily: "'Playfair Display',serif", lineHeight: 1.3, cursor: "pointer" },
  cardDesc:  { fontSize: "0.78rem", color: "#9E8E7E", lineHeight: 1.5, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  priceRow:  { display: "flex", alignItems: "baseline", gap: "0.45rem", marginTop: "auto", paddingTop: "0.4rem" },
  price:     { fontSize: "1.2rem", fontWeight: 700, color: "#B87333", fontFamily: "'Playfair Display',serif" },
  oldPrice:  { fontSize: "0.82rem", color: "#C4B5A0", textDecoration: "line-through" },

  cardBtns:  { display: "flex", gap: "0.5rem", marginTop: "0.6rem" },
  viewBtn:   { flex: 1, background: "transparent", border: "1.5px solid rgba(184,115,51,0.35)", color: "#B87333", padding: "0.55rem 0.5rem", borderRadius: "9px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s" },
  cartBtn:   { flex: 2, background: "linear-gradient(135deg,#B87333,#C9A44C)", color: "#FFF8EE", border: "none", padding: "0.55rem 0.5rem", borderRadius: "9px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem", transition: "all 0.22s", boxShadow: "0 3px 10px rgba(184,115,51,0.3)" },
  addedBtn:  { flex: 2, background: "linear-gradient(135deg,#2E7D32,#1b5e20)", color: "#fff", padding: "0.55rem 0.5rem", borderRadius: "9px", fontSize: "0.82rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" },

  /* product detail view */
  pdWrap:       { display: "grid", gridTemplateColumns: "1fr 1fr", background: "#fff", borderRadius: "18px", overflow: "hidden", boxShadow: "0 10px 40px rgba(62,39,35,0.1)", border: "1px solid rgba(201,164,76,0.13)" },
  pdImgSide:    { position: "relative", minHeight: 440, background: "#F0EAE0", overflow: "hidden" },
  pdImg:        { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  pdImgFB:      { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "7rem" },
  pdImgOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, height: "35%", background: "linear-gradient(to top,rgba(44,24,16,0.25),transparent)" },
  pdInfo:       { padding: "2.2rem", display: "flex", flexDirection: "column", gap: "0.8rem", overflowY: "auto" },
  pdTitle:      { fontFamily: "'Playfair Display',serif", fontSize: "1.9rem", fontWeight: 700, color: "#2C1810", margin: 0, lineHeight: 1.2 },
  pdPriceRow:   { display: "flex", alignItems: "baseline", gap: "0.8rem", flexWrap: "wrap" },
  pdPrice:      { fontSize: "2rem", fontWeight: 700, color: "#B87333", fontFamily: "'Playfair Display',serif" },
  pdOld:        { fontSize: "1rem", color: "#C4B5A0", textDecoration: "line-through" },
  saveBadge:    { background: "#fff3e0", color: "#e65100", fontSize: "0.7rem", fontWeight: 800, padding: "2px 9px", borderRadius: "8px", border: "1px solid rgba(230,81,0,0.18)" },
  pdMeta:       { background: "rgba(184,115,51,0.04)", border: "1px solid rgba(201,164,76,0.13)", borderRadius: "12px", padding: "0.9rem 1.1rem" },
  metaRow:      { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.3rem 0", borderBottom: "1px solid rgba(201,164,76,0.08)" },
  metaL:        { fontSize: "0.72rem", color: "#9E8E7E", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" },
  metaV:        { fontSize: "0.88rem", color: "#3E2723", fontWeight: 700 },
  pdDesc:       { fontSize: "0.95rem", color: "#7D6E63", lineHeight: 1.8, margin: 0, flex: 1 },
  pdBtns:       { display: "flex", gap: "0.75rem", marginTop: "auto", flexWrap: "wrap" },

  btnPrimary: { flex: 2, background: "linear-gradient(135deg,#B87333,#C9A44C)", color: "#FFF8EE", border: "none", padding: "0.78rem 1rem", borderRadius: "12px", fontSize: "0.92rem", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", boxShadow: "0 4px 16px rgba(184,115,51,0.35)", transition: "all 0.22s" },
  btnGhost:   { flex: 1, background: "transparent", color: "#B87333", border: "1.5px solid rgba(184,115,51,0.4)", padding: "0.78rem 1rem", borderRadius: "12px", fontSize: "0.92rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.22s" },
  iconBtn:    { width: 44, height: 44, background: "#fff", border: "1.5px solid #E2D8CC", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", flexShrink: 0 },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  @keyframes sdp-spin    { to { transform: rotate(360deg) } }
  @keyframes sdp-shimmer { 0%{background-position:-200% center}100%{background-position:200% center} }
  .sdp-card:hover                    { transform: translateY(-8px) !important; box-shadow: 0 20px 45px rgba(62,39,35,0.13) !important; }
  .sdp-card:hover .sdp-overlay       { opacity: 1 !important; }
  .sdp-card:hover img                { transform: scale(1.05) !important; }
  .sdp-primary-btn:hover             { box-shadow: 0 8px 24px rgba(184,115,51,0.45) !important; transform: translateY(-2px) !important; }
  @media (max-width: 640px) {
    .sdp-pd-wrap { grid-template-columns: 1fr !important; }
  }
`;