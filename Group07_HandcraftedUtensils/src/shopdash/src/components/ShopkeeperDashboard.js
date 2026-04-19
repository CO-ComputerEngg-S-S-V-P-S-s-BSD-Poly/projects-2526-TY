import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ShopkeeperSidebar from "./ShopkeeperSidebar";
import "./ShopkeeperDashboard.css";

const STORAGE_KEY = "songir_quotes";

// Helper: get pending quote count from localStorage
const getPendingQuoteCount = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return 0;
    const quotes = JSON.parse(saved);
    return quotes.filter(q => q.status === "pending").length;
  } catch { return 0; }
};

const getTotalQuoteCount = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return 0;
    return JSON.parse(saved).length;
  } catch { return 0; }
};

const ShopkeeperDashboard = () => {
  const navigate = useNavigate();

  const [shopkeeper,     setShopkeeper]     = useState(null);
  const [stats,          setStats]          = useState({ totalProducts: 0, totalViews: 0, enquiries: 0, rating: 0 });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [quoteCount,     setQuoteCount]     = useState(0);
  const [pendingCount,   setPendingCount]   = useState(0);

  // Refresh quote counts from localStorage
  const refreshQuoteCounts = useCallback(() => {
    setQuoteCount(getTotalQuoteCount());
    setPendingCount(getPendingQuoteCount());
  }, []);

  const fetchDashboardData = useCallback(async (shopName) => {
    try {
      const encoded = encodeURIComponent(shopName || "");

      const [statsRes, productsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/shops/stats?shopName=${encoded}`),
        axios.get(`http://localhost:5000/api/shops/products?shopName=${encoded}&limit=4`),
      ]);

      setStats({
        totalProducts: statsRes.data.totalProducts ?? 0,
        totalViews:    statsRes.data.totalViews    ?? 0,
        enquiries:     statsRes.data.enquiries     ?? 0,
        rating:        statsRes.data.rating        ?? 0,
      });
      setRecentProducts(productsRes.data.products || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setStats({ totalProducts: 0, totalViews: 0, enquiries: 0, rating: 0 });
      setRecentProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("shopkeeperToken");
    const data  = sessionStorage.getItem("shopkeeperData");
    if (!token || !data) { navigate("/shopkeeper/login", { replace: true }); return; }
    try {
      const parsed = JSON.parse(data);
      setShopkeeper(parsed);
      fetchDashboardData(parsed.shopName || "");
    } catch {
      setShopkeeper({});
      setLoading(false);
    }
  }, [navigate, fetchDashboardData]);

  // Load quote counts on mount
  useEffect(() => {
    refreshQuoteCounts();

    // Listen for cross-tab localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) refreshQuoteCounts();
    };
    window.addEventListener("storage", handleStorageChange);

    // Poll every 3 seconds for same-tab updates
    const interval = setInterval(refreshQuoteCounts, 3000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [refreshQuoteCounts]);

  if (loading) return (
    <div className="sk-dash-loading">
      <div className="sk-dash-spinner" />
      <p>Loading your dashboard...</p>
    </div>
  );

  const statCards = [
    {
      label:"Total Products", value: stats.totalProducts, icon:"📦", color:"copper", change:"+3 this week",
      onClick: () => navigate("/shopkeeper/products"),
    },
    {
      label:"Shop Views", value: "", icon:"👁️", color:"brass", change:"Live website views",
      onClick: () => navigate("/shopkeeper/shop-profile"),
    },
    {
      // Use live quote count from localStorage
      label:"Get a Quote",
      value: quoteCount,
      icon:"💬",
      color:"green",
      change: pendingCount > 0 ? `+${pendingCount} pending` : "No pending",
      onClick: () => navigate("/shopkeeper/get-a-quote"),
    },
    {
      label:"Shop Rating", value: stats.rating || "—", icon:"⭐", color:"gold", change:"out of 5",
      onClick: () => navigate("/shopkeeper/shop-rating"),
    },
  ];

  return (
    <div className="sk-dash-layout">
      <ShopkeeperSidebar active="dashboard" />
      <div className="sk-dash-main">
        <div className="sk-topbar">
          <div>
            <h1 className="sk-topbar-title">Dashboard</h1>
            <p className="sk-topbar-sub">Welcome back, {shopkeeper?.ownerName || "Shopkeeper"} 👋</p>
          </div>
          <div className="sk-topbar-right">
            <div className="sk-notif-btn">🔔<span className="sk-notif-dot" /></div>
            <button className="sk-add-btn" onClick={() => navigate("/shopkeeper/add-product")}>
              <span>➕</span> Add Product
            </button>
          </div>
        </div>

        <div className="sk-dash-content">
          <div className="sk-shop-banner">
            <div className="sk-banner-left">
              <div className="sk-banner-avatar">
                {shopkeeper?.profileImage
                  ? <img src={`http://localhost:5000/${shopkeeper.profileImage}`} alt="shop" />
                  : "🏺"
                }
              </div>
              <div>
                <h2 className="sk-banner-name">{shopkeeper?.shopName || "Your Shop"}</h2>
                <p className="sk-banner-meta">📍 {shopkeeper?.address || "Location"}</p>
                <div className="sk-banner-status">
                  <span className="sk-status-dot" />
                  {shopkeeper?.status === "approved" ? "Active & Approved" : "Pending Approval"}
                </div>
              </div>
            </div>
            <div className="sk-banner-deco">🏺</div>
          </div>

          {/* 4 Stat Cards */}
          <div className="sk-stats-grid">
            {statCards.map((card, i) => (
              <div
                key={i}
                className={`sk-stat-card sk-stat-${card.color} sk-stat-clickable`}
                onClick={card.onClick}
              >
                <div className="sk-stat-top">
                  <div className="sk-stat-icon">{card.icon}</div>
                  <div className="sk-stat-change">{card.change}</div>
                </div>
                {card.value !== "" && (
                  <div className="sk-stat-val">{card.value}</div>
                )}
                <div className="sk-stat-label">{card.label}</div>
                <div className="sk-stat-link-hint">View details →</div>
              </div>
            ))}
          </div>

          {/* How Product Goes Live */}
          <div className="sk-flow-card">
            <h3 className="sk-flow-title">🔄 How Your Product Goes Live</h3>
            <div className="sk-flow-steps">
              {[
                { icon:"➕", label:"Add Product",     sub:"Fill the form"     },
                { icon:"💾", label:"Auto Saved",      sub:"To your shop"      },
                { icon:"👁️", label:"Admin Views",     sub:"In their panel"    },
                { icon:"🌐", label:"Live on Website", sub:"Customers can see" },
              ].map((step, i, arr) => (
                <React.Fragment key={i}>
                  <div className="sk-flow-step">
                    <div className="sk-flow-circle">{step.icon}</div>
                    <div className="sk-flow-label">{step.label}</div>
                    <div className="sk-flow-sub">{step.sub}</div>
                  </div>
                  {i < arr.length - 1 && <div className="sk-flow-arrow">→</div>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Recent Products */}
          <div className="sk-section-header">
            <div>
              <h3 className="sk-section-title">Recent Products</h3>
              <p className="sk-section-sub">Your latest additions</p>
            </div>
            <button className="sk-view-all" onClick={() => navigate("/shopkeeper/products")}>
              View All →
            </button>
          </div>

          <div className="sk-products-grid">
            {recentProducts.map((product) => (
              <div className="sk-product-card" key={product._id}>
                <div className="sk-product-img">
                  {product.image
                    ? <img src={`http://localhost:5000/${product.image}`} alt={product.name} />
                    : <span className="sk-product-emoji">🏺</span>
                  }
                  <div className="sk-product-badge">{product.category || "General"}</div>
                </div>
                <div className="sk-product-info">
                  <div className="sk-product-name">{product.name}</div>
                  <div className="sk-product-price">₹ {product.price?.toLocaleString()}</div>
                  <div className="sk-product-meta">Stock: {product.stockQty || 0} units</div>
                  <div className="sk-product-actions">
                    <button className="sk-btn-edit" onClick={() => navigate(`/shopkeeper/edit-product/${product._id}`)}>✏️ Edit</button>
                    <button className="sk-btn-delete">🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ShopkeeperDashboard;