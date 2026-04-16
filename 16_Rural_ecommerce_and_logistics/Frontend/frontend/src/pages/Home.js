import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const categories = [
  {
    id: 1,
    name: "Pottery (Mitti)",
    image:
      "https://i.ytimg.com/vi/TbvozuXiBZg/maxresdefault.jpg",
  },
  {
    id: 2,
    name: "Iron Work (Loha)",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.VcQgMT1X-nXGZpNtwwx9zQHaE8?pid=Api&P=0&h=180",
  },
  {
    id: 3,
    name: "Wooden Art (Lakdi)",
    image:
      "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?q=80&w=400",
  },
  {
    id: 4,
    name: "Handicraft",
    image:
      "https://tse3.mm.bing.net/th/id/OIP.ulhr3QdncwTKaFELYNimUgHaE7?pid=Api&P=0&h=180",
  },
];

const Home = () => {
  const [products, setProducts] = useState([]);

  // 🔥 Fetch Approved Products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products/approved"
      );
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">Direct From Village To Your Home</h2>
          <p className="hero-subtitle">
            Support local artisans and bring home the soul of India.
          </p>
          <Link to="/shop" className="hero-btn">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h3 className="section-title">Explore Categories</h3>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link to="/shop" key={cat.id} className="category-card">
                <div className="category-img-container">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="category-img"
                  />
                </div>
                <p className="category-name">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 🔥 Featured Products Section */}
      <section className="featured-section">
        <div className="container">
          <h3 className="section-title">Latest Products</h3>

          <div className="products-grid">
            {products.length > 0 ? (
              products.slice(0, 4).map((p) => (
                <div key={p._id} className="product-card">
                  <img
                    src={`http://localhost:5000${p.image}`}
                    alt={p.name}
                    className="product-img"
                  />
                  <h4>{p.name}</h4>
                  <p className="price">₹{p.price}</p>
                  <p className="artisan-name">
                    {p.artisan?.firstName} {p.artisan?.lastName}
                  </p>

                  <Link to={`/product/${p._id}`} className="view-btn">
                    View Details
                  </Link>
                </div>
              ))
            ) : (
              <p>No products available.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
