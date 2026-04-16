import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../Components/AdminSidebar';
import { Loader2 } from 'lucide-react'; // Loading icon ke liye
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    inProgress: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/complaints/all', {
          headers: { 'x-auth-token': token }
        });

        const allComplaints = res.data;

        // Data ko filter karke counts nikalna
        setStats({
          total: allComplaints.length,
          pending: allComplaints.filter(c => c.status === 'Pending').length,
          resolved: allComplaints.filter(c => c.status === 'Resolved').length,
          inProgress: allComplaints.filter(c => c.status === 'In Progress').length
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="admin-loading">
        <Loader2 className="spinner" /> <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <h1>Dashboard Overview</h1>
        
        <div className="stats-grid">
          {/* Total Complaints */}
          <div className="stat-card blue">
            <h3>{stats.total}</h3>
            <p>Total Complaints</p>
          </div>

          {/* Pending Complaints */}
          <div className="stat-card yellow">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>

          {/* In Progress (Optional) */}
          <div className="stat-card orange">
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>

          {/* Resolved Complaints */}
          <div className="stat-card green">
            <h3>{stats.resolved}</h3>
            <p>Resolved</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;