import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Form, Badge, InputGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Products.css";

import QuickViewModal from "../components/QuickViewModal";

// ✅ wishlistUtils — sabka ek hi source of truth
import { toggleWishlist, getWishlist } from "../utils/wishlistUtils";

const BASE_URL = "http://localhost:5000";
export const productsData = [];

const CartIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle" }}>
    <circle cx="9" cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

// ─── Helper: localStorage se fresh wishlist IDs lo ───────────────
const getWishIds = () =>
  getWishlist().map(i => String(i._id || i.id || i));

export default function Products({ Cart = [], addToCart, setSelectedProductForQuote }) {
  const navigate = useNavigate();

  const [productsState,   setProductsData]    = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [fetchError,      setFetchError]      = useState("");

  const [searchTerm,       setSearchTerm]       = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy,           setSortBy]           = useState("featured");
  const [priceRange,       setPriceRange]       = useState([0, 10000]);
  const [showFilters,      setShowFilters]      = useState(false);
  const [hoveredCartId,    setHoveredCartId]    = useState(null);
  const [addedId,          setAddedId]          = useState(null);

  // ✅ FIX 1: wishlistIds ek hi jagah se aata hai — getWishIds()
  // Manual setWishlisted(prev => ...) BILKUL NAHI — sirf event se sync
  const [wishlistIds, setWishlistIds] = useState(() => getWishIds());

  // ✅ FIX 2: wishlistUpdated event se SABHI cards sync hote hain
  // Navbar, Search overlay, aur Product page — sab ek saath update
  useEffect(() => {
    const sync = () => setWishlistIds(getWishIds());
    window.addEventListener("wishlistUpdated", sync);
    return () => window.removeEventListener("wishlistUpdated", sync);
  }, []);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const res  = await fetch(`${BASE_URL}/api/products`);
        const data = await res.json();
        if (data.products && Array.isArray(data.products)) {
          setProductsData(data.products);
        } else if (Array.isArray(data)) {
          setProductsData(data);
        } else {
          setFetchError("Products load nahi hue.");
        }
      } catch {
        setFetchError("Server se connect nahi ho pa raha. Backend chal raha hai?");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/400x300?text=No+Image";
    if (img.startsWith("http")) return img;
    return `${BASE_URL}/${img}`;
  };

  const allCategories = useMemo(() =>
    [...new Set(productsState.map(p => p.category))],
  [productsState]);

  const getCartQty = (id) => {
    const item = Cart.find(i => i.id === id || i._id === id);
    return item ? item.quantity : 0;
  };

  const filteredProducts = useMemo(() => {
    let filtered = productsState.filter(p => {
      const matchSearch   = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (p.description || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchPrice    = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchSearch && matchCategory && matchPrice;
    });
    switch (sortBy) {
      case "price-low":  filtered.sort((a, b) => a.price - b.price); break;
      case "price-high": filtered.sort((a, b) => b.price - a.price); break;
      case "rating":     filtered.sort((a, b) => (b.rating||0) - (a.rating||0)); break;
      case "name":       filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
      default:           filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
    }
    return filtered;
  }, [productsState, searchTerm, selectedCategory, sortBy, priceRange]);

  // ✅ FIX 3: toggleLike — sirf toggleWishlist() call karo
  // setWishlistIds MANUALLY MAT KARO — event listener khud sync kar lega
  // Yahi tha asli bug: manual update + event update = double toggle = wrong count
  const toggleLike = (product) => {
    toggleWishlist({
      id:            product._id || product.id,
      _id:           product._id || product.id,
      name:          product.name,
      price:         product.price,
      oldPrice:      product.price + 300,
      originalPrice: product.price + 300,
      image:         product.image,
      category:      product.category,
      shop:          product.shopName || product.shop,
      shopName:      product.shopName || product.shop,
      rating:        product.rating,
      reviews:       product.reviews,
      inStock:       product.inStock,
    });
    // ⛔ setWishlistIds YAH NAHI LIKHNA — event se automatically update hoga
    // wishlistUpdated event dispatch hoga (toggleWishlist ke andar)
    // → sync useEffect chalega → setWishlistIds(getWishIds()) → sab cards update
  };

  const handleAddToCart = (product) => {
    if (typeof addToCart !== "function") return;
    addToCart({
      ...product,
      id: product._id || product.id,
      originalPrice: product.price + 300,
    });
    setAddedId(product._id || product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const handleGetQuote = (product) => {
    if (setSelectedProductForQuote) setSelectedProductForQuote(product);
    setQuickViewProduct(null);
    setTimeout(() => navigate('/quote'), 100);
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setSortBy("featured");
    setPriceRange([0, 10000]);
    setSearchTerm("");
  };

  const CartButton = ({ product, className = "btn-add-cart", fullWidth = false }) => {
    const pid     = product._id || product.id;
    const qty     = getCartQty(pid);
    const isHover = hoveredCartId === pid;
    const isAdded = addedId === pid;

    return (
      <button
        className={`cart-btn-animated ${className} ${isAdded ? "cart-btn-added" : ""} ${!product.inStock ? "cart-btn-disabled" : ""} ${fullWidth ? "w-100" : ""}`}
        disabled={!product.inStock}
        onMouseEnter={() => setHoveredCartId(pid)}
        onMouseLeave={() => setHoveredCartId(null)}
        onClick={() => handleAddToCart(product)}
      >
        <span className={`btn-label-default ${(isHover || isAdded) ? "label-hidden" : ""}`}>
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </span>
        <span className={`btn-label-hover ${isHover && !isAdded ? "label-visible" : ""}`}>
          <CartIcon />
          <span style={{ marginLeft: 6 }}>Add</span>
          {qty > 0 && <span className="cart-qty-badge">{qty}</span>}
        </span>
        <span className={`btn-label-added ${isAdded ? "label-visible" : ""}`}>
          ✓ Added!
        </span>
      </button>
    );
  };

  if (loadingProducts) {
    return (
      <>
        <div className="hero-section">
          <div className="hero-container">
            <h1 className="hero-title">Discover Authentic Copper &amp; Brass Utensils</h1>
            <p className="hero-subtitle">Products load ho rahe hain...</p>
          </div>
        </div>
        <div className="product-container" style={{ textAlign: "center", paddingTop: "4rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏺</div>
          <p style={{ color: "#8d6e63", fontSize: "1.1rem" }}>Loading products from shops...</p>
        </div>
      </>
    );
  }

  if (fetchError) {
    return (
      <div className="product-container" style={{ textAlign: "center", paddingTop: "4rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
        <p style={{ color: "#c62828", fontSize: "1rem" }}>{fetchError}</p>
        <Button variant="warning" onClick={() => window.location.reload()}>🔄 Retry</Button>
      </div>
    );
  }

  return (
    <>
      {/* ✅ QuickView Modal */}
      <QuickViewModal
        product={quickViewProduct
          ? { ...quickViewProduct, image: getImageUrl(quickViewProduct.image) }
          : null
        }
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p) => { handleAddToCart(p); setQuickViewProduct(null); }}
        onViewFullDetails={(p) => {
          setQuickViewProduct(null);
          navigate('/ProductDetail', { state: { product: p } });
        }}
        onToggleWishlist={toggleLike}
        isWishlisted={quickViewProduct
          ? wishlistIds.includes(String(quickViewProduct._id || quickViewProduct.id))
          : false
        }
      />

      {/* Hero */}
      <div className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">Discover Authentic Copper &amp; Brass Utensils</h1>
          <p className="hero-subtitle">Handcrafted traditional cookware for your modern kitchen</p>

          <div className="search-wrapper">
            <InputGroup className="search-bar-group">
              <span className="search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </span>
              <Form.Control
                type="text"
                placeholder="Search by product name, material, or description..."
                className="search-input-modern"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button variant="link" className="search-clear-btn"
                  onClick={() => setSearchTerm("")} aria-label="Clear search">✕</Button>
              )}
            </InputGroup>
            <div className="quick-stats">
              <span className="stat-badge"><strong>{filteredProducts.length}</strong> Products</span>
              <span className="stat-badge"><strong>{allCategories.length}</strong> Categories</span>
              <span className="stat-badge"><strong>{[...new Set(productsState.map(p => p.shopName))].length}</strong> Shops</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div className="filter-bar-container">
          <Button variant="outline-secondary" size="sm" className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="4" y1="12" x2="20" y2="12"/>
              <line x1="4" y1="18" x2="20" y2="18"/>
            </svg>
            Filters
          </Button>

          <div className="category-pills">
            <button className={`pill ${selectedCategory === "All" ? "active" : ""}`}
              onClick={() => setSelectedCategory("All")}>All Products</button>
            {allCategories.map(cat => (
              <button key={cat}
                className={`pill ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}>{cat}</button>
            ))}
          </div>

          <div className="sort-controls">
            <Form.Select size="sm" className="sort-dropdown"
              value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="featured">✨ Newest First</option>
              <option value="price-low">💰 Price: Low to High</option>
              <option value="price-high">💎 Price: High to Low</option>
              <option value="rating">⭐ Highest Rated</option>
              <option value="name">🔤 Name: A-Z</option>
            </Form.Select>
          </div>
        </div>

        {showFilters && (
          <div className="advanced-filters-panel">
            <div className="filter-row">
              <div className="filter-item">
                <label className="filter-label">Price Range: ₹{priceRange[0]} – ₹{priceRange[1]}</label>
                <input type="range" min="0" max="10000" step="100"
                  value={priceRange[1]}
                  onChange={e => setPriceRange([0, parseInt(e.target.value)])}
                  className="price-range-slider"
                />
              </div>
              <Button variant="outline-danger" size="sm"
                onClick={clearFilters} className="clear-filters-btn">Clear All Filters</Button>
            </div>
          </div>
        )}
      </div>

      {/* Product grid */}
      <div className="product-container">
        {filteredProducts.length === 0 ? (
          <div className="no-results-state">
            <div className="no-results-icon">{productsState.length === 0 ? "🏺" : "🔍"}</div>
            <h3>{productsState.length === 0 ? "Abhi koi product nahi hai!" : "No products found"}</h3>
            <p>{productsState.length === 0
              ? "Shopkeepers ne abhi products add nahi kiye. Thodi der baad check karo!"
              : "Try adjusting your filters or search terms"}</p>
            {productsState.length > 0 && (
              <Button variant="primary" onClick={clearFilters}>Clear All Filters</Button>
            )}
          </div>
        ) : (
          <Row className="g-4">
            {filteredProducts.map((product, index) => {
              const pid     = product._id || product.id;
              // ✅ FIX 4: String compare — ID mismatch nahi hoga
              const isLiked = wishlistIds.includes(String(pid));

              return (
                <Col md={6} lg={4} xl={3} key={pid}>
                  <Card className="product-card h-100" style={{ "--card-index": index }}>

                    <div className="product-card-header">
                      <span className={`cat-label cat-${(product.category || "").toLowerCase().replace(/[\s&]+/g, "-")}`}>
                        {product.category}
                      </span>
                      {product.rating > 0 && (
                        <span className="rating-chip">⭐ {product.rating}</span>
                      )}
                    </div>

                    <div className="card-badges-container">
                      {!product.inStock && <span className="out-of-stock-badge">Out of Stock</span>}
                      {product.rating >= 4.8 && <span className="bestseller-badge">🏆 Bestseller</span>}
                    </div>

                    <div className="product-img-wrapper">
                      <Card.Img
                        src={getImageUrl(product.image)}
                        className="product-img"
                        alt={product.name}
                        onError={e => { e.target.src = "https://placehold.co/400x300?text=No+Image"; }}
                      />
                      <div className="img-shimmer" />

                      {/* ✅ Heart button — event driven, sab cards sync */}
                      <span
                        className={`like-btn ${isLiked ? "liked" : ""}`}
                        onClick={(e) => { e.stopPropagation(); toggleLike(product); }}
                        role="button"
                        aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
                        style={{
                          cursor: "pointer",
                          filter: isLiked ? "drop-shadow(0 0 5px rgba(220,38,38,0.6))" : "none",
                          transition: "filter 0.2s, transform 0.2s",
                        }}
                      >
                        {isLiked ? "❤️" : "🤍"}
                      </span>

                      <div className="quick-view-layer">
                        <Button size="sm" variant="light"
                          onClick={() => setQuickViewProduct(product)}
                          className="quick-view-btn">
                          Quick View
                        </Button>
                      </div>
                    </div>

                    <Card.Body className="d-flex flex-column product-card-body">
                      <div className="product-title">{product.name}</div>
                      <div className="shop-name">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                          <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                        {product.shopName}
                      </div>

                      {product.reviews > 0 && (
                        <div className="rating-section">
                          <span className="rating-stars">★★★★★</span>
                          <span className="review-count">({product.reviews})</span>
                        </div>
                      )}

                      <div className="price-row mt-2">
                        <div className="price-main">₹{product.price.toLocaleString()}</div>
                        <div className="price-details">
                          <span className="old-price">₹{(product.price + 300).toLocaleString()}</span>
                          <span className="save-badge">Save ₹300</span>
                        </div>
                      </div>

                      <div className="btn-row mt-auto">
                        <CartButton product={product} />
                        <Button size="sm" variant="info"
                          onClick={() => setQuickViewProduct(product)}
                          className="btn-view-details">
                          View
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </div>
    </>
  );
}