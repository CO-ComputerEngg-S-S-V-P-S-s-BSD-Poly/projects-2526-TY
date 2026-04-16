import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import NeedRoomImage from "../assets/NeedRoom.png"; // Importing Images
import NeedRoommateImage from "../assets/NeedRoommate.png";

const List = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="container d-flex flex-column align-items-center justify-content-center vh-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* ✅ Heading with Animation */}
      <motion.h2
        className="text-center mb-3"
        style={{ color: "#20b2aa", fontWeight: "bold" }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Find Your Perfect Space
      </motion.h2>

      {/* ✅ Paragraph Below Heading */}
      <p className="text-center mb-4" style={{ fontSize: "18px", color: "black" }}>
        Looking for a **room**? Or **need a flatmate**? We’ve got you covered!  
        <span style={{ color: "rgb(219,112,147)", fontWeight: "bold" }}> Choose your preference below.</span>
      </p>

      {/* ✅ Cards Container */}
      <div className="d-flex flex-wrap justify-content-center gap-4">
        
        {/* 🏠 Need Room Card */}
        <motion.div
          className="card shadow-lg text-center"
          style={{
            backgroundColor: "rgb(219,112,147)",
            color: "#fff",
            borderRadius: "15px",
            padding: "20px",
            width: "350px",
            height: "350px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/need-room")}
        >
          <img src={NeedRoomImage} alt="Need Room" width="80px" className="mb-3" />
          <h4 style={{ fontWeight: "bold" }}>Need Room with Roommate</h4>
        </motion.div>

        {/* 🏡 Need Roommate Card */}
        <motion.div
          className="card shadow-lg text-center"
          style={{
            backgroundColor: "#20b2aa",
            color: "#fff",
            borderRadius: "15px",
            padding: "20px",
            width: "350px",
            height: "350px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/need-roommate")}
        >
          <img src={NeedRoommateImage} alt="Need Roommate" width="80px" className="mb-3" />
          <h4 style={{ fontWeight: "bold" }}>Need Roommate for Your Room</h4>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default List;
