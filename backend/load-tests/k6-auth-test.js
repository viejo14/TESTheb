// Prueba de carga de autenticación con k6
// Ejecutar con: k6 run load-tests/k6-auth-test.js

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '1m', target: 20 },    // 20 usuarios concurrentes
    { duration: '2m', target: 50 },    // Subir a 50 usuarios
    { duration: '1m', target: 0 },     // Bajar a 0
  ],
  thresholds: {
    'http_req_duration': ['p(95)<1500', 'p(99)<3000'],
    'http_req_failed': ['rate<0.05'], // Hasta 5% de errores (credenciales inválidas)
  },
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  const scenario = Math.random();

  // Escenario 1: Login exitoso (50%)
  if (scenario < 0.5) {
    const loginPayload = JSON.stringify({
      email: 'admin@testheb.cl',
      password: 'admin123',
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const loginRes = http.post(`${BASE_URL}/api/auth/login`, loginPayload, params);

    const loginSuccess = check(loginRes, {
      'Login status 200': (r) => r.status === 200,
      'Login has token': (r) => JSON.parse(r.body).token !== undefined,
    });

    if (!loginSuccess) {
      errorRate.add(1);
    }

    if (loginRes.status === 200) {
      const token = JSON.parse(loginRes.body).token;
      sleep(1);

      // Verificar perfil con el token
      const profileParams = {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      };

      const profileRes = http.get(`${BASE_URL}/api/auth/profile`, profileParams);

      check(profileRes, {
        'Profile status 200': (r) => r.status === 200,
      }) || errorRate.add(1);
    }
  }

  // Escenario 2: Registro de usuario (30%)
  else if (scenario < 0.8) {
    const registerPayload = JSON.stringify({
      name: `Test User ${Date.now()}`,
      email: `test${Date.now()}@testheb.cl`,
      password: 'TestPassword123',
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const registerRes = http.post(`${BASE_URL}/api/auth/register`, registerPayload, params);

    check(registerRes, {
      'Register status 201': (r) => r.status === 201 || r.status === 200,
    }) || errorRate.add(1);
  }

  // Escenario 3: Login fallido (20%)
  else {
    const failedLoginPayload = JSON.stringify({
      email: 'wrong@test.com',
      password: 'wrongpassword',
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const failedRes = http.post(`${BASE_URL}/api/auth/login`, failedLoginPayload, params);

    check(failedRes, {
      'Failed login status 401': (r) => r.status === 401,
    }); // No contamos como error, es esperado
  }

  sleep(1);
}
