const QRGenerator = require('../lib/qr-generator')

async function exemplo1() {
  console.log('\n=== Exemplo 1: Terminal ===\n')
  const qr = new QRGenerator({ logLevel: 'INFO' })
  try {
    const qrString = await qr.tostring('https://github.com', { type: 'terminal' })
    console.log(qrString)
  } catch (error) {
    console.error('Erro:', error.message)
  }
}

if (require.main === module) {
  exemplo1().catch(e => { console.error(e); process.exit(1) })
}

module.exports = { exemplo1 }
