import Joi from 'joi'

/**
 * Validador para crear transacción WebPay
 */
export const createTransactionSchema = Joi.object({
  amount: Joi.number()
    .positive()
    .integer()
    .required()
    .messages({
      'number.positive': 'El monto debe ser un número positivo',
      'number.integer': 'El monto debe ser un número entero',
      'any.required': 'El monto es requerido'
    }),

  sessionId: Joi.string()
    .required()
    .messages({
      'any.required': 'El session ID es requerido'
    }),

  returnUrl: Joi.string()
    .uri()
    .allow('', null)
    .messages({
      'string.uri': 'La URL de retorno debe ser válida'
    }),

  orderData: Joi.object({
    customerInfo: Joi.object({
      name: Joi.string().max(100),
      email: Joi.string().email(),
      phone: Joi.string().pattern(/^\+?[0-9]{8,15}$/),
      address: Joi.string().max(200),
      city: Joi.string().max(100)
    }),
    cartItems: Joi.array().items(
      Joi.object({
        id: Joi.number().integer().positive(),
        name: Joi.string().max(200),
        quantity: Joi.number().integer().positive(),
        price: Joi.number().positive()
      })
    )
  }).allow(null)
})

/**
 * Validador para commit de transacción WebPay
 */
export const commitTransactionSchema = Joi.object({
  token_ws: Joi.string()
    .allow('', null),

  TBK_TOKEN: Joi.string()
    .allow('', null),

  TBK_ORDEN_COMPRA: Joi.string()
    .allow('', null)
}).or('token_ws', 'TBK_TOKEN').messages({
  'object.missing': 'Se requiere token_ws o TBK_TOKEN'
})
