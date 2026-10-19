/**
 * MindNext WhatsApp Background Gateway Server & Persistent Cron Engine
 * Powered by Baileys Multi-Device Engine
 * Runs locally on http://localhost:3001
 * Zero browser tabs needed - runs 100% in backend even when tab/browser is closed!
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
const DB_FILE = path.join(__dirname, 'cron_db.json');

// Ensure auth dir exists
if (!fs.existsSync(AUTH_DIR)) {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
}

// -------------------------------------------------------------
// PERSISTENT DATABASE ENGINE (cron_db.json)
// -------------------------------------------------------------
function loadCronDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      // sanitize defaults
      return {
        isRunning: Boolean(data.isRunning),
        isPaused: Boolean(data.isPaused),
        senderNumber: data.senderNumber || '+91 94290 66805',
        minDelay: data.minDelay || 120,
        maxDelay: data.maxDelay || 180,
        workStartHour: data.workStartHour || '09:00:00 AM',
        workEndHour: data.workEndHour || '09:00:00 PM',
        lunchBreakEnabled: data.lunchBreakEnabled !== undefined ? data.lunchBreakEnabled : true,
        lunchStartHour: data.lunchStartHour || '01:30:00 PM',
        lunchEndHour: data.lunchEndHour || '02:15:00 PM',
        batchBreakEnabled: data.batchBreakEnabled !== undefined ? data.batchBreakEnabled : true,
        batchMsgCount: data.batchMsgCount || 25,
        batchPauseMin: data.batchPauseMin || 15,
        campaignStartDate: data.campaignStartDate || new Date().toISOString().split('T')[0],
        campaignEndDate: data.campaignEndDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        sentToday: data.sentToday || 0,
        todayQuota: data.todayQuota || 250,
        currentBatchCount: data.currentBatchCount || 0,
        messageTemplate: data.messageTemplate || '{નમસ્તે|હેલો} {name} જી,\n\nMindNext Technologies તરફથી આપનું હાર્દિક સ્વાગત છે. અમારી નવી ક્લાઉડ અને આઈટી સર્વિસ અંગે આપને માહિતગાર કરવા આ સંદેશ પાઠવ્યો છે.\n\nઆપ વધુ વિગત માટે અમારી સાઇટ mindnext.in જોઈ શકો છો.\n\nઆભાર,\nMindNext Team',
        stopOptOut: data.stopOptOut !== undefined ? data.stopOptOut : true,
        contacts: Array.isArray(data.contacts) ? data.contacts : [],
        offDates: Array.isArray(data.offDates) ? data.offDates : [],
        dateSchedule: Array.isArray(data.dateSchedule) ? data.dateSchedule : [],
        nextTickTimestamp: null,
        targetRandomDelay: 150
      };
    }
  } catch (e) {
    console.error('Error loading cron_db.json:', e);
  }
  return {
    isRunning: false,
    isPaused: false,
    senderNumber: '+91 94290 66805',
    minDelay: 120,
    maxDelay: 180,
    workStartHour: '09:00:00 AM',
    workEndHour: '09:00:00 PM',
    lunchBreakEnabled: true,
    lunchStartHour: '01:30:00 PM',
    lunchEndHour: '02:15:00 PM',
    batchBreakEnabled: true,
    batchMsgCount: 25,
    batchPauseMin: 15,
    campaignStartDate: new Date().toISOString().split('T')[0],
    campaignEndDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    sentToday: 0,
    todayQuota: 250,
    currentBatchCount: 0,
    messageTemplate: '{નમસ્તે|હેલો} {name} જી,\n\nMindNext Technologies તરફથી આપનું હાર્દિક સ્વાગત છે. અમારી નવી ક્લાઉડ અને આઈટી સર્વિસ અંગે આપને માહિતગાર કરવા આ સંદેશ પાઠવ્યો છે.\n\nઆપ વધુ વિગત માટે અમારી સાઇટ mindnext.in જોઈ શકો છો.\n\nઆભાર,\nMindNext Team',
    stopOptOut: true,
    contacts: [],
    dateSchedule: [],
    nextTickTimestamp: null,
    targetRandomDelay: 150
  };
}

let cronDb = loadCronDb();

function saveCronDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(cronDb, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving cron_db.json:', e);
  }
}

// -------------------------------------------------------------
// WHATSAPP BAILEYS CLIENT STATE
// -------------------------------------------------------------
let sock = null;
let currentQr = null;
let currentQrDataUrl = null;
let connectionStatus = 'initializing'; // initializing, qr_ready, connecting, connected, disconnected
let connectedPhone = null;
let reconnectTimer = null;
let backendCronTimer = null;

// Activity logs in memory
const activityLogs = [];

function log(msg, type = 'info') {
  const time = new Date().toLocaleTimeString();
  const entry = { time, msg, type };
  console.log(`[${time}] [${type.toUpperCase()}] ${msg}`);
  activityLogs.push(entry);
  if (activityLogs.length > 250) activityLogs.shift();
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
      printQRInTerminal: false,
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

        // If cron was running before reconnect, continue it
        if (cronDb.isRunning && !cronDb.isPaused && !backendCronTimer) {
          log('બેકગ્રાઉન્ડ ક્રોન ચાલુ અવસ્થામાં છે - શેડ્યુલર સક્રિય કર્યું.', 'info');
          scheduleNextBackendTick();
        }
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
    clean = '91' + clean;
  }
  return clean + '@s.whatsapp.net';
}

// -------------------------------------------------------------
// BACKEND CRON ENGINE (RUNS HEADLESSLY EVEN IF TABS ARE CLOSED)
// -------------------------------------------------------------
function calculateRandomDelay(min, max) {
  min = Math.max(5, parseInt(min, 10) || 120);
  max = Math.max(min, parseInt(max, 10) || 180);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parseTimeString(tStr) {
  if (!tStr) return null;
  const parts = tStr.trim().split(' ');
  const timeParts = parts[0].split(':');
  let h = parseInt(timeParts[0], 10);
  const m = parseInt(timeParts[1], 10);
  const isPm = (parts[1] || '').toUpperCase() === 'PM';
  if (isPm && h < 12) h += 12;
  if (!isPm && h === 12) h = 0;
  return h * 60 + m;
}

function isWithinWorkHours() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const startM = parseTimeString(cronDb.workStartHour) ?? (9 * 60);
  const endM = parseTimeString(cronDb.workEndHour) ?? (21 * 60);

  if (currentMinutes < startM || currentMinutes >= endM) {
    return { ok: false, reason: 'કામકાજના કલાકો (Work Hours: 9 AM - 9 PM) ની બહાર છે.' };
  }

  if (cronDb.lunchBreakEnabled) {
    const lStart = parseTimeString(cronDb.lunchStartHour) ?? (13 * 60 + 30);
    const lEnd = parseTimeString(cronDb.lunchEndHour) ?? (14 * 60 + 15);
    if (currentMinutes >= lStart && currentMinutes < lEnd) {
      return { ok: false, reason: 'બપોરનો લંચ બ્રેક ચાલુ છે.' };
    }
  }

  return { ok: true };
}

function composeMessage(template, contact, addStopOptOut) {
  let text = template || '';
  text = text.replace(/\{name\}/gi, contact.name || 'ગ્રાહક');
  text = text.replace(/\{phone\}/gi, contact.phone || '');

  // Spintax {A|B|C}
  text = text.replace(/\{([^{}]+)\}/g, (match, choices) => {
    const arr = choices.split('|');
    return arr[Math.floor(Math.random() * arr.length)];
  });

  if (addStopOptOut) {
    text += '\n\n---\nજો આપ આ મેસેજ ફરી ન મેળવવા માંગતા હોવ તો STOP લખી મોકલો.';
  }
  return text;
}

function scheduleNextBackendTick() {
  clearTimeout(backendCronTimer);
  backendCronTimer = null;

  if (!cronDb.isRunning || cronDb.isPaused) return;

  // 1. Off-Dates check (Holidays / Skip days)
  const todayStr = new Date().toISOString().split('T')[0];
  if (Array.isArray(cronDb.offDates) && cronDb.offDates.includes(todayStr)) {
    log(`⏸️ આજે રજાનો દિવસ (Off Day: ${todayStr}) હોવાથી ક્રોન થોભાયેલ છે. આવતીકાલે સવારે ફરી તપાસ થશે.`, 'warn');
    cronDb.nextTickTimestamp = Date.now() + 3600000;
    saveCronDb();
    backendCronTimer = setTimeout(scheduleNextBackendTick, 3600000);
    return;
  }

  // 2. Campaign End Date check
  if (cronDb.campaignEndDate && todayStr > cronDb.campaignEndDate) {
    log(`🏁 ક્રોન નિર્ધારિત અંતિમ તારીખ (${cronDb.campaignEndDate}) સુધી પહોંચી ગયો છે! અભિયાન પૂર્ણ થયું.`, 'success');
    cronDb.isRunning = false;
    cronDb.nextTickTimestamp = null;
    saveCronDb();
    return;
  }

  // 3. Quota check
  if (cronDb.sentToday >= cronDb.todayQuota) {
    log(`🎉 આજનો દૈનિક ટાર્ગેટ (${cronDb.todayQuota}) સફળતાપૂર્વક પૂર્ણ થયો!`, 'success');
    cronDb.isRunning = false;
    cronDb.nextTickTimestamp = null;
    saveCronDb();
    return;
  }

  // 4. Pending contact check
  const nextContact = cronDb.contacts.find(c => c.status === 'pending');
  if (!nextContact) {
    log('🎉 કતારમાં રહેલા બધા જ કોન્ટેક્ટ્સ પ્રોસેસ થઈ ગયા છે!', 'success');
    cronDb.isRunning = false;
    cronDb.nextTickTimestamp = null;
    saveCronDb();
    return;
  }

  // 5. Work hours check
  const hoursCheck = isWithinWorkHours();
  if (!hoursCheck.ok) {
    log(`⏳ ક્રોન પોઝ: ${hoursCheck.reason}. ૧ મિનિટ પછી ફરી પ્રયાસ કરીશું...`, 'warn');
    cronDb.nextTickTimestamp = Date.now() + 60000;
    saveCronDb();
    backendCronTimer = setTimeout(scheduleNextBackendTick, 60000);
    return;
  }

  // 6. Batch break check
  if (cronDb.batchBreakEnabled && cronDb.currentBatchCount >= cronDb.batchMsgCount) {
    const pauseMin = cronDb.batchPauseMin || 15;
    const pauseMs = pauseMin * 60 * 1000;
    log(`☕ બેચ પોઝ: ${cronDb.batchMsgCount} મેસેજ પૂરા થયા. ${pauseMin} મિનિટનો આરામ...`, 'info');
    cronDb.currentBatchCount = 0;
    cronDb.nextTickTimestamp = Date.now() + pauseMs;
    saveCronDb();
    backendCronTimer = setTimeout(scheduleNextBackendTick, pauseMs);
    return;
  }

  // 7. Random Delay Jitter
  const delaySec = calculateRandomDelay(cronDb.minDelay, cronDb.maxDelay);
  cronDb.targetRandomDelay = delaySec;
  cronDb.nextTickTimestamp = Date.now() + (delaySec * 1000);
  saveCronDb();

  log(`⏱️ આગામી મેસેજ ${nextContact.name} (${nextContact.phone}) ને ${delaySec} સેકન્ડમાં જશે (રેન્ડમ ડિલે)...`, 'info');

  backendCronTimer = setTimeout(async () => {
    if (!cronDb.isRunning || cronDb.isPaused) return;

    try {
      const jid = formatPhoneToJid(nextContact.phone);
      const msgText = composeMessage(cronDb.messageTemplate, nextContact, cronDb.stopOptOut);

      log(`⚡ [બેકગ્રાઉન્ડ ઓટો-મોકલ] ${nextContact.name} (${jid})...`, 'info');

      if (connectionStatus === 'connected' && sock) {
        const result = await sock.sendMessage(jid, { text: msgText });
        const messageId = result?.key?.id || ('MN_' + Date.now());

        nextContact.status = 'sent';
        nextContact.sentAt = new Date().toLocaleTimeString();
        nextContact.messageId = messageId;
        cronDb.sentToday++;
        cronDb.currentBatchCount++;

        log(`✅ [ડિલિવર સફળ] ${nextContact.name} (${nextContact.phone}) - પ્રગતિ: ${cronDb.sentToday}/${cronDb.todayQuota} (ID: ${messageId})`, 'success');
      } else {
        log(`⚠️ WhatsApp કનેક્ટેડ નથી! મેસેજ સ્કીપ કરવામાં આવ્યો.`, 'error');
        nextContact.status = 'failed';
        nextContact.errorMsg = 'WhatsApp socket disconnected';
      }
    } catch (err) {
      log(`❌ મોકલવામાં નિષ્ફળ (${nextContact.phone}): ${err.message}`, 'error');
      nextContact.status = 'failed';
      nextContact.errorMsg = err.message;
    }

    saveCronDb();
    scheduleNextBackendTick();
  }, delaySec * 1000);
}

function startBackendCron() {
  if (cronDb.isRunning && !cronDb.isPaused) {
    return { success: false, error: 'ક્રોન પહેલેથી જ બેકગ્રાઉન્ડમાં સક્રિય (RUNNING) છે! એક સાથે બે ક્રોન ચલાવી શકાતા નથી.' };
  }
  if (cronDb.contacts.filter(c => c.status === 'pending').length === 0) {
    return { success: false, error: 'કતારમાં કોઈ બાકી (pending) કોન્ટેક્ટ્સ નથી!' };
  }
  cronDb.isRunning = true;
  cronDb.isPaused = false;
  saveCronDb();
  log(`▶️ બેકગ્રાઉન્ડ ક્રોન એન્જિન શરૂ થયું! મોકલનાર: ${cronDb.senderNumber} (Zero-Tab Mode)`, 'success');
  scheduleNextBackendTick();
  return { success: true, isRunning: true };
}

function stopBackendCron() {
  cronDb.isRunning = false;
  cronDb.isPaused = false;
  cronDb.nextTickTimestamp = null;
  clearTimeout(backendCronTimer);
  backendCronTimer = null;
  saveCronDb();
  log('⏸️ બેકગ્રાઉન્ડ ક્રોન થોભાવવામાં આવ્યો.', 'warn');
  return { success: true, isRunning: false };
}

// -------------------------------------------------------------
// HTTP SERVER (CORS, REST API, & DASHBOARD)
// -------------------------------------------------------------
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
      service: 'MindNext WhatsApp Background Gateway & Cron Engine',
      port: PORT,
      connectionStatus,
      connectedPhone: connectedPhone ? `+${connectedPhone}` : null,
      hasQr: Boolean(currentQrDataUrl),
      qrDataUrl: currentQrDataUrl,
      cronRunning: cronDb.isRunning,
      sentToday: cronDb.sentToday,
      todayQuota: cronDb.todayQuota,
      totalContacts: cronDb.contacts.length,
      pendingContacts: cronDb.contacts.filter(c => c.status === 'pending').length,
      logs: activityLogs.slice(-25)
    }));
    return;
  }

  // 2. CRON DATABASE GET STATE API
  if (req.method === 'GET' && pathname === '/api/cron/state') {
    const remainingSec = cronDb.nextTickTimestamp 
      ? Math.max(0, Math.round((cronDb.nextTickTimestamp - Date.now()) / 1000))
      : 0;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      state: cronDb,
      connectionStatus,
      connectedPhone: connectedPhone ? `+${connectedPhone}` : null,
      remainingSec
    }));
    return;
  }

  // 3. CRON DATABASE SYNC / SAVE API
  if (req.method === 'POST' && pathname === '/api/cron/sync') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');

        // Merge incoming payload
        if (Array.isArray(payload.contacts)) cronDb.contacts = payload.contacts;
        if (payload.senderNumber) cronDb.senderNumber = payload.senderNumber;
        if (payload.minDelay !== undefined) cronDb.minDelay = parseInt(payload.minDelay, 10);
        if (payload.maxDelay !== undefined) cronDb.maxDelay = parseInt(payload.maxDelay, 10);
        if (payload.workStartHour) cronDb.workStartHour = payload.workStartHour;
        if (payload.workEndHour) cronDb.workEndHour = payload.workEndHour;
        if (payload.lunchBreakEnabled !== undefined) cronDb.lunchBreakEnabled = Boolean(payload.lunchBreakEnabled);
        if (payload.lunchStartHour) cronDb.lunchStartHour = payload.lunchStartHour;
        if (payload.lunchEndHour) cronDb.lunchEndHour = payload.lunchEndHour;
        if (payload.batchBreakEnabled !== undefined) cronDb.batchBreakEnabled = Boolean(payload.batchBreakEnabled);
        if (payload.batchMsgCount !== undefined) cronDb.batchMsgCount = parseInt(payload.batchMsgCount, 10);
        if (payload.batchPauseMin !== undefined) cronDb.batchPauseMin = parseInt(payload.batchPauseMin, 10);
        if (payload.campaignStartDate) cronDb.campaignStartDate = payload.campaignStartDate;
        if (payload.campaignEndDate) cronDb.campaignEndDate = payload.campaignEndDate;
        if (payload.todayQuota !== undefined) cronDb.todayQuota = parseInt(payload.todayQuota, 10);
        if (payload.messageTemplate !== undefined) cronDb.messageTemplate = payload.messageTemplate;
        if (payload.stopOptOut !== undefined) cronDb.stopOptOut = Boolean(payload.stopOptOut);
        if (Array.isArray(payload.offDates)) cronDb.offDates = payload.offDates;
        if (Array.isArray(payload.dateSchedule)) cronDb.dateSchedule = payload.dateSchedule;

        saveCronDb();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Database saved successfully', state: cronDb }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // 4. CRON START API
  if (req.method === 'POST' && pathname === '/api/cron/start') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        if (cronDb.isRunning && !cronDb.isPaused && backendCronTimer) {
          res.writeHead(409, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: false, 
            error: 'ક્રોન પહેલેથી જ બેકગ્રાઉન્ડમાં સક્રિય (RUNNING) છે! એક સાથે બે ક્રોન શરૂ કરી શકાતા નથી.' 
          }));
          return;
        }

        const payload = JSON.parse(body || '{}');
        if (Array.isArray(payload.contacts) && payload.contacts.length > 0) {
          cronDb.contacts = payload.contacts;
        }
        if (payload.messageTemplate) cronDb.messageTemplate = payload.messageTemplate;
        if (Array.isArray(payload.offDates)) cronDb.offDates = payload.offDates;
        if (payload.todayQuota) cronDb.todayQuota = parseInt(payload.todayQuota, 10);
        if (payload.campaignStartDate) cronDb.campaignStartDate = payload.campaignStartDate;
        if (payload.campaignEndDate) cronDb.campaignEndDate = payload.campaignEndDate;
        saveCronDb();

        const result = startBackendCron();
        res.writeHead(result.success ? 200 : 400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // 5. CRON STOP API
  if (req.method === 'POST' && pathname === '/api/cron/stop') {
    const result = stopBackendCron();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
    return;
  }

  // 6. CLEAR SENT CONTACTS API
  if (req.method === 'POST' && pathname === '/api/cron/clear-sent') {
    cronDb.contacts = cronDb.contacts.filter(c => c.status !== 'sent');
    saveCronDb();
    log('મોકલાઈ ગયેલા કોન્ટેક્ટ્સ ડેટાબેઝમાંથી સાફ કર્યા.', 'info');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, contacts: cronDb.contacts }));
    return;
  }

  // 7. CLEAR ALL CONTACTS API
  if (req.method === 'POST' && pathname === '/api/cron/clear-all') {
    cronDb.contacts = [];
    stopBackendCron();
    saveCronDb();
    log('બધી કતાર ડેટાબેઝમાંથી સાફ કરી.', 'warn');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, contacts: [] }));
    return;
  }

  // 8. REMOVE SINGLE CONTACT API
  if (req.method === 'POST' && pathname === '/api/cron/remove-contact') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { phone, index } = JSON.parse(body || '{}');
        if (phone) {
          cronDb.contacts = cronDb.contacts.filter(c => c.phone.replace(/[^0-9]/g, '') !== phone.toString().replace(/[^0-9]/g, ''));
        } else if (index !== undefined) {
          cronDb.contacts.splice(index, 1);
        }
        saveCronDb();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, contacts: cronDb.contacts }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // 9. Direct Single Background Send API (for 🧪 Single Test button)
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
        log(`સિંગલ મેસેજ મોકલી રહ્યા છીએ: ${jid} (મોકલનાર: ${sender || connectedPhone || 'Default'})`, 'info');

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

  // 10. Web UI Dashboard on http://localhost:3001/
  if (req.method === 'GET' && (pathname === '/' || pathname === '/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderWebDashboard());
    return;
  }

  // 11. Logout / Reset Session API
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
    .stat-row {
      display: flex;
      gap: 12px;
      margin-top: 15px;
      justify-content: center;
    }
    .stat-box {
      background: rgba(255,255,255,0.04);
      padding: 10px 16px;
      border-radius: 10px;
      border: 1px solid var(--border);
      text-align: center;
    }
    .stat-val { font-size: 1.2rem; font-weight: 700; color: #fff; }
    .stat-lbl { font-size: 0.72rem; color: var(--muted); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚡ MindNext WhatsApp Background Gateway & Cron Engine</h1>
      <p>Zero Browser Tabs • Persistent Database (cron_db.json) • Port 3001</p>
    </div>

    <div class="card" style="text-align: center;">
      <div id="statusContainer">
        <p>કનેક્શન સ્ટેટસ તપાસી રહ્યા છીએ...</p>
      </div>

      <div class="stat-row">
        <div class="stat-box">
          <div class="stat-val" id="cronStatusText">IDLE</div>
          <div class="stat-lbl">ક્રોન સ્થિતિ</div>
        </div>
        <div class="stat-box">
          <div class="stat-val" id="sentTodayCount">0 / 250</div>
          <div class="stat-lbl">આજે મોકલેલ મેસેજ</div>
        </div>
        <div class="stat-box">
          <div class="stat-val" id="pendingCount">0</div>
          <div class="stat-lbl">કતારમાં બાકી</div>
        </div>
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
        <h3 style="color: #25d366; font-size: 1.2rem; margin-bottom: 8px;">🎉 WhatsApp સફળતાપૂર્વક કનેક્ટેડ છે!</h3>
        <p style="color: var(--muted); font-size: 0.88rem; margin-bottom: 15px;">
          હવે <strong>mindnext.in/marketing</strong> પરથી ક્રોન ચાલુ કરીને તમે <strong>બ્રાઉઝર ટેબ બંધ કરી દેશો તો પણ</strong> બેકગ્રાઉન્ડ સર્વરમાંથી આપમેળે મેસેજ જવાનું ચાલુ રહેશે.
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

        document.getElementById('cronStatusText').textContent = data.cronRunning ? '🟢 RUNNING' : 'IDLE';
        document.getElementById('sentTodayCount').textContent = data.sentToday + ' / ' + data.todayQuota;
        document.getElementById('pendingCount').textContent = data.pendingContacts + ' બાકી';

        if (data.connectionStatus === 'connected') {
          statusContainer.innerHTML = '<span class="status-badge status-connected">🟢 ઓનલાઈન & કનેક્ટેડ: ' + (data.connectedPhone || 'WhatsApp') + '</span>';
          qrContainer.style.display = 'none';
          connectedContainer.style.display = 'block';
        } else if (data.hasQr) {
          statusContainer.innerHTML = '<span class="status-badge status-qr">📲 QR કોડ સ્કેનની રાહ જોવાઈ રહી છે</span>';
          qrContainer.style.display = 'block';
          connectedContainer.style.display = 'none';
          if (data.qrDataUrl) {
            document.getElementById('qrImage').src = data.qrDataUrl;
          }
        } else {
          statusContainer.innerHTML = '<span class="status-badge status-qr">⏳ કનેક્શન સ્થિતિ: ' + data.connectionStatus + '</span>';
          qrContainer.style.display = 'none';
          connectedContainer.style.display = 'none';
        }

        const logBox = document.getElementById('logBox');
        logBox.innerHTML = data.logs.map(l => '<div class="log-line ' + l.type + '">[' + l.time + '] ' + l.msg + '</div>').join('');
        logBox.scrollTop = logBox.scrollHeight;
      } catch (err) {
        document.getElementById('statusContainer').innerHTML = '<span class="status-badge" style="background:#ff4757; color:#fff;">🔴 સર્વર ઓફલાઈન છે</span>';
      }
    }

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
  console.log(` ⚡ MindNext WhatsApp Background Gateway & Cron Engine RUNNING!`);
  console.log(` 🌐 Gateway Dashboard: http://localhost:${PORT}`);
  console.log(` 📡 Status API: http://localhost:${PORT}/api/status`);
  console.log(` 🗄️ Database: ${DB_FILE}`);
  console.log(` 🛡️ Zero Tabs Active for https://mindnext.in/marketing`);
  console.log('================================================================');
  log('Gateway Server શરૂ થયું. Baileys સોકેટ ઇનિશિયલાઇઝ થઈ રહ્યું છે...', 'info');
  startWhatsAppSocket();
});
