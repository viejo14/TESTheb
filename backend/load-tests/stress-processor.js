// Procesador de métricas para prueba de estrés
// Este archivo es usado por Artillery para procesar métricas customizadas

export function beforeRequest(requestParams, context, ee, next) {
  // Agregar timestamp a cada request
  requestParams.startTime = Date.now();
  return next();
}

export function afterResponse(requestParams, response, context, ee, next) {
  // Calcular tiempo de respuesta
  const duration = Date.now() - requestParams.startTime;

  // Emitir métricas customizadas
  ee.emit('counter', 'custom.response_time', duration);

  if (response.statusCode >= 500) {
    ee.emit('counter', 'custom.server_errors', 1);
  }

  if (response.statusCode >= 400 && response.statusCode < 500) {
    ee.emit('counter', 'custom.client_errors', 1);
  }

  if (duration > 5000) {
    ee.emit('counter', 'custom.slow_responses', 1);
  }

  return next();
}
