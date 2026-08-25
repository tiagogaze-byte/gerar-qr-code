const Logger = require('./logger')
const QRCode = require('./core/qrcode')

class QRGenerator {
  constructor(options = {}) {
    this.logger = new Logger('QRGenerator', options.logLevel || 'INFO')
    this.defaultOptions = {
      errorCorrectionLevel: 'M',
      type: 'png',
      width: 300,
      margin: 1,
      ...options
    }
    this.logger.info('QRGenerator inicializado', { defaultOptions: this.defaultOptions })
  }

  _validateText(text) {
    if (!text || typeof text !== 'string') {
      throw new Error('Texto inválido: deve ser uma string não vazia')
    }
    if (text.length > 2953) {
      throw new Error('Texto muito longo: máximo 2953 caracteres')
    }
  }

  async toFile(filepath, text, opts = {}) {
    try {
      this._validateText(text)
      const qr = require('./index')
      const fs = require('fs')
      const path = require('path')
      
      const ext = path.extname(filepath).substring(1).toLowerCase()
      const type = opts.type || ext || 'png'
      
      const dir = path.dirname(filepath)
      if (!fs.existsSync(dir) && dir !== '.') {
        fs.mkdirSync(dir, { recursive: true })
      }

      this.logger.info('Salvando arquivo', { filepath, type })

      return new Promise((resolve, reject) => {
        qr.toFile(filepath, text, { ...opts, type }, (err) => {
          if (err) {
            this.logger.error('Erro ao salvar', { error: err.message })
            reject(err)
          } else {
            this.logger.info('Arquivo salvo com sucesso', { filepath })
            resolve()
          }
        })
      })
    } catch (error) {
      this.logger.error('Erro', { error: error.message })
      throw error
    }
  }
}

module.exports = QRGenerator
