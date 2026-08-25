# QRGenerator - Guia Operacional

## 🎯 Visão Geral

Versão operacional da biblioteca node-qrcode com:
- ✅ Logging estruturado com timestamps
- ✅ Validação robusta de inputs
- ✅ API simples e intuitiva

## 🚀 Quick Start

\\\javascript
const QRGenerator = require('./lib/qr-generator')
const qr = new QRGenerator()
await qr.toFile('./qrcode.png', 'https://github.com')
\\\

## 📚 API

### toFile(filepath, text, options)
Salva QR code em arquivo

### tostring(text, options)
Gera QR code como string

### batch(items)
Processa múltiplos QR codes

## 🔧 Opções

| Opção | Padrão | Descrição |
|-------|--------|-----------|
| type | png | png, svg, utf8, terminal |
| width | 300 | Largura em pixels |
| errorCorrectionLevel | M | L, M, Q, H |

---

**Pronto para produção!** 🎉
