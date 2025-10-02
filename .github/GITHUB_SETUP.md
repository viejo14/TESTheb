# ⚙️ Configuración de GitHub - TESTheb

Esta guía te ayudará a configurar correctamente el repositorio de GitHub con protección de ramas y flujo de Pull Requests.

## 📋 Tabla de Contenidos
- [Proteger la Rama Main](#proteger-la-rama-main)
- [Configurar Labels](#configurar-labels)
- [Configurar GitHub Actions (Opcional)](#configurar-github-actions-opcional)

---

## 🔒 Proteger la Rama Main

### ¿Por qué proteger `main`?

- ✅ Evita commits directos accidentales
- ✅ Asegura code review antes de mergear
- ✅ Mantiene historial limpio
- ✅ Reduce bugs en producción

### Paso a Paso

#### 1. Acceder a Configuración de Ramas

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (⚙️)
3. En el menú lateral, click en **Branches**
4. Click en **Add rule** o **Add branch protection rule**

#### 2. Configurar Regla para `main`

**Branch name pattern:** `main`

##### ✅ Opciones Recomendadas (Mínimas)

Marca las siguientes opciones:

1. **Require a pull request before merging**
   - ✅ Activar
   - **Required approvals:** `1` (mínimo)
   - ✅ **Dismiss stale pull request approvals when new commits are pushed**

2. **Require status checks to pass before merging** (si tienes CI/CD)
   - ⚠️ Opcional, activar cuando tengas GitHub Actions

3. **Require conversation resolution before merging**
   - ✅ Activar (todos los comentarios deben resolverse)

4. **Require linear history** (opcional pero recomendado)
   - ✅ Activar (evita merge commits complejos)

5. **Do not allow bypassing the above settings**
   - ⚠️ Desactivar si quieres que admins puedan hacer commits directos en emergencias
   - ✅ Activar para mayor seguridad (nadie puede saltarse las reglas)

##### ⚠️ Opciones Adicionales (Avanzadas)

6. **Require deployments to succeed before merging**
   - ⚠️ Solo si tienes entornos de staging configurados

7. **Lock branch**
   - ❌ No activar (haría `main` de solo lectura)

8. **Restrict who can push to matching branches**
   - ⚠️ Opcional, solo admins pueden hacer push directo

#### 3. Guardar Configuración

Click en **Create** o **Save changes** al final de la página.

---

## 🔒 Proteger la Rama `develop` (Opcional pero Recomendado)

Repite el mismo proceso pero con configuración menos restrictiva:

**Branch name pattern:** `develop`

##### ✅ Opciones para `develop`

1. **Require a pull request before merging**
   - ✅ Activar
   - **Required approvals:** `1`

2. **Require conversation resolution before merging**
   - ✅ Activar

3. **Do not allow bypassing the above settings**
   - ⚠️ Desactivar (permite más flexibilidad en develop)

---

## 🏷️ Configurar Labels

### Labels Recomendados para Issues y PRs

1. Ve a **Issues** → **Labels**
2. Agrega o edita los siguientes labels:

| Label           | Color    | Descripción                          |
|-----------------|----------|--------------------------------------|
| `feat`          | `#0E8A16` | Nueva funcionalidad                  |
| `fix`           | `#D73A4A` | Corrección de bug                    |
| `docs`          | `#0075CA` | Documentación                        |
| `refactor`      | `#FBCA04` | Refactorización                      |
| `test`          | `#BFD4F2` | Tests                                |
| `chore`         | `#FEF2C0` | Tareas de mantenimiento              |
| `perf`          | `#5319E7` | Mejora de performance                |
| `hotfix`        | `#B60205` | Corrección urgente                   |
| `breaking`      | `#D93F0B` | Breaking change                      |
| `help-wanted`   | `#008672` | Ayuda necesaria                      |
| `wip`           | `#FBF2E8` | Work in progress                     |
| `blocked`       | `#E4E669` | Bloqueado por otra tarea             |
| `priority-high` | `#D73A4A` | Prioridad alta                       |
| `good-first-issue` | `#7057FF` | Bueno para principiantes          |

### Crear Labels Rápidamente

Puedes usar este script de bash para crear todos los labels:

```bash
#!/bin/bash

# Configurar estas variables
OWNER="sebamellaisla-sketch"
REPO="2025_MA_CAPSTONE_705D_GRUPO_7"
TOKEN="tu_personal_access_token"

# Array de labels (nombre:color:descripción)
labels=(
  "feat:0E8A16:Nueva funcionalidad"
  "fix:D73A4A:Corrección de bug"
  "docs:0075CA:Documentación"
  "refactor:FBCA04:Refactorización"
  "test:BFD4F2:Tests"
  "chore:FEF2C0:Tareas de mantenimiento"
  "perf:5319E7:Mejora de performance"
  "hotfix:B60205:Corrección urgente"
  "breaking:D93F0B:Breaking change"
  "help-wanted:008672:Ayuda necesaria"
  "wip:FBF2E8:Work in progress"
  "blocked:E4E669:Bloqueado por otra tarea"
  "priority-high:D73A4A:Prioridad alta"
)

for label_data in "${labels[@]}"; do
  IFS=':' read -r name color description <<< "$label_data"

  curl -X POST \
    -H "Authorization: token $TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/$OWNER/$REPO/labels" \
    -d "{\"name\":\"$name\",\"color\":\"$color\",\"description\":\"$description\"}"
done
```

**Nota:** Necesitas crear un Personal Access Token en GitHub:
1. Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token con scope `repo`

---

## 🤖 Configurar GitHub Actions (Opcional)

### CI/CD Básico

Crear archivo `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  test-backend:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        working-directory: ./backend
        run: npm ci

      - name: Run linter
        working-directory: ./backend
        run: npm run lint || echo "Linter not configured"

      - name: Run tests
        working-directory: ./backend
        run: npm test || echo "Tests not configured"

  test-frontend:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Run linter
        working-directory: ./frontend
        run: npm run lint || echo "Linter not configured"

      - name: Build
        working-directory: ./frontend
        run: npm run build
```

---

## ✅ Verificar Configuración

### Test de Protección de `main`

```bash
# 1. Intenta hacer commit directo a main (debe fallar)
git checkout main
echo "test" >> test.txt
git add test.txt
git commit -m "test: commit directo"
git push origin main
# ❌ Debe mostrar error: "required status checks"

# 2. Limpieza
git reset --hard HEAD~1
rm test.txt
```

### Test de Flujo Correcto

```bash
# 1. Crear rama feature
git checkout develop
git checkout -b feature/test-proteccion

# 2. Hacer cambio
echo "# Test" >> TEST.md
git add TEST.md
git commit -m "docs: agregar archivo de test"

# 3. Push
git push origin feature/test-proteccion

# 4. Ir a GitHub y crear PR
# develop ← feature/test-proteccion
# ✅ Debe permitir crear PR

# 5. Intentar mergear sin aprobación
# ❌ Debe requerir al menos 1 aprobación

# 6. Aprobar y mergear
# ✅ Debe funcionar

# 7. Limpieza
git checkout develop
git pull origin develop
git branch -d feature/test-proteccion
git push origin --delete feature/test-proteccion
```

---

## 🔐 Configurar Secrets (Para CI/CD)

Si usas GitHub Actions con variables sensibles:

1. Ve a **Settings → Secrets and variables → Actions**
2. Click en **New repository secret**
3. Agregar secretos necesarios:

| Secret Name              | Descripción                     |
|--------------------------|---------------------------------|
| `DB_PASSWORD`            | Password de PostgreSQL          |
| `JWT_SECRET`             | Secret para JWT                 |
| `CLOUDINARY_API_SECRET`  | Secret de Cloudinary            |
| `TRANSBANK_API_KEY_SECRET` | Secret de Transbank           |

---

## 📊 Monitoreo del Flujo de Trabajo

### Estadísticas Útiles en GitHub

1. **Insights → Pulse**: Actividad reciente
2. **Insights → Contributors**: Contribuciones por persona
3. **Insights → Network**: Visualizar ramas y merges
4. **Pull Requests → Filters**: Ver PRs abiertas/cerradas

### Comandos Git Útiles

```bash
# Ver ramas con último commit
git branch -v

# Ver ramas remotas
git branch -r

# Ver diferencias entre ramas
git diff main..develop

# Ver log gráfico
git log --oneline --graph --all

# Ver quién hizo qué
git blame archivo.js
```

---

## 🚨 Solución de Problemas

### "Cannot push to protected branch"

**Causa:** Intentaste hacer push directo a `main` o `develop`.

**Solución:**
```bash
# Crear rama feature
git checkout -b feature/mi-cambio

# Hacer commit
git commit -m "feat: mi cambio"

# Push a la rama feature
git push origin feature/mi-cambio

# Crear PR en GitHub
```

### "Reviews required before merging"

**Causa:** El PR necesita al menos 1 aprobación.

**Solución:**
- Pide a un compañero que revise y apruebe el PR
- Si eres admin y es urgente, puedes cambiar temporalmente las reglas

### "Status checks failed"

**Causa:** Los tests o linters fallaron en GitHub Actions.

**Solución:**
```bash
# Ver logs en GitHub Actions
# Fix el código
git commit -m "fix: corregir tests"
git push origin feature/mi-rama
```

---

## 📞 Recursos Adicionales

- [GitHub Docs - Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Docs - Pull Requests](https://docs.github.com/en/pull-requests)
- [GitHub Actions](https://docs.github.com/en/actions)

**Última actualización:** Octubre 2025
