import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // ✅ Ensure Bootstrap JS is included
import { FaHome, FaUser, FaSignOutAlt, FaBell, FaCog, FaHandsHelping } from "react-icons/fa";

const Header = ({ setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 🔄 Fetch user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location.pathname]); // Update when the route changes

  // 📌 Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  // 🔹 Navigate to User Dashboard with ActiveTab
  const handleNavigation = (tab) => {
    setActiveTab(tab);
    navigate("/user-dashboard");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm px-4">
      <div className="container">
        {/* 🔹 Logo & Text */}
        <Link to="/" className="navbar-brand d-flex align-items-center" style={styles.brand}>
          <FaHome style={styles.homeIcon} />
          <span style={styles.brandText}>ROOMMATE FINDER</span>
        </Link>

        <div className="ms-auto d-flex align-items-center">
          {user && location.pathname !== "/" ? (
            // ✅ Show Profile Picture & Dropdown Menu if Logged In (Except Home Page)
            <div className="dropdown">
              <button
                className="btn btn-light dropdown-toggle d-flex align-items-center"
                id="profileDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={user.profilePic ? `http://localhost:5000/${user.profilePic}` : "https://via.placeholder.com/50"}
                  alt="Profile"
                  className="rounded-circle me-2"
                  width="40"
                  height="40"
                  style={{ objectFit: "cover" }}
                />
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                <li>
                  <button className="dropdown-item" onClick={() => handleNavigation("profile")}>
                    <FaUser className="me-2" /> My Profile
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => handleNavigation("preferences")}>
                    <FaCog className="me-2" /> My Preferences
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => handleNavigation("notifications")}>
                    <FaBell className="me-2" /> My Notifications
                  </button>

                  <button className="dropdown-item">
                    <FaHandsHelping className="me-2" /> Need Help
                  </button>
                </li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" /> Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            // ✅ Show Register & Login Buttons on Home Page
            <div className="d-flex gap-3">
              <button className="btn fw-bold" style={styles.registerButton} onClick={() => navigate("/auth")}>
                Register
              </button>
              <button className="btn fw-bold" style={styles.loginButton} onClick={() => navigate("/login")}>
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// ✅ Inline Styles
const styles = {
  brand: {
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  homeIcon: {
    fontSize: "28px",
    color: "#20b2aa",
    marginRight: "10px",
  },
  brandText: {
    color: "#333",
    fontWeight: "bold",
    letterSpacing: "1px",
  },
  registerButton: {
    backgroundColor: "#20b2aa",
    color: "#fff",
    padding: "8px 15px",
    borderRadius: "5px",
    fontSize: "18px",
    cursor: "pointer",
    border: "none",
  },
  loginButton: {
    backgroundColor: "#20b2aa",
    color: "#fff",
    padding: "8px 15px",
    borderRadius: "5px",
    fontSize: "18px",
    cursor: "pointer",
    border: "none",
  },
};

export default Header;
