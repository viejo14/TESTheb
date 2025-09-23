import pkg from 'transbank-sdk'
const { WebpayPlus, Options, IntegrationApiKeys, IntegrationCommerceCodes, Environment } = pkg

// Configuración para ambiente Sandbox
const transbankConfig = {
  // Configuración para sandbox/testing
  sandbox: {
    commerceCode: IntegrationCommerceCodes.WEBPAY_PLUS,
    apiKey: IntegrationApiKeys.WEBPAY,
    environment: Environment.Integration
  },

  // Configuración para producción (llenar cuando se tenga)
  production: {
    commerceCode: process.env.TRANSBANK_COMMERCE_CODE || '',
    apiKey: process.env.TRANSBANK_API_KEY || '',
    environment: Environment.Production
  }
}

// Determinar el ambiente actual
const isProduction = process.env.NODE_ENV === 'production'
const currentConfig = isProduction ? transbankConfig.production : transbankConfig.sandbox

// Configurar Webpay Plus con las credenciales apropiadas
const options = new Options(currentConfig.commerceCode, currentConfig.apiKey, currentConfig.environment)
const webpayPlus = new WebpayPlus.Transaction(options)

export { webpayPlus, transbankConfig, currentConfig }