import request from 'supertest'
import express from 'express'
import authRoutes from '../routes/authRoutes.js'

// Crear app de prueba
const app = express()
app.use(express.json())
app.use('/api/auth', authRoutes)

describe('Auth Endpoints', () => {

  describe('POST /api/auth/register', () => {
    it('debería registrar un nuevo usuario con datos válidos', async () => {
      const newUser = {
        name: 'Test User',
        email: `test${Date.now()}@test.com`, // Email único
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('user')
      expect(response.body.data).toHaveProperty('token')
      expect(response.body.data.user.email).toBe(newUser.email)
    })

    it('debería fallar con email inválido', async () => {
      const invalidUser = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })

    it('debería fallar con contraseña muy corta', async () => {
      const invalidUser = {
        name: 'Test User',
        email: 'test@test.com',
        password: '123' // Menos de 6 caracteres
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })

    it('debería fallar sin campos requeridos', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
  })

  describe('POST /api/auth/login', () => {
    it('debería iniciar sesión con credenciales válidas', async () => {
      // Primero crear un usuario
      const newUser = {
        name: 'Login Test User',
        email: `logintest${Date.now()}@test.com`,
        password: 'password123'
      }

      await request(app)
        .post('/api/auth/register')
        .send(newUser)

      // Luego intentar login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: newUser.email,
          password: newUser.password
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('token')
      expect(response.body.data).toHaveProperty('user')
    })

    it('debería fallar con credenciales incorrectas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'noexiste@test.com',
          password: 'wrongpassword'
        })

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })

    it('debería fallar sin email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password123'
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
  })

  describe('POST /api/auth/forgot-password', () => {
    it('debería aceptar solicitud con email válido', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'test@test.com'
        })

      // El endpoint debería aceptar la solicitud aunque el usuario no exista
      // (por seguridad, no revelamos si el email existe)
      expect([200, 404]).toContain(response.status)
    })

    it('debería fallar con email inválido', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'invalid-email'
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
  })

  describe('GET /api/auth/profile', () => {
    it('debería fallar sin token de autenticación', async () => {
      const response = await request(app)
        .get('/api/auth/profile')

      expect(response.status).toBe(401)
    })

    it('debería obtener perfil con token válido', async () => {
      // Primero registrar y obtener token
      const newUser = {
        name: 'Profile Test User',
        email: `profiletest${Date.now()}@test.com`,
        password: 'password123'
      }

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(newUser)

      const token = registerResponse.body.data.token

      // Luego obtener perfil
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.user.email).toBe(newUser.email)
    })
  })
})
