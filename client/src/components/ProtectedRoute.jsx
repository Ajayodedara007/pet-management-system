import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("user", user);
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role != "admin") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
