import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Comparison.css";

// ─── API BASE URL ───────────────────────────────────────────────────
const API_BASE = "http://localhost:5000/api";

// ─── Delivery options (UI ke liye same rakhein) ─────────────────────
const DELIVERY_MAP     = { "1-2 days": 1.5, "2-3 days": 2.5, "3-4 days": 3.5, "4-5 days": 4.5 };
const DELIVERY_OPTIONS = ["1-2 days", "2-3 days", "3-4 days", "4-5 days"];

// ─── Deterministic delivery assign (jab DB mein delivery field nahi) ─
function assignDelivery(shopName, productName) {
  let hash = 0;
  for (let i = 0; i < (shopName + productName).length; i++) {
    hash = ((hash << 5) - hash) + (shopName + productName).charCodeAt(i);
    hash |= 0;
  }
  return DELIVERY_OPTIONS[Math.abs(hash) % DELIVERY_OPTIONS.length];
}

// ─── Deterministic sold count ────────────────────────────────────────
function assignSold(shopName, price) {
  let hash = 0;
  for (let i = 0; i < shopName.length; i++) hash = hash * 31 + shopName.charCodeAt(i);
  return 50 + (Math.abs(hash + price) % 550);
}

// ─── Avatar initials from shop name ─────────────────────────────────
function getAvatar(shopName = "") {
  return shopName.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("");
}

// ─── Shop color from name (deterministic) ───────────────────────────
const SHOP_COLORS = ["#b87333","#8B5A2B","#C9A44C","#9f5e1a","#b8762e","#6b3d12","#C9943D","#7a4a0a","#a06520"];
function getShopColor(shopName = "") {
  let hash = 0;
  for (let i = 0; i < shopName.length; i++) hash = hash * 31 + shopName.charCodeAt(i);
  return SHOP_COLORS[Math.abs(hash) % SHOP_COLORS.length];
}

// ─── Image URL helper ────────────────────────────────────────────────
function getImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  return `http://localhost:5000/${imagePath.replace(/^\//, "")}`;
}

/* ══════════════════════════════════════════════════════════════
   SORT OPTIONS — same as original
══════════════════════════════════════════════════════════════ */
const SORT_OPTIONS = [
  { label: "💰 Price: Lowest First",  value: "price_asc"    },
  { label: "💎 Price: Highest First", value: "price_desc"   },
  { label: "⭐ Rating: Best First",   value: "rating_desc"  },
  { label: "🚚 Delivery: Fastest",    value: "delivery_asc" },
  { label: "🔥 Most Sold",            value: "sold_desc"    },
];

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTS — exact same as original
══════════════════════════════════════════════════════════════ */
function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.4;
  return (
    <div className="cmp-stars">
      {[1,2,3,4,5].map(s => (
        <span key={s}
          className={s <= full ? "cmp-star cmp-star--full" : (s === full+1 && half) ? "cmp-star cmp-star--half" : "cmp-star"}>
          ★
        </span>
      ))}
      <span className="cmp-rating-num">{Number(rating).toFixed(1)}</span>
    </div>
  );
}

function PriceBar({ price, min, max }) {
  const pct   = max === min ? 0 : Math.round(((price - min) / (max - min)) * 100);
  const color = pct < 30 ? "#2ecc71" : pct < 65 ? "#f39c12" : "#e74c3c";
  const label = pct < 30 ? "Best Price" : pct < 65 ? "Fair Price" : "High Price";
  return (
    <div className="cmp-pricebar">
      <div className="cmp-pricebar__track">
        <div className="cmp-pricebar__fill" style={{ width: `${100 - pct}%`, background: color }} />
      </div>
      <span className="cmp-pricebar__label" style={{ color }}>{label}</span>
    </div>
  );
}

function MiniChart({ shopData }) {
  const valid = shopData.filter(s => s.inStock);
  if (!valid.length) return null;
  const maxP  = Math.max(...valid.map(s => s.price));
  const minP  = Math.min(...valid.map(s => s.price));
  return (
    <div className="cmp-chart">
      <div className="cmp-chart__title">📊 Price Distribution</div>
      <div className="cmp-chart__bars">
        {shopData.map((s, i) => {
          const h   = Math.round((s.price / maxP) * 100);
          const low = s.inStock && s.price === minP;
          return (
            <div key={i} className="cmp-chart__col">
              <span className="cmp-chart__price">₹{s.price}</span>
              <div className="cmp-chart__outer">
                <div
                  className={`cmp-chart__bar ${low ? "cmp-chart__bar--low" : ""} ${!s.inStock ? "cmp-chart__bar--oos" : ""}`}
                  style={{ height: `${h}%`, animationDelay: `${i * 80}ms` }}
                />
              </div>
              <span className="cmp-chart__shop">{s.avatar}</span>
              <span className="cmp-chart__shopname">{s.shopName.split(" ")[0]}</span>
            </div>
          );
        })}
      </div>
      <div className="cmp-chart__legend">
        <span><span className="dot dot--green"/>Best Price</span>
        <span><span className="dot dot--copper"/>Others</span>
        <span><span className="dot dot--grey"/>Out of Stock</span>
      </div>
    </div>
  );
}

