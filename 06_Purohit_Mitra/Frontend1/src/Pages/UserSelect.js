// import React from "react";
// import "./UserSelect.css";
// import bg from "../Assets/bg.jpg";
// import logo from "../Assets/logo-removebg-preview.png";
// import mandala from "../Assets/mandalaright-removebg-preview.png";
// import { useNavigate } from "react-router-dom";

// const UserSelect = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="container">
//       {/* LEFT */}
//       <div
//         className="left"
//         style={{ backgroundImage: `url(${bg})` }}
//       >
//         <div className="overlay">
//           <img src={logo} alt="logo" className="logo" />

//           <h2 className="login-title">Login</h2>

//           {/* ONLY THIS BUTTON UPDATED */}
//           <button
//             className="login-btn"
//             onClick={() => navigate("/pandit-login")}
//           >
//             I am Pandit
//           </button>

//           <p className="or-text">Or</p>

//           <button
//   className="login-btn"
//   onClick={() => navigate("/user-login")}
// >
//   I am User
// </button>

//         </div>
//       </div>

//       {/* RIGHT */}
//       <div className="right">
//         <img src={mandala} alt="mandala" className="mandala-bg" />

//         <div className="mantra-card">
//           <span className="line"></span>
//           <h2 className="mantra-text">
//             वक्रतुंड महाकाय<br />
//             सूर्यकोटि समप्रभः<br />
//             निर्विघ्नं कुरु मे देव<br />
//             सर्वकार्येषु सर्वदा ॥
//           </h2>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserSelect;

import React from "react";
import "./UserSelect.css";
import bg from "../Assets/bg.jpg";
import logo from "../Assets/logo-removebg-preview.png";
import mandala from "../Assets/mandalaright-removebg-preview.png";
import { useNavigate } from "react-router-dom";

const UserSelect = () => {
  const navigate = useNavigate();

  // 🔥 ROLE HANDLE FUNCTION
  const handleSelect = (role, path) => {
    localStorage.setItem("selectedRole", role);
    navigate(path);
  };

  return (
    <div className="container">
      {/* LEFT */}
      <div
        className="left"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="overlay">
          <img src={logo} alt="logo" className="logo" />

          <h2 className="login-title">Login</h2>

          {/* 🔥 UPDATED BUTTON */}
          <button
            className="login-btn"
            onClick={() => handleSelect("pandit", "/pandit-login")}
          >
            I am Pandit
          </button>

          <p className="or-text">Or</p>

          {/* 🔥 UPDATED BUTTON */}
          <button
            className="login-btn"
            onClick={() => handleSelect("user", "/user-login")}
          >
            I am User
          </button>

        </div>
      </div>

      {/* RIGHT */}
      <div className="right">
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

export default UserSelect;
