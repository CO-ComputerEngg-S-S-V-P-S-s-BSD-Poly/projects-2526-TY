import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute — Bina login ke dashboard nahi kholega
 * Token ya data nahi mila → seedha /shopkeeper/login pe
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("shopkeeperToken");
  const data  = localStorage.getItem("shopkeeperData");

  if (!token || !data) {
    return <Navigate to="/shopkeeper/login" replace />;
  }

  return children;
};

export default ProtectedRoute;