function Toast({ toasts }) {
  return (
    <div className="cmp-toasts">
      {toasts.map(t => (
        <div key={t.id} className={`cmp-toast cmp-toast--${t.type}`}>
          {t.type === "success" ? "✅" : t.type === "warn" ? "⚠️" : "❤️"} {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function Comparison({ setSelectedProductForQuote }) {
  const navigate   = useNavigate();
  const location   = useLocation();
  const resultsRef = useRef(null);
  const searchRef  = useRef(null);

  /* ── State ── */
  const [selectedProductName, setSelectedProductName] = useState(""); // selected product ka naam
  const [allProducts,    setAllProducts]    = useState([]);  // compare-list API se
  const [shopData,       setShopData]       = useState([]);  // compare API se (shops with price)
  const [showResults,    setShowResults]    = useState(false);
  const [sortBy,         setSortBy]         = useState("price_asc");
  const [inStockOnly,    setInStockOnly]    = useState(false);
  const [shopSearch,     setShopSearch]     = useState("");
  const [activeView,     setActiveView]     = useState("grid");
  const [compareMode,    setCompareMode]    = useState(false);
  const [compareIds,     setCompareIds]     = useState([]);
  const [wishlistShops,  setWishlistShops]  = useState([]);
  const [toasts,         setToasts]         = useState([]);
  const [catFilter,      setCatFilter]      = useState("All");
  const [productSearch,  setProductSearch]  = useState("");
  const [animKey,        setAnimKey]        = useState(0);
  const [priceAlertSet,  setPriceAlertSet]  = useState({});
  const [activeTab,      setActiveTab]      = useState("compare");
  const [loading,        setLoading]        = useState(false);  // ← NEW: loading state
  const [productsLoading,setProductsLoading]= useState(true);   // ← NEW: initial load

  /* ── Fetch product list for picker (compare-list API) ── */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const query = catFilter !== "All" ? `?category=${catFilter}` : "";
        const res   = await fetch(`${API_BASE}/products/compare-list${query}`);
        const data  = await res.json();
        setAllProducts(data.products || []);
      } catch (err) {
        console.error("Products fetch error:", err);
        addToast("Products load nahi hue, retry karo", "warn");
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, [catFilter]); // eslint-disable-line

  /* ── Pick up pre-selected product from navigation state ── */
  useEffect(() => {
    const state = location.state;
    if (state?.product?.name) {
      setSelectedProductName(state.product.name);
      handleCompare(state.product.name);
    }
  }, []); // eslint-disable-line

  /* ── Toast helper ── */
  const addToast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);

  /* ── Compare trigger — fetch real data ── */
  const handleCompare = async (productName) => {
    if (!productName) return;
    try {
      setLoading(true);
      setShowResults(false);

      const res  = await fetch(`${API_BASE}/products/compare?name=${encodeURIComponent(productName)}`);
      const data = await res.json();

      if (!data.products?.length) {
        addToast("Is product ke liye koi shops nahi mile abhi", "warn");
        setLoading(false);
        return;
      }

      // Enrich each product-shop entry with avatar, color, delivery, sold
      const enriched = data.products.map(p => ({
        ...p,
        avatar:   getAvatar(p.shopName),
        color:    getShopColor(p.shopName),
        delivery: assignDelivery(p.shopName, p.name),
        sold:     assignSold(p.shopName, p.price),
        // badge from shop (can be extended later)
        badge:    "",
        since:    "",
      }));

      setShopData(enriched);
      setShowResults(true);
      setCompareIds([]);
      setShopSearch("");
      setAnimKey(k => k + 1);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    } catch (err) {
      console.error("Compare fetch error:", err);
      addToast("Compare data load nahi hua", "warn");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleCompare(selectedProductName);
  };

  /* ── Sorted & filtered shop list — same logic as original ── */
  const sortedData = useMemo(() => {
    let d = [...shopData];
    if (inStockOnly) d = d.filter(s => s.inStock);
    if (shopSearch)  d = d.filter(s => s.shopName.toLowerCase().includes(shopSearch.toLowerCase()));
    d.sort((a, b) => {
      if (!a.inStock && b.inStock) return 1;
      if (a.inStock && !b.inStock) return -1;
      switch (sortBy) {
        case "price_asc":    return a.price - b.price;
        case "price_desc":   return b.price - a.price;
        case "rating_desc":  return b.rating - a.rating;
        case "delivery_asc": return DELIVERY_MAP[a.delivery] - DELIVERY_MAP[b.delivery];
        case "sold_desc":    return b.sold - a.sold;
        default: return 0;
      }
    });
    return d;
  }, [shopData, inStockOnly, shopSearch, sortBy]);

  /* ── Stats ── */
  const inStockPrices = shopData.filter(s => s.inStock).map(s => s.price);
  const minPrice = inStockPrices.length ? Math.min(...inStockPrices) : 0;
  const maxPrice = inStockPrices.length ? Math.max(...inStockPrices) : 0;
  const avgPrice = inStockPrices.length ? Math.round(inStockPrices.reduce((a,b)=>a+b,0)/inStockPrices.length) : 0;
  const maxRating = shopData.length ? Math.max(...shopData.filter(s=>s.inStock).map(s=>s.rating)) : 0;

  /* ── AI recommendation — same logic ── */
  const aiPick = useMemo(() => {
    const valid = shopData.filter(s => s.inStock);
    if (!valid.length) return null;
    const hp = Math.max(...valid.map(s=>s.price));
    const lp = Math.min(...valid.map(s=>s.price));
    const scored = valid.map(s => {
      const ps = lp === hp ? 50 : ((hp - s.price) / (hp - lp)) * 40;
      const rs = (s.rating - 4.0) * 35;
      const ds = ((4.5 - DELIVERY_MAP[s.delivery]) / 3) * 25;
      return { ...s, score: ps + rs + ds };
    });
    return scored.sort((a,b) => b.score - a.score)[0];
  }, [shopData]);

  /* ── Compare mode items ── */
  const compareItems = shopData.filter(s => compareIds.includes(s.shopName));

  /* ── Selected product object ── */
  const selectedProduct = allProducts.find(p => p.name === selectedProductName);

  /* ── Filtered product list for picker ── */
  const filteredProducts = useMemo(() =>
    allProducts.filter(p => {
      const okName = !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase());
      return okName;
    }),
  [allProducts, productSearch]);

  /* ── Wishlist ── */
  const toggleShopWish = (shopName) => {
    setWishlistShops(p =>
      p.includes(shopName)
        ? (addToast(`Removed ${shopName.split(" ")[0]} from shortlist`, "warn"), p.filter(s => s !== shopName))
        : (addToast(`Shortlisted ${shopName.split(" ")[0]} ❤️`), [...p, shopName])
    );
  };

  /* ── Compare select ── */
  const toggleCompareId = (shopName) => {
    if (compareIds.includes(shopName)) {
      setCompareIds(p => p.filter(s => s !== shopName));
    } else if (compareIds.length >= 3) {
      addToast("Maximum 3 shops can be compared side-by-side", "warn");
    } else {
      setCompareIds(p => [...p, shopName]);
    }
  };

  /* ── Price alert toggle ── */
  const togglePriceAlert = (shopName) => {
    setPriceAlertSet(p => {
      const next = { ...p, [shopName]: !p[shopName] };
      addToast(next[shopName] ? `🔔 Alert set for ${shopName.split(" ")[0]}` : `🔕 Alert removed`);
      return next;
    });
  };

  /* ── Get Quote — same flow ── */
  const handleGetQuote = (item) => {
    const quoteProduct = {
      id:       item._id,
      name:     item.name,
      shop:     item.shopName,
      shopId:   item.shopId,
      price:    item.price,
      category: item.category,
      image:    item.image,
    };
    try { localStorage.setItem("songirQuoteProduct", JSON.stringify(quoteProduct)); } catch(_) {}
    if (typeof setSelectedProductForQuote === "function") setSelectedProductForQuote(quoteProduct);
    navigate("/QuotePage");
  };

  /* ══════════════════════════════════════════════════════════
     RENDER — UI exactly same as original
  ══════════════════════════════════════════════════════════ */
  return (
    <div className="cmp-root">
      <Toast toasts={toasts} />

      {/* ── HERO ── */}
      <header className="cmp-hero">
        <div className="cmp-hero__ornament cmp-hero__ornament--l" />
        <div className="cmp-hero__ornament cmp-hero__ornament--r" />
        <div className="cmp-hero__inner">
          <div className="cmp-hero__eyebrow">
            <span className="cmp-hero__dot" />
            Multi-Shop Price Intelligence Engine
            <span className="cmp-hero__dot" />
          </div>
          <h1 className="cmp-hero__title">
            Compare &amp; <em>Conquer</em><br />the Best Deal
          </h1>
          <p className="cmp-hero__sub">
            Instantly compare prices, ratings &amp; delivery across{" "}
            <strong>real artisan shops</strong> for every product in our catalog
          </p>
          <div className="cmp-hero__stats">
            {[
              { val: String(allProducts.length || "…"), lbl: "Products"   },
              { val: String(shopData.length || "…"),    lbl: "Shops"      },
              { val: "AI",                              lbl: "Picks"      },
              { val: "₹0",                              lbl: "Extra Cost" },
            ].map(s => (
              <div key={s.lbl} className="cmp-hero__stat">
                <span className="cmp-hero__stat-val">{s.val}</span>
                <span className="cmp-hero__stat-lbl">{s.lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="cmp-page">

        {/* ── SHORTLIST STRIP ── */}
        {wishlistShops.length > 0 && (
          <div className="cmp-shortlist">
            <span className="cmp-shortlist__label">❤️ Shortlisted ({wishlistShops.length})</span>
            <div className="cmp-shortlist__chips">
              {wishlistShops.map(s => (
                <span key={s} className="cmp-shortlist__chip">
                  <span className="cmp-shortlist__chip-av" style={{ background: getShopColor(s) }}>{getAvatar(s)}</span>
                  {s.split(" ")[0]}
                  <button onClick={() => toggleShopWish(s)}>×</button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── PRODUCT PICKER ── */}
        <form className="cmp-picker" onSubmit={onSubmit}>
          <div className="cmp-picker__head">
            <h2 className="cmp-picker__title">
              <span className="cmp-picker__icon">🔍</span>
              Choose a Product to Compare
            </h2>
            <div className="cmp-picker__cats">
              {["All","Brass","Copper"].map(c => (
                <button
                  type="button"
                  key={c}
                  className={`cmp-cat-pill ${catFilter === c ? "cmp-cat-pill--active" : ""}`}
                  onClick={() => setCatFilter(c)}
                >
                  {c === "All" ? "🏺 All" : c === "Brass" ? "⚱️ Brass" : "🪙 Copper"}
                  <span className="cmp-cat-pill__count">
                    {c === "All"
                      ? allProducts.length
                      : allProducts.filter(p => p.category?.toLowerCase() === c.toLowerCase()).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="cmp-picker__search-row">
            <div className="cmp-picker__search">
              <span className="cmp-picker__search-icon">🔎</span>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search products…"
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                className="cmp-picker__search-input"
              />
              {productSearch && (
                <button type="button" className="cmp-picker__search-clear" onClick={() => setProductSearch("")}>×</button>
              )}
            </div>
          </div>

          {/* Product grid */}
          {productsLoading ? (
            <div className="cmp-product-empty">⏳ Products load ho rahe hain…</div>
          ) : (
            <div className="cmp-product-grid">
              {filteredProducts.map(p => (
                <button
                  type="button"
                  key={p._id || p.name}
                  className={`cmp-product-tile ${selectedProductName === p.name ? "cmp-product-tile--active" : ""}`}
                  onClick={() => setSelectedProductName(p.name)}
                >
                  {p.image && (
                    <img
                      src={getImageUrl(p.image)}
                      alt={p.name}
                      className="cmp-product-tile__img"
                      onError={e => { e.target.style.display = "none"; }}
                    />
                  )}
                  <span className="cmp-product-tile__name">{p.name}</span>
                  <span className={`cmp-product-tile__cat cmp-product-tile__cat--${p.category?.toLowerCase()}`}>
                    {p.category}
                  </span>
                  <span className="cmp-product-tile__price">from ₹{Math.round(p.basePrice * 0.93)}</span>
                  {p.shopCount > 0 && (
                    <span className="cmp-product-tile__price" style={{fontSize:"10px", opacity:0.7}}>
                      {p.shopCount} shop{p.shopCount > 1 ? "s" : ""}
                    </span>
                  )}
                  {selectedProductName === p.name && <span className="cmp-product-tile__check">✓</span>}
                </button>
              ))}
              {filteredProducts.length === 0 && (
                <div className="cmp-product-empty">
                  {productSearch ? `No products match "${productSearch}"` : "Abhi koi products available nahi hain"}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            className="cmp-compare-btn"
            disabled={!selectedProductName || loading}
          >
            {loading ? (
              <>⏳ Loading…</>
            ) : (
              <><span className="cmp-compare-btn__icon">⚡</span>Compare All Shops<span className="cmp-compare-btn__arrow">→</span></>
            )}
          </button>
        </form>

        {/* ══════════════════════════════════════════════
            RESULTS — exact same UI as original
        ══════════════════════════════════════════════ */}
        {showResults && (
          <div ref={resultsRef} key={animKey} className="cmp-results">

            {/* PRODUCT HEADER */}
            <div className="cmp-results__header">
              <div className="cmp-results__product-info">
                <div>
                  <h2 className="cmp-results__product-name">{selectedProductName}</h2>
                  {selectedProduct && (
                    <span className={`cmp-results__cat cmp-results__cat--${selectedProduct.category?.toLowerCase()}`}>
                      {selectedProduct.category}
                    </span>
                  )}
                </div>
              </div>
              <div className="cmp-results__tabs">
                {[
                  { id: "compare",    label: "🏪 Shop Cards"   },
                  { id: "sidebyside", label: "⚖️ Side-by-Side" },
                  { id: "insights",   label: "📊 Insights"     },
                ].map(tab => (
                  <button
                    key={tab.id}
                    className={`cmp-tab ${activeTab === tab.id ? "cmp-tab--active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── AI BANNER ── */}
            {aiPick && (
              <div className="cmp-ai-banner">
                <div className="cmp-ai-banner__left">
                  <span className="cmp-ai-banner__icon">🤖</span>
                  <div>
                    <div className="cmp-ai-banner__title">AI Best Value Pick</div>
                    <div className="cmp-ai-banner__desc">
                      <strong>{aiPick.shopName}</strong> scores highest overall for price · rating · delivery speed
                    </div>
                  </div>
                </div>
                <div className="cmp-ai-banner__right">
                  <span className="cmp-ai-banner__price">₹{aiPick.price}</span>
                  <button className="cmp-ai-banner__btn" onClick={() => handleGetQuote(aiPick)}>
                    Get Quote →
                  </button>
                </div>
              </div>
            )}

            {/* ── STATS ROW ── */}
            <div className="cmp-stats">
              {[
                { icon: "💰", val: `₹${minPrice}`,             lbl: "Lowest Available", color: "#2ecc71" },
                { icon: "📉", val: `₹${maxPrice - minPrice}`,  lbl: "Max Savings",      color: "#f39c12" },
                { icon: "🎯", val: `₹${avgPrice}`,             lbl: "Market Average",   color: "#b87333" },
                { icon: "⭐", val: `${maxRating}`,             lbl: "Best Rating",      color: "#C9A44C" },
                { icon: "🏪", val: `${shopData.filter(s=>s.inStock).length}/${shopData.length}`, lbl: "In Stock", color: "#3498db" },
              ].map((s, i) => (
                <div key={i} className="cmp-stat-card" style={{ "--accent": s.color }}>
                  <span className="cmp-stat-card__icon">{s.icon}</span>
                  <span className="cmp-stat-card__val" style={{ color: s.color }}>{s.val}</span>
                  <span className="cmp-stat-card__lbl">{s.lbl}</span>
                </div>
              ))}
            </div>

            {/* ══════════ TAB: SHOP CARDS ══════════ */}
            {activeTab === "compare" && (
              <>
                {/* TOOLBAR */}
                <div className="cmp-toolbar">
                  <div className="cmp-toolbar__left">
                    <div className="cmp-toolbar__search">
                      <span>🔍</span>
                      <input
                        type="text"
                        placeholder="Filter by shop name…"
                        value={shopSearch}
                        onChange={e => setShopSearch(e.target.value)}
                        className="cmp-toolbar__input"
                      />
                    </div>
                    <label className="cmp-toggle-label">
                      <span className={`cmp-toggle ${inStockOnly ? "cmp-toggle--on" : ""}`}
                        onClick={() => setInStockOnly(v => !v)}>
                        <span className="cmp-toggle__knob" />
                      </span>
                      In Stock Only
                    </label>
                  </div>
                  <div className="cmp-toolbar__right">
                    <select
                      className="cmp-sort-select"
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                    >
                      {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <div className="cmp-view-btns">
                      <button
                        className={`cmp-view-btn ${activeView === "grid" ? "cmp-view-btn--active" : ""}`}
                        onClick={() => setActiveView("grid")} title="Grid view">▦</button>
                      <button
                        className={`cmp-view-btn ${activeView === "list" ? "cmp-view-btn--active" : ""}`}
                        onClick={() => setActiveView("list")} title="List view">☰</button>
                    </div>
                    <button
                      className={`cmp-mode-btn ${compareMode ? "cmp-mode-btn--active" : ""}`}
                      onClick={() => { setCompareMode(v => !v); setCompareIds([]); }}
                    >
                      ⚖️ {compareMode ? "Exit Compare" : "Compare Mode"}
                    </button>
                  </div>
                </div>

                {/* SHOP CARDS */}
                <div className={`cmp-shop-grid ${activeView === "list" ? "cmp-shop-grid--list" : ""}`}>
                  {sortedData.map((item, i) => {
                    const isLowest   = item.inStock && item.price === minPrice;
                    const isAIPick   = aiPick?.shopName === item.shopName;
                    const isWished   = wishlistShops.includes(item.shopName);
                    const isCompared = compareIds.includes(item.shopName);
                    const isAlerted  = priceAlertSet[item.shopName];
                    const savePct    = item.inStock && maxPrice > minPrice
                      ? Math.round(((maxPrice - item.price) / maxPrice) * 100) : 0;

                    return (
                      <div
                        key={item._id || item.shopName}
                        className={[
                          "cmp-card",
                          !item.inStock            ? "cmp-card--oos"      : "",
                          isLowest                 ? "cmp-card--best"     : "",
                          isAIPick && !isLowest    ? "cmp-card--ai"       : "",
                          isCompared               ? "cmp-card--selected" : "",
                        ].join(" ")}
                        style={{ "--i": i, "--shop-color": getShopColor(item.shopName) }}
                      >
                        {/* Badges row */}
                        <div className="cmp-card__badges">
                          {isLowest              && <span className="cmp-badge cmp-badge--best">🏆 Best Price</span>}
                          {isAIPick && !isLowest && <span className="cmp-badge cmp-badge--ai">🤖 AI Pick</span>}
                          {item.badge            && <span className="cmp-badge cmp-badge--shop">{item.badge}</span>}
                          {!item.inStock         && <span className="cmp-badge cmp-badge--oos">Out of Stock</span>}
                          {savePct > 0           && <span className="cmp-badge cmp-badge--save">Save {savePct}%</span>}
                        </div>

                        {/* Floating action buttons */}
                        <div className="cmp-card__floats">
                          <button
                            className={`cmp-float-btn ${isWished ? "cmp-float-btn--active" : ""}`}
                            onClick={() => toggleShopWish(item.shopName)}
                            title={isWished ? "Remove shortlist" : "Shortlist shop"}
                          >{isWished ? "❤️" : "🤍"}</button>
                          <button
                            className={`cmp-float-btn ${isAlerted ? "cmp-float-btn--alert" : ""}`}
                            onClick={() => togglePriceAlert(item.shopName)}
                            title={isAlerted ? "Remove price alert" : "Set price alert"}
                          >{isAlerted ? "🔔" : "🔕"}</button>
                        </div>

                        {/* Shop header */}
                        <div className="cmp-card__head">
                          <div
                            className="cmp-card__avatar"
                            style={{ background: `linear-gradient(135deg, ${getShopColor(item.shopName)}, ${getShopColor(item.shopName)}88)` }}
                          >
                            {item.profileImage
                              ? <img src={getImageUrl(item.profileImage)} alt={item.shopName} style={{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover"}} onError={e=>e.target.style.display="none"} />
                              : getAvatar(item.shopName)
                            }
                          </div>
                          <div className="cmp-card__shop-info">
                            <h3 className="cmp-card__shop-name">{item.shopName}</h3>
                            <div className="cmp-card__since">{item.ownerName}</div>
                            <StarRating rating={item.rating || 4.5} />
                          </div>
                        </div>

                        {/* Price block */}
                        <div className="cmp-card__price-block">
                          <div className="cmp-card__price">₹{item.price.toLocaleString()}</div>
                          {item.inStock && (
                            <div className="cmp-card__old-price">₹{Math.round(item.price * 1.18).toLocaleString()}</div>
                          )}
                          <PriceBar price={item.price} min={minPrice} max={maxPrice} />
                        </div>

                        {/* Meta chips */}
                        <div className="cmp-card__meta">
                          <span className="cmp-chip cmp-chip--delivery">🚚 {item.delivery}</span>
                          <span className="cmp-chip cmp-chip--sold">🔥 {item.sold}+ sold</span>
                          <span className={`cmp-chip ${item.inStock ? "cmp-chip--stock" : "cmp-chip--oos"}`}>
                            {item.inStock ? "✅ In Stock" : "❌ Out of Stock"}
                          </span>
                        </div>

                        {/* Product image if available */}
                        {item.image && (
                          <div className="cmp-card__product-img-wrap">
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.name}
                              className="cmp-card__product-img"
                              onError={e => e.target.style.display="none"}
                            />
                          </div>
                        )}

                        {/* Actions */}
                        <div className="cmp-card__actions">
                          <button
                            className="cmp-btn-quote"
                            disabled={!item.inStock}
                            onClick={() => handleGetQuote(item)}
                          >
                            {item.inStock ? "Get Quote →" : "Unavailable"}
                          </button>
                          {compareMode && item.inStock && (
                            <button
                              className={`cmp-btn-compare-toggle ${isCompared ? "cmp-btn-compare-toggle--on" : ""}`}
                              onClick={() => toggleCompareId(item.shopName)}
                            >
                              {isCompared ? "✓ Selected" : "+ Compare"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {sortedData.length === 0 && (
                  <div className="cmp-empty">
                    <span>🔍</span>
                    <p>No shops match your current filters.</p>
                    <button onClick={() => { setInStockOnly(false); setShopSearch(""); }}>Reset Filters</button>
                  </div>
                )}
              </>
            )}

            {/* ══════════ TAB: SIDE-BY-SIDE ══════════ */}
            {activeTab === "sidebyside" && (
              <div className="cmp-sbs">
                {compareIds.length === 0 ? (
                  <div className="cmp-sbs__empty">
                    <span className="cmp-sbs__empty-icon">⚖️</span>
                    <h3>Select shops to compare</h3>
                    <p>Go to <strong>Shop Cards</strong> tab, enable <strong>Compare Mode</strong>, then pick up to 3 shops.</p>
                    <button className="cmp-sbs__goto" onClick={() => { setActiveTab("compare"); setCompareMode(true); }}>
                      Enable Compare Mode →
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="cmp-sbs__title">⚖️ Side-by-Side: {compareItems.length} shops selected</h3>
                    <div className="cmp-sbs__table-wrap">
                      <table className="cmp-sbs__table">
                        <thead>
                          <tr>
                            <th className="cmp-sbs__feature-col">Feature</th>
                            {compareItems.map(item => (
                              <th key={item.shopName}>
                                <div className="cmp-sbs__th-inner">
                                  <div className="cmp-sbs__th-av" style={{background:`linear-gradient(135deg,${getShopColor(item.shopName)},#b8762e)`}}>
                                    {getAvatar(item.shopName)}
                                  </div>
                                  <span>{item.shopName}</span>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { label:"💰 Price",      key:"price",    fmt:v=>`₹${v.toLocaleString()}`, winner:"min" },
                            { label:"⭐ Rating",     key:"rating",   fmt:v=>Number(v).toFixed(1),      winner:"max" },
                            { label:"🚚 Delivery",   key:"delivery", fmt:v=>v,                         winner:"del_min" },
                            { label:"🔥 Units Sold", key:"sold",     fmt:v=>`${v}+`,                  winner:"max" },
                            { label:"📦 Stock",      key:"inStock",  fmt:v=>v?"✅ In Stock":"❌ No",   winner:null },
                            { label:"👤 Owner",      key:"ownerName",fmt:v=>v||"—",                   winner:null },
                          ].map(row => {
                            let winnerName = null;
                            if (row.winner==="min")     winnerName = compareItems.reduce((a,b)=>a[row.key]<b[row.key]?a:b).shopName;
                            if (row.winner==="max")     winnerName = compareItems.reduce((a,b)=>a[row.key]>b[row.key]?a:b).shopName;
                            if (row.winner==="del_min") winnerName = compareItems.reduce((a,b)=>DELIVERY_MAP[a.delivery]<DELIVERY_MAP[b.delivery]?a:b).shopName;
                            return (
                              <tr key={row.key}>
                                <td className="cmp-sbs__feature">{row.label}</td>
                                {compareItems.map(item=>(
                                  <td key={item.shopName} className={item.shopName===winnerName?"cmp-sbs__winner":""}>
                                    {item.shopName===winnerName && <span className="cmp-sbs__win-star">🏆 </span>}
                                    {row.fmt(item[row.key])}
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                          <tr>
                            <td className="cmp-sbs__feature">🎯 Action</td>
                            {compareItems.map(item=>(
                              <td key={item.shopName}>
                                <button className="cmp-sbs__quote-btn" disabled={!item.inStock} onClick={()=>handleGetQuote(item)}>
                                  {item.inStock?"Get Quote":"N/A"}
                                </button>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="cmp-sbs__hint">
                      <button onClick={()=>setCompareIds([])}>🗑️ Clear Selection</button>
                      <button onClick={()=>{setActiveTab("compare");setCompareMode(true);}}>+ Add More Shops</button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ══════════ TAB: INSIGHTS ══════════ */}
            {activeTab === "insights" && (
              <div className="cmp-insights">
                <MiniChart shopData={shopData} />

                <div className="cmp-insights__table-card">
                  <h3>📋 Full Price Overview — {selectedProductName}</h3>
                  <table className="cmp-insights__table">
                    <thead>
                      <tr>
                        <th>Shop</th>
                        <th>Price</th>
                        <th>Rating</th>
                        <th>Delivery</th>
                        <th>Sold</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...shopData].sort((a,b)=>a.price-b.price).map((item)=>(
                        <tr key={item._id || item.shopName} className={item.price===minPrice&&item.inStock?"cmp-insights__row--best":""}>
                          <td>
                            <div className="cmp-insights__shop-cell">
                              <span className="cmp-insights__av" style={{background:getShopColor(item.shopName)}}>{getAvatar(item.shopName)}</span>
                              {item.shopName}
                            </div>
                          </td>
                          <td className="cmp-insights__price">₹{item.price.toLocaleString()}</td>
                          <td>{Number(item.rating).toFixed(1)} ⭐</td>
                          <td>🚚 {item.delivery}</td>
                          <td>🔥 {item.sold}+</td>
                          <td>
                            <span className={item.inStock?"cmp-insights__badge-stock":"cmp-insights__badge-oos"}>
                              {item.inStock?"In Stock":"Out"}
                            </span>
                          </td>
                          <td>
                            <button className="cmp-insights__quote-btn" disabled={!item.inStock} onClick={()=>handleGetQuote(item)}>
                              Quote
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary cards */}
                <div className="cmp-insights__summary">
                  <div className="cmp-insights__sum-card">
                    <div className="cmp-insights__sum-icon">💰</div>
                    <div>
                      <div className="cmp-insights__sum-val">₹{maxPrice - minPrice}</div>
                      <div className="cmp-insights__sum-lbl">Total price variance across shops</div>
                    </div>
                  </div>
                  <div className="cmp-insights__sum-card">
                    <div className="cmp-insights__sum-icon">🏆</div>
                    <div>
                      <div className="cmp-insights__sum-val">
                        {shopData.filter(s=>s.inStock).sort((a,b)=>b.rating-a.rating)[0]?.shopName.split(" ")[0]}
                      </div>
                      <div className="cmp-insights__sum-lbl">Highest rated available shop</div>
                    </div>
                  </div>
                  <div className="cmp-insights__sum-card">
                    <div className="cmp-insights__sum-icon">🚀</div>
                    <div>
                      <div className="cmp-insights__sum-val">
                        {shopData.filter(s=>s.inStock).sort((a,b)=>DELIVERY_MAP[a.delivery]-DELIVERY_MAP[b.delivery])[0]?.delivery}
                      </div>
                      <div className="cmp-insights__sum-lbl">Fastest available delivery</div>
                    </div>
                  </div>
                  <div className="cmp-insights__sum-card">
                    <div className="cmp-insights__sum-icon">🔥</div>
                    <div>
                      <div className="cmp-insights__sum-val">
                        {shopData.sort((a,b)=>b.sold-a.sold)[0]?.shopName.split(" ")[0]}
                      </div>
                      <div className="cmp-insights__sum-lbl">Most popular seller</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ── BACK BUTTON ── */}
        <button className="cmp-back-btn" onClick={() => navigate("/ProductsPage")}>
          ← Back to Products
        </button>

      </div>
    </div>
  );
}