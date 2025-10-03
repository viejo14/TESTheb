import Joi from 'joi'

/**
 * Validador para crear usuario (admin)
 */
export const createUserSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres',
      'any.required': 'El nombre es requerido'
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'El email debe ser válido',
      'any.required': 'El email es requerido'
    }),

  role: Joi.string()
    .valid('customer', 'admin', 'employee')
    .default('user')
    .messages({
      'any.only': 'El rol debe ser: customer, admin o employee'
    })
})

/**
 * Validador para actualizar usuario (admin)
 */
export const updateUserSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .messages({
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres'
    }),

  email: Joi.string()
    .email()
    .messages({
      'string.email': 'El email debe ser válido'
    }),

  role: Joi.string()
    .valid('customer', 'admin', 'employee')
    .messages({
      'any.only': 'El rol debe ser: customer, admin o employee'
    })
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
})

/**
 * Validador para parámetros de paginación
 */
export const paginationSchema = Joi.object({
  page: Joi.number()
    .integer()
    .positive()
    .default(1)
    .messages({
      'number.positive': 'La página debe ser un número positivo',
      'number.integer': 'La página debe ser un número entero'
    }),

  limit: Joi.number()
    .integer()
    .positive()
    .max(100)
    .default(10)
    .messages({
      'number.positive': 'El límite debe ser un número positivo',
      'number.integer': 'El límite debe ser un número entero',
      'number.max': 'El límite máximo es 100'
    }),

  search: Joi.string()
    .max(200)
    .allow('')
    .messages({
      'string.max': 'La búsqueda no puede exceder 200 caracteres'
    })
})
