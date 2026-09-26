import 'dotenv/config';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 4173;
// Secret credentials loaded exclusively from .env (NEVER exposed to frontend)
const webhookSecret = process.env.WHATSTOOL_WEBHOOK_SECRET || process.env.VUCARE_WEBHOOK_SECRET || '';
const whatsToolApiKey = process.env.WHATSTOOL_API_KEY || '';
const whatsToolBaseUrl = process.env.WHATSTOOL_BASE_URL || 'https://api.whatstool.business';

// Firebase configuration for VU Care CRM (crm-demo-9a7ec) loaded from .env
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyCY7NEUAVwMtyrWN0NDnlAFQK-jFSVscnc',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'crm-demo-9a7ec.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'crm-demo-9a7ec',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'crm-demo-9a7ec.firebasestorage.app',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '324049179296',
  appId: process.env.FIREBASE_APP_ID || '1:324049179296:web:d5e31f0de4202e885dafc5',
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || 'G-ZEC93MBKC5'
};

console.log('🚀 Starting VU Care CRM Full-Stack Server...');
console.log('🔥 Connecting to Firestore project:', firebaseConfig.projectId);

let firebaseApp = null;
let firestoreDb = null;
let isFirestoreConnected = false;
let latestCloudState = null;

try {
  firebaseApp = initializeApp(firebaseConfig);
  firestoreDb = getFirestore(firebaseApp);
  isFirestoreConnected = true;
  console.log('✅ Server-side Firebase SDK initialized successfully.');

  // Subscribe to real-time changes in Firestore
  const stateDocRef = doc(firestoreDb, 'vucare_crm', 'state');
  onSnapshot(stateDocRef, (snap) => {
    if (snap.exists()) {
      latestCloudState = snap.data();
      const leadsCount = latestCloudState.leads ? latestCloudState.leads.length : 0;
      const jobsCount = latestCloudState.jobs ? latestCloudState.jobs.length : 0;
      console.log('⚡ [Cloud Sync] State updated: ' + leadsCount + ' leads, ' + jobsCount + ' jobs.');
    } else {
      console.log('ℹ [Cloud Sync] vucare_crm/state document does not exist yet.');
    }
  }, (err) => {
    console.warn('⚠️ [Cloud Sync] Firestore listener warning:', err.message);
  });
} catch (err) {
  console.error('❌ Failed to initialize server Firebase:', err.message);
}

// MIME types dictionary
// Idempotency cache: Set of recently received message IDs to prevent duplicate processing
const processedMessageIds = new Set();
function checkAndTrackMessageId(id) {
  if (!id) return false;
  if (processedMessageIds.has(id)) return true;
  processedMessageIds.add(id);
  if (processedMessageIds.size > 5000) {
    const first = processedMessageIds.values().next().value;
    processedMessageIds.delete(first);
  }
  return false;
}

function normalizePhone(rawPhone) {
  let cleaned = String(rawPhone || '').replace(/[^0-9]/g, '');
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.slice(1);
  }
  return cleaned;
}

