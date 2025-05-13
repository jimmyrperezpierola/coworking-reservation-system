import axios from 'axios';

// 1. Configuración básica
const API_URL = 'http://localhost:5000'; // Ajusta según tu backend

// 2. Guardar token en localStorage y axios
const saveToken = (token) => {
  localStorage.setItem('authToken', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// 3. Limpiar token al cerrar sesión
export const clearToken = () => {
  localStorage.removeItem('authToken');
  delete axios.defaults.headers.common['Authorization'];
};

// 4. Función de login (DEVUELVE TODA LA RESPUESTA DEL BACKEND)
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    saveToken(response.data.token); // Guarda el token automáticamente
    return response.data; // ✅ Devuelve { success, token, user, expiresIn }
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al iniciar sesión');
  }
};

// 5. Verificar autenticación
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

// 6. Configurar axios al iniciar la app
export const setupAxiosInterceptors = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

setupAxiosInterceptors(); // Ejecutar al cargar la app

// Añade más funciones API según necesites