import pkg from 'transbank-sdk'

const { WebpayPlus, Options, IntegrationApiKeys, IntegrationCommerceCodes, Environment } = pkg

const integrationType = (process.env.TRANSBANK_INTEGRATION_TYPE || '').toUpperCase()
const forceProd = integrationType === 'LIVE' || process.env.NODE_ENV === 'production'

const transbankConfig = {
  sandbox: {
    commerceCode: IntegrationCommerceCodes.WEBPAY_PLUS,
    apiKey: IntegrationApiKeys.WEBPAY,
    environment: Environment.Integration
  },
  production: {
    commerceCode: process.env.TRANSBANK_COMMERCE_CODE || '',
    apiKey: process.env.TRANSBANK_API_KEY_SECRET || process.env.TRANSBANK_API_KEY || process.env.TRANSBANK_API_KEY_ID || '',
    environment: Environment.Production
  }
}

const currentConfig = forceProd ? transbankConfig.production : transbankConfig.sandbox

const options = new Options(currentConfig.commerceCode, currentConfig.apiKey, currentConfig.environment)
const webpayPlus = new WebpayPlus.Transaction(options)

export { webpayPlus, transbankConfig, currentConfig }
