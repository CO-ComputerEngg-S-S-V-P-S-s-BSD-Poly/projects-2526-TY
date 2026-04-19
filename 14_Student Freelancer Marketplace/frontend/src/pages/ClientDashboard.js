import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ClientDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/requests');
        setProjects(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchAllProjects();
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="spinner-border text-primary" role="status"></div>
      <span className="ms-3 fw-bold text-dark">Loading Pulse Dashboard...</span>
    </div>
  );

  return (
    <div className="dashboard-wrapper py-5 min-vh-100" style={{ backgroundColor: '#f0f2f5' }}>
      <div className="container">
        
        {/* Modern Header Section */}
        <div className="text-center mb-5">
          <h2 className="display-4 fw-black text-dark mb-2" style={{ letterSpacing: '-1.5px' }}>
            Project <span style={{ color: '#0061ff' }}>Pulse</span>
          </h2>
          <p className="text-secondary fs-5 fw-medium">Real-time insights into your ongoing projects</p>
          <div className="mx-auto mt-3" style={{ width: '50px', height: '4px', background: 'linear-gradient(90deg, #0061ff, #60efff)', borderRadius: '10px' }}></div>
        </div>
        
        <div className="row g-4 justify-content-center">
          {projects.map((project) => {
            const remaining = project.totalBudget - project.advancePaid;
            const isCompleted = project.progress === 100;
            
            return (
              <div key={project._id} className="col-lg-10">
                <div className="premium-card shadow-lg border-0 rounded-5 overflow-hidden mb-5 bg-white">
                  
                  {/* Header: User & Status */}
                  <div className="px-4 py-4 d-flex justify-content-between align-items-center border-bottom bg-white">
                    <div className="d-flex align-items-center">
                      <div className="avatar-circle me-3">
                         {project.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="fw-bold mb-0 text-dark text-capitalize">{project.fullName}</h4>
                        <span className="badge-service mt-1">
                          <i className="fas fa-layer-group me-1"></i> {project.serviceType}
                        </span>
                      </div>
                    </div>
                    
                    <div className="payment-status">
                      {remaining <= 0 ? (
                        <span className="status-pill status-paid">
                          <i className="fas fa-check-circle me-2"></i>PAID
                        </span>
                      ) : (
                        <span className="status-pill status-pending">
                          <i className="fas fa-hourglass-half me-2"></i>PENDING
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Section */}
                  <div className="card-body p-4 p-lg-5">
                    <div className="row align-items-center mb-4">
                        <div className="col">
                            <small className="text-muted fw-bold text-uppercase" style={{ letterSpacing: '2px' }}>Current Status</small>
                            <h5 className="fw-bold text-dark mt-1">Development & Testing Phase</h5>
                        </div>
                        <div className="col-auto text-end">
                            <span className="progress-percent text-primary fw-black">{project.progress}%</span>
                        </div>
                    </div>

                    <div className="progress-wrapper mb-5">
                      <div className="progress custom-bar shadow-sm" style={{ height: '16px' }}>
                        <div 
                          className={`progress-bar progress-bar-striped progress-bar-animated ${isCompleted ? 'bg-success' : ''}`} 
                          style={{ 
                            width: `${project.progress}%`,
                            background: isCompleted ? '' : 'linear-gradient(90deg, #0061ff, #60efff)'
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="row g-3">
                        <div className="col-md-4">
                            <div className="finance-item text-center p-4 rounded-4">
                                <span className="d-block text-muted small fw-bold mb-2 uppercase">TOTAL BUDGET</span>
                                <span className="h4 fw-bold text-dark">₹{project.totalBudget.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="finance-item text-center p-4 rounded-4 bg-soft-success">
                                <span className="d-block text-success small fw-bold mb-2 uppercase">RECEIVED</span>
                                <span className="h4 fw-bold text-success">₹{project.advancePaid.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="finance-item text-center p-4 rounded-4 bg-soft-danger">
                                <span className={`d-block small fw-bold mb-2 uppercase ${remaining > 0 ? 'text-danger' : 'text-success'}`}>REMAINING</span>
                                <span className={`h4 fw-bold ${remaining > 0 ? 'text-danger' : 'text-success'}`}>₹{remaining.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {projects.length === 0 && (
            <div className="text-center py-5 glass-card rounded-5">
              <div className="display-1 text-muted opacity-25">📂</div>
              <h4 className="text-muted mt-3">No active client projects found.</h4>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com');
        
        .dashboard-wrapper { font-family: 'Plus Jakarta Sans', sans-serif; }
        .fw-black { font-weight: 800; }
        
        .premium-card { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); cursor: default; }
        .premium-card:hover { transform: translateY(-12px); box-shadow: 0 30px 60px rgba(0,0,0,0.1) !important; }
        
        .avatar-circle { width: 50px; height: 50px; background: #0061ff; color: white; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: 800; font-size: 1.2rem; }
        
        .badge-service { background: #f0f6ff; color: #0061ff; padding: 6px 14px; border-radius: 12px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
        
        .status-pill { padding: 8px 18px; border-radius: 100px; font-weight: 800; font-size: 0.7rem; letter-spacing: 1px; }
        .status-paid { background: #e6fcf5; color: #099268; border: 1.5px solid #c3fae8; }
        .status-pending { background: #fff9db; color: #f08c00; border: 1.5px solid #ffec99; }
        
        .progress-percent { font-size: 2.2rem; line-height: 1; }
        .custom-bar { border-radius: 20px; background: #e9ecef; }
        
        .finance-item { border: 1px solid #f1f3f5; transition: all 0.3s ease; }
        .finance-item:hover { background: #f8f9fa; border-color: #dee2e6; }
        
        .bg-soft-success { background: #f4fffb; border-color: #d3f9eb !important; }
        .bg-soft-danger { background: #fff5f5; border-color: #ffe3e3 !important; }

        .uppercase { letter-spacing: 1px; }
      `}</style>
    </div>
  );
}

export default ClientDashboard;
