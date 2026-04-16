import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaLeaf, FaGraduationCap, FaBriefcase, FaWineBottle, FaDumbbell, FaMoon, FaSun, FaRunning, FaGlobe, FaGlassCheers, FaPaw, FaMusic } from "react-icons/fa";

const UserDashboard = ({ activeTab }) => { // ✅ Receive activeTab from App.jsx
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserData();
    fetchPreferences();
    fetchNotifications();
  }, []);

  // 🔹 Fetch User Data from LocalStorage (No API for this)
  const fetchUserData = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  // 🔹 Fetch User Preferences
  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/preferences", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPreferences(response.data);
      setLoading(false);
    } catch (err) {
      setError("❌ Failed to load preferences.");
      setLoading(false);
    }
  };

  // 🔹 Fetch User Notifications (Both APIs)
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const [needRoomRes, needFlatmateRes] = await Promise.all([
        axios.get("http://localhost:5000/api/need-room/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/need-flatmate/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const allNotifications = [...needRoomRes.data.notifications, ...needFlatmateRes.data.notifications];
      setNotifications(allNotifications.reverse()); // Show latest notifications first
      setLoading(false);
    } catch (err) {
      setError("❌ Failed to load notifications.");
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="container d-flex flex-column align-items-center vh-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
     <h2 className="text-center my-4 fw-bold" style={{ color: "#20b2aa" }}>
     User Dashboard
    </h2>


      {/* ✅ Active Section Content */}
      <motion.div className="w-50 d-flex flex-column align-items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : (
          <>
            {/* 🔹 My Profile Section */}
            {activeTab === "profile" && user && (
              <div className="card p-1 shadow-lg text-center align-items-center" style={styles.card}>
                <img
                  src={user.profilePic ? `http://localhost:5000/${user.profilePic}` : "https://via.placeholder.com/100"}
                  alt="Profile"
                  className="rounded-circle mb-1"
                  width="100"
                  height="100"
                  style={{ objectFit: "cover" }}
                />
                <h4 className="fw-bold">{user.name}</h4>
                <p className="text-muted"><strong>City:</strong> {user.city}</p>
                <p className="text-muted"><strong>Gender:</strong> {user.gender}</p>
                <p className="text-muted"><strong>Mobile:</strong> {user.mobile}</p>
              </div>
            )}

          {/* 🔹 My Preferences Section */}
{activeTab === "preferences" && preferences && (
  <div className="card p-4 shadow-lg" style={styles.card}>
    <h4 className="fw-bold text-center">Your Preferences</h4>
    <ul className="list-group">
      <li className="list-group-item d-flex align-items-center">
        <FaLeaf className="me-2 text-success" /> 
        <strong>Vegetarian:</strong> {preferences.vegetarian ? "Yes" : "No"}
      </li>
      <li className="list-group-item d-flex align-items-center">
        <FaGraduationCap className="me-2 text-primary" /> 
        <strong>Student:</strong> {preferences.student ? "Yes" : "No"}
      </li>
      <li className="list-group-item d-flex align-items-center">
        <FaBriefcase className="me-2 text-dark" /> 
        <strong>Job:</strong> {preferences.job ? "Yes" : "No"}
      </li>
      <li className="list-group-item d-flex align-items-center">
        <FaWineBottle className={`me-2 ${preferences.nonAlcoholic ? "text-success" : "text-danger"}`} /> 
        <strong>Non-Alcoholic:</strong> {preferences.nonAlcoholic ? "Yes" : "No"}
      </li>
      <li className="list-group-item d-flex align-items-center">
        <FaDumbbell className="me-2 text-warning" /> 
        <strong>Gym:</strong> {preferences.gym ? "Yes" : "No"}
      </li>

      <li className="list-group-item d-flex align-items-center">
              <FaMoon className="me-2 text-secondary" />
              <strong>Night Owl:</strong> {preferences.nightOwl ? "Yes" : "No"}
            </li>
            <li className="list-group-item d-flex align-items-center">
              <FaSun className="me-2 text-warning" />
              <strong>Early Bird:</strong> {preferences.earlyBird ? "Yes" : "No"}
            </li>
            <li className="list-group-item d-flex align-items-center">
              <FaRunning className="me-2 text-success" />
              <strong>Sporty:</strong> {preferences.sporty ? "Yes" : "No"}
            </li>
            <li className="list-group-item d-flex align-items-center">
              <FaGlobe className="me-2 text-info" />
              <strong>Traveller:</strong> {preferences.traveller ? "Yes" : "No"}
            </li>
            <li className="list-group-item d-flex align-items-center">
              <FaGlassCheers className="me-2 text-danger" />
              <strong>Party Lover:</strong> {preferences.partyLover ? "Yes" : "No"}
            </li>
            <li className="list-group-item d-flex align-items-center">
              <FaPaw className="me-2 text-brown" />
              <strong>Pet Lover:</strong> {preferences.petLover ? "Yes" : "No"}
            </li>
            <li className="list-group-item d-flex align-items-center">
              <FaMusic className="me-2 text-purple" />
              <strong>Music Lover:</strong> {preferences.musicLover ? "Yes" : "No"}
            </li>
    </ul>
  </div>
)}

            {/* 🔹 My Notifications Section */}
            {activeTab === "notifications" && (
              <div className="card p-6 shadow-lg" style={styles.card}>
                <h4 className="fw-bold text-center">Recent Notifications</h4>
                {notifications.length > 0 ? (
                  notifications.map((notif, index) => (
                    <div key={index} className="alert alert-info d-flex align-items-center mb-2">
                      <img
                        src={notif.user.profilePic ? `http://localhost:5000/${notif.user.profilePic}` : "https://via.placeholder.com/40"}
                        alt="User"
                        className="rounded-circle me-3"
                        width="40"
                        height="40"
                        style={{ objectFit: "cover" }}
                      />
                      <div>
                        <p className="mb-0"><strong>{notif.user.name}</strong>: {notif.message}</p>
                        <small className="text-muted">{new Date(notif.createdAt).toLocaleString()}</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center">No notifications found.</p>
                )}
              </div>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

// ✅ Inline Styles
const styles = {
  card: {
    maxWidth: "450px", // ✅ Smaller Card Width
    width: "100%",
    background: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "30px",
    marginBottom: "15px",
  },
};

export default UserDashboard;
