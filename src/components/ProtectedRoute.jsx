import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isAdmin } from "../utils/roleUtils";
import { ROLES } from "../utils/permissions";

const ProtectedRoute = ({
  children,
  requiredRole = null,
  adminOnly = false,
  minRole = null,
}) => {
  const { user } = useAuth();

  // Check if user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin using utility function
  const userIsAdmin = isAdmin(user);

  // If adminOnly is true, only admins can access
  if (adminOnly && !userIsAdmin) {
    return <Navigate to="/slots" replace />;
  }

  // If minRole is specified, check role hierarchy
  if (minRole) {
    const roleHierarchy = {
      [ROLES.USER]: 1,
      [ROLES.MODERATOR]: 2,
      [ROLES.ADMIN]: 3,
    };

    const userLevel = roleHierarchy[user?.role] || 0;
    const requiredLevel = roleHierarchy[minRole] || 0;

    if (userLevel < requiredLevel) {
      return <Navigate to="/slots" replace />;
    }
  }

  // If requiredRole is specified, check if user has that role
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/slots" replace />;
  }

  return children;
};

export default ProtectedRoute;
