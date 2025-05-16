import AdminSpaces from '../components/admin/AdminSpaces/AdminSpaces';
import ProtectedRoute from '../components/admin/ProtectedRoute';

const SpacesPage = () => {
  return (
   <ProtectedRoute allowedRoles={['admin']}>
      <AdminSpaces />
    </ProtectedRoute>
  );
};

export default SpacesPage;