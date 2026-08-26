const Logger = require('./logger')

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

  async toBuffer(text, opts = {}) {
    try {
      this._validateText(text)
      const qr = require('./index')
      const options = { ...this.defaultOptions, ...opts }
      
      this.logger.info('Gerando QR code para buffer', { text: text.substring(0, 50), options })
      
      const buffer = await qr.toBuffer(text, options)
      
      this.logger.info('Buffer gerado com sucesso', { size: buffer.length })
      return buffer
    } catch (error) {
      this.logger.error('Erro ao gerar buffer', { error: error.message })
      throw error
    }
  }

  async toString(text, opts = {}) {
    try {
      this._validateText(text)
      const qr = require('./index')
      const options = { ...this.defaultOptions, ...opts }
      
      this.logger.info('Gerando QR code como string', { text: text.substring(0, 50) })
      
      const str = await qr.toString(text, options)
      
      this.logger.info('String gerada com sucesso', { length: str.length })
      return str
    } catch (error) {
      this.logger.error('Erro ao gerar string', { error: error.message })
      throw error
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
      const options = { ...this.defaultOptions, ...opts, type }
      
      const dir = path.dirname(filepath)
      if (!fs.existsSync(dir) && dir !== '.') {
        fs.mkdirSync(dir, { recursive: true })
      }

      this.logger.info('Salvando arquivo', { filepath, type })

      return new Promise((resolve, reject) => {
        qr.toFile(filepath, text, options, (err) => {
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

  async batch(texts, outputDir = './qrcodes', opts = {}) {
    try {
      if (!Array.isArray(texts) || texts.length === 0) {
        throw new Error('Array de textos é obrigatório')
      }

      const results = []
      this.logger.info('Iniciando geração em lote', { count: texts.length, outputDir })

      for (let i = 0; i < texts.length; i++) {
        try {
          this._validateText(texts[i])
          const filename = `qrcode_${i + 1}.png`
          const filepath = `${outputDir}/${filename}`
          
          await this.toFile(filepath, texts[i], opts)
          results.push({ index: i + 1, text: texts[i], filepath, success: true })
        } catch (error) {
          this.logger.warn('Erro em item do lote', { index: i + 1, error: error.message })
          results.push({ index: i + 1, text: texts[i], error: error.message, success: false })
        }
      }

      this.logger.info('Lote concluído', { total: texts.length, success: results.filter(r => r.success).length })
      return results
    } catch (error) {
      this.logger.error('Erro no processamento em lote', { error: error.message })
      throw error
    }
  }
}

module.exports = QRGenerator
