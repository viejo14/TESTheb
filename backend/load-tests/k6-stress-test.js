// PRUEBA DE ESTRÉS CON K6
// Ejecutar con: k6 run load-tests/k6-stress-test.js
// Genera reporte JSON: k6 run --out json=stress-report.json load-tests/k6-stress-test.js

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Métricas personalizadas
const errorRate = new Rate('errors');
const serverErrorRate = new Rate('server_errors');
const slowResponseRate = new Rate('slow_responses');
const homepageLoadTime = new Trend('homepage_load_time');

// CONFIGURACIÓN DE PRUEBA DE ESTRÉS
export const options = {
  stages: [
    // Incremento gradual de usuarios hasta encontrar el punto de quiebre
    { duration: '1m', target: 10 },    // 10 usuarios simultáneos
    { duration: '1m', target: 25 },    // 25 usuarios simultáneos
    { duration: '1m', target: 50 },    // 50 usuarios simultáneos
    { duration: '1m', target: 100 },   // 100 usuarios simultáneos
    { duration: '1m', target: 200 },   // 200 usuarios simultáneos
    { duration: '1m', target: 500 },   // 500 usuarios simultáneos (ESTRÉS)
    { duration: '1m', target: 1000 },  // 1000 usuarios (ESTRÉS MÁXIMO)
    { duration: '2m', target: 50 },    // Recuperación
  ],

  // Umbrales para detectar fallos
  thresholds: {
    'http_req_duration': ['p(95)<3000'],  // Muy permisivo para estrés
    'errors': ['rate<0.5'],                // Hasta 50% de errores permitidos
    'server_errors': ['rate<0.3'],         // Hasta 30% de errores 500
  },
};

const BASE_URL = 'http://localhost:3000';

// Función para simular carga de página de inicio
function loadHomepage() {
  const startTime = Date.now();

  // 1. Health check
  const healthRes = http.get(`${BASE_URL}/api/health`);
  check(healthRes, {
    'Health check OK': (r) => r.status === 200,
  }) || errorRate.add(1);

  // 2. Cargar productos
  const productsRes = http.get(`${BASE_URL}/api/products`);
  const productsOK = check(productsRes, {
    'Products loaded': (r) => r.status === 200,
  });

  if (!productsOK) {
    errorRate.add(1);
    if (productsRes.status >= 500) {
      serverErrorRate.add(1);
    }
  }

  // 3. Cargar categorías
  const categoriesRes = http.get(`${BASE_URL}/api/categories`);
  check(categoriesRes, {
    'Categories loaded': (r) => r.status === 200,
  }) || errorRate.add(1);

  // 4. Cargar stats
  const statsRes = http.get(`${BASE_URL}/api/stats/dashboard`);
  check(statsRes, {
    'Stats loaded': (r) => r.status === 200 || r.status === 401,
  }) || errorRate.add(1);

  // Calcular tiempo total de carga de homepage
  const totalTime = Date.now() - startTime;
  homepageLoadTime.add(totalTime);

  if (totalTime > 5000) {
    slowResponseRate.add(1);
  }

  return totalTime;
}

export default function () {
  const loadTime = loadHomepage();

  // Log cada 100 iteraciones
  if (__ITER % 100 === 0) {
    console.log(`VU: ${__VU}, Iter: ${__ITER}, Homepage Load Time: ${loadTime}ms`);
  }

  sleep(Math.random() * 3 + 1); // Entre 1-4 segundos
}

// Función de setup (se ejecuta una vez al inicio)
export function setup() {
  console.log('🚀 Iniciando prueba de estrés...');
  console.log('🎯 Objetivo: Encontrar el punto de quiebre del servidor');
  console.log('📊 Se incrementará la carga progresivamente hasta 1000 usuarios simultáneos');
  return { startTime: new Date() };
}

// Función de teardown (se ejecuta al finalizar)
export function teardown(data) {
  console.log('✅ Prueba de estrés completada');
  console.log(`⏱️  Duración total: ${(new Date() - data.startTime) / 1000}s`);
}
