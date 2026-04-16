import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // 1. LocalStorage se cart items load karein
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  }, []);

  // 2. Item Remove karne ka logic
  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    // Navbar icon update karne ke liye custom event fire kar sakte hain
    window.dispatchEvent(new Event('storage'));
  };

  // 3. Total Calculate karein
  const total = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  // 4. Checkout Logic
  const handleProceedToCheckout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please Login first to place an order!");
      navigate('/login');
    } else {
      navigate('/payment');
    }
  };

  return (
    <div className="cart-page-container">
      <h2 className="cart-title">
        <ShoppingBag className="cart-icon-header" /> Your Shopping Bag
      </h2>

      {cartItems.length > 0 ? (
        <div className="cart-grid">
          {/* Items List */}
          <div className="cart-items-list">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item-card">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h4 className="cart-item-name">{item.name}</h4>
                  <p className="cart-item-price">₹{item.price}</p>
                </div>
                <div className="cart-item-actions">
                  <span className="cart-item-qty">x{item.quantity || 1}</span>
                  <button 
                    className="cart-remove-btn" 
                    onClick={() => removeItem(item.id)}
                    title="Remove Item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Box */}
          <div className="cart-summary-card">
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span className="delivery-free">Free</span>
            </div>
            <div className="summary-total-row">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            <button 
              className="checkout-btn" 
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <div className="cart-empty-state">
          <div className="empty-cart-icon">🛒</div>
          <p className="empty-msg">Aapki bag khali hai!</p>
          <Link to="/shop" className="shop-now-btn">Abhi Shopping Karein</Link>
        </div>
      )}
    </div>
  );
};

export default Cart;