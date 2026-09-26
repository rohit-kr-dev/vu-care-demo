import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const seedPath = resolve(import.meta.dirname, '..', 'database', 'seed-data.json');
const payload = JSON.parse(await readFile(seedPath, 'utf8'));
if (payload.format !== 'vucare-firestore-seed-v1') throw new Error('Unexpected seed package format.');
const required = ['leads', 'jobs', 'customers', 'services', 'technicians', 'amcs', 'quotations', 'invoices', 'inventory', 'expenses', 'vendors', 'tickets'];
for (const collection of required) {
  if (!Array.isArray(payload.collections?.[collection])) throw new Error(`Missing ${collection} collection.`);
  const ids = new Set();
  for (const record of payload.collections[collection]) { if (!record.id) throw new Error(`${collection} has a record without an id.`); if (ids.has(record.id)) throw new Error(`${collection} has duplicate id ${record.id}.`); ids.add(record.id); }
}
for (const job of payload.collections.jobs) if (!job.name || !job.date || !job.status) throw new Error(`Job ${job.id} is incomplete.`);
for (const lead of payload.collections.leads) if (!lead.name || !lead.phone || !lead.status) throw new Error(`Lead ${lead.id} is incomplete.`);
const total = Object.values(payload.collections).reduce((sum, records) => sum + records.length, 0);
console.log(`Database seed is valid: ${total} records, ${Object.keys(payload.collections).length} collections.`);
