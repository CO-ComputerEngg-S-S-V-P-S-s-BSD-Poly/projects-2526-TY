import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Banknote, ShieldCheck, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Payment.css';

const Payment = () => {
  const [method, setMethod] = useState('upi');
  const [totalAmount, setTotalAmount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // 1. Cart se asli amount calculate karein
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
    const total = savedCart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
    setTotalAmount(total);
  }, []);

  // 2. Order place karne ka logic
  const handlePayment = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!token) {
        alert("Please login to complete your order.");
        return navigate('/login');
      }

      // Order Data tayyar karein
      const orderData = {
        userId: user.id,
        items: cartItems.map(item => ({
          product: item.id || item._id,
          quantity: item.quantity || 1,
          price: item.price
        })),
        totalAmount: totalAmount,
        paymentMethod: method,
        status: method === 'cod' ? 'Processing' : 'Paid'
      };

      // Backend API call (Aapko backend mein /api/orders route banana hoga)
      // Filhal hum success simulate kar rahe hain jab tak backend route ready nahi hota
      const res = await axios.post('http://localhost:5000/api/orders/place', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(`Sukriya! Aapka ${method.toUpperCase()} order place ho gaya hai.`);
      
      // Order hone ke baad cart khali kar dein
      localStorage.removeItem('cart');
      navigate('/order-success'); // Success page par bhejein

    } catch (err) {
      console.error("Order error:", err);
      alert("Order place karne mein galti hui. Kripya dobara koshish karein.");
    }
  };

  return (
    <div className="payment-page-container">
      <div className="payment-card">
        <header className="payment-header">
          <h2>Secure Checkout</h2>
          <p>GramKala – Supporting Rural Artisans</p>
        </header>

        <div className="order-summary-mini">
          <span>Amount to Pay:</span>
          <span className="pay-amount">₹{totalAmount}</span>
        </div>

        <form onSubmit={handlePayment} className="payment-form">
          <p className="selection-label">Select Payment Method</p>
          
          <div className="methods-grid">
            <div 
              className={`method-option ${method === 'upi' ? 'selected' : ''}`}
              onClick={() => setMethod('upi')}
            >
              <Smartphone size={24} />
              <div className="method-info">
                <strong>UPI (GPay, PhonePe)</strong>
                <small>Pay instantly using UPI apps</small>
              </div>
              <div className="method-radio"></div>
            </div>

            <div 
              className={`method-option ${method === 'card' ? 'selected' : ''}`}
              onClick={() => setMethod('card')}
            >
              <CreditCard size={24} />
              <div className="method-info">
                <strong>Debit / Credit Card</strong>
                <small>All major cards accepted</small>
              </div>
              <div className="method-radio"></div>
            </div>

            <div 
              className={`method-option ${method === 'cod' ? 'selected' : ''}`}
              onClick={() => setMethod('cod')}
            >
              <Banknote size={24} />
              <div className="method-info">
                <strong>Cash On Delivery</strong>
                <small>Pay when you receive the craft</small>
              </div>
              <div className="method-radio"></div>
            </div>
          </div>

          <button type="submit" className="pay-now-btn" disabled={totalAmount === 0}>
            {method === 'cod' ? 'Confirm Order' : `Pay ₹${totalAmount}`} <ChevronRight size={18} />
          </button>
        </form>

        <footer className="payment-footer">
          <ShieldCheck size={16} /> 100% Secure Transaction via SSL Encryption
        </footer>
      </div>
    </div>
  );
};

export default Payment;