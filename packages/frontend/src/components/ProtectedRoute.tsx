import { useAuthStore } from "@/store/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);
  console.log("ProtectedRoute token:", token); // Debug log to check token value
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
