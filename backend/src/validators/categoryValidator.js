import Joi from 'joi'

/**
 * Validador para ID numérico
 */
export const idParamSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID debe ser un número',
      'number.integer': 'El ID debe ser un número entero',
      'number.positive': 'El ID debe ser positivo',
      'any.required': 'El ID es requerido'
    })
})

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

  image_url: Joi.alternatives()
    .try(
      Joi.string().uri(),
      Joi.string().allow(''),
      Joi.allow(null)
    )
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

  image_url: Joi.alternatives()
    .try(
      Joi.string().uri(),
      Joi.string().allow(''),
      Joi.allow(null)
    )
    .messages({
      'string.uri': 'La URL de imagen debe ser válida'
    })
})
