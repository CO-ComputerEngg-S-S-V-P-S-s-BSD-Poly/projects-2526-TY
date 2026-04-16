import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, ExternalLink, Search, CheckCircle } from "lucide-react";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔥 Fetch All Products (Admin)
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products/admin/all"
      );
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // ✅ Approve Product
  const handleApprove = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/products/admin/approve/${id}`
      );

      fetchProducts(); // 🔄 Refresh list after approval

    } catch (error) {
      console.error("Approve error:", error);
    }
  };

  // ❌ Delete Product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/products/delete/${id}`
        );

        setProducts(prev => prev.filter(p => p._id !== id));

      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  // 🔎 Search Filter
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${p.artisan?.firstName || ""} ${p.artisan?.lastName || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="products-mgmt-page">
      <div className="page-header-flex">
        <div>
          <h1>Product Management</h1>
          <p>Manage all GramKala marketplace products here.</p>
        </div>

        <div className="search-box-admin">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search Product or Seller..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Seller</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <tr key={p._id}>
                  <td>#{p._id.slice(-5)}</td>

                  <td className="p-name-cell">{p.name}</td>

                  <td>
                    <span className={`cat-pill ${p.category?.toLowerCase()}`}>
                      {p.category}
                    </span>
                  </td>

                  <td>₹{p.price}</td>

                  <td>
                    {p.artisan?.firstName} {p.artisan?.lastName}
                  </td>

                  <td>{p.stock} units</td>

                  {/* 🔥 Status Column */}
                  <td>
                    {p.isApproved ? (
                      <span className="approved-badge">Approved</span>
                    ) : (
                      <span className="pending-badge">Pending</span>
                    )}
                  </td>

                  <td className="p-actions">

                    {/* Approve Button (only if pending) */}
                    {!p.isApproved && (
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(p._id)}
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}

                    <button className="view-btn">
                      <ExternalLink size={18} />
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(p._id)}
                    >
                      <Trash2 size={18} />
                    </button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
