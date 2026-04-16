import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Clock, CheckCircle, Truck, Loader2 } from 'lucide-react';
import './Orders.css'; // Iska CSS niche diya gaya hai

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Backend se saare orders fetch karein
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        // Note: Aapko backend mein ye endpoint banana padega
        const res = await axios.get('http://localhost:5000/api/orders/admin/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Orders load error:", err);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="animate-spin text-green-600" size={32} />
    </div>
  );

  return (
    <div className="admin-orders-page">
      <div className="page-header">
        <h1><ShoppingBag size={24} /> Customer Orders</h1>
        <p>Manage and track all sales across GramKala.</p>
      </div>

      <div className="orders-table-container">
        {orders.length > 0 ? (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6)}</td>
                  <td>{order.userId?.firstName} {order.userId?.lastName}</td>
                  <td className="amount-cell">₹{order.totalAmount}</td>
                  <td><span className="method-tag">{order.paymentMethod.toUpperCase()}</span></td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status === 'Paid' ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">Abhi tak koi order nahi aaya hai.</div>
        )}
      </div>
    </div>
  );
};

export default Orders;