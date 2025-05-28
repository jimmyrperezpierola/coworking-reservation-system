import { useAuth } from '../context/useAuth';
import { Link } from 'react-router-dom';

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-container">
      <h1>Bienvenido al Sistema de Reservas</h1>
      
      {isAuthenticated ? (
        <div className="quick-access">
          <Link to="/dashboard" className="btn">
            Ver Disponibilidad
          </Link>
          <Link to="/dashboard/my-bookings" className="btn">
            Mis Reservas
          </Link>
          <Link to="/profile" className="btn">
            Mi Perfil
          </Link>
        </div>
      ) : (
        <div className="auth-options">
          <p>Consulta espacios disponibles o inicia sesión.</p>
          <Link to="/login" className="btn">
            Iniciar Sesión
          </Link>
        </div>
      )}
    </div>
  );
}

export default Home;