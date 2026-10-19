/**
 * MindNext WhatsApp Background Gateway Server
 * Powered by Baileys Multi-Device Engine
 * Runs locally on http://localhost:3001
 * Zero browser tabs needed - sends 100% in background.
 */

const http = require('http');
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');
const qrcodeTerminal = require('qrcode-terminal');
const pino = require('pino');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');

const PORT = 3001;
const AUTH_DIR = path.join(__dirname, 'session_auth');

// Ensure auth dir exists
if (!fs.existsSync(AUTH_DIR)) {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
}

let sock = null;
let currentQr = null;
let currentQrDataUrl = null;
let connectionStatus = 'initializing'; // initializing, qr_ready, connecting, connected, disconnected
let connectedPhone = null;
let reconnectTimer = null;

// Activity logs in memory
const activityLogs = [];

function log(msg, type = 'info') {
  const time = new Date().toLocaleTimeString();
  const entry = { time, msg, type };
  console.log(`[${time}] [${type.toUpperCase()}] ${msg}`);
  activityLogs.push(entry);
  if (activityLogs.length > 200) activityLogs.shift();
}

/**
 * Initialize or reconnect Baileys WhatsApp MultiDevice socket
 */
async function startWhatsAppSocket() {
  try {
    connectionStatus = 'connecting';
    log('WhatsApp સોકેટ શરૂ થઈ રહ્યું છે...', 'info');

    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
    const { version, isLatest } = await fetchLatestBaileysVersion();
    log(`Baileys WA વર્ઝન: ${version.join('.')} (Latest: ${isLatest})`, 'info');

    sock = makeWASocket({
      version,
      logger: pino({ level: 'silent' }),
      auth: state,
      printQRInTerminal: false, // We'll handle custom terminal & web QR
      browser: ['MindNext Marketing', 'Chrome', '1.0.0'],
      syncFullHistory: false
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        currentQr = qr;
        connectionStatus = 'qr_ready';
        try {
          currentQrDataUrl = await QRCode.toDataURL(qr, { scale: 6, margin: 2 });
        } catch (e) {
          log('QR Data URL એરર: ' + e.message, 'error');
        }

        console.log('\n================================================================');
        console.log(' 📲 કૃપા કરીને નીચેનો WhatsApp QR કોડ સ્કેન કરો:');
        console.log('    Settings -> Linked Devices -> Link a Device');
        console.log('    અથવા બ્રાઉઝરમાં ખોલો: http://localhost:3001');
        console.log('================================================================\n');
        qrcodeTerminal.generate(qr, { small: true });
        log('નવો QR કોડ જનરેટ થયો. સ્કેન માટે તૈયાર છે.', 'info');
      }

      if (connection === 'close') {
        currentQr = null;
        currentQrDataUrl = null;
        const statusCode = (lastDisconnect?.error)?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        connectionStatus = 'disconnected';
        connectedPhone = null;

        log(`કનેક્શન બંધ થયું: ${lastDisconnect?.error?.message || 'Unknown reason'} (Code: ${statusCode})`, 'warn');

        if (statusCode === DisconnectReason.loggedOut) {
          log('યુઝર લોગ આઉટ થયા. ઓથ ડેટા ક્લિયર થઈ રહ્યો છે...', 'warn');
          try {
            fs.rmSync(AUTH_DIR, { recursive: true, force: true });
            fs.mkdirSync(AUTH_DIR, { recursive: true });
          } catch (e) {}
          startWhatsAppSocket();
        } else if (shouldReconnect) {
          log('૫ સેકન્ડમાં ફરીથી કનેક્ટ કરવાનો પ્રયાસ કરી રહ્યા છીએ...', 'info');
          clearTimeout(reconnectTimer);
          reconnectTimer = setTimeout(startWhatsAppSocket, 5000);
        }
      } else if (connection === 'open') {
        connectionStatus = 'connected';
        currentQr = null;
        currentQrDataUrl = null;

        const rawUser = sock?.user?.id || '';
        connectedPhone = rawUser.split(':')[0].replace(/[^0-9]/g, '');
        log(`🎉 WhatsApp સાથે સફળતાપૂર્વક કનેક્ટ થયું! નંબર: +${connectedPhone}`, 'success');
      }
    });

  } catch (err) {
    log('WhatsApp Socket પ્રારંભમાં ભૂલ: ' + err.message, 'error');
    connectionStatus = 'disconnected';
    clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(startWhatsAppSocket, 8000);
  }
}

