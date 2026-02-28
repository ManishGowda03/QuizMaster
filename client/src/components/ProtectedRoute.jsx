import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // If not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If admin-only route but user is not admin
  if (adminOnly && storedUser?.user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;