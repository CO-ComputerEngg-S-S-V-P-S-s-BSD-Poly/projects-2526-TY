// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "./ShopkeeperSidebar.css";

// const navItems = [
//   { icon: "📊", label: "Dashboard",    path: "/shopkeeper/dashboard"    },
//   { icon: "📦", label: "My Products",  path: "/shopkeeper/products"     },
//   { icon: "➕", label: "Add Product",  path: "/shopkeeper/add-product"  },
//   { icon: "🏪", label: "Shop Profile", path: "/shopkeeper/shop-profile" },
//   { icon: "📅", label: "Work Hours",   path: "/shopkeeper/work-hours"   },
// ];

// // ✅ sessionStorage se read karo — App.jsx bhi yahi use karta hai
// const getShopkeeperData = () => {
//   try {
//     const raw = sessionStorage.getItem("shopkeeperData");
//     return raw ? JSON.parse(raw) : {};
//   } catch (e) {
//     return {};
//   }
// };

// const ShopkeeperSidebar = () => {
//   const navigate  = useNavigate();
//   const location  = useLocation();

//   // ✅ FIX: useState use karo taaki component mount hone par fresh data mile
//   const [sk, setSk] = useState({});

//   useEffect(() => {
//     const data = getShopkeeperData();
//     setSk(data);
//   }, []); // mount pe ek baar load

//   // ✅ sessionStorage clear karo — App.jsx ka ProtectedRoute check fail hoga → login pe redirect
//   const handleLogout = () => {
//     sessionStorage.removeItem("shopkeeperToken");
//     sessionStorage.removeItem("shopkeeperData");
//     window.location.href = "/shopkeeper/login";
//   };

//   return (
//     <aside className="sk-sidebar">
//       {/* Logo */}
//       <div className="sk-sidebar-logo">
//         <div className="sk-sidebar-logo-icon">🏺</div>
//         <div>
//           <div className="sk-sidebar-logo-name">Songir Brass</div>
//           <div className="sk-sidebar-logo-sub">Shopkeeper Panel</div>
//         </div>
//       </div>

//       {/* Nav */}
//       <nav className="sk-sidebar-nav">
//         <div className="sk-nav-group-label">Main Menu</div>
//         {navItems.map((item) => (
//           <div
//             key={item.path}
//             className={`sk-nav-item ${location.pathname === item.path ? "active" : ""}`}
//             onClick={() => navigate(item.path)}
//           >
//             <span className="sk-nav-icon">{item.icon}</span>
//             <span>{item.label}</span>
//           </div>
//         ))}

//         <div className="sk-nav-group-label" style={{ marginTop: 16 }}>Account</div>
//         <div
//           className={`sk-nav-item ${location.pathname === "/shopkeeper/settings" ? "active" : ""}`}
//           onClick={() => navigate("/shopkeeper/settings")}
//         >
//           <span className="sk-nav-icon">⚙️</span>
//           <span>Settings</span>
//         </div>
//         <div className="sk-nav-item sk-nav-logout" onClick={handleLogout}>
//           <span className="sk-nav-icon">🚪</span>
//           <span>Logout</span>
//         </div>
//       </nav>

//       {/* ✅ FIX: Bottom badge — ab actual ownerName aur shopName aayega */}
//       <div className="sk-sidebar-bottom">
//         <div className="sk-sidebar-badge">
//           <div className="sk-sidebar-avatar">
//             {sk.profileImage
//               ? <img src={`http://localhost:5000/${sk.profileImage}`} alt="shop" />
//               : "🏺"
//             }
//           </div>
//           <div>
//             {/* ✅ ownerName → "Riya Sharma", shopName → "Riyautensils" */}
//             <div className="sk-sidebar-name">{sk.ownerName || "Shopkeeper"}</div>
//             <div className="sk-sidebar-role">{sk.shopName  || "Shop Owner"}</div>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default ShopkeeperSidebar;


//###############################################################

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ShopkeeperSidebar.css";

// ✅ sessionStorage se read karo
const getShopkeeperData = () => {
  try {
    const raw = sessionStorage.getItem("shopkeeperData");
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
};

const ShopkeeperSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sk, setSk] = useState({});

  useEffect(() => {
    setSk(getShopkeeperData());
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/shopkeeper/login";
  };

  const mainNav = [
    { icon: "📊", label: "Dashboard",    path: "/shopkeeper/dashboard"    },
    { icon: "📦", label: "My Products",  path: "/shopkeeper/products"     },
    { icon: "➕", label: "Add Product",  path: "/shopkeeper/add-product"  },  // ✅ Add Product sidebar me
    { icon: "💬", label: "Get a Quote",  path: "/shopkeeper/get-a-quote"  },
    { icon: "⭐", label: "Shop Rating",  path: "/shopkeeper/shop-rating"  },
  ];

  const shopNav = [
    { icon: "🏺", label: "Shop Profile", path: "/shopkeeper/shop-profile" },
    { icon: "📅", label: "Work Hours",   path: "/shopkeeper/work-hours"   },
  ];

  return (
    <aside className="sk-sidebar">
      {/* Logo */}
      <div className="sk-sidebar-logo">
        <div className="sk-sidebar-logo-icon">🏺</div>
        <div>
          <div className="sk-sidebar-logo-name">Songir Brass</div>
          <div className="sk-sidebar-logo-sub">Shopkeeper Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sk-sidebar-nav">

        {/* Main Menu */}
        <div className="sk-nav-group-label">Main Menu</div>
        {mainNav.map((item) => (
          <div
            key={item.path}
            className={`sk-nav-item ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className="sk-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}

        {/* My Shop */}
        <div className="sk-nav-group-label" style={{ marginTop: 16 }}>My Shop</div>
        {shopNav.map((item) => (
          <div
            key={item.path}
            className={`sk-nav-item ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className="sk-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}

        {/* Account */}
        <div className="sk-nav-group-label" style={{ marginTop: 16 }}>Account</div>
        <div
          className={`sk-nav-item ${location.pathname === "/shopkeeper/settings" ? "active" : ""}`}
          onClick={() => navigate("/shopkeeper/settings")}
        >
          <span className="sk-nav-icon">⚙️</span>
          <span>Settings</span>
        </div>
        <div className="sk-nav-item sk-nav-logout" onClick={handleLogout}>
          <span className="sk-nav-icon">🚪</span>
          <span>Logout</span>
        </div>
      </nav>

      {/* Bottom user badge */}
      <div className="sk-sidebar-bottom">
        <div className="sk-sidebar-badge">
          <div className="sk-sidebar-avatar">
            {sk.profileImage
              ? <img src={`http://localhost:5000/${sk.profileImage}`} alt="shop" />
              : "🏺"
            }
          </div>
          <div>
            <div className="sk-sidebar-name">{sk.ownerName || "Shopkeeper"}</div>
            <div className="sk-sidebar-role">{sk.shopName  || "Shop Owner"}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ShopkeeperSidebar;