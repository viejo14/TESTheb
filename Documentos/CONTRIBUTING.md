# 🤝 Guía de Contribución - TESTheb

Esta guía establece las convenciones y mejores prácticas para contribuir al proyecto TESTheb.

## 📋 Tabla de Contenidos
- [Convenciones de Código](#convenciones-de-código)
- [Estructura de Archivos](#estructura-de-archivos)
- [Estilo de Código](#estilo-de-código)
- [Commits y Pull Requests](#commits-y-pull-requests)
- [Testing](#testing)

---

## 🎨 Convenciones de Código

### JavaScript/JSX

#### Naming Conventions

```javascript
// ✅ CORRECTO

// Variables y funciones: camelCase
const productList = []
const getUserById = () => {}

// Constantes globales: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:3000'
const MAX_RETRY_ATTEMPTS = 3

// Componentes React: PascalCase
const ProductCard = () => {}
const AdminDashboard = () => {}

// Archivos de componentes: PascalCase.jsx
// ProductCard.jsx, HomePage.jsx

// Archivos de utilidades: camelCase.js
// apiClient.js, formatters.js

// Clases: PascalCase
class UserService {}
class ProductManager {}

// Variables privadas: prefijo _
const _privateVariable = 'secret'
```

#### Variables y Constantes

```javascript
// ✅ CORRECTO
const productName = 'Polera Bordada'
const isActive = true
const userList = []

// ❌ INCORRECTO
const ProductName = 'Polera Bordada'  // No usar PascalCase
const active = true                    // No descriptivo
const arr = []                         // Nombre genérico
```

#### Funciones

```javascript
// ✅ CORRECTO - Nombres descriptivos, verbos
const fetchProducts = async () => {}
const calculateTotal = (items) => {}
const validateEmail = (email) => {}
const handleSubmit = (event) => {}

// ❌ INCORRECTO
const products = () => {}              // No es verbo
const calc = (items) => {}             // Abreviación poco clara
const check = (email) => {}            // Muy genérico
```

#### React Components

```javascript
// ✅ CORRECTO - Componente funcional con Arrow Function
const ProductCard = ({ product }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    // Lógica aquí
  }

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <button onClick={handleClick}>Comprar</button>
    </div>
  )
}

export default ProductCard

// ❌ INCORRECTO
function productCard(props) {           // Nombre no es PascalCase
  return <div>{props.product.name}</div>
}
```

---

## 📁 Estructura de Archivos

### Backend

```
backend/
├── src/
│   ├── config/          # Configuraciones (DB, logger, etc.)
│   ├── controllers/     # Lógica de negocio
│   ├── middleware/      # Middlewares personalizados
│   ├── routes/          # Definición de rutas
│   ├── services/        # Servicios externos (email, etc.)
│   └── utils/           # Utilidades y helpers
├── logs/                # Archivos de logs
├── uploads/             # Archivos subidos (temporal)
├── .env                 # Variables de entorno (NO commitear)
├── .env.example         # Template de variables
└── server.js            # Punto de entrada
```

### Frontend

```
frontend/
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── admin/       # Componentes específicos de admin
│   │   ├── ProductCard.jsx
│   │   └── Header.jsx
│   ├── pages/           # Páginas principales
│   │   ├── HomePage.jsx
│   │   └── CatalogPage.jsx
│   ├── context/         # Context API
│   ├── hooks/           # Custom hooks
│   ├── services/        # Llamadas a API
│   ├── utils/           # Funciones helper
│   └── data/            # Datos estáticos
├── public/              # Assets estáticos
└── vite.config.js
```

---

## 🎯 Estilo de Código

### Indentación y Espaciado

```javascript
// ✅ CORRECTO - 2 espacios de indentación
const fetchUsers = async () => {
  try {
    const response = await fetch('/api/users')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', error)
  }
}

// ❌ INCORRECTO - Inconsistente
const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
        const data = await response.json()
    return data
    } catch (error) {
console.error('Error:', error)
    }
}
```

### Strings

```javascript
// ✅ CORRECTO - Single quotes preferido, template literals para interpolación
const name = 'TESTheb'
const message = `Bienvenido a ${name}`

// ❌ INCORRECTO
const name = "TESTheb"                 // Usar single quotes
const message = 'Bienvenido a ' + name // Usar template literals
```

### Importaciones

```javascript
// ✅ CORRECTO - Orden: libraries -> components -> utils -> styles
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Header from '../components/Header'
import ProductCard from '../components/ProductCard'

import { formatPrice } from '../utils/formatters'
import './HomePage.css'

// ❌ INCORRECTO - Desordenado
import './HomePage.css'
import { formatPrice } from '../utils/formatters'
import { useState } from 'react'
import ProductCard from '../components/ProductCard'
```

### Desestructuración

```javascript
// ✅ CORRECTO
const { name, email, role } = user
const { id } = req.params
const [count, setCount] = useState(0)

// ❌ INCORRECTO
const name = user.name
const email = user.email
const role = user.role
```

### Async/Await vs Promises

```javascript
// ✅ CORRECTO - Preferir async/await
const fetchProducts = async () => {
  try {
    const response = await fetch('/api/products')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

// ⚠️ ACEPTABLE - Solo para casos específicos
const fetchProducts = () => {
  return fetch('/api/products')
    .then(res => res.json())
    .catch(err => console.error(err))
}
```

### Comentarios

```javascript
// ✅ CORRECTO - Comentarios útiles y concisos

// Calcular total con IVA (19%)
const calculateTotalWithIVA = (amount) => {
  const IVA_RATE = 0.19
  return amount * (1 + IVA_RATE)
}

// TODO: Implementar caché de productos
// FIXME: Bug en cálculo de stock cuando hay múltiples tallas
// HACK: Solución temporal hasta refactorizar

// ❌ INCORRECTO
// Esta función suma 1 + 1
const add = () => 1 + 1  // Obvio, no aporta valor

// función para obtener usuarios
const getUsers = () => {} // Comentario redundante
```

---

## 🔄 Commits y Pull Requests

Ver archivos:
- [COMMIT_CONVENTIONS.md](./COMMIT_CONVENTIONS.md)
- [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md)
- [.github/pull_request_template.md](./.github/pull_request_template.md)

---

## 🧪 Testing

### Estructura de Tests

```javascript
// ejemplo.test.js

describe('ProductController', () => {
  describe('GET /api/products', () => {
    it('should return all products', async () => {
      // Arrange
      const expected = [{ id: 1, name: 'Polera' }]

      // Act
      const response = await request(app).get('/api/products')

      // Assert
      expect(response.status).toBe(200)
      expect(response.body.data).toEqual(expected)
    })
  })
})
```

### Cobertura Mínima

- **Backend**: 70% de cobertura en controllers
- **Frontend**: Tests de componentes críticos (Checkout, Cart)

---

## ✅ Checklist Antes de Hacer PR

- [ ] El código sigue las convenciones establecidas
- [ ] Los tests pasan (`npm test`)
- [ ] El linter no muestra errores (`npm run lint`)
- [ ] Actualicé la documentación si es necesario
- [ ] El commit sigue las convenciones (ver COMMIT_CONVENTIONS.md)
- [ ] La rama está actualizada con `main`
- [ ] Probé el código localmente
- [ ] Agregué descripción clara en el PR

---

## 🚫 Prohibido

- ❌ Commits directos a `main` (usar PRs)
- ❌ Subir archivos `.env` al repositorio
- ❌ Subir `node_modules/`
- ❌ Dejar `console.log()` en producción
- ❌ Hardcodear credenciales o secrets
- ❌ Hacer PRs con más de 500 líneas cambiadas

---

## 📞 Contacto

Si tienes dudas sobre estas convenciones:
- Francisco Campos
- Sebastian Mella

**Última actualización:** Octubre 2025
