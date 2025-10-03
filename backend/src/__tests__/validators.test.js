import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema
} from '../validators/authValidator.js'
import {
  createProductSchema,
  updateProductSchema
} from '../validators/productValidator.js'
import {
  createCategorySchema
} from '../validators/categoryValidator.js'
import {
  createCotizacionSchema
} from '../validators/cotizacionValidator.js'

describe('Validators - Schema Tests', () => {

  describe('authValidator', () => {
    describe('registerSchema', () => {
      it('debería validar datos correctos de registro', () => {
        const validData = {
          name: 'Juan Pérez',
          email: 'juan@example.com',
          password: 'password123'
        }

        const { error } = registerSchema.validate(validData)
        expect(error).toBeUndefined()
      })

      it('debería fallar con email inválido', () => {
        const invalidData = {
          name: 'Juan Pérez',
          email: 'invalid-email',
          password: 'password123'
        }

        const { error } = registerSchema.validate(invalidData)
        expect(error).toBeDefined()
        expect(error.details[0].path).toContain('email')
      })

      it('debería fallar con contraseña corta', () => {
        const invalidData = {
          name: 'Juan Pérez',
          email: 'juan@example.com',
          password: '123'
        }

        const { error } = registerSchema.validate(invalidData)
        expect(error).toBeDefined()
        expect(error.details[0].path).toContain('password')
      })

      it('debería fallar sin campos requeridos', () => {
        const invalidData = {}

        const { error } = registerSchema.validate(invalidData)
        expect(error).toBeDefined()
        expect(error.details.length).toBeGreaterThan(0)
      })

      it('debería aplicar role por defecto', () => {
        const data = {
          name: 'Juan Pérez',
          email: 'juan@example.com',
          password: 'password123'
        }

        const { value } = registerSchema.validate(data)
        expect(value.role).toBe('customer')
      })
    })

    describe('loginSchema', () => {
      it('debería validar datos correctos de login', () => {
        const validData = {
          email: 'juan@example.com',
          password: 'password123'
        }

        const { error } = loginSchema.validate(validData)
        expect(error).toBeUndefined()
      })

      it('debería fallar sin email', () => {
        const invalidData = {
          password: 'password123'
        }

        const { error } = loginSchema.validate(invalidData)
        expect(error).toBeDefined()
      })
    })

    describe('changePasswordSchema', () => {
      it('debería validar cambio de contraseña correcto', () => {
        const validData = {
          currentPassword: 'oldpassword',
          newPassword: 'newpassword123'
        }

        const { error } = changePasswordSchema.validate(validData)
        expect(error).toBeUndefined()
      })

      it('debería fallar con nueva contraseña corta', () => {
        const invalidData = {
          currentPassword: 'oldpassword',
          newPassword: '123'
        }

        const { error } = changePasswordSchema.validate(invalidData)
        expect(error).toBeDefined()
      })
    })

    describe('forgotPasswordSchema', () => {
      it('debería validar email correcto', () => {
        const validData = {
          email: 'juan@example.com'
        }

        const { error } = forgotPasswordSchema.validate(validData)
        expect(error).toBeUndefined()
      })
    })
  })

  describe('productValidator', () => {
    describe('createProductSchema', () => {
      it('debería validar datos correctos de producto', () => {
        const validData = {
          name: 'Polera Bordada',
          description: 'Polera premium',
          price: 15990,
          category_id: 1,
          stock: 50
        }

        const { error } = createProductSchema.validate(validData)
        expect(error).toBeUndefined()
      })

      it('debería fallar con precio negativo', () => {
        const invalidData = {
          name: 'Polera',
          price: -100
        }

        const { error } = createProductSchema.validate(invalidData)
        expect(error).toBeDefined()
      })

      it('debería aplicar stock por defecto', () => {
        const data = {
          name: 'Polera',
          price: 15990
        }

        const { value } = createProductSchema.validate(data)
        expect(value.stock).toBe(0)
      })

      it('debería fallar con precio decimal', () => {
        const invalidData = {
          name: 'Polera',
          price: 15990.50 // Debe ser entero
        }

        const { error } = createProductSchema.validate(invalidData)
        expect(error).toBeDefined()
      })
    })

    describe('updateProductSchema', () => {
      it('debería validar actualización parcial', () => {
        const validData = {
          price: 17990
        }

        const { error } = updateProductSchema.validate(validData)
        expect(error).toBeUndefined()
      })

      it('debería fallar sin campos', () => {
        const invalidData = {}

        const { error } = updateProductSchema.validate(invalidData)
        expect(error).toBeDefined()
      })
    })
  })

  describe('categoryValidator', () => {
    describe('createCategorySchema', () => {
      it('debería validar datos correctos de categoría', () => {
        const validData = {
          name: 'Poleras',
          image_url: 'https://example.com/image.jpg'
        }

        const { error } = createCategorySchema.validate(validData)
        expect(error).toBeUndefined()
      })

      it('debería fallar sin nombre', () => {
        const invalidData = {
          image_url: 'https://example.com/image.jpg'
        }

        const { error } = createCategorySchema.validate(invalidData)
        expect(error).toBeDefined()
        expect(error.details[0].path).toContain('name')
      })

      it('debería fallar con URL inválida', () => {
        const invalidData = {
          name: 'Poleras',
          image_url: 'not-a-url'
        }

        const { error } = createCategorySchema.validate(invalidData)
        expect(error).toBeDefined()
      })
    })
  })

  describe('cotizacionValidator', () => {
    describe('createCotizacionSchema', () => {
      it('debería validar datos correctos de cotización', () => {
        const validData = {
          name: 'Juan Pérez',
          email: 'juan@example.com',
          phone: '+56912345678',
          message: 'Necesito cotizar 50 poleras con logo'
        }

        const { error } = createCotizacionSchema.validate(validData)
        expect(error).toBeUndefined()
      })

      it('debería fallar con mensaje muy corto', () => {
        const invalidData = {
          name: 'Juan Pérez',
          email: 'juan@example.com',
          message: 'Hola' // Menos de 10 caracteres
        }

        const { error } = createCotizacionSchema.validate(invalidData)
        expect(error).toBeDefined()
      })

      it('debería fallar con teléfono inválido', () => {
        const invalidData = {
          name: 'Juan Pérez',
          email: 'juan@example.com',
          phone: '123', // Muy corto
          message: 'Necesito cotizar productos'
        }

        const { error } = createCotizacionSchema.validate(invalidData)
        expect(error).toBeDefined()
      })
    })
  })
})
