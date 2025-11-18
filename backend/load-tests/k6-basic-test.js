// Prueba de carga con k6 para TESTheb
// Ejecutar con: k6 run load-tests/k6-basic-test.js

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Métricas personalizadas
const errorRate = new Rate('errors');

// Configuración de la prueba
export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Warm up: subir a 10 usuarios
    { duration: '1m', target: 50 },    // Carga normal: 50 usuarios
    { duration: '30s', target: 100 },  // Pico: 100 usuarios
    { duration: '1m', target: 50 },    // Carga sostenida: 50 usuarios
    { duration: '30s', target: 0 },    // Enfriamiento: bajar a 0
  ],
  thresholds: {
    'http_req_duration': ['p(95)<1000', 'p(99)<2000'], // 95% < 1s, 99% < 2s
    'http_req_failed': ['rate<0.01'],   // Menos de 1% de errores
    'errors': ['rate<0.01'],
  },
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // Escenario 1: Ver catálogo de productos (60% probabilidad)
  if (Math.random() < 0.6) {
    const productsRes = http.get(`${BASE_URL}/api/products`);

    check(productsRes, {
      'Products status 200': (r) => r.status === 200,
      'Products response time OK': (r) => r.timings.duration < 1000,
    }) || errorRate.add(1);

    sleep(2); // Simular tiempo de lectura

    // Ver detalle de un producto
    if (productsRes.status === 200) {
      const products = JSON.parse(productsRes.body);
      if (products.length > 0) {
        const productId = products[0].id;
        const productRes = http.get(`${BASE_URL}/api/products/${productId}`);

        check(productRes, {
          'Product detail status 200': (r) => r.status === 200,
        }) || errorRate.add(1);
      }
    }
  }

  // Escenario 2: Ver categorías (20% probabilidad)
  else if (Math.random() < 0.75) {
    const categoriesRes = http.get(`${BASE_URL}/api/categories`);

    check(categoriesRes, {
      'Categories status 200': (r) => r.status === 200,
      'Categories response time OK': (r) => r.timings.duration < 800,
    }) || errorRate.add(1);
  }

  // Escenario 3: Health check (20% probabilidad)
  else {
    const healthRes = http.get(`${BASE_URL}/api/health`);

    check(healthRes, {
      'Health status 200': (r) => r.status === 200,
      'Health response time OK': (r) => r.timings.duration < 500,
    }) || errorRate.add(1);
  }

  sleep(1); // Pausa entre requests
}