const mimeTypes = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.mjs': 'text/javascript; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Helper to parse JSON body
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 10 * 1024 * 1024) {
        reject(new Error('Payload Too Large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

// Create HTTP Server
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const host = req.headers.host || 'localhost:' + PORT;
  const urlObj = new URL(req.url, 'http://' + host);
  const pathname = urlObj.pathname;

  // ------------------------------------
  // BACKEND REST APIs
  // ------------------------------------

  // 1. Health & Server Status
  if (pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      server: 'VU Care Real-time CRM Backend V1.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      firebase: {
        projectId: firebaseConfig.projectId,
        connected: isFirestoreConnected,
        hasCloudState: !!latestCloudState
      }
    }, null, 2));
    return;
  }

  // 1.5 GET Staff Directory & Auth Users
  if (pathname === '/api/auth/users' && req.method === 'GET') {
    const users = (latestCloudState && latestCloudState.users) ? latestCloudState.users : [
      { id: 'USR-01', name: 'Rajath', email: 'rajath@vucareservices.com', role: 'Super Admin / Owner', department: 'Executive' },
      { id: 'USR-02', name: 'Ananya Kumar', email: 'admin@vucareservices.com', role: 'Admin / Operations Manager', department: 'Operations' },
      { id: 'USR-03', name: 'Ananya', email: 'telecaller.ananya@vucareservices.com', role: 'Telecaller', department: 'Sales' },
      { id: 'USR-04', name: 'Kiran', email: 'telecaller.kiran@vucareservices.com', role: 'Telecaller', department: 'Sales' },
      { id: 'USR-05', name: 'Sneha', email: 'accounts@vucareservices.com', role: 'Accountant', department: 'Finance' },
      { id: 'USR-06', name: 'Ravi', email: 'tech.ravi@vucareservices.com', role: 'Pest Control Technician', department: 'Field Operations' },
      { id: 'USR-07', name: 'Suresh', email: 'tech.suresh@vucareservices.com', role: 'Pest Control Technician', department: 'Field Operations' },
      { id: 'USR-08', name: 'Mahesh', email: 'tech.mahesh@vucareservices.com', role: 'Cleaning Technician', department: 'Field Operations' },
      { id: 'USR-09', name: 'Deepak', email: 'tech.deepak@vucareservices.com', role: 'Cleaning Technician', department: 'Field Operations' }
    ];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ users }));
    return;
  }

  // 2. GET CRM State from Cloud
  if (pathname === '/api/crm/state' && req.method === 'GET') {
    // CRM records are protected by Firebase Authentication + Firestore rules.
    // Do not expose the full customer database through an unauthenticated API.
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Use the authenticated Firestore client.' }));
    return;
    /*
    try {
      if (latestCloudState) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(latestCloudState));
        return;
      }
      if (!firestoreDb) throw new Error('Firestore not initialized');
      const stateDocRef = doc(firestoreDb, 'vucare_crm', 'state');
      const snap = await getDoc(stateDocRef);
      if (snap.exists()) {
        latestCloudState = snap.data();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(latestCloudState));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Cloud state not seeded yet' }));
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
    */
  }

  // 3. POST Sync CRM State to Cloud
  if (pathname === '/api/crm/sync' && req.method === 'POST') {
    // Writes must go through the authenticated Firebase client, not this public
    // endpoint. This prevents anyone who discovers the URL from overwriting CRM data.
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Use the authenticated Firestore client.' }));
    return;
    /*
    try {
      const data = await readJsonBody(req);
      if (!firestoreDb) throw new Error('Firestore not initialized');
      const stateDocRef = doc(firestoreDb, 'vucare_crm', 'state');
      const payload = Object.assign({}, data, {
        updatedAt: new Date().toISOString(),
        syncedBy: 'backend-api'
      });
      await setDoc(stateDocRef, payload, { merge: true });
      latestCloudState = Object.assign({}, latestCloudState || {}, payload);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'State synced to Firestore', updatedAt: payload.updatedAt }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
    */
  }

  // 4. Inbound WhatsTool Webhook (Section 33 & 34)
  // Implements Production Architecture:
  // Normalize Phone -> Customer Match/Create -> Active Enquiry Match/Thread -> Fast <200ms ACK
  if (pathname === '/api/webhook/whatstool' && req.method === 'POST') {
    const incomingSecret = req.headers['x-vucare-webhook-secret'] || urlObj.searchParams.get('secret');
    if (webhookSecret && incomingSecret && incomingSecret !== webhookSecret) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid webhook signature.' }));
      return;
    }
    try {
      const payload = await readJsonBody(req);
      console.log('📩 [WhatsTool Webhook Received]:', JSON.stringify(payload));

      // 1. Idempotency Check (prevent duplicate webhook retries)
      const msgId = payload.messageId || payload.id || payload.msg_id || payload.sms_id;
      if (msgId && checkAndTrackMessageId(msgId)) {
        console.log(`ℹ️ [WhatsTool Webhook] Duplicate messageId ${msgId} skipped.`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, duplicate: true, message: 'Message already processed.' }));
        return;
      }

      // 2. Normalize sender info
      const rawPhone = payload.phone || payload.sender || payload.from || payload.wa_id || payload.mobile || '9876543210';
      const cleanPhone = normalizePhone(rawPhone);
      const messageText = (payload.message || payload.text || payload.body || '').trim() || 'Enquiry via WhatsApp';
      const senderName = (payload.name || payload.customerName || payload.contact_name || ('Customer ' + cleanPhone.slice(-4))).trim();

      // 3. Service detection helper
      let detectedService = '';
      if (/clean/i.test(messageText)) detectedService = 'Deep Home Cleaning';
      else if (/termite/i.test(messageText)) detectedService = 'Termite Control';
      else if (/bed ?bug/i.test(messageText)) detectedService = 'Bed Bug Control';
      else if (/cockroach|pest/i.test(messageText)) detectedService = 'Cockroach Control';

      // 4. Load current state
      let state = latestCloudState || {};
      if (firestoreDb && (!latestCloudState || !latestCloudState.leads)) {
        try {
          const stateDocRef = doc(firestoreDb, 'vucare_crm', 'state');
          const snap = await getDoc(stateDocRef);
          if (snap.exists()) state = snap.data();
        } catch (err) {
          console.warn('⚠️ [Cloud Sync] Firestore read note in webhook:', err.message);
        }
      }

      state.customers = state.customers || [];
      state.leads = state.leads || [];
      state.notifications = state.notifications || [];

      // 5. Customer Matching: Find or Create Customer
      let customer = state.customers.find(c => normalizePhone(c.phone) === cleanPhone || normalizePhone(c.whatsapp) === cleanPhone);
      let isNewCustomer = false;
      if (!customer) {
        isNewCustomer = true;
        const newCustId = 'CUST-' + String(state.customers.length + 1).padStart(3, '0');
        customer = {
          id: newCustId,
          name: senderName,
          phone: cleanPhone,
          whatsapp: cleanPhone,
          email: '',
          type: 'Residential',
          source: 'WhatsApp',
          createdAt: new Date().toISOString().split('T')[0],
          qrToken: 'VC-QR-' + Math.floor(1000 + Math.random() * 9000),
          addresses: [{
            label: 'Home',
            address: (payload.area || 'Indiranagar') + ', ' + (payload.city || 'Bangalore')
          }]
        };
        state.customers.unshift(customer);
        console.log(`👤 Created new Customer ${customer.id} (${customer.name})`);
      }

      // 6. Active Enquiry Matching: Check if an open/active lead exists for this customer
      const activeStatuses = ['New enquiry', 'Contacted', 'Requirement Collected', 'Quotation sent'];
      const activeLead = state.leads.find(l => {
        const lPhone = normalizePhone(l.phone || l.whatsapp);
        return lPhone === cleanPhone && activeStatuses.includes(l.status);
      });

      let leadResult = null;
      const nowIso = new Date().toISOString();
      const nowFormatted = new Date().toLocaleString('en-IN');

      if (activeLead) {
        // ATTACH TO EXISTING LEAD (Conversation Threading)
        activeLead.followups = activeLead.followups || [];
        activeLead.followups.push({
          by: `${senderName} (WhatsApp)`,
          at: nowFormatted,
          note: messageText
        });
        activeLead.lastMessageAt = nowIso;
        if ((!activeLead.service || activeLead.service === 'General Pest & Cleaning') && detectedService) {
          activeLead.service = detectedService;
        }
        leadResult = activeLead;
        console.log(`💬 Message appended to active Lead #${activeLead.id} for ${senderName}`);

        // Notify assigned telecaller
        state.notifications.unshift({
          title: `WhatsApp message on Lead #${activeLead.id}`,
          desc: `${senderName}: ${messageText.slice(0, 80)}`,
          time: nowFormatted,
          read: false,
          leadId: activeLead.id
        });
      } else {
        // CREATE NEW LEAD (First enquiry or previous jobs completed)
        const newLeadId = Math.max(100, ...(state.leads.map(l => l.id || 0))) + 1;
        const newLead = {
          id: newLeadId,
          customerId: customer.id,
          name: customer.name || senderName,
          phone: cleanPhone,
          whatsapp: cleanPhone,
          service: detectedService || 'General Pest & Cleaning',
          area: payload.area || customer.addresses?.[0]?.address?.split(',')?.[0]?.trim() || 'Indiranagar',
          city: payload.city || 'Bangalore',
          clientType: customer.type || 'Residential',
          source: 'WhatsApp',
          status: 'New enquiry',
          owner: 'Ananya',
          priority: 'High',
          amount: 4999,
          note: messageText,
          date: nowIso.split('T')[0],
          followups: [{
            by: `${senderName} (WhatsApp)`,
            at: nowFormatted,
            note: messageText
          }],
          photos: [],
          assignmentHistory: []
        };
        state.leads.unshift(newLead);
        leadResult = newLead;
        console.log(`🌟 Created new Lead #${newLead.id} for ${senderName}`);

        // Notify telecaller
        state.notifications.unshift({
          title: `New WhatsApp Enquiry #${newLead.id}`,
          desc: `${senderName} (${newLead.service}) via WhatsApp`,
          time: nowFormatted,
          read: false,
          leadId: newLead.id
        });
      }

      if (state.notifications.length > 50) state.notifications = state.notifications.slice(0, 50);

      // 7. Persist to Cloud Firestore in background
      if (firestoreDb) {
        const stateDocRef = doc(firestoreDb, 'vucare_crm', 'state');
        setDoc(stateDocRef, {
          customers: state.customers,
          leads: state.leads,
          notifications: state.notifications,
          updatedAt: nowIso
        }, { merge: true }).catch(err => {
          console.warn('⚠️ [Cloud Sync] Webhook Firestore persist note:', err.message);
        });
      }
      latestCloudState = state;

      // Fast ACK to WhatsTool (<200ms)
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        action: activeLead ? 'message_appended' : 'lead_created',
        customerId: customer.id,
        leadId: leadResult.id,
        customerName: customer.name,
        message: activeLead ? 'Message appended to existing active lead' : 'New lead created'
      }));
    } catch (err) {
      console.error('❌ WhatsTool Webhook Error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 5. Outbound WhatsApp Message Dispatcher (Section 33)
  // Calls WhatsTool API securely from server using private WHATSTOOL_API_KEY in .env
  if (pathname === '/api/whatsapp/send' && req.method === 'POST') {
    try {
      const payload = await readJsonBody(req);
      const { phone, message, templateName } = payload;
      if (!phone || !message) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing phone or message parameter.' }));
        return;
      }

      if (!whatsToolApiKey) {
        console.log(`📱 [WhatsApp Mock Send (No WHATSTOOL_API_KEY in .env)] To: ${phone} | Msg: ${message.slice(0, 60)}...`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          mode: 'simulated',
          note: 'WHATSTOOL_API_KEY is not set in .env. Message logged securely to server console.',
          phone,
          timestamp: new Date().toISOString()
        }));
        return;
      }

      console.log(`🚀 [WhatsTool Live Dispatch] Sending WhatsApp message to ${phone}...`);
      const apiRes = await fetch(`${whatsToolBaseUrl}/v2/send-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${whatsToolApiKey}`
        },
        body: JSON.stringify({
          phone: String(phone).replace(/[^0-9]/g, ''),
          message: message
        })
      });
      const apiData = await apiRes.json().catch(() => ({ status: apiRes.status }));
      res.writeHead(apiRes.ok ? 200 : 502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: apiRes.ok,
        provider: 'whatstool',
        response: apiData
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // ------------------------------------
  // STATIC FILE HANDLER (Frontend SPA)
  // ------------------------------------
  let safePath = path.normalize(pathname).replace(/^([.][.][\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';
  const filePath = path.join(distDir, safePath);

  if (!filePath.startsWith(distDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const indexFallback = path.join(distDir, 'index.html');
      fs.readFile(indexFallback, (err2, content) => {
        if (err2) {
          res.writeHead(404);
          res.end('Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
          res.end(content);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('==================================================');
  console.log('🚀 VU Care CRM Server running at http://localhost:' + PORT + '/');
  console.log('🔥 Firebase Real-Time Firestore Connected: ' + firebaseConfig.projectId);
  console.log('📡 Webhook URL: http://localhost:' + PORT + '/api/webhook/whatstool');
  console.log('🏥 Health Check: http://localhost:' + PORT + '/api/health');
  console.log('==================================================');
});
