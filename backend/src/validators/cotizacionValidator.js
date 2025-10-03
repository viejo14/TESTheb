import Joi from 'joi'

/**
 * Validador para crear cotización
 */
export const createCotizacionSchema = Joi.object({
  user_id: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .messages({
      'number.positive': 'El ID de usuario debe ser un número positivo',
      'number.integer': 'El ID de usuario debe ser un número entero'
    }),

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

  phone: Joi.string()
    .pattern(/^\+?[0-9]{8,15}$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'El teléfono debe ser un número válido (8-15 dígitos)'
    }),

  message: Joi.string()
    .min(10)
    .max(2000)
    .required()
    .messages({
      'string.min': 'El mensaje debe tener al menos 10 caracteres',
      'string.max': 'El mensaje no puede exceder 2000 caracteres',
      'any.required': 'El mensaje es requerido'
    })
})

/**
 * Validador para actualizar cotización
 */
export const updateCotizacionSchema = Joi.object({
  status: Joi.string()
    .valid('pendiente', 'aprobada', 'rechazada', 'en_proceso')
    .messages({
      'any.only': 'El estado debe ser: pendiente, aprobada, rechazada o en_proceso'
    }),

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

  phone: Joi.string()
    .pattern(/^\+?[0-9]{8,15}$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'El teléfono debe ser un número válido (8-15 dígitos)'
    }),

  message: Joi.string()
    .min(10)
    .max(2000)
    .messages({
      'string.min': 'El mensaje debe tener al menos 10 caracteres',
      'string.max': 'El mensaje no puede exceder 2000 caracteres'
    })
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
})

/**
 * Validador para actualización masiva de estado
 */
export const bulkStatusSchema = Joi.object({
  ids: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .required()
    .messages({
      'array.min': 'Debe proporcionar al menos un ID',
      'any.required': 'Los IDs son requeridos'
    }),

  status: Joi.string()
    .valid('pendiente', 'aprobada', 'rechazada', 'en_proceso')
    .required()
    .messages({
      'any.only': 'El estado debe ser: pendiente, aprobada, rechazada o en_proceso',
      'any.required': 'El estado es requerido'
    })
})
