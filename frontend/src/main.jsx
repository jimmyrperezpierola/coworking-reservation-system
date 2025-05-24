// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { GlobalRefreshProvider } from './context/GlobalRefreshContext';
import App from './App';
import AuthProvider from './context/AuthProvider';

// Configuración CORREGIDA del tema
const theme = extendTheme({
  colors: {
    brand: {
      50: '#f0f4f8',
      100: '#d9e2ec',
      200: '#bcccdc',
      300: '#9fb3c8',
      400: '#829ab1',
      500: '#2c3e50', // Color azul principal
      600: '#243b53',
      700: '#1d2d3f',
      800: '#16202b',
      900: '#0b121a',
    },
  },
  fonts: {
    body: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    heading: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'md',
      },
      variants: {
        primary: {
          bg: 'brand.500',
          color: 'white',
          _hover: { bg: 'brand.600' }, // Corregido de 'brand.608' a 'brand.600'
        },
      },
    },
  },
  styles: {
    global: {
      'html, body': {
        bg: 'white',
        color: 'gray.800',
      },
      '#navbar, #sidebar': {
        bg: 'brand.500',
        color: 'white',
      },
    },
  },
});

// Renderizado corregido
const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <GlobalRefreshProvider>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ChakraProvider>
    </GlobalRefreshProvider>
  </StrictMode>
);