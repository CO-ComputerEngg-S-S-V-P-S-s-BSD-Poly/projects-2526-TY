import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Package, ShoppingBag, IndianRupee, Check, X } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {

  const [stats, setStats] = useState({
    artisans: 0,
    products: 0,
    orders: 0,
    sales: 0,
    commission: 0
  });

  const [pendingSellers, setPendingSellers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {

      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`
      };

      // Pending artisans
      const sellersRes = await axios.get(
        "http://localhost:5000/api/auth/pending-sellers",
        { headers }
      );

      // Products
      const productsRes = await axios.get(
        "http://localhost:5000/api/products/admin/all"
      );

      // Orders
      const ordersRes = await axios.get(
        "http://localhost:5000/api/orders/admin/all"
      );

      const orders = ordersRes.data;

      // Total Sales
      const totalSales = orders.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
      );

      // Admin Commission
      const totalCommission = orders.reduce(
        (sum, order) => sum + (order.adminCommission || 0),
        0
      );

      setStats({
        artisans: sellersRes.data.length,
        products: productsRes.data.length,
        orders: orders.length,
        sales: totalSales,
        commission: totalCommission
      });

      setPendingSellers(sellersRes.data);

    } catch (error) {
      console.error("Dashboard fetch error", error);
    }
  };

  const handleAction = async (id, action) => {
    try {

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/auth/approve/${id}`,
        { status: action === "approve" ? "Approved" : "Rejected" },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setPendingSellers(
        pendingSellers.filter(seller => seller._id !== id)
      );

    } catch (error) {
      console.error("Status update error", error);
    }
  };

  return (
    <div className="admin-dashboard">

      {/* STATS */}

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon users"><Users size={24} /></div>
          <div className="stat-info">
            <h3>{stats.artisans}</h3>
            <p>Pending Artisans</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon products"><Package size={24} /></div>
          <div className="stat-info">
            <h3>{stats.products}</h3>
            <p>Live Products</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders"><ShoppingBag size={24} /></div>
          <div className="stat-info">
            <h3>{stats.orders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue"><IndianRupee size={24} /></div>
          <div className="stat-info">
            <h3>₹{stats.sales}</h3>
            <p>Total Sales</p>
          </div>
        </div>

       <div className="stat-card">
  <div className="stat-icon revenue">
    <IndianRupee size={24} />
  </div>

  <div className="stat-info">
    <h3>₹{stats.commission.toFixed(2)}</h3>
    <p>Admin Commission</p>
  </div>
</div>

      </div>


      {/* PENDING APPROVAL TABLE */}

      <div className="approval-section">

        <h2 className="section-title">Pending Artisan Approvals</h2>

        <div className="table-container">

          <table className="admin-table">

            <thead>
              <tr>
                <th>Artisan Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {pendingSellers.length === 0 ? (

                <tr>
                  <td colSpan="4">No pending artisans</td>
                </tr>

              ) : (

                pendingSellers.map(seller => (

                  <tr key={seller._id}>

                    <td>
                      {seller.firstName} {seller.lastName}
                    </td>

                    <td>{seller.email}</td>

                    <td>
                      <span className="status-pending">
                        Pending
                      </span>
                    </td>

                    <td className="actions-cell">

                      <button
                        className="btn-icon approve"
                        onClick={() => handleAction(seller._id, 'approve')}
                      >
                        <Check size={18} />
                      </button>

                      <button
                        className="btn-icon reject"
                        onClick={() => handleAction(seller._id, 'reject')}
                      >
                        <X size={18} />
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
