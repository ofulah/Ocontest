import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // If roles are specified, check if user has required role
  if (roles && !roles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on user role
    if (user?.role === 'brand') {
      return <Navigate to="/brand-dashboard" replace />;
    } else if (user?.role === 'creator') {
      return <Navigate to="/creator-dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