/**
 * Format phone number to WhatsApp JID
 */
function formatPhoneToJid(phone) {
  let clean = (phone || '').toString().replace(/[^0-9]/g, '');
  if (clean.length === 10) {
    clean = '91' + clean; // Default to India
  }
  return clean + '@s.whatsapp.net';
}

/**
 * HTTP Server handling CORS, /api/status, /api/send, and Web UI
 */
const server = http.createServer(async (req, res) => {
  // CORS Headers for mindnext.in
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3001'}`);
  const pathname = reqUrl.pathname;

  // 1. Health & Status API
  if (req.method === 'GET' && pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      service: 'MindNext WhatsApp Background Gateway Engine',
      port: PORT,
      connectionStatus,
      connectedPhone: connectedPhone ? `+${connectedPhone}` : null,
      hasQr: Boolean(currentQrDataUrl),
      qrDataUrl: currentQrDataUrl,
      logs: activityLogs.slice(-20)
    }));
    return;
  }

  // 2. Direct Background Send API
  if (req.method === 'POST' && pathname === '/api/send') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { phone, message, sender, simulate } = payload;

        if (!phone || !message) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Phone number and message text are required' }));
          return;
        }

        const cleanPhone = phone.toString().replace(/[^0-9]/g, '');

        // If simulation requested or dry-run
        if (simulate) {
          log(`[સિમ્યુલેશન] ${cleanPhone} પર મેસેજ મોકલાયો`, 'info');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            simulated: true,
            phone: cleanPhone,
            messageId: 'SIM_' + Date.now(),
            sentAt: new Date().toISOString()
          }));
          return;
        }

        // Check if WhatsApp socket is ready
        if (connectionStatus !== 'connected' || !sock) {
          log(`ડિસ્પેચ નિષ્ફળ: WhatsApp કનેક્ટેડ નથી (Status: ${connectionStatus})`, 'error');
          res.writeHead(503, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: 'WhatsApp લિંક થયેલ નથી! કૃપા કરીને http://localhost:3001 પર જઈને તમારા મોબાઈલથી QR કોડ સ્કેન કરો.',
            connectionStatus,
            hasQr: Boolean(currentQrDataUrl)
          }));
          return;
        }

        const jid = formatPhoneToJid(phone);
        log(`ઓટો-મેસેજ મોકલી રહ્યા છીએ: ${jid} (મોકલનાર: ${sender || connectedPhone || 'Default'})`, 'info');

        // Real WhatsApp dispatch via Baileys MultiDevice socket
        const result = await sock.sendMessage(jid, { text: message });
        const messageId = result?.key?.id || ('MN_' + Date.now());

        log(`✅ મેસેજ સફળતાપૂર્વક ડિલિવર થયો! Recipient: ${jid} (ID: ${messageId})`, 'success');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          phone: cleanPhone,
          messageId,
          sentAt: new Date().toISOString(),
          status: 'delivered'
        }));

      } catch (err) {
        log(`મોકલવામાં એરર: ${err.message}`, 'error');
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // 3. Web UI Dashboard on http://localhost:3001/
  if (req.method === 'GET' && (pathname === '/' || pathname === '/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderWebDashboard());
    return;
  }

  // 4. Logout / Reset API
  if (req.method === 'POST' && pathname === '/api/logout') {
    try {
      if (sock) {
        try { await sock.logout(); } catch (e) {}
      }
      fs.rmSync(AUTH_DIR, { recursive: true, force: true });
      fs.mkdirSync(AUTH_DIR, { recursive: true });
      log('WhatsApp સત્ર રીસેટ કરવામાં આવ્યું.', 'warn');
      startWhatsAppSocket();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Logged out successfully' }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

function renderWebDashboard() {
  return `<!DOCTYPE html>
<html lang="gu">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MindNext WhatsApp Gateway | Zero-Tab Background Engine</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090e17;
      --card-bg: #111a2e;
      --border: #1e2c4a;
      --green: #25d366;
      --text: #f0f4fc;
      --muted: #8a99b5;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', sans-serif;
      padding: 30px 20px;
      display: flex;
      justify-content: center;
    }
    .container {
      max-width: 800px;
      width: 100%;
    }
    .header {
      text-align: center;
      margin-bottom: 25px;
    }
    .header h1 {
      font-size: 1.6rem;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .header p {
      color: var(--muted);
      font-size: 0.9rem;
      margin-top: 5px;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .status-connected {
      background: rgba(37, 211, 102, 0.15);
      color: #25d366;
      border: 1px solid rgba(37, 211, 102, 0.4);
    }
    .status-qr {
      background: rgba(255, 170, 0, 0.15);
      color: #ffaa00;
      border: 1px solid rgba(255, 170, 0, 0.4);
    }
    .qr-box {
      text-align: center;
      padding: 20px;
      background: #ffffff;
      border-radius: 12px;
      display: inline-block;
      margin: 15px auto;
    }
    .qr-box img {
      width: 240px;
      height: 240px;
      display: block;
    }
    .steps {
      background: rgba(255,255,255,0.03);
      padding: 15px;
      border-radius: 10px;
      margin-top: 15px;
      font-size: 0.85rem;
      line-height: 1.6;
    }
    .steps ol { margin-left: 20px; }
    .btn {
      background: var(--green);
      color: #000;
      font-weight: 700;
      border: none;
      padding: 10px 18px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.88rem;
    }
    .btn-danger {
      background: #ff4757;
      color: #fff;
    }
    .console-logs {
      background: #05080e;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.78rem;
      max-height: 220px;
      overflow-y: auto;
      color: #a8b8d0;
    }
    .log-line { margin-bottom: 4px; }
    .log-line.success { color: #25d366; }
    .log-line.error { color: #ff5252; }
    .log-line.warn { color: #ffb142; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚡ MindNext WhatsApp Background Gateway</h1>
      <p>Zero Browser Tabs • Pure Background Auto-Delivery • Port 3001</p>
    </div>

    <div class="card" style="text-align: center;">
      <div id="statusContainer">
        <!-- Replaced dynamically via JS -->
        <p>કનેક્શન સ્ટેટસ તપાસી રહ્યા છીએ...</p>
      </div>

      <div id="qrContainer" style="display: none; margin-top: 15px;">
        <h3 style="color: #ffaa00; font-size: 1.1rem; margin-bottom: 8px;">📲 WhatsApp લિંક કરવા માટે QR કોડ સ્કેન કરો:</h3>
        <div class="qr-box">
          <img id="qrImage" src="" alt="WhatsApp QR Code">
        </div>
        <div class="steps">
          <strong>સ્કેન કરવાની રીત:</strong>
          <ol>
            <li>તમારા મોબાઈલમાં WhatsApp ખોલો.</li>
            <li><strong>Settings</strong> (અથવા ત્રણ ટપકાં) -> <strong>Linked Devices</strong> પર જાઓ.</li>
            <li><strong>Link a Device</strong> બટન દબાવી ઉપરનો QR કોડ સ્કેન કરો.</li>
          </ol>
        </div>
      </div>

      <div id="connectedContainer" style="display: none; margin-top: 15px;">
        <h3 style="color: #25d366; font-size: 1.2rem; margin-bottom: 10px;">🎉 WhatsApp સફળતાપૂર્વક કનેક્ટેડ છે!</h3>
        <p style="color: var(--muted); font-size: 0.9rem; margin-bottom: 15px;">
          હવે <strong>mindnext.in/marketing</strong> પરથી મોકલાતા તમામ મેસેજ કોઈ પણ બ્રાઉઝર ટેબ ખોલ્યા વગર બેકગ્રાઉન્ડમાંથી સીધા આ નંબર પરથી આપોઆપ ડિલિવર થશે.
        </p>
        <button class="btn btn-danger" onclick="logoutSession()">સત્ર લોગઆઉટ / રીસેટ કરો</button>
      </div>
    </div>

    <!-- Live Test Form -->
    <div class="card">
      <h3 style="font-size: 1rem; margin-bottom: 12px; color: #fff;">🧪 સિંગલ ટેસ્ટ મેસેજ મોકલો (Zero Tabs)</h3>
      <div style="display: flex; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
        <input type="text" id="testPhone" placeholder="દા.ત. 919825012345" style="flex: 1; min-width: 200px; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 8px; color: #fff;">
        <input type="text" id="testMsg" value="નમસ્તે! આ MindNext Zero-Tab બેકગ્રાઉન્ડ એન્જિનનો ટેસ્ટ મેસેજ છે." style="flex: 2; min-width: 260px; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 8px; color: #fff;">
        <button class="btn" onclick="sendTestMessage()">ટેસ્ટ મોકલો 🚀</button>
      </div>
      <div id="testResult" style="font-size: 0.82rem; margin-top: 5px;"></div>
    </div>

    <!-- Console Logs -->
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h3 style="font-size: 0.95rem; color: #fff;">📋 Gateway લાઈવ લૉગ્સ (Terminal Stream)</h3>
        <button class="btn" style="padding: 4px 10px; font-size: 0.75rem;" onclick="fetchStatus()">રીફ્રેશ</button>
      </div>
      <div class="console-logs" id="logBox"></div>
    </div>
  </div>

  <script>
    async function fetchStatus() {
      try {
        const res = await fetch('/api/status', { cache: 'no-cache' });
        const data = await res.json();

        const statusContainer = document.getElementById('statusContainer');
        const qrContainer = document.getElementById('qrContainer');
        const connectedContainer = document.getElementById('connectedContainer');

        if (data.connectionStatus === 'connected') {
          statusContainer.innerHTML = '<span class="status-badge status-connected">🟢 ઓનલાઈન & કનેક્ટેડ: ' + (data.connectedPhone || 'WhatsApp') + '</span>';
          qrContainer.style.display = 'none';
          connectedContainer.style.display = 'block';
        } else if (data.hasQr) {
          statusContainer.innerHTML = '<span class="status-badge status-qr">📲 QR કોડ સ્કેનની રાહ જોવાઈ રહી છે</span>';
          qrContainer.style.display = 'block';
          connectedContainer.style.display = 'none';
          // Fetch current QR
          if (data.qrDataUrl) {
            document.getElementById('qrImage').src = data.qrDataUrl;
          }
        } else {
          statusContainer.innerHTML = '<span class="status-badge status-qr">⏳ કનેક્શન સ્થિતિ: ' + data.connectionStatus + '</span>';
          qrContainer.style.display = 'none';
          connectedContainer.style.display = 'none';
        }

        // Render logs
        const logBox = document.getElementById('logBox');
        logBox.innerHTML = data.logs.map(l => '<div class="log-line ' + l.type + '">[' + l.time + '] ' + l.msg + '</div>').join('');
        logBox.scrollTop = logBox.scrollHeight;
      } catch (err) {
        document.getElementById('statusContainer').innerHTML = '<span class="status-badge" style="background:#ff4757; color:#fff;">🔴 સર્વર ઓફલાઈન છે</span>';
      }
    }

    // Refresh status every 3 seconds
    setInterval(fetchStatus, 3000);
    fetchStatus();

    async function sendTestMessage() {
      const phone = document.getElementById('testPhone').value.trim();
      const message = document.getElementById('testMsg').value.trim();
      const resEl = document.getElementById('testResult');
      if (!phone || !message) {
        resEl.innerHTML = '<span style="color:#ff5252;">કૃપા કરીને નંબર અને મેસેજ બંને દાખલ કરો!</span>';
        return;
      }
      resEl.innerHTML = '<span style="color:#ffaa00;">મોકલી રહ્યા છીએ...</span>';

      try {
        const res = await fetch('/api/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, message })
        });
        const d = await res.json();
        if (d.success) {
          resEl.innerHTML = '<span style="color:#25d366;">✅ સફળતાપૂર્વક ડિલિવર થયો! Message ID: ' + d.messageId + '</span>';
          fetchStatus();
        } else {
          resEl.innerHTML = '<span style="color:#ff5252;">❌ ભૂલ: ' + d.error + '</span>';
        }
      } catch (e) {
        resEl.innerHTML = '<span style="color:#ff5252;">❌ સર્વર એરર: ' + e.message + '</span>';
      }
    }

    async function logoutSession() {
      if (!confirm('શું તમે ખરેખર WhatsApp સત્ર લોગઆઉટ કરવા માંગો છો? ફરીથી QR સ્કેન કરવો પડશે.')) return;
      await fetch('/api/logout', { method: 'POST' });
      fetchStatus();
    }
  </script>
</body>
</html>`;
}

// Start server
server.listen(PORT, () => {
  console.log('================================================================');
  console.log(` ⚡ MindNext WhatsApp Background Gateway Server is RUNNING!`);
  console.log(` 🌐 Gateway Dashboard: http://localhost:${PORT}`);
  console.log(` 📡 Status API: http://localhost:${PORT}/api/status`);
  console.log(` 🚀 Send API: http://localhost:${PORT}/api/send`);
  console.log(` 🛡️ Zero Tabs Active for https://mindnext.in/marketing`);
  console.log('================================================================');
  log('Gateway Server શરૂ થયું. Baileys સોકેટ ઇનિશિયલાઇઝ થઈ રહ્યું છે...', 'info');
  startWhatsAppSocket();
});
