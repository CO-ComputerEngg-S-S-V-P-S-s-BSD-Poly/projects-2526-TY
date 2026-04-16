import React, { useState } from "react";
import "./UserLogin.css";
import logo from "../Assets/logo-removebg-preview.png";
import { toast } from "react-toastify";
import bg from "../Assets/bg.jpg";
import mandala from "../Assets/mandalaright-removebg-preview.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signup");

  const [signupForm, setSignupForm] = useState({
    name: "",
    MobileNo: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleSignupChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const validateSignup = () => {
    let newErrors = {};

    if (!signupForm.name) newErrors.name = "Name is required";

    if (!/^\d{10}$/.test(signupForm.MobileNo))
      newErrors.MobileNo = "Mobile must be 10 digits";

    if (!signupForm.email.endsWith("@gmail.com"))
      newErrors.email = "Email must end with @gmail.com";

    if (!signupForm.address) newErrors.address = "Address required";

    const passRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!passRegex.test(signupForm.password))
      newErrors.password =
        "Password must be 8+ chars with letter, number & special char";

    if (signupForm.password !== signupForm.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔥 USER SIGNUP API
  const handleSignupSubmit = async () => {
    if (!validateSignup()) return;

    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/registerlogin",
        {
          ...signupForm,
          role: "user",
        }
      );

      toast.success("User Signup Successful ✅");

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Signup failed");
    }
  };

  // 🔥 USER LOGIN API
  const handleLoginSubmit = async () => {
    if (!loginForm.email) return toast.error("Enter Email");
    if (!loginForm.password) return toast.error("Enter Password");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/login",
        loginForm
      );

      toast.success("User Login Successful ✅");

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="pandit-container">
      <div className="pandit-left" style={{ backgroundImage: `url(${bg})` }}>
        <div className="pandit-overlay">
          <div className="pandit-card big-form">

            {mode === "login" ? (
              <>
                <img
                  src={logo}
                  alt="logo"
                  className="profile-logo"
                />
                <h2 className="pandit-title">User Login</h2>

                <input
                  name="email"
                  placeholder="Email"
                  className="pandit-input"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="pandit-input"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                />

                <button className="pandit-btn" onClick={handleLoginSubmit}>
                  Login
                </button>

                <p className="switch-text" onClick={() => setMode("signup")}>
                  New user? Sign Up
                </p>
              </>
            ) : (
              <>
                <img
                    src={logo}
                    alt="logo"
                    className="profile-logo"
                   
                />
                <h2 className="pandit-title">User Sign Up</h2>

                <input
                  name="name"
                  placeholder="Name"
                  className="pandit-input"
                  value={signupForm.name}
                  onChange={handleSignupChange}
                />
                {errors.name && <p className="error-text">{errors.name}</p>}

                <input
                  name="MobileNo"
                  placeholder="Mobile Number"
                  className="pandit-input"
                  value={signupForm.MobileNo}
                  onChange={handleSignupChange}
                />
                {errors.MobileNo && <p className="error-text">{errors.MobileNo}</p>}

                <input
                  name="email"
                  placeholder="Email"
                  className="pandit-input"
                  value={signupForm.email}
                  onChange={handleSignupChange}
                />
                {errors.email && <p className="error-text">{errors.email}</p>}

                <input
                  name="address"
                  placeholder="Address"
                  className="pandit-input"
                  value={signupForm.address}
                  onChange={handleSignupChange}
                />
                {errors.address && <p className="error-text">{errors.address}</p>}

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="pandit-input"
                  value={signupForm.password}
                  onChange={handleSignupChange}
                />
                {errors.password && <p className="error-text">{errors.password}</p>}

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="pandit-input"
                  value={signupForm.confirmPassword}
                  onChange={handleSignupChange}
                />
                {errors.confirmPassword && (
                  <p className="error-text">{errors.confirmPassword}</p>
                )}

                <button className="pandit-btn" onClick={handleSignupSubmit}>
                  Sign Up
                </button>

                <p className="switch-text" onClick={() => setMode("login")}>
                  Already have account? Login
                </p>
              </>
            )}

          </div>
        </div>
      </div>

      <div className="pandit-right">
        <img src={mandala} alt="mandala" className="mandala-bg" />
        <div className="mantra-card">
          <span className="line"></span>
          <h2 className="mantra-text">
            वक्रतुंड महाकाय<br />
            सूर्यकोटि समप्रभः<br />
            निर्विघ्नं कुरु मे देव<br />
            सर्वकार्येषु सर्वदा ॥
          </h2>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;