import axios from 'axios';

// 1. Configuración básica
const API_URL = 'http://localhost:5000'; // Ajusta según tu backend

// 2. Guardar token
const saveToken = (token) => {
  localStorage.setItem('authToken', token);

  if (token && token.length > 10) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// 3. Limpiar token
export const clearToken = () => {
  localStorage.removeItem('authToken');
  delete axios.defaults.headers.common['Authorization'];
};

// 4. Función de login
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    saveToken(response.data.token);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al iniciar sesión');
  }
};

// 5. Verificar autenticación
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

// 6. Configurar axios al iniciar
export const setupAxiosInterceptors = () => {
  const token = localStorage.getItem('authToken');
  if (token && typeof token === 'string' && token.length > 10) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// 🔧 MEJORADO: Devuelve header vacío si no hay token válido
const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token && token.length > 10
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
};

setupAxiosInterceptors(); // Ejecutar al cargar

// 🔁 Función de registro
export const register = async (email, password) => {
  try {
    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new Error('Los datos deben ser texto');
    }

    const response = await axios.post(`${API_URL}/register`, {
      email: String(email).trim(),
      password: String(password)
    }, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      transformRequest: [(data) => JSON.stringify(data)]
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      const backendError = error.response.data?.error ||
        error.response.data?.message ||
        'Error en el servidor';
      throw new Error(backendError);
    } else if (error.request) {
      throw new Error('El servidor no respondió');
    } else {
      throw new Error('Error al configurar la solicitud');
    }
  }
};

// ✅ CAMBIO: Eliminado `token`, usando getAuthHeader()
export const getEnabledSpaces = async () => {
  try {
    const res = await axios.get(`${API_URL}/spaces/enabled`, getAuthHeader());
    return res.data;
  } catch (error) {
    console.error('Error fetching enabled spaces:', error);
    throw error;
  }
};

// ✅ CAMBIO: Eliminado `token`, usando getAuthHeader()
export const reserveSpace = async (spaceId, reservationData) => {
  try {
    const response = await axios.post(
      `${API_URL}/spaces/${spaceId}/reserve`,
      reservationData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error reserving space:', error);
    throw error;
  }
};

// ✅ CAMBIO: Eliminado `token`, usando getAuthHeader()
export const getUserReservations = async () => {
  try {
    const res = await axios.get(`${API_URL}/reservations`, getAuthHeader());
    return res.data;
  } catch (error) {
    console.error('Error fetching user reservations:', error);
    throw error;
  }
};

// ✅ CAMBIO: Eliminado `token`, usando getAuthHeader()
export const cancelReservation = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/reservations/${id}`, getAuthHeader());
    return res.data;
  } catch (error) {
    console.error('Error canceling reservation:', error);
    throw error;
  }
};

// ✅ CAMBIO: token ya se toma de localStorage
export const getAdminStats = async () => {
  try {
    const res = await axios.get(`${API_URL}/admin/stats`, getAuthHeader());
    return res.data;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
};

// ✅ CAMBIO: usando getAuthHeader()
export const getSpaces = async () => {
  try {
    const res = await axios.get(`${API_URL}/spaces`, getAuthHeader());
    return res.data;
  } catch (error) {
    console.error('Error fetching spaces:', error);
    throw error;
  }
};

// ✅ CAMBIO: usando getAuthHeader()
export const updateSpaceStatus = async (space) => {
  try {
    const res = await axios.put(
      `${API_URL}/spaces/${space.id}`,
      { ...space, enabled: !space.enabled },
      getAuthHeader()
    );
    return res.data;
  } catch (error) {
    console.error('Error updating space status:', error);
    throw error;
  }
};

// ✅ CAMBIO: usando getAuthHeader()
export const deleteSpace = async (spaceId) => {
  try {
    const res = await axios.delete(`${API_URL}/spaces/${spaceId}`, getAuthHeader());
    return res.data;
  } catch (error) {
    console.error('Error deleting space:', error);
    throw error;
  }
};

const api = axios;
export default api;
