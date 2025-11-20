# Pruebas de Carga para TESTheb

Este directorio contiene scripts de pruebas de carga usando Artillery.

## Instalación

```bash
# Opción 1: Instalar Artillery globalmente
npm install -g artillery

# Opción 2: Instalar como dependencia del proyecto
cd backend
npm install --save-dev artillery
```

## Ejecutar Pruebas

### Prueba básica de catálogo (recomendada para empezar)
```bash
artillery run load-tests/basic-load-test.yml
```

### Prueba de autenticación
```bash
artillery run load-tests/auth-load-test.yml
```

### Prueba de flujo de pagos
```bash
artillery run load-tests/webpay-load-test.yml
```

### Generar reporte HTML
```bash
artillery run load-tests/basic-load-test.yml --output report.json
artillery report report.json
```

## Pruebas Rápidas con CLI

```bash
# Test simple de 100 requests
artillery quick --count 100 --num 10 http://localhost:3000/api/health

# Test de productos (200 requests, 20 concurrentes)
artillery quick --count 200 --num 20 http://localhost:3000/api/products

# Test personalizado de 30 segundos con 50 usuarios/seg
artillery quick --duration 30 --rate 50 http://localhost:3000/api/categories
```

## Interpretar Resultados

Artillery muestra métricas clave:

- **http.request_rate**: Requests por segundo
- **http.response_time**: Tiempos de respuesta
  - `min`: Tiempo mínimo
  - `max`: Tiempo máximo
  - `median`: Mediana (50% de requests)
  - `p95`: 95% de requests respondieron en este tiempo o menos
  - `p99`: 99% de requests respondieron en este tiempo o menos
- **http.responses**: Códigos de respuesta HTTP
- **vusers.created`: Usuarios virtuales creados
- **vusers.completed**: Escenarios completados

### Umbrales Recomendados para TESTheb

- **p95 < 1000ms**: 95% de requests deben responder en menos de 1 segundo
- **p99 < 2000ms**: 99% de requests deben responder en menos de 2 segundos
- **Error rate < 1%**: Menos del 1% de errores HTTP (500, 503, etc.)

## Escenarios de Prueba

### 1. basic-load-test.yml
Simula navegación típica de usuarios:
- 60% navegan catálogo
- 20% buscan productos
- 15% navegan categorías
- 5% health checks

Fases:
1. Warm up: 10 usuarios/seg x 30s
2. Normal: 50 usuarios/seg x 60s
3. Peak: 100 usuarios/seg x 30s
4. Sustained: 50 usuarios/seg x 60s

### 2. auth-load-test.yml
Prueba sistema de autenticación:
- Registros de usuarios
- Login exitoso
- Intentos fallidos (simula ataques)
- Verificación de tokens

### 3. webpay-load-test.yml
Simula flujo completo de compra:
- Ver productos
- Ver detalles
- Crear transacción WebPay

## Monitoreo Durante Pruebas

Mientras corren las pruebas, monitorea:

### En la terminal del backend
```bash
cd backend
npm run dev
# Observa logs de Winston y tiempos de respuesta
```

### Con herramientas del sistema

**Windows:**
```bash
# CPU y RAM
tasklist | findstr node
```

**Linux/Mac:**
```bash
# CPU y RAM
top -p $(pgrep -f "node server.js")

# Conexiones de red
netstat -an | grep 3000 | wc -l
```

### PostgreSQL
```sql
-- Conexiones activas
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';

-- Consultas lentas
SELECT pid, now() - query_start as duration, query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;
```

## Optimizaciones Basadas en Resultados

Si encuentras problemas:

### Tiempos de respuesta altos (p95 > 2000ms)
- Revisar queries SQL lentas
- Agregar índices a tablas
- Implementar caché (Redis)
- Optimizar joins en consultas

### Muchos errores 500
- Revisar logs de Winston en `backend/logs/`
- Verificar conexiones a BD (max: 10)
- Aumentar timeout de PostgreSQL

### Errores 503 (Service Unavailable)
- Aumentar pool de conexiones PostgreSQL
- Revisar límites de memoria de Node.js
- Considerar clustering/PM2

### Rate limit alcanzado
- Ajustar límites en `backend/server.js`
- Implementar rate limiting por usuario (no por IP)

## Pruebas Avanzadas

### Stress Test (encontrar punto de quiebre)
```yaml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 60
      arrivalRate: 50
    - duration: 60
      arrivalRate: 100
    - duration: 60
      arrivalRate: 200
    - duration: 60
      arrivalRate: 500  # Hasta que falle
```

### Spike Test (pico repentino)
```yaml
config:
  phases:
    - duration: 10
      arrivalRate: 5
    - duration: 10
      arrivalRate: 500  # Pico repentino
    - duration: 10
      arrivalRate: 5
```

### Soak Test (carga sostenida)
```yaml
config:
  phases:
    - duration: 3600  # 1 hora
      arrivalRate: 50
```

## Otras Herramientas

### k6 (alternativa más potente)
```bash
# Instalar k6
choco install k6  # Windows
brew install k6   # Mac

# Script básico
k6 run - <<EOF
import http from 'k6/http';
export default function() {
  http.get('http://localhost:3000/api/products');
}
EOF
```

### autocannon (rápido y simple)
```bash
npm install -g autocannon

# Test de 100 conexiones por 30 segundos
autocannon -c 100 -d 30 http://localhost:3000/api/products
```

## Checklist Pre-Producción

- [ ] API responde en p95 < 1000ms con 100 usuarios concurrentes
- [ ] API responde en p99 < 2000ms con 100 usuarios concurrentes
- [ ] Error rate < 1% durante 5 minutos de carga sostenida
- [ ] Sistema se recupera después de picos de tráfico
- [ ] PostgreSQL mantiene < 8 conexiones activas durante carga normal
- [ ] Memoria de Node.js estable (no crece indefinidamente)
- [ ] Logs no muestran errores críticos durante pruebas
