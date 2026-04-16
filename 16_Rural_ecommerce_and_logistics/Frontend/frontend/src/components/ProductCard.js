import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  
  // MongoDB ki unique ID hamesha _id hoti hai
  const productId = product._id || product.id; 

  // --- IMAGE URL LOGIC ---
  // Backend se aane wali image ka sahi URL banane ke liye
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150';
    if (imagePath.startsWith('http')) return imagePath;
    
    // Agar path 'uploads' se shuru ho raha hai toh '/' add karke URL banayein
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `http://localhost:5000${cleanPath}`;
  };

  const displayImage = getImageUrl(product.image);

  const handleCartClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation();

    // --- CART SAVE LOGIC ---
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        image: displayImage, // Full URL save karein taaki Cart page par dikhe
        quantity: 1
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Navbar icon update karne ke liye custom event
    window.dispatchEvent(new Event('storage'));

    // Product details page par navigate karein
    navigate(`/product/${productId}`);
  };

  return (
    <div className="p-card-container">
      {/* Product Image Section */}
      <Link to={`/product/${productId}`} className="p-card-image-wrapper">
        <img 
          src={displayImage} 
          alt={product.name} 
          className="p-card-img"
        />
        <div className="p-card-badge">{product.category}</div>
      </Link>
      
      <div className="p-card-body">
        {/* Title Link */}
        <Link to={`/product/${productId}`} className="p-card-title-link">
          <h4 className="p-card-title">{product.name}</h4>
        </Link>
        
        {/* Artisan Info with Null Check */}
        <p className="p-card-artisan">
          By: {product.artisan?.firstName ? `${product.artisan.firstName} ${product.artisan.lastName}` : "GramKala Artisan"}
        </p>
        
        <div className="p-card-rating">
          <Star className="star-icon" size={16} />
          <span className="rating-text">{product.rating || '4.5'}</span>
        </div>
        
        <div className="p-card-footer">
          <span className="p-card-price">₹{product.price}</span>
          <button 
            className="p-card-cart-btn" 
            onClick={handleCartClick} 
            title="Add to Cart & View Details"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;