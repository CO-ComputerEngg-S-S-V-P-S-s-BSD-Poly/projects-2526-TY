import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = location.state?.mobile || ""; // ✅ Get Mobile from GetOTP Page
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  // 🔹 Handle OTP Input Change
  const handleChange = (e) => {
    setOtp(e.target.value);
    setError("");
  };

  // 🔄 Handle OTP Verification (No API Call, Just Check OTP)
  const handleVerifyOTP = () => {
    if (!otp || otp.length !== 4) {
      setError("❌ Please enter a 4-digit OTP.");
      return;
    }

    if (otp === "1234") {
      alert("✅ OTP Verified Successfully!");
      navigate("/auth", { state: { mobile } });
    } else {
      setError("❌ Invalid OTP. Try again.");
    }
  };

  return (
    <motion.div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="card p-4 shadow-lg text-center" style={{ maxWidth: "400px" }}>
        <h2>Verify OTP</h2>
        <p>Enter the OTP sent to your mobile number.</p>
        <input type="text" className="form-control text-center" placeholder="Enter OTP" value={otp} onChange={handleChange} maxLength="4" />
        {error && <p className="text-danger mt-2">{error}</p>}
        <button className="btn w-100 mt-3" style={{ backgroundColor: "#20b2aa", color: "#fff" }} onClick={handleVerifyOTP}>
          Verify OTP
        </button>
      </div>
    </motion.div>
  );
};

export default VerifyOTP;
