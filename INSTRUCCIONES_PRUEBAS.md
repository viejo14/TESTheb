# 📋 INSTRUCCIONES PARA PRUEBAS DE CARGA - TESTheb

Este documento contiene las instrucciones exactas para realizar las pruebas solicitadas.

## 🎯 Pruebas Requeridas

1. **Prueba de estrés del servidor (simulación de usuarios simultáneos)**
2. **Tiempo de carga de la página de inicio**

---

## 1️⃣ PRUEBA DE ESTRÉS DEL SERVIDOR

### Objetivo
Simular usuarios simultáneos incrementando la carga progresivamente hasta encontrar el punto de quiebre del sistema.

### Preparación

```bash
# 1. Instalar Artillery (si no lo tienes)
cd backend
npm install

# 2. Iniciar el servidor backend
npm run dev
```

### Ejecución

#### Opción A: Artillery (Recomendado - más fácil)

```bash
# Terminal 2 (en carpeta backend)
artillery run load-tests/stress-test.yml --output stress-report.json

# Generar reporte HTML visual
artillery report stress-report.json
```

**Esto simula:**
- Fase 1: 10 usuarios/segundo durante 60 segundos
- Fase 2: 25 usuarios/segundo durante 60 segundos
- Fase 3: 50 usuarios/segundo durante 60 segundos
- Fase 4: 100 usuarios/segundo durante 60 segundos
- Fase 5: 200 usuarios/segundo durante 60 segundos
- Fase 6: 500 usuarios/segundo durante 60 segundos (ESTRÉS MÁXIMO)
- Fase 7: 50 usuarios/segundo durante 60 segundos (RECUPERACIÓN)

**Duración total:** ~7 minutos

#### Opción B: k6 (Más potente)

```bash
# Instalar k6 primero
choco install k6  # Windows
# O descargar de: https://k6.io/docs/get-started/installation/

# Ejecutar prueba de estrés
k6 run load-tests/k6-stress-test.js --out json=stress-k6-report.json

# Ver resultados en tiempo real
k6 run load-tests/k6-stress-test.js --summary-export=summary.json
```

**Esto simula:**
- Incremento gradual: 10 → 25 → 50 → 100 → 200 → 500 → 1000 usuarios simultáneos
- Total: ~10 minutos de prueba

### Interpretación de Resultados

El servidor **está funcionando correctamente** si:
- ✅ p95 < 2000ms (95% de requests responden en menos de 2 segundos)
- ✅ p99 < 5000ms (99% de requests responden en menos de 5 segundos)
- ✅ Error rate < 5% (menos del 5% de errores)

El servidor **tiene problemas** si:
- ❌ p95 > 5000ms (respuestas muy lentas)
- ❌ Error rate > 10% (muchos errores 500)
- ❌ Errores de conexión (ECONNREFUSED, ETIMEDOUT)

### Captura de Evidencia

```bash
# 1. Ejecutar con reporte
artillery run load-tests/stress-test.yml --output stress-report.json

# 2. Generar HTML
artillery report stress-report.json

# 3. Capturar pantalla del reporte HTML
# Se abre en el navegador automáticamente
# Tomar screenshot para evidencia

# 4. Guardar logs
# Los resultados se muestran en consola, copiar todo el output
```

---

## 2️⃣ TIEMPO DE CARGA DE PÁGINA DE INICIO

### Objetivo
Medir el tiempo de respuesta de todos los endpoints que utiliza la página de inicio (HomePage).

### Preparación

```bash
# 1. Asegurar que backend Y frontend estén corriendo
# Terminal 1 - Backend
cd backend
npm run dev  # Corre en http://localhost:3000

# Terminal 2 - Frontend
cd frontend
npm run dev  # Corre en http://localhost:5173
```

### Ejecución

#### Método 1: Artillery - Prueba de APIs (Backend)

```bash
# Terminal 3 (en carpeta backend)
artillery run load-tests/homepage-performance.yml --output homepage-report.json

# Generar reporte visual
artillery report homepage-report.json
```

**Esta prueba mide:**
- Tiempo de respuesta de `/api/health`
- Tiempo de respuesta de `/api/products`
- Tiempo de respuesta de `/api/categories`
- Tiempo de respuesta de `/api/stats/dashboard`

**Umbrales esperados:**
- ✅ p50 < 300ms (mediana)
- ✅ p95 < 800ms
- ✅ p99 < 1500ms

#### Método 2: Lighthouse - Prueba completa de Frontend

```bash
# Instalar Lighthouse
npm install -g lighthouse

# Ejecutar análisis de página de inicio
lighthouse http://localhost:5173 --output html --output-path ./homepage-lighthouse-report.html

# O con Chrome DevTools:
# 1. Abrir http://localhost:5173
# 2. F12 (DevTools)
# 3. Pestaña "Lighthouse"
# 4. Seleccionar "Performance"
# 5. Click "Analyze page load"
```

**Lighthouse mide:**
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)

**Umbrales esperados:**
- ✅ FCP < 1.8s (First Contentful Paint)
- ✅ LCP < 2.5s (Largest Contentful Paint)
- ✅ TTI < 3.8s (Time to Interactive)
- ✅ Performance Score > 90/100

