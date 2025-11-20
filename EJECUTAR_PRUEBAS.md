# ⚡ GUÍA RÁPIDA - EJECUTAR PRUEBAS DE CARGA

## 🎯 LAS DOS PRUEBAS QUE TE PIDEN:

### 1. Prueba de estrés del servidor (usuarios simultáneos)
### 2. Tiempo de carga de la página de inicio

---

## 🚀 COMANDOS RÁPIDOS (COPIAR Y PEGAR)

### PREPARACIÓN (Una sola vez)

```bash
# Terminal 1: Instalar dependencias
cd backend
npm install

# Iniciar backend
npm run dev
```

Mantén el backend corriendo y abre otra terminal.

---

## 1️⃣ PRUEBA DE ESTRÉS DEL SERVIDOR

### Con Artillery (RECOMENDADO - Más fácil)

```bash
# Terminal 2 (nueva terminal)
cd backend

# Ejecutar prueba de estrés + generar reporte HTML automáticamente
npm run load:stress
```

**Esto hace:**
- ✅ Simula usuarios incrementando: 10 → 25 → 50 → 100 → 200 → 500 usuarios/seg
- ✅ Duración: ~7 minutos
- ✅ Genera reporte HTML que se abre automáticamente en el navegador
- ✅ **CAPTURA SCREENSHOT DEL REPORTE HTML** 📸

### Con k6 (Alternativa más potente)

```bash
# Instalar k6 primero
choco install k6

# Ejecutar
k6 run backend/load-tests/k6-stress-test.js
```

**EVIDENCIA A CAPTURAR:**
- 📸 Screenshot del reporte HTML completo
- 📸 Screenshot de la consola mostrando el resumen
- 📋 Copiar el "Summary report" de la consola

---

## 2️⃣ TIEMPO DE CARGA DE PÁGINA DE INICIO

### Opción A: Artillery (Mide APIs del backend)

```bash
# Terminal 2
cd backend

# Ejecutar prueba de homepage + generar reporte HTML
npm run load:homepage
```

**Esto mide:**
- ⏱️ Tiempo de `/api/products`
- ⏱️ Tiempo de `/api/categories`
- ⏱️ Tiempo de `/api/health`
- ⏱️ Tiempo de `/api/stats/dashboard`

**EVIDENCIA:**
- 📸 Screenshot del reporte HTML (se abre automáticamente)

### Opción B: Lighthouse (Mide Frontend completo) ⭐ RECOMENDADO

```bash
# Terminal 1: Asegurar que frontend esté corriendo
cd frontend
npm run dev
# Debe correr en http://localhost:5173

# Terminal 2: Instalar Lighthouse
npm install -g lighthouse

# Ejecutar análisis completo
lighthouse http://localhost:5173 --output html --output-path ./homepage-lighthouse.html

# Se abre automáticamente el reporte en el navegador
```

**Esto mide:**
- ⚡ Performance Score (debe ser > 90)
- ⏱️ First Contentful Paint (FCP)
- ⏱️ Largest Contentful Paint (LCP)
- ⏱️ Time to Interactive (TTI)
- 📊 Cumulative Layout Shift (CLS)

**EVIDENCIA:**
- 📸 Screenshot del reporte Lighthouse completo

### Opción C: Chrome DevTools (Manual, muy visual)

1. Abrir http://localhost:5173 en Chrome
2. Presionar `F12` (DevTools)
3. Ir a pestaña **"Network"**
4. Marcar checkbox **"Disable cache"**
5. Presionar `Ctrl + Shift + R` (hard reload)
6. Observar en la parte inferior:
   - **DOMContentLoaded** (línea azul)
   - **Load** (línea roja)
   - **Total time**
   - **Requests count**
   - **Total size**

**EVIDENCIA:**
- 📸 Screenshot del panel Network mostrando timeline completo

---

## 📊 RESULTADOS ESPERADOS

### Prueba de Estrés (debe ser):
- ✅ **p95 < 1000ms** (95% de requests < 1 segundo)
- ✅ **p99 < 2000ms** (99% de requests < 2 segundos)
- ✅ **Error rate < 5%** (menos de 5% de errores)

### Tiempo de Carga Homepage (debe ser):
- ✅ **Performance Score > 90/100** (Lighthouse)
- ✅ **FCP < 1.8s** (First Contentful Paint)
- ✅ **LCP < 2.5s** (Largest Contentful Paint)
- ✅ **APIs p95 < 800ms** (Artillery)

---

## 📸 EVIDENCIAS A ENTREGAR

### Para Prueba de Estrés:
1. Screenshot del reporte HTML de Artillery
2. Copia del "Summary report" de la consola

### Para Tiempo de Carga Homepage:
1. Screenshot del reporte Lighthouse (Performance Score)
2. Screenshot del reporte Artillery de APIs
3. Screenshot de Chrome DevTools Network (opcional)

---

## ⚡ COMANDOS ULTRA-RÁPIDOS (Todo en uno)

```bash
# PRUEBA 1: Estrés del servidor
cd backend && npm install && npm run dev  # Terminal 1
cd backend && npm run load:stress         # Terminal 2

# PRUEBA 2: Tiempo de carga homepage
cd frontend && npm run dev                # Terminal 1
lighthouse http://localhost:5173 --output html --output-path ./homepage-lighthouse.html  # Terminal 2
```

---

## ❓ ¿PROBLEMAS?

### Backend no inicia
```bash
cd backend
npm install
npm run dev
# Verificar que corra en http://localhost:3000
```

### Artillery no encuentra archivos
```bash
cd backend
pwd  # Asegurar que estás en la carpeta backend
ls load-tests  # Verificar que existan los archivos
```

### Frontend no inicia
```bash
cd frontend
npm install
npm run dev
# Debe correr en http://localhost:5173
```

### Lighthouse da error
```bash
# Instalar globalmente
npm install -g lighthouse

# O usar Chrome DevTools:
# F12 → Lighthouse → Performance → Analyze page load
```

---

## 🎓 RESUMEN SIMPLIFICADO

**Necesitas hacer 2 cosas:**

1. **Prueba de Estrés:**
   ```bash
   cd backend
   npm run dev         # Terminal 1
   npm run load:stress # Terminal 2 (tomar screenshot del HTML)
   ```

2. **Tiempo de Carga Homepage:**
   ```bash
   cd frontend
   npm run dev         # Terminal 1

   # Terminal 2
   npm install -g lighthouse
   lighthouse http://localhost:5173 --output html
   # Tomar screenshot del reporte
   ```

**Total:** ~10 minutos + capturas de pantalla ✅

---

¿Todo claro? ¡Ejecuta los comandos y captura las evidencias! 🚀
