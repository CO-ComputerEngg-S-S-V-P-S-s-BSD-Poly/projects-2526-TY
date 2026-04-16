import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const NeedRoommate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location: "",
    lookingFor: "",
    rent: "",
    occupation: "",
    need: "", // Added the "Need" field
    description: "",
  });

  const [error, setError] = useState("");

  // 🔹 Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // 🔄 Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { location, lookingFor, rent, occupation, need, description } = formData;
    if (!location || !lookingFor || !rent || !occupation || !need || !description) {
      setError("❌ Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post("http://localhost:5000/api/need-flatmate", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Roommate Request Posted:", response.data);
      alert("✅ Roommate request posted successfully!");

      // ✅ Redirect to Dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Error posting roommate need:", error.response?.data || error);
      setError("❌ Failed to post request. Please try again.");
    }
  };

  return (
    <motion.div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="card p-5 shadow-lg text-center w-75">
        {/* ✅ Heading */}
        <h2 style={{ color: "#20b2aa", fontWeight: "bold" }}>Post Your Roommate Requirement</h2>
        <p style={{ fontSize: "18px", color: "black" }}>
          Looking for a clean and friendly roommate? Fill in the details below to find the perfect match.
        </p>

        <form onSubmit={handleSubmit} className="w-100">
          <div className="row">
            {/* Location */}
            <div className="col-md-6">
              <label>Location</label>
              <select className="form-control mb-3" name="location" value={formData.location} onChange={handleChange} required>
                <option value="">Select Location</option>
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Nagpur">Nagpur</option>
                <option value="Nashik">Nashik</option>
                <option value="Sambhajinagar">Sambhajinagar</option>
                <option value="Dhule">Dhule</option>
              </select>
            </div>

            {/* Looking For */}
            <div className="col-md-6">
              <label>Looking For</label>
              <select className="form-control mb-3" name="lookingFor" value={formData.lookingFor} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Any">Any</option>
              </select>
            </div>

            {/* Rent */}
            <div className="col-md-6">
              <label>Rent</label>
              <select className="form-control mb-3" name="rent" value={formData.rent} onChange={handleChange} required>
                <option value="">Select Rent</option>
                <option value="2000">₹2000</option>
                <option value="4000">₹4000</option>
                <option value="6000">₹6000</option>
                <option value="8000">₹8000</option>
                <option value="10000">₹10,000</option>
              </select>
            </div>

            {/* Occupation */}
            <div className="col-md-6">
              <label>Occupation</label>
              <select className="form-control mb-3" name="occupation" value={formData.occupation} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Sharing">Sharing</option>
                <option value="Any">Any</option>
              </select>
            </div>

            {/* Need (New Field) */}
            <div className="col-md-6">
              <label>Need</label>
              <select className="form-control mb-3" name="need" value={formData.need} onChange={handleChange} required>
                <option value="">Select Need</option>
                <option value="Roommate">Roommate</option>
                <option value="Room">Room</option>
              </select>
            </div>

            {/* Description */}
            <div className="col-md-12">
              <label>Description</label>
              <textarea className="form-control mb-3" name="description" placeholder="Describe your requirements..." value={formData.description} onChange={handleChange} required></textarea>
            </div>
          </div>

          {error && <p className="text-danger">{error}</p>}

          <button type="submit" className="btn w-100" style={{ backgroundColor: "#20b2aa", color: "#fff" }}>
            Post Request
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default NeedRoommate;
