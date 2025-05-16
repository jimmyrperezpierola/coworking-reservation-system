import { useState, useEffect } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

export default function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: null,
    token: null,
    loading: true,
  });

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('authUser');

      if (token && user) {
        try {
          const parsedUser = JSON.parse(user);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setAuthState({
            user: parsedUser,
            token,
            loading: false
          });
        } catch (e) {
          console.error('Error parsing user from localStorage', e);
          setAuthState({ user: null, token: null, loading: false });
        }
      } else {
        setAuthState({ user: null, token: null, loading: false });
      }
    };

    initAuth();
  }, []);

  const login = (authData) => {
    localStorage.setItem('authToken', authData.token);
    localStorage.setItem('authUser', JSON.stringify(authData.user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;
    setAuthState({
      user: authData.user,
      token: authData.token,
      loading: false
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    delete axios.defaults.headers.common['Authorization'];
    setAuthState({
      user: null,
      token: null,
      loading: false
    });
  };

  if (authState.loading) return null; // O un loader si prefieres

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        isAuthenticated: !!authState.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

