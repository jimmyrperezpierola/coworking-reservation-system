import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    // Configuración crítica para Windows
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3000
    },
    watch: {
      usePolling: true,  // Necesario para sistemas de archivos de Windows
      interval: 1000     // Revisa cambios cada 1 segundo
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false
      }
    }
  },
  optimizeDeps: {
    include: [
      '@chakra-ui/react',
      '@emotion/react',
      '@emotion/styled',
      'framer-motion'
    ],
    force: true  // Fuerza la optimización de dependencias
  },
  // Configuración adicional para prevenir errores
  build: {
    chunkSizeWarningLimit: 1600,  // Aumenta el límite de tamaño de chunks
    sourcemap: true               // Genera sourcemaps para mejor debugging
  },
  esbuild: {
    jsxInject: `import React from 'react'`  // Asegura la inyección de React
  }
});
