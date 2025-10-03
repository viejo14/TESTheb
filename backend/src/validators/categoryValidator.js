import Joi from 'joi'

/**
 * Validador para crear categoría
 */
export const createCategorySchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres',
      'any.required': 'El nombre es requerido'
    }),

  image_url: Joi.string()
    .uri()
    .allow('', null)
    .messages({
      'string.uri': 'La URL de imagen debe ser válida'
    })
})

/**
 * Validador para actualizar categoría
 */
export const updateCategorySchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres',
      'any.required': 'El nombre es requerido'
    }),

  image_url: Joi.string()
    .uri()
    .allow('', null)
    .messages({
      'string.uri': 'La URL de imagen debe ser válida'
    })
})
