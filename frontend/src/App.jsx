import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { GlobalRefreshProvider } from './context/GlobalRefreshContext';
import AuthProvider from './context/AuthProvider';
import Home from './pages/Home';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import RegisterPage from  './pages/RegisterPage';
//import AdminSpace from './components/admin/AdminSpace';
import AdminSpace from './components/admin/AdminSpaces/AdminSpaces';
import AdminStats from './components/admin/AdminStats';
import AvailabilityPanel from './components/Availability/AvailabilityPanel';
import AvailabilityPage from './pages/AvailabilityPage';
import MyBookings from './components/MyBookings';
import theme from './theme';
import NotFound from './pages/NotFound';

import LayoutConSidebar from './layouts/LayoutConSidebar'; // 👈 importar layout

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <GlobalRefreshProvider> {/* ✅ Insertado aquí */}
            <Box minH="100vh" display="flex" flexDirection="column">
              <Navbar />
              <Box as="main" flex={1} py={4} px={{ base: 4, md: 8 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/login" element={<Login />} />

                  {/* 🔐 RUTAS PROTEGIDAS CON SIDEBAR */}
                  <Route element={<LayoutConSidebar />}>
                    <Route path="/disponibilidad" element={<AvailabilityPage />} />
                    <Route path="/reservas" element={<MyBookings />} />
                    <Route path="/perfil" element={<Profile />} />
                    <Route path="/dashboard" element={<Dashboard />} />

                    <Route element={<AdminRoute />}>
                      <Route path="/admin/espacios" element={<AdminSpace />} />
                      <Route path="/admin/estadisticas" element={<AdminStats />} />
                    </Route>
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Box>
            </Box>
          </GlobalRefreshProvider>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}


export default App;