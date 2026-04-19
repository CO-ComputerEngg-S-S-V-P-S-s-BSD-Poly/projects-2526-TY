import React from 'react';
import { Star, Clock, Package, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';

const ShopCard = ({ shop, onViewShop, onViewProducts }) => (
  <div className="shop-card">
    {shop.verified && (
      <div className="verified-badge">
        <CheckCircle2 size={16} />
        Verified
      </div>
    )}
    
    <div className="shop-avatar">
      {shop.initials}
    </div>

    <h3 className="shop-name">{shop.name}</h3>
    <p className="shop-owner">{shop.owner}</p>

    <div className="shop-rating">
      <Star size={16} fill="#F59E0B" color="#F59E0B" />
      <span className="rating-value">{shop.rating}</span>
      <span className="rating-reviews">({shop.reviews} reviews)</span>
    </div>

    <p className="shop-description">{shop.description}</p>

    <div className="shop-info">
      <div className="info-item">
        <Clock size={14} />
        <span>{shop.years} years</span>
      </div>
      <div className="info-item">
        <Package size={14} />
        <span>{shop.products} products</span>
      </div>
      <div className="info-item">
        <MapPin size={14} />
        <span>{shop.location}</span>
      </div>
    </div>

    <div className="shop-tags">
      {shop.tags.map((tag, idx) => (
        <span key={idx} className="tag">{tag}</span>
      ))}
    </div>

    <div className="shop-actions">
      <button 
        className="btn-view-shop"
        onClick={() => onViewShop(shop)}
      >
        View Shop <ChevronRight size={16} />
      </button>
      <button 
        className="btn-products"
        onClick={onViewProducts}
      >
        Products
      </button>
    </div>
  </div>
);

const ShopsView = ({ data, onViewShop, onNavigateToProducts }) => {
  return (
    <div className="view-content">
      <div className="page-header">
        <h1 className="page-title">Shops Management</h1>
        <p className="page-subtitle">Showing {data.shops.length} of {data.shops.length} shops</p>
      </div>

      <div className="shops-grid">
        {data.shops.map((shop) => (
          <ShopCard 
            key={shop.id} 
            shop={shop}
            onViewShop={onViewShop}
            onViewProducts={onNavigateToProducts}
          />
        ))}
      </div>
    </div>
  );
};

export default ShopsView;
