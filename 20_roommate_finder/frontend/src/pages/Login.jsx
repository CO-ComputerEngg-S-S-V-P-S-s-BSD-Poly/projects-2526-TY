import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import HomeImage from "../assets/Home3.png";

const Login = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enter Mobile | Step 2: Enter OTP
  const [error, setError] = useState("");

  // 🔹 Handle Input Changes
  const handleChange = (e) => {
    if (step === 1) {
      setMobile(e.target.value);
    } else {
      setOtp(e.target.value);
    }
    setError("");
  };

  // 🔄 Handle OTP Request
  const handleGetOTP = async () => {
    if (!mobile || mobile.length !== 10) {
      setError("❌ Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/login/get-otp", { mobile });
      alert("✅ OTP Sent Successfully!");
      setStep(2); // Move to OTP verification step
    } catch (error) {
      console.error("❌ OTP Request Error:", error.response?.data || error);
      setError("❌ User not found. Please register first.");
    }
  };

  // 🔄 Handle OTP Verification
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 4) {
      setError("❌ Please enter a valid 4-digit OTP.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login/verify-otp", { mobile, otp });

      // ✅ Save token and user details in localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        setError("❌ Login failed. No token received.");
        return;
      }

      alert("✅ Login Successful!");
      console.log("🔹 Login Response:", response.data);

      // ✅ Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ OTP Verification Error:", error.response?.data || error);
      setError("❌ Invalid OTP. Try again.");
    }
  };

  return (
    <motion.div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "linear-gradient(135deg, #f8fafc 0%, #dbeafe 40%, #fef2f2 100%)"
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div
        className="shadow-lg"
        style={{
          width: "100%",
          maxWidth: "1100px",
          borderRadius: "18px",
          overflow: "hidden",
          background: "#ffffff",
          border: "1px solid #e2e8f0"
        }}
      >
        <div className="row g-0">
          <div className="col-lg-6 d-none d-lg-flex" style={{ background: "#0ea5e9", color: "white" }}>
            <div className="p-5 d-flex flex-column justify-content-between" style={{ minHeight: "520px" }}>
              <div>
                <p className="badge text-bg-light text-primary" style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                  Welcome back
                </p>
                <h2 style={{ fontWeight: 800, fontSize: "2.4rem", lineHeight: 1.1 }}>Fast OTP Login</h2>
                <p className="mt-3" style={{ fontSize: "1.05rem" }}>
                  Sign in with your mobile in two quick steps. Stay signed in across the flatmate dashboard, listings, and chat.
                </p>
                <ul className="mt-4" style={{ lineHeight: 1.8 }}>
                  <li>City-ready dashboard with saved preferences</li>
                  <li>Reply to room owners instantly</li>
                  <li>Secure session with JWT token</li>
                </ul>
              </div>
              <img src={HomeImage} alt="Login visual" style={{ width: "100%", maxWidth: "420px", alignSelf: "center" }} />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="p-5" style={{ minHeight: "520px" }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <p className="text-muted mb-1" style={{ fontWeight: 600, letterSpacing: "0.05em" }}>
                    Sign in
                  </p>
                  <h3 style={{ fontWeight: 800, fontSize: "2rem", margin: 0 }}>{step === 1 ? "Enter mobile" : "Verify OTP"}</h3>
                </div>
                <button
                  className="btn btn-outline-primary"
                  style={{ borderRadius: "10px", fontWeight: 700 }}
                  onClick={() => navigate("/auth")}
                >
                  Create account
                </button>
              </div>

              {step === 1 ? (
                <>
                  <label className="form-label fw-semibold">Mobile number</label>
                  <input
                    type="text"
                    className="form-control form-control-lg mb-3"
                    placeholder="10-digit mobile"
                    value={mobile}
                    onChange={handleChange}
                    maxLength="10"
                    style={{ height: "58px" }}
                  />
                  {error && <p className="text-danger mb-2">{error}</p>}
                  <button
                    className="btn btn-primary w-100"
                    style={{ backgroundColor: "#20b2aa", borderColor: "#20b2aa", height: "58px", fontWeight: 700 }}
                    onClick={handleGetOTP}
                  >
                    Get OTP
                  </button>
                </>
              ) : (
                <>
                  <label className="form-label fw-semibold">Enter OTP</label>
                  <input
                    type="text"
                    className="form-control form-control-lg mb-3 text-center"
                    placeholder="4-digit code"
                    value={otp}
                    onChange={handleChange}
                    maxLength="4"
                    style={{ letterSpacing: "0.3em", height: "58px", fontSize: "22px", fontWeight: 700 }}
                  />
                  {error && <p className="text-danger mb-2">{error}</p>}
                  <button
                    className="btn btn-primary w-100"
                    style={{ backgroundColor: "#20b2aa", borderColor: "#20b2aa", height: "58px", fontWeight: 700 }}
                    onClick={handleVerifyOTP}
                  >
                    Verify & Continue
                  </button>
                  <button
                    className="btn btn-link mt-3"
                    style={{ color: "#0ea5e9", fontWeight: 700 }}
                    onClick={() => setStep(1)}
                  >
                    Edit mobile number
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
