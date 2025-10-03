import request from 'supertest'
import express from 'express'
import productRoutes from '../routes/productRoutes.js'

// Crear app de prueba
const app = express()
app.use(express.json())
app.use('/api/products', productRoutes)

describe('Product Endpoints', () => {

  describe('GET /api/products', () => {
    it('debería obtener lista de productos', async () => {
      const response = await request(app)
        .get('/api/products')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body).toHaveProperty('data')
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })

  describe('GET /api/products/:id', () => {
    it('debería obtener un producto por ID válido', async () => {
      // Asumiendo que existe un producto con ID 1
      const response = await request(app)
        .get('/api/products/1')

      // Puede ser 200 si existe o 404 si no existe
      expect([200, 404]).toContain(response.status)

      if (response.status === 200) {
        expect(response.body.success).toBe(true)
        expect(response.body.data).toHaveProperty('id')
        expect(response.body.data.id).toBe(1)
      }
    })

    it('debería fallar con ID inválido', async () => {
      const response = await request(app)
        .get('/api/products/invalid')

      expect(response.status).toBe(400)
    })

    it('debería retornar 404 para producto inexistente', async () => {
      const response = await request(app)
        .get('/api/products/999999')

      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
    })
  })

  describe('GET /api/products/search', () => {
    it('debería buscar productos por query', async () => {
      const response = await request(app)
        .get('/api/products/search')
        .query({ q: 'polera' })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
    })

    it('debería fallar sin parámetro de búsqueda', async () => {
      const response = await request(app)
        .get('/api/products/search')

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
  })

  describe('GET /api/products/category/:categoryId', () => {
    it('debería obtener productos por categoría', async () => {
      const response = await request(app)
        .get('/api/products/category/1')

      expect([200, 404]).toContain(response.status)

      if (response.status === 200) {
        expect(response.body.success).toBe(true)
        expect(Array.isArray(response.body.data)).toBe(true)
      }
    })

    it('debería fallar con ID de categoría inválido', async () => {
      const response = await request(app)
        .get('/api/products/category/invalid')

      expect(response.status).toBe(400)
    })
  })

  describe('POST /api/products', () => {
    it('debería fallar sin autenticación', async () => {
      const newProduct = {
        name: 'Polera Test',
        description: 'Descripción test',
        price: 15990
      }

      const response = await request(app)
        .post('/api/products')
        .send(newProduct)

      expect(response.status).toBe(401)
    })

    // Nota: Para test completo de creación necesitamos mock de auth
    // o crear un usuario admin y usar su token
  })

  describe('PUT /api/products/:id', () => {
    it('debería fallar sin autenticación', async () => {
      const updates = {
        name: 'Polera Actualizada',
        price: 17990
      }

      const response = await request(app)
        .put('/api/products/1')
        .send(updates)

      expect(response.status).toBe(401)
    })
  })

  describe('DELETE /api/products/:id', () => {
    it('debería fallar sin autenticación', async () => {
      const response = await request(app)
        .delete('/api/products/999')

      expect(response.status).toBe(401)
    })
  })
})
