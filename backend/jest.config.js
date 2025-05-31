module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleNameMapper: {
    '^@models$': '<rootDir>/src/models',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  modulePaths: [
    '<rootDir>/src'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/config/',
    '/migrations/',
    '/seeders/'
  ],
  testMatch: ['**/__tests__/**/*.test.js'],
  // Añadir esto para forzar entorno de pruebas
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  },
  // Forzar variables de entorno de prueba
  setupFiles: ['dotenv/config'],
  globals: {
    'dotenv/config': {
      path: '.env.test' // Cargar variables de prueba
    }
  }
};