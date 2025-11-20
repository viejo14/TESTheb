import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000

app.get('/api/health', (req, res) => {
  res.json({
    message: 'OK desde Railway',
    timestamp: new Date().toISOString()
  })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor test corriendo en puerto ${PORT}`)
})
