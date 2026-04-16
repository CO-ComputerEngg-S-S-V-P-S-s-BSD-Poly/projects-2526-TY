// import React, { useState } from "react";
// import "../Pages/Navbar.css";
// import { useNavigate } from "react-router-dom";
// import logo from "../Assets/logo-removebg-preview.png";
// import ProfileSidebar from "./ProfileSidebar";
// import { FaUserCircle } from "react-icons/fa";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [showProfile, setShowProfile] = useState(false);

//   const userData = {
//     name: "User Name",
//     mobile: "9876543210",
//     email: "user@gmail.com",
//     address: "Pune"
//   };

//   return (
//     <>
//       <nav className="navbar">
//         <img src={logo} alt="logo" className="nav-logo-img" />

//         <ul className="nav-links">
//           <li onClick={() => navigate("/home")}>Home</li>
//           <li onClick={() => navigate("/all-pujas")}>All Pujas</li>
//           <li onClick={() => navigate("/explore")}>Explore</li>
//           <li onClick={() => navigate("/festivals")}>Hindu Festivals</li>
//           <li onClick={() => navigate("/vedic")}>Vedic</li>
//           <li onClick={() => navigate("/about")}>About Us</li>

//           {/* PROFILE ICON */}
//           <li onClick={() => setShowProfile(true)} className="profile-icon">
//             <FaUserCircle size={26} />
//           </li>
//         </ul>
//       </nav>

//       {showProfile && (
//         <ProfileSidebar
//           userData={userData}
//           onClose={() => setShowProfile(false)}
//         />
//       )}
//     </>
//   );
// };

// export default Navbar;





// import React, { useState } from "react";
// import "../Pages/Navbar.css";
// import { useNavigate } from "react-router-dom";
// import logo from "../Assets/logo-removebg-preview.png";
// import ProfileSidebar from "./ProfileSidebar";
// import { FaUserCircle, FaBell } from "react-icons/fa";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [showProfile, setShowProfile] = useState(false);

//   // 🔔 Notification state
//   const [unreadCount, setUnreadCount] = useState(2); 
//   // abhi demo ke liye 2 dala hai, baad me API se aayega

//   const userData = {
//     name: "User Name",
//     mobile: "9876543210",
//     email: "user@gmail.com",
//     address: "Pune"
//   };

//   // 👇 Sidebar open karte hi notification clear
//   const openProfileSidebar = () => {
//     setUnreadCount(0);   // STEP 5 (Reset count)
//     setShowProfile(true);
//   };

//   return (
//     <>
//       <nav className="navbar">
//         <img src={logo} alt="logo" className="nav-logo-img" />

//         <ul className="nav-links">
//           <li onClick={() => navigate("/home")}>Home</li>
//           <li onClick={() => navigate("/all-pujas")}>All Pujas</li>
//           <li onClick={() => navigate("/explore")}>Explore</li>
//           <li onClick={() => navigate("/festivals")}>Hindu Festivals</li>
//           <li onClick={() => navigate("/vedic")}>Vedic</li>
//           <li onClick={() => navigate("/about")}>About Us</li>

//           {/* 🔔 NOTIFICATION BELL */}
//           <li style={{ position: "relative", cursor: "pointer" }}>
//             <FaBell size={22} />

//             {unreadCount > 0 && (
//               <span
//                 style={{
//                   position: "absolute",
//                   top: "-6px",
//                   right: "-10px",
//                   background: "red",
//                   color: "white",
//                   borderRadius: "50%",
//                   padding: "3px 7px",
//                   fontSize: "11px",
//                   fontWeight: "bold"
//                 }}
//               >
//                 {unreadCount}
//               </span>
//             )}
//           </li>

//           {/* PROFILE ICON */}
//           <li onClick={openProfileSidebar} className="profile-icon">
//             <FaUserCircle size={26} />
//           </li>
//         </ul>
//       </nav>

//       {showProfile && (
//         <ProfileSidebar
//           userData={userData}
//           onClose={() => setShowProfile(false)}
//         />
//       )}
//     </>
//   );
// };

// export default Navbar;





import React, { useState, useEffect } from "react";
import "../Pages/Navbar.css";
import { useNavigate } from "react-router-dom";
import logo from "../Assets/logo-removebg-preview.png";
import ProfileSidebar from "./ProfileSidebar";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const storedUser = JSON.parse(localStorage.getItem("user"));

  // 🔥 Fetch Pending Booking Count
  const fetchPendingCount = async () => {
    try {
      if (!storedUser) return;

      let res;

      if (storedUser.role === "user") {
        res = await axios.get(
          `http://localhost:8000/api/booking/user/${storedUser._id}`
        );
      }

      if (storedUser.role === "pandit") {
        res = await axios.get(
          `http://localhost:8000/api/booking/pandit/${storedUser._id}`
        );
      }

      const pending = res.data.filter(
        (b) => b.status === "Pending"
      );

      setUnreadCount(pending.length);

    } catch (error) {
      console.log(error);
    }
  };

  // 🔄 Auto refresh every 5 sec
  useEffect(() => {
    fetchPendingCount();

    const interval = setInterval(() => {
      fetchPendingCount();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 👉 Profile open = clear badge
  const openProfileSidebar = () => {
    setUnreadCount(0);
    setShowProfile(true);
  };

  return (
    <>
      <nav className="navbar">
        <img src={logo} alt="logo" className="nav-logo-img" />

        <ul className="nav-links">
          <li onClick={() => navigate("/home")}>Home</li>
          <li onClick={() => navigate("/all-pujas")}>All Pujas</li>
          <li onClick={() => navigate("/explore")}>Explore</li>
          <li onClick={() => navigate("/festivals")}>Hindu Festivals</li>
          <li onClick={() => navigate("/vedic")}>Vedic</li>
          <li onClick={() => navigate("/about")}>About Us</li>

          {/* PROFILE ICON WITH PENDING COUNT */}
          <li
            onClick={openProfileSidebar}
            className="profile-icon"
            style={{ position: "relative", cursor: "pointer" }}
          >
            <FaUserCircle size={28} />

            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-8px",
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "3px 7px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  minWidth: "18px",
                  textAlign: "center"
                }}
              >
                {unreadCount}
              </span>
            )}
          </li>
        </ul>
      </nav>

      {showProfile && (
        <ProfileSidebar
          userData={storedUser}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
};

export default Navbar;