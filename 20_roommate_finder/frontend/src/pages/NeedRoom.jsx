import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const NeedRoom = () => {
  const navigate = useNavigate();

  // ✅ Form State
  const [formData, setFormData] = useState({
    location: "",
    lookingFor: "",
    rent: "",
    occupation: "",
    need: "", // Added the "Need" field
    description: "",
  });

  const [error, setError] = useState("");

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // 🔄 Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validate Required Fields
    const { location, lookingFor, rent, occupation, need, description } = formData;
    if (!location || !lookingFor || !rent || !occupation || !need || !description) {
      setError("❌ Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("❌ Unauthorized. Please log in.");
        return;
      }

      const response = await axios.post("http://localhost:5000/api/need-room", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Room Need Posted:", response.data);
      alert("✅ Room request submitted successfully!");

      navigate("/dashboard"); // ✅ Redirect after success
    } catch (error) {
      console.error("❌ Error posting room need:", error.response?.data || error);
      setError("❌ Failed to post room need. Try again.");
    }
  };

  return (
    <motion.div
      className="container d-flex flex-column align-items-center justify-content-center vh-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card p-4 shadow-lg text-center" style={{ width: "900px" }}>
        <h3 style={{ color: "#20b2aa", fontWeight: "bold", marginBottom: "10px" }}>Need a Room</h3>
        <p style={{ fontSize: "14px", marginBottom: "20px" }}>Fill in the details to find your perfect room.</p>

        <form onSubmit={handleSubmit} className="w-100">
          {/* ✅ Grid Layout - Two Columns */}
          <div className="row">
            {/* Left Column */}
            <div className="col-md-6">
              <label className="mb-1" style={{ fontWeight: "bold" }}>Location</label>
              <select className="form-control mb-2 p-2" name="location" value={formData.location} onChange={handleChange} required>
                <option value="">Select Location</option>
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Nagpur">Nagpur</option>
                <option value="Nashik">Nashik</option>
                <option value="Sambhajinagar">Sambhajinagar</option>
                <option value="Dhule">Dhule</option>
              </select>

              <label className="mb-1" style={{ fontWeight: "bold" }}>Rent</label>
              <select className="form-control mb-2 p-2" name="rent" value={formData.rent} onChange={handleChange} required>
                <option value="">Select Rent</option>
                <option value="2000">₹2000</option>
                <option value="4000">₹4000</option>
                <option value="6000">₹6000</option>
                <option value="8000">₹8000</option>
                <option value="10000">₹10000</option>
              </select>
            </div>

            {/* Right Column */}
            <div className="col-md-6">
              <label className="mb-1" style={{ fontWeight: "bold" }}>Looking For</label>
              <select className="form-control mb-2 p-2" name="lookingFor" value={formData.lookingFor} onChange={handleChange} required>
                <option value="">Looking For</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Any">Any</option>
              </select>

              <label className="mb-1" style={{ fontWeight: "bold" }}>Occupation</label>
              <select className="form-control mb-2 p-2" name="occupation" value={formData.occupation} onChange={handleChange} required>
                <option value="">Select Occupation</option>
                <option value="Single">Single</option>
                <option value="Sharing">Sharing</option>
                <option value="Any">Any</option>
              </select>
            </div>
          </div>

          {/* Need (New Field) */}
          <label className="mb-1" style={{ fontWeight: "bold" }}>Need</label>
          <select className="form-control mb-2 p-2" name="need" value={formData.need} onChange={handleChange} required>
            <option value="">Select Need</option>
            <option value="Roommate">Roommate</option>
            <option value="Room">Room</option>
          </select>

          {/* Description Field (Full Width) */}
          <label className="mb-1" style={{ fontWeight: "bold" }}>Room Description</label>
          <textarea
            className="form-control mb-3 p-2"
            name="description"
            placeholder="Enter Room Requirements"
            value={formData.description}
            onChange={handleChange}
            required
            style={{ height: "80px" }}
          />

          {error && <p className="text-danger">{error}</p>}
          <button type="submit" className="btn w-100 p-2" style={{ backgroundColor: "#20b2aa", color: "#fff", fontSize: "16px" }}>
            Submit Request
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default NeedRoom;
