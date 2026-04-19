import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ShopkeeperSidebar from "../components/ShopkeeperSidebar";
import "./AddProduct.css";

const CATEGORIES = ["Pots & Vessels", "Pooja Items", "Kitchenware", "Decorative", "Gifts", "Utensils", "Divine Statues"];

const AddProduct = () => {
  const navigate = useNavigate();

  // ✅ sessionStorage — App.jsx ke saath consistent
  const sk = JSON.parse(sessionStorage.getItem("shopkeeperData") || "{}");

  const [form, setForm] = useState({
    name: "", price: "", stock: "", category: "",
    description: "", material: "", weight: "",
  });
  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [success,      setSuccess]      = useState(false);
  const [errors,       setErrors]       = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name     = "Product name is required";
    if (!form.price)       e.price    = "Price is required";
    if (!form.category)    e.category = "Please select a category";
    if (!imageFile)        e.image    = "Product image is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const data = new FormData();
    // ✅ "image" — productRoutes.js ka multer field name yahi hai
    data.append("image",       imageFile);
    data.append("name",        form.name);
    data.append("price",       form.price);
    // ✅ "stockQty" — Product.js schema ke saath match
    data.append("stockQty",    form.stock);
    data.append("category",    form.category);
    data.append("description", form.description);
    data.append("material",    form.material);
    data.append("weight",      form.weight);
    // ✅ Shop info — sessionStorage se
    data.append("shopName",    sk.shopName  || "");
    data.append("ownerName",   sk.ownerName || "");
    data.append("shopId",      sk._id       || sk.shopId || "");

    try {
      setLoading(true);
      // ✅ Correct endpoint — productRoutes.js POST /api/products
      await axios.post("http://localhost:5000/api/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
      setTimeout(() => navigate("/shopkeeper/products"), 2000);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Failed to add product. Try again." });
    } finally {
      setLoading(false);
    }
  };

  // ── Success Screen ──
  if (success) return (
    <div className="sk-dash-layout">
      <ShopkeeperSidebar />
      <div className="sk-dash-main">
        <div className="ap-success-screen">
          <div className="ap-success-icon">✅</div>
          <h2 className="ap-success-title">Product Added!</h2>
          <p className="ap-success-sub">Your product is now live on your shop page.</p>
          <div className="ap-success-spinner" />
          <p style={{ color: "var(--mid)", fontSize: 13 }}>Redirecting to products...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="sk-dash-layout">
      <ShopkeeperSidebar />

      <div className="sk-dash-main">
        <div className="sk-topbar">
          <div>
            <h1 className="sk-topbar-title">Add New Product</h1>
            <p className="sk-topbar-sub">Add a product to your shop listing</p>
          </div>
          <button className="ap-back-btn" onClick={() => navigate("/shopkeeper/dashboard")}>
            ← Back to Dashboard
          </button>
        </div>

        <div className="ap-content">
          {errors.submit && (
            <div className="ap-error-banner">⚠️ {errors.submit}</div>
          )}

          <form className="ap-form-grid" onSubmit={handleSubmit}>

            {/* ── Left: Image + Category ── */}
            <div className="ap-left">
              <div className="ap-card">
                <h3 className="ap-card-title">Product Image</h3>
                <label className="ap-img-drop" htmlFor="productImg">
                  {imagePreview ? (
                    <div className="ap-img-preview">
                      <img src={imagePreview} alt="preview" />
                      <div className="ap-img-change-overlay">
                        <span>📷 Change</span>
                      </div>
                    </div>
                  ) : (
                    <div className="ap-img-placeholder">
                      <div className="ap-img-icon">📷</div>
                      <p className="ap-img-text">Click to upload product photo</p>
                      <p className="ap-img-sub">JPG, PNG up to 5MB</p>
                      <div className="ap-img-btn">Browse File</div>
                    </div>
                  )}
                </label>
                <input
                  id="productImg"
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  style={{ display: "none" }}
                />
                {errors.image && <p className="ap-field-error">⚠️ {errors.image}</p>}
              </div>

              <div className="ap-card" style={{ marginTop: 16 }}>
                <h3 className="ap-card-title">Category *</h3>
                <div className="ap-cat-grid">
                  {CATEGORIES.map(cat => (
                    <div
                      key={cat}
                      className={`ap-cat-chip ${form.category === cat ? "active" : ""}`}
                      onClick={() => {
                        setForm({ ...form, category: cat });
                        setErrors({ ...errors, category: "" });
                      }}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
                {errors.category && <p className="ap-field-error">⚠️ {errors.category}</p>}
              </div>
            </div>

            {/* ── Right: Product Details ── */}
            <div className="ap-right">
              <div className="ap-card">
                <h3 className="ap-card-title">Product Details</h3>

                <div className="ap-field">
                  <label className="ap-label">Product Name *</label>
                  <input
                    className={`ap-input ${errors.name ? "error" : ""}`}
                    type="text" name="name"
                    placeholder="e.g. Copper Water Pot"
                    value={form.name} onChange={handleChange}
                  />
                  {errors.name && <p className="ap-field-error">⚠️ {errors.name}</p>}
                </div>

                <div className="ap-row">
                  <div className="ap-field">
                    <label className="ap-label">Price (₹) *</label>
                    <input
                      className={`ap-input ${errors.price ? "error" : ""}`}
                      type="number" name="price"
                      placeholder="e.g. 850"
                      value={form.price} onChange={handleChange}
                    />
                    {errors.price && <p className="ap-field-error">⚠️ {errors.price}</p>}
                  </div>
                  <div className="ap-field">
                    <label className="ap-label">Stock Qty</label>
                    <input
                      className="ap-input"
                      type="number" name="stock"
                      placeholder="e.g. 10"
                      value={form.stock} onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="ap-field">
                  <label className="ap-label">Description</label>
                  <textarea
                    className="ap-input ap-textarea"
                    name="description"
                    placeholder="Describe your product — material, use, size..."
                    value={form.description} onChange={handleChange}
                    rows={4}
                  />
                </div>

                <div className="ap-row">
                  <div className="ap-field">
                    <label className="ap-label">Material</label>
                    <input
                      className="ap-input"
                      type="text" name="material"
                      placeholder="e.g. Pure Copper"
                      value={form.material} onChange={handleChange}
                    />
                  </div>
                  <div className="ap-field">
                    <label className="ap-label">Weight</label>
                    <input
                      className="ap-input"
                      type="text" name="weight"
                      placeholder="e.g. 500g"
                      value={form.weight} onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="ap-actions">
                  <button
                    type="button"
                    className="ap-cancel-btn"
                    onClick={() => navigate("/shopkeeper/dashboard")}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ap-submit-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="ap-loading">
                        <span className="ap-spinner" /> Saving...
                      </span>
                    ) : "💾 Save Product"}
                  </button>
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;