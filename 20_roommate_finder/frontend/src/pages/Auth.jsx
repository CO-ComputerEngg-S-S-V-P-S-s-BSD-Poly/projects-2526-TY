import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import HomeImage from "../assets/Home.png";

const Auth = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    mobile: "",
    name: "",
    gender: "",
    city: "",
    profilePic: null,
    profilePicPreview: null,
  });

  const [error, setError] = useState("");

  // 🔹 Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // 🖼 Handle Profile Picture Upload
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, profilePic: file, profilePicPreview: imageUrl });
    }
  };

  // 🔄 Handle Registration (Save User in DB & Store Token)
  const handleRegister = async (e) => {
    e.preventDefault();

    const { mobile, name, gender, city, profilePic } = formData;
    if (!mobile || mobile.length !== 10 || !name || !gender || !city || !profilePic) {
      setError("❌ Please fill in all required fields and upload a profile picture.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("mobile", mobile);
      formDataToSend.append("name", name);
      formDataToSend.append("gender", gender);
      formDataToSend.append("city", city);
      formDataToSend.append("profilePic", profilePic);

      const response = await axios.post("http://localhost:5000/api/auth/register", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Register Response:", response.data);

      if (response.data.token) {
        // ✅ Store user data in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        setError("❌ Token missing from response!");
        return;
      }

      alert("✅ Registration Successful!");
      navigate("/preferences"); // ✅ Redirect to Dashboard
    } catch (error) {
      console.error("❌ Registration Error:", error.response?.data || error);
      setError(error.response?.data.message || "❌ Error registering. Please try again.");
    }
  };

  return (
    <motion.div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 40%, #fef9c3 100%)"
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div
        className="shadow-lg"
        style={{
          width: "100%",
          maxWidth: "1150px",
          borderRadius: "18px",
          overflow: "hidden",
          background: "#ffffff",
          border: "1px solid #e2e8f0"
        }}
      >
        <div className="row g-0">
          <div className="col-lg-6 d-none d-lg-flex" style={{ background: "#0f172a", color: "white" }}>
            <div className="p-5 d-flex flex-column justify-content-between" style={{ minHeight: "540px" }}>
              <div>
                <p className="badge text-bg-light text-dark" style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                  Create your profile
                </p>
                <h2 style={{ fontWeight: 800, fontSize: "2.4rem", lineHeight: 1.1 }}>Join the flatmate network</h2>
                <p className="mt-3" style={{ fontSize: "1.05rem" }}>
                  Register once, unlock personalized matches, area wise rooms, and instant contact with owners and seekers.
                </p>
                <ul className="mt-4" style={{ lineHeight: 1.8 }}>
                  <li>Upload a profile photo for trust</li>
                  <li>Pick your city to pre-filter rooms</li>
                  <li>Save preferences and get alerts</li>
                </ul>
              </div>
              <img src={HomeImage} alt="Register visual" style={{ width: "100%", maxWidth: "420px", alignSelf: "center" }} />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="p-5" style={{ minHeight: "540px" }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <p className="text-muted mb-1" style={{ fontWeight: 600, letterSpacing: "0.05em" }}>
                    New account
                  </p>
                  <h3 style={{ fontWeight: 800, fontSize: "2rem", margin: 0 }}>Register in 3 steps</h3>
                </div>
                <button
                  className="btn btn-outline-primary"
                  style={{ borderRadius: "10px", fontWeight: 700 }}
                  onClick={() => navigate("/login")}
                >
                  Already have account
                </button>
              </div>

              <div className="d-flex justify-content-center mb-4">
                <label
                  htmlFor="profilePicInput"
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "110px",
                    height: "110px",
                    borderRadius: "50%",
                    border: "2px dashed #20b2aa",
                    cursor: "pointer",
                    background: "#f8fafc"
                  }}
                >
                  {formData.profilePicPreview ? (
                    <img
                      src={formData.profilePicPreview}
                      alt="Profile"
                      style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <FaPlus style={{ fontSize: "24px", color: "#20b2aa" }} />
                  )}
                </label>
                <input type="file" id="profilePicInput" accept="image/*" onChange={handleProfilePicChange} style={{ display: "none" }} />
              </div>

              <form onSubmit={handleRegister} className="w-100">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold">Mobile number</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="10-digit mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      maxLength="10"
                      required
                      style={{ height: "56px" }}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Full name</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Your full name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={{ height: "56px" }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Gender</label>
                    <select
                      className="form-control form-control-lg"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      style={{ height: "56px" }}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">City</label>
                    <select
                      className="form-control form-control-lg"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      style={{ height: "56px" }}
                    >
                      <option value="">Select City</option>
                      <option value="Pune">Pune</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Nagpur">Nagpur</option>
                      <option value="Nashik">Nashik</option>
                      <option value="Sambhajinagar">Sambhajinagar</option>
                      <option value="Dhule">Dhule</option>
                    </select>
                  </div>
                </div>

                {error && <p className="text-danger mt-3">{error}</p>}
                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-4"
                  style={{ backgroundColor: "#20b2aa", borderColor: "#20b2aa", height: "58px", fontWeight: 700 }}
                >
                  Create account
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Auth;
