import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Allow both Admin and Super Admin
  if (user.role !== "Admin" && user.role !== "Super Admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
