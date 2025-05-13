import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const location = useLocation();

  return (
    <nav className={styles.navContainer}>
      <Link to="/" className={styles.logo}>
        CoWorking
      </Link>

      <div className={styles.menu}>
        {isAuthenticated ? (
          <>
            {/* Opciones para todos los usuarios */}
            <Link
              to="/disponibilidad"
              className={`${styles.link} ${
                location.pathname === '/disponibilidad' ? styles.active : ''
              }`}
            >
              Disponibilidad
            </Link>

            <Link
              to="/reservas"
              className={`${styles.link} ${
                location.pathname === '/reservas' ? styles.active : ''
              }`}
            >
              Mis Reservas
            </Link>

            <Link
              to="/perfil"
              className={`${styles.link} ${
                location.pathname === '/perfil' ? styles.active : ''
              }`}
            >
              Mi Perfil
            </Link>

            {/* Opciones solo para admin */}
            {user?.isAdmin && (
              <>
                <Link
                  to="/admin/espacios"
                  className={`${styles.link} ${styles.adminLink} ${
                    location.pathname === '/admin/espacios' ? styles.active : ''
                  }`}
                >
                  Espacios
                </Link>

                <Link
                  to="/admin/estadisticas"
                  className={`${styles.link} ${styles.adminLink} ${
                    location.pathname === '/admin/estadisticas' ? styles.active : ''
                  }`}
                >
                  Estadísticas
                </Link>
              </>
            )}

            <button onClick={logout} className={styles.logoutButton}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link to="/login" className={styles.loginButton}>
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;