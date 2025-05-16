//import useAuth from '../../context/useAuth';  // Cambia esta línea
/*import { useAuth } from '../../context/useAuth'; // Con llaves
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== 'admin') {
    return <Navigate to="/disponibilidad" replace />;
  }
  
  return <Outlet />;
};

export default AdminRoute;*/

import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
