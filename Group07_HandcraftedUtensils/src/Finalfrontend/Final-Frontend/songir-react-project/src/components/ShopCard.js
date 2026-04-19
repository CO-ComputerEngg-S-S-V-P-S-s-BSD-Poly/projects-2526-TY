import React from "react";

const ShopCard = ({ shop }) => {
  return (
    <div className="shop-card">
      <div className="shop-avatar">
        {shop.name.split(" ")[0][0]}
      </div>

      <span className="verified">Verified</span>

      <h3>{shop.name}</h3>
      <p className="owner">{shop.owner}</p>

      <div className="rating">
        ⭐ {shop.rating}
      </div>

      <p className="meta">
        Experience: {shop.exp} years • {shop.products} products
      </p>

      <button>View Shop</button>
    </div>
  );
};

export default ShopCard;