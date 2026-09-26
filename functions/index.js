const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// In-memory LRU idempotency cache for recent message IDs
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

/**
 * 24/7 Permanent WhatsTool Webhook for VU Care CRM
 * Endpoint: https://crm-demo-9a7ec.web.app/api/webhook/whatstool
 *
 * Implements Production Architecture:
 * 1. Webhook Signature Check
 * 2. Idempotency Check (drops network retry duplicates)
 * 3. Customer Match / Create (multi-address support)
 * 4. Active Enquiry Match / Threading (Appends multi-line messages to same Lead)
 * 5. Telecaller notification in Firestore
 * 6. Fast <200ms ACK to WhatsTool
 */
exports.whatstoolWebhook = onRequest({ cors: true, timeoutSeconds: 30, memory: "256MiB" }, async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  // 1. Signature / Secret verification
  const configuredSecret = process.env.WHATSTOOL_WEBHOOK_SECRET || process.env.VUCARE_WEBHOOK_SECRET || "vucare_webhook_secret_2026";
  const incomingSecret = req.headers["x-vucare-webhook-secret"] || req.query.secret;
  if (configuredSecret && incomingSecret && incomingSecret !== configuredSecret) {
    return res.status(401).json({ error: "Invalid webhook signature." });
  }

  try {
    const payload = req.body || {};
    console.log("📩 [WhatsTool Webhook Received]:", JSON.stringify(payload));

    // 2. Idempotency Check
    const msgId = payload.messageId || payload.id || payload.msg_id || payload.sms_id;
    if (msgId && checkAndTrackMessageId(msgId)) {
      console.log(`ℹ️ [WhatsTool Webhook] Duplicate messageId ${msgId} skipped.`);
      return res.status(200).json({ success: true, duplicate: true, message: "Message already processed." });
    }

    // 3. Sender normalization
    const rawPhone = payload.phone || payload.sender || payload.from || payload.wa_id || payload.mobile || "9876543210";
    const cleanPhone = normalizePhone(rawPhone);
    const messageText = (payload.message || payload.text || payload.body || "").trim() || "Enquiry via WhatsApp";
    const senderName = (payload.name || payload.customerName || payload.contact_name || ("Customer " + cleanPhone.slice(-4))).trim();

    // 4. Service detection
    let detectedService = "";
    if (/clean/i.test(messageText)) detectedService = "Deep Home Cleaning";
    else if (/termite/i.test(messageText)) detectedService = "Termite Control";
    else if (/bed ?bug/i.test(messageText)) detectedService = "Bed Bug Control";
    else if (/cockroach|pest/i.test(messageText)) detectedService = "Cockroach Control";

    // 5. Read state document from Firestore
    const stateDocRef = db.collection("vucare_crm").doc("state");
    const docSnap = await stateDocRef.get();
    let state = docSnap.exists ? docSnap.data() : {};

    state.customers = state.customers || [];
    state.leads = state.leads || [];
    state.notifications = state.notifications || [];

    // 6. Customer Lookup / Auto-creation
    let customer = state.customers.find(c => normalizePhone(c.phone) === cleanPhone || normalizePhone(c.whatsapp) === cleanPhone);
    if (!customer) {
      const newCustId = "CUST-" + String(state.customers.length + 1).padStart(3, "0");
      customer = {
        id: newCustId,
        name: senderName,
        phone: cleanPhone,
        whatsapp: cleanPhone,
        email: "",
        type: "Residential",
        source: "WhatsApp",
        createdAt: new Date().toISOString().split("T")[0],
        qrToken: "VC-QR-" + Math.floor(1000 + Math.random() * 9000),
        addresses: [{
          label: "Home",
          address: (payload.area || "Indiranagar") + ", " + (payload.city || "Bangalore")
        }]
      };
      state.customers.unshift(customer);
      console.log(`👤 Created new Customer ${customer.id} (${customer.name})`);
    }

    // 7. Active Enquiry Matching (Conversation Threading)
    const activeStatuses = ["New enquiry", "Contacted", "Requirement Collected", "Quotation sent"];
    const activeLead = state.leads.find(l => {
      const lPhone = normalizePhone(l.phone || l.whatsapp);
      return lPhone === cleanPhone && activeStatuses.includes(l.status);
    });

    let leadResult = null;
    const nowIso = new Date().toISOString();
    const nowFormatted = new Date().toLocaleString("en-IN");

    if (activeLead) {
      // Thread into existing lead conversation
      activeLead.followups = activeLead.followups || [];
      activeLead.followups.push({
        by: `${senderName} (WhatsApp)`,
        at: nowFormatted,
        note: messageText
      });
      activeLead.lastMessageAt = nowIso;
      if ((!activeLead.service || activeLead.service === "General Pest & Cleaning") && detectedService) {
        activeLead.service = detectedService;
      }
      leadResult = activeLead;
      console.log(`💬 Message appended to active Lead #${activeLead.id} for ${senderName}`);

      state.notifications.unshift({
        title: `WhatsApp message on Lead #${activeLead.id}`,
        desc: `${senderName}: ${messageText.slice(0, 80)}`,
        time: nowFormatted,
        read: false,
        leadId: activeLead.id
      });
    } else {
      // Create new Lead
      const newLeadId = Math.max(100, ...(state.leads.map(l => l.id || 0))) + 1;
      const newLead = {
        id: newLeadId,
        customerId: customer.id,
        name: customer.name || senderName,
        phone: cleanPhone,
        whatsapp: cleanPhone,
        service: detectedService || "General Pest & Cleaning",
        area: payload.area || customer.addresses?.[0]?.address?.split(",")?.[0]?.trim() || "Indiranagar",
        city: payload.city || "Bangalore",
        clientType: customer.type || "Residential",
        source: "WhatsApp",
        status: "New enquiry",
        owner: "Ananya",
        priority: "High",
        amount: 4999,
        note: messageText,
        date: nowIso.split("T")[0],
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

      state.notifications.unshift({
        title: `New WhatsApp Enquiry #${newLead.id}`,
        desc: `${senderName} (${newLead.service}) via WhatsApp`,
        time: nowFormatted,
        read: false,
        leadId: newLead.id
      });
    }

    if (state.notifications.length > 50) state.notifications = state.notifications.slice(0, 50);

    // 8. Commit to Cloud Firestore
    await stateDocRef.set({
      customers: state.customers,
      leads: state.leads,
      notifications: state.notifications,
      updatedAt: nowIso
    }, { merge: true });

    // 9. Instant 200 OK ACK
    return res.status(200).json({
      success: true,
      action: activeLead ? "message_appended" : "lead_created",
      customerId: customer.id,
      leadId: leadResult.id,
      customerName: customer.name,
      message: activeLead ? "Message appended to existing active lead" : "New lead created"
    });
  } catch (err) {
    console.error("❌ WhatsTool Webhook Function Error:", err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * Outbound WhatsApp Dispatcher Function
 * Calls WhatsTool API using secret key without exposing it to the client browser
 */
exports.sendWhatsApp = onRequest({ cors: true, timeoutSeconds: 30, memory: "256MiB" }, async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { phone, message, templateName } = req.body || {};
  if (!phone || !message) {
    return res.status(400).json({ error: "Missing phone or message parameter." });
  }

  const apiKey = process.env.WHATSTOOL_API_KEY;
  const baseUrl = process.env.WHATSTOOL_BASE_URL || "https://api.whatstool.business";

  if (!apiKey) {
    console.log(`📱 [Simulated WhatsApp Send] To: ${phone} | Msg: ${message}`);
    return res.status(200).json({
      success: true,
      mode: "simulated",
      note: "Set WHATSTOOL_API_KEY in function config for live transmission."
    });
  }

  try {
    const apiRes = await fetch(`${baseUrl}/v2/send-text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        phone: String(phone).replace(/[^0-9]/g, ""),
        message: message
      })
    });
    const data = await apiRes.json().catch(() => ({ status: apiRes.status }));
    return res.status(apiRes.ok ? 200 : 502).json({
      success: apiRes.ok,
      provider: "whatstool",
      response: data
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
