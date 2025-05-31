import { Outlet, Navigate } from 'react-router-dom';

// Componente ProtectedRoute
export const ProtectedRoute = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Componente AdminRoute (ejemplo)
export const AdminRoute = ({ isAdmin }) => {
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

// Exportación conjunta (opcional)
export default {
  ProtectedRoute,
  AdminRoute
};