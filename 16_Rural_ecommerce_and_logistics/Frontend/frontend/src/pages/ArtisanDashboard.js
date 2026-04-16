import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, PackagePlus, ShoppingBag, IndianRupee, 
  LogOut, Edit, Trash2, CheckCircle, Package, Truck, X 
} from 'lucide-react';
import axios from 'axios';
import './ArtisanDashboard.css'; 

const ArtisanDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ products: 0, orders: 0, earnings: 0 });
  const [myProducts, setMyProducts] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // ---------------- FETCH DATA ----------------
  const fetchData = async () => {
    
    if (!user || !token) return;

    setLoading(true);

    try {

      // PRODUCTS
      const prodRes = await axios.get(
        `http://localhost:5000/api/products/artisan/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMyProducts(prodRes.data);

      // ORDERS
      const orderRes = await axios.get(
        `http://localhost:5000/api/orders/artisan/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMyOrders(orderRes.data);

      // ---------- CALCULATE EARNINGS ----------
      let totalEarnings = 0;

orderRes.data.forEach(order => {

  totalEarnings += order.artisanEarning || 0;

});

      // ---------- UPDATE STATS ----------
      setStats({
        products: prodRes.data.length,
        orders: orderRes.data.length,
        earnings: totalEarnings
      });

    } catch (err) {

      console.error("Fetch Error:", err);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // ---------------- HANDLERS ----------------
  const handleChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // ---------------- ADD / EDIT PRODUCT ----------------
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const formData = new FormData();

      Object.keys(productData).forEach(key =>
        formData.append(key, productData[key])
      );

      formData.append('artisanId', user.id);

      if (imageFile) formData.append('image', imageFile);

      const url = editingId
        ? `http://localhost:5000/api/products/update/${editingId}`
        : `http://localhost:5000/api/products/add`;

      const method = editingId ? "put" : "post";

      await axios[method](url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      alert(editingId ? "Product updated!" : "Product added for approval!");

      resetForm();

      setActiveTab('manage-products');

    } catch (err) {

      alert("Error: " + (err.response?.data?.msg || "Action failed"));

    }
  };

  const resetForm = () => {

    setProductData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: ''
    });

    setImageFile(null);
    setEditingId(null);

  };

  // ---------------- DELETE PRODUCT ----------------
  const handleDelete = async (id) => {

    if (window.confirm("Are you sure you want to delete this product?")) {

      try {

        await axios.delete(
          `http://localhost:5000/api/products/delete/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        fetchData();

      } catch {

        alert("Delete failed");

      }

    }
  };

  // ---------------- UPDATE ORDER STATUS ----------------
  const updateOrderStatus = async (orderId, newStatus) => {

    try {

      await axios.put(
        `http://localhost:5000/api/orders/artisan/status/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchData();

    } catch {

      alert("Status update failed");

    }
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {

    localStorage.clear();
    window.location.href = '/login';

  };

  return (
    <div className="artisan-layout">

      {/* SIDEBAR */}
      <aside className="artisan-sidebar">

        <div className="sidebar-brand">
          <h2 className="brand-title">GramKala</h2>
          <span className="brand-subtitle">ARTISAN PORTAL</span>
        </div>

        <nav className="sidebar-menu">

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`menu-item ${activeTab === 'dashboard' ? 'is-active' : ''}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>

          <button
            onClick={() => { resetForm(); setActiveTab('add-product'); }}
            className={`menu-item ${activeTab === 'add-product' ? 'is-active' : ''}`}
          >
            <PackagePlus size={20} /> Add Product
          </button>

          <button
            onClick={() => setActiveTab('manage-products')}
            className={`menu-item ${activeTab === 'manage-products' ? 'is-active' : ''}`}
          >
            <Package size={20} /> My Products
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`menu-item ${activeTab === 'orders' ? 'is-active' : ''}`}
          >
            <ShoppingBag size={20} /> Orders
          </button>

        </nav>

        <div className="sidebar-exit">

          <button onClick={handleLogout} className="exit-button">

            <LogOut size={20} /> Logout

          </button>

        </div>

      </aside>

      {/* MAIN PANEL */}
      <main className="artisan-main-panel">

        <header className="panel-header">

          <h1>{activeTab.replace('-', ' ').toUpperCase()}</h1>

        </header>

        {/* DASHBOARD */}
{activeTab === 'dashboard' && (
  <div className="stats-container">

    <div className="card-stat">
      <h3 className="stat-number">{stats.products}</h3>
      <p className="stat-label">Your Products</p>
    </div>

    <div className="card-stat">
      <h3 className="stat-number">{stats.orders}</h3>
      <p className="stat-label">Total Orders</p>
    </div>

    <div className="card-stat is-highlight">
      <h3 className="stat-number">₹{stats.earnings}</h3>
      <p className="stat-label">Net Earnings</p>
    </div>

  </div>
)}

        {/* Add/Edit Form */}
        {activeTab === 'add-product' && (
          <div className="artisan-form-box">
            <h3 className="form-heading">{editingId ? "Edit Product" : "Add New Product"}</h3>
            <form className="product-upload-form" onSubmit={handleSubmit}>
              <input type="text" name="name" className="form-input" placeholder="Product Name" value={productData.name} onChange={handleChange} required />
              <textarea name="description" className="form-textarea" placeholder="Description" value={productData.description} onChange={handleChange} required></textarea>
              <div className="input-row">
                <input type="number" name="price" className="form-input" placeholder="Price (₹)" value={productData.price} onChange={handleChange} required />
                <input type="number" name="stock" className="form-input" placeholder="Stock Quantity" value={productData.stock} onChange={handleChange} required />
              </div>
              <select name="category" className="form-select" value={productData.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                <option value="Pottery">Pottery</option>
                <option value="Woodwork">Woodwork</option>
                <option value="Ironwork">Ironwork</option>
                <option value="Handicrafts">Handicrafts</option>
              </select>
              <div className="file-upload-section">
                <label className="file-label">Product Image {editingId && "(Leave empty to keep current)"}:</label>
                <input type="file" className="form-input" accept="image/*" onChange={handleFileChange} required={!editingId} />
              </div>
              <button type="submit" className="submit-form-btn">{editingId ? "Update Product" : "Submit for Approval"}</button>
              {editingId && <button type="button" className="exit-button" style={{marginTop: '10px'}} onClick={resetForm}>Cancel Edit</button>}
            </form>
          </div>
        )}

        {/* Manage Products (Edit/Delete/Stock) */}
        {activeTab === 'manage-products' && (
          <div className="artisan-content-card">
             <div className="admin-list-wrapper">
              {myProducts.length > 0 ? myProducts.map(p => (
                <div key={p._id} className="admin-list-item">
                  <div className="item-info">
                    <strong className="item-name">{p.name}</strong>
                    <small className="item-details">Stock: {p.stock} | Price: ₹{p.price} | {p.isApproved ? "Approved" : "Pending"}</small>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => { setEditingId(p._id); setProductData(p); setActiveTab('add-product'); }} className="btn-approve">
                      <Edit size={16} /> Edit
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="btn-reject">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              )) : <p className="empty-msg">No products found.</p>}
            </div>
          </div>
        )}

        {/* Order Management (Processing Workflow) */}
        {activeTab === 'orders' && (
          <div className="artisan-content-card">
            <h3>Recent Orders</h3>
            <div className="admin-list-wrapper">
              {myOrders.length > 0 ? myOrders.map(order => (
                <div key={order._id} className="admin-list-item" style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px'}}>
                    <strong>Order #{order._id.slice(-6)}</strong>
                    <span className={`admin-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
                  </div>
                  <div className="item-actions" style={{width: '100%', justifyContent: 'flex-end'}}>
                    {order.status === 'Processing' && (
                      <button onClick={() => updateOrderStatus(order._id, 'Packed')} className="btn-approve">
                        <Package size={16} /> Pack Order
                      </button>
                    )}
                    {order.status === 'Packed' && (
                      <button onClick={() => updateOrderStatus(order._id, 'Shipped')} className="btn-approve">
                        <Truck size={16} /> Confirm Pickup
                      </button>
                    )}
                    {order.status === 'Shipped' && <span style={{color: '#22c55e'}}><CheckCircle size={16} /> Handed to Delivery</span>}
                  </div>
                </div>
              )) : <p className="empty-msg">No orders to display.</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ArtisanDashboard;