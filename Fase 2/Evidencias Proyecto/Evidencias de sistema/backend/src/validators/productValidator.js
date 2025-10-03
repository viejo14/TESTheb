import Joi from 'joi'

/**
 * Validador para crear producto
 */
export const createProductSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede exceder 200 caracteres',
      'any.required': 'El nombre es requerido'
    }),

  description: Joi.string()
    .max(1000)
    .allow('', null)
    .messages({
      'string.max': 'La descripción no puede exceder 1000 caracteres'
    }),

  price: Joi.number()
    .positive()
    .integer()
    .required()
    .messages({
      'number.positive': 'El precio debe ser un número positivo',
      'number.integer': 'El precio debe ser un número entero',
      'any.required': 'El precio es requerido'
    }),

  category_id: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .messages({
      'number.positive': 'El ID de categoría debe ser un número positivo',
      'number.integer': 'El ID de categoría debe ser un número entero'
    }),

  image_url: Joi.string()
    .uri()
    .allow('', null)
    .messages({
      'string.uri': 'La URL de imagen debe ser válida'
    }),

  size_id: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .messages({
      'number.positive': 'El ID de talla debe ser un número positivo',
      'number.integer': 'El ID de talla debe ser un número entero'
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.min': 'El stock no puede ser negativo',
      'number.integer': 'El stock debe ser un número entero'
    })
})

/**
 * Validador para actualizar producto
 */
export const updateProductSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(200)
    .messages({
      'string.min': 'El nombre debe tener al menos 3 caracteres',
      'string.max': 'El nombre no puede exceder 200 caracteres'
    }),

  description: Joi.string()
    .max(1000)
    .allow('', null)
    .messages({
      'string.max': 'La descripción no puede exceder 1000 caracteres'
    }),

  price: Joi.number()
    .positive()
    .integer()
    .messages({
      'number.positive': 'El precio debe ser un número positivo',
      'number.integer': 'El precio debe ser un número entero'
    }),

  category_id: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .messages({
      'number.positive': 'El ID de categoría debe ser un número positivo',
      'number.integer': 'El ID de categoría debe ser un número entero'
    }),

  image_url: Joi.string()
    .uri()
    .allow('', null)
    .messages({
      'string.uri': 'La URL de imagen debe ser válida'
    }),

  size_id: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .messages({
      'number.positive': 'El ID de talla debe ser un número positivo',
      'number.integer': 'El ID de talla debe ser un número entero'
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.min': 'El stock no puede ser negativo',
      'number.integer': 'El stock debe ser un número entero'
    })
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
})

/**
 * Validador para búsqueda de productos
 */
export const searchProductsSchema = Joi.object({
  q: Joi.string()
    .min(1)
    .max(200)
    .required()
    .messages({
      'string.min': 'El término de búsqueda no puede estar vacío',
      'string.max': 'El término de búsqueda no puede exceder 200 caracteres',
      'any.required': 'El término de búsqueda es requerido'
    })
})

/**
 * Validador para parámetro ID
 */
export const idParamSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.positive': 'El ID debe ser un número positivo',
      'number.integer': 'El ID debe ser un número entero',
      'any.required': 'El ID es requerido'
    })
})
