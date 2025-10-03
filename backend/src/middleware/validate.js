/**
 * Middleware de validación usando Joi
 *
 * Este middleware valida el body, query params o params de una request
 * contra un schema de Joi antes de que llegue al controlador.
 */

/**
 * Valida el request body contra un schema de Joi
 * @param {Object} schema - Schema de Joi para validar
 */
export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Retornar todos los errores, no solo el primero
      stripUnknown: true // Eliminar campos no definidos en el schema
    })

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))

      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors
      })
    }

    // Reemplazar req.body con los valores validados (con defaults aplicados)
    req.body = value
    next()
  }
}

/**
 * Valida los query params contra un schema de Joi
 * @param {Object} schema - Schema de Joi para validar
 */
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    })

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))

      return res.status(400).json({
        success: false,
        message: 'Error de validación en parámetros de consulta',
        errors
      })
    }

    req.query = value
    next()
  }
}

/**
 * Valida los route params contra un schema de Joi
 * @param {Object} schema - Schema de Joi para validar
 */
export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    })

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))

      return res.status(400).json({
        success: false,
        message: 'Error de validación en parámetros de ruta',
        errors
      })
    }

    req.params = value
    next()
  }
}

/**
 * Middleware genérico que puede validar body, query o params
 * @param {Object} schemas - Objeto con schemas para body, query y/o params
 */
export const validate = (schemas) => {
  return (req, res, next) => {
    const errors = []

    // Validar body si existe schema
    if (schemas.body) {
      const { error, value } = schemas.body.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      })

      if (error) {
        errors.push(...error.details.map(detail => ({
          type: 'body',
          field: detail.path.join('.'),
          message: detail.message
        })))
      } else {
        req.body = value
      }
    }

    // Validar query si existe schema
    if (schemas.query) {
      const { error, value } = schemas.query.validate(req.query, {
        abortEarly: false,
        stripUnknown: true
      })

      if (error) {
        errors.push(...error.details.map(detail => ({
          type: 'query',
          field: detail.path.join('.'),
          message: detail.message
        })))
      } else {
        req.query = value
      }
    }

    // Validar params si existe schema
    if (schemas.params) {
      const { error, value } = schemas.params.validate(req.params, {
        abortEarly: false,
        stripUnknown: true
      })

      if (error) {
        errors.push(...error.details.map(detail => ({
          type: 'params',
          field: detail.path.join('.'),
          message: detail.message
        })))
      } else {
        req.params = value
      }
    }

    // Si hay errores, retornar respuesta de error
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors
      })
    }

    next()
  }
}
