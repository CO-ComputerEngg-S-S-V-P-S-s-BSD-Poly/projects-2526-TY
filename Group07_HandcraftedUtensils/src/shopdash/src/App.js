// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import ShopkeeperLogin     from "./components/ShopkeeperLogin";
// import ShopkeeperRegister  from "./components/ShopkeeperRegister";
// import ShopkeeperDashboard from "./components/ShopkeeperDashboard";
// import MyProducts          from "./components/MyProducts";
// import AddProduct          from "./components/AddProduct";
// import ShopkeeperProfile   from "./components/ShopkeeperProfile";
// import WorkHours           from "./components/WorkHours";
// import ShopkeeperSettings  from "./components/ShopkeeperSettings";

// // ── sessionStorage use karo — browser band hone pe auto logout ──
// const isLoggedIn = () => {
//   const token = sessionStorage.getItem("shopkeeperToken");
//   const data  = sessionStorage.getItem("shopkeeperData");
//   return !!(token && data);
// };

// // ── Protected: login nahi hai to login pe bhejo ──
// const ProtectedRoute = ({ children }) => {
//   return isLoggedIn() ? children : <Navigate to="/shopkeeper/login" replace />;
// };

// // ── Auth route: already logged in hai to dashboard pe bhejo ──
// const AuthRoute = ({ children }) => {
//   return isLoggedIn() ? <Navigate to="/shopkeeper/dashboard" replace /> : children;
// };

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Navigate to="/shopkeeper/login" replace />} />

//         {/* Public — already logged in? dashboard pe */}
//         <Route path="/shopkeeper/login"    element={<AuthRoute><ShopkeeperLogin /></AuthRoute>}    />
//         <Route path="/shopkeeper/register" element={<AuthRoute><ShopkeeperRegister /></AuthRoute>} />

//         {/* Protected — login required */}
//         <Route path="/shopkeeper/dashboard"    element={<ProtectedRoute><ShopkeeperDashboard /></ProtectedRoute>} />
//         <Route path="/shopkeeper/products"     element={<ProtectedRoute><MyProducts /></ProtectedRoute>}          />
//         <Route path="/shopkeeper/add-product"  element={<ProtectedRoute><AddProduct /></ProtectedRoute>}          />
//         <Route path="/shopkeeper/shop-profile" element={<ProtectedRoute><ShopkeeperProfile /></ProtectedRoute>}   />
//         <Route path="/shopkeeper/work-hours"   element={<ProtectedRoute><WorkHours /></ProtectedRoute>}           />
//         <Route path="/shopkeeper/settings"     element={<ProtectedRoute><ShopkeeperSettings /></ProtectedRoute>}  />

//         <Route path="*" element={<Navigate to="/shopkeeper/login" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ShopkeeperLogin     from "./components/ShopkeeperLogin";
import ShopkeeperRegister  from "./components/ShopkeeperRegister";
import ShopkeeperDashboard from "./components/ShopkeeperDashboard";
import MyProducts          from "./components/MyProducts";
import AddProduct          from "./components/AddProduct";
import ShopkeeperProfile   from "./components/ShopkeeperProfile";
import WorkHours           from "./components/WorkHours";
import ShopkeeperSettings  from "./components/ShopkeeperSettings";
import GetAQuote           from "./components/GetAQuote";
import ShopRating          from "./components/ShopRating";

// ── sessionStorage use karo — browser band hone pe auto logout ──
const isLoggedIn = () => {
  const token = sessionStorage.getItem("shopkeeperToken");
  const data  = sessionStorage.getItem("shopkeeperData");
  return !!(token && data);
};

// ── Protected: login nahi hai to login pe bhejo ──
const ProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/shopkeeper/login" replace />;
};

// ── Auth route: already logged in hai to dashboard pe bhejo ──
const AuthRoute = ({ children }) => {
  return isLoggedIn() ? <Navigate to="/shopkeeper/dashboard" replace /> : children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/shopkeeper/login" replace />} />

        {/* Public — already logged in? dashboard pe */}
        <Route path="/shopkeeper/login"    element={<AuthRoute><ShopkeeperLogin /></AuthRoute>}    />
        <Route path="/shopkeeper/register" element={<AuthRoute><ShopkeeperRegister /></AuthRoute>} />

        {/* Protected — login required */}
        <Route path="/shopkeeper/dashboard"    element={<ProtectedRoute><ShopkeeperDashboard /></ProtectedRoute>} />
        <Route path="/shopkeeper/products"     element={<ProtectedRoute><MyProducts /></ProtectedRoute>}          />
        <Route path="/shopkeeper/add-product"  element={<ProtectedRoute><AddProduct /></ProtectedRoute>}          />
        <Route path="/shopkeeper/shop-profile" element={<ProtectedRoute><ShopkeeperProfile /></ProtectedRoute>}   />
        <Route path="/shopkeeper/work-hours"   element={<ProtectedRoute><WorkHours /></ProtectedRoute>}           />
        <Route path="/shopkeeper/settings"     element={<ProtectedRoute><ShopkeeperSettings /></ProtectedRoute>}  />
        <Route path="/shopkeeper/get-a-quote"  element={<ProtectedRoute><GetAQuote /></ProtectedRoute>}           />
        <Route path="/shopkeeper/shop-rating"  element={<ProtectedRoute><ShopRating /></ProtectedRoute>}          />

        <Route path="*" element={<Navigate to="/shopkeeper/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;