import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
