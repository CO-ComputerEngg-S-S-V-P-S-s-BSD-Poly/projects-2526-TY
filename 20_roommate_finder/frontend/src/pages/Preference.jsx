import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

// ✅ Import Preference Images
import vegIcon from "../assets/veg1.png";
import studentIcon from "../assets/stu2.png";
import jobIcon from "../assets/job3.png";
import nonAlkoIcon from "../assets/nonalko4.png";
import gymIcon from "../assets/gym5.png";
import nightOwlIcon from "../assets/nightowl6.png";
import earlyBirdIcon from "../assets/earlybird7.png";
import sportyIcon from "../assets/sporty8.png";
import travellerIcon from "../assets/traveller9.png";
import partyLoverIcon from "../assets/partylover10.png";
import petLoverIcon from "../assets/petlover11.png";
import musicLoverIcon from "../assets/music lover12.png";

// ✅ Define Preferences Data (Including New Preferences)
const preferencesData = [
  { name: "vegetarian", label: "Vegetarian", img: vegIcon },
  { name: "student", label: "Student", img: studentIcon },
  { name: "job", label: "Job", img: jobIcon },
  { name: "nonAlcoholic", label: "Non-Alcoholic", img: nonAlkoIcon },
  { name: "gym", label: "Gym", img: gymIcon },
  { name: "nightOwl", label: "Night Owl", img: nightOwlIcon },
  { name: "earlyBird", label: "Early Bird", img: earlyBirdIcon },
  { name: "sporty", label: "Sporty", img: sportyIcon },
  { name: "traveller", label: "Traveller", img: travellerIcon },
  { name: "partyLover", label: "Party Lover", img: partyLoverIcon },
  { name: "petLover", label: "Pet Lover", img: petLoverIcon },
  { name: "musicLover", label: "Music Lover", img: musicLoverIcon },
];

const Preference = () => {
  const navigate = useNavigate();
  const [selectedPreferences, setSelectedPreferences] = useState({});
  const [error, setError] = useState("");

  // 🔹 Toggle Selection of Preferences
  const togglePreference = (prefName) => {
    setSelectedPreferences((prev) => ({
      ...prev,
      [prefName]: !prev[prefName],
    }));
    setError(""); // Clear error message on change
  };

  // 🔄 Handle Preferences Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Count selected preferences
    const selectedCount = Object.values(selectedPreferences).filter(Boolean).length;
    if (selectedCount < 3) {
      setError("❌ Please select at least 3 preferences.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // ✅ Retrieve token from localStorage

      if (!token) {
        setError("❌ Unauthorized! Please login again.");
        return;
      }

      const response = await axios.post("http://localhost:5000/api/preferences", selectedPreferences, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Preferences Saved:", response.data);
      alert("✅ Preferences saved successfully!");

      // ✅ Redirect to dashboard or next page
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Error saving preferences:", error.response?.data || error);
      setError(error.response?.data.message || "❌ Invalid token! Please login again.");
    }
  };

  return (
    <motion.div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="card p-4 shadow-lg text-center" style={{ maxWidth: "900px" }}>
        <h2>Set Your Preferences</h2>
        <p>Select at least 3 preferences</p>

        <form onSubmit={handleSubmit} className="w-100">
          {/* Preferences Grid Layout with Spacing Between Rows */}
          <div className="d-flex flex-wrap justify-content-center align-items-center mt-3">
            {preferencesData.slice(0, 6).map((pref) => ( // ✅ First Row (6 Preferences)
              <div
                key={pref.name}
                className="text-center mx-3 mb-3"
                onClick={() => togglePreference(pref.name)}
                style={{
                  cursor: "pointer",
                  borderRadius: "50%",
                  padding: "15px",
                  width: "100px",
                  height: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  border: selectedPreferences[pref.name] ? "4px solid #20b2aa" : "2px solid #ddd",
                  transition: "0.3s",
                  boxShadow: selectedPreferences[pref.name] ? "0 0 15px #20b2aa" : "none",
                }}
              >
                <img src={pref.img} alt={pref.label} width="50px" height="50px" />
                <p className="mt-1" style={{ fontSize: "12px", fontWeight: "bold" }}>{pref.label}</p>
              </div>
            ))}
          </div>

          {/* ✅ Space Between Two Rows */}
          <div style={{ height: "20px" }}></div>

          {/* ✅ Second Row (6 Preferences) */}
          <div className="d-flex flex-wrap justify-content-center align-items-center">
            {preferencesData.slice(6, 12).map((pref) => ( // ✅ Second Row (Remaining 6 Preferences)
              <div
                key={pref.name}
                className="text-center mx-3 mb-3"
                onClick={() => togglePreference(pref.name)}
                style={{
                  cursor: "pointer",
                  borderRadius: "50%",
                  padding: "15px",
                  width: "100px",
                  height: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  border: selectedPreferences[pref.name] ? "4px solid #20b2aa" : "2px solid #ddd",
                  transition: "0.3s",
                  boxShadow: selectedPreferences[pref.name] ? "0 0 15px #20b2aa" : "none",
                }}
              >
                <img src={pref.img} alt={pref.label} width="50px" height="50px" />
                <p className="mt-1" style={{ fontSize: "12px", fontWeight: "bold" }}>{pref.label}</p>
              </div>
            ))}
          </div>

          {/* Horizontal Line Divider */}
          <br />

          {error && <p className="text-danger">{error}</p>}

          <button type="submit" className="btn w-100 mt-3" style={{ backgroundColor: "#20b2aa", color: "#fff" }}>
            Save Preferences
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Preference;
