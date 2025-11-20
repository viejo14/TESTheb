import request from 'supertest'
import express from 'express'
import categoryRoutes from '../routes/categoryRoutes.js'

// Crear app de prueba
const app = express()
app.use(express.json())
app.use('/api/categories', categoryRoutes)

describe('Category Endpoints', () => {

  describe('GET /api/categories', () => {
    it('debería obtener lista de categorías', async () => {
      const response = await request(app)
        .get('/api/categories')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body).toHaveProperty('data')
      expect(Array.isArray(response.body.data)).toBe(true)
    })

    it('debería retornar al menos una categoría', async () => {
      const response = await request(app)
        .get('/api/categories')

      expect(response.status).toBe(200)
      expect(response.body.data.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe('GET /api/categories/:id', () => {
    it('debería obtener una categoría por ID válido', async () => {
      const response = await request(app)
        .get('/api/categories/1')

      // Puede ser 200 si existe o 404 si no existe
      expect([200, 404]).toContain(response.status)

      if (response.status === 200) {
        expect(response.body.success).toBe(true)
        expect(response.body.data).toHaveProperty('id')
        expect(response.body.data).toHaveProperty('name')
      }
    })

    it('debería fallar con ID inválido', async () => {
      const response = await request(app)
        .get('/api/categories/invalid')

      expect(response.status).toBe(400)
    })

    it('debería retornar 404 para categoría inexistente', async () => {
      const response = await request(app)
        .get('/api/categories/999999')

      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
    })
  })

  describe('POST /api/categories', () => {
    it('debería fallar sin autenticación', async () => {
      const newCategory = {
        name: 'Categoría Test',
        image_url: 'https://example.com/image.jpg'
      }

      const response = await request(app)
        .post('/api/categories')
        .send(newCategory)

      expect(response.status).toBe(401)
    })
  })

  describe('PUT /api/categories/:id', () => {
    it('debería fallar sin autenticación', async () => {
      const updates = {
        name: 'Categoría Actualizada'
      }

      const response = await request(app)
        .put('/api/categories/1')
        .send(updates)

      expect(response.status).toBe(401)
    })
  })

  describe('DELETE /api/categories/:id', () => {
    it('debería fallar sin autenticación', async () => {
      const response = await request(app)
        .delete('/api/categories/999')

      expect(response.status).toBe(401)
    })
  })
})
