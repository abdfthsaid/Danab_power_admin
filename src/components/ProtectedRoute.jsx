import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAdmin } from '../utils/roleUtils';

const ProtectedRoute = ({ children, requiredRole = null, adminOnly = false }) => {
  const { user } = useAuth();

  // Check if user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin using utility function
  const userIsAdmin = isAdmin(user);

  // If adminOnly is true, only admins can access
  if (adminOnly && !userIsAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // If requiredRole is specified, check if user has that role
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute; 