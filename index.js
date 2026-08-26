const express = require('express');
const QRGenerator = require('./lib/qr-generator');
const logger = require('./lib/logger');

const app = express();
const qrGenerator = new QRGenerator();

// Endpoint para gerar QR code
app.get('/gerar', async (req, res) => {
  try {
    const texto = req.query.texto;
    
    if (!texto) {
      logger.warn('Request recebido sem o parâmetro "texto"');
      return res.status(400).json({ 
        erro: 'Parâmetro "texto" é obrigatório' 
      });
    }

    logger.info('Gerando QR code para: ' + texto);
    
    const qrCode = await qrGenerator.toBuffer(texto);
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', qrCode.length);
    res.send(qrCode);
    
    logger.info('QR code gerado com sucesso para: ' + texto);
  } catch (erro) {
    logger.error('Erro ao gerar QR code: ' + erro.message);
    res.status(500).json({ 
      erro: 'Erro ao gerar QR code',
      detalhes: erro.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Inicia servidor localmente se não estiver em produção
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info('Servidor rodando em http://localhost:' + PORT);
  });
}

module.exports = app;
