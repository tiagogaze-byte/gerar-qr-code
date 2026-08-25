const express = require('express')
const QRGenerator = require('./lib/qr-generator')

const app = express()
const qr = new QRGenerator({ logLevel: 'INFO' })

app.get('/gerar', async (req, res) => {
  try {
    const { texto } = req.query
    if (!texto) {
      return res.status(400).json({ erro: 'Falta parametro: texto' })
    }
    
    const buffer = await qr.toBuffer(texto)
    res.type('image/png').send(buffer)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(Rodando em http://localhost:))
