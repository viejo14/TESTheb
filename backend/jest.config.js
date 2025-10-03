export default {
  // Usar node como entorno de pruebas
  testEnvironment: 'node',

  // Transformar archivos JS con babel
  transform: {
    '^.+\\.js$': 'babel-jest'
  },

  // Buscar archivos de test
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Coverage
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js'
  ],

  // Timeout para tests
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
}
