import React from 'react';
import { Search} from 'lucide-react';
import { statusColors } from '../data/MockData';

const OrderRow = ({ order, showActions = false }) => {
  const handleOrderClick = (orderId) => {
    alert(`Order ${orderId} details`);
  };

  return (
    <tr 
      className="order-row" 
      onClick={() => handleOrderClick(order.id)}
      style={{ cursor: 'pointer' }}
    >
      <td className="order-id">{order.id}</td>
      {showActions && <td>{order.date}</td>}
      <td>{order.customer}</td>
      <td>{order.shop}</td>
      <td>₹{order.amount.toLocaleString()}</td>
      <td>
        <span className="status-badge" style={{ 
          backgroundColor: statusColors[order.status] + '20', 
          color: statusColors[order.status] 
        }}>
          {order.status}
        </span>
      </td>
    </tr>
  );
};

const OrderView = ({ data, searchTerm, setSearchTerm }) => {
  const filteredOrders = data.orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.shop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="view-content">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">All Orders</h1>
          <p className="page-subtitle">Manage and track all your orders</p>
        </div>
        {/* <div className="page-actions">
          <button className="filter-btn">
            <Filter size={18} />
            Filter
          </button>
          <button className="download-btn">
            <Download size={18} />
            Export
          </button>
        </div> */}
      </div>

      <div className="search-container">
        <Search size={20} />
        <input 
          type="text"
          placeholder="Search orders by ID, customer name, or shop..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="orders-card">
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Shop</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, idx) => (
                  <OrderRow key={idx} order={order} showActions={true} />
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderView;
