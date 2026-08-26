const express = require('express')
const QRCode = require('qrcode')

const app = express()

app.get('/gerar', async (req, res) => {
  try {
    const { texto } = req.query
    if (!texto) return res.status(400).json({ erro: 'Falta texto' })
    
    const buffer = await QRCode.toBuffer(texto)
    res.type('image/png').send(buffer)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

module.exports = app
