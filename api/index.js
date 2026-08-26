const express = require('express')
const QRCode = require('qrcode')

const app = express()

// Interface HTML
const htmlInterface = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerador de QR Code</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 900px;
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            padding: 40px;
        }

        @media (max-width: 768px) {
            .container {
                grid-template-columns: 1fr;
                gap: 30px;
                padding: 30px 20px;
            }
        }

        .section {
            display: flex;
            flex-direction: column;
        }

        h1 {
            color: #333;
            font-size: 28px;
            margin-bottom: 10px;
        }

        .subtitle {
            color: #999;
            font-size: 14px;
            margin-bottom: 30px;
        }

        .tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 25px;
            border-bottom: 2px solid #f0f0f0;
        }

        .tab-btn {
            background: none;
            border: none;
            padding: 12px 16px;
            font-size: 14px;
            color: #999;
            cursor: pointer;
            border-bottom: 3px solid transparent;
            transition: all 0.3s ease;
            font-weight: 500;
        }

        .tab-btn.active {
            color: #667eea;
            border-bottom-color: #667eea;
        }

        .tab-btn:hover {
            color: #667eea;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            color: #333;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        input[type="text"],
        input[type="url"],
        textarea {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            font-family: inherit;
            transition: border-color 0.3s ease;
        }

        input[type="text"]:focus,
        input[type="url"]:focus,
        textarea:focus {
            outline: none;
            border-color: #667eea;
        }

        textarea {
            resize: vertical;
            min-height: 80px;
        }

        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 25px;
        }

        button {
            flex: 1;
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-generate {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-generate:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-download {
            background: #f5f5f5;
            color: #333;
        }

        .btn-download:hover {
            background: #e0e0e0;
        }

        .btn-download:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .preview-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .preview-box {
            width: 100%;
            max-width: 300px;
            aspect-ratio: 1;
            background: #f9f9f9;
            border: 2px dashed #e0e0e0;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
        }

        .preview-box img {
            max-width: 100%;
            max-height: 100%;
            display: none;
        }

        .preview-box img.visible {
            display: block;
        }

        .preview-placeholder {
            text-align: center;
            color: #999;
        }

        .preview-placeholder svg {
            width: 60px;
            height: 60px;
            margin-bottom: 15px;
            opacity: 0.3;
        }

        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f0f0f0;
            border-top-color: #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            display: none;
        }

        .loading-spinner.show {
            display: block;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .info-box {
            background: #f5f7ff;
            border: 1px solid #dde5ff;
            border-radius: 8px;
            padding: 12px 15px;
            font-size: 13px;
            color: #555;
            margin-top: 15px;
        }

        .error-message {
            background: #ffe5e5;
            border: 1px solid #ffcccc;
            border-radius: 8px;
            padding: 12px 15px;
            font-size: 13px;
            color: #d32f2f;
            margin-top: 15px;
            display: none;
        }

        .error-message.show {
            display: block;
        }

        .success-message {
            background: #e8f5e9;
            border: 1px solid #c8e6c9;
            border-radius: 8px;
            padding: 12px 15px;
            font-size: 13px;
            color: #2e7d32;
            margin-top: 15px;
            display: none;
        }

        .success-message.show {
            display: block;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="section">
            <h1>🎯 Gerador QR Code</h1>
            <p class="subtitle">Crie QR codes em segundos</p>

            <div class="tabs">
                <button class="tab-btn active" onclick="switchTab('text')">Texto</button>
                <button class="tab-btn" onclick="switchTab('url')">URL</button>
            </div>

            <div id="text" class="tab-content active">
                <div class="form-group">
                    <label>Seu Texto</label>
                    <textarea id="textInput" placeholder="Digite o texto...">Olá Mundo</textarea>
                </div>
                <div class="info-box">💡 Máximo de 2953 caracteres</div>
            </div>

            <div id="url" class="tab-content">
                <div class="form-group">
                    <label>URL do Site</label>
                    <input type="url" id="urlInput" placeholder="https://seu-site.com" value="https://exemplo.com">
                </div>
                <div class="info-box">🔗 Cole qualquer link</div>
            </div>

            <div class="error-message" id="errorMessage"></div>
            <div class="success-message" id="successMessage">✓ QR Code gerado!</div>

            <div class="button-group">
                <button class="btn-generate" onclick="generateQR()">Gerar QR Code</button>
                <button class="btn-download" id="downloadBtn" onclick="downloadQR()" disabled>Baixar</button>
            </div>
        </div>

        <div class="section preview-section">
            <h2 style="color: #333; font-size: 16px; margin-bottom: 20px;">Visualização</h2>
            <div class="preview-box" id="previewBox">
                <div class="loading-spinner" id="spinner"></div>
                <div class="preview-placeholder" id="placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    <p>QR Code aqui</p>
                </div>
                <img id="qrImage" alt="QR Code">
            </div>
        </div>
    </div>

    <script>
        let lastQRText = '';

        function switchTab(tabName) {
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');
        }

        function getQRText() {
            const activeTab = document.querySelector('.tab-content.active').id;
            return activeTab === 'text' 
                ? document.getElementById('textInput').value 
                : document.getElementById('urlInput').value;
        }

        async function generateQR() {
            const errorMsg = document.getElementById('errorMessage');
            const successMsg = document.getElementById('successMessage');
            const spinner = document.getElementById('spinner');
            const placeholder = document.getElementById('placeholder');
            const img = document.getElementById('qrImage');
            const downloadBtn = document.getElementById('downloadBtn');

            errorMsg.classList.remove('show');
            successMsg.classList.remove('show');

            const qrText = getQRText();

            if (!qrText) {
                errorMsg.textContent = '⚠️ Preencha o campo!';
                errorMsg.classList.add('show');
                return;
            }

            spinner.classList.add('show');
            placeholder.style.display = 'none';

            try {
                const url = '/gerar?texto=' + encodeURIComponent(qrText);
                img.src = url;
                lastQRText = qrText;

                img.onload = () => {
                    spinner.classList.remove('show');
                    img.classList.add('visible');
                    downloadBtn.disabled = false;
                    successMsg.classList.add('show');
                };

                img.onerror = () => {
                    spinner.classList.remove('show');
                    placeholder.style.display = 'block';
                    errorMsg.textContent = '❌ Erro ao gerar!';
                    errorMsg.classList.add('show');
                };
            } catch (error) {
                spinner.classList.remove('show');
                placeholder.style.display = 'block';
                errorMsg.textContent = '❌ Erro: ' + error.message;
                errorMsg.classList.add('show');
            }
        }

        function downloadQR() {
            if (!lastQRText) return;
            const link = document.createElement('a');
            link.href = document.getElementById('qrImage').src;
            link.download = 'qrcode.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        generateQR();
    </script>
</body>
</html>`

// Serve a interface na raiz
app.get('/', (req, res) => {
  res.type('text/html').send(htmlInterface)
})

// Gerar QR code
app.get('/gerar', async (req, res) => {
  try {
    const { texto } = req.query

    if (!texto) {
      return res.status(400).json({ erro: 'Falta parâmetro: texto' })
    }

    const buffer = await QRCode.toBuffer(texto, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 300
    })

    res.setHeader('Content-Type', 'image/png')
    res.send(buffer)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

module.exports = (req, res) => {
  app(req, res)
}