#### Método 3: Medición manual con Chrome DevTools

```bash
# 1. Abrir http://localhost:5173 en Chrome
# 2. F12 (DevTools)
# 3. Pestaña "Network"
# 4. Marcar "Disable cache"
# 5. Recargar página (Ctrl + Shift + R)
# 6. Ver tiempo total de carga en la parte inferior
```

**Capturar:**
- Tiempo total de carga
- Número de requests
- Tamaño total transferido
- Screenshot del timeline

### Captura de Evidencia - Homepage

**Para Artillery:**
```bash
# Ejecutar y generar reporte
artillery run load-tests/homepage-performance.yml --output homepage-report.json
artillery report homepage-report.json

# Se abre HTML en navegador - tomar screenshot
```

**Para Lighthouse:**
```bash
# Opción 1: CLI
lighthouse http://localhost:5173 --output html --output-path ./homepage-lighthouse.html
# Abrir homepage-lighthouse.html y tomar screenshot

# Opción 2: Chrome DevTools
# 1. F12 → Lighthouse → Analyze
# 2. Tomar screenshot del reporte completo
```

**Para Chrome DevTools Network:**
```
1. Abrir http://localhost:5173
2. F12 → Network → Disable cache
3. Ctrl + Shift + R (hard reload)
4. Tomar screenshot mostrando:
   - Timeline completo
   - DOMContentLoaded (línea azul)
   - Load (línea roja)
   - Total time
   - Number of requests
   - Total size
```

---

## 📊 RESUMEN DE COMANDOS RÁPIDOS

```bash
# PRUEBA 1: Estrés del servidor
cd backend
npm install
npm run dev  # Terminal 1
artillery run load-tests/stress-test.yml --output stress-report.json  # Terminal 2
artillery report stress-report.json  # Generar HTML

# PRUEBA 2: Tiempo de carga homepage (Backend)
artillery run load-tests/homepage-performance.yml --output homepage-report.json
artillery report homepage-report.json

# PRUEBA 2: Tiempo de carga homepage (Frontend completo)
cd frontend
npm run dev  # Terminal 1
lighthouse http://localhost:5173 --output html --output-path ./homepage-lighthouse.html  # Terminal 2
```

---

## 📸 EVIDENCIAS A CAPTURAR

### Para Prueba de Estrés:
1. ✅ Screenshot del reporte HTML de Artillery mostrando:
   - Gráfico de usuarios virtuales
   - Métricas de response time (p95, p99)
   - Tasa de errores
   - Request rate
2. ✅ Copia del resumen de consola (Summary report)
3. ✅ Screenshot de logs del backend durante la prueba

### Para Tiempo de Carga Homepage:
1. ✅ Screenshot del reporte Artillery de APIs
2. ✅ Screenshot del reporte Lighthouse completo mostrando:
   - Performance score
   - Métricas web vitals (FCP, LCP, TTI)
   - Oportunidades de mejora
3. ✅ Screenshot de Chrome DevTools Network mostrando:
   - Timeline completo
   - Tiempo total de carga
   - Número de requests
   - Tamaño transferido

---

## ⚠️ SOLUCIÓN DE PROBLEMAS

### Error: "ECONNREFUSED"
```bash
# Verificar que el backend esté corriendo
curl http://localhost:3000/api/health
# Si falla, iniciar el backend:
cd backend && npm run dev
```

### Error: Artillery no instalado
```bash
cd backend
npm install
# O instalar globalmente:
npm install -g artillery
```

### Error: k6 no instalado
```bash
# Windows
choco install k6

# O descargar de:
https://k6.io/docs/get-started/installation/
```

### Lighthouse no funciona
```bash
# Instalar globalmente
npm install -g lighthouse

# O usar Chrome DevTools (F12 → Lighthouse)
```

---

## 🎓 VALORES ESPERADOS PARA TU PROYECTO

### Servidor Backend (API):
- **Excelente:** p95 < 500ms, p99 < 1000ms, error rate < 1%
- **Bueno:** p95 < 1000ms, p99 < 2000ms, error rate < 5%
- **Aceptable:** p95 < 2000ms, p99 < 5000ms, error rate < 10%
- **Malo:** p95 > 5000ms, error rate > 20%

### Frontend (Página de Inicio):
- **Excelente:** FCP < 1.2s, LCP < 2.0s, Performance > 95
- **Bueno:** FCP < 1.8s, LCP < 2.5s, Performance > 90
- **Aceptable:** FCP < 3.0s, LCP < 4.0s, Performance > 70
- **Malo:** FCP > 4.0s, LCP > 5.0s, Performance < 50

---

## 💡 TIPS

1. **Ejecuta las pruebas varias veces** para obtener un promedio
2. **Cierra otras aplicaciones** para no afectar los resultados
3. **Usa modo incógnito** en Chrome para pruebas de frontend
4. **Captura screenshots** de todos los reportes para evidencia
5. **Guarda los archivos JSON** generados como respaldo

---

¿Alguna duda sobre cómo ejecutar las pruebas? ¡Avísame!
