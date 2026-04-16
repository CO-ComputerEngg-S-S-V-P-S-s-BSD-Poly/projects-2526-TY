import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import logo from '../logo.jpg';

const SITES = [
  'Shivashree 12',
  'Shivashree 7D',
  'Shivashree 9D',
  'Shivashree 12A',
  'Padmashree 8',
  'Padmashree Park Nashik',
  'Padmashree 9',
  'Ekdant Padmashree Heights',
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [materials, setMaterials]       = useState([]);
  const [requests, setRequests]         = useState([]);
  const [usageHistory, setUsageHistory] = useState([]);
  const [lowStock, setLowStock]         = useState([]);
  const [supervisors, setSupervisors]   = useState([]);
  const [loading, setLoading] = useState(false);

  // Material modal
  const [showAddModal, setShowAddModal]   = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMaterial, setEditMaterial]   = useState(null);
  const [form, setForm] = useState({ name: '', category: 'Cement', quantity: '', unit: 'bag', pricePerUnit: '', threshold: '50' });

  // Supervisor modal
  const [showAddSupModal, setShowAddSupModal]   = useState(false);
  const [showEditSupModal, setShowEditSupModal] = useState(false);
  const [editSupervisor, setEditSupervisor]     = useState(null);
  const [supForm, setSupForm] = useState({ name: '', email: '', username: '', password: '', site: '' });

  const fetchAll = useCallback(async () => {
    try {
      const [mRes, rRes, uRes, lRes, sRes] = await Promise.all([
        axios.get('/api/materials'),
        axios.get('/api/requests'),
        axios.get('/api/usage-history'),
        axios.get('/api/materials/low-stock'),
        axios.get('/api/supervisors'),
      ]);
      setMaterials(mRes.data); setRequests(rRes.data);
      setUsageHistory(uRes.data); setLowStock(lRes.data);
      setSupervisors(sRes.data);
    } catch { toast.error('Failed to load data'); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const resetForm = () => setForm({ name: '', category: 'Cement', quantity: '', unit: 'bag', pricePerUnit: '', threshold: '50' });
  const resetSupForm = () => setSupForm({ name: '', email: '', username: '', password: '', site: '' });

  // ── Material handlers ──────────────────────────────────────────────────────
  const handleAddMaterial = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await axios.post('/api/material', form); toast.success('Material added!'); setShowAddModal(false); resetForm(); fetchAll(); }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await axios.put(`/api/material/${editMaterial._id}`, form); toast.success('Material updated!'); setShowEditModal(false); fetchAll(); }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await axios.delete(`/api/material/${id}`); toast.success('Deleted!'); fetchAll(); }
    catch { toast.error('Failed to delete'); }
  };

  const handleRequestAction = async (id, status) => {
    try { await axios.put(`/api/request/${id}`, { status }); toast.success(`Request ${status}!`); fetchAll(); }
    catch { toast.error('Action failed'); }
  };

  const openEditModal = (material) => {
    setEditMaterial(material);
    setForm({ name: material.name, category: material.category, quantity: material.quantity, unit: material.unit, pricePerUnit: material.pricePerUnit, threshold: material.threshold });
    setShowEditModal(true);
  };

  // ── Supervisor handlers ────────────────────────────────────────────────────
  const handleAddSupervisor = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await axios.post('/api/supervisors', supForm); toast.success('Supervisor created!'); setShowAddSupModal(false); resetSupForm(); fetchAll(); }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const handleEditSupervisor = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const payload = { ...supForm };
      if (!payload.password) delete payload.password;
      await axios.put(`/api/supervisors/${editSupervisor._id}`, payload);
      toast.success('Supervisor updated!'); setShowEditSupModal(false); fetchAll();
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const handleDeleteSupervisor = async (id, name) => {
    if (!window.confirm(`Delete supervisor "${name}"?`)) return;
    try { await axios.delete(`/api/supervisors/${id}`); toast.success('Supervisor deleted!'); fetchAll(); }
    catch { toast.error('Failed to delete'); }
  };

  const openEditSupModal = (sup) => {
    setEditSupervisor(sup);
    setSupForm({ name: sup.name, email: sup.email, username: sup.username || '', password: '', site: sup.site || '' });
    setShowEditSupModal(true);
  };

  const pendingCount = requests.filter(r => r.status === 'Pending').length;

  // ── Reusable Material Form ─────────────────────────────────────────────────
  const MaterialForm = ({ onSubmit, submitLabel }) => (
    <form onSubmit={onSubmit}>
      <div className="form-grid">
        {[
          { label: 'Material Name *', type: 'text', key: 'name', placeholder: 'e.g. OPC Cement', required: true },
        ].map(f => (
          <div className="form-group" key={f.key}>
            <label>{f.label}</label>
            <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
              onChange={e => setForm({...form, [f.key]: e.target.value})} required={f.required} />
          </div>
        ))}
        <div className="form-group">
          <label>Category *</label>
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
            {['Cement','Sand','Steel','Bricks','Aggregate','Paint','Wood','Other'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Quantity *</label>
          <input type="number" min="0" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} placeholder="0" required />
        </div>
        <div className="form-group">
          <label>Unit *</label>
          <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
            {['bag','kg','ton','litre','piece','cubic meter','meter'].map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Price Per Unit (₹) *</label>
          <input type="number" min="0" value={form.pricePerUnit} onChange={e => setForm({...form, pricePerUnit: e.target.value})} placeholder="0" required />
        </div>
        <div className="form-group">
          <label>Low Stock Threshold</label>
          <input type="number" min="0" value={form.threshold} onChange={e => setForm({...form, threshold: e.target.value})} placeholder="50" />
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <><i className="fas fa-spinner fa-spin" /> Saving…</> : <><i className="fas fa-save" /> {submitLabel}</>}
        </button>
      </div>
    </form>
  );

  // ── Reusable Supervisor Form ───────────────────────────────────────────────
  const SupervisorForm = ({ onSubmit, submitLabel, isEdit }) => (
    <form onSubmit={onSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label>Full Name *</label>
          <input value={supForm.name} onChange={e => setSupForm({...supForm, name: e.target.value})} placeholder="Supervisor name" required />
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input type="email" value={supForm.email} onChange={e => setSupForm({...supForm, email: e.target.value})} placeholder="supervisor@email.com" required />
        </div>
        <div className="form-group">
          <label>Username <span className="label-optional">(optional)</span></label>
          <input value={supForm.username} onChange={e => setSupForm({...supForm, username: e.target.value})} placeholder="unique_username" />
        </div>
        <div className="form-group">
          <label>Assigned Site</label>
          <select value={supForm.site} onChange={e => setSupForm({...supForm, site: e.target.value})}>
            <option value="">— No Site Assigned —</option>
            {SITES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group form-group-full">
          <label>{isEdit ? 'New Password' : 'Password *'} {isEdit && <span className="label-optional">(leave blank to keep current)</span>}</label>
          <input type="password" value={supForm.password}
            onChange={e => setSupForm({...supForm, password: e.target.value})}
            placeholder={isEdit ? 'Leave blank to keep current' : 'Min. 6 characters'}
            required={!isEdit} minLength={isEdit ? undefined : 6} />
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={() => { setShowAddSupModal(false); setShowEditSupModal(false); }}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <><i className="fas fa-spinner fa-spin" /> Saving…</> : <><i className="fas fa-save" /> {submitLabel}</>}
        </button>
      </div>
    </form>
  );

  return (
    <div className="dashboard-layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="Padmashree Builders" className="sidebar-logo-img" />
          <h2>Padmashree<br/>Builders</h2>
          <p className="sidebar-panel-label">Admin Panel</p>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-title">Main</div>
          {[
            { id: 'dashboard',   icon: 'fa-chart-pie',          label: 'Dashboard' },
            { id: 'materials',   icon: 'fa-boxes',               label: 'Materials' },
            { id: 'requests',    icon: 'fa-clipboard-list',      label: `Requests${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
            { id: 'lowstock',    icon: 'fa-exclamation-triangle',label: `Low Stock${lowStock.length > 0 ? ` (${lowStock.length})` : ''}` },
            { id: 'history',     icon: 'fa-history',             label: 'Usage History' },
            { id: 'supervisors', icon: 'fa-users-cog',           label: `Supervisors (${supervisors.length})` },
          ].map(item => (
            <button key={item.id} className={`nav-item ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id)}>
              <i className={`fas ${item.icon}`} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <div className="name">{user?.name}</div>
              <div className="role">{user?.role}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}><i className="fas fa-sign-out-alt" /> Logout</button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="main-content">

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <>
            <div className="page-header">
              <h1>Dashboard Overview</h1>
              <p>Welcome back, {user?.name}! Here's what's happening across all sites.</p>
            </div>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-icon orange"><i className="fas fa-boxes" /></div><div className="stat-info"><div className="value">{materials.length}</div><div className="label">Total Materials</div></div></div>
              <div className="stat-card"><div className="stat-icon blue"><i className="fas fa-clipboard-list" /></div><div className="stat-info"><div className="value">{requests.length}</div><div className="label">Total Requests</div></div></div>
              <div className="stat-card"><div className="stat-icon yellow"><i className="fas fa-clock" /></div><div className="stat-info"><div className="value">{pendingCount}</div><div className="label">Pending Requests</div></div></div>
              <div className="stat-card"><div className="stat-icon red"><i className="fas fa-exclamation-triangle" /></div><div className="stat-info"><div className="value">{lowStock.length}</div><div className="label">Low Stock Items</div></div></div>
              <div className="stat-card"><div className="stat-icon green"><i className="fas fa-users-cog" /></div><div className="stat-info"><div className="value">{supervisors.length}</div><div className="label">Supervisors</div></div></div>
            </div>

            {lowStock.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <h2><i className="fas fa-exclamation-triangle low-stock-icon" />Low Stock Alerts</h2>
                </div>
                <div className="table-wrapper">
                  <table>
                    <thead><tr><th>Material</th><th>Category</th><th>Current Stock</th><th>Threshold</th><th>Unit</th></tr></thead>
                    <tbody>
                      {lowStock.map(m => (
                        <tr key={m._id}>
                          <td>{m.name}</td><td>{m.category}</td>
                          <td><span className="badge badge-low">{m.quantity}</span></td>
                          <td>{m.threshold}</td><td>{m.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="card">
              <div className="card-header"><h2>Recent Requests</h2></div>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Material</th><th>Supervisor</th><th>Site</th><th>Qty</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {requests.slice(0,5).map(r => (
                      <tr key={r._id}>
                        <td>{r.materialId?.name}</td>
                        <td>{r.supervisorId?.name}</td>
                        <td><span className="site-badge-muted">{r.supervisorId?.site || '—'}</span></td>
                        <td>{r.quantityRequested} {r.materialId?.unit}</td>
                        <td><span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span></td>
                        <td>{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                    {requests.length === 0 && <tr><td colSpan="6"><div className="empty-state"><i className="fas fa-inbox" /><p>No requests yet</p></div></td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* MATERIALS */}
        {activeTab === 'materials' && (
          <>
            <div className="page-header-row">
              <div className="page-header">
                <h1>Materials</h1>
                <p>Manage all construction materials</p>
              </div>
              <button className="btn btn-primary" onClick={() => { resetForm(); setShowAddModal(true); }}>
                <i className="fas fa-plus" /> Add Material
              </button>
            </div>
            <div className="card">
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Name</th><th>Category</th><th>Stock</th><th>Unit</th><th>Price/Unit</th><th>Threshold</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {materials.map(m => (
                      <tr key={m._id}>
                        <td>{m.name}</td><td>{m.category}</td>
                        <td className={m.quantity < m.threshold ? 'qty-low' : 'qty-ok'}>{m.quantity}</td>
                        <td>{m.unit}</td><td>₹{m.pricePerUnit}</td><td>{m.threshold}</td>
                        <td><span className={`badge ${m.quantity < m.threshold ? 'badge-low' : 'badge-ok'}`}>{m.quantity < m.threshold ? 'Low Stock' : 'In Stock'}</span></td>
                        <td>
                          <div className="actions-cell">
                            <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(m)}><i className="fas fa-edit" /></button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m._id, m.name)}><i className="fas fa-trash" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {materials.length === 0 && <tr><td colSpan="8"><div className="empty-state"><i className="fas fa-boxes" /><p>No materials added yet</p></div></td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* REQUESTS */}
        {activeTab === 'requests' && (
          <>
            <div className="page-header"><h1>Material Requests</h1><p>Review and manage supervisor requests</p></div>
            <div className="card">
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Material</th><th>Supervisor</th><th>Site</th><th>Qty Requested</th><th>Reason</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                  <tbody>
                    {requests.map(r => (
                      <tr key={r._id}>
                        <td>{r.materialId?.name}</td>
                        <td>{r.supervisorId?.name}</td>
                        <td><span className="site-badge-muted">{r.supervisorId?.site || '—'}</span></td>
                        <td>{r.quantityRequested} {r.materialId?.unit}</td>
                        <td className="td-truncate">{r.reason || '—'}</td>
                        <td><span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span></td>
                        <td>{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                        <td>
                          {r.status === 'Pending' ? (
                            <div className="req-actions">
                              <button className="btn btn-success btn-sm" onClick={() => handleRequestAction(r._id, 'Approved')}><i className="fas fa-check" /> Approve</button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleRequestAction(r._id, 'Rejected')}><i className="fas fa-times" /></button>
                            </div>
                          ) : (
                            <span className="processed-label">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {requests.length === 0 && <tr><td colSpan="8"><div className="empty-state"><i className="fas fa-clipboard-list" /><p>No requests yet</p></div></td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* LOW STOCK */}
        {activeTab === 'lowstock' && (
          <>
            <div className="page-header"><h1>Low Stock Alerts</h1><p>Materials below their threshold level</p></div>
            {lowStock.length === 0 ? (
              <div className="card"><div className="empty-state"><i className="fas fa-check-circle success-icon" /><p>All materials are well stocked!</p></div></div>
            ) : (
              <div className="card">
                <div className="alert alert-warning"><i className="fas fa-exclamation-triangle" /> {lowStock.length} material(s) are running low. Please restock soon.</div>
                <div className="table-wrapper">
                  <table>
                    <thead><tr><th>Material</th><th>Category</th><th>Current Stock</th><th>Threshold</th><th>Unit</th><th>Price/Unit</th><th>Action</th></tr></thead>
                    <tbody>
                      {lowStock.map(m => (
                        <tr key={m._id}>
                          <td>{m.name}</td><td>{m.category}</td>
                          <td className="qty-low">{m.quantity}</td>
                          <td>{m.threshold}</td><td>{m.unit}</td><td>₹{m.pricePerUnit}</td>
                          <td><button className="btn btn-primary btn-sm" onClick={() => { openEditModal(m); setActiveTab('materials'); }}><i className="fas fa-edit" /> Update Stock</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* USAGE HISTORY */}
        {activeTab === 'history' && (
          <>
            <div className="page-header"><h1>Usage History</h1><p>All issued materials log</p></div>
            <div className="card">
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Material</th><th>Category</th><th>Qty Used</th><th>Unit</th><th>Issued To</th><th>Site</th><th>Date</th></tr></thead>
                  <tbody>
                    {usageHistory.map(h => (
                      <tr key={h._id}>
                        <td>{h.materialId?.name}</td><td>{h.materialId?.category}</td>
                        <td>{h.quantityUsed}</td><td>{h.materialId?.unit}</td>
                        <td>{h.supervisorId?.name}</td>
                        <td><span className="site-badge-muted">{h.supervisorId?.site || '—'}</span></td>
                        <td>{new Date(h.issuedDate).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                    {usageHistory.length === 0 && <tr><td colSpan="7"><div className="empty-state"><i className="fas fa-history" /><p>No usage history yet</p></div></td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* SUPERVISORS */}
        {activeTab === 'supervisors' && (
          <>
            <div className="page-header-row">
              <div className="page-header">
                <h1>Supervisors</h1>
                <p>Manage supervisor accounts and site assignments</p>
              </div>
              <button className="btn btn-primary" onClick={() => { resetSupForm(); setShowAddSupModal(true); }}>
                <i className="fas fa-user-plus" /> Add Supervisor
              </button>
            </div>
            <div className="card">
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Username</th><th>Assigned Site</th><th>Created</th><th>Actions</th></tr></thead>
                  <tbody>
                    {supervisors.map(s => (
                      <tr key={s._id}>
                        <td>
                          <div className="sup-name-cell">
                            <div className="sup-avatar">{s.name.charAt(0).toUpperCase()}</div>
                            {s.name}
                          </div>
                        </td>
                        <td>{s.email}</td>
                        <td>{s.username ? <span className="username-chip">@{s.username}</span> : <span className="site-badge-muted">—</span>}</td>
                        <td>{s.site ? <span className="site-badge"><i className="fas fa-map-marker-alt" />{s.site}</span> : <span className="site-badge-muted">Not assigned</span>}</td>
                        <td>{new Date(s.createdAt).toLocaleDateString('en-IN')}</td>
                        <td>
                          <div className="actions-cell">
                            <button className="btn btn-secondary btn-sm" onClick={() => openEditSupModal(s)}><i className="fas fa-edit" /></button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSupervisor(s._id, s.name)}><i className="fas fa-trash" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {supervisors.length === 0 && <tr><td colSpan="6"><div className="empty-state"><i className="fas fa-users-cog" /><p>No supervisors yet. Add one!</p></div></td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* ── Material Modals ── */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-plus-circle modal-icon" />Add New Material</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}><i className="fas fa-times" /></button>
            </div>
            <MaterialForm onSubmit={handleAddMaterial} submitLabel="Add Material" />
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-edit modal-icon" />Edit Material</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}><i className="fas fa-times" /></button>
            </div>
            <MaterialForm onSubmit={handleEditSubmit} submitLabel="Update Material" />
          </div>
        </div>
      )}

      {/* ── Supervisor Modals ── */}
      {showAddSupModal && (
        <div className="modal-overlay" onClick={() => setShowAddSupModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-user-plus modal-icon" />Add New Supervisor</h3>
              <button className="modal-close" onClick={() => setShowAddSupModal(false)}><i className="fas fa-times" /></button>
            </div>
            <SupervisorForm onSubmit={handleAddSupervisor} submitLabel="Create Supervisor" isEdit={false} />
          </div>
        </div>
      )}

      {showEditSupModal && (
        <div className="modal-overlay" onClick={() => setShowEditSupModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-user-edit modal-icon" />Edit Supervisor</h3>
              <button className="modal-close" onClick={() => setShowEditSupModal(false)}><i className="fas fa-times" /></button>
            </div>
            <SupervisorForm onSubmit={handleEditSupervisor} submitLabel="Update Supervisor" isEdit={true} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
