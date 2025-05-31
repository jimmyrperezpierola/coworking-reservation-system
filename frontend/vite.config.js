import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => {
  const isDev = command === 'serve';

  return {
    plugins: [react()],
server: isDev
  ? {
      host: '0.0.0.0',
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  : undefined,
    optimizeDeps: {
      include: [
        '@chakra-ui/react',
        '@emotion/react',
        '@emotion/styled',
        'framer-motion'
      ],
      force: true
    },
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 1600,
      sourcemap: true
    },
    esbuild: {
      jsxInject: `import React from 'react'`
    }
  };
});

