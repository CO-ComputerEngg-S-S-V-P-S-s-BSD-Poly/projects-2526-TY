import React, { useState, useEffect } from 'react';
import { Star, Truck, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ProductDetails.css';

const ProductDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // ================= FETCH PRODUCT =================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Product load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-orange-700">
        <Loader2 className="animate-spin" size={40} />
        <span className="ml-3 font-serif">Crafting Details...</span>
      </div>
    );
  }

  // ================= PRODUCT NOT FOUND =================
  if (!product) {
    return (
      <div className="text-center py-20">
        <h3>Product nahi mila!</h3>
        <button onClick={() => navigate('/shop')} className="back-btn">
          Back to Shop
        </button>
      </div>
    );
  }

  // ================= IMAGE LOGIC =================
  const displayImage = product.image?.startsWith('/uploads')
    ? `http://localhost:5000${product.image}`
    : product.image || "https://via.placeholder.com/300";

  // ================= ADD TO CART =================
  const addToCart = () => {

    // 🔐 LOGIN CHECK
    const user = localStorage.getItem("user");

    if (!user) {
      alert("Pehle login karein!");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItem = cart.find(item => item.id === product._id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product._id,   // ✅ FIXED (_id not id)
        name: product.name,
        price: product.price,
        image: displayImage,
        quantity: quantity
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));

    alert(`${product.name} bag mein add ho gaya!`);
    navigate('/cart');
  };

  return (
    <div className="details-container">
      <button onClick={() => navigate(-1)} className="back-btn">
        <ArrowLeft size={18} /> Back to Shop
      </button>

      <div className="details-grid">

        {/* IMAGE SECTION */}
        <div className="details-image-box">
          <img src={displayImage} alt={product.name} className="details-img" />
        </div>

        {/* INFO SECTION */}
        <div className="details-info-box">

          <h2 className="details-title">{product.name}</h2>

          <div className="details-rating-row">
            <Star className="star-filled" size={20} />
            <span className="rating-score">
              {product.rating || '4.5'} | 100% Handmade
            </span>
          </div>

          <p className="details-price">₹{product.price}</p>

          {/* ARTISAN INFO */}
          <div className="artisan-badge-card">
            <p className="artisan-name">
              Artisan: {product.artisan?.firstName || "GramKala"} {product.artisan?.lastName}
            </p>
            <p className="artisan-tagline">
              Location: {product.artisan?.village || 'GramKala Cluster'}
            </p>
          </div>

          <p className="details-desc">{product.description}</p>

          {/* ACTION ROW */}
          <div className="details-action-row">

            {/* Quantity Selector */}
            <div className="quantity-selector">
              <button
                onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)}
                className="qty-btn"
              >
                -
              </button>

              <span className="qty-number">{quantity}</span>

              <button
                onClick={() => setQuantity(q => q + 1)}
                className="qty-btn"
              >
                +
              </button>
            </div>

            <button className="add-cart-main-btn" onClick={addToCart}>
              Add to Cart
            </button>
          </div>

          {/* TRUST BADGES */}
          <div className="trust-badges-grid">
            <div className="badge-item">
              <Truck size={20} className="badge-icon" /> Fast Village Pickup
            </div>
            <div className="badge-item">
              <ShieldCheck size={20} className="badge-icon" /> Quality Certified
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
