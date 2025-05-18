import axios from 'axios';

// 1. Configuración básica
const API_URL = 'http://localhost:5000'; // Ajusta según tu backend

// 2. Guardar token en localStorage y axios
const saveToken = (token) => {
  localStorage.setItem('authToken', token);

  if (token && token.length > 10) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
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
  
  if (token && typeof token === 'string' && token.length > 10) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

setupAxiosInterceptors(); // Ejecutar al cargar la app


// Añade esto en tu archivo api.js (justo después de la función login)

/**
 * Registra un nuevo usuario (no administrador)
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña (mínimo 6 caracteres)
 * @returns {Object} - Datos del usuario registrado { id, email, createdAt }
 * @throws {Error} - Si hay error en el registro
 */
export const register = async (email, password) => {
  try {
    // Validación en el frontend antes de enviar
    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new Error('Los datos deben ser texto');
    }

    const response = await axios.post(`${API_URL}/register`, {
      email: String(email).trim(), // Asegura que sea string y limpia espacios
      password: String(password)   // Asegura que sea string
    }, {
      headers: {
        'Content-Type': 'application/json', // Especifica explícitamente el tipo
        'Accept': 'application/json'       // Asegura que esperas JSON en respuesta
      },
      transformRequest: [
        (data) => JSON.stringify(data), // Fuerza la serialización como JSON
      ]
    });
    
    return response.data;
  } catch (error) {
    // Manejo mejorado de errores
    if (error.response) {
      // El servidor respondió con un código de error
      const backendError = error.response.data?.error || 
                         error.response.data?.message || 
                         'Error en el servidor';
      throw new Error(backendError);
    } else if (error.request) {
      // La solicitud fue hecha pero no hubo respuesta
      throw new Error('El servidor no respondió');
    } else {
      // Error al configurar la solicitud
      throw new Error('Error al configurar la solicitud');
    }
  }
};
// Añade más funciones API según necesites

const api = axios; // Usamos axios ya configurado
export default api;