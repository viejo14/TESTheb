// Configuración global para los tests

// Aumentar timeout para tests que requieren DB
jest.setTimeout(10000)

// Mock de console para tests más limpios (opcional)
global.console = {
  ...console,
  // Silenciar logs en tests (descomentar si quieres silenciar)
  // log: jest.fn(),
  // error: jest.fn(),
  // warn: jest.fn(),
}
