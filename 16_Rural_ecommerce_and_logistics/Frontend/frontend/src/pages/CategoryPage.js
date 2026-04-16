import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import './CategoryPage.css';

const categories = ['All', 'Pottery', 'Ironwork', 'Woodwork', 'Handicrafts'];

const CategoryPage = () => {
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchProducts(filter);
  }, [filter]);

  const fetchProducts = async (category) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/products/approved`,
        {
          params: { category }
        }
      );

      setProducts(res.data);
      setLoading(false);

    } catch (err) {
      console.error("Products load error:", err);
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="loader-container">
      <div className="spinner"></div>
      <span className="loader-text">Loading Crafts...</span>
    </div>
  );

  return (
    <div className="category-container">
      <h2 className="category-title">Rural Craft Collection</h2>
      
      {/* Filter Chips */}
      <div className="filter-scroll-wrapper">
        <div className="filter-chips">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-category">
          <p>Is category mein filhal koi products nahi hain.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
