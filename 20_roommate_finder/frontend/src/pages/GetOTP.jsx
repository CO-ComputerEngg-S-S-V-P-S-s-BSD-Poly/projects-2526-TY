import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const GetOTP = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    setMobile(e.target.value);
    setError("");
  };

  // 🔄 Handle OTP Request (No API Call, Just Navigation)
  const handleGetOTP = () => {
    if (!mobile || mobile.length !== 10 || isNaN(mobile)) {
      setError("❌ Please enter a valid 10-digit mobile number.");
      return;
    }
    
    alert("✅ OTP Sent Successfully!");
    navigate("/verify-otp", { state: { mobile } });
  };

  return (
    <motion.div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="card p-4 shadow-lg text-center" style={{ maxWidth: "400px" }}>
        <h2>Get OTP</h2>
        <p>Enter your mobile number to receive an OTP.</p>
        <input
          type="text"
          className="form-control text-center"
          placeholder="Enter Mobile Number"
          value={mobile}
          onChange={handleChange}
          maxLength="10"
        />
        {error && <p className="text-danger mt-2">{error}</p>}
        <button className="btn w-100 mt-3" style={{ backgroundColor: "#20b2aa", color: "#fff" }} onClick={handleGetOTP}>
          Get OTP
        </button>
      </div>
    </motion.div>
  );
};

export default GetOTP;
