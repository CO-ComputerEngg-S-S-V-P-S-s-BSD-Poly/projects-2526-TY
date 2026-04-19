import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import logo from '../logo.jpg';

const SupervisorDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [materials, setMaterials] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [myHistory, setMyHistory] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestForm, setRequestForm] = useState({ materialId: '', quantityRequested: '', reason: '' });

  const fetchAll = useCallback(async () => {
    try {
      const [mRes, rRes, hRes] = await Promise.all([
        axios.get('/api/materials'),
        axios.get('/api/my-requests'),
        axios.get('/api/my-usage-history'),
      ]);
      setMaterials(mRes.data);
      setMyRequests(rRes.data);
      setMyHistory(hRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/request', requestForm);
      toast.success('Request submitted successfully!');
      setShowRequestModal(false);
      setRequestForm({ materialId: '', quantityRequested: '', reason: '' });
      fetchAll();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit request');
    } finally { setLoading(false); }
  };

  const pendingCount = myRequests.filter(r => r.status === 'Pending').length;
  const approvedCount = myRequests.filter(r => r.status === 'Approved').length;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="Padmashree Builders" className="sidebar-logo-img" />
          <h2>Padmashree<br/>Builders</h2>
          <p className="sidebar-panel-label">Supervisor Panel</p>
          {user?.site && (
            <div className="site-pill">
              <i className="fas fa-map-marker-alt" /><span>{user.site}</span>
            </div>
          )}
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-title">Main</div>
          {[
            { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
            { id: 'materials', icon: 'fa-boxes', label: 'View Materials' },
            { id: 'requests', icon: 'fa-clipboard-list', label: 'My Requests' },
            { id: 'history', icon: 'fa-history', label: 'Issued History' },
          ].map(item => (
            <button key={item.id} className={`nav-item ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id)}>
              <i className={`fas ${item.icon}`}></i> {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <div className="name">{user?.name}</div>
              <div className="role site-label">{user?.site || user?.role}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}><i className="fas fa-sign-out-alt"></i> Logout</button>
        </div>
      </aside>

      <main className="main-content">
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <>
            <div className="page-header">
              <h1>Supervisor Dashboard</h1>
              <p>Welcome, {user?.name}!{user?.site ? ` You are managing ${user.site}.` : ' Manage your material requests here.'}</p>
            </div>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-icon orange"><i className="fas fa-boxes"></i></div><div className="stat-info"><div className="value">{materials.length}</div><div className="label">Available Materials</div></div></div>
              <div className="stat-card"><div className="stat-icon blue"><i className="fas fa-clipboard-list"></i></div><div className="stat-info"><div className="value">{myRequests.length}</div><div className="label">My Total Requests</div></div></div>
              <div className="stat-card"><div className="stat-icon yellow"><i className="fas fa-clock"></i></div><div className="stat-info"><div className="value">{pendingCount}</div><div className="label">Pending Requests</div></div></div>
              <div className="stat-card"><div className="stat-icon green"><i className="fas fa-check-circle"></i></div><div className="stat-info"><div className="value">{approvedCount}</div><div className="label">Approved Requests</div></div></div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2>Quick Request Material</h2>
                <button className="btn btn-primary" onClick={() => setShowRequestModal(true)}><i className="fas fa-plus"></i> New Request</button>
              </div>
              <div className="alert alert-info"><i className="fas fa-info-circle"></i> Submit a request to get materials issued from stock. Admin will approve or reject your request.</div>
            </div>

            <div className="card">
              <div className="card-header"><h2>My Recent Requests</h2></div>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Material</th><th>Requested Qty</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {myRequests.slice(0,5).map(r => (
                      <tr key={r._id}>
                        <td>{r.materialId?.name}</td>
                        <td>{r.quantityRequested} {r.materialId?.unit}</td>
                        <td><span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span></td>
                        <td>{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                    {myRequests.length === 0 && <tr><td colSpan="4"><div className="empty-state"><i className="fas fa-inbox"></i><p>No requests yet. Submit your first request!</p></div></td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* MATERIALS TAB */}
        {activeTab === 'materials' && (
          <>
            <div className="page-header-row">
              <div className="page-header"><h1>Available Materials</h1><p>Check current stock levels</p></div>
              <button className="btn btn-primary" onClick={() => setShowRequestModal(true)}><i className="fas fa-plus"></i> Request Material</button>
            </div>
            <div className="card">
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Name</th><th>Category</th><th>Available Stock</th><th>Unit</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {materials.map(m => (
                      <tr key={m._id}>
                        <td>{m.name}</td><td>{m.category}</td>
                        <td className={m.quantity < m.threshold ? 'qty-low' : 'qty-ok'}>{m.quantity}</td>
                        <td>{m.unit}</td>
                        <td><span className={`badge ${m.quantity < m.threshold ? 'badge-low' : 'badge-ok'}`}>{m.quantity < m.threshold ? 'Low Stock' : 'In Stock'}</span></td>
                        <td>
                          <button className="btn btn-primary btn-sm" onClick={() => { setRequestForm({...requestForm, materialId: m._id}); setShowRequestModal(true); }}>
                            <i className="fas fa-hand-paper"></i> Request
                          </button>
                        </td>
                      </tr>
                    ))}
                    {materials.length === 0 && <tr><td colSpan="6"><div className="empty-state"><i className="fas fa-boxes"></i><p>No materials available</p></div></td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* MY REQUESTS TAB */}
        {activeTab === 'requests' && (
          <>
            <div className="page-header-row">
              <div className="page-header"><h1>My Requests</h1><p>Track status of all your material requests</p></div>
              <button className="btn btn-primary" onClick={() => setShowRequestModal(true)}><i className="fas fa-plus"></i> New Request</button>
            </div>
            <div className="card">
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Material</th><th>Category</th><th>Requested Qty</th><th>Reason</th><th>Status</th><th>Admin Note</th><th>Date</th></tr></thead>
                  <tbody>
                    {myRequests.map(r => (
                      <tr key={r._id}>
                        <td>{r.materialId?.name}</td>
                        <td>{r.materialId?.category}</td>
                        <td>{r.quantityRequested} {r.materialId?.unit}</td>
                        <td className="td-truncate">{r.reason || '—'}</td>
                        <td><span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span></td>
                        <td className="processed-label">{r.adminNote || '—'}</td>
                        <td>{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                    {myRequests.length === 0 && <tr><td colSpan="7"><div className="empty-state"><i className="fas fa-clipboard-list"></i><p>No requests submitted yet</p></div></td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ISSUED HISTORY TAB */}
        {activeTab === 'history' && (
          <>
            <div className="page-header"><h1>Issued History</h1><p>Materials issued to you</p></div>
            <div className="card">
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Material</th><th>Category</th><th>Qty Used</th><th>Unit</th><th>Issued Date</th></tr></thead>
                  <tbody>
                    {myHistory.map(h => (
                      <tr key={h._id}>
                        <td>{h.materialId?.name}</td>
                        <td>{h.materialId?.category}</td>
                        <td>{h.quantityUsed}</td>
                        <td>{h.materialId?.unit}</td>
                        <td>{new Date(h.issuedDate).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                    {myHistory.length === 0 && <tr><td colSpan="5"><div className="empty-state"><i className="fas fa-history"></i><p>No issued materials yet</p></div></td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="modal-overlay" onClick={() => setShowRequestModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-hand-paper modal-icon"></i>Request Material</h3>
              <button className="modal-close" onClick={() => setShowRequestModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleRequestSubmit}>
              <div className="form-grid form-grid-single">
                <div className="form-group">
                  <label>Select Material *</label>
                  <select value={requestForm.materialId} onChange={e => setRequestForm({...requestForm, materialId: e.target.value})} required>
                    <option value="">-- Select Material --</option>
                    {materials.map(m => (
                      <option key={m._id} value={m._id}>{m.name} ({m.category}) — Stock: {m.quantity} {m.unit}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Quantity Required *</label>
                  <input type="number" min="1" value={requestForm.quantityRequested}
                    onChange={e => setRequestForm({...requestForm, quantityRequested: e.target.value})}
                    placeholder="Enter quantity" required />
                </div>
                <div className="form-group">
                  <label>Reason (Optional)</label>
                  <textarea rows="3" value={requestForm.reason}
                    onChange={e => setRequestForm({...requestForm, reason: e.target.value})}
                    placeholder="Why do you need this material?"
                    className="textarea-noresize"></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRequestModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</> : <><i className="fas fa-paper-plane"></i> Submit Request</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorDashboard;
