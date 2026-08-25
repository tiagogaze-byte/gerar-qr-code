const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
}

const LOG_COLORS = {
  ERROR: '\x1b[31m',
  WARN: '\x1b[33m',
  INFO: '\x1b[36m',
  DEBUG: '\x1b[90m'
}

const RESET = '\x1b[0m'

class Logger {
  constructor (name = 'QRCode', level = 'INFO') {
    this.name = name
    this.level = level
    this.levelPriority = Object.keys(LOG_LEVELS).indexOf(level)
  }

  _formatMessage (level, message, data) {
    const timestamp = new Date().toISOString()
    const color = LOG_COLORS[level]
    const levelStr = level.padEnd(6)
    let msg = timestamp + ' ' + color + '[' + levelStr + ']' + RESET + ' [' + this.name + '] ' + message
    if (data) msg += ' ' + JSON.stringify(data, null, 2)
    return msg
  }

  _shouldLog (level) {
    return Object.keys(LOG_LEVELS).indexOf(level) <= this.levelPriority
  }

  error (message, data) {
    if (this._shouldLog('ERROR')) console.error(this._formatMessage('ERROR', message, data))
  }

  warn (message, data) {
    if (this._shouldLog('WARN')) console.warn(this._formatMessage('WARN', message, data))
  }

  info (message, data) {
    if (this._shouldLog('INFO')) console.log(this._formatMessage('INFO', message, data))
  }

  debug (message, data) {
    if (this._shouldLog('DEBUG')) console.log(this._formatMessage('DEBUG', message, data))
  }

  setLevel (level) {
    if (LOG_LEVELS[level]) {
      this.level = level
      this.levelPriority = Object.keys(LOG_LEVELS).indexOf(level)
    }
  }
}

module.exports = Logger
