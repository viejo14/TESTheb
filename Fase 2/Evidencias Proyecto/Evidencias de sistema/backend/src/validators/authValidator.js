import Joi from 'joi'

/**
 * Validador para registro de usuario
 */
export const registerSchema = Joi.object({
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

  password: Joi.string()
    .min(6)
    .max(100)
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 6 caracteres',
      'string.max': 'La contraseña no puede exceder 100 caracteres',
      'any.required': 'La contraseña es requerida'
    }),

  role: Joi.string()
    .valid('customer', 'admin', 'employee')
    .default('customer')
    .messages({
      'any.only': 'El rol debe ser customer, admin o employee'
    })
})

/**
 * Validador para login
 */
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'El email debe ser válido',
      'any.required': 'El email es requerido'
    }),

  password: Joi.string()
    .required()
    .messages({
      'any.required': 'La contraseña es requerida'
    })
})

/**
 * Validador para actualización de perfil
 */
export const updateProfileSchema = Joi.object({
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
    })
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
})

/**
 * Validador para cambio de contraseña
 */
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'La contraseña actual es requerida'
    }),

  newPassword: Joi.string()
    .min(6)
    .max(100)
    .required()
    .messages({
      'string.min': 'La nueva contraseña debe tener al menos 6 caracteres',
      'string.max': 'La nueva contraseña no puede exceder 100 caracteres',
      'any.required': 'La nueva contraseña es requerida'
    })
})

/**
 * Validador para recuperación de contraseña
 */
export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'El email debe ser válido',
      'any.required': 'El email es requerido'
    })
})

/**
 * Validador para restablecer contraseña
 */
export const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'El token es requerido'
    }),

  newPassword: Joi.string()
    .min(6)
    .max(100)
    .required()
    .messages({
      'string.min': 'La nueva contraseña debe tener al menos 6 caracteres',
      'string.max': 'La nueva contraseña no puede exceder 100 caracteres',
      'any.required': 'La nueva contraseña es requerida'
    })
})
