import { useContext, useEffect } from 'react';

import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import styles from '../styles/Navbar.module.css';
import { useGlobalRefresh } from '../context/useGlobalRefresh'; 

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { refreshToken, triggerGlobalRefresh } = useGlobalRefresh();
  const location = useLocation();
  useEffect(() => {
    // ✅ Esto fuerza el re-render cuando el refresh global cambia
  }, [refreshToken,triggerGlobalRefresh]);
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
              to="/dashboard?tab=0"
              className={`${styles.link} ${
                location.pathname === '/dashboard?tab=0' ? styles.active : ''
              }`}
            >
              Disponibilidad
            </Link>

            <Link
              to="/dashboard?tab=1"
              className={`${styles.link} ${
                location.pathname === '/dashboard?tab=1' ? styles.active : ''
              }`}
            >
              Mis Reservas
            </Link>

            <Link
              to="/dashboard?tab=2"
              className={`${styles.link} ${
                location.pathname === '/dashboard?tab=2' ? styles.active : ''
              }`}
            >
              Mi Perfil
            </Link>

            {/* Opciones solo para admin */}
            {user?.isAdmin && (
              <>
                <Link
                  to="/dashboard?tab=3"
                  className={`${styles.link} ${styles.adminLink} ${
                    location.pathname === '/dashboard?tab=3' ? styles.active : ''
                  }`}
                >
                  Espacios
                </Link>

                <Link
                  to="/dashboard?tab=4"
                  className={`${styles.link} ${styles.adminLink} ${
                    location.pathname === '/dashboard?tab=4' ? styles.active : ''
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
          <>
            <Link to="/register" className={styles.loginButton}>
              Registrarme
            </Link>
            <Link to="/login" className={styles.loginButton}>
              Iniciar Sesión
            </Link>

         </> 
        )}
      </div>
    </nav>
  );
};

export default Navbar;