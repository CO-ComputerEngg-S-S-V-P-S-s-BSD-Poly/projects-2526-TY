import React from 'react';
import { Search, Filter, Download, Plus, Package, Store, Calendar } from 'lucide-react';

const ProductsView = ({ data, searchTerm, setSearchTerm }) => {
  const filteredProducts = data.products.filter(product =>
    product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.shopkeeper.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ProductRow = ({ product }) => {
    return (
      <tr className="order-row" style={{ cursor: 'pointer' }}>
        <td className="order-id">{product.id}</td>
        <td>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #C17A3F 0%, #A85C28 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Package size={24} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: '600', color: '#1F2937' }}>{product.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>{product.category}</div>
            </div>
          </div>
        </td>
        <td>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Store size={16} color="#C17A3F" />
            <span style={{ fontWeight: '500' }}>{product.shopkeeper}</span>
          </div>
        </td>
        <td style={{ fontWeight: '600', color: '#10B981' }}>₹{product.price.toLocaleString()}</td>
        <td>{product.stock} units</td>
        <td>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} color="#6B7280" />
            {product.addedDate}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="view-content">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Products Management</h1>
          <p className="page-subtitle">All products added by shopkeepers - Total: {data.products.length}</p>
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
          <button className="download-btn" style={{ background: '#10B981' }}>
            <Plus size={18} />
            Add Product
          </button>
        </div> */}
      </div>

      <div className="search-container">
        <Search size={20} />
        <input 
          type="text"
          placeholder="Search products by ID, name, shopkeeper, or category..."
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
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Shopkeeper</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Added Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, idx) => (
                  <ProductRow key={idx} product={product} />
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    No products found
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

export default ProductsView;

