import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './MyOrders.css'

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Parse karte waqt fallback empty object rakhein
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Check karein ki id ya _id dono mein se koi maujood ho
    const userId = user._id || user.id;

    if (!userId) {
      console.log("User not found in localStorage");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/orders/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setOrders(res.data);
      } catch (err) {
        console.error("Order load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user.id, user._id]); // Dependency array mein specific fields rakhein

  if (loading) {
    return <h3 style={{ textAlign: "center", marginTop: "50px" }}>Loading Orders...</h3>;
  }

  return (
    <div className="orders-container" style={{ padding: '20px' }}>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center' }}>
          <p>Aapne abhi tak koi order nahi kiya hai.</p>
          <Link to="/">Shopping Karein</Link>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card" style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
            <div className="order-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Order ID: #{order._id.slice(-6).toUpperCase()}</span>
              {/* Dynamic status colors */}
              <span className={`status-badge`} style={{
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                background: order.status === 'Processing' ? '#fef3c7' : '#dcfce7',
                color: order.status === 'Processing' ? '#92400e' : '#166534'
              }}>
                {order.status || "Pending"}
              </span>
            </div>

            <div className="order-items" style={{ margin: '15px 0' }}>
              {order.items?.map((item) => (
                <div key={item._id} className="order-item" style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                  <img 
                    src={item.product?.image ? (item.product.image.startsWith("/uploads") ? `http://localhost:5000${item.product.image}` : item.product.image) : "https://via.placeholder.com/60"} 
                    alt={item.product?.name} width="60" 
                  />
                  <div>
                    <p style={{ margin: 0 }}>{item.product?.name || "Product deleted"}</p>
                    <small>Qty: {item.quantity} | Price: ₹{item.price}</small>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer" style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
              <strong>Total: ₹{order.totalAmount}</strong>
              <br />
              <small>Payment: {order.paymentMethod} | {order.paymentStatus}</small>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;