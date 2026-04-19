import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState("");

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passInput === "admin123") {
      setIsAuthenticated(true);
      fetchRequests();
    } else {
      alert("❌ Access Denied: Incorrect Password!");
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/requests');
      setRequests(res.data);
      setLoading(false);
    } catch (err) { 
      console.error(err); 
      setLoading(false); 
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await axios.put(`http://localhost:5000/api/update-status/${id}`, updatedData);
      fetchRequests(); 
    } catch (err) { 
      alert("System Error: Update failed."); 
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="login-overlay d-flex align-items-center justify-content-center min-vh-100">
        <div className="login-card shadow-lg p-5 border-0 rounded-4 text-center">
          <div className="icon-badge-top mx-auto mb-3">
             <i className="fas fa-user-lock"></i>
          </div>
          <h3 className="fw-bold mb-1 text-dark">Admin Access</h3>
          <p className="text-muted small mb-4">Verification required to proceed</p>
          <form onSubmit={handleAdminLogin}>
            <input 
              type="password" 
              className="form-control mb-3 text-center border-0 bg-light py-2" 
              placeholder="••••••••" 
              onChange={(e) => setPassInput(e.target.value)}
              required 
            />
            <button className="btn btn-primary w-100 fw-bold shadow-sm py-2">Unlock Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) return <div className="text-center py-5 text-muted">Initialising Secure Dashboard...</div>;

  return (
    <div className="admin-bg min-vh-100 pb-5">
      
      {/* 1. Dashboard Header */}
      <header className="dashboard-header py-4 shadow-sm mb-5">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold mb-0 text-white">Freelancer <span className="text-info">Admin</span></h2>
            <p className="text-white-50 small mb-0">Marketplace Management Portal • 2026</p>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-success-soft text-success px-3 py-2 rounded-pill">Server: Online</span>
            <button className="btn btn-outline-light btn-sm fw-bold px-3 rounded-pill" onClick={() => setIsAuthenticated(false)}>Sign Out</button>
          </div>
        </div>
      </header>

      <div className="container">
        {/* 2. Quick Stats Section */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="stat-pill p-3 shadow-sm bg-white rounded-4 border-start border-primary border-4">
              <small className="text-muted fw-bold text-uppercase">Total Projects</small>
              <h3 className="fw-bold mb-0">{requests.length}</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-pill p-3 shadow-sm bg-white rounded-4 border-start border-success border-4">
              <small className="text-muted fw-bold text-uppercase">Active Clients</small>
              <h3 className="fw-bold mb-0">{requests.filter(r => r.progress < 100).length}</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-pill p-3 shadow-sm bg-white rounded-4 border-start border-warning border-4">
              <small className="text-muted fw-bold text-uppercase">Pending Payments</small>
              <h3 className="fw-bold mb-0">{requests.filter(r => r.paymentStatus !== 'Paid').length}</h3>
            </div>
          </div>
        </div>

        {/* 3. Project Cards */}
        <div className="row g-4">
          {requests.map((project) => {
            const remaining = project.totalBudget - project.advancePaid;
            return (
              <div key={project._id} className="col-12">
                <div className="card shadow-sm border-0 rounded-4 admin-pro-card">
                  <div className="row g-0 align-items-center">
                    
                    {/* Client Info Section */}
                    <div className="col-md-3 p-4 border-end-light">
                      <h5 className="fw-bold mb-1 text-dark text-capitalize">{project.fullName}</h5>
                      <div className="badge bg-light text-primary border rounded-pill mb-2 px-3">{project.serviceType}</div>
                      <div className="text-muted small"><i className="far fa-envelope me-2"></i>{project.email}</div>
                    </div>

                    {/* Progress Control Section */}
                    <div className="col-md-4 p-4 text-center">
                      <div className="d-flex justify-content-between mb-2">
                        <small className="fw-bold text-muted text-uppercase">Task Progress</small>
                        <small className="fw-bold text-primary">{project.progress}%</small>
                      </div>
                      <div className="progress rounded-pill mb-3" style={{ height: '8px', backgroundColor: '#e9ecef' }}>
                        <div className="progress-bar bg-primary progress-bar-striped progress-bar-animated" style={{ width: `${project.progress}%` }}></div>
                      </div>
                      <input 
                        type="range" className="form-range pro-range" min="0" max="100" 
                        value={project.progress} 
                        onChange={(e) => handleUpdate(project._id, { progress: e.target.value })}
                      />
                    </div>

                    {/* Financial Management */}
                    <div className="col-md-3 p-4 text-center border-start-light border-end-light">
                      <small className="text-muted d-block text-uppercase fw-bold ls-1 mb-2">Remaining Balance</small>
                      <h3 className={`fw-bold mb-3 ${remaining > 0 ? 'text-danger' : 'text-success'}`}>
                        ₹{remaining}
                      </h3>
                      <div className="d-flex justify-content-center gap-2">
                        <button className="btn btn-xs btn-dark py-1 px-3 rounded-pill fw-bold" style={{fontSize:'10px'}} onClick={() => {
                          const budget = prompt("Update Total Budget:", project.totalBudget);
                          if(budget) handleUpdate(project._id, { totalBudget: budget });
                        }}>Set Budget</button>
                        
                        <button className="btn btn-xs btn-outline-dark py-1 px-3 rounded-pill fw-bold" style={{fontSize:'10px'}} onClick={() => {
                          const paid = prompt("Update Amount Received:", project.advancePaid);
                          if(paid) {
                             const status = Number(paid) >= project.totalBudget ? 'Paid' : 'Unpaid';
                             handleUpdate(project._id, { advancePaid: paid, paymentStatus: status });
                          }
                        }}>Add Payment</button>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="col-md-2 p-4 text-center">
                      <button className="btn btn-link text-danger text-decoration-none fw-bold" onClick={() => {if(window.confirm("Permanent Delete?")) axios.delete(`http://localhost:5000/api/delete-request/${project._id}`).then(fetchRequests)}}>
                        <i className="fas fa-trash-alt me-2"></i>Delete
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .admin-bg { background-color: #f8f9fc; }
        .dashboard-header { background: linear-gradient(135deg, #0f2027, #203a43); color: white; }
        .login-overlay { background: linear-gradient(rgba(15, 32, 39, 0.9), rgba(15, 32, 39, 0.9)), url('https://images.unsplash.com'); background-size: cover; }
        .login-card { width: 400px; background: white; }
        .icon-badge-top { width: 60px; height: 60px; background: #0d6efd; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
        .admin-pro-card { background: #ffffff; transition: all 0.3s ease; border: 1px solid #edf2f9; }
        .admin-pro-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.05) !important; }
        .border-start-light { border-left: 1px solid #edf2f9; }
        .border-end-light { border-right: 1px solid #edf2f9; }
        .ls-1 { letter-spacing: 1px; font-size: 0.7rem; }
        .pro-range::-webkit-slider-thumb { background: #0d6efd; }
        .bg-success-soft { background-color: rgba(25, 135, 84, 0.1); }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
