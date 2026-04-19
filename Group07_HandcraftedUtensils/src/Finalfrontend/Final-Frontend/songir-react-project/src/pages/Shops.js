import React, { useState, useEffect } from "react";
import { CheckCircle2, Star, Clock, Package, MapPin } from "lucide-react";
import "./Shops.css";

const API_URL = "http://localhost:5000/api/shops/approved";

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========== FETCH APPROVED SHOPS ==========
  const fetchApprovedShops = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch shops");
      }

      const data = await response.json();
      setShops(data);
      setError("");
    } catch (err) {
      console.error("Error:", err);
      setError("Unable to load shops. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedShops();
  }, []);

  // ========== LOADING STATE ==========
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading approved shops...</p>
      </div>
    );
  }

  // ========== ERROR STATE ==========
  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchApprovedShops}>Retry</button>
      </div>
    );
  }

  // ========== NO SHOPS STATE ==========
  if (shops.length === 0) {
    return (
      <div className="no-shops-container">
        <Package size={64} color="#C17A3F" />
        <h2>No Approved Shops Yet</h2>
        <p>Shops will appear here once admin approves them.</p>
      </div>
    );
  }

  // ========== SHOPS GRID ==========
  return (
    <div className="shops-page">
      <div className="page-header">
        <h1>Our Verified Shops</h1>
        <p>Explore {shops.length} approved shops</p>
      </div>

      <div className="shops-grid">
        {shops.map((shop) => (
          <div className="shop-card" key={shop._id}>
            {/* Verified Badge */}
            <div className="verified-badge">
              <CheckCircle2 size={16} />
              Verified
            </div>

            {/* Shop Avatar */}
            <div className="shop-avatar">
              {shop.shopName ? shop.shopName.substring(0, 2).toUpperCase() : "SH"}
            </div>

            {/* Shop Name & Owner */}
            <h3 className="shop-name">{shop.shopName}</h3>
            <p className="shop-owner">{shop.ownerName}</p>

            {/* Rating (Mock for now) */}
            <div className="shop-rating">
              <Star size={16} fill="#F59E0B" color="#F59E0B" />
              <span className="rating-value">4.8</span>
              <span className="rating-reviews">(120 reviews)</span>
            </div>

            {/* Description (if any) */}
            <p className="shop-description">
              Traditional brass and copper utensils crafted with care.
            </p>

            {/* Shop Info */}
            <div className="shop-info">
              <div className="info-item">
                <Clock size={14} />
                <span>{shop.openingTime} - {shop.closingTime}</span>
              </div>
              <div className="info-item">
                <Package size={14} />
                <span>5 products</span>
              </div>
              <div className="info-item">
                <MapPin size={14} />
                <span>{shop.address.substring(0, 20)}...</span>
              </div>
            </div>

            {/* Working Days */}
            {shop.workingDays && shop.workingDays.length > 0 && (
              <div className="working-days">
                {shop.workingDays.map((day, idx) => (
                  <span key={idx} className="day-badge">{day}</span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="shop-actions">
              <button className="btn-view-shop">
                View Shop
              </button>
              <button className="btn-products">
                Products
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shops;






















