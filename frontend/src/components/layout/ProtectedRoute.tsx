import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { UserRole } from "../../context/AuthContext";

interface Props {
  allowedRole: UserRole;
}

export default function ProtectedRoute({ allowedRole }: Props) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    return (
      <Navigate
        to={user.role === "admin"
          ? "/admin/dashboard"
          : "/customer/dashboard"}
        replace
      />
    );
  }

  return <Outlet />;
}