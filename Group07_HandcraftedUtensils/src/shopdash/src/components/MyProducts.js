import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ShopkeeperSidebar from "./ShopkeeperSidebar";
import "./MyProducts.css";

const CATEGORIES = ["All", "Pots & Vessels", "Pooja Items", "Kitchenware", "Decorative", "Gifts", "Utensils"];
const BASE_URL = "http://localhost:5000";

const MyProducts = () => {
  const navigate = useNavigate();

  // ✅ sessionStorage se shopkeeper data lo
  const sk = JSON.parse(sessionStorage.getItem("shopkeeperData") || "{}");

  const [products,        setProducts]        = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [activeCategory,  setActiveCategory]  = useState("All");
  const [search,          setSearch]          = useState("");
  const [deleteId,        setDeleteId]        = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // ✅ shopName se filter karo — sirf is shopkeeper ke products
      const res = await axios.get(
        `${BASE_URL}/api/products?shopName=${encodeURIComponent(sk.shopName || "")}`
      );

      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      setDeleteId(null);
    } catch (err) {
      alert("Could not delete product.");
    }
  };

  // ✅ stockQty use karo (DB field name)
  const filtered = products.filter(p => {
    const matchCat    = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="sk-dash-layout">
      <ShopkeeperSidebar />

      <div className="sk-dash-main">
        {/* Topbar */}
        <div className="sk-topbar">
          <div>
            <h1 className="sk-topbar-title">My Products</h1>
            <p className="sk-topbar-sub">{products.length} products in your shop</p>
          </div>
          <button className="sk-add-btn" onClick={() => navigate("/shopkeeper/add-product")}>
            ➕ Add Product
          </button>
        </div>

        <div className="mp-content">
          {/* Search + Filter bar */}
          <div className="mp-toolbar">
            <div className="mp-search-wrap">
              <span className="mp-search-icon">🔍</span>
              <input
                className="mp-search-input"
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="mp-cat-tabs">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`mp-cat-tab ${activeCategory === cat ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="mp-loading">
              <div className="sk-dash-spinner" />
              <p>Loading products...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="mp-empty">
              <div className="mp-empty-icon">📦</div>
              <h3>No products found</h3>
              <p>Add your first product to get started</p>
              <button className="sk-add-btn" onClick={() => navigate("/shopkeeper/add-product")}>
                ➕ Add Product
              </button>
            </div>
          ) : (
            <div className="mp-products-grid">
              {filtered.map(product => (
                <div className="mp-product-card" key={product._id}>
                  <div className="mp-product-img">
                    {product.image
                      ? <img
                          src={`${BASE_URL}/${product.image}`}
                          alt={product.name}
                          onError={e => { e.target.src = "https://placehold.co/300x200?text=No+Image"; }}
                        />
                      : <span className="mp-emoji">🏺</span>
                    }
                    <div className="mp-product-badge">{product.category}</div>
                    {/* ✅ stockQty — DB field name */}
                    <div className="mp-stock-badge">
                      {product.stockQty > 0 ? `${product.stockQty} in stock` : "Out of stock"}
                    </div>
                  </div>
                  <div className="mp-product-info">
                    <div className="mp-product-name">{product.name}</div>
                    <div className="mp-product-price">₹{product.price?.toLocaleString()}</div>
                    {product.material && (
                      <div className="mp-product-meta">
                        🔩 {product.material} {product.weight && `• ${product.weight}`}
                      </div>
                    )}
                    {product.description && (
                      <div className="mp-product-desc">
                        {product.description.slice(0, 60)}{product.description.length > 60 ? "..." : ""}
                      </div>
                    )}
                    <div className="mp-product-actions">
                      <button
                        className="mp-btn-edit"
                        onClick={() => navigate(`/shopkeeper/edit-product/${product._id}`)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="mp-btn-delete"
                        onClick={() => setDeleteId(product._id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add New Slot */}
              <div className="sk-empty-slot" onClick={() => navigate("/shopkeeper/add-product")}>
                <div className="sk-empty-icon">➕</div>
                <div className="sk-empty-text">Add New Product</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="mp-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="mp-modal" onClick={e => e.stopPropagation()}>
            <div className="mp-modal-icon">🗑️</div>
            <h3 className="mp-modal-title">Delete Product?</h3>
            <p className="mp-modal-sub">This action cannot be undone.</p>
            <div className="mp-modal-actions">
              <button className="mp-modal-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="mp-modal-confirm" onClick={() => handleDelete(deleteId)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